<?php
header("Access-Control-Allow-Origin: *");

$hostname_db = "119.59.125.134";
$database_db = "coviddb";
$username_db = "postgres";
$password_db = "Pgis@rti2dss@2020";

$db = pg_connect("host=$hostname_db user=$username_db password=$password_db dbname=$database_db") or die("Can't Connect Server");

pg_query("SET client_encoding = 'utf-8'");






$sql = "select *,ST_AsGeoJSON(geom) AS geojson from covidcase; ";
   


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
         'place_name' => $edge['place_name'],
         'lat' => $edge['lat'],
         'lon' => $edge['lon'],
         'case_numbe' => $edge['case_numbe'],
         'date_start' => $edge['date_start'],
         'status_new' => $edge['status_new'],
         'status_pat' => $edge['status_pat'],
         'descriptio' => $edge['descriptio'],
         'ref_source' => $edge['ref_source'],
         'link_news' => $edge['link_news'],
         'tb_code' => $edge['tb_code'],
         'tb_th' => $edge['tb_th'],
         'ap_th' => $edge['ap_th'],
         'pro_th' => $edge['pro_th'],
         'postcode' => $edge['postcode'],
         'age' => $edge['age'],
         'gender' => $edge['gender']
      )
   );
   
   array_push($geojson['features'], $feature);
}
echo json_encode($geojson);



?>