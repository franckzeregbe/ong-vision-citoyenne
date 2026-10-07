<?php
/* ===================================================================
   ONG VISION CITOYENNE — admin/inc/common.php
   Réponses JSON, configuration privée et validation de base.
   Inclus par admin/api.php et api/*.php (accès web direct bloqué).
   =================================================================== */

declare(strict_types=1);

const PRIVATE_DIR = __DIR__ . '/../../..';
const CONFIG_FILE = PRIVATE_DIR . '/admin-config.php';
// Racine web du site (public_html) : l'admin y lit et écrit le contenu
const PUBLIC_DIR = __DIR__ . '/../..';

/* ---------------------------------------------------------------
   Réponses
   --------------------------------------------------------------- */
final class ApiError extends Exception
{
    public function __construct(string $message, public readonly int $status = 400)
    {
        parent::__construct($message);
    }
}

function respond(array $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode(['ok' => $status < 400] + $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/* ---------------------------------------------------------------
   Configuration (fichier privé, hors de public_html)
   --------------------------------------------------------------- */
function raw_config(): array
{
    static $cfg = null;
    if ($cfg === null) {
        $loaded = is_file(CONFIG_FILE) ? (include CONFIG_FILE) : [];
        $cfg = is_array($loaded) ? $loaded : [];
    }
    return $cfg;
}

// L'espace admin est configuré dès qu'il a un mot de passe, une base de
// données, ou un accès GitHub. Le contenu est géré en local (public_html) ;
// GitHub n'est qu'une sauvegarde facultative.
function config(): ?array
{
    $cfg = raw_config();
    $ready = !empty($cfg['admin_password']) || !empty($cfg['db']) || github_enabled();
    return $ready ? $cfg : null;
}

// Sauvegarde GitHub active uniquement si un jeton et un dépôt sont fournis
function github_enabled(): bool
{
    $cfg = raw_config();
    return !empty($cfg['github_token']) && !empty($cfg['repo']);
}

function require_config(): array
{
    $cfg = config();
    if ($cfg === null) throw new ApiError("L'espace admin n'est pas encore configuré sur le serveur (fichier admin-config.php).", 503);
    return $cfg;
}

// Protection CSRF : les requêtes POST doivent venir des pages du site
// (en-tête X-Requested-With posé par notre JavaScript, origine identique)
function require_same_origin(string $marker = 'vc-admin'): void
{
    if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== $marker) throw new ApiError('Requête refusée.', 403);
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    // Origin = « https://hôte[:port] », à comparer à Host = « hôte[:port] »
    if ($origin !== '' && preg_replace('#^https?://#i', '', $origin) !== ($_SERVER['HTTP_HOST'] ?? '')) {
        throw new ApiError('Requête refusée.', 403);
    }
}

function read_body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) throw new ApiError('Données reçues illisibles.');
    return $data;
}

/* ---------------------------------------------------------------
   Validation de base
   --------------------------------------------------------------- */
function text(mixed $v, int $max, string $label, bool $required = true): string
{
    $s = is_string($v) ? trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '') : '';
    if ($required && $s === '') throw new ApiError("Champ obligatoire manquant : $label.");
    if (mb_strlen($s) > $max) throw new ApiError("$label est trop long ($max caractères maximum).");
    return $s;
}

function choice(mixed $v, array $allowed, string $label): string
{
    if (!is_string($v) || !in_array($v, $allowed, true)) throw new ApiError("Valeur invalide : $label.");
    return $v;
}

function pattern(mixed $v, string $regex, string $label): string
{
    if (!is_string($v) || !preg_match($regex, $v)) {
        throw new ApiError("Valeur invalide : $label.");
    }
    return $v;
}

function list_of(mixed $v, int $max, string $label): array
{
    if (!is_array($v) || !array_is_list($v)) throw new ApiError("Liste invalide : $label.");
    if (count($v) > $max) throw new ApiError("Trop d'éléments : $label.");
    return $v;
}
