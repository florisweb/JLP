<?php
	require_once __DIR__ . "/databaseManager.php";
	require_once __DIR__ . "/constants.php";
	



	class _App_trainer {
		private $secondsPerLevel = 10;
		private $parent;

		public function __construct($_parent) {
			$this->parent = $_parent;

		}


		public function getReviewSession() {
			$words = $this->parent->words->getAll();
			$reviewSession = array();

			foreach ($words as $trainerWord) 
			{
				$dt = time() - $trainerWord["lastReviewTime"];
				$requiredTime = $this->secondsPerLevel * pow($trainerWord["knowledgeLevel"], 2);
				if ($dt < $requiredTime) continue;
				array_push($reviewSession, $trainerWord["word"]);
			}

			return $reviewSession;			
		}

		public function addWordToTrainer($_wordId) {
			$actualWord = $GLOBALS["DBManager"]->words->getById($_wordId);
			if (!$actualWord) return E_wordNotFound;
			$trainerWord = array(
				"lastReviewTime" => false,
				"knowledgeLevel" => 0,
				"word" => $actualWord,
			);
			return $this->parent->words->update($trainerWord);
		}

		public function updateWordTrainStatus($_wordId, $_correct) {
			$trainerWord = $this->parent->words->get($_wordId);
			if (!$trainerWord) $trainerWord = $this->addWordToTrainer($_wordId);
			if ($trainerWord == E_wordNotFound) return E_wordNotFound;
			
			$trainerWord["lastReviewTime"] = time();
			if ($_correct)
			{
				$trainerWord["knowledgeLevel"]++;
			} else if ($trainerWord["knowledgeLevel"] > 0) $trainerWord["knowledgeLevel"]--;

			return $this->parent->words->update($trainerWord);
		}


	}



?>