<?php
	require_once __DIR__ . "/../modules/app.php";
	$_wordId = (int)$_POST["wordId"];
	$_correct = (boolean)$_POST["correct"];
	
	if (!isset($_POST["wordId"])) die("Invalid parameters");
	var_dump($App->trainer->updateWordTrainStatus($_wordId, $_correct));
?>