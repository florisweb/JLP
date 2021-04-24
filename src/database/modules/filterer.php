<?php
	require_once __DIR__ . "/../getRoot.php";
	require_once $GLOBALS["Root"] . "/PHPV2/PacketManager.php";

	$PM->includePacket("FILTERER", "1.0");

	global $Filterer;
	$Filterer = new _JLPFilterer();

	class _JLPFilterer {
		private $wordFilter;
		private $trainerWordFilter;

		public function __construct() {
			$this->wordFilter = $GLOBALS["FILTERER"]->createFilter(array(
				"id" 				=> ["int", false, $GLOBALS["FILTERER"]->IdentifyingKey, $GLOBALS["FILTERER"]->Defaultable],
				"character" 		=> ["string"],
				"meanings" 			=> ["array", [], $GLOBALS["FILTERER"]->Defaultable],
				"readings" 			=> ["array", [], $GLOBALS["FILTERER"]->Defaultable],
				"type" 				=> ["int", 0, $GLOBALS["FILTERER"]->Defaultable],
				"level" 			=> ["int", 0, $GLOBALS["FILTERER"]->Defaultable],
				"readingInfo"		=> ["string", "", $GLOBALS["FILTERER"]->Defaultable],
				"meaningInfo"		=> ["string", "", $GLOBALS["FILTERER"]->Defaultable],
				
			));

			$this->trainerWordFilter = $GLOBALS["FILTERER"]->createFilter(array(
				"word"				=> [$this->wordFilter],
				"knowledgeLevel"	=> ["int", 0, $GLOBALS["FILTERER"]->Defaultable],
				"lastReviewTime"	=> ["int", time(), $GLOBALS["FILTERER"]->Defaultable],
			));
		}


		public function filterWord($_word) {
			$word = $this->wordFilter->filter($_word);
			if (!$word || $word == $GLOBALS["FILTERER"]->InvalidObj) return "E_invalidWord";
			if ($word["type"] < 0 || $word["type"] > 2) return "E_invalidType";
			return $word;
		}

		public function fliterTrainerWord($_word) {
			$word = $this->trainerWordFilter->filter($_word);
			if (!$word || $word == $GLOBALS["FILTERER"]->InvalidObj) return "E_invalidWord";
			if ($word["word"]["type"] < 0 || $word["word"]["type"] > 2) return "E_invalidType";
			return $word;
		}
	}	
?>