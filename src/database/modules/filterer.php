<?php
	require_once __DIR__ . "/../getRoot.php";
	require_once $GLOBALS["Root"] . "/PHPV2/PacketManager.php";

	$PM->includePacket("FILTERER", "1.0");

	global $Filterer;
	$Filterer = new _JLPFilterer();

	class _JLPFilterer {
		private $wordFilter;

		public function __construct() {
			$this->wordFilter = $GLOBALS["FILTERER"]->createFilter(array(
				"id" 			=> ["int", false, $GLOBALS["FILTERER"]->IdentifyingKey, $GLOBALS["FILTERER"]->Defaultable],
				"character" 	=> ["string"],
				"meanings" 		=> ["array", [], $GLOBALS["FILTERER"]->Defaultable],
				"readings" 		=> ["array", [], $GLOBALS["FILTERER"]->Defaultable],
				"type" 			=> ["int", 0, $GLOBALS["FILTERER"]->Defaultable],
				"level" 		=> ["int", 0, $GLOBALS["FILTERER"]->Defaultable],
				"readingInfo"	=> ["string", "", $GLOBALS["FILTERER"]->Defaultable],
				"meaningInfo"	=> ["string", "", $GLOBALS["FILTERER"]->Defaultable],
			));
		}

		public function filterWord($_word) {
			$word = $this->wordFilter->filter($_word);
			if (!$word) return "E_invalidWord";
			if ($word["type"] < 0 || $word["type"] > 2) return "E_invalidType";
			return $word;
		}
	}	
?>