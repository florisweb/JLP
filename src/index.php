<!DOCTYPE html>
<html>
	<head>
		<title>JLP - Florisweb.tk</title>
		<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' name='viewport'/>
 		<link rel="stylesheet" type="text/css" href="main_min.css?a=10">
	</head>	
	<body>
		<img src="/pictures/background_front.png" id="backgroundHolder">


		<div id="mainContent">
			<div class='page'>
				<div id='navigationHolder'>
					<div class="panel clickable">
						<div class='text title'>
							Lessons
						</div>
						<div class='text subText'>
							15 lessons
						</div>
					</div>
					<div class="panel clickable">
						<div class='text title'>
							Reviews
						</div>
						<div class='text subText'>
							15 words
						</div>
					</div>
				</div>

				<div id='deckHolder'>
					<div class="panel">
						<div class='text title'>
							New
						</div>
						<div class='text subText'>
							15 lessons
						</div>
					</div>
					<div class="panel">
						<div class='text title'>
							Repeated
						</div>
						<div class='text subText'>
							15 words
						</div>
					</div>
					<div class="panel">
						<div class='text title'>
							Hard
						</div>
						<div class='text subText'>
							15 words
						</div>
					</div>
					<div class="panel">
						<div class='text title'>
							Something else
						</div>
						<div class='text subText'>
							15 words
						</div>
					</div>
					<div class="panel">
						<div class='text title'>
							Finished
						</div>
						<div class='text subText'>
							15 words
						</div>
					</div>
				</div>
			</div>
			<div class='page hide reviewPage'>
				<div class='text blue questionHolder'><a>三日</a></div>
				<div class='text blue questionTypeHolder'><a>Meaning</a></div>
				<br>
				<input class='text blue panel inputField'>

				<div class='panel infoPanel hide'>
					<div class='text title'></div>
					<div class='text subText keyValuePair'>
						Meaning: <span class='value'></span>
					</div>
					<div class='text subText keyValuePair'>
						Readings: <span class='value'></span>
					</div>
					<div class='text subText infoTextHolder'></div>
				</div>
			</div>
			<div class='page hide'>
			</div>
		</div>
	
		<script src='lib/wanakana.js'></script>
		<script src='main_min.js?a=6'></script>
	</body>
</html>	

<?php
	include __DIR__ . "/database/getRoot.php";
  	include $Root . "/topBalk/topBalkPHP.php";

	$FLORISWEB = new _florisweb(
		[
			"topBar" => [
				"background" => "rgba(0, 0, 0, 0.9)",
				"shadow" => "none",
			],
		]
	); 
?>