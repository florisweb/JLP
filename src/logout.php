<?php
    require "database/getRoot.php";
    require_once $Root . "/PHPV2/PacketManager.php";
    $PM->includePacket("USER", "1.1");
    $USER->Current->logout();
?>
