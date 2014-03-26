<?php
/*** mysql hostname ***/
$hostname = 'tagl.is';

$dbname = 'hermann';
/*** mysql username ***/
$username = 'Hermann';

/*** mysql password ***/
$password = 'tagllover69';

try {
    $dbh = new PDO("mysql:host=$hostname;dbname=$dbname", $username, $password);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$dbh->exec('SET NAMES "utf8"');
}
catch(PDOException $e) {
    echo $e->getMessage();
}

?>