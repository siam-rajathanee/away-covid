async function getUserProfile() {
    profile = await liff.getProfile()
    pictureUrl = profile.pictureUrl
    userId = profile.userId
    displayName = profile.displayName
    if (pictureUrl == undefined) {
        pictureUrl = ''
    }
    document.getElloadingementById('displayname').innerHTML = '<h4 id="displayname">' + displayName + '</h4>'
    document.getElementById('img_profile').innerHTML = '<img id="img_profile" class="profile_img" src="' + pictureUrl + '" alt="">'
}
async function main() {
    liff.ready.then(() => {
        if (liff.isLoggedIn()) {
            getUserProfile()
        } else {
            liff.login()
        }
    })
    await liff.init({ liffId: "1653981898-q0jEx1on" })
}
main()

// userId = 'U813edb9e9e22c2dc43d39fcdab3d9ff9'
// displayName = 'MAPEDIA'



$(function () {
    $('[data-toggle="popover"]').popover()
})


var map = L.map('map'
    , { attributionControl: false }
).setView([13.751569, 100.501634], 9);



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

ghyb = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
    attributions: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
})

gter = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

gmap = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    attributions: '&copy; <a href="https://www.google.co.th/maps">Google Maps</a>'
})

// var today = new Date().getHours();
// if (today >= 6 && today <= 18) {
//     CartoDB_Positron.addTo(map)
// } else {
//     CartoDB_DarkMatter.addTo(map)
// }


points_case = L.layerGroup().addTo(map)
//markerClusterGroup = L.markerClusterGroup().addTo(map)
markerClusterGroup = L.layerGroup().addTo(map)
point_ann = L.layerGroup().addTo(map)
set_map = L.layerGroup().addTo(map)
line_track = L.layerGroup().addTo(map)



// map.on('zoomend', function (e) {
//     zoom = e.target._zoom
//     if (zoom <= 10) {
//         point_ann.clearLayers()
//         geo_test.addTo(markerClusterGroup)
//     } else {
//         markerClusterGroup.clearLayers()
//         geo_test.addTo(point_ann)
//     }
// });


document.getElementById('loading').innerHTML = ' <div id="loading" class="loader"></div>'
document.getElementById('tracking').innerHTML = ''
document.getElementById('routing_readme').innerHTML = ''


var case_confirm = L.icon({
    iconUrl: 'img/confirm_case.png',
    iconSize: [50, 50], // size of the icon
});
var case_success = L.icon({
    iconUrl: 'img/success_case.png',
    iconSize: [50, 50], // size of the icon
});
var case_warning = L.icon({
    iconUrl: 'img/warning_case.png',
    iconSize: [50, 50], // size of the icon
});
var case_null = L.icon({
    iconUrl: 'img/null_case.png',
    iconSize: [50, 50], // size of the icon
});
var case_clean = L.icon({
    iconUrl: 'img/clean.png',
    iconSize: [50, 50], // size of the icon
});
var case_death = L.icon({
    iconUrl: 'img/death.png',
    iconSize: [50, 50], // size of the icon
});
var case_send = L.icon({
    iconUrl: 'img/send.png',
    iconSize: [50, 50], // size of the icon
});
var case_hospital = L.icon({
    iconUrl: 'img/hospital.png',
    iconSize: [50, 50], // size of the icon
});
var case_hospital_1 = L.icon({
    iconUrl: 'img/hospital_1.png',
    iconSize: [40, 40], // size of the icon
});
var case_place_announce = L.icon({
    iconUrl: 'img/place.svg',
    iconSize: [50, 50], // size of the icon
});
var local_icon = L.icon({
    iconUrl: 'https://mapedia-th.github.io/away-covid/img/icon.png',
    iconSize: [20, 20]
});
var warning_covid = L.icon({
    iconUrl: 'img/warning_covid.png',
    iconSize: [30, 30], // size of the icon
});


function onEachFeature_place_announce(f, layer) {
    // var popup = '<div class="card mb-3"> <h3 class="card-header">' + f.properties.place + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + '</div> </div>'
    var popup = '<div class="card mb-3"> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <h5 class="card-title">เหลืออีก ' + f.properties.daysDiff + ' วัน จะพ้นระยะเฝ้าระวัง </h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + '</div> </div>'
    layer.bindPopup(popup)
}
function onEachFeature(f, layer) {
    var popup = '<div class="card mb-3"> <h3 class="card-header">' + f.properties.place_name + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">จำนวนผู้ป่วย : ' + f.properties.case_numbe + ' ราย</h5> <p class="card-title">สถานะ : ' + f.properties.status_pat + ' </p> <p class="card-title">รายละเอียด : ' + f.properties.description + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.ref_source + ' </p> </div> <div class="card-body"></div> <div class="card-body"> <a href="' + f.properties.link_news + '" class="card-link" targer="_blank"> Link ข่าวอ้างอิง </a> </div> <div class="card-footer text-muted">วันที่ลงข่าว : ' + f.properties.date_start + '</div> </div>'
    layer.bindPopup(popup)
}

// function get_track() {
//     document.getElementById('tracking').innerHTML = '<button id="tracking" class="btn btn-tracking  btn-xs" onclick="get_tracking()"> <i class="fa fa-thumb-tack  fa-lg" aria-hidden="true"></i> <br> บันทึก<br>ตำแหน่ง<br>เส้นทาง </button>'
// }
// map.on('click', function () {
//     document.getElementById('tracking').innerHTML = '<button id="tracking" class="btn btn-tracking  btn-xs" onclick="get_tracking()"> <i class="fa fa-thumb-tack  fa-lg" aria-hidden="true"></i> <br> บันทึก<br>ตำแหน่ง<br>เส้นทาง </button>'
// })

function get_tracking() {
    var json_buf = []
    json_place_ann.forEach(e => {
        buffered = turf.buffer(e, 1, { units: 'kilometers' });
        json_buf.push(buffered)
    });


    var lat = get_latlng[1]
    var lng = get_latlng[0]

    $.ajax({
        url: 'https://mapedia.co.th/demo/add_tracking.php?type=tracking',
        method: 'post',
        data: ({
            userId: userId,
            displayName: displayName,
            lat: lat,
            lng: lng
        }),
        success: function (res) {
            set_map.clearLayers()

            var json_track = JSON.parse(res)

            var alert_anno = []
            for (let a = 0; a < json_track.features.length; a++) {
                for (let b = 0; b < json_buf.length; b++) {
                    var ptsWithin = turf.pointsWithinPolygon(json_track.features[a], json_buf[b]);
                    var res = json_track.features[a].properties.date_view.split(" ");
                    if (ptsWithin.features.length > 0 && json_buf[b].properties.date_risk == res[0]) {
                        alert_anno.push(json_buf[b].properties)
                    }
                }
            }

            if (alert_anno.length > 0) {
                document.getElementById('alert_anno').innerHTML = '<div class="alert alert-dismissible alert-danger"> <button type="button" class="close" data-dismiss="alert">&times;</button> <strong>คำเตือน !</strong> ท่านเคยเข้าไปยังสถานที่ที่มีผู้ป่วยโรค Covid 19 เมื่อวันนี้ ' + alert_anno[0].date_risk + ' ณ สถานที่ ' + alert_anno[0].place + ' กรุณาติดต่อไปยัง' + alert_anno[0].announce + ' </div>'

                map.setView([alert_anno[0].lat, alert_anno[0].lon], 14);
            } else {
                map.setView([lat, lng], 14);
            }

            var trac_table = ''
            var p_t_l = [[
                Number(json_track.features[0].properties.lng),
                Number(json_track.features[0].properties.lat)
            ], [
                Number(json_track.features[0].properties.lng),
                Number(json_track.features[0].properties.lat)
            ]]

            for (var i = 0; i < json_track.features.length; i++) {
                p_t_l.push(
                    [
                        Number(json_track.features[i].properties.lng),
                        Number(json_track.features[i].properties.lat)
                    ]
                )
                trac_table += ' <tr> <td>  ' + parseInt(json_track.features[i].properties.lng).toFixed(2) + ' , '
                    + parseInt(json_track.features[i].properties.lat).toFixed(2) + '  </td>  <td> '
                    + json_track.features[i].properties.date_view + ' </td></tr > '
            }

            var line = turf.lineString(p_t_l);
            view_line = L.geoJson(line).addTo(line_track)


            document.getElementById('tracking').innerHTML = '<button id="tracking"  class="btn btn-warning btn-xs"  onclick="get_loca()"> <i class="fa fa-compass  fa-lg" aria-hidden="true"></i><br> ปิด <br>ตำแหน่ง <br> เส้นทาง</button>'

        }, error: function (e) {
        }
    })

}
var legend = L.control({ position: 'bottomright' });
function showDisclaimer() {
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        div.innerHTML += '<img src="img/success_case.png" width="30px"> <small class="prompt"> รักษาหายแล้ว </small> <br> ';
        div.innerHTML += '<img src="img/warning_case.png" width="30px"> <small class="prompt"> กักตัว 14 วัน </small> <br> ';
        //div.innerHTML += '<img src="img/send.png" width="30px"> <small class="prompt"> ส่งตัวต่อเพื่อทำการรักษา </small> <br> ';
        div.innerHTML += '<img src="img/confirm_case.png" width="30px"> <small class="prompt"> กำลังรักษา </small> <br> ';
        div.innerHTML += '<img src="img/null_case.png" width="30px"> <small class="prompt"> ไม่ทราบสถานะ </small> <br> ';
        div.innerHTML += '<img src="img/death.png" width="30px"> <small class="prompt"> เสียชีวิต </small> ';
        div.innerHTML += ' <hr class="hr_0">  ';
        //div.innerHTML += '<img src="img/clean.png" width="30px"> <small class="prompt"> ฆ่าเชื้อทำความสะอาดแล้ว </small> <br> ';
        div.innerHTML += '<img src="img/place.svg" width="30px"> <small class="prompt"> พื้นที่เสี่ยงเฝ้าระวัง </small>   ';
        div.innerHTML += ' <hr class="hr_0">  ';
        div.innerHTML += '<img src="img/warning_covid.png" width="30px"> <small class="prompt"> จุดคัดกรอง </small>  ';
        div.innerHTML += ' <hr class="hr_0">  ';
        div.innerHTML += '<img src="img/lock_down.png" width="30px"> <small class="prompt"> พื้นที่ Lockdown </small> <br> ';
        // div.innerHTML += '<img src="img/curfew.png" width="20px"> <small class="prompt"> พื้นที่ Curfew </small> <br> ';
        div.innerHTML += '<button  class="btn btn-default btn-block"  onClick="hideDisclaimer()"><small class="prompt"> ซ่อนสัญลักษณ์</small><i class="fa fa-angle-double-down" aria-hidden="true"></i></button>';

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


function style_lock(feature) {
    return {
        weight: 3,
        opacity: 1,
        color: '#800026',
        dashArray: '3',
        fillOpacity: 0
    };
}
function style_curfew(feature) {
    return {
        weight: 3,
        opacity: 1,
        color: '#ff6600',
        dashArray: '3',
        fillOpacity: 0
    };
}
var list_lock_pro = [
    'ปัตตานี', 'ยะลา', 'นราธิวาส', 'ภูเก็ต', 'พิษณุโลก', 'ระนอง', 'สตูล', 'พังงา', 'กระบี่', 'ตราด', 'บุรีรัมย์', 'อุทัยธานี', 'พัทลุง', 'เชียงราย', 'น่าน', 'ตาก', 'สงขลา'
];
//var list_curfew_pro = ['แม่ฮ่องสอน', 'กรุงเทพมหานคร', 'นนทบุรี'];
lockdown = []
for (let i = 0; i < list_lock_pro.length; i++) {
    lockdown.push(province_geojson.features.find(e => e.properties.pv_tn == list_lock_pro[i]))
    L.geoJson(province_geojson.features.find(e => e.properties.pv_tn == list_lock_pro[i]), {
        style: style_lock
    }).addTo(map)
}

// curfew = []
// for (let i = 0; i < list_curfew_pro.length; i++) {
//     curfew.push(province_geojson.features.find(e => e.properties.pv_tn == list_curfew_pro[i]))
//     L.geoJson(province_geojson.features.find(e => e.properties.pv_tn == list_curfew_pro[i]), {
//         style: style_curfew
//     }).addTo(map)
// }


function get_loca() {


    document.getElementById('loading').innerHTML = ' <div id="loading" class="loader"></div>'
    document.getElementById("form_setting").submit();

    // set_map.clearLayers()
    // line_track.clearLayers()
    // map.locate();
}

$("#form_query").submit(function (event) {
    $("#search").modal("hide");
    event.preventDefault();
    var place = event.target.place.value
    view_place = ''
    for (var i = 0; i < case_point.features.length; i++) {
        if (case_point.features[i].properties.place_name == place) {
            view_place = case_point.features[i]
        }
    }
    var lat = view_place.properties.lat
    var lon = view_place.properties.lon
    map.setView([lat, lon], 17);
})

function get_point() {
    var date = new Date();
    date.setDate(date.getDate() - 7);
    finalDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()


    var json_query = []
    for (let i = 0; i < geojson_covidcase.features.length; i++) {
        if (Date.parse(geojson_covidcase.features[i].properties.date_start) >= Date.parse(finalDate)) {
            json_query.push(geojson_covidcase.features[i])
        }
    }
    var nietos = [];
    var obj = {};
    obj["type"] = "FeatureCollection";
    obj["features"] = json_query
    nietos.push(obj)

    case_point = nietos[0]


    var date = new Date();
    date.setDate(date.getDate());
    nowdate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    document.getElementById('date_up').innerHTML = '<small> อัพเดตข้อมูลล่าสุดวันที่ : ' + nowdate + '</small>'


    var option_dropdown = '<option value="">- - กรุณาเลือก - -</option>'
    for (var i = 0; i < case_point.features.length; i++) {
        option_dropdown += ' <option value="' + case_point.features[i].properties.place_name + '"> ' + case_point.features[i].properties.place_name + '</option>'
    }
    document.getElementById('select_place').innerHTML = option_dropdown


    L.geoJson(case_point, {
        pointToLayer: function (f, latlng) {
            if (f.properties.status_pat == 'รักษาหายแล้ว') {
                return L.marker(latlng, {
                    icon: case_success,
                    highlight: "temporary"
                });
            } else if (f.properties.status_pat == 'กำลังรักษา') {
                return L.marker(latlng, {
                    icon: case_confirm,
                    highlight: "temporary"
                });
            } else if (f.properties.status_pat == 'กักตัว 14 วัน') {
                return L.marker(latlng, {
                    icon: case_warning,
                    highlight: "temporary"
                });
            } else if (f.properties.status_pat == 'ไม่ทราบสถานะ') {
                return L.marker(latlng, {
                    icon: case_null,
                    highlight: "temporary"
                });
            } else if (f.properties.status_pat == 'ฆ่าเชื้อทำความสะอาดแล้ว') {
                return L.marker(latlng, {
                    icon: case_clean,
                    highlight: "temporary"
                });
            } else if (f.properties.status_pat == 'เสียชีวิต') {
                return L.marker(latlng, {
                    icon: case_death,
                    highlight: "temporary"
                });
            } else if (f.properties.status_pat == 'ส่งตัวต่อเพื่อทำการรักษา') {
                return L.marker(latlng, {
                    icon: case_send,
                    highlight: "temporary"
                });
            } else if (f.properties.status_pat == 'บริการตรวจ COVID') {
                return L.marker(latlng, {
                    icon: case_hospital,
                    highlight: "temporary"
                });
            }

        },
        onEachFeature: onEachFeature
    }).addTo(points_case)

    json_place_ann = []
    geojson_ann.features.forEach(e => {
        var date2 = nowdate
        var date1 = e.properties.date_risk
        date1 = date1.split("-");
        date2 = date2.split("-");
        sDate = new Date(date1[0], date1[1] - 1, date1[2]);
        eDate = new Date(date2[0], date2[1] - 1, date2[2]);
        var daysDiff = Math.round((eDate - sDate) / 86400000);
        if (daysDiff <= 14) {
            e.properties.daysDiff = 15 - daysDiff
            json_place_ann.push(e)
        }
        if (daysDiff <= 5) {
            geo_test = L.geoJson(e, {
                pointToLayer: function (f, latlng) {
                    return L.marker(latlng, {
                        icon: case_place_announce,
                        opacity: 1
                    });
                },
                onEachFeature: onEachFeature_place_announce
            }).addTo(point_ann)
        } else if (daysDiff <= 10) {
            geo_test = L.geoJson(e, {
                pointToLayer: function (f, latlng) {
                    return L.marker(latlng, {
                        icon: case_place_announce,
                        opacity: 0.7
                    });
                },
                onEachFeature: onEachFeature_place_announce
            }).addTo(point_ann)
        } else if (daysDiff <= 14) {
            geo_test = L.geoJson(e, {
                pointToLayer: function (f, latlng) {
                    return L.marker(latlng, {
                        icon: case_place_announce,
                        opacity: 0.3
                    });
                },
                onEachFeature: onEachFeature_place_announce
            }).addTo(point_ann)
        }
    })


    var nietos2 = [];
    var obj2 = {};
    obj2["type"] = "FeatureCollection";
    obj2["features"] = json_place_ann
    nietos2.push(obj2)
    place_announce = nietos2[0]






    L.geoJson(geojson_checkpoint, {
        pointToLayer: function (f, latlng) {
            return L.marker(latlng, {
                icon: warning_covid,
            }).bindPopup('<b>' + f.properties.check_name + ' </b><br>' + f.properties.description)
        },
    }).addTo(points_case)


    function onLocationFound(e) {
        document.getElementById('loading').innerHTML = ''
        document.getElementById('tracking').innerHTML = '<button id="tracking" class="btn btn-tracking btn-xs" onclick="get_tracking()"> <i class="fa fa-thumb-tack  fa-lg" aria-hidden="true"></i> <br> บันทึก<br>ตำแหน่ง<br>เส้นทาง </button>'
        document.getElementById('routing').innerHTML = '<button type="button" class="btn btn-routing btn-xs" onclick="viewRouting()"> <i class="fa fa-map-signs" aria-hidden="true"></i> <br> สำรวจ <br>เส้นทาง </button>'

        var radius = 5;
        get_latlng = [e.latlng.lng, e.latlng.lat] // e.latlng16.7289774,100.1912686
        // get_latlng = [100.266778, 16.842412]

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
        document.getElementById('lock_down').innerHTML = '<p id="lock_down" class=" alert_curfew_text" data-toggle="popover" title=" คำแนะนำ" data-content="ท่านอยู่ในพื้นที่ Curfew ห้ามประชาชนออกนอกเคหสถานระหว่างเวลา 22.00 น. ถึงเวลา 04.00 น."  data-placement="bottom" ><i class="fa fa-bolt" aria-hidden="true"></i> Curfew</p>'

        for (let i = 0; i < lockdown.length; i++) {
            var pointlock = turf.pointsWithinPolygon(point, lockdown[i]);
            if (pointlock.features.length == 1) {
                document.getElementById('lock_down').innerHTML = '<p id="lock_down" class=" alert_lockdown_text"   data-toggle="popover" title=" คำแนะนำ" data-content="ท่านอยู่ในพื้นที่ Lockdown ห้ามประชาชนเดินทางเข้า-ออกข้ามเขตพื้นที่เพื่อป้องกันและสกัดโรคโควิด-19 ห้ามประชาชนออกนอกเคหสถานระหว่างเวลา 22.00 น. ถึงเวลา 04.00 น."  data-placement="bottom" ><i class="fa fa-lock"></i> Lockdown</p>'
            }
        }
        // for (let i = 0; i < curfew.length; i++) {
        //     var pointlock = turf.pointsWithinPolygon(point, curfew[i]);
        //     if (pointlock.features.length == 1) {
        //         document.getElementById('lock_down').innerHTML = '<p id="lock_down" class=" alert_curfew_text" data-toggle="popover" title=" คำแนะนำ" data-content="ท่านอยู่ในพื้นที่ Curfew ห้ามประชาชนออกนอกเคหสถานระหว่างเวลา 23.00 น. ถึงเวลา 05.00 น."  data-placement="bottom" ><i class="fa fa-bolt" aria-hidden="true"></i> Curfew</p>'
        //     }
        // }




        var buffered = turf.buffer(point, radius, { units: 'kilometers' });


        var ptsWithin = turf.pointsWithinPolygon(case_point, buffered);
        var ptsWithplace_announce = turf.pointsWithinPolygon(place_announce, buffered);

        var data = ptsWithin.features
        var table = ''
        for (var i = 0; i < data.length; i++) {
            var distance = turf.distance(point, data[i], { units: 'kilometers' });
            table += '  <tr> <td>   ' + data[i].properties.place_name + '<br> <small> ระยะห่าง : ' + distance.toFixed(1) + ' km </small> </td><td>   ' + data[i].properties.case_numbe + '    </td><td>  ' + data[i].properties.status_pat + '   </td></tr> '
        }
        document.getElementById('tabel_data').innerHTML = table

        var data_place_announce = ptsWithplace_announce.features
        var tb_announce = ''
        data_place_announce.forEach(function (f) {
            // tb_announce += '<div class="card mb-3 "> <h3 class="card-header">' + f.properties.place + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + ' </div> </div> <hr>'
            tb_announce += '<div class="card mb-3 "> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + ' </div> </div> <hr>'
        });
        document.getElementById('tabel_announce').innerHTML = tb_announce


        if (data.length != 0 || data_place_announce.length != 0) {
            // document.getElementById('alert_warning').innerHTML = '<div class="alert  alert-danger alert_show"> <button type="button" class="close" data-dismiss="alert">x</button> <strong>คำเตือน !</strong> ขณะนี้ท่านอยู่ในพื้นที่ที่มีการรายงานข่าวเคสผู้ป่วยหรือพื้นที่ที่เสี่ยงการระบาด </div>'
            document.getElementById('alert_text').innerHTML = '<p id="alert_text" class="alert_danger_text" data-toggle="popover" title=" คำแนะนำ" data-content="ท่านอยู่ในพื้นที่ที่เสี่ยงต่อการระบาด"  data-placement="bottom"><i class="fa fa-dot-circle-o" aria-hidden="true"></i> ใกล้พื้นที่เสี่ยง</p > '

            var buffereds = L.geoJson(buffered, {
                stroke: false,
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.1,
            }).addTo(set_map)
            map.fitBounds(buffereds.getBounds())
        } else {
            document.getElementById('alert_text').innerHTML = '<p id="alert_text" class="alert_success_text"><i class="fa fa-smile-o" aria-hidden="true"></i> ห่างพื้นที่เสี่ยง</p>'
            var buffereds = L.geoJson(buffered, {
                stroke: false,
                color: 'green',
                fillColor: 'green',
                fillOpacity: 0.1,
            }).addTo(set_map)
            map.fitBounds(buffereds.getBounds())
        }
    }

    map.on('locationfound', onLocationFound);
    map.locate();
}

$("#form_setting").submit(function (event) {

    $("#setting").modal("hide");

    markerClusterGroup.clearLayers()
    points_case.clearLayers()
    point_ann.clearLayers()
    set_map.clearLayers()

    event.preventDefault();
    radius = event.target.radius.value
    date = event.target.date.value
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

    var date = new Date();
    date.setDate(date.getDate() - event.target.date.value);
    finalDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()


    var json_query = []
    for (let i = 0; i < geojson_covidcase.features.length; i++) {
        if (Date.parse(geojson_covidcase.features[i].properties.date_start) >= Date.parse(finalDate)) {
            json_query.push(geojson_covidcase.features[i])
        }
    }
    var nietos = [];
    var obj = {};
    obj["type"] = "FeatureCollection";
    obj["features"] = json_query
    nietos.push(obj)

    case_point = nietos[0]


    var option_dropdown = '<option value="">- - กรุณาเลือก - -</option>'
    for (var i = 0; i < case_point.features.length; i++) {
        option_dropdown += ' <option value="' + case_point.features[i].properties.place_name + '"> ' + case_point.features[i].properties.place_name + '</option>'
    }
    document.getElementById('select_place').innerHTML = option_dropdown





    var json_place_ann = []
    geojson_ann.features.forEach(e => {
        var date2 = nowdate
        var date1 = e.properties.date_risk
        date1 = date1.split("-");
        date2 = date2.split("-");
        sDate = new Date(date1[0], date1[1] - 1, date1[2]);
        eDate = new Date(date2[0], date2[1] - 1, date2[2]);
        var daysDiff = Math.round((eDate - sDate) / 86400000);
        if (daysDiff <= 14) {
            json_place_ann.push(e)
        }
        if (daysDiff <= 5) {
            geo_test = L.geoJson(e, {
                pointToLayer: function (f, latlng) {
                    return L.marker(latlng, {
                        icon: case_place_announce,
                        opacity: 1
                    });
                },
                onEachFeature: onEachFeature_place_announce
            }).addTo(point_ann)
        } else if (daysDiff <= 10) {
            geo_test = L.geoJson(e, {
                pointToLayer: function (f, latlng) {
                    return L.marker(latlng, {
                        icon: case_place_announce,
                        opacity: 0.7
                    });
                },
                onEachFeature: onEachFeature_place_announce
            }).addTo(point_ann)
        } else if (daysDiff <= 14) {
            geo_test = L.geoJson(e, {
                pointToLayer: function (f, latlng) {
                    return L.marker(latlng, {
                        icon: case_place_announce,
                        opacity: 0.3
                    });
                },
                onEachFeature: onEachFeature_place_announce
            }).addTo(point_ann)
        }
    });

    var nietos2 = [];
    var obj2 = {};
    obj2["type"] = "FeatureCollection";
    obj2["features"] = json_place_ann
    nietos2.push(obj2)
    place_announce = nietos2[0]


    L.geoJson(case_point, {
        pointToLayer: function (f, latlng) {
            if (f.properties.status_pat == 'รักษาหายแล้ว') {
                return L.marker(latlng, {
                    icon: case_success,
                    highlight: "temporary"
                });
            } else if (f.properties.status_pat == 'กำลังรักษา') {
                return L.marker(latlng, {
                    icon: case_confirm,
                    highlight: "temporary"
                });
            } else if (f.properties.status_pat == 'กักตัว 14 วัน') {
                return L.marker(latlng, {
                    icon: case_warning,
                    highlight: "temporary"
                });
            } else if (f.properties.status_pat == 'ไม่ทราบสถานะ') {
                return L.marker(latlng, {
                    icon: case_null,
                    highlight: "temporary"
                });
            } else if (f.properties.status_pat == 'ฆ่าเชื้อทำความสะอาดแล้ว') {
                return L.marker(latlng, {
                    icon: case_clean,
                    highlight: "temporary"
                });
            } else if (f.properties.status_pat == 'เสียชีวิต') {
                return L.marker(latlng, {
                    icon: case_death,
                    highlight: "temporary"
                });
            } else if (f.properties.status_pat == 'ส่งตัวต่อเพื่อทำการรักษา') {
                return L.marker(latlng, {
                    icon: case_send,
                    highlight: "temporary"
                });
            } else if (f.properties.status_pat == 'บริการตรวจ COVID') {
                return L.marker(latlng, {
                    icon: case_hospital,
                    highlight: "temporary"
                });
            }

        },
        onEachFeature: onEachFeature
    }).addTo(points_case)

    L.geoJson(geojson_checkpoint, {
        pointToLayer: function (f, latlng) {
            return L.marker(latlng, {
                icon: warning_covid,
            }).bindPopup('<b>' + f.properties.check_name + ' </b><br>' + f.properties.description)
        },
    }).addTo(points_case)

    if (toggle_1 == false) {
        points_case.clearLayers()
    }
    if (toggle_2 == false) {
        point_ann.clearLayers()
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
    var ptsWithin = turf.pointsWithinPolygon(case_point, buffered);
    var ptsWithplace_announce = turf.pointsWithinPolygon(place_announce, buffered);


    var data = ptsWithin.features
    var data_place_announce = ptsWithplace_announce.features



    if (data.length != 0 || data_place_announce.length != 0) {
        // document.getElementById('alert_warning').innerHTML = '<div class="alert  alert-danger alert_show"> <button type="button" class="close" data-dismiss="alert">x</button> <strong>คำเตือน !</strong> ขณะนี้ท่านอยู่ในพื้นที่ที่มีการรายงานข่าวเคสผู้ป่วยหรือพื้นที่ที่เสี่ยงการระบาด </div>'
        document.getElementById('alert_text').innerHTML = '<p id="alert_text" class="alert_danger_text" data-toggle="popover" title=" คำแนะนำ" data-content="ท่านอยู่ในพื้นที่ที่เสี่ยงต่อการระบาด"  data-placement="bottom"><i class="fa fa-dot-circle-o" aria-hidden="true"></i> ใกล้พื้นที่เสี่ยง</p > '

        var buffereds = L.geoJson(buffered, {
            stroke: false,
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.1,
        }).addTo(set_map)
        map.fitBounds(buffereds.getBounds())
    } else {
        document.getElementById('alert_text').innerHTML = '<p id="alert_text" class="alert_success_text"><i class="fa fa-smile-o" aria-hidden="true"></i> ห่างพื้นที่เสี่ยง</p>'
        var buffereds = L.geoJson(buffered, {
            stroke: false,
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.1,
        }).addTo(set_map)
        map.fitBounds(buffereds.getBounds())
    }


    var table = ''
    for (var i = 0; i < data.length; i++) {
        var distance = turf.distance(point, data[i], { units: 'kilometers' });
        table += '  <tr> <td>   ' + data[i].properties.place_name + '<br> <small> ระยะห่าง : ' + distance.toFixed(1) + ' km </small> </td><td>   ' + data[i].properties.case_numbe + '    </td><td>  ' + data[i].properties.status_pat + '   </td></tr> '
    }
    document.getElementById('tabel_data').innerHTML = table

    var tb_announce = ''
    data_place_announce.forEach(function (f) {
        //  tb_announce += '<div class="card mb-3 "> <h3 class="card-header">' + f.properties.place + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + ' </div> </div> <hr>'
        tb_announce += '<div class="card mb-3 "><div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + ' </div> </div> <hr>'
    });
    document.getElementById('tabel_announce').innerHTML = tb_announce




})


function viewRouting() {
    document.getElementById('routing_readme').innerHTML = '<div id="routing_readme" class="alert alert-dismissible alert-success"> <button type="button" data-dismiss="alert">&times;</button> <strong>การสำรวจเส้นทาง!</strong> <br> ท่านสามารถกดไปยังแผนที่เพื่อค้นหาเส้นทางได้ </div>'
    markerClusterGroup.clearLayers()
    points_case.clearLayers()
    point_ann.clearLayers()



    map.setView([13.817504, 100.715385], 6)
    map.on('click', function (e) {
        document.getElementById('loading').innerHTML = ' <div id="loading" class="loader"></div>'
        points_case.clearLayers()

        document.getElementById('routing').innerHTML = '<button  type="button" class="btn btn-warning btn-xs" onclick="get_loca()"> <i class="fa fa-times-circle" aria-hidden="true"></i> <br> ปิด <br>เส้นทาง </button>'

        var waypoints = [
            L.latLng(get_latlng[1], get_latlng[0]),
            L.latLng(e.latlng.lat, e.latlng.lng)
        ]

        $.getJSON("https://rti2dss.com:3300/api/route/" + waypoints[0].lat + "/" + waypoints[0].lng + "/" + waypoints[1].lat + "/" + waypoints[1].lng + "", function (data) {
            document.getElementById('loading').innerHTML = ''

            L.marker([data.data.waypoints[1].location[1], data.data.waypoints[1].location[0]]).addTo(points_case)

            var step = data.data.routes[0].legs[0].steps

            var line_step = []
            step.forEach(e => {
                e.intersections.forEach(element => {
                    line_step.push([element.location[0], element.location[1]])
                });
            });
            var linestring1 = turf.lineString(line_step);
            var buffered = turf.buffer(linestring1, 10, { units: 'kilometers' });

            var line_view = L.geoJson(linestring1).addTo(points_case)
            map.fitBounds(line_view.getBounds())

            case_point.features.forEach(e => {
                var ptsWithin = turf.pointsWithinPolygon(e, buffered);
                if (ptsWithin.features.length > 0) {
                    L.geoJson(ptsWithin, {
                        pointToLayer: function (f, latlng) {
                            if (f.properties.status_pat == 'รักษาหายแล้ว') {
                                return L.marker(latlng, {
                                    icon: case_success,
                                    highlight: "temporary"
                                });
                            } else if (f.properties.status_pat == 'กำลังรักษา') {
                                return L.marker(latlng, {
                                    icon: case_confirm,
                                    highlight: "temporary"
                                });
                            } else if (f.properties.status_pat == 'กักตัว 14 วัน') {
                                return L.marker(latlng, {
                                    icon: case_warning,
                                    highlight: "temporary"
                                });
                            } else if (f.properties.status_pat == 'ไม่ทราบสถานะ') {
                                return L.marker(latlng, {
                                    icon: case_null,
                                    highlight: "temporary"
                                });
                            } else if (f.properties.status_pat == 'ฆ่าเชื้อทำความสะอาดแล้ว') {
                                return L.marker(latlng, {
                                    icon: case_clean,
                                    highlight: "temporary"
                                });
                            } else if (f.properties.status_pat == 'เสียชีวิต') {
                                return L.marker(latlng, {
                                    icon: case_death,
                                    highlight: "temporary"
                                });
                            } else if (f.properties.status_pat == 'ส่งตัวต่อเพื่อทำการรักษา') {
                                return L.marker(latlng, {
                                    icon: case_send,
                                    highlight: "temporary"
                                });
                            } else if (f.properties.status_pat == 'บริการตรวจ COVID') {
                                return L.marker(latlng, {
                                    icon: case_hospital,
                                    highlight: "temporary"
                                });
                            }

                        },
                        onEachFeature: onEachFeature
                    }).addTo(points_case)
                }
            });

        })


    });



}

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
