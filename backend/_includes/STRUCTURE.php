<?php
  $STRUCTURE = new STRUCTURE($mysqli);
  $STRUCTURE->TABLEbySTEP($mysqli, 'USERS');
  $STRUCTURE->TABLEbySTEP($mysqli, 'USERS');
  
  
  
class STRUCTURE
{

  private  $_structure;
  private  $_output = "";
  private  $_errors =  array();
  private  $_msgs =  array();
	private  $_action = "";
  private  $_mysqli;
  public function __construct($mysqli)
  {
    global $DBG;
    
    $this->_structure = array
    (
        'USERS' => array
        (
          'tables' => array
          (
            'users' =>  array (
                                'cols' => array (
                                      'id'   => "int(11) NOT NULL AUTO_INCREMENT"
                                     ,'createdAt' => "datetime"
                                     ,'updatedAt' => "datetime"
                                     ,'lastlogin' => "datetime"
                                     ,'fkLang'    => "INT(11) NOT NULL DEFAULT 1"
                                     ,'function'  => "INT(11) NOT NULL DEFAULT 9999"
                                     ,'nick'      => "VARCHAR(255) NOT NULL DEFAULT ''"
                                     ,'email'     => "VARCHAR(255) NOT NULL DEFAULT ''"
                                     ,'phone'     => "VARCHAR(20) NOT NULL DEFAULT ''"
                                     ,'photo'     => "VARCHAR(255) NOT NULL DEFAULT ''"
                                     ,'psw'       => "VARCHAR(100) NOT NULL DEFAULT ''"
                                     ,'uniqueID'  => "varchar(40) NOT NULL DEFAULT ''"
                                     ,'resetID'   => "varchar(40) NOT NULL DEFAULT ''"
                                     ,'resetDatetime' => "datetime"
                                     ,'disable'   => "BOOLEAN NOT NULL DEFAULT FALSE"
                                     ,'active'    => "BOOLEAN NOT NULL DEFAULT FALSE"
                                     ,'name'      => "VARCHAR(255) NOT NULL DEFAULT ''"
                                     ,'fname'     => "VARCHAR(255) NOT NULL DEFAULT ''"
                                     ,'lname'     => "VARCHAR(255) NOT NULL DEFAULT ''"
                                     ,'gender'    => "VARCHAR(10) NOT NULL DEFAULT ''"
                                     ,'birthday'  => "datetime"
                                     
                                     ,'address'   => "VARCHAR(255) NOT NULL DEFAULT ''"
                                     ,'city'      => "VARCHAR(255) NOT NULL DEFAULT ''"
                                     ,'zipcode'   => "VARCHAR(8) NOT NULL DEFAULT ''"
                                     ,'firm'      => "VARCHAR(255) NOT NULL DEFAULT ''"
                                     ,'ico'       => "VARCHAR(20) NOT NULL DEFAULT ''"
                                     ,'dic'       => "VARCHAR(20) NOT NULL DEFAULT ''"
                                     ,'bank'      => "VARCHAR(255) NOT NULL DEFAULT ''"
                                     ,'bu'        => "VARCHAR(255) NOT NULL DEFAULT ''"
                                 ),
                                'alter'=> array (
                                  'email email' => "VARCHAR(255) NOT NULL DEFAULT ''"
                                 ),
                                'insert' => array ( 'sql' => 'INSERT INTO ' . tpfx . 'users (function, nick, email, phone, psw, active, name, fname, lname, uniqueID, createdAt, gender) ' . 
                                                                                'VALUES (1, \'Paya\', \'p.zrubek@gmail.com\', \'+420608116126\', \'' . GF::Encrypt('admin') . '\', 1, \'Pavel Zrubek\', \'Pavel\', \'Zrubek\', \'' . GF::Generator('mix', 20) . '\', \'' . Date('Y-m-d H:i:s') . '\', \'man\')' . 
                                                                                ', (9999, \'sweetboi\', \'sweetboi@seznam.cz\', \'+420608116126\', \'' . GF::Encrypt('reader') . '\', 1, \'Pee Zee\', \'Pee\', \'Zee\', \'' . GF::Generator('mix', 20) . '\', \'' . Date('Y-m-d H:i:s') . '\', \'woman\')'
                                             )
                              )
          )
        ),
        'EVENTS' => array
        (
          'tables' => array
          (
            'events' =>  array (
                                'cols' => array (
                                      'id'   => "int(11) NOT NULL AUTO_INCREMENT"
                                     ,'id_user'    => "INT(11) NOT NULL DEFAULT 1"
                                     ,'startEvent' => "datetime"
                                     ,'endEvent' => "datetime"
                                     ,'createdAt' => "datetime"
                                     ,'updatedAt' => "datetime"
                                     ,'typeEvent'    => "INT(11) NOT NULL DEFAULT 1"
                                     ,'event'     => "VARCHAR(1048) NOT NULL DEFAULT ''"
                                     ,'disable'   => "BOOLEAN NOT NULL DEFAULT FALSE"
                                     ,'visible'    => "BOOLEAN NOT NULL DEFAULT TRUE"
                                 )
                              )
          )
        )
      );
  }
  

  //---------------------------------------------------------------------------------------------------------------------
  
	//---------------------------------------------------------------------------------------------------------------------
  public function TABLEbySTEP($mysqli, $step)
  {
    $createTable = '';
    $alterTable = '';
    //-- CREATE TABLE + ADDCOL -----------------------------------------
    $arr = $this->_structure[strtoupper($step)]['tables'];
    reset($arr);
    
    $table = key($arr);
    $createTable .= 'CREATE TABLE IF NOT EXISTS ' . tpfx . '' . $table . ' (';
    $alterTable .= '';
    for($a=0; $a<count($arr); $a++)
    {
      
      foreach($this->_structure[strtoupper($step)]['tables'][$table]['cols'] as $k => $v)
      {
        $createTable .= $k . " " . $v . ", ";
      }
      next($arr);
    }
                                                
    //-- ALTERCOL ---------------------------------------
    $arr = $this->_structure[strtoupper($step)]['tables'];
    reset($arr);
    $table = key($arr);
    for($a=0; $a<count($arr); $a++)
    {
      
      if(isset($this->_structure[strtoupper($step)]['tables'][$table]['alter']))
      {
        foreach($this->_structure[strtoupper($step)]['tables'][$table]['alter'] as $k => $v)
        {
          $col = explode(' ', $k);
          //$alterTable .= 'ALTER TABLE ' . tpfx . '' . $table . ' CHANGE COLUMN ' $k . "" . $v . ";";
        }
      }
      next($arr);
    }

    $createTable .= ' PRIMARY KEY (pk'.$table.')) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;';
    //echo $createTable . "<br />";
    //echo $alterTable . "<br />";
    
    if($mysqli -> query($createTable) === true)
    {
      //echo 'tabulka vytvo�ena<br />';
    }
    else
    {
      echo 'tabulka ' . $table . ' NENI vytvo�ena<br />';
      echo 'Error: '. $mysqli->error;
    }
    
    //print_r($this->_structure[strtoupper($step)]['tables'][strtolower($table)]['insert']);
    //echo '<br />';

    //echo (Row($mysqli, 'admins', 'pkAdmins', 'WHERE pkAdmins = 1', '', true, true) ? 'true' : 'false') . '<br />';
    
    //-- INSERT -----------------------------------------
    if(isset($this->_structure[strtoupper($step)]['tables'][strtolower($table)]['insert']['sql']))
    {
      if(true || !Row($mysqli, 'users', 'pkUsers', 'WHERE pkUsers = 1', '', true, false))
      {
        foreach($this->_structure[strtoupper($step)]['tables'][strtolower($table)]['insert'] as $k => $v)
        {
            //echo $k . ' = ' . $v . "<br />";
            //echo (EXIST($mysqli, $table, 'pk' . $table, '1', '') ? 'true' : 'false') . '<br />';
            
            If(EXIST($mysqli, $table, 'pk' . $table, '1', '') === false)
            {
              //echo $k . ' = ' . $v . "<br />";
              sqlEXEC($mysqli, $v, $DBG);
            }
        }
      } 
    }   
  }
  
  //---------------------------------------------------------------------------------------------------------------------
  public function getStructure()
  {
    return (isset($this->_structure)?$this->_structure:'');
  }
  //---------------------------------------------------------------------------------------------------------------------
  public function getData($key, $block)
  {
    return (isset($this->_structure[$key][$block])?$this->_structure[$key][$block]:'');
  }
  //---------------------------------------------------------------------------------------------------------------------
  public function getDataValue($key, $block, $k)
  {
    return (isset($this->_structure[$key][$block][$k])?$this->_structure[$key][$block][$k]:'');
  }
  //---------------------------------------------------------------------------------------------------------------------
  public function getErrors()
  {
    $output = "";
    foreach($this->_errors as $v)
    {
      $output.= $v."<br />";
    }
    return $output;
  }
  //---------------------------------------------------------------------------------------------------------------------
  public function getMsg()
  {
    $output = "";
    foreach($this->_msgs as $v)
    {
      $output.= $v."";
    }
    return $output . GF::QS('msg');
  }
  //---------------------------------------------------------------------------------------------------------------------
}




?>