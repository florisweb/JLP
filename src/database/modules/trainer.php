<?php
	require_once __DIR__ . "/databaseManager.php";
	require_once __DIR__ . "/constants.php";
	



	class _App_trainer {
		private $secondsPerLevel = 60; // 1 hour per level
		private $parent;
		private $newWordsPerSession = 5;
		private $minAverageKnowledgeLevelForNewWords = 3;

		public function __construct($_parent) {
			$this->parent = $_parent;
		}

		public function autoAddWordsToTrainer() {
			$score = $this->getAverageKnowledgeLevel();
			if ($score < $this->minAverageKnowledgeLevelForNewWords) return false;
			$curIndex = $this->parent->words->getHighestIndex();

			for ($di = 0; $di < $this->newWordsPerSession; $di++)
			{
				$this->addWordToTrainer($di + $curIndex + 1);
			}

			return true;
		}

		public function getAverageKnowledgeLevel() {
			$words = $this->parent->words->getAll();
			if (sizeof($words) == 0) return $this->minAverageKnowledgeLevelForNewWords;

			$sum = 0;
			foreach ($words as $trainerWord) $sum += $trainerWord["knowledgeLevel"];

			return $sum / sizeof($words);
		}


		public function getReviewSession() {
			$words = $this->parent->words->getAll();
			$reviewSession = array();

			foreach ($words as $trainerWord) 
			{
				$dt = time() - $trainerWord["lastReviewTime"];
				$requiredTime = $this->secondsPerLevel * pow(2, $trainerWord["knowledgeLevel"]) * .5;
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
			} else if ($trainerWord["knowledgeLevel"] > 1) $trainerWord["knowledgeLevel"] -= 2;

			return $this->parent->words->update($trainerWord);
		}


	}



?>