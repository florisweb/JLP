<?php
	require_once __DIR__ . "/../getRoot.php";
	require_once $GLOBALS["Root"] . "/PHP/PacketManager.php";
	require_once __DIR__ . "/filterer.php";

	$PM->includePacket("DB", "1.0");


	global $DBManager;
	$DBManager = new _DatabaseManager();


	class _DatabaseManager {
		private $DBName = "eelekweb_JLP";
		private $DB;

		public $words;
		public $userData;

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
			return $this->DBWordToExportWord($result);
		}
		private function DBWordToExportWord($_word) {
			$_word["character"] = $_word["_character"];
			unset($_word["_character"]);
			$_word["meanings"] = json_decode($_word["meanings"], true);
			$_word["readings"] = json_decode($_word["readings"], true);
			return $_word;
		}

		public function getByLevel($_level) {
			$words = [];
			$results = $this->DB->execute(
				"SELECT * FROM $this->DBTableName WHERE level=?", 
				array((int)$_level)
			);
			if (!$results) return false;
			foreach ($results as $word) 
			{
				array_push($words, $this->DBWordToExportWord($word));
			}
			return $words;
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

		public function getXNewWordIds($_x, $_id) {
			$words = $this->getWordListByUId($_id);
			$idList = "(" . $words[0]['wordId'];
			for ($i = 1; $i < sizeof($words); $i++) $idList .= ',' . ((int)$words[$i]['wordId']);
			$idList .= ')';

			 
			$results = $this->DB->execute("SELECT id FROM wordList WHERE id NOT IN $idList LIMIT ?", array($_x));
			$ids = [];
			foreach ($results as $result) array_push($ids, $result['id']);
			return $ids;
		}
		
		private function userRowExists($_id) {
			$result = $this->DB->execute("SELECT userId FROM $this->DBTableName WHERE userId=?", array($_id))[0];
			return !!$result;
		}
	}
?>