<?php
	require_once __DIR__ . "/../getRoot.php";
	require_once $GLOBALS["Root"] . "/PHPV2/PacketManager.php";
	require_once __DIR__ . "/filterer.php";

	$PM->includePacket("DB", "1.0");


	global $DBManager;
	$DBManager = new _DatabaseManager();


	class _DatabaseManager {
		private $DBName = "eelekweb_JLP";
		private $DB;

		public $words;
		public $users;

		public function __construct() {
			$this->DB = $GLOBALS["DB"]->connect($this->DBName);
			if (!$this->DB) die("Error connecting to DB");
			$this->words = new _DatabaseManager_wordList($this->DB);
			$this->userData = new _DatabaseManager_userData($this->DB);
		}
	}

	class _DatabaseManager_wordList {
		private $DBTableName = "wordList";
		private $DB;

		public function __construct($_DB) {
			$this->DB = $_DB;
		}

		public function getById($_id) {
			$result = $this->DB->execute("SELECT * FROM $this->DBTableName WHERE id=? LIMIT 1", array($_id))[0];
			if (!$result) return false;
			$result["character"] = $result["_character"];
			unset($result["_character"]);
			$result["meanings"] = json_decode($result["meanings"], true);
			$result["readings"] = json_decode($result["readings"], true);
			return $result;
		}

		public function update($_word) {
			$word = $GLOBALS["Filterer"]->filterWord($_word);
			if (is_string($word)) return $word;

			$wordExists = !!$this->getById($_word["id"]);

			if ($wordExists)
			{
				$result = $this->DB->execute(
					"UPDATE $this->DBTableName SET _character=?,meanings=?,readings=?,type=?,readingInfo=?, meaningInfo=?, level=? WHERE id=?", 
					array(
						$word["character"],
						json_encode($word["meanings"]),
						json_encode($word["readings"]),
						$word["type"],
						$word["readingInfo"],
						$word["meaningInfo"],
						$word["level"],
						$word["id"],
					)
				);
				if (!$result) return false;
				return $word;
			}
			$result = $this->DB->execute(
				"INSERT INTO $this->DBTableName (_character, meanings, readings, type, readingInfo, meaningInfo, level) VALUES (?, ?, ?, ?, ?, ?, ?)", 
				array(
					$word["character"],
					json_encode($word["meanings"]),
					json_encode($word["readings"]),
					$word["type"],
					$word["readingInfo"],
					$word["meaningInfo"],
					$word["level"],
				)
			);
			$word["id"] = $this->DB->getLatestInsertId();
			
			if (!$result) return false;
			return $word;
		}
	}


	class _DatabaseManager_userData {
		private $DBTableName = "userList";
		private $DB;

		public function __construct($_DB) {
			$this->DB = $_DB;
		}

		public function getWordListByUId($_id) {
			$result = $this->DB->execute("SELECT words FROM $this->DBTableName WHERE userId=? LIMIT 1", array($_id))[0];
			if (!$result) return array();
			$result = json_decode($result["words"], true);
			if (!$result) return array();
			return $result;
		}

		public function setWordListByUId($_array, $_id) {
			if ($this->userRowExists($_id))
			{
				return $this->DB->execute(
					"UPDATE $this->DBTableName SET words=? WHERE userId=?", 
					array(
						json_encode($_array),
						$_id,
					)
				);
			}
			return $this->DB->execute(
				"INSERT INTO $this->DBTableName (userId, words) VALUES (?, ?)", 
				array(
					$_id,
					json_encode($_array)
				)
			);
		}
		
		private function userRowExists($_id) {
			$result = $this->DB->execute("SELECT userId FROM $this->DBTableName WHERE userId=?", array($_id))[0];
			return !!$result;
		}
	}
?>