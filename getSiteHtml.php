<?php

$needDate = $_GET['whatNeed'];

mkdir('htmlSources');

if (file_exists('htmlSources/'.$needDate.'.txt')) {
    $text = file_get_contents('htmlSources/'.$needDate.'.txt');
    echo $text;
} else {
    $text = file_get_contents($_GET['siteUrl']);
    file_put_contents('htmlSources/'.$needDate.'.txt',$text);
    $text = file_get_contents('htmlSources/'.$needDate.'.txt');
    echo $text;
}
?>