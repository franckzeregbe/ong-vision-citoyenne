<?php
/* ===================================================================
   ONG VISION CITOYENNE — admin/api.php
   API de l'espace admin (hébergement Hostinger, PHP 8).

   Les modifications sont publiées en un commit sur GitHub ; Hostinger
   met ensuite le site à jour (déploiement Git automatique). GitHub
   reste ainsi la copie complète du site.

   Les secrets ne sont PAS dans ce dépôt : ils sont dans
   ../../admin-config.php, à côté du dossier public_html :
     voir le modèle dans admin/LISEZMOI.md (clé GitHub, mot de passe
     initial, accès à la base de données MySQL).
   =================================================================== */

declare(strict_types=1);

require __DIR__ . '/inc/common.php';
require __DIR__ . '/inc/content.php';
require __DIR__ . '/inc/db.php';

const PASSWORD_FILE = PRIVATE_DIR . '/admin-password.php';
const RATE_FILE = PRIVATE_DIR . '/admin-ratelimit.json';

const MAX_LOGIN_FAILURES = 5;
const LOCKOUT_SECONDS = 900;
const SESSION_IDLE_SECONDS = 7200;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_IMAGES_PER_PUBLISH = 25;
const MIN_PASSWORD_LENGTH = 10;

/* ---------------------------------------------------------------
   Session
   --------------------------------------------------------------- */
function start_session(): void
{
    session_name('vcadmin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/admin/',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
    $last = $_SESSION['last'] ?? 0;
    if (!empty($_SESSION['auth']) && time() - $last > SESSION_IDLE_SECONDS) {
        $_SESSION = [];
    }
    $_SESSION['last'] = time();
}

function is_logged(): bool
{
    return !empty($_SESSION['auth']);
}

function require_login(): void
{
    if (!is_logged()) throw new ApiError('Session expirée : reconnectez-vous.', 401);
}


/* ---------------------------------------------------------------
   Mot de passe et limitation des essais
   --------------------------------------------------------------- */
function stored_hash(): ?string
{
    if (!is_file(PASSWORD_FILE)) return null;
    $data = include PASSWORD_FILE;
    return is_array($data) && !empty($data['hash']) ? (string) $data['hash'] : null;
}

function check_password(string $password): bool
{
    $hash = stored_hash();
    if ($hash !== null) return password_verify($password, $hash);
    $initial = (string) (require_config()['admin_password'] ?? '');
    return $initial !== '' && hash_equals($initial, $password);
}

function save_password(string $password): void
{
    $content = "<?php\n// Généré par l'espace admin — ne pas publier.\nreturn " .
        var_export(['hash' => password_hash($password, PASSWORD_DEFAULT)], true) . ";\n";
    if (file_put_contents(PASSWORD_FILE, $content, LOCK_EX) === false) {
        throw new ApiError("Impossible d'enregistrer le mot de passe sur le serveur.", 500);
    }
}

function with_rate_file(callable $fn): mixed
{
    $fp = fopen(RATE_FILE, 'c+');
    if ($fp === false) return $fn([], fn () => null);
    flock($fp, LOCK_EX);
    $data = json_decode(stream_get_contents($fp) ?: '[]', true) ?: [];
    $save = function (array $next) use ($fp): void {
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($next));
    };
    try {
        return $fn($data, $save);
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }
}

function client_key(): string
{
    return hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

function assert_not_locked(): void
{
    with_rate_file(function (array $data): void {
        $entry = $data[client_key()] ?? null;
        if ($entry && $entry['n'] >= MAX_LOGIN_FAILURES && time() - $entry['t'] < LOCKOUT_SECONDS) {
            throw new ApiError('Trop de tentatives. Réessayez dans 15 minutes.', 429);
        }
    });
}

function record_attempt(bool $success): void
{
    with_rate_file(function (array $data, callable $save) use ($success): void {
        $now = time();
        // Nettoyage des entrées expirées
        $data = array_filter($data, fn ($e) => $now - $e['t'] < LOCKOUT_SECONDS);
        $key = client_key();
        if ($success) {
            unset($data[$key]);
        } else {
            $data[$key] = ['n' => ($data[$key]['n'] ?? 0) + 1, 't' => $now];
        }
        $save($data);
    });
}

/* ---------------------------------------------------------------
   Actions
   --------------------------------------------------------------- */
function action_status(): never
{
    respond(['data' => ['configured' => config() !== null, 'database' => db_configured(), 'logged' => is_logged()]]);
}

function action_login(): never
{
    require_same_origin();
    require_config();
    assert_not_locked();
    $password = (string) (read_body()['password'] ?? '');
    $ok = $password !== '' && check_password($password);
    record_attempt($ok);
    if (!$ok) throw new ApiError('Mot de passe incorrect.', 401);
    session_regenerate_id(true);
    $_SESSION['auth'] = true;
    respond(['data' => ['mustChange' => stored_hash() === null]]);
}

function action_logout(): never
{
    require_same_origin();
    $_SESSION = [];
    session_destroy();
    respond([]);
}

function action_load(): never
{
    require_login();
    $sha = head_sha();
    $news = parse_consts(read_repo_file(DATA_FILES['news'], $sha), DATA_FILES['news']);
    $gallery = parse_consts(read_repo_file(DATA_FILES['gallery'], $sha), DATA_FILES['gallery']);
    $partners = parse_consts(read_repo_file(DATA_FILES['partners'], $sha), DATA_FILES['partners']);
    respond(['data' => [
        'base' => $sha,
        'news' => $news['NEWS'] ?? [],
        'gallery' => $gallery['GALERIE'] ?? [],
        'partners' => $partners['PARTNERS'] ?? [],
        'testimonials' => $partners['TESTIMONIALS'] ?? [],
    ]]);
}

function action_publish(): never
{
    require_same_origin();
    require_login();
    $body = read_body();
    $base = pattern($body['base'] ?? '', '/^[0-9a-f]{40}$/', 'version du site');

    $files = clean_images($body['images'] ?? []);
    if (array_key_exists('news', $body)) $files[DATA_FILES['news']] = build_news(clean_news($body['news']));
    if (array_key_exists('gallery', $body)) $files[DATA_FILES['gallery']] = build_gallery(clean_gallery($body['gallery']));
    if (array_key_exists('partners', $body) || array_key_exists('testimonials', $body)) {
        $files[DATA_FILES['partners']] = build_partners(
            clean_partners($body['partners'] ?? []),
            clean_testimonials($body['testimonials'] ?? [])
        );
    }
    if (!$files) throw new ApiError('Aucune modification à publier.');

    $summary = text($body['summary'] ?? 'mise à jour du contenu', 200, 'résumé', false) ?: 'mise à jour du contenu';
    $sha = commit_files($base, $files, "contenu: $summary\n\nPublié depuis l'espace admin (ongvici.org/admin).");
    respond(['data' => ['base' => $sha]]);
}

function action_password(): never
{
    require_same_origin();
    require_login();
    $body = read_body();
    if (!check_password((string) ($body['current'] ?? ''))) throw new ApiError('Mot de passe actuel incorrect.', 403);
    $next = (string) ($body['next'] ?? '');
    if (mb_strlen($next) < MIN_PASSWORD_LENGTH) {
        throw new ApiError('Le nouveau mot de passe doit faire au moins ' . MIN_PASSWORD_LENGTH . ' caractères.');
    }
    save_password($next);
    respond([]);
}

function action_messages(): never
{
    require_login();
    $kind = $_GET['kind'] ?? '';
    $kind = $kind === '' ? null : choice($kind, MESSAGE_KINDS, 'type de message');
    respond(['data' => [
        'messages' => messages_list($kind, (int) ($_GET['page'] ?? 0)),
        'counts' => messages_counts(),
        'pageSize' => MESSAGES_PAGE_SIZE,
    ]]);
}

function message_id(array $body): int
{
    $id = $body['id'] ?? null;
    if (!is_int($id) || $id < 1) throw new ApiError('Message introuvable.');
    return $id;
}

function action_message_read(): never
{
    require_same_origin();
    require_login();
    $body = read_body();
    message_set_read(message_id($body), !empty($body['read']));
    respond([]);
}

function action_message_delete(): never
{
    require_same_origin();
    require_login();
    message_delete(message_id(read_body()));
    respond([]);
}

/* ---------------------------------------------------------------
   Routage
   --------------------------------------------------------------- */
try {
    start_session();
    $action = (string) ($_GET['action'] ?? '');
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $routes = [
        'GET' => ['status' => 'action_status', 'load' => 'action_load', 'messages' => 'action_messages'],
        'POST' => ['login' => 'action_login', 'logout' => 'action_logout', 'publish' => 'action_publish', 'password' => 'action_password',
            'message_read' => 'action_message_read', 'message_delete' => 'action_message_delete'],
    ];
    $handler = $routes[$method][$action] ?? null;
    if ($handler === null) throw new ApiError('Action inconnue.', 404);
    $handler();
} catch (ApiError $e) {
    respond(['error' => $e->getMessage()], $e->status);
} catch (Throwable $e) {
    error_log('[vc-admin] ' . $e);
    respond(['error' => 'Erreur inattendue sur le serveur.'], 500);
}
