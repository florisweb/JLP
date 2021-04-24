<?php
	require_once __DIR__ . "/databaseManager.php";
	



	class _App_trainer {
		public function __construct() {

		}


		public function getToLearnWords() {
			return $GLOBALS["DBManager"]->getToLearnListById($GLOBALS["App"]->userId);
		}

		public function getLearnedWords() {
			$learnedWords = $GLOBALS["DBManager"]->getLearnedListById($GLOBALS["App"]->userId);

			
			
		}


	}



?>