// async function getUserProfile() {
//     profile = await liff.getProfile()
//     pictureUrl = profile.pictureUrl
//     userId = profile.userId
//     displayName = profile.displayName
//     if (pictureUrl == undefined) {
//         pictureUrl = ''
//     }
//     document.getElementById('displayname').innerHTML = '<h4 id="displayname">' + displayName + '</h4>'
//     document.getElementById('img_profile').innerHTML = '<img id="img_profile" class="profile_img" src="' + pictureUrl + '" alt="">'
// }
// async function main() {
//     liff.ready.then(() => {
//         if (liff.isLoggedIn()) {
//             getUserProfile()
//         } else {
//             liff.login()
//         }
//     })
//     await liff.init({ liffId: "1653981898-q0jEx1on" })
// }
// main()



var map = L.map('map'
    , { attributionControl: false }
).setView([13.751569, 100.501634], 10);


CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
})

CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
})

ghyb = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    attributions: '&copy; <a href="https://www.google.co.th/maps/">Google</a>'
})

gter = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    attributions: '&copy; <a href="https://www.google.co.th/maps/">Google</a>'
})

var today = new Date().getHours();
//console.log(today);

if (today >= 18 && today <= 5) {
    CartoDB_DarkMatter.addTo(map)
} else {
    CartoDB_Positron.addTo(map)
}


points_store = L.layerGroup().addTo(map)
markerClusterGroup = L.markerClusterGroup().addTo(map)
set_map = L.layerGroup().addTo(map)
line_track = L.layerGroup().addTo(map)



document.getElementById('loading').innerHTML = ' <div id="loading" class="loader"></div>'
//document.getElementById('tracking').innerHTML = ''


var case_store = L.icon({
    iconUrl: 'img/ico_shopping.png',
    iconSize: [30, 30], // size of the icon
});
var case_shop = L.icon({
    iconUrl: 'img/ico_flagblue.png',
    iconSize: [30, 30], // size of the icon
});
var local_icon = L.icon({
    iconUrl: 'https://mapedia-th.github.io/away-covid/img/icon.png',
    iconSize: [20, 20]
});


function get_track() {
    document.getElementById('tracking').innerHTML = '<button id="tracking" class="btn btn-tracking btn-block btn-xs" onclick="get_tracking()"> <i class="fa fa-thumb-tack  fa-lg" aria-hidden="true"></i> <br> Tracking </button>'
}

map.on('click', function () {
    document.getElementById('tracking').innerHTML = '<button id="tracking" class="btn btn-tracking btn-block btn-xs" onclick="get_tracking()"> <i class="fa fa-thumb-tack  fa-lg" aria-hidden="true"></i> <br> Tracking </button>'
})



var legend = L.control({ position: 'bottomright' });

function showDisclaimer() {
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        div.innerHTML += '<button  class="btn btn-default btn-block"  onClick="hideDisclaimer()"><small class="prompt">ซ่อนสัญลักษณ์</small><i class="fa fa-angle-double-down" aria-hidden="true"></i></button><br> ';
       	div.innerHTML += '<img src="img/ico_flagblue.png" width="30px"> <small class="prompt"> ร้านค้าธงฟ้า </small> <br> ';
	    div.innerHTML += '<img src="img/ico_shopping.png" width="30px"> <small class="prompt"> ห้างสรรพสินค้า  </small> <br> ';

        return div;
    };
    legend.addTo(map);
}
 
function hideDisclaimer() {
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
		div.innerHTML += '<button class="btn btn-default " onClick="showDisclaimer()"><small class="prompt">แสดงสัญลักษณ์</small> <i class="fa fa-angle-double-up" aria-hidden="true"></i>   </button><br> ';
        return div;
    };
    legend.addTo(map);
}

hideDisclaimer()
get_point()




function get_point() {
   
    place_mall = geojson_mall
	blue_shop = geojson_use

    var option_dropdown = '<option value="">- - กรุณาเลือก - -</option>'
    for (var i = 0; i < place_mall.features.length; i++) {
        option_dropdown += ' <option value="' + place_mall.features[i].properties.storename + '"> ' + place_mall.features[i].properties.storename + '</option>'
    }
    document.getElementById('select_place').innerHTML = option_dropdown

    function onLocationFound(e) {

        document.getElementById('loading').innerHTML = ''
        // document.getElementById('tracking').innerHTML = '<button id="tracking" class="btn btn-tracking btn-block btn-xs" onclick="get_tracking()"> <i class="fa fa-thumb-tack  fa-lg" aria-hidden="true"></i> <br> Tracking </button>'

        var radius = 10;
        get_latlng = [e.latlng.lng, e.latlng.lat] // e.latlng16.7289774,100.1912686
          //get_latlng = [100.501708, 13.752184] // e.latlng16.7289774,100.1912686
        var point = turf.point(get_latlng);
        L.geoJson(point, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: local_icon,
                });
            }
        })
            .bindPopup("ตำแหน่งปัจจุบันของท่าน")
            .addTo(set_map)

        var buffered = turf.buffer(point, radius, { units: 'kilometers' });


        var ptsWithin = turf.pointsWithinPolygon(blue_shop, buffered);
		var ptsWithin_mall = turf.pointsWithinPolygon(place_mall, buffered);
		
		L.geoJson(ptsWithin, {
			pointToLayer: function (f, latlng) {
				return L.marker(latlng, {
					icon: case_shop,
				}).bindPopup('<b>' + f.properties.name + ' </b><br>' + f.properties.desc + '<br><a href="https://www.google.co.th/maps/dir/'+get_latlng[1]+','+get_latlng[0]+'/' + f.properties.lat +','+ f.properties.lon +'/data=!3m1!1e3?hl=th" class="btn btn-info" target="_blank">แสดงเส้นทาง</a>')
			},
		}).addTo(points_store)
		
		L.geoJson(ptsWithin_mall, {
			pointToLayer: function (f, latlng) {
				return L.marker(latlng, {
					icon: case_store,
				}).bindPopup('<b>' + f.properties.name_th + ' </b><br>ละติจูด : ' + f.properties.lat + ' </b><br>ลองจิจูด : ' + f.properties.lon + '<br><a href="https://www.google.co.th/maps/dir/'+get_latlng[1]+','+get_latlng[0]+'/' + f.properties.lat +','+ f.properties.lon +'/data=!3m1!1e3?hl=th" class="btn btn-success" target="_blank">แสดงเส้นทาง</a>')
			},
		}).addTo(points_store)

        var data = ptsWithin.features
        var table = ''
        for (var i = 0; i < data.length; i++) {
            var distance = turf.distance(point, data[i], { units: 'kilometers' });
            table += '  <tr> <td>   ' + data[i].properties.name + '</td><td>   ' + data[i].properties.type + '    </td><td> <a href="https://www.google.co.th/maps/dir/'+get_latlng[1]+','+get_latlng[0]+'/' + data[i].properties.lat +','+ data[i].properties.lon +'/data=!3m1!1e3?hl=th" target="_blank">แสดงเส้นทาง</a>  </td></tr> '
        }
        document.getElementById('tabel_data').innerHTML = table

		var data_mall = ptsWithin_mall.features
        var table1 = ''
        for (var i = 0; i < data_mall.length; i++) {
            var distance = turf.distance(point, data_mall[i], { units: 'kilometers' });
            table1 += '  <tr> <td>   ' + data_mall[i].properties.name_th + '</td><td> <a href="https://www.google.co.th/maps/dir/'+get_latlng[1]+','+get_latlng[0]+'/' + data_mall[i].properties.lat +','+ data_mall[i].properties.lon +'/data=!3m1!1e3?hl=th" target="_blank">แสดงเส้นทาง</a>  </td></tr> '
        }
        document.getElementById('tabel_mall').innerHTML = table1
		
		var buffereds = L.geoJson(buffered, {
                stroke: false,
                color: 'red',
                fillColor: '#00DCFF',
                fillOpacity: 0.1,
            }).addTo(set_map)
            map.setView([get_latlng[1], get_latlng[0]], 14);
        
    }

    map.on('locationfound', onLocationFound);
    map.locate();
}



function get_loca() {
    document.getElementById('loading').innerHTML = ' <div id="loading" class="loader"></div>'
    set_map.clearLayers()
    line_track.clearLayers()
    map.locate();
}


// $("#form_query").submit(function (event) {
    // $("#search").modal("hide");
    // event.preventDefault();
    // var place = event.target.place.value
    // view_place = ''
    // for (var i = 0; i < place_announce.features.length; i++) {
        // if (place_announce.features[i].properties.storename == place) {
            // view_place = place_announce.features[i]
        // }
    // }
    // var lat = view_place.properties.lat
    // var lon = view_place.properties.lon
    // map.setView([lat, lon], 17);
	
// })


$("#form_setting").submit(function (event) {

    $("#setting").modal("hide");

    markerClusterGroup.clearLayers()
    points_store.clearLayers()
    set_map.clearLayers()

    event.preventDefault();
    radius = event.target.radius.value
   // date = event.target.date.value
    basemap = event.target.basemap.value
    toggle_1 = event.target.toggle_1.checked
    toggle_2 = event.target.toggle_2.checked


    if (basemap == 'base1') {
        CartoDB_Positron.addTo(map)
        CartoDB_DarkMatter.remove()
        ghyb.remove()
        gter.remove()
    } else if (basemap == 'base2') {
        CartoDB_Positron.remove(map)
        CartoDB_DarkMatter.addTo(map)
        ghyb.remove()
        gter.remove()
    } else if (basemap == 'base3') {
        CartoDB_Positron.remove(map)
        CartoDB_DarkMatter.remove()
        ghyb.addTo(map)
        gter.remove()
    } else {
        CartoDB_Positron.remove(map)
        CartoDB_DarkMatter.remove()
        ghyb.remove()
        gter.addTo(map)
    }

    place_mall = geojson_mall
	blue_shop = geojson_use

    function onEachFeature_place_store(f, layer) {
        // var popup = '<div class="card mb-3"> <h3 class="card-header">' + f.properties.place + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + '</div> </div>'
         var popup = '<div class="card-body"><h3 class="card-header">' + f.properties.storename + '</h3><h6 class="card-subtitle text-muted">วันที่ลงประกาศ ' + f.properties.date_update +'</h6><h5 class="card-title">facebook : ' + f.properties.facebook + ' </h5> <h5 class="card-title">line : ' + f.properties.lineid + ' </h5> <h5 class="card-title">Tel : ' + f.properties.tel + ' </h5><h4 class="card-title">ประเภทสินค้า </h4> <h5 class="card-title"><b>หน้ากากอนามัย : </b>' + f.properties.maskvol + ' </h5><h5 class="card-title">ราคาต่ำสุด : ' + f.properties.masklowprice + ' บาท   ราคาสูงสุด : ' + f.properties.maskhighprice +' บาท</h5><hr><h5 class="card-title"><b>เจลล้างมือ : </b>' + f.properties.gelvol + ' </h5><h5 class="card-title">ราคาต่ำสุด : ' + f.properties.gellowprice + ' บาท   ราคาสูงสุด : ' + f.properties.gelhighprice +' บาท</h5><hr></div>'
        layer.bindPopup(popup)
    }


    
    
    var point = turf.point(get_latlng);
    L.geoJson(point, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: local_icon,
            });
        }
    })
        .bindPopup("ตำแหน่งปัจจุบันของท่าน")
        .addTo(set_map)

    var buffered = turf.buffer(point, radius, { units: 'kilometers' });
    var buffereds = L.geoJson(buffered, {
        stroke: false,
        color: 'red',
        fillColor: '#00DCFF',
        fillOpacity: 0.1,
    }).addTo(set_map)
	map.setView([get_latlng[1], get_latlng[0]], 14);

    var ptsWithin = turf.pointsWithinPolygon(blue_shop, buffered);
    var ptsWithin_mall = turf.pointsWithinPolygon(place_mall, buffered);

    
	
	var p_shop = L.geoJson(ptsWithin, {
		pointToLayer: function (f, latlng) {
			return L.marker(latlng, {
				icon: case_shop,
			}).bindPopup('<b>' + f.properties.name + ' </b><br>' + f.properties.desc + '<br><a href="https://www.google.co.th/maps/dir/'+get_latlng[1]+','+get_latlng[0]+'/' + f.properties.lat +','+ f.properties.lon +'/data=!3m1!1e3?hl=th" class="btn btn-info" target="_blank">แสดงเส้นทาง</a>' )
		},
	})
	
	if (toggle_1 == true) {
        p_shop.addTo(points_store)
    }
	
	var p_mall = L.geoJson(ptsWithin_mall, {
		pointToLayer: function (f, latlng) {
			return L.marker(latlng, {
				icon: case_store,
			}).bindPopup('<b>' + f.properties.name_th + ' </b><br>ละติจูด : ' + f.properties.lat + ' </b><br>ลองจิจูด : ' + f.properties.lon + '<br><a href="https://www.google.co.th/maps/dir/'+get_latlng[1]+','+get_latlng[0]+'/' + f.properties.lat +','+ f.properties.lon +'/data=!3m1!1e3?hl=th" class="btn btn-success" target="_blank">แสดงเส้นทาง</a>')
		},
	})
	if (toggle_2 == true) {
        p_mall.addTo(points_store)
    }
		var data = ptsWithin.features
        var table = ''
        for (var i = 0; i < data.length; i++) {
            var distance = turf.distance(point, data[i], { units: 'kilometers' });
            table += '  <tr> <td>   ' + data[i].properties.name + '</td><td>   ' + data[i].properties.type + '    </td><td> <a href="https://www.google.co.th/maps/dir/'+get_latlng[1]+','+get_latlng[0]+'/' + data[i].properties.lat +','+ data[i].properties.lon +'/data=!3m1!1e3?hl=th" target="_blank">แสดงเส้นทาง</a>  </td></tr> '
        }
        document.getElementById('tabel_data').innerHTML = table
		
		var data_mall = ptsWithin_mall.features
		console.log(data_mall)
        var table1 = ''
        for (var i = 0; i < data_mall.length; i++) {
            var distance = turf.distance(point, data_mall[i], { units: 'kilometers' });
            table1 += '  <tr> <td>   ' + data_mall[i].properties.name_th + '</td><td> <a href="https://www.google.co.th/maps/dir/'+get_latlng[1]+','+get_latlng[0]+'/' + data_mall[i].properties.lat +','+ data_mall[i].properties.lon +'/data=!3m1!1e3?hl=th" target="_blank">แสดงเส้นทาง</a>  </td></tr> '
        }
        document.getElementById('tabel_mall').innerHTML = table1


})


L.Control.watermark = L.Control.extend({
    onAdd: function (map) {
        var img = L.DomUtil.create('img');
        img.src = 'https://mapedia.co.th/assets/images/logo_1_1024.png';
        img.style.width = '35px';
        img.style.opacity = '0.5';
        return img;
    }
});
L.control.watermark = function (opts) {
    return new L.Control.watermark(opts);
}
L.control.watermark({ position: 'bottomleft' }).addTo(map);