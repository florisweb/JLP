<?php
	require_once __DIR__ . "/../modules/app.php";
	
	$schedule = $App->trainer->getReviewSchedule();
	echo json_encode($schedule);
?>