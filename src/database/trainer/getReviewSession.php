<?php
	require_once __DIR__ . "/../modules/app.php";
	
	$session = $App->trainer->getReviewSession();
	echo json_encode($session);
?>