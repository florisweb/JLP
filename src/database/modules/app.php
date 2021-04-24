<?php
	require_once __DIR__ . "/databaseManager.php";
	require_once __DIR__ . "/constants.php";
	require_once __DIR__ . "/trainer.php";
	require_once __DIR__ . "/words.php";
	$GLOBALS["PM"]->includePacket("SESSION", "1.0");

	global $App;
	$App = new _App($GLOBALS["SESSION"]->get("userId"));


	class _App {
		public $words;
		public $trainer;
		public $userId;

		public function __construct($_userId) {
			$this->userId = $_userId;
			if (!$_userId) die(E_noAuth);

			$this->words = new _App_words();
			$this->trainer = new _App_trainer($this);
		}
	}
?>