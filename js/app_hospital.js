var map = L.map('map', {
    attributionControl: false
}).setView([13.751569, 100.501634], 10);


CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map)

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



points_store = L.layerGroup().addTo(map)
markerClusterGroup = L.markerClusterGroup().addTo(map)
set_map = L.layerGroup().addTo(map)
line_track = L.layerGroup().addTo(map)



document.getElementById('loading').innerHTML = ' <div id="loading" class="loader"></div>'
//document.getElementById('tracking').innerHTML = ''


var local_icon = L.icon({
    iconUrl: 'img/icon.png',
    iconSize: [20, 20]
});

var hospital = L.icon({
    iconUrl: 'img/rpst.png',
    iconSize: [30, 30], // size of the icon
});
var hospital_1 = L.icon({
    iconUrl: 'img/hospital_1.png',
    iconSize: [30, 30], // size of the icon
});
var hospital_2 = L.icon({
    iconUrl: 'img/hospital_2.png',
    iconSize: [30, 30], // size of the icon
});
var ic_clinic = L.icon({
    iconUrl: 'img/h2.png',
    iconSize: [30, 30], // size of the icon
});
var ic_medicine = L.icon({
    iconUrl: 'img/h3.png',
    iconSize: [30, 30], // size of the icon
});





var legend = L.control({
    position: 'bottomright'
});

function showDisclaimer() {
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        div.innerHTML += '<button  class="btn btn-default btn-block"  onClick="hideDisclaimer()"><small class="prompt">ซ่อนสัญลักษณ์</small><i class="fa fa-angle-double-down" aria-hidden="true"></i></button><br> ';
        div.innerHTML += '<img src="img/hospital_1.png" width="30px"> <small class="prompt"> โรงพยาบาล </small> <br> ';
        div.innerHTML += '<img src="img/hospital_2.png" width="30px"> <small class="prompt"> โรงพยาบาลเอกชน </small> <br> ';
        div.innerHTML += '<img src="img/rpst.png" width="30px"> <small class="prompt"> รพ.สต./สาธารณสุขชุมชน  </small> <br> ';
        div.innerHTML += '<img src="img/h2.png" width="30px"> <small class="prompt"> คลีนิค  </small> <br> ';
        div.innerHTML += '<img src="img/h3.png" width="30px"> <small class="prompt"> ร้านขายยา  </small> <br> ';

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

    place_health = geojson_health
    rpst = geojson_rpst
    clinic = geojson_clinic
    medicine = geojson_medicine
    labcovid = labcovid

    function onLocationFound(e) {

        document.getElementById('loading').innerHTML = ''

        var radius = 20;
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
            .bindPopup("ตำแหน่งปัจจุบันของท่าน").openPopup()
            .addTo(set_map);

        // โรงพยาบาล
        L.geoJson(place_health, {
            pointToLayer: function (f, latlng) {
                var distance = turf.distance(point, f, {
                    units: 'kilometers'
                });
                f.properties.dis = Number(distance.toFixed(0))
                if (f.properties.type_code == '4') {
                    popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                    <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                    <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div></p>\
                    <div class="modal-footer">\
                    <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                    <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                    </div>';
                    return L.marker(latlng, {
                        icon: hospital_1,
                        highlight: "temporary"
                    }).bindPopup(popupContent, {
                        maxWidth: "300"
                    });
                    // }).bindPopup('<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5><div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right" > <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank"><button type="button" class="btn btn-info"> <span class="glyphicon glyphicon-road"></span>    นำทาง</button> </a> <br><div class="col-xs-4  text-left"></div><div class="col-xs-8  text-right" > <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank">ข้อมูลสถานพยาบาล</a> </div></div>', {
                    //     maxWidth: "250"
                    // });
                } else if (f.properties.type_code == '5') {
                    popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                    <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                    <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div></p>\
                    <div class="modal-footer">\
                    <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                    <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                    </div>';
                    return L.marker(latlng, {
                        icon: hospital_1,
                        highlight: "temporary"
                    }).bindPopup(popupContent, {
                        maxWidth: "300"
                    });
                    //}).bindPopup('<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5><div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right" > <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">เส้นทาง</a> </div> <br><div class="col-xs-4  text-left"></div><div class="col-xs-8  text-right" > <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank">ข้อมูลสถานพยาบาล</a> </div></div>');
                }
            }
        }).addTo(points_store)

        var buffered = turf.buffer(point, radius, {
            units: 'kilometers'
        });
        var ptsWithin_health = turf.pointsWithinPolygon(place_health, buffered);
        var ptsWithin_rpst = turf.pointsWithinPolygon(rpst, buffered);
        var ptsWithin_clinic = turf.pointsWithinPolygon(clinic, buffered);
        var ptsWithin_medicine = turf.pointsWithinPolygon(medicine, buffered);

        var option_dropdown = '<option value="">- - กรุณาเลือก - -</option>'
        for (var i = 0; i < ptsWithin_health.features.length; i++) {

            option_dropdown += ' <option value="' + ptsWithin_health.features[i].properties.name + '"> ' + ptsWithin_health.features[i].properties.name + '</option>'
        }
        document.getElementById('select_place').innerHTML = option_dropdown

        // โรงพยาบาล
        L.geoJson(ptsWithin_health, {
            pointToLayer: function (f, latlng) {
                var distance = turf.distance(point, f, {
                    units: 'kilometers'
                });
                f.properties.dis = Number(distance.toFixed(0))
                if (f.properties.type_code == '4') {
                    popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                    <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                    <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div></p>\
                    <div class="modal-footer">\
                    <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                    <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                    </div>';
                    return L.marker(latlng, {
                        icon: hospital_1,
                        highlight: "temporary"
                   // }).bindPopup('<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5><div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right" > <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">เส้นทาง</a> </div> <br><div class="col-xs-4  text-left"></div><div class="col-xs-8  text-right" > <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank">ข้อมูลสถานพยาบาล</a> </div></div>');
                    }).bindPopup(popupContent, {
                        maxWidth: "300"
                    });
                } else if (f.properties.type_code == '5') {
                    popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                    <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                    <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div></p>\
                    <div class="modal-footer">\
                    <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                    <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                    </div>';
                    return L.marker(latlng, {
                        icon: hospital_1,
                        highlight: "temporary"
                    }).bindPopup(popupContent, {
                        maxWidth: "300"
                    });
                    //}).bindPopup('<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5><div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right" > <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">เส้นทาง</a> </div> <br><div class="col-xs-4  text-left"></div><div class="col-xs-8  text-right" > <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank">ข้อมูลสถานพยาบาล</a> </div></div>');
                } else if (f.properties.type_code == '7') {
                    popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                    <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                    <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div></p>\
                    <div class="modal-footer">\
                    <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                    <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                    </div>';
                    return L.marker(latlng, {
                        icon: hospital_2,
                        highlight: "temporary"
                    }).bindPopup(popupContent, {
                        maxWidth: "300"
                    });
                    //}).bindPopup('<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5><div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right" > <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">เส้นทาง</a> </div> <br><div class="col-xs-4  text-left"></div><div class="col-xs-8  text-right" > <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank">ข้อมูลสถานพยาบาล</a> </div></div>');
                } else if (f.properties.type_code == '62') {
                    popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                    <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                    <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div></p>\
                    <div class="modal-footer">\
                    <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                    <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                    </div>';
                    return L.marker(latlng, {
                        icon: hospital_1,
                        highlight: "temporary"
                    }).bindPopup(popupContent, {
                        maxWidth: "300"
                    });
                    //}).bindPopup('<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5><div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right" > <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">เส้นทาง</a> </div> <br><div class="col-xs-4  text-left"></div><div class="col-xs-8  text-right" > <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank">ข้อมูลสถานพยาบาล</a> </div></div>');
                }

            }
        }).addTo(markerClusterGroup)

        // รพสต
        L.geoJson(ptsWithin_rpst, {
            pointToLayer: function (f, latlng) {
                var distance = turf.distance(point, f, {
                    units: 'kilometers'
                });
                f.properties.dis = Number(distance.toFixed(0))
                if (f.properties.type_code == '3') {
                    popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                    <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                    <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div></p>\
                    <div class="modal-footer">\
                    <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                    <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                    </div>';
                    return L.marker(latlng, {
                        icon: hospital,
                        highlight: "temporary"
                    }).bindPopup(popupContent, {
                        maxWidth: "300"
                    });
                    //}).bindPopup('<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5><div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right" > <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">เส้นทาง</a> </div> <br><div class="col-xs-4  text-left"></div><div class="col-xs-8  text-right" > <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank">ข้อมูลสถานพยาบาล555</a> </div></div>');
                }

            }
        }).addTo(markerClusterGroup)

        // คลีนิค
        L.geoJson(ptsWithin_clinic, {
            pointToLayer: function (f, latlng) {
                var distance = turf.distance(point, f, {
                    units: 'kilometers'
                });
                f.properties.dis = Number(distance.toFixed(0))
                popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div></p>\
                <div class="modal-footer">\
                <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลเพิ่มเติม </button></a>\
                </div>';
                return L.marker(latlng, {
                    icon: ic_clinic,
                }).bindPopup(popupContent, {
                    maxWidth: "300"
                });
               // }).bindPopup('<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4><div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right" > <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">เส้นทาง</a> </div> <br><div class="col-xs-4  text-left"></div><div class="col-xs-8  text-right" > <a href="http://gishealth.moph.go.th/clinic/info.php?maincode=' + f.properties.main_code + '"  target="_blank">ข้อมูลเพิ่มเติม</a> </div></div>');
            }
        }).addTo(markerClusterGroup)

        // ร้านยา
        L.geoJson(ptsWithin_medicine, {
            pointToLayer: function (f, latlng) {
                var distance = turf.distance(point, f, {
                    units: 'kilometers'
                });
                f.properties.dis = Number(distance.toFixed(0))
                popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                <div class="row"> <div class="col-xs-9  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div><p></p>\
                <div class="modal-footer">\
                <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลเพิ่มเติม </button></a>\
                </div>';
                return L.marker(latlng, {
                    icon: ic_medicine,
                }).bindPopup(popupContent, {
                    maxWidth: "300"
                });
                //}).bindPopup('<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4><div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right" > <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">เส้นทาง</a> </div> <br><div class="col-xs-4  text-left"></div><div class="col-xs-8  text-right" > <a href="http://gishealth.moph.go.th/clinic/info.php?maincode=' + f.properties.main_code + '"  target="_blank">ข้อมูลเพิ่มเติม</a> </div></div>');
            }
        }).addTo(markerClusterGroup)

        var data = ptsWithin_health.features

        var table = ''
        for (var i = 0; i < data.length; i++) {
            var distance = turf.distance(point, data[i], {
                units: 'kilometers'
            });
            //dis = Number(distance.toFixed(0))
            table += '  <tr> <td>   ' + data[i].properties.name + '</td><td>   ' + distance.toFixed(1) + '    </td><td> <a href="https://www.google.co.th/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + data[i].properties.lat + ',' + data[i].properties.lon + '/data=!3m1!1e3?hl=th" target="_blank">แสดงเส้นทาง</a>  </td><td><a href="http://gishealth.moph.go.th/healthmap/info.php?maincode= ' + data[i].properties.main_code + '">ข้อมูลสถานพยาบาล</a></td></tr> '
        }
        document.getElementById('tabel_data').innerHTML = table

        var data2 = ptsWithin_rpst.features
        var table2 = ''
        for (var i = 0; i < data2.length; i++) {
            var distance2 = turf.distance(point, data2[i], {
                units: 'kilometers'
            });
            //dis = Number(distance.toFixed(0))
            table2 += '  <tr> <td>   ' + data2[i].properties.name + '</td><td>   ' + distance2.toFixed(1) + '    </td><td> <a href="https://www.google.co.th/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + data2[i].properties.lat + ',' + data2[i].properties.lon + '/data=!3m1!1e3?hl=th" target="_blank">แสดงเส้นทาง</a>  </td><td><a href="http://gishealth.moph.go.th/healthmap/info.php?maincode= ' + data2[i].properties.main_code + '">ข้อมูลสถานพยาบาล</a></td></tr> '
        }
        document.getElementById('tabel_rpst').innerHTML = table2

        var data3 = ptsWithin_clinic.features
        var table3 = ''
        for (var i = 0; i < data3.length; i++) {
            var distance3 = turf.distance(point, data3[i], {
                units: 'kilometers'
            });
            //dis = Number(distance.toFixed(0))
            table3 += '  <tr> <td>   ' + data3[i].properties.name + '</td><td>   ' + distance3.toFixed(1) + '    </td><td> <a href="https://www.google.co.th/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + data3[i].properties.lat + ',' + data3[i].properties.lon + '/data=!3m1!1e3?hl=th" target="_blank">แสดงเส้นทาง</a>  </td><td><a href="http://gishealth.moph.go.th/healthmap/info.php?maincode= ' + data3[i].properties.main_code + '">ข้อมูลเพิ่มเติม</a></td></tr> '
        }
        document.getElementById('tabel_clinic').innerHTML = table3

        var data4 = ptsWithin_medicine.features
        var table4 = ''
        for (var i = 0; i < data4.length; i++) {
            var distance4 = turf.distance(point, data4[i], {
                units: 'kilometers'
            });
            //dis = Number(distance.toFixed(0))
            table4 += '  <tr> <td>   ' + data4[i].properties.name + '</td><td>   ' + distance4.toFixed(1) + '    </td><td> <a href="https://www.google.co.th/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + data4[i].properties.lat + ',' + data4[i].properties.lon + '/data=!3m1!1e3?hl=th" target="_blank">แสดงเส้นทาง</a>  </td><td><a href="http://gishealth.moph.go.th/healthmap/info.php?maincode= ' + data4[i].properties.main_code + '">ข้อมูลเพิ่มเติม</a></td></tr> '
        }
        document.getElementById('tabel_medicine').innerHTML = table4


        var buffereds = L.geoJson(buffered, {
            stroke: false,
            color: 'red',
            fillColor: '#FFF',
            fillOpacity: 0,
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

$("#form_query").submit(function (event) {
    $("#search").modal("hide");
    event.preventDefault();
    var place = event.target.place.value
    view_place = ''
    for (var i = 0; i < place_health.features.length; i++) {
        if (place_health.features[i].properties.name == place) {
            view_place = place_health.features[i]
        }
    }
    var lat = view_place.properties.lat
    var lon = view_place.properties.lon
    map.setView([lat, lon], 17);

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
L.control.watermark({
    position: 'bottomleft'
}).addTo(map);
