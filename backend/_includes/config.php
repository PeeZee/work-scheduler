<?php
//-------------------------------------------------------------------------------------------------------------
DEFINE('pfxCSSJS', '?v=' . Date('YmdHis'));
//-------------------------------------------------------------------------------------------------------------
DEFINE('bUseBrandAdv', false);
//-------------------------------------------------------------------------------------------------------------
/*-- Nyni je promenna v tabulce sysappvariables a nacita se nize do konstanty --*/
//DEFINE('bUseShoppingProcess', (Row($mysqli, 'sysappvariables', 'value', 'WHERE name=\'bUseShoppingProcess\'', '', true, false) == 1 ? true : false));
//-------------------------------------------------------------------------------------------------------------
DEFINE ('useMinifyCSS', false);
DEFINE ('useMinifyJS', false);
//-------------------------------------------------------------------------------------------------------------
DEFINE('SCRIPTNAME', str_replace($_SERVER["DOCUMENT_ROOT"], '', $_SERVER["SCRIPT_FILENAME"]));
//-------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------
$sql = "SELECT * FROM " . tpfx . "settings WHERE pkSettings = 1";
$result = sqlEXEC($mysqli, $sql); 
if($result->num_rows > 0){
  while($rs = $result -> fetch_array(MYSQLI_ASSOC))
  {
    //print_r($rs);echo '<br />';
    foreach ($rs as $key => $val)
    {
        //echo "" .$key. ': ' . $val . "<br/>";
        DEFINE("OWN_" .$key, $val);
    }
  }
}

$sql = "SELECT * FROM " . tpfx . "sysappvariables ORDER BY pkSysAppvariables ASC";
$result = sqlEXEC($mysqli, $sql); 
if($result->num_rows > 0){
  while($rs = $result -> fetch_array(MYSQLI_BOTH))
  {
    //echo $rs['name'] . '=' . $rs['value'] . '<br />';
    if($rs['name'] == 'bUseMultiLanguage' || $rs['name'] == 'bUseShoppingProcess')
    {
      DEFINE($rs['name'], ($rs['value'] == 1 ?  true : false));
    }
    else
    {
      DEFINE($rs['name'], $rs['value']);
    }
  }
}

DEFINE('moreIP', '93.185.58.40,93.185.58.45');

DEFINE('cookieLNG', projectCode . '_lng');
DEFINE('cookieAdminLNG', projectCode . '_adm_lng');
DEFINE('cookieLoginAdmin', projectCode . '_adm');
DEFINE('cookieRedirAdmin', projectCode . '_rdradm');
DEFINE('cookieLoginClient', projectCode . '_cl');
DEFINE('cookieDomain', str_replace('www.', '', $_SERVER['HTTP_HOST']));
DEFINE('cryptKey', 'handx453made');
DEFINE('bEmailToAdmin', true);

$sendermail = 'robot@handmade.net';

/*
  0 - saved - uložena   - #ebebeb
  1 - received - přijata k vyřízení - #ffffd5 
  2 - work - připravuje se - #ceffff
  3 - done - připravena k odeslani - #ffcce6
  4 - sent - odeslána - #e6f1d3
  5 - closed - uzavřena  - #a8cf6d
  10 - storno - #ffc4c4
 
*/
DEFINE('arrStatus', array ('#ebebeb', '#ffffd5', '#ceffff', '#ffcce6', '#e6f1d3', '#a8cf6d', '', '', '', '', '#ffc4c4'));


?>