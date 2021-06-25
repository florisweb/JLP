<?php
	require_once __DIR__ . "/../modules/app.php";
	
	$baskets = $App->trainer->getWordBaskets();
	echo json_encode($baskets);
?>