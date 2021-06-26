<?php
	require_once __DIR__ . "/../modules/app.php";
	
	$levelData = $App->trainer->getCurLevelData();
	echo json_encode($levelData);
?>