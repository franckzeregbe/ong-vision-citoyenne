<?php
/* ===================================================================
   ONG VISION CITOYENNE — api/contact.php
   Reçoit les formulaires du site (contact, bénévolat, newsletter) et
   les enregistre dans la base MySQL. Les messages se lisent dans
   l'espace admin, onglet « Messages ».
   Si ce script ne répond pas (copie GitHub, base indisponible), le
   site propose automatiquement l'envoi par e-mail (js/main.js).
   =================================================================== */

declare(strict_types=1);

require __DIR__ . '/../admin/inc/common.php';
require __DIR__ . '/../admin/inc/db.php';

const MAX_SUBMISSIONS_PER_HOUR = 5;
const PHONE_PATTERN = '/^[0-9+ ().\-]{0,30}$/';

function clean_submission(array $body): array
{
    $kind = choice($body['kind'] ?? '', MESSAGE_KINDS, 'formulaire');
    $isNewsletter = $kind === 'newsletter';
    $email = text($body['email'] ?? '', 254, 'adresse e-mail');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) throw new ApiError('Adresse e-mail invalide.');
    $phone = text($body['phone'] ?? '', 30, 'téléphone', false);
    if (!preg_match(PHONE_PATTERN, $phone)) throw new ApiError('Numéro de téléphone invalide.');

    return [
        'kind' => $kind,
        'name' => text($body['name'] ?? '', 100, 'nom', !$isNewsletter),
        'email' => mb_strtolower($email),
        'phone' => $phone,
        'message' => text($body['message'] ?? '', 2000, 'message', !$isNewsletter),
        'lang' => ($body['lang'] ?? '') === 'en' ? 'en' : 'fr',
        'ip_hash' => ip_hash(),
    ];
}

// Alerte e-mail facultative (clé 'notify_email' dans admin-config.php)
function notify(array $m): void
{
    $to = (string) (raw_config()['notify_email'] ?? '');
    if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) return;
    $labels = ['contact' => 'Nouveau message de contact', 'benevole' => 'Nouvelle candidature bénévole', 'newsletter' => 'Nouvelle inscription newsletter'];
    $host = preg_replace('/[^a-z0-9.\-]/i', '', $_SERVER['HTTP_HOST'] ?? 'ongvici.org');
    $body = $labels[$m['kind']] . " sur le site.\n\n" .
        'Nom : ' . $m['name'] . "\nE-mail : " . $m['email'] . "\nTéléphone : " . $m['phone'] . "\n\n" . $m['message'] .
        "\n\n— Tous les messages : https://$host/admin/";
    $headers = [
        'From' => "Site Vision Citoyenne <no-reply@$host>",
        'Reply-To' => $m['email'], // validé par FILTER_VALIDATE_EMAIL : pas de retour à la ligne possible
        'Content-Type' => 'text/plain; charset=UTF-8',
    ];
    if (!@mail($to, mb_encode_mimeheader($labels[$m['kind']], 'UTF-8'), $body, $headers)) {
        error_log('[vc-contact] envoi de l’alerte e-mail impossible');
    }
}

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') throw new ApiError('Méthode non autorisée.', 405);
    require_same_origin('vc-site');
    $body = read_body();

    // Champ piège invisible : rempli seulement par les robots
    if (!empty($body['website'])) respond([]);

    $m = clean_submission($body);
    if (recent_messages_from_ip($m['ip_hash'], 3600) >= MAX_SUBMISSIONS_PER_HOUR) {
        throw new ApiError('Trop de messages envoyés. Réessayez dans une heure.', 429);
    }
    if ($m['kind'] === 'newsletter' && newsletter_exists($m['email'])) respond([]);

    message_insert($m);
    notify($m);
    respond([]);
} catch (ApiError $e) {
    respond(['error' => $e->getMessage()], $e->status);
} catch (Throwable $e) {
    error_log('[vc-contact] ' . $e);
    respond(['error' => 'Erreur inattendue sur le serveur.'], 500);
}
