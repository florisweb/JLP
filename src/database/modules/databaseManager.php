<?php
	require_once __DIR__ . "/../getRoot.php";
	require_once $GLOBALS["Root"] . "/PHPV2/PacketManager.php";
	require_once __DIR__ . "/filterer.php";

	$PM->includePacket("DB", "1.0");


	global $DatabaseManager;
	$DatabaseManager = new _DatabaseManager();


	class _DatabaseManager {
		private $DBName = "eelekweb_JLP";
		private $DB;

		public $wordList;

		public function __construct() {
			$this->DB = $GLOBALS["DB"]->connect($this->DBName);
			if (!$this->DB) die("Error connecting to DB");
			$this->wordList = new _DatabaseManager_wordList($this->DB);

		}

		


	}

	class _DatabaseManager_wordList {
		private $DBTableName = "wordList";
		private $DB;

		public function __construct($_DB) {
			$this->DB = $_DB;
		}

		public function getById($_id) {
			$result = $this->DB->execute("SELECT * FROM $this->DBTableName WHERE id=? LIMIT 1", array($_id));
			if (!$result) return false;
			$result["meanings"] = json_decode($result["meanings"], true);
			$result["readings"] = json_decode($result["readings"], true);
			return $result[0];
		}

		public function update($_word) {
			$word = $GLOBALS["Filterer"]->filterWord($_word);
			if (is_string($word)) return $word;

			$wordExists = !!$this->getById($_word["id"]);

			if ($wordExists)
			{
				$result = $this->DB->execute(
					"UPDATE $this->DBTableName SET _character=?,meanings=?,readings=?,type=?,readingInfo=?, meaningInfo=? WHERE id=?", 
					array(
						$word["character"],
						json_encode($word["meanings"]),
						json_encode($word["readings"]),
						$word["type"],
						$word["readingInfo"],
						$word["meaningInfo"],
						$word["id"],
					)
				);
				if (!$result) return false;
				return $word;
			}
			$result = $this->DB->execute(
				"INSERT INTO $this->DBTableName (_character, meanings, readings, type, readingInfo, meaningInfo) VALUES (?, ?, ?, ?, ?, ?)", 
				array(
					$word["character"],
					json_encode($word["meanings"]),
					json_encode($word["readings"]),
					$word["type"],
					$word["readingInfo"],
					$word["meaningInfo"]
				)
			);
			$word["id"] = $this->DB->getLatestInsertId();
			
			if (!$result) return false;
			return $word;
		}
	}


	// var_dump($DatabaseManager->wordList->getById(6));
	var_dump($DatabaseManager->wordList->update(array(
		"id" => 5,
		"character" => '少し2',
		'readings' => array('すこし'),
		'meanings' => ['A little'],
		'meaningInfo' => 'This word is a single kanji with hiragana attached, though there is no specific clue as to what type of word it is. That means you can usually guess it\'s a noun, adverb or na-adjective (in this case it\'s a noun / adverb). The meaning of this word is pretty much the same as the kanji, though, making it fairly easy. The kanji meaning for 少 is few, and the meaning of the vocab form is a little or a few.',
		'readingInfo' => '',
		'type' => 1
	)));

	// var_dump($DatabaseManager->wordList->update(array(
	// 	"character" => 'a',
	// 	'readings' => ['b'],
	// 	'meanings' => ['A little'],
	// 	'meaningInfo' => 'a',
	// 	'readingInfo' => 'test',
	// 	'type' => 1
	// )));




?>