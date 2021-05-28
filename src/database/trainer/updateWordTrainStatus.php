<?php
	require_once __DIR__ . "/../modules/app.php";
	$_wordId = (int)$_POST["wordId"];
	$_correct = (boolean)$_POST["correct"];
	$_isMeaning = (boolean)$_POST["isMeaning"];
	if (!isset($_POST["wordId"])) die("Invalid parameters");
	$App->trainer->updateWordTrainStatus($_wordId, $_correct, $_isMeaning);
?>