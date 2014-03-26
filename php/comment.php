<?php

	include("dbcon.php");

	$STH = $dbh->prepare("INSERT INTO comments (name,comment) VALUES (:name,:comment)");
	$STH->bindParam(':name', $_POST['name']);
	$STH->bindParam(':comment', $_POST['comment']);

	$STH->execute();

    echo 'Thank you'.$_POST['name'].' for your suggestion,the supreme leader will take it into account during your sentancing';

?>