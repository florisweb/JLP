<?php
	require_once __DIR__ . "/../modules/databaseManager.php";
	const filePath = "wordList.json";

	$file = fopen(filePath, "r") or die("Unable to open file!");
	$data = fread($file, filesize(filePath));
	fclose($file);


	if (!$data) die("No data found");
	$words = json_decode($data, true);
	if (!$words || !sizeof($words)) die("Invalid data");

	echo "<pre>";


	foreach ($words as $word) 
	{
		var_dump($word);
		$result = $GLOBALS["DBManager"]->words->update($word);
		var_dump($result);

	}

?>