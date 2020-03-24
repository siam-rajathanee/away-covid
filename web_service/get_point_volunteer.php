<?php
header("Access-Control-Allow-Origin: *");

$date = $_GET['date'];

$hostname_db = "119.59.125.134";
$database_db = "coviddb";
$username_db = "postgres";
$password_db = "Pgis@rti2dss@2020";

$db = pg_connect("host=$hostname_db user=$username_db password=$password_db dbname=$database_db") or die("Can't Connect Server");

pg_query("SET client_encoding = 'utf-8'");




$sql = "select *
from volunteer
WHERE status_request = 'ร้องขอ'  ; ";

$result = pg_query( $sql);
$coursesArray = array();

while ($row = pg_fetch_assoc($result)) {
$coursesArray[] = $row;
}
echo json_encode($coursesArray);



?>