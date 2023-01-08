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

//dodaje do toBuy nową rzecz
$allDataXML->toBuy->addChild('label', $dataXML);

//sprawdzam czy musze dodac tez do podpowiedzi
$hints = $allDataXML->hint->children();
$k = false;

foreach ($hints as $hint) {
    if ((string) $dataXML == (string) $hint[0]) {
        $k = true;
        break;
    }
}
//jesli nie ma takiej podpowiedzi to ją dodaję
if (!$k) {
    $allDataXML->hint->addChild('label', $dataXML);
}

ftruncate($file, 0);
rewind($file);
fwrite($file, $allDataXML->asXML());
fflush($file);

// to release a lock (shared or exclusive)
flock($file, LOCK_UN);
fclose($file);
