<?php
/* ===================================================================
   ONG VISION CITOYENNE — admin/inc/db.php
   Base de données MySQL (Hostinger) : messages des formulaires du site
   (contact, bénévolat, newsletter). Ces données personnelles restent
   sur le serveur : elles ne sont jamais envoyées sur GitHub.
   Inclus par admin/api.php et api/*.php (accès web direct bloqué).
   =================================================================== */

declare(strict_types=1);

const MESSAGE_KINDS = ['contact', 'benevole', 'newsletter'];
const MESSAGES_PAGE_SIZE = 100;

function db_configured(): bool
{
    $db = raw_config()['db'] ?? null;
    return is_array($db) && !empty($db['name']) && !empty($db['user']);
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    if (!db_configured()) throw new ApiError("La base de données n'est pas encore configurée.", 503);

    $cfg = raw_config()['db'];
    try {
        $pdo = new PDO(
            'mysql:host=' . ($cfg['host'] ?? 'localhost') . ';dbname=' . $cfg['name'] . ';charset=utf8mb4',
            $cfg['user'],
            (string) ($cfg['pass'] ?? ''),
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    } catch (PDOException $e) {
        error_log('[vc-db] connexion : ' . $e->getMessage());
        throw new ApiError('La base de données ne répond pas.', 503);
    }
    ensure_schema($pdo);
    return $pdo;
}

// Création automatique de la table au premier usage
function ensure_schema(PDO $pdo): void
{
    $pdo->exec("CREATE TABLE IF NOT EXISTS vc_messages (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        kind ENUM('contact','benevole','newsletter') NOT NULL,
        name VARCHAR(100) NOT NULL DEFAULT '',
        email VARCHAR(254) NOT NULL,
        phone VARCHAR(30) NOT NULL DEFAULT '',
        message TEXT NOT NULL,
        lang CHAR(2) NOT NULL DEFAULT 'fr',
        ip_hash CHAR(64) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        read_at DATETIME NULL,
        INDEX idx_kind_date (kind, created_at),
        INDEX idx_ip_date (ip_hash, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
}

// Adresse IP jamais stockée en clair : empreinte non réversible
function ip_hash(): string
{
    $secret = (string) (raw_config()['db']['pass'] ?? 'vc');
    return hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown', $secret);
}

function recent_messages_from_ip(string $ipHash, int $seconds): int
{
    $stmt = db()->prepare('SELECT COUNT(*) FROM vc_messages WHERE ip_hash = ? AND created_at > (NOW() - INTERVAL ? SECOND)');
    $stmt->execute([$ipHash, $seconds]);
    return (int) $stmt->fetchColumn();
}

function newsletter_exists(string $email): bool
{
    $stmt = db()->prepare("SELECT 1 FROM vc_messages WHERE kind = 'newsletter' AND email = ? LIMIT 1");
    $stmt->execute([$email]);
    return (bool) $stmt->fetchColumn();
}

function message_insert(array $m): int
{
    $stmt = db()->prepare('INSERT INTO vc_messages (kind, name, email, phone, message, lang, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$m['kind'], $m['name'], $m['email'], $m['phone'], $m['message'], $m['lang'], $m['ip_hash']]);
    return (int) db()->lastInsertId();
}

function messages_list(?string $kind, int $page): array
{
    $where = $kind !== null ? 'WHERE kind = ?' : '';
    $params = $kind !== null ? [$kind] : [];
    $offset = max(0, $page) * MESSAGES_PAGE_SIZE;
    $stmt = db()->prepare("SELECT id, kind, name, email, phone, message, lang, created_at, read_at
        FROM vc_messages $where ORDER BY created_at DESC, id DESC LIMIT " . MESSAGES_PAGE_SIZE . " OFFSET $offset");
    $stmt->execute($params);
    return $stmt->fetchAll();
}

function messages_counts(): array
{
    $rows = db()->query('SELECT kind, COUNT(*) AS total, SUM(read_at IS NULL) AS unread FROM vc_messages GROUP BY kind')->fetchAll();
    $out = [];
    foreach (MESSAGE_KINDS as $k) $out[$k] = ['total' => 0, 'unread' => 0];
    foreach ($rows as $r) $out[$r['kind']] = ['total' => (int) $r['total'], 'unread' => (int) $r['unread']];
    return $out;
}

function message_set_read(int $id, bool $read): void
{
    $stmt = db()->prepare('UPDATE vc_messages SET read_at = ' . ($read ? 'NOW()' : 'NULL') . ' WHERE id = ?');
    $stmt->execute([$id]);
}

function message_delete(int $id): void
{
    db()->prepare('DELETE FROM vc_messages WHERE id = ?')->execute([$id]);
}
