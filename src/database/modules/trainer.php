<?php
	require_once __DIR__ . "/databaseManager.php";
	require_once __DIR__ . "/constants.php";
	



	class _App_trainer {
		private $secondsPerLevel = 60 * 60; // 1 hour per level
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
				if ($a['meaningKnowledgeLevel'] + $a['readingKnowledgeLevel'] > $b['meaningKnowledgeLevel'] + $b['readingKnowledgeLevel']) return 1;
				return -1;
			}

			usort($words, "sortWordArray");
			$sum = 0;
			$totalWordCount = 0;
			for ($i = 0; $i < $this->newWordsPerSession * 2; $i++)
			{
				if (sizeof($words) - 1 < $i) break;
				$totalWordCount++;
				$sum += ($words[$i]["meaningKnowledgeLevel"] + $words[$i]["readingKnowledgeLevel"]) / 2;
			}

			return $sum / $totalWordCount;
		}


		



		public function getReviewSession() {
			$words = $this->parent->words->getAll();
			$session = array();

			foreach ($words as $trainerWord) 
			{
				$dt = time() - $trainerWord["lastReviewTime"];
				$requiredTime = $this->secondsPerLevel * pow(2, ($trainerWord["meaningKnowledgeLevel"] + $trainerWord["readingKnowledgeLevel"]) / 2) * .5;
				if ($dt < $requiredTime || $trainerWord["meaningKnowledgeLevel"] == 0) continue;
				array_push($session, $trainerWord["word"]);
			}

			return $session;			
		}
		
		public function getLessonSession() {
			$words = $this->parent->words->getAll();
			$session = array();
			foreach ($words as $trainerWord) 
			{
				if ($trainerWord["meaningKnowledgeLevel"] != 0) continue;
				array_push($session, $trainerWord["word"]);
			}
			return $session;			
		}

		public function addWordToTrainer($_wordId) {
			$actualWord = $GLOBALS["DBManager"]->words->getById($_wordId);
			if (!$actualWord) return E_wordNotFound;
			$trainerWord = array(
				"lastReviewTime" => false,
				"meaningKnowledgeLevel" => 0,
				"readingKnowledgeLevel" => 0,
				"word" => $actualWord,
			);
			return $this->parent->words->update($trainerWord);
		}

		public function updateWordTrainStatus($_wordId, $_correct, $_isMeaning = true) {
			$trainerWord = $this->parent->words->get($_wordId);
			if (!$trainerWord) $trainerWord = $this->addWordToTrainer($_wordId);
			if ($trainerWord == E_wordNotFound) return E_wordNotFound;
			$knowledgeType = $_isMeaning ? 'meaningKnowledgeLevel' : 'readingKnowledgeLevel';
			
			$trainerWord["lastReviewTime"] = time();
			if ($_correct)
			{
				$trainerWord[$knowledgeType]++;
			} else {
				$removeCount = 2;
				if ($trainerWord[$knowledgeType] < 3) $removeCount = 1;
				if ($trainerWord[$knowledgeType] < 2) $removeCount = 0;
				
				$trainerWord[$knowledgeType] -= $removeCount;
			}
			return $this->parent->words->update($trainerWord);
		}
	}
?>