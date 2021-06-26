<?php
	require_once __DIR__ . "/database/getRoot.php";
	require_once $Root . "/PHP/PacketManager.php";
	$GLOBALS["PM"]->includePacket("SESSION", "1.0");
	$GLOBALS["PM"]->includePacket("GLOBALS", "1.0");
	
	if (!$GLOBALS["SESSION"]->get("userId"))
	{
		header("Location: " . $GLOBALS['UserDomainUrl'] . "/login?redirect=" . $GLOBALS['ProjectUrls']['JLP']);
		die("E_noAuth");
	}

	echo '<script>const SignInUrl = "' . $GLOBALS['UserDomainUrl'] . "/login?redirect=" . $GLOBALS['ProjectUrls']['JLP'] . '"</script>';
?>

<!DOCTYPE html>
<html>
	<head>
		<title>JLP - Florisweb</title>
		<link rel="shortcut icon" href="images/favicon.png">
		<meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' name='viewport'/>
 		<link rel="stylesheet" type="text/css" href="main_min.css">
	</head>	
	<body>
		<img src="images/background.png" id="backgroundHolder">
		<div id="mainContent">
			<div class='page'>
				<div class='pageContent'>
					<div class='levelHolder'>
						<div class='text blue levelText'>Level 1</div>
						<div class='text progressBar'>
							<div class="back">Progress 0%</div>
							<div class="front">Progress 0%</div>
						</div>
					</div>
					
					<div class="panel" id='basketHolder'>
						<div class='basket'>
							<div class='text title'>
								0
							</div>
							<div class='text subText'>
								Unfamiliar
							</div>
						</div>
						<div class='basket'>
							<div class='text title'>
								0
							</div>
							<div class='text subText'>
								Fresh
							</div>
						</div>
						<div class='basket'>
							<div class='text title'>
								0
							</div>
							<div class='text subText'>
								Familiar
							</div>
						</div>
						<div class='basket'>
							<div class='text title'>
								0
							</div>
							<div class='text subText'>
								Proficient
							</div>
						</div>
						<div class='basket'>
							<div class='text title'>
								0
							</div>
							<div class='text subText'>
								Mastered
							</div>
						</div>
					</div>
					
					<div id='navigationHolder'>
						<div class="panel clickable disabled">
							<div class='text title'>
								Lessons
							</div>
							<div class='text subText'>0 words</div>
						</div>
						<div class="panel clickable disabled">
							<div class='text title'>
								Reviews
							</div>
							<div class='text subText'>0 words</div>
						</div>
					</div>

				</div>
			</div>
			<div class='page hide reviewPage'>
				<div class='progressBar'></div>
				<div class='topBar'>
					<img src='images/homeIcon.png' class='homeButton clickable'>
					<div class='text scoreHolder'></div>
				</div>
				<div class='pageContent'>
					<div class='text blue questionHolder'><a</a></div>
					<div class='text blue questionTypeHolder'><a></a></div>
					<br>
					<input class='text blue panel inputField'>

					<div class='panel infoPanel hide'>
						<span class='text title highLightType kanji'></span>
						<br>
						<div class='text subText keyValuePair'>
							Meaning: <span class='value'></span>
						</div>
						<div class='text subText keyValuePair'>
							Readings: <span class='value'></span>
						</div>
						<div class='text subText infoTextHolder'></div>
					</div>

					<div class='smallInfoPanelHolder hide'>
						<div class='text panel smallInfoPanel'>
							Incorrect input
						</div>
					</div>
				</div>
			</div>
			<div class='page hide'>
			</div>
			<div class='page hide lessonPage'>
				<div class='topBar'>
					<img src='images/homeIcon.png' class='homeButton clickable'>
					<div class='text scoreHolder'></div>
					<div class='wordNavigator'></div>
				</div>

				<div class='pageContent'>
					<div class='text blue questionHolder'><a></a></div>
					<div class='text blue questionTypeHolder'><a></a></div>

					
					<div class='panel infoPanel hide'>
						<span class='text title highLightType kanji'></span>
						<br>
						<div class='text subText keyValuePair'>
							Meaning: <span class='value'></span>
						</div>
						<div class='text subText keyValuePair'>
							Readings: <span class='value'></span>
						</div>
						<div class='text subText infoTextHolder'></div>
					</div>
				</div>
			</div>
		</div>
	
		<script src='lib/wanakana.js'></script>
		<script src='<?php echo $GLOBALS['DomainUrl']; ?>/JS/request2.js'></script>
		<script src='main_min.js'></script>
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