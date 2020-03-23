<?php
$hostname_db = "119.59.125.134";
$database_db = "coviddb";
$username_db = "postgres";
$password_db = "Pgis@rti2dss@2020";



$db = pg_connect("host=$hostname_db user=$username_db password=$password_db dbname=$database_db") or die("Can't Connect Server");

pg_query("SET client_encoding = 'utf-8'");
define("TOKEN", "secret-token");
define("REMOTE_REPOSITORY", "git@github.com:username/custom-project.git");
define("DIR", "/var/www/vhosts/repositories/custom-project");
define("BRANCH", "refs/heads/master");
define("LOGFILE", "deploy.log");
define("GIT", "/usr/bin/git");
define("MAX_EXECUTION_TIME", 180);
define("BEFORE_PULL", "/usr/bin/git reset --hard @{u}");
define("AFTER_PULL", "/usr/bin/node ./node_modules/gulp/bin/gulp.js default");

header("Access-Control-Allow-Origin: *");




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
         'pv_code' => $edge['pv_code'],
         'prov_nam_t' => $edge['pv_tn'],
         'value_sum' => $edge['std_ped'],
         'value' => number_format($edge['std_ped'])
      )
   );
   
   array_push($geojson['features'], $feature);
}
echo json_encode($geojson);



?>