<?php
header("Access-Control-Allow-Origin: *");

require('./db.php');
$db = pg_connect($db) or die('Could not connect');   

$sql = "SELECT name,webimage,add,lat,long FROM labcovid; ";
     
$result = pg_query($db,$sql);
$coursesArray = array();
    
while ($row = pg_fetch_assoc($result)) {
  $coursesArray[] = $row;
}
echo json_encode($coursesArray);
?>