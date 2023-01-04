<?php
$data = file_get_contents('php://input');
//string xml na obiekt
// dataXML to przekazany obiekt
$dataXML = simplexml_load_string($data);
//zabezpieczenie przed wielodostepem
$file = fopen('data.xml', 'r+');
flock($file, LOCK_EX);
//przygotowanie pliku z danymi w XML
$content = stream_get_contents($file);
$allDataXML = simplexml_load_string($content);

if ($dataXML->where == 'to_toBuy') {
    unset($allDataXML->bought->label[intval($dataXML->id[0])]);
    unset($allDataXML->bought->date[intval($dataXML->id[0])]);
    $allDataXML->toBuy->addChild('label', $dataXML->label);
} else {
    unset($allDataXML->toBuy->label[intval($dataXML->id[0])]);
    $allDataXML->bought->addChild('label', $dataXML->label);
    $allDataXML->bought->addChild('date', $dataXML->date);
}

ftruncate($file, 0);
rewind($file);
fwrite($file, $allDataXML->asXML());
fflush($file);
flock($file, LOCK_UN);
fclose($file);
