<?php
//checkData.php
// function returns the current timestamp of data.xml file
$file = '../data.xml';

if(file_exists($file)){
    $filetime = filemtime($file);
    echo $filetime;
} else {
    echo 'file does not exist';
}