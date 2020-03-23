<?php
$hostname_db = "119.59.125.134";
$database_db = "coviddb";
$username_db = "postgres";
$password_db = "Pgis@rti2dss@2020";

$db = pg_connect("host=$hostname_db user=$username_db password=$password_db dbname=$database_db") or die("Can't Connect Server");

pg_query("SET client_encoding = 'utf-8'");


header("Access-Control-Allow-Origin: *");


if($_GET[type] == 'geojson_1'){

    $sql = "select pv_th , count(a.no) ,ST_AsGeoJSON(geom) AS geojson 
    from covid_dga a 
    full join province b 
    on a.province = b.pv_covid
    group by geom, pv_th ; ";
       
    
    
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
             'pv_th' => $edge['pv_th'],
             'count' => number_format($edge['count'])
          )
       );
       
       array_push($geojson['features'], $feature);
    }
    echo json_encode($geojson);
}



if($_GET[type] == 'chart_1'){

    $sql = "SELECT * FROM   covid_dga order by date asc;";
    $result = pg_query( $sql);
    $coursesArray = array();
    
    while ($row = pg_fetch_assoc($result)) {
    $coursesArray[] = $row;
    }
    echo json_encode($coursesArray);
}
?>