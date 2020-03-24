<?php
header("Access-Control-Allow-Origin: *");


$hostname_db = "119.59.125.134";
$database_db = "coviddb";
$username_db = "postgres";
$password_db = "Pgis@rti2dss@2020";

$db = pg_connect("host=$hostname_db user=$username_db password=$password_db dbname=$database_db") or die("Can't Connect Server");

pg_query("SET client_encoding = 'utf-8'");



if($_POST[check_list] == 'true'){
    $name_request = $_POST[name_request];
    $address_request = $_POST[address_request];
    $details_request = $_POST[details_request];
    $mask = $_POST[mask];
    $gel = $_POST[gel];
    $alcohol = $_POST[alcohol];
    $food = $_POST[food];
    $medical_tools = $_POST[medical_tools];
    $medicine = $_POST[medicine];
    $lat = $_POST[lat];
    $lon = $_POST[lon];
    
     $date_now = date("Y/m/d");
    
    $sql = "INSERT INTO volunteer (name_request, address_request, details_request, mask, gel, alcohol, food, medical_tools, medicine, lat, lon, donate_date) VALUES ('$name_request','$address_request','$details_request ','$mask ','$gel','$alcohol','$food','$medical_tools','$medicine','$lat','$lon','$date_now')" ;
    
    
    $insert = pg_query($sql) ; 
        if($insert){
            echo '{ "insert":"true"}';
        }else{
            echo  '{ "insert":"false"}';
        }
}else{
    echo  '{ "insert":"false"}';
}
  




?>