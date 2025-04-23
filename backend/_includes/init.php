<?php

/*if($_SERVER['REMOTE_ADDR'] != "93.185.58.86")
{
  echo 'Ve výstavbě<br />'; exit;
};*/

//ini_set('log_errors', TRUE);
//ini_set('error_log','__FILES/errors.txt');
ini_set('display_errors', false);

//if($_SERVER['REMOTE_ADDR'] != "93.185.58.86"){
//    ini_set('display_errors', false);
//}
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

header('Content-type: text/html; charset=utf-8');

/*nemenit poradi --*/   
include_once 'dbconnect.php';
include_once 'config.php';
//include_once 'STRUCTURE.php';

?>