<?php
	require_once __DIR__ . "/../modules/app.php";
	
	$session = $App->trainer->getLessonSession();
	echo json_encode($session);
?>