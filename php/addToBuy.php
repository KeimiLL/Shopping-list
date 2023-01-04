<?php
$data = file_get_contents('php://input');
//
$dataXML = simplexml_load_string($data);
//zabezpieczenie przed wielodostepem
$file = fopen('data.xml', 'r+');
flock($file, LOCK_EX);

$content = stream_get_contents($file);
$allDataXML = simplexml_load_string($content);
$allDataXML->toBuy->addChild('label', $dataXML);
$hints = $allDataXML->hint->children();
$guard = false;
foreach ($hints as $hint) {
    if ((string) $dataXML == (string) $hint[0]) {
        $guard = true;
        break;
    }
}
if (!$guard) {
    $allDataXML->hint->addChild('label', $dataXML);
}
http_response_code(200);

ftruncate($file, 0);
rewind($file);
fwrite($file, $allDataXML->asXML());
fflush($file);

// to release a lock (shared or exclusive)
flock($file, LOCK_UN);
fclose($file);
