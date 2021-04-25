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
			$score = $this->getKnowledgeLevelScore();
			if ($score < $this->minAverageKnowledgeLevelForNewWords) return false;
			$curIndex = $this->parent->words->getHighestIndex();

			for ($di = 0; $di < $this->newWordsPerSession; $di++)
			{
				$this->addWordToTrainer($di + $curIndex + 1);
			}

			return true;
		}

		public function getKnowledgeLevelScore() {
			$words = $this->parent->words->getAll();
			if (sizeof($words) == 0) return $this->minAverageKnowledgeLevelForNewWords;

			function sortWordArray($a, $b) {
				if ($a['knowledgeLevel'] > $b['knowledgeLevel']) return 1;
				return -1;
			}

			usort($words, "sortWordArray");
			$sum = 0;
			$totalWordCount = 0;
			for ($i = 0; $i < $this->newWordsPerSession; $i++)
			{
				if (sizeof($words) - 1 < $i) break;
				$totalWordCount++;
				$sum += $words[$i]["knowledgeLevel"];
			}

			return $sum / $totalWordCount;
		}


		



		public function getReviewSession() {
			$words = $this->parent->words->getAll();
			$session = array();

			foreach ($words as $trainerWord) 
			{
				$dt = time() - $trainerWord["lastReviewTime"];
				$requiredTime = $this->secondsPerLevel * pow(2, $trainerWord["knowledgeLevel"]) * .5;
				if ($dt < $requiredTime || $trainerWord["knowledgeLevel"] == 0) continue;
				array_push($session, $trainerWord["word"]);
			}

			return $session;			
		}
		
		public function getLessonSession() {
			$words = $this->parent->words->getAll();
			$session = array();

			foreach ($words as $trainerWord) 
			{
				if ($trainerWord["knowledgeLevel"] != 0) continue;
				array_push($session, $trainerWord["word"]);
			}

			return $session;			
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
			} else {
				$removeCount = 2;
				if ($trainerWord["knowledgeLevel"] < 3) $removeCount = 1;
				if ($trainerWord["knowledgeLevel"] < 2) $removeCount = 0;
				
				$trainerWord["knowledgeLevel"] -= $removeCount;
			}
			return $this->parent->words->update($trainerWord);
		}


	}



?>