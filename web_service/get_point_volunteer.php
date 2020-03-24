<?php
header("Access-Control-Allow-Origin: *");

$date = $_GET['date'];

$hostname_db = "119.59.125.134";
$database_db = "coviddb";
$username_db = "postgres";
$password_db = "Pgis@rti2dss@2020";

$db = pg_connect("host=$hostname_db user=$username_db password=$password_db dbname=$database_db") or die("Can't Connect Server");

pg_query("SET client_encoding = 'utf-8'");




$sql = "select *,  ST_AsGeoJSON(ST_SetSRID(ST_Point(lon, lat), 4326)) as geojson
from volunteer
WHERE status_request = 'ร้องขอ' 
 ; ";

      


$query = pg_query($db,$sql);   
$geojson = array(
   'type'      => 'FeatureCollection',
   'features'  => array()
); 

while($edge=pg_fetch_assoc($query)) {  
   $feature = array(
      'type' => 'Feature',
      'geometry' => json_decode($edge['geojson'], true),
      'crs' => array(
         'type' => 'EPSG',
         'properties' => array('code' => '4326')
      ),
         'properties' => array(
         'gid' => $edge['gid'],
         'name_request' => $edge['name_request'],
         'address_request' => $edge['address_request'],
         'details_request' => $edge['details_request'],
         'mask' => $edge['mask'],
         'gel' => $edge['gel'],
         'alcohol' => $edge['alcohol'],
         'food' => $edge['food'],
         'medical_tools' => $edge['medical_tools'],
         'medicine' => $edge['medicine'],
         'lat' => $edge['lat'],
         'lon' => $edge['lon'],
         'donate_date' => $edge['donate_date'],
         'status_request' => $edge['status_request'],
         'type_request' => $edge['type_request']
      )
   );   
   array_push($geojson['features'], $feature);
}
echo json_encode($geojson);



?>