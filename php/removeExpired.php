<?php
$data = file_get_contents('php://input');
//string xml na obiekt
// dataXML to przekazany obiekt
$dataXML = simplexml_load_string($data);

//zabezpieczenie przed wielodostepem
$file = fopen('../data.xml', 'r+');
flock($file, LOCK_EX);

//przygotowanie pliku z danymi w XML
$content = stream_get_contents($file);
$allDataXML = simplexml_load_string($content);
//stare dane usuwam
foreach ($allDataXML->bought as $b) {
    unset($b->label);
    unset($b->date);
}
//zastepuje nowymi aktualnymi
for ($i = 0; $i < count($dataXML->label); $i++) {
    $allDataXML->bought->addChild('label', $dataXML->label[$i]);
    $allDataXML->bought->addChild('date', $dataXML->date[$i]);
}

flock($file, LOCK_UN);
fclose($file);
