<?php
DEFINE('tpfx', 'ws_');
$dbMsg = '';

//echo $_SERVER['REQUEST_URI']; exit;

$whitelist = array(
    '127.0.0.1',
    '::1'
);
$bIsLocalhost = false;
if(in_array($_SERVER['REMOTE_ADDR'], $whitelist)){
    $bIsLocalhost = true;
}
DEFINE('rootDir', ($bIsLocalhost ? '/' : '/'));
if($bIsLocalhost)
{
  $mysqli = new mysqli('localhost', 'root', '', 'work_scheduler');
}
else
{
  $mysqli = new mysqli('localhost', 'hand-peezee', '497871', 'hand-peezee');

  //$mysqli = new mysqli('localhost', 'handmadenet', 'uUtVmqmFLZdHRQKd', 'hand-peezee'); // -- https://handmade.weby.cz/phpmyadmin/
}

if ($mysqli->connect_error) {
    die('Nepodařilo se připojit k MySQL serveru (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error);
}
else
{
  $dbMsg = 'DB připojeno!<br>';
  $mysqli->set_charset ( 'utf8' );
}
//---------------------------------------------------------------------------------------------------------------
function sqlEXEC($mysqli, $sql, $DBG =  null)
{
  $result = $mysqli->query($sql);
  if (!$result)
  {
    echo "<br>NELZE $sql<br>" . $mysqli->error; exit; 
  }
  return $result;
} 
//---------------------------------------------------------------------------------------------------------------
function EXIST($mysqli, $table, $col, $value, $DBG =  null)
{
  $sql = "SELECT pk". $table . " FROM " . tpfx. $table . " WHERE " . $col . "='".$value."'";
  //echo $sql . "<br />";// exit;
  try
  {
    $result = sqlEXEC($mysqli, $sql);
  }
  catch(Exception $e)
  {
    echo $e->getMessage();
    exit();
  }
  if($result->num_rows>0){$rs=$result->fetch_array(MYSQLI_BOTH);return $rs["pk".$table];}else{return false;}
}
//---------------------------------------------------------------------------------------------------------------
function Cols($mysqli, $table, $pfx = '')
{
  global $DBG;
  $cols = "";
  $sql = "SELECT * FROM " . tpfx . $table . " LIMIT 1";
  
  $result = sqlEXEC($mysqli, $sql, $DBG);
  $columns = $mysqli->num_fields($result);

      for($i = 0; $i < $columns; $i++) 
      {
        $name = $mysqli->_field_name($result,$i);
        $cols.= $pfx.$name.", ";
      }
    
    $cols = substr( $cols, 0, strlen($cols)-2);
  
  return $cols;
}
//---------------------------------------------------------------------------------------------------------------
function Row ( $mysqli, $tbl="", $col="", $where="", $limit='LIMIT 1', $start=true, $view=false )
{
  global $DBG;
	$sql="SELECT " . $col . " FROM " . tpfx . $tbl . " " . $where . " " . $limit;
	if($view)
	  echo $sql . "<br />";
	$result = sqlEXEC($mysqli, $sql, $DBG); 
	if($result->num_rows > 0){$rs=$result->fetch_array(MYSQLI_BOTH);return $rs[$col];}else{return false;}
}
//---------------------------------------------------------------------------------------------------------------
function RowAs ( $mysqli, $tbl="", $col="", $as = "", $where="", $limit='LIMIT 1', $start=true, $view=false )
{
  global $DBG;
	$sql="SELECT " . $col . " as " . $as . " FROM " . tpfx . $tbl . " " . $where . " " . $limit;
	if($view)
	  echo $sql . "<br />";
	$result = sqlEXEC($mysqli, $sql, $DBG); 
	if($result->num_rows > 0){$rs=$result->fetch_array(MYSQLI_BOTH);return $rs[$as];}else{return false;}
}
//---------------------------------------------------------------------------------------------------------------
function RowAsNoErr ( $mysqli, $tbl="", $col="", $as = "", $where="", $limit='LIMIT 1', $start=true, $view=false )
{
  global $DBG;
	$sql="SELECT " . $col . " as " . $as . " FROM " . tpfx . $tbl . " " . $where . " " . $limit;
	if($view)
	  echo $sql . "<br />";
	$result = $mysqli->query($sql); 
	if($result->num_rows > 0){$rs=$result->fetch_array(MYSQLI_BOTH);return $rs[$as];}else{return false;}
}
//---------------------------------------------------------------------------------------------------------------
function sqlCount ( $tbl="", $col="", $where="", $limit=1, $start=true, $view=false )
{
  global $DBG;
	$sql="SELECT count($col) as c FROM $tbl $where $limit";
	if($view)
	  echo $sql . "<br />";
	$result = sqlEXEC($mysqli, $sql, $DBG);
	if($mysqli->num_rows($result)>0){$rs=$mysqli->fetch_array($result);return $rs['c'];}else{return 0;}
} 
  
?>