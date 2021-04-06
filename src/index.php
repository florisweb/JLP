<!DOCTYPE html>
<html>
	<head>
		<title>JLP - Florisweb.tk</title>
		<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' name='viewport'/>
 		<link rel="stylesheet" type="text/css" href="css/component.css?a=4">
 		<link rel="stylesheet" type="text/css" href="css/main.css?a=5">
 		<link rel="stylesheet" type="text/css" href="css/popup.css?a=1">
	</head>	
	<body>
		<img src="/pictures/background_front.png" id="backgroundHolder">


		<div id="mainContent">
			<div class='page hide'>
				<div id='navigationHolder'>
					<div class="panel clickable">
						<div class='text title'>
							Lessons
						</div>
						<div class='text subText'>
							15 lessons
						</div>
					</div>
					<div class="panel clickable" onclick='App.openPage(1)'>
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
			<div class='page h ide reviewPage'>
				<div class='text blue questionHolder'><a>三日</a></div>
				<br>
				<br>
				<input class='text blue inputField'>



			</div>
		</div>
	
		
		<script src='js/wanakana.js'></script>
		<script src='js/extraFunctions.js'></script>
		<script src='js/popupComponent.js'></script>
		<script src='js/app.js'></script>

		<script>
			let input = $(".inputField")[0];
			wanakana.bind(input, {IMEMode: 'toHiragana' || 'toKatakana'	});

		</script>
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