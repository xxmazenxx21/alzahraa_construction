<?php
declare(strict_types=1);

// Both language pages post here. Recipient is fixed, never supplied by a visitor.
const CAREERS_RECIPIENT = 'info@alzahraa.construction';
const CAREERS_MAX_CV_BYTES = 5 * 1024 * 1024;
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method !== 'POST' && !($method === 'GET' && ($_GET['token'] ?? '') === '1')) {
    header('Allow: GET, POST');
    respond(405, ['ok' => false, 'code' => 'method']);
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > CAREERS_MAX_CV_BYTES + 1024 * 1024) {
    respond(413, ['ok' => false, 'code' => 'cv_size']);
}

session_set_cookie_params([
    'httponly' => true, 'samesite' => 'Strict',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'path' => '/pages/en/careers/',
]);
if (!session_start()) respond(503, ['ok' => false, 'code' => 'unavailable']);
if (empty($_SESSION['careers_csrf'])) $_SESSION['careers_csrf'] = bin2hex(random_bytes(32));
$csrf = $_SESSION['careers_csrf'];
session_write_close();
if ($method === 'GET') respond(200, ['ok' => true, 'token' => $csrf]);

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $originPort = parse_url($origin, PHP_URL_PORT);
    $authority = strtolower((string) $originHost . ($originPort ? ':' . $originPort : ''));
    if ($authority !== strtolower($_SERVER['HTTP_HOST'] ?? '')) {
        respond(403, ['ok' => false, 'code' => 'session']);
    }
}
if (!is_string($_POST['csrfToken'] ?? null) || !hash_equals($csrf, $_POST['csrfToken'])) {
    respond(403, ['ok' => false, 'code' => 'session']);
}
if (!empty($_POST['website'])) respond(422, ['ok' => false, 'code' => 'validation']);

$errors = [];
$values = [];
$limits = ['fullName' => 150, 'email' => 254, 'phone' => 40, 'position' => 150,
    'experience' => 20, 'location' => 200, 'linkedin' => 500, 'message' => 5000];
foreach ($limits as $field => $maxLength) {
    $raw = $_POST[$field] ?? '';
    if (!is_string($raw) || preg_match('//u', $raw) !== 1 || strlen($raw) > $maxLength * 4) {
        $errors[$field] = 'invalid'; $values[$field] = ''; continue;
    }
    $values[$field] = trim(str_replace("\0", '', $raw));
    if (mb_strlen($values[$field], 'UTF-8') > $maxLength) $errors[$field] = 'length';
}
foreach (['fullName', 'email', 'phone', 'position'] as $field) {
    if ($values[$field] === '') $errors[$field] = 'required';
}
if (!filter_var($values['email'], FILTER_VALIDATE_EMAIL)
    || preg_match('/[\r\n]/', $values['email'])) $errors['email'] = 'email';
if (!preg_match('/^\+?[0-9\s().-]{7,40}$/', $values['phone'])) $errors['phone'] = 'phone';
$positions = ['General Application', 'Site Engineer — Roads', 'Surveyor', 'Document Controller',
    'Civil / Roads & Bridges Engineer', 'HSE Officer', 'Other',
    'تقديم عام', 'مهندس موقع — طرق', 'مساح', 'ضابط مستندات',
    'مهندس مدني / طرق وكباري', 'مسؤول سلامة', 'أخرى'];
if (!in_array($values['position'], $positions, true)) $errors['position'] = 'invalid';
if (!in_array($values['experience'], ['', '0-1', '2-4', '5-9', '10+'], true)) $errors['experience'] = 'invalid';
if ($values['linkedin'] !== '' && (!filter_var($values['linkedin'], FILTER_VALIDATE_URL)
    || !in_array(strtolower((string) parse_url($values['linkedin'], PHP_URL_SCHEME)), ['http', 'https'], true))) {
    $errors['linkedin'] = 'url';
}
if (($_POST['consent'] ?? '') !== 'on') $errors['consent'] = 'consent';

$file = $_FILES['cv'] ?? null;
$mime = ''; $extension = ''; $filename = ''; $filePath = '';
if (!is_array($file) || !is_int($file['error'] ?? null)) {
    $errors['cv'] = 'required';
} elseif ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE) {
    $errors['cv'] = 'cv_size';
} elseif ($file['error'] !== UPLOAD_ERR_OK) {
    $errors['cv'] = 'required';
} elseif (!is_string($file['tmp_name'] ?? null) || !is_string($file['name'] ?? null)
    || !is_uploaded_file($file['tmp_name'])) {
    $errors['cv'] = 'cv_type';
} else {
    $filePath = $file['tmp_name'];
    $size = filesize($filePath);
    $filename = basename(str_replace('\\', '/', $file['name']));
    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    if ($size === false || $size === 0 || $size > CAREERS_MAX_CV_BYTES) $errors['cv'] = 'cv_size';
    if (!class_exists('finfo')) respond(503, ['ok' => false, 'code' => 'unavailable']);
    $detected = (new finfo(FILEINFO_MIME_TYPE))->file($filePath);
    $prefix = file_get_contents($filePath, false, null, 0, 8);
    if ($extension === 'pdf' && $detected === 'application/pdf' && str_starts_with((string) $prefix, '%PDF-')) {
        $mime = 'application/pdf';
    } elseif ($extension === 'doc' && $prefix === "\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1"
        && in_array($detected, ['application/msword', 'application/x-ole-storage', 'application/CDFV2', 'application/octet-stream'], true)) {
        $mime = 'application/msword';
    } elseif ($extension === 'docx' && class_exists('ZipArchive')) {
        $zip = new ZipArchive();
        if ($zip->open($filePath) === true) {
            if ($zip->locateName('[Content_Types].xml') !== false && $zip->locateName('word/document.xml') !== false
                && $zip->locateName('word/vbaProject.bin') === false) {
                $mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            }
            $zip->close();
        }
    }
    if ($mime === '' && !isset($errors['cv'])) $errors['cv'] = 'cv_type';
}
if ($errors !== []) respond(422, ['ok' => false, 'code' => 'validation', 'errors' => $errors]);

// Atomic per-address throttle; stores timestamps only, outside the web root.
$ratePath = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'alzahraa-careers-' . hash('sha256', __DIR__ . ($_SERVER['REMOTE_ADDR'] ?? 'unknown')) . '.json';
$rateFile = @fopen($ratePath, 'c+');
if (!$rateFile || !flock($rateFile, LOCK_EX)) respond(503, ['ok' => false, 'code' => 'unavailable']);
$now = time();
$timestamps = json_decode(stream_get_contents($rateFile), true);
$timestamps = is_array($timestamps) ? array_values(array_filter($timestamps, fn($stamp) => is_int($stamp) && $stamp > $now - 900)) : [];
if (count($timestamps) >= 5) {
    flock($rateFile, LOCK_UN); fclose($rateFile);
    header('Retry-After: 900'); respond(429, ['ok' => false, 'code' => 'rate']);
}
$timestamps[] = $now;
rewind($rateFile); ftruncate($rateFile, 0); fwrite($rateFile, json_encode($timestamps));
flock($rateFile, LOCK_UN); fclose($rateFile);

$sender = getenv('CAREERS_MAIL_FROM') ?: 'info@alzahraa-construction.com';
if (!filter_var($sender, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $sender)) {
    respond(503, ['ok' => false, 'code' => 'unavailable']);
}
$text = "New careers application\n\n";
foreach (['fullName' => 'Name', 'email' => 'Email', 'phone' => 'Phone', 'position' => 'Position',
    'experience' => 'Years of experience', 'location' => 'Location', 'linkedin' => 'LinkedIn / portfolio', 'message' => 'Message'] as $field => $label) {
    $text .= $label . ': ' . ($values[$field] !== '' ? $values[$field] : 'Not supplied') . "\n";
}
$text .= "\nCV: " . $filename . "\nRecruitment data processing consent: Yes\n";
$boundary = 'az_' . bin2hex(random_bytes(24));
$headers = [
    'From' => 'Al Zahraa Careers <' . $sender . '>',
    'Reply-To' => $values['email'],
    'MIME-Version' => '1.0',
    'Content-Type' => 'multipart/mixed; boundary="' . $boundary . '"',
];
$attachment = file_get_contents($filePath);
if ($attachment === false) respond(503, ['ok' => false, 'code' => 'unavailable']);
$body = '--' . $boundary . "\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
    . chunk_split(base64_encode($text), 76, "\r\n")
    . '--' . $boundary . "\r\nContent-Type: " . $mime . '; name="CV.' . $extension . "\"\r\n"
    . 'Content-Disposition: attachment; filename="CV.' . $extension . "\"\r\nContent-Transfer-Encoding: base64\r\n\r\n"
    . chunk_split(base64_encode($attachment), 76, "\r\n") . '--' . $boundary . "--\r\n";
$subject = mb_encode_mimeheader('Career application — ' . $values['position'], 'UTF-8', 'B', "\r\n");
try {
    $sent = @mail(CAREERS_RECIPIENT, $subject, $body, $headers);
} catch (Throwable $exception) {
    $sent = false;
}
if (!$sent) respond(503, ['ok' => false, 'code' => 'delivery']);
respond(200, ['ok' => true]);
