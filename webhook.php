<?php 


date_default_timezone_set("Asia/Bangkok");
	/*Get Data From POST Http Request*/
	$datas = file_get_contents('php://input');
	/*Decode Json From LINE Data Body*/
	$deCode = json_decode($datas,true);

	file_put_contents('log.txt', file_get_contents('php://input') . PHP_EOL, FILE_APPEND);

	$replyToken = $deCode['events'][0]['replyToken'];
	$userId = $deCode['events'][0]['source']['userId'];
	$text = $deCode['events'][0]['message']['text'];
?>


<script src='https://unpkg.com/@turf/turf/turf.min.js'></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
<p id="demo"></p>


<?php 
	$messages = [];
	$messages['replyToken'] = $replyToken;

	if ($text == 'โปรดเลือก') {
		$messages['messages'][0] = handleMessage($text);
	} else if ($text == 'ตรวจสอบ') {
		$messages['messages'][0] = chkStatus($text);
	} else if ($text == 'แจ้งเป็นผู้ป่วย') {
		$messages['messages'][0] = chkStatus($text);
	}
	$encodeJson = json_encode($messages);
?>


<script  type="text/javascript">

document.getElementById("demo").textContent = JSON.stringify({
                "type": "flex",
                "altText": "Flex Message",
                "contents": {
                "type": "bubble",
                "size": "mega",
                "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [{
                        "type": "box",
                        "layout": "vertical",
                        "contents": [{
                                "type": "text",
                                "text": "ผลการค้นหา!!",
                                "color": "#ffffff",
                                "size": "sm"
                            },
                            {
                                "type": "text",
                                "text": "คุณไม่มีประวัติเข้าพื้นที่เสี่ยง",
                                "color": "#ffffff",
                                "size": "xl",
                                "flex": 4,
                                "weight": "bold"
                            }
                        ]
                    }],
                    "paddingAll": "20px",
                    "backgroundColor": "#00b300",
                    "spacing": "md",
                    "height": "104px",
                    "paddingTop": "22px"
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [{
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [


                            {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [{
                                        "type": "filler"
                                    },
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [{
                                            "type": "filler"
                                        }],
                                        "cornerRadius": "30px",
                                        "height": "12px",
                                        "width": "12px",
                                        "borderColor": "#00b300",
                                        "borderWidth": "2px"
                                    },
                                    {
                                        "type": "filler"
                                    }
                                ],
                                "flex": 0
                            },
                            {
                                "type": "text",
                                "text": "สถานรับตรวจโควิด-19 ที่ใกล้ที่สุด",
                                "gravity": "center",
                                "size": "sm"
                            }
                        ],
                        "spacing": "lg",
                        "cornerRadius": "30px",
                        "margin": "xl"
                    }, {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [


                            {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [{
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [{
                                            "type": "filler"
                                        },
                                        {
                                            "type": "box",
                                            "layout": "vertical",
                                            "contents": [{
                                                "type": "filler"
                                            }],
                                            "width": "2px",
                                            "backgroundColor": "#B7B7B7"
                                        },
                                        {
                                            "type": "filler"
                                        }
                                    ],
                                    "flex": 1
                                }],
                                "width": "12px"
                            },
                            {
                                "type": "text",
                                "text": "name_hospital",
                                "gravity": "center",
                                "flex": 4,
                                "size": "sm"
                            }
                        ],
                        "spacing": "lg",
                        "cornerRadius": "30px",
                        "margin": "xl"
                    }, {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [{
                                "type": "box",
                                "layout": "vertical",
                                "contents": [{
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [{
                                            "type": "filler"
                                        },
                                        {
                                            "type": "box",
                                            "layout": "vertical",
                                            "contents": [{
                                                "type": "filler"
                                            }],
                                            "width": "2px",
                                            "backgroundColor": "#B7B7B7"
                                        },
                                        {
                                            "type": "filler"
                                        }
                                    ],
                                    "flex": 1
                                }],
                                "width": "12px"
                            },
                            {
                                "type": "text",
                                "text": "ระยะห่าง :  + distance_hos.toFixed(2) + กม.",
                                "gravity": "center",
                                "flex": 4,
                                "size": "xs",
                                "color": "#b30000"
                            }
                        ],
                        "spacing": "lg",
                        "height": "64px"
                    }]
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "sm",
                    "contents": [{
                            "type": "button",
                            "style": "link",
                            "height": "sm",
                            "action": {
                                "type": "uri",
                                "label": "ดูประวัติเส้นทาง",
                                "uri": "https://linecorp.com"
                            }
                        },
                        {
                            "type": "spacer",
                            "size": "sm"
                        }
                    ],
                    "flex": 0,
                    "backgroundColor": "#e6e6e6"
                }
            }
            });
 











json_user  = <?php 
$sql_user = "SELECT *,ST_AsGeoJSON(ST_SetSRID(ST_Point(lng, lat), 4326)) as geojson 
	FROM tracking_line 
	where userid = 'Uac75c4babcd74ff01cc3faa0efa2a4b2' 
	order by date_view asc;";
        $query = pg_query($db,$sql_user);   
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
                 'no' => $edge['no'],
                 'pictureurl' => $edge['pictureurl'],
                 'userid' => $edge['userid'],
                 'displayname' => $edge['displayname'],
                 'decodedidtoken' => $edge['decodedidtoken'],
                 'lat' => $edge['lat'],
                 'lng' => $edge['lng'],
                 'date_view' => $edge['date_view']
              )
           );   
           array_push($geojson['features'], $feature);
        }
		echo json_encode($geojson);
		
		$count_json_user = pg_num_rows($query);


		$sql111 = "SELECT *,ST_AsGeoJSON(ST_SetSRID(ST_Point(lng, lat), 4326)) as geojson 
		FROM tracking_line 
		where userid = 'Uac75c4babcd74ff01cc3faa0efa2a4b2' 
		order by date_view desc limit 1;";
		$query2 = pg_query($db,$sql111); 
		$arr = pg_fetch_array($query2);
		
	
?>

json_hospital = <?php
$lat = $arr['lat'];
$lng = $arr['lng'];
$sql_hospital = 'Select *,ST_AsGeoJSON(geom) as geojson,ST_Distance(geom,ST_SetSRID(ST_Point('.$lng.', '.$lat.'), 4326)::geography) as st_distance from labcovid  order by st_distance asc limit 1';
$query3 = pg_query($db,$sql_hospital);   
	 $geojson = array(
		'type'      => 'FeatureCollection',
		'features'  => array()
	 ); 
	 while($edge=pg_fetch_assoc($query3)) {  
		$feature = array(
		   'type' => 'Feature',
		   'geometry' => json_decode($edge['geojson'], true),
		   'crs' => array(
			  'type' => 'EPSG',
			  'properties' => array('code' => '4326')
		   ),
			  'properties' => array(
			  'no' => $edge['no'],
			  'name' => $edge['name'],
			  'st_distance' => $edge['st_distance']/1000
		   )
		);   
		array_push($geojson['features'], $feature);
	 }
echo json_encode($geojson);


$query3 = pg_query($db,$sql_hospital); 
$arr_hos = pg_fetch_array($query3);

get_hos($arr_hos[name] , $arr_hos[st_distance]/1000);

?>


json_pui  = <?php 
  $sql_pui = "SELECT *,ST_AsGeoJSON(ST_SetSRID(ST_Point(lng, lat), 4326)) as geojson from notify_casepui a 
    inner join tracking_line b  
    on a.userid = b.userid where status = 'Positive' order by date_view asc  ;";

   $query = pg_query($db,$sql_pui);   
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
                 'no' => $edge['no'],
                 'date_pui' => $edge['date_pui'],
                 'pictureurl' => $edge['pictureurl'],
                 'userid' => $edge['userid'],
                 'displayname' => $edge['displayname'],
                 'decodedidtoken' => $edge['decodedidtoken'],
                 'lat' => $edge['lat'],
                 'lng' => $edge['lng'],
                 'date_view' => $edge['date_view']
              )
           );   
           array_push($geojson['features'], $feature);
        }
		echo json_encode($geojson);
?>



<?php 
chkStatus($text);
function chkStatus($text){
	
	if($count_json_user  != 0 ){
	

		$datas = array (
			'type' => 'flex',
			'altText' => 'Flex Message',
			'contents' => 
			array (
			'type' => 'bubble',
			'size' => 'mega',
			'header' => 
			array (
				'type' => 'box',
				'layout' => 'vertical',
				'contents' => 
				array (
				0 => 
				array (
					'type' => 'box',
					'layout' => 'vertical',
					'contents' => 
					array (
					0 => 
					array (
						'type' => 'text',
						'text' => 'ผลการค้นหา!!',
						'color' => '#ffffff',
						'size' => 'sm',
					),
					1 => 
					array (
						'type' => 'text',
						'text' => 'คุณไม่มีประวัติบันทึกเส้นทาง',
						'color' => '#ffffff',
						'size' => 'xl',
						'flex' => 4,
						'weight' => 'bold',
					),
					),
				),
				),
				'paddingAll' => '20px',
				'backgroundColor' => '#00b300',
				'spacing' => 'md',
				'height' => '104px',
				'paddingTop' => '22px',
			),
			),
		);
		return $datas;

	}else{   
		

	echo "	let json_check = []
		json_pui.features.forEach(e => {
			var d2 = new Date(e.properties.date_pui),
				month2 = '' + (d2.getMonth() + 1),
				day2 = '' + d2.getDate() - 14,
				year2 = d2.getFullYear();
			if (month2.length < 2)
				month2 = '0' + month2;
			if (day2.length < 2)
				day2 = '0' + day2;
			let date_pui = [year2, month2, day2].join('-');


			let date_json = e.properties.date_view
			var d = new Date(date_json),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();
			if (month.length < 2)
				month = '0' + month;
			if (day.length < 2)
				day = '0' + day;
			let date_view = [year, month, day].join('-');



			var buffered_pui = turf.buffer(e, 0.1, { units: 'kilometers' });
			var ptsWithin = turf.pointsWithinPolygon(json_user, buffered_pui);

			ptsWithin.features.forEach(element => {
				let date_within = element.properties.date_view
				var d = new Date(date_within),
					month = '' + (d.getMonth() + 1),
					day = '' + d.getDate(),
					year = d.getFullYear();
				if (month.length < 2)
					month = '0' + month;
				if (day.length < 2)
					day = '0' + day;
				let date_target = [year, month, day].join('-');


				if (date_view == date_target && date_target > date_pui) {
					json_check.push(element)
				}

			});
		});


		let json_comfirm = []
		for (let i = 0; i < json_check.length; i++) {
			var lat = json_check[i].properties.lat
			var lon = json_check[i].properties.lng
			if (i < 1) {
					$.getJSON('https://locationiq.org/v1/reverse.php?key=06e95f2c5c85dd&lat=' + lat + '&lon=' + lon + '&format=json',
					function (data_pui) {
						json_check[i].properties.display_name = data_pui.display_name
					})
				json_comfirm.push(json_check[i])
			} else {

				var distance = turf.distance(json_check[i], json_check[i - 1], { units: 'kilometers' });
				if (distance > 0.1) {
						$.getJSON('https://locationiq.org/v1/reverse.php?key=06e95f2c5c85dd&lat=' + lat + '&lon=' + lon + '&format=json',
						function (data_pui) {
							json_check[i].properties.display_name = data_pui.display_name
						})
					json_comfirm.push(json_check[i])
				}
			}
		}
		lat = json_user.features[0].properties.lat
		lng = json_user.features[0].properties.lng
		console.log(json_comfirm);
		";
		
	
		
		} 
	}
?>
</script>

<?php 
	get_hos($arr_hos[name] , $arr_hos[st_distance]/1000);
function get_hos($name , $st_distacnce){

	$datas = array (
		'type' => 'flex',
		'altText' => 'Flex Message',
		'contents' => 
		array (
		'type' => 'bubble',
		'size' => 'mega',
		'header' => 
		array (
			'type' => 'box',
			'layout' => 'vertical',
			'contents' => 
			array (
			0 => 
			array (
				'type' => 'box',
				'layout' => 'vertical',
				'contents' => 
				array (
				0 => 
				array (
					'type' => 'text',
					'text' => 'ผลการค้นหา!!',
					'color' => '#ffffff',
					'size' => 'sm',
				),
				1 => 
				array (
					'type' => 'text',
					'text' => 'คุณไม่มีประวัติเข้าพื้นที่เสี่ยง',
					'color' => '#ffffff',
					'size' => 'xl',
					'flex' => 4,
					'weight' => 'bold',
				),
				),
			),
			),
			'paddingAll' => '20px',
			'backgroundColor' => '#00b300',
			'spacing' => 'md',
			'height' => '104px',
			'paddingTop' => '22px',
		),
		'body' => 
		array (
			'type' => 'box',
			'layout' => 'vertical',
			'contents' => 
			array (
			0 => 
			array (
				'type' => 'box',
				'layout' => 'horizontal',
				'contents' => 
				array (
				0 => 
				array (
					'type' => 'box',
					'layout' => 'vertical',
					'contents' => 
					array (
					0 => 
					array (
						'type' => 'filler',
					),
					1 => 
					array (
						'type' => 'box',
						'layout' => 'vertical',
						'contents' => 
						array (
						0 => 
						array (
							'type' => 'filler',
						),
						),
						'cornerRadius' => '30px',
						'height' => '12px',
						'width' => '12px',
						'borderColor' => '#00b300',
						'borderWidth' => '2px',
					),
					2 => 
					array (
						'type' => 'filler',
					),
					),
					'flex' => 0,
				),
				1 => 
				array (
					'type' => 'text',
					'text' => 'สถานรับตรวจโควิด-19 ที่ใกล้ที่สุด',
					'gravity' => 'center',
					'size' => 'sm',
				),
				),
				'spacing' => 'lg',
				'cornerRadius' => '30px',
				'margin' => 'xl',
			),
			1 => 
			array (
				'type' => 'box',
				'layout' => 'horizontal',
				'contents' => 
				array (
				0 => 
				array (
					'type' => 'box',
					'layout' => 'vertical',
					'contents' => 
					array (
					0 => 
					array (
						'type' => 'box',
						'layout' => 'horizontal',
						'contents' => 
						array (
						0 => 
						array (
							'type' => 'filler',
						),
						1 => 
						array (
							'type' => 'box',
							'layout' => 'vertical',
							'contents' => 
							array (
							0 => 
							array (
								'type' => 'filler',
							),
							),
							'width' => '2px',
							'backgroundColor' => '#B7B7B7',
						),
						2 => 
						array (
							'type' => 'filler',
						),
						),
						'flex' => 1,
					),
					),
					'width' => '12px',
				),
				1 => 
				array (
					'type' => 'text',
					'text' => $name,
					'gravity' => 'center',
					'flex' => 4,
					'size' => 'sm',
				),
				),
				'spacing' => 'lg',
				'cornerRadius' => '30px',
				'margin' => 'xl',
			),
			2 => 
			array (
				'type' => 'box',
				'layout' => 'horizontal',
				'contents' => 
				array (
				0 => 
				array (
					'type' => 'box',
					'layout' => 'vertical',
					'contents' => 
					array (
					0 => 
					array (
						'type' => 'box',
						'layout' => 'horizontal',
						'contents' => 
						array (
						0 => 
						array (
							'type' => 'filler',
						),
						1 => 
						array (
							'type' => 'box',
							'layout' => 'vertical',
							'contents' => 
							array (
							0 => 
							array (
								'type' => 'filler',
							),
							),
							'width' => '2px',
							'backgroundColor' => '#B7B7B7',
						),
						2 => 
						array (
							'type' => 'filler',
						),
						),
						'flex' => 1,
					),
					),
					'width' => '12px',
				),
				1 => 
				array (
					'type' => 'text',
					'text' => $st_distacnce,
					'gravity' => 'center',
					'flex' => 4,
					'size' => 'xs',
					'color' => '#b30000',
				),
				),
				'spacing' => 'lg',
				'height' => '64px',
			),
			),
		),
		'footer' => 
		array (
			'type' => 'box',
			'layout' => 'vertical',
			'spacing' => 'sm',
			'contents' => 
			array (
			0 => 
			array (
				'type' => 'button',
				'style' => 'link',
				'height' => 'sm',
				'action' => 
				array (
				'type' => 'uri',
				'label' => 'ดูประวัติเส้นทาง',
				'uri' => 'https://linecorp.com',
				),
			),
			1 => 
			array (
				'type' => 'spacer',
				'size' => 'sm',
			),
			),
			'flex' => 0,
			'backgroundColor' => '#e6e6e6',
		),
		),
	);
	return $datas;
}
?>

<?php 

	$LINEDatas['url'] = "https://api.line.me/v2/bot/message/reply";
  	$LINEDatas['token'] = "v08YJenTsRxTov+OTBTdk2fukASZ4csDN1A7i1+z4MWYUKWu0NPZP454ZZL0iNi+o9f6EVX+LpMEjRd72PBkEVFiE7Y5WOnPvc83U4zlTuvFhTe1aYLHLFCAGKgB4yZAgj79ajR1meMHbdvbuKZi7wdB04t89/1O/w1cDnyilFU=";

  	$results = sentMessage($encodeJson,$LINEDatas);

	/*Return HTTP Request 200*/
	http_response_code(200);


	function handleMessage($text)
	{
		$datas = array (
			'type' => 'text',
			'text' => 'ท่านสามารถคลิกเลือกตรวจสอบประวัติเข้าพื้นที่เสี่ยงหรือแจ้งเป็นผู้ป่วย',
			'quickReply' => 
			array (
			  'items' => 
			  array (
				0 => 
				array (
				  'type' => 'action',
				  'imageUrl' => 'https://cdn4.iconfinder.com/data/icons/coronavirus-flat/64/recovery-recuperation-convalescence-winner-resilience-512.png',
				  'action' => 
				  array (
					'type' => 'message',
					'label' => 'ตรวจสอบ',
					'text' => 'ตรวจสอบ',
				  ),
				),
				1 => 
				array (
				  'type' => 'action',
				  'imageUrl' => 'https://cdn4.iconfinder.com/data/icons/coronavirus-flat/64/doctor-advise-warning-suggestion-avatar-512.png',
				  'action' => 
				  array (
					'type' => 'message',
					'label' => 'แจ้งเป็นผู้ป่วย',
					'text' => 'แจ้งเป็นผู้ป่วย',
				  ),
				),
			  ),
			),
		);

		return $datas;
	}


	function getFormatTextMessage($text)
	{
		$datas = array (
			'type' => 'flex',
			'altText' => 'Flex Message',
			'contents' => 
			array (
			  'type' => 'bubble',
			  'size' => 'mega',
			  'header' => 
			  array (
				'type' => 'box',
				'layout' => 'vertical',
				'contents' => 
				array (
				  0 => 
				  array (
					'type' => 'box',
					'layout' => 'vertical',
					'contents' => 
					array (
					  0 => 
					  array (
						'type' => 'text',
						'text' => 'ผลการค้นหา!!',
						'color' => '#ffffff',
						'size' => 'sm',
					  ),
					  1 => 
					  array (
						'type' => 'text',
						'text' => 'คุณไม่มีประวัติบันทึกเส้นทาง',
						'color' => '#ffffff',
						'size' => 'xl',
						'flex' => 4,
						'weight' => 'bold',
					  ),
					),
				  ),
				),
				'paddingAll' => '20px',
				'backgroundColor' => '#00b300',
				'spacing' => 'md',
				'height' => '104px',
				'paddingTop' => '22px',
			  ),
			),
		);
		return $datas;
	}


	function sentMessage($encodeJson,$datas)
	{
		$datasReturn = [];
		$curl = curl_init();
		curl_setopt_array($curl, array(
		  CURLOPT_URL => $datas['url'],
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_ENCODING => "",
		  CURLOPT_MAXREDIRS => 10,
		  CURLOPT_TIMEOUT => 30,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => "POST",
		  CURLOPT_POSTFIELDS => $encodeJson,
		  CURLOPT_HTTPHEADER => array(
		    "authorization: Bearer ".$datas['token'],
		    "cache-control: no-cache",
		    "content-type: application/json; charset=UTF-8",
		  ),
		));

		$response = curl_exec($curl);
		$err = curl_error($curl);

		curl_close($curl);

		if ($err) {
		    $datasReturn['result'] = 'E';
		    $datasReturn['message'] = $err;
		} else {
		    if($response == "{}"){
			$datasReturn['result'] = 'S';
			$datasReturn['message'] = 'Success';
		    }else{
			$datasReturn['result'] = 'E';
			$datasReturn['message'] = $response;
		    }
		}

		return $datasReturn;
	}



	
?>


