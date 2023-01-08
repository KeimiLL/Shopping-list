<?php
$list = $_GET['list'];

$file = fopen('../data.xml', 'r');
flock($file, LOCK_EX);

//przygotowanie pliku z danymi w XML
$content = stream_get_contents($file);
$allDataXML = simplexml_load_string($content);

//dla konkretnej listy wysylam dane w xml
if ($list == 'hints') {
    echo $allDataXML->hint->asXML();
} elseif ($list == 'toBuy') {
    echo $allDataXML->toBuy->asXML();
} else { // list == 'bought'
    echo $allDataXML->bought->asXML();
}
flock($file, LOCK_UN);
fclose($file);
