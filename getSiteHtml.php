<?
$text = file_get_contents($_GET['siteUrl']);
if($text) echo $text;
else echo "fail";
?>