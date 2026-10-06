<?php
/* ===================================================================
   ONG VISION CITOYENNE — admin/inc/content.php
   GitHub et fichiers de contenu (js/news.js, js/galerie.js, js/partners.js).
   Inclus par admin/api.php et api/*.php (accès web direct bloqué).
   =================================================================== */

declare(strict_types=1);

const DATA_FILES = [
    'news' => 'js/news.js',
    'gallery' => 'js/galerie.js',
    'partners' => 'js/partners.js',
];
const NEWS_CATS = ['annonce', 'evenement', 'don', 'chantier', 'projet', 'sensibilisation'];
const GALLERY_CATS = ['avant', 'travaux', 'apres', 'ceremonie', 'don', 'sensibilisation', 'terrain',
    'pasea-mob', 'pasea-form', 'pasea-lancement', 'pasea-chantier'];
const PARTNER_TAGS = ['int', 'gov', 'dip', 'ngo', 'env', 'hum', 'coop'];

/* ---------------------------------------------------------------
   GitHub
   --------------------------------------------------------------- */
function github(string $method, string $path, ?array $body = null): array
{
    $cfg = require_config();
    $ch = curl_init('https://api.github.com/repos/' . $cfg['repo'] . $path);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 60,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $cfg['github_token'],
            'Accept: application/vnd.github+json',
            'X-GitHub-Api-Version: 2022-11-28',
            'User-Agent: ongvici-admin',
            'Content-Type: application/json',
        ],
    ]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_SLASHES));
    $res = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if ($res === false || $status >= 400) {
        error_log("[vc-admin] GitHub $method $path -> $status $err " . substr((string) $res, 0, 300));
        if ($status === 401 || $status === 403) {
            throw new ApiError("La clé d'accès GitHub est refusée (expirée ou sans droits). Elle doit être renouvelée.", 502);
        }
        throw new ApiError('GitHub ne répond pas correctement. Réessayez dans quelques minutes.', 502);
    }
    return json_decode($res, true) ?: [];
}

function branch(): string
{
    return (string) (require_config()['branch'] ?? 'main');
}

function head_sha(): string
{
    return github('GET', '/git/ref/heads/' . branch())['object']['sha'];
}

function read_repo_file(string $path, string $ref): string
{
    $file = github('GET', '/contents/' . $path . '?ref=' . rawurlencode($ref));
    return base64_decode($file['content'] ?? '', false) ?: '';
}

// Commit de plusieurs fichiers d'un coup ; échoue si le site a changé depuis $base
function commit_files(string $base, array $files, string $message): string
{
    $head = head_sha();
    if ($head !== $base) {
        throw new ApiError("Le site a été modifié entre-temps (depuis un autre appareil ?). Rechargez la page : vos modifications non publiées seront perdues.", 409);
    }
    $baseTree = github('GET', '/git/commits/' . $head)['tree']['sha'];

    $tree = [];
    foreach ($files as $path => $content) {
        $blob = github('POST', '/git/blobs', ['content' => base64_encode($content), 'encoding' => 'base64']);
        $tree[] = ['path' => $path, 'mode' => '100644', 'type' => 'blob', 'sha' => $blob['sha']];
    }
    $newTree = github('POST', '/git/trees', ['base_tree' => $baseTree, 'tree' => $tree]);
    $commit = github('POST', '/git/commits', [
        'message' => $message,
        'tree' => $newTree['sha'],
        'parents' => [$head],
        'author' => ['name' => 'Espace admin ongvici.org', 'email' => 'admin@ongvici.org'],
    ]);
    github('PATCH', '/git/refs/heads/' . branch(), ['sha' => $commit['sha'], 'force' => false]);
    return $commit['sha'];
}

/* ---------------------------------------------------------------
   Lecture et écriture des fichiers de données (js/*.js)
   Format : en-tête commentaire, puis « const NOM = <JSON>; »
   --------------------------------------------------------------- */
function parse_consts(string $js, string $path): array
{
    preg_match_all('/^const ([A-Z_]+) = (.*?);\s*$(?=\s*(?:^const |\z))/ms', $js, $m, PREG_SET_ORDER);
    $out = [];
    foreach ($m as [, $name, $json]) {
        $value = json_decode($json, true);
        if (!is_array($value)) {
            throw new ApiError("Le fichier $path a été modifié à la main dans un format que l'admin ne sait pas lire.", 500);
        }
        $out[$name] = $value;
    }
    return $out;
}

function json_block(array $value): string
{
    return json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function file_header(string $title, array $help): string
{
    $lines = array_map(fn ($l) => "   $l\n", $help);
    return "/* ================================================================\n   $title\n" .
        "   Fichier mis à jour par l'espace admin : https://ongvici.org/admin/\n" .
        implode('', $lines) .
        "   ================================================================ */\n\n";
}

function build_news(array $news): string
{
    return file_header('ACTUALITÉS DU SITE', ["La plus récente en premier ; l'accueil affiche les 4 premières."]) .
        'const NEWS = ' . json_block($news) . ";\n";
}

function build_gallery(array $rows): string
{
    $lines = array_map(fn ($r) => '    ' . json_encode($r, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $rows);
    return file_header('GALERIE PHOTOS', ['Chaque photo : [fichier, légende, catégorie]. Le fichier est relatif', 'au dossier assets/img/galerie/.']) .
        "const GALERIE = [\n" . implode(",\n", $lines) . "\n];\n";
}

function build_partners(array $partners, array $testimonials): string
{
    return file_header('PARTENAIRES ET TÉMOIGNAGES', ['Affichés sur la page partenaires.html.']) .
        'const PARTNERS = ' . json_block($partners) . ";\n\nconst TESTIMONIALS = " . json_block($testimonials) . ";\n";
}

/* ---------------------------------------------------------------
   Validation du contenu envoyé
   --------------------------------------------------------------- */
// Traductions : français obligatoire, anglais facultatif (omis s'il est vide)
function translated(mixed $item, array $fields, string $label): array
{
    $out = [];
    foreach (['fr', 'en'] as $lng) {
        $src = is_array($item[$lng] ?? null) ? $item[$lng] : [];
        $isFr = $lng === 'fr';
        $row = [];
        foreach ($fields as $key => [$max, $required]) {
            if ($key === 'body') {
                $paras = array_values(array_filter(array_map(
                    fn ($p) => text($p, $max, "$label (paragraphe)", false),
                    list_of($src['body'] ?? [], 12, "$label (paragraphes)")
                )));
                $row['body'] = $paras;
                continue;
            }
            $row[$key] = text($src[$key] ?? '', $max, "$label ($key, $lng)", $isFr && $required);
        }
        $first = array_key_first($fields);
        if ($isFr || $row[$first] !== '') $out[$lng] = $row;
    }
    return $out;
}

const IMG_PATH = '#^assets/img/[a-z0-9/_-]+\.(jpe?g|png|webp)$#';

function clean_news(mixed $list): array
{
    return array_map(function ($n) {
        if (!is_array($n)) throw new ApiError('Actualité invalide.');
        return [
            'date' => pattern($n['date'] ?? '', '/^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/', "date de l'actualité"),
            'cat' => choice($n['cat'] ?? '', NEWS_CATS, "catégorie de l'actualité"),
            'image' => pattern($n['image'] ?? '', IMG_PATH, "photo de l'actualité"),
            'link' => pattern($n['link'] ?? '', '#^([a-z0-9_-]+\.html(\#[a-z0-9_-]+)?|https://[^\s"<>]+)$#i', "lien de l'actualité"),
        ] + translated($n, [
            'title' => [160, true], 'excerpt' => [500, true], 'body' => [3000, false], 'cta' => [80, true],
        ], 'actualité');
    }, list_of($list, 200, 'actualités'));
}

function clean_gallery(mixed $list): array
{
    return array_map(function ($g) {
        $g = list_of($g, 3, 'photo de la galerie');
        return [
            pattern($g[0] ?? '', '#^(\.\./projets/[a-z0-9_-]+/)?[a-z0-9_.-]+\.(jpe?g|png|webp)$#', 'fichier de la photo'),
            text($g[1] ?? '', 300, 'légende de la photo'),
            choice($g[2] ?? '', GALLERY_CATS, 'catégorie de la photo'),
        ];
    }, list_of($list, 1000, 'galerie'));
}

function clean_partners(mixed $list): array
{
    return array_map(function ($p) {
        if (!is_array($p)) throw new ApiError('Partenaire invalide.');
        return [
            'logo' => pattern($p['logo'] ?? '', '#^assets/partenaires/[a-z0-9_.-]+\.(jpe?g|png|webp|svg)$#', 'logo du partenaire'),
            'tag' => choice($p['tag'] ?? '', PARTNER_TAGS, 'type de partenaire'),
        ] + translated($p, ['name' => [160, true], 'desc' => [600, true]], 'partenaire');
    }, list_of($list, 100, 'partenaires'));
}

function clean_testimonials(mixed $list): array
{
    return array_map(function ($t) {
        if (!is_array($t)) throw new ApiError('Témoignage invalide.');
        return [
            'initials' => text($t['initials'] ?? '', 3, 'initiales'),
        ] + translated($t, ['quote' => [500, true], 'name' => [80, true], 'role' => [120, false]], 'témoignage');
    }, list_of($list, 50, 'témoignages'));
}

// Photos envoyées : déjà redimensionnées et nettoyées (EXIF) par le navigateur
function clean_images(mixed $list): array
{
    $files = [];
    foreach (list_of($list ?? [], MAX_IMAGES_PER_PUBLISH, 'photos') as $img) {
        $path = pattern($img['path'] ?? '', '#^assets/(img/actualites|img/galerie|partenaires)/[a-z0-9_-]+\.(jpg|png|webp)$#', 'nom de la photo');
        $bin = base64_decode((string) ($img['data'] ?? ''), true);
        if ($bin === false || strlen($bin) > MAX_IMAGE_BYTES) throw new ApiError('Photo trop lourde ou illisible.');
        $info = @getimagesizefromstring($bin);
        $expected = ['jpg' => IMAGETYPE_JPEG, 'png' => IMAGETYPE_PNG, 'webp' => IMAGETYPE_WEBP][pathinfo($path, PATHINFO_EXTENSION)];
        if (!$info || $info[2] !== $expected) throw new ApiError("Le fichier envoyé pour $path n'est pas une image valide.");
        $files[$path] = $bin;
    }
    return $files;
}
