async function getUserProfile() {
    profile = await liff.getProfile()
    pictureUrl = profile.pictureUrl
    userId = profile.userId
    displayName = profile.displayName
    decodedIDToken = liff.getDecodedIDToken().email
    if (pictureUrl == undefined) {
        pictureUrl = ''
    }
    document.getElementById('displayname').innerHTML = '<h5 id="displayname">' + displayName + '</h5>'
    document.getElementById('img_profile').innerHTML = '<img id="img_profile" class="profile_img" src="' + pictureUrl + '" alt=""  onclick="back_local()">'
    $.ajax({
        url: 'https://mapedia.co.th/demo/add_tracking.php?type=login',
        method: 'post',
        data: ({
            pictureUrl: pictureUrl,
            userId: userId,
            displayName: displayName,
            page_view: 'route.html'
        }),
        success: function (data) {}
    })
}

async function main() {
    liff.ready.then(() => {
        if (liff.isLoggedIn()) {
            getUserProfile()
        } else {
            liff.login()
        }
    })
    await liff.init({
        liffId: "1653981898-QwWOp3PN"
    })
}
main()




var map = L.map('map', {
    attributionControl: false,
    center: [13.742701, 100.673909],
    zoom: 13
});

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

// stadia = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
//     maxZoom: 20,
//     attributions: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
// })


osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

gmap = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    attributions: '&copy; <a href="https://www.google.co.th/maps">Google Maps</a>'
})

ghyb = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    attributions: '&copy; <a href="https://www.google.co.th/maps">Google Maps</a>'
})

// hmap = L.tileLayer('https://{s}.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png?lg=tha&ppi=72&apiKey=FTlR_PpH6jKZ6xwc6T40_6FjAAa9K3W5R5_WwZKuwPk', {
//     attribution: '&copy; <a href="https://www.here.com/">HERE</a>',
//     subdomains: '1234',
//     maxZoom: 20
// })


var today = new Date().getHours();
if (today >= 3 && today <= 21) {
    osm.addTo(map)
} else {
    CartoDB_DarkMatter.addTo(map)
}


var urlParams = new URLSearchParams(window.location.search);
var marker, gps, dataurl, tam, amp, pro, x, y;

document.getElementById('loading').innerHTML = '  <div class="spinner-grow text-danger loading" role="status"><span class="sr-only"></span></div>'
document.getElementById('btn_search').innerHTML = '<button class="btn btn-awaycovid  btn-lg  btn-block" type="button" disabled> <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังรอรับค่าตำแหน่ง Location . . . . </button>'

markerClusterGroup = L.markerClusterGroup().addTo(map)

แลป_clus = L.markerClusterGroup().addTo(map)
แลป_group = L.layerGroup().addTo(map)

โรงพยาบาล_clus = L.markerClusterGroup().addTo(map)
โรงพยาบาล_group = L.layerGroup().addTo(map)

รพสต_clus = L.markerClusterGroup().addTo(map)
รพสต_group = L.layerGroup().addTo(map)

คลีนิค_clus = L.markerClusterGroup().addTo(map)
คลีนิค_group = L.layerGroup().addTo(map)

ยา_clus = L.markerClusterGroup().addTo(map);
ยา_group = L.layerGroup().addTo(map);

covidlab = L.layerGroup().addTo(map);




var legend = L.control({
    position: 'bottomright'
});

function showDisclaimer() {
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')

        div.innerHTML += '<img src="img/hospital.png" width="30px"> <small class="prompt"> สถานรับตรวจโรค Covid-19 </small> <br> ';
        div.innerHTML += '<img src="img/hospital_1.png" width="30px"> <small class="prompt"> โรงพยาบาล </small> <br> ';
        div.innerHTML += '<img src="img/hospital_2.png" width="30px"> <small class="prompt"> โรงพยาบาลเอกชน </small> <br> ';
        div.innerHTML += '<img src="img/rpst.png" width="30px"> <small class="prompt"> รพ.สต./สาธารณสุขชุมชน  </small> <br> ';
        div.innerHTML += '<img src="img/h2.png" width="30px"> <small class="prompt"> คลีนิค  </small> <br> ';
        div.innerHTML += '<img src="img/h3.png" width="30px"> <small class="prompt"> ร้านขายยา  </small> <br> ';
        div.innerHTML += '<button  class="btn btn-default btn-block"  onClick="hideDisclaimer()"><small class="prompt">ซ่อนสัญลักษณ์</small><i class="fa fa-angle-double-down" aria-hidden="true"></i></button>';

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


var case_hospital = L.icon({
    iconUrl: 'img/hospital.png',
    iconSize: [50, 50], // size of the icon
});
var case_hospital_1 = L.icon({
    iconUrl: 'img/hospital_1.png',
    iconSize: [30, 30], // size of the icon
});

var case_hospital_2 = L.icon({
    iconUrl: 'img/hospital_2.png',
    iconSize: [30, 30], // size of the icon
});

var case_rpst = L.icon({
    iconUrl: 'img/rpst.png',
    iconSize: [30, 30], // size of the icon
});

var case_clinic = L.icon({
    iconUrl: 'img/h2.png',
    iconSize: [30, 30], // size of the icon
});

var case_medicine = L.icon({
    iconUrl: 'img/h3.png',
    iconSize: [30, 30], // size of the icon
});

place_health = geojson_health
rpst = geojson_rpst
clinic = geojson_clinic
medicine = geojson_medicine
labcovid = labcovid



function onLocationFound(e) {
    document.getElementById('loading').innerHTML = ''

    radius = 5;
    get_latlng = [e.latlng.lng, e.latlng.lat]
    // get_latlng = [100.571060, 13.701618]

    point = turf.point(get_latlng);

    L.geoJson(point, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: local_icon,
                    highlight: 'permanent'
                });
            }
        }).bindPopup("ตำแหน่งปัจจุบันของท่าน")
        .addTo(map)

    buffered = turf.buffer(point, radius, {
        units: 'kilometers'
    });
    buffereds = L.geoJson(buffered, {
        stroke: true,
        color: 'rgb(6, 167, 167)',
        weight: 5,
        opacity: 0.3,
        fillOpacity: 0,
    }).addTo(map)
    map.fitBounds(buffereds.getBounds())

    buffered = turf.buffer(point, radius, {
        units: 'kilometers'
    });


    geojson_health.features.forEach(e => {
        var ptsWithin_geojson_health = turf.pointsWithinPolygon(e, buffered);
        if (ptsWithin_geojson_health.features.length > 0) {
            hos_all = L.geoJson(ptsWithin_geojson_health, {
                pointToLayer: function (f, latlng) {
                    var distance = turf.distance(point, f, {
                        units: 'kilometers'
                    });


                    f.properties.dis = Number(distance.toFixed(2))
                    if (f.properties.type_code == '4') {
                        popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                            <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                            <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                            <div class="modal-footer">\
                            <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                            <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                            </div>';

                        return L.marker(latlng, {
                            icon: case_hospital_1,
                        }).bindPopup(popupContent, {
                            maxWidth: "300"
                        });
                    } else if (f.properties.type_code == '5') {
                        popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                            <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                            <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                            <div class="modal-footer">\
                            <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                            <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                            </div>';

                        return L.marker(latlng, {
                            icon: case_hospital_1,
                        }).bindPopup(popupContent, {
                            maxWidth: "300"
                        });
                    } else if (f.properties.type_code == '7') {
                        popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                            <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                            <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                            <div class="modal-footer">\
                            <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                            <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                            </div>';

                        return L.marker(latlng, {
                            icon: case_hospital_2,
                        }).bindPopup(popupContent, {
                            maxWidth: "300"
                        });
                    } else if (f.properties.type_code == '62') {
                        popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                            <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                            <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div></p>\
                            <div class="modal-footer">\
                            <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                            <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                            </div>';
                        return L.marker(latlng, {
                            icon: case_hospital_1,
                            highlight: "temporary"
                        }).bindPopup(popupContent, {
                            maxWidth: "300"
                        });
                    }
                }
            }).addTo(โรงพยาบาล_group)
        } else {
            hos_all = L.geoJson(e, {
                pointToLayer: function (f, latlng) {
                    var distance = turf.distance(point, f, {
                        units: 'kilometers'
                    });
                    f.properties.dis = Number(distance.toFixed(2))
                    if (f.properties.type_code == '4') {
                        popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                            <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                            <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                            <div class="modal-footer">\
                            <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                            <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                            </div>';

                        return L.marker(latlng, {
                            icon: case_hospital_1,
                        }).bindPopup(popupContent, {
                            maxWidth: "300"
                        });
                    } else if (f.properties.type_code == '5') {
                        popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                            <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                            <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                            <div class="modal-footer">\
                            <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                            <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                            </div>';

                        return L.marker(latlng, {
                            icon: case_hospital_1,
                        }).bindPopup(popupContent, {
                            maxWidth: "300"
                        });
                    } else if (f.properties.type_code == '7') {
                        popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                            <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                            <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                            <div class="modal-footer">\
                            <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                            <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                            </div>';

                        return L.marker(latlng, {
                            icon: case_hospital_2,
                        }).bindPopup(popupContent, {
                            maxWidth: "300"
                        });
                    } else if (f.properties.type_code == '62') {
                        popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                            <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                            <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div></p>\
                            <div class="modal-footer">\
                            <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                            <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                            </div>';
                        return L.marker(latlng, {
                            icon: case_hospital_1,
                            highlight: "temporary"
                        }).bindPopup(popupContent, {
                            maxWidth: "300"
                        });
                    }
                }
            }).addTo(โรงพยาบาล_clus)
        }
    });


    labcovid.features.forEach(e => {
        var ptsWithin_labcovid = turf.pointsWithinPolygon(e, buffered);
        if (ptsWithin_labcovid.features.length > 0) {
            L.geoJson(ptsWithin_labcovid, {
                pointToLayer: function (f, latlng) {
                    var distance = turf.distance(point, f, {
                        units: 'kilometers'
                    });
                    f.properties.dis = Number(distance.toFixed(2))
                    return L.marker(latlng, {
                        icon: case_hospital,
                    }).bindPopup('<div class="card mb-3"> <h5 class="card-header">' + f.properties.name + '</h5> <div class="card-body"> <div class="row"> <div class="col-xs-4  text-center"> <img style="border-radius: 10px;" src="' + f.properties.webimage + '" alt="" width="100%"> </div> <div class="col-xs-8"> <h6 class="card-subtitle text-muted">จังหวัด : ' + f.properties.prov + '</h6> <h6 class="card-subtitle text-muted">ที่อยู่ : ' + f.properties.add + '</h6> </div> </div> </div> <div class="card-footer text-muted text-right"> <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div> <div class="col-xs-6  text-right"> <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.long) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank"><button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button></a></div> </div> </div> </div>')
                }
            }).addTo(แลป_group)
        } else {
            L.geoJson(e, {
                pointToLayer: function (f, latlng) {
                    var distance = turf.distance(point, f, {
                        units: 'kilometers'
                    });
                    f.properties.dis = Number(distance.toFixed(2))
                    return L.marker(latlng, {
                        icon: case_hospital,
                    }).bindPopup('<div class="card mb-3"> <h5 class="card-header">' + f.properties.name + '</h5> <div class="card-body"> <div class="row"> <div class="col-xs-4  text-center"> <img style="border-radius: 10px;" src="' + f.properties.webimage + '" alt="" width="100%"> </div> <div class="col-xs-8"> <h6 class="card-subtitle text-muted">จังหวัด : ' + f.properties.prov + '</h6> <h6 class="card-subtitle text-muted">ที่อยู่ : ' + f.properties.add + '</h6> </div> </div> </div> <div class="card-footer text-muted text-right"> <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div> <div class="col-xs-6  text-right"> <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.long) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank"><button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button></a></div> </div> </div> </div>')
                }
            }).addTo(แลป_clus)
        }
    });

    rpst.features.forEach(e => {
        var ptsWithin_rpst = turf.pointsWithinPolygon(e, buffered);
        if (ptsWithin_rpst.features.length > 0) {
            รพสต_in = L.geoJson(ptsWithin_rpst, {
                pointToLayer: function (f, latlng) {
                    var distance = turf.distance(point, f, {
                        units: 'kilometers'
                    });
                    f.properties.dis = Number(distance.toFixed(2))
                    if (f.properties.type_code == '3') {
                        popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                            <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                            <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                            <div class="modal-footer">\
                            <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                            <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                            </div>';
                        return L.marker(latlng, {
                            icon: case_rpst,
                            highlight: "temporary"
                        }).bindPopup(popupContent, {
                            maxWidth: "300"
                        });
                    }

                }
            }).addTo(รพสต_group)
        } else {
            รพสต_out = L.geoJson(e, {
                pointToLayer: function (f, latlng) {
                    var distance = turf.distance(point, f, {
                        units: 'kilometers'
                    });
                    f.properties.dis = Number(distance.toFixed(2))
                    if (f.properties.type_code == '3') {
                        popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                            <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                            <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                            <div class="modal-footer">\
                            <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                            <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                            </div>';
                        return L.marker(latlng, {
                            icon: case_rpst,
                            highlight: "temporary"
                        }).bindPopup(popupContent, {
                            maxWidth: "300"
                        });
                    }

                }
            }).addTo(รพสต_clus)
        }
    });


    var show_hos = ''
    var data_set_hos = []
    geojson_health.features.forEach(f => {
        var distance = turf.distance(point, f, {
            units: 'kilometers'
        });
        f.properties.dis = Number(distance.toFixed(2))
        data_set_hos.push(f.properties)
    });
    data_set_hos.sort((a, b) => (a.dis > b.dis) ? 1 : -1)
    document.getElementById('dis_hospital').innerHTML = '<small id="dis_hospital" class="btn btn-xs ner_hos" onClick="select_place(' + data_set_hos[0].lat + ',' + data_set_hos[0].lon + ' )"> สถานพยาบาลใกล้ที่สุด ' + data_set_hos[0].dis + ' km</small>'

    for (let i = 0; i < 50; i++) {
        show_hos += '<div class="card mb-3"> <h5 class="card-header">' + data_set_hos[i].name + '</h5>\
             <h5 class="card-header"> จำนวนเตียงที่รองรับผู้ป่วย ' + data_set_hos[i].bed_total + ' เตียง </h5>\
             <div class="row">\
             <div class="col-6 col-xs-5 text-left"> ระยะทาง ' + data_set_hos[i].dis + ' กม. </div>\
             <div class="col-6 col-xs-4 text-right"> <a  href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + data_set_hos[i].lat + ',' + data_set_hos[i].lon + ' "  target="_blank">  <i class="fa fa-location-arrow"></i> นำทาง</a> </div>\
             <div class="col-6 col-xs-3 text-right" onClick="select_place(' + data_set_hos[i].lat + ',' + data_set_hos[i].lon + ' )"> <i class="fa fa-search"></i> ตำแหน่ง </div>\
           </div></div> </div> </div><hr>'
    }
    document.getElementById('show_hos').innerHTML = show_hos



    var show_lab = ''
    var data_set_labcovid = []
    labcovid.features.forEach(f => {
        var distance = turf.distance(point, f, {
            units: 'kilometers'
        });
        f.properties.dis = Number(distance.toFixed(2))
        data_set_labcovid.push(f.properties)
    });
    data_set_labcovid.sort((a, b) => (a.dis > b.dis) ? 1 : -1)

    data_set_labcovid.forEach(f => {
        //show_lab += '<div class="card mb-3"> <h5 class="card-header">' + f.name + '</h5> <div class="card-body"> <div class="row"> <div class="col-xs-4  text-center"> <img style="border-radius: 10px;" src="' + f.webimage + '" alt="" width="100%"> </div> <div class="col-xs-8"> <h6 class="card-subtitle text-muted">จังหวัด : ' + f.prov + '</h6> <h6 class="card-subtitle text-muted">ที่อยู่ : ' + f.add + '</h6> </div> </div> </div> <div class="card-footer text-muted text-right"> <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.dis + ' กม. </div> <div class="col-xs-6  text-right"  onClick="select_place(' + f.lat + ',' + f.long + ' )"> <i class="fa fa-search"></i> ตำแหน่ง</div> </div> </div> </div> <hr>'
        show_lab += '<div class="card mb-3"> <h5 class="card-header">' + f.name + '</h5> \
        <div class="card-body"> <div class="row"> <div class="col-xs-4  text-center"> <img style="border-radius: 10px;" src="' + f.webimage + '" alt="" width="100%"> </div> \
        <div class="col-xs-8"> <h6 class="card-subtitle text-muted">จังหวัด : ' + f.prov + '</h6> <h6 class="card-subtitle text-muted">ที่อยู่ : ' + f.add + '</h6> </div> </div> </div> \
        <div class="card-footer text-muted text-right"> <div class="row"> <div class="col-xs-5  text-left"> ระยะทาง ' + f.dis + ' กม. </div>\
        <div class="col-6 col-xs-4 text-right"> <a  href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + f.lat + ',' + f.long + ' "  target="_blank">  <i class="fa fa-location-arrow"></i> นำทาง</a> </div>\
        <div class="col-6 col-xs-3  text-right"  onClick="select_place(' + f.lat + ',' + f.long + ' )"> <i class="fa fa-search"></i> ตำแหน่ง</div> </div> </div> </div> <hr>'
    })
    document.getElementById('show_lab').innerHTML = show_lab




    var show_rpst = ''
    var data_set_rpst = []
    rpst.features.forEach(f => {
        var distance = turf.distance(point, f, {
            units: 'kilometers'
        });
        f.properties.dis = Number(distance.toFixed(2))
        data_set_rpst.push(f.properties)
    });
    data_set_rpst.sort((a, b) => (a.dis > b.dis) ? 1 : -1)
    for (let i = 0; i < 30; i++) {
        //show_rpst += '<div class="card mb-3"> <h5 class="card-header">' + data_set_rpst[i].name + '</h5> <div class="card-body"> <div class="row"> </div> <div class=""> <h6 class="card-subtitle text-muted">ประเภท : ' + data_set_rpst[i].type_desc + '</h6> </div> </div> </div> <div class="card-footer text-muted text-right"> <div class="col-xs-12"> <div class="col-xs-6  text-left"> ระยะทาง ' + data_set_rpst[i].dis + ' กม. </div> <div class="col-xs-6  text-right" onClick="select_place(' + data_set_rpst[i].lat + ',' + data_set_rpst[i].lon + ' )"> <i class="fa fa-search"></i> ตำแหน่ง</div> </div> </div> <hr>'
        //}
        show_rpst += '<div class="card mb-3"> <h5 class="card-header">' + data_set_rpst[i].name + '</h5>\
        <h5 class="card-header"> ประเภท ' + data_set_rpst[i].type_desc + ' </h5>\
        <div class="row">\
        <div class="col-6 col-xs-5 text-left"> ระยะทาง ' + data_set_rpst[i].dis + ' กม. </div>\
        <div class="col-6 col-xs-4 text-right"> <a  href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + data_set_rpst[i].lat + ',' + data_set_rpst[i].lon + ' "  target="_blank">  <i class="fa fa-location-arrow"></i> นำทาง</a> </div>\
        <div class="col-6 col-xs-3 text-right" onClick="select_place(' + data_set_rpst[i].lat + ',' + data_set_rpst[i].lon + ' )"> <i class="fa fa-search"></i> ตำแหน่ง </div>\
         </div></div> </div> </div><hr>'
    }
    document.getElementById('show_rpst').innerHTML = show_rpst





    var show_h2 = ''
    var data_set_clinic = []
    clinic.features.forEach(f => {
        var distance = turf.distance(point, f, {
            units: 'kilometers'
        });
        f.properties.dis = Number(distance.toFixed(2))
        data_set_clinic.push(f.properties)
    });
    data_set_clinic.sort((a, b) => (a.dis > b.dis) ? 1 : -1)
    for (let i = 0; i < 30; i++) {
        //show_h2 += '<div class="card mb-3"> <h5 class="card-header">' + data_set_clinic[i].name + '</h5> <div class="card-body"> <div class="row"> </div> <div class=""> <h6 class="card-subtitle text-muted">ประเภท : ' + data_set_clinic[i].type_desc + '</h6> </div> </div> </div> <div class="card-footer text-muted text-right"> <div class="col-xs-12"> <div class="col-xs-6  text-left"> ระยะทาง ' + data_set_clinic[i].dis + ' กม. </div> <div class="col-xs-6  text-right" onClick="select_place(' + data_set_clinic[i].lat + ',' + data_set_clinic[i].lon + ' )"> <i class="fa fa-search"></i> ตำแหน่ง</div> </div> </div> <hr>'
        show_h2 += '<div class="card mb-3"> <h5 class="card-header">' + data_set_clinic[i].name + '</h5>\
        <h5 class="card-header"> ประเภท ' + data_set_clinic[i].type_desc + ' </h5>\
        <div class="row">\
        <div class="col-6 col-xs-5 text-left"> ระยะทาง ' + data_set_clinic[i].dis + ' กม. </div>\
        <div class="col-6 col-xs-4 text-right"> <a  href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + data_set_clinic[i].lat + ',' + data_set_clinic[i].lon + ' "  target="_blank">  <i class="fa fa-location-arrow"></i> นำทาง</a> </div>\
        <div class="col-6 col-xs-3 text-right" onClick="select_place(' + data_set_clinic[i].lat + ',' + data_set_clinic[i].lon + ' )"> <i class="fa fa-search"></i> ตำแหน่ง </div>\
         </div></div> </div> </div><hr>'
    }
    document.getElementById('show_h2').innerHTML = show_h2



    var show_h3 = ''
    var data_set_medicine = []
    medicine.features.forEach(f => {
        var distance = turf.distance(point, f, {
            units: 'kilometers'
        });
        f.properties.dis = Number(distance.toFixed(2))
        data_set_medicine.push(f.properties)
    });
    data_set_medicine.sort((a, b) => (a.dis > b.dis) ? 1 : -1)
    for (let i = 0; i < 30; i++) {
        //show_h3 += '<div class="card mb-3"> <h5 class="card-header">' + data_set_medicine[i].name + '</h5> <div class="card-body"> <div class="row"> </div> <div class=""> <h6 class="card-subtitle text-muted">ประเภท : ' + data_set_medicine[i].type_desc + '</h6> </div> </div> </div> <div class="card-footer text-muted text-right"> <div class="col-xs-12"> <div class="col-xs-6  text-left"> ระยะทาง ' + data_set_medicine[i].dis + ' กม. </div> <div class="col-xs-6  text-right" onClick="select_place(' + data_set_medicine[i].lat + ',' + data_set_medicine[i].lon + ' )"> <i class="fa fa-search"></i> ตำแหน่ง</div> </div> </div> <hr>'
        show_h3 += '<div class="card mb-3"> <h5 class="card-header">' + data_set_medicine[i].name + '</h5>\
        <h5 class="card-header"> ประเภท ' + data_set_medicine[i].type_desc + ' </h5>\
        <div class="row">\
        <div class="col-6 col-xs-5 text-left"> ระยะทาง ' + data_set_medicine[i].dis + ' กม. </div>\
        <div class="col-6 col-xs-4 text-right"> <a  href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + data_set_medicine[i].lat + ',' + data_set_medicine[i].lon + ' "  target="_blank">  <i class="fa fa-location-arrow"></i> นำทาง</a> </div>\
        <div class="col-6 col-xs-3 text-right" onClick="select_place(' + data_set_medicine[i].lat + ',' + data_set_medicine[i].lon + ' )"> <i class="fa fa-search"></i> ตำแหน่ง </div>\
         </div></div> </div> </div><hr>'
    }
    document.getElementById('show_h3').innerHTML = show_h3





    document.getElementById('btn_search').innerHTML = '<button type="button" class="btn btn-awaycovid btn-lg btn-block" data-toggle="modal" data-target="#search"> <i class="fa fa-search" aria-hidden="true"></i> ค้นหาสถานพยาบาล </button>'

}
map.on('locationfound', onLocationFound);
map.locate();





var local_icon = L.icon({
    iconUrl: 'https://mapedia-th.github.io/away-covid/img/icon.png',
    iconSize: [20, 20]
});


function select_place(lat, lng) {
    $("#search").modal("hide");
    map.setView([lat, lng], 16);
}

function back_local() {
    map.fitBounds(buffereds.getBounds())
}



$("#form_setting").submit(function (event) {
    $("#setting").modal("hide");
    map.fitBounds(buffereds.getBounds())
    event.preventDefault();
    toggle_1 = event.target.toggle_1.checked
    toggle_2 = event.target.toggle_2.checked
    toggle_4 = event.target.toggle_4.checked
    toggle_5 = event.target.toggle_5.checked
    toggle_6 = event.target.toggle_6.checked

    basemap = event.target.basemap.value

    if (basemap == 'base1') {
        gmap.addTo(map)
        osm.remove()
        ghyb.remove()
        CartoDB_DarkMatter.remove()
    } else if (basemap == 'base2') {
        gmap.remove()
        osm.addTo(map)
        ghyb.remove()
        CartoDB_DarkMatter.remove()
    } else if (basemap == 'base3') {
        gmap.remove()
        osm.remove()
        ghyb.addTo(map)
        CartoDB_DarkMatter.remove()
    } else {
        gmap.remove()
        osm.remove()
        ghyb.remove()
        CartoDB_DarkMatter.addTo(map)
    }


    if (toggle_1 == true) {
        แลป_group.clearLayers()
        แลป_clus.clearLayers()
        labcovid.features.forEach(e => {
            var ptsWithin_labcovid = turf.pointsWithinPolygon(e, buffered);
            if (ptsWithin_labcovid.features.length > 0) {
                L.geoJson(ptsWithin_labcovid, {
                    pointToLayer: function (f, latlng) {
                        var distance = turf.distance(point, f, {
                            units: 'kilometers'
                        });
                        f.properties.dis = Number(distance.toFixed(2))
                        return L.marker(latlng, {
                            icon: case_hospital,
                        }).bindPopup('<div class="card mb-3"> <h5 class="card-header">' + f.properties.name + '</h5> <div class="card-body"> <div class="row"> <div class="col-xs-4  text-center"> <img style="border-radius: 10px;" src="' + f.properties.webimage + '" alt="" width="100%"> </div> <div class="col-xs-8"> <h6 class="card-subtitle text-muted">จังหวัด : ' + f.properties.prov + '</h6> <h6 class="card-subtitle text-muted">ที่อยู่ : ' + f.properties.add + '</h6> </div> </div> </div> <div class="card-footer text-muted text-right"> <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div> <div class="col-xs-6  text-right"> <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.long) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank"><button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button></a></div> </div> </div> </div>')
                    }
                }).addTo(แลป_group)
            } else {
                L.geoJson(e, {
                    pointToLayer: function (f, latlng) {
                        var distance = turf.distance(point, f, {
                            units: 'kilometers'
                        });
                        f.properties.dis = Number(distance.toFixed(2))
                        return L.marker(latlng, {
                            icon: case_hospital,
                        }).bindPopup('<div class="card mb-3"> <h5 class="card-header">' + f.properties.name + '</h5> <div class="card-body"> <div class="row"> <div class="col-xs-4  text-center"> <img style="border-radius: 10px;" src="' + f.properties.webimage + '" alt="" width="100%"> </div> <div class="col-xs-8"> <h6 class="card-subtitle text-muted">จังหวัด : ' + f.properties.prov + '</h6> <h6 class="card-subtitle text-muted">ที่อยู่ : ' + f.properties.add + '</h6> </div> </div> </div> <div class="card-footer text-muted text-right"> <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div> <div class="col-xs-6  text-right"> <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.long) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank"><button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button></a></div> </div> </div> </div>')
                    }
                }).addTo(แลป_clus)
            }
        });
    } else {
        แลป_group.clearLayers()
        แลป_clus.clearLayers()
    }


    if (toggle_2 == true) {
        โรงพยาบาล_group.clearLayers()
        โรงพยาบาล_clus.clearLayers()
        geojson_health.features.forEach(e => {
            var ptsWithin_geojson_health = turf.pointsWithinPolygon(e, buffered);
            if (ptsWithin_geojson_health.features.length > 0) {
                hos_all = L.geoJson(ptsWithin_geojson_health, {
                    pointToLayer: function (f, latlng) {
                        var distance = turf.distance(point, f, {
                            units: 'kilometers'
                        });
                        f.properties.dis = Number(distance.toFixed(2))
                        if (f.properties.type_code == '4') {
                            popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                                <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                                <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                                <div class="modal-footer">\
                                <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                                <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                                </div>';

                            return L.marker(latlng, {
                                icon: case_hospital_1,
                            }).bindPopup(popupContent, {
                                maxWidth: "300"
                            });
                        } else if (f.properties.type_code == '5') {
                            popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                                <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                                <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                                <div class="modal-footer">\
                                <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                                <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                                </div>';

                            return L.marker(latlng, {
                                icon: case_hospital_1,
                            }).bindPopup(popupContent, {
                                maxWidth: "300"
                            });
                        } else if (f.properties.type_code == '7') {
                            popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                                <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                                <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                                <div class="modal-footer">\
                                <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                                <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                                </div>';

                            return L.marker(latlng, {
                                icon: case_hospital_2,
                            }).bindPopup(popupContent, {
                                maxWidth: "300"
                            });
                        } else if (f.properties.type_code == '62') {
                            popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                                <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                                <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div></p>\
                                <div class="modal-footer">\
                                <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                                <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                                </div>';
                            return L.marker(latlng, {
                                icon: case_hospital_1,
                                highlight: "temporary"
                            }).bindPopup(popupContent, {
                                maxWidth: "300"
                            });
                        }
                    }
                }).addTo(โรงพยาบาล_group)
            } else {
                hos_all = L.geoJson(e, {
                    pointToLayer: function (f, latlng) {
                        var distance = turf.distance(point, f, {
                            units: 'kilometers'
                        });
                        f.properties.dis = Number(distance.toFixed(2))
                        if (f.properties.type_code == '4') {
                            popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                                <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                                <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                                <div class="modal-footer">\
                                <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                                <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                                </div>';

                            return L.marker(latlng, {
                                icon: case_hospital_1,
                            }).bindPopup(popupContent, {
                                maxWidth: "300"
                            });
                        } else if (f.properties.type_code == '5') {
                            popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                                <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                                <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                                <div class="modal-footer">\
                                <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                                <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                                </div>';

                            return L.marker(latlng, {
                                icon: case_hospital_1,
                            }).bindPopup(popupContent, {
                                maxWidth: "300"
                            });
                        } else if (f.properties.type_code == '7') {
                            popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                                <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                                <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                                <div class="modal-footer">\
                                <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                                <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                                </div>';

                            return L.marker(latlng, {
                                icon: case_hospital_2,
                            }).bindPopup(popupContent, {
                                maxWidth: "300"
                            });
                        } else if (f.properties.type_code == '62') {
                            popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                                <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                                <div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' กม. </div></p>\
                                <div class="modal-footer">\
                                <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                                <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                                </div>';
                            return L.marker(latlng, {
                                icon: case_hospital_1,
                                highlight: "temporary"
                            }).bindPopup(popupContent, {
                                maxWidth: "300"
                            });
                        }
                    }
                }).addTo(โรงพยาบาล_clus)
            }
        });
    } else {
        โรงพยาบาล_group.clearLayers()
        โรงพยาบาล_clus.clearLayers()
    }

    if (toggle_4 == true) {
        รพสต_group.clearLayers()
        รพสต_clus.clearLayers()
        rpst.features.forEach(e => {
            var ptsWithin_rpst = turf.pointsWithinPolygon(e, buffered);
            if (ptsWithin_rpst.features.length > 0) {
                รพสต_in = L.geoJson(ptsWithin_rpst, {
                    pointToLayer: function (f, latlng) {
                        var distance = turf.distance(point, f, {
                            units: 'kilometers'
                        });
                        f.properties.dis = Number(distance.toFixed(2))
                        if (f.properties.type_code == '3') {
                            popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                                <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                                <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                                <div class="modal-footer">\
                                <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                                <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                                </div>';
                            return L.marker(latlng, {
                                icon: case_rpst,
                                highlight: "temporary"
                            }).bindPopup(popupContent, {
                                maxWidth: "300"
                            });
                        }

                    }
                }).addTo(รพสต_group)
            } else {
                รพสต_out = L.geoJson(e, {
                    pointToLayer: function (f, latlng) {
                        var distance = turf.distance(point, f, {
                            units: 'kilometers'
                        });
                        f.properties.dis = Number(distance.toFixed(2))
                        if (f.properties.type_code == '3') {
                            popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                                <h5 class="card-header">จำนวนเตียงที่รองรับผู้ป่วย : ' + f.properties.bed_total + ' เตียง</h5>\
                                <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                                <div class="modal-footer">\
                                <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                                <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลสถานพยาบาล </button></a>\
                                </div>';
                            return L.marker(latlng, {
                                icon: case_rpst,
                                highlight: "temporary"
                            }).bindPopup(popupContent, {
                                maxWidth: "300"
                            });
                        }

                    }
                }).addTo(รพสต_clus)
            }
        });
    } else {
        รพสต_group.clearLayers()
        รพสต_clus.clearLayers()
    }

    if (toggle_5 == true) {
        คลีนิค_group.clearLayers()
        คลีนิค_clus.clearLayers()
        clinic.features.forEach(e => {
            var ptsWithin_clinic = turf.pointsWithinPolygon(e, buffered);
            if (ptsWithin_clinic.features.length > 0) {
                คลีนิค = L.geoJson(ptsWithin_clinic, {
                    pointToLayer: function (f, latlng) {
                        var distance = turf.distance(point, f, {
                            units: 'kilometers'
                        });
                        f.properties.dis = Number(distance.toFixed(0))
                        popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                        <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                        <div class="modal-footer">\
                        <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                        <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลเพิ่มเติม </button></a>\
                        </div>';
                        return L.marker(latlng, {
                            icon: case_clinic,
                        }).bindPopup(popupContent, {
                            maxWidth: "300"
                        });
                        // }).bindPopup('<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4><div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right" > <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">เส้นทาง</a> </div> <br><div class="col-xs-4  text-left"></div><div class="col-xs-8  text-right" > <a href="http://gishealth.moph.go.th/clinic/info.php?maincode=' + f.properties.main_code + '"  target="_blank">ข้อมูลเพิ่มเติม</a> </div></div>');
                    }
                }).addTo(คลีนิค_group)
            } else {
                คลีนิค = L.geoJson(e, {
                    pointToLayer: function (f, latlng) {
                        var distance = turf.distance(point, f, {
                            units: 'kilometers'
                        });
                        f.properties.dis = Number(distance.toFixed(0))
                        popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                        <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                        <div class="modal-footer">\
                        <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                        <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลเพิ่มเติม </button></a>\
                        </div>';
                        return L.marker(latlng, {
                            icon: case_clinic,
                        }).bindPopup(popupContent, {
                            maxWidth: "300"
                        });
                        // }).bindPopup('<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4><div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right" > <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">เส้นทาง</a> </div> <br><div class="col-xs-4  text-left"></div><div class="col-xs-8  text-right" > <a href="http://gishealth.moph.go.th/clinic/info.php?maincode=' + f.properties.main_code + '"  target="_blank">ข้อมูลเพิ่มเติม</a> </div></div>');
                    }
                }).addTo(คลีนิค_clus)
            }
        });
    } else {
        คลีนิค_group.clearLayers()
        คลีนิค_clus.clearLayers()
    }


    if (toggle_6 == true) {
        ยา_group.clearLayers()
        ยา_clus.clearLayers()
        medicine.features.forEach(e => {
            var ptsWithin_medicine = turf.pointsWithinPolygon(e, buffered);
            if (ptsWithin_medicine.features.length > 0) {
                ยา = L.geoJson(ptsWithin_medicine, {
                    pointToLayer: function (f, latlng) {
                        var distance = turf.distance(point, f, {
                            units: 'kilometers'
                        });
                        f.properties.dis = Number(distance.toFixed(0))
                        popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                    <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                    <div class="modal-footer">\
                    <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                    <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลเพิ่มเติม </button></a>\
                    </div>';
                        return L.marker(latlng, {
                            icon: case_medicine,
                        }).bindPopup(popupContent, {
                            maxWidth: "300"
                        });
                        //}).bindPopup('<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4><div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right" > <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">เส้นทาง</a> </div> <br><div class="col-xs-4  text-left"></div><div class="col-xs-8  text-right" > <a href="http://gishealth.moph.go.th/clinic/info.php?maincode=' + f.properties.main_code + '"  target="_blank">ข้อมูลเพิ่มเติม</a> </div></div>');
                    }
                }).addTo(ยา_group)
            } else {
                ยา = L.geoJson(e, {
                    pointToLayer: function (f, latlng) {
                        var distance = turf.distance(point, f, {
                            units: 'kilometers'
                        });
                        f.properties.dis = Number(distance.toFixed(0))
                        popupContent = '<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4> \
                    <h5 class="card-header"> ระยะทาง ' + f.properties.dis + ' กม. </h5></div>\
                    <div class="modal-footer">\
                    <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">  <button type="button" class="btn btn-info" data-dismiss="modal">นำทาง</button> </a>\
                    <a href="http://gishealth.moph.go.th/healthmap/info.php?maincode=' + f.properties.main_code + '" target="_blank"> <button type="button" class="btn btn-success" data-dismiss="modal">ข้อมูลเพิ่มเติม </button></a>\
                    </div>';
                        return L.marker(latlng, {
                            icon: case_medicine,
                        }).bindPopup(popupContent, {
                            maxWidth: "300"
                        });
                        //}).bindPopup('<div class="card mb-3"> <h4 class="card-header">' + f.properties.name + '</h4><div class="row"> <div class="col-xs-6  text-left"> ระยะทาง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right" > <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">เส้นทาง</a> </div> <br><div class="col-xs-4  text-left"></div><div class="col-xs-8  text-right" > <a href="http://gishealth.moph.go.th/clinic/info.php?maincode=' + f.properties.main_code + '"  target="_blank">ข้อมูลเพิ่มเติม</a> </div></div>');
                    }
                }).addTo(ยา_clus)
            }
        });
    } else {
        ยา_group.clearLayers()
        ยา_clus.clearLayers()
    }








})