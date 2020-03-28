async function getUserProfile() {
    profile = await liff.getProfile()
    pictureUrl = profile.pictureUrl
    userId = profile.userId
    displayName = profile.displayName
    decodedIDToken = liff.getDecodedIDToken().email
    if (pictureUrl == undefined) {
        pictureUrl = ''
    }

    $.ajax({
        url: 'https://rti2dss.com/mapedia.serv/add_tracking.php?type=login',
        method: 'post',
        data: ({
            pictureUrl: pictureUrl,
            userId: userId,
            displayName: displayName,
            decodedIDToken: decodedIDToken,
            page_view: 'index.html'
        }),
        success: function (data) {
        }
    })
    console.log(pictureUrl);
    console.log('<img id="img_profile" class="profile_img" src="' + pictureUrl + '" alt="">');

    document.getElementById('displayname').innerHTML = '<h4 id="displayname">' + displayName + '</h4>'
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




new Vue({
    el: '#app_vue',
    data() {
        return {
            info: null,
        }
    },
    mounted() {
        axios
            .get('https://rti2dss.com/mapedia.serv/get_point.php?date=7')
            .then(async function (res) {
                case_point = res.data.covidcase
                place_announce = res.data.place_announce
                var option_dropdown = '<option value="">- - กรุณาเลือก - -</option>'
                for (var i = 0; i < case_point.features.length; i++) {
                    option_dropdown += ' <option value="' + case_point.features[i].properties.place_name + '"> ' + case_point.features[i].properties.place_name + '</option>'
                }
                document.getElementById('select_place').innerHTML = option_dropdown

                function onEachFeature(f, layer) {
                    var popup = '<div class="card mb-3"> <h3 class="card-header">' + f.properties.place_name + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">จำนวนผู้ป่วย : ' + f.properties.case_numbe + ' ราย</h5> <p class="card-title">สถานะ : ' + f.properties.status_pat + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.ref_source + ' </p> </div> <div class="card-body"></div> <div class="card-body"> <a href="' + f.properties.link_news + '" class="card-link" targer="_blank"> Link ข่าวอ้างอิง </a> </div> <div class="card-footer text-muted">วันที่ลงข่าว : ' + f.properties.date_start + '</div> </div>'
                    layer.bindPopup(popup)
                }
                function onEachFeature_place_announce(f, layer) {
                    var popup = '<div class="card mb-3"> <h3 class="card-header">' + f.properties.place + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + '</div> </div>'
                    layer.bindPopup(popup)
                }


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

                L.geoJson(place_announce,
                    {
                        pointToLayer: function (f, latlng) {
                            return L.marker(latlng, {
                                icon: case_place_announce,
                                highlight: "temporary"
                            });
                        },
                        onEachFeature: onEachFeature_place_announce
                    }).addTo(points_case)



                function onLocationFound(e) {


                    document.getElementById('loading').innerHTML = ''
                    document.getElementById('tracking').innerHTML = '<button class="btn btn-warning btn-xs" onclick="get_tracking()"> <i class="fa fa-thumb-tack  fa-lg" aria-hidden="true"></i> <br> กดบันทึก/ตรวจสอบ <br> การเดินทาง <br> </button>'


                    var radius = 5;
                    test_latlng = [e.latlng.lng, e.latlng.lat] // e.latlng

                    var point = turf.point(test_latlng);
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


                    var buffereds = L.geoJson(buffered, {
                        stroke: false,
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.1,
                    }).addTo(set_map)

                    map.fitBounds(buffereds.getBounds())




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
                        tb_announce += '<div class="card mb-3 "> <h3 class="card-header">' + f.properties.place + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + ' </div> </div> <hr>'
                    });
                    document.getElementById('tabel_announce').innerHTML = tb_announce


                    if (data.length != 0 || data_place_announce.length != 0) {
                        // document.getElementById('alert_warning').innerHTML = '<div class="alert  alert-danger alert_show"> <button type="button" class="close" data-dismiss="alert">x</button> <strong>คำเตือน !</strong> ขณะนี้ท่านอยู่ในพื้นที่ที่มีการรายงานข่าวเคสผู้ป่วยหรือพื้นที่ที่เสี่ยงการระบาด </div>'
                        document.getElementById('alert_text').innerHTML = '<p id="alert_text" class="alert_danger_text">ใกล้พื้นที่เสี่ยง</p>'
                    } else {
                        document.getElementById('alert_text').innerHTML = '<p id="alert_text" class="alert_success_text">ห่างพื้นที่เสี่ยง</p>'
                    }



                }

                map.on('locationfound', onLocationFound);
                map.locate();

            }
            )
    }
})



var map = L.map('map'
    , { attributionControl: false }
).setView([13.751569, 100.501634], 12);


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

points_case = L.layerGroup().addTo(map)
set_map = L.layerGroup().addTo(map)
line_track = L.layerGroup().addTo(map)

document.getElementById('loading').innerHTML = ' <div id="loading" class="loader"></div>'
document.getElementById('tracking').innerHTML = ''

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

var case_place_announce = L.icon({
    iconUrl: 'img/place.svg',
    iconSize: [50, 50], // size of the icon
});

function get_track() {
    document.getElementById('tracking').innerHTML = '<button class="btn btn-warning btn-xs" onclick="get_tracking()"> <i class="fa fa-thumb-tack  fa-lg" aria-hidden="true"></i> <br> กดบันทึก/ตรวจสอบ <br> การเดินทาง <br> </button>'
}

map.on('click', function () {
    document.getElementById('tracking').innerHTML = '<button class="btn btn-warning btn-xs" onclick="get_tracking()"> <i class="fa fa-thumb-tack  fa-lg" aria-hidden="true"></i> <br> กดบันทึก/ตรวจสอบ <br> การเดินทาง <br> </button>'
})


var local_icon = L.icon({
    iconUrl: 'https://mapedia-th.github.io/away-covid/img/icon.png',
    iconSize: [20, 20]
});

function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
            d > 200 ? '#E31A1C' :
                d > 100 ? '#FC4E2A' :
                    d > 50 ? '#FD8D3C' :
                        d > 20 ? '#FEB24C' :
                            d > 10 ? '#FED976' :
                                '#FFEDA0';
}

var legend = L.control({ position: 'bottomright' });

function showDisclaimer() {
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        div.innerHTML += '<button  class="btn btn-default btn-block"  onClick="hideDisclaimer()"><small class="prompt">Hide legend</small><i class="fa fa-angle-double-down" aria-hidden="true"></i></button><br> ';
        div.innerHTML += '<img src="img/confirm_case.png" width="30px"> <small class="prompt"> กำลังรักษา </small> <br> ';
        div.innerHTML += '<img src="img/success_case.png" width="30px"> <small class="prompt"> รักษาหายแล้ว </small> <br> ';
        div.innerHTML += '<img src="img/warning_case.png" width="30px"> <small class="prompt"> กักตัว 14 วัน </small> <br> ';
        div.innerHTML += '<img src="img/null_case.png" width="30px"> <small class="prompt"> ไม่ทราบสถานะ </small> <br> ';
        div.innerHTML += '<img src="img/clean.png" width="30px"> <small class="prompt"> ฆ่าเชื้อทำความสะอาดแล้ว </small> <br> ';
        div.innerHTML += '<img src="img/death.png" width="30px"> <small class="prompt"> เสียชีวิต </small> <br> ';
        div.innerHTML += '<img src="img/send.png" width="30px"> <small class="prompt"> ส่งตัวต่อเพื่อทำการรักษา </small> <br> ';
        div.innerHTML += '<img src="img/place.svg" width="30px"> <small class="prompt"> พื้นที่เสี่ยงเฝ้าระวัง </small> <br> ';
        return div;
    };
    legend.addTo(map);
}

function hideDisclaimer() {
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        div.innerHTML += '<button class="btn btn-default " onClick="showDisclaimer()"><small class="prompt">Show legend</small> <i class="fa fa-angle-double-up" aria-hidden="true"></i>   </button><br> ';
        return div;
    };
    legend.addTo(map);
}

hideDisclaimer()



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


function get_loca() {
    document.getElementById('loading').innerHTML = ' <div id="loading" class="loader"></div>'
    document.getElementById('tracking').innerHTML = ''
    set_map.clearLayers()
    line_track.clearLayers()
    map.locate();
}

function get_tracking() {
    set_map.clearLayers()
    var lat = test_latlng[1]
    var lng = test_latlng[0]

    $.ajax({
        url: 'https://rti2dss.com/mapedia.serv/add_tracking.php?type=tracking',
        method: 'post',
        data: ({
            pictureUrl: pictureUrl,
            userId: userId,
            displayName: displayName,
            decodedIDToken: decodedIDToken,
            lat: lat,
            lng: lng
        }),
        success: function (res) {
            var json_track = JSON.parse(res)

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

            map.fitBounds(view_line.getBounds())
            document.getElementById('tracking').innerHTML = '<button class="btn btn-warning btn-xs" onclick="get_loca()"> <i class="fa fa-compass  fa-lg" aria-hidden="true"></i><br> กลับหน้าแผนที่ <br> ดูตำแหน่งผู้ป่วย</button>'
        }, error: function (e) {
        }
    })

}


$("#form_setting").submit(function (event) {

    $("#setting").modal("hide");

    points_case.clearLayers()
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


    $.ajax({
        url: 'https://rti2dss.com/mapedia.serv/get_point.php?date=' + date,
        method: 'get',
        success: function (data) {
            case_point = JSON.parse(data).covidcase

            var option_dropdown = '<option value="">- - กรุณาเลือก - -</option>'
            for (var i = 0; i < case_point.features.length; i++) {
                option_dropdown += ' <option value="' + case_point.features[i].properties.place_name + '"> ' + case_point.features[i].properties.place_name + '</option>'
            }
            document.getElementById('select_place').innerHTML = option_dropdown


            function onEachFeature(f, layer) {
                var popup = '<div class="card mb-3"> <h3 class="card-header">' + f.properties.place_name + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">จำนวนผู้ป่วย : ' + f.properties.case_numbe + ' ราย</h5> <p class="card-title">สถานะ : ' + f.properties.status_pat + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.ref_source + ' </p> </div> <div class="card-body"></div> <div class="card-body"> <a href="' + f.properties.link_news + '" class="card-link" targer="_blank"> Link ข่าวอ้างอิง </a> </div> <div class="card-footer text-muted">วันที่ลงข่าว : ' + f.properties.date_start + '</div> </div>'
                layer.bindPopup(popup)
            }
            function onEachFeature_place_announce(f, layer) {
                var popup = '<div class="card mb-3"> <h3 class="card-header">' + f.properties.place + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + '</div> </div>'
                layer.bindPopup(popup)
            }


            var geojson_announce = L.geoJson(place_announce, {
                pointToLayer: function (f, latlng) {
                    return L.marker(latlng, {
                        icon: case_place_announce,
                        highlight: "temporary"
                    });
                },
                onEachFeature: onEachFeature_place_announce
            })

            var geojson_case = L.geoJson(case_point, {
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
                    }
                },
                onEachFeature: onEachFeature
            })

            if (toggle_1 == true) {
                geojson_case.addTo(points_case)
            }
            if (toggle_2 == true) {
                geojson_announce.addTo(points_case)
            }
            var point = turf.point(test_latlng);
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
                fillColor: '#f03',
                fillOpacity: 0.1,
            }).addTo(set_map)

            var ptsWithin = turf.pointsWithinPolygon(case_point, buffered);
            var ptsWithplace_announce = turf.pointsWithinPolygon(place_announce, buffered);

            map.fitBounds(buffereds.getBounds())

            var data = ptsWithin.features
            var data_place_announce = ptsWithplace_announce.features


            var table = ''
            for (var i = 0; i < data.length; i++) {
                var distance = turf.distance(point, data[i], { units: 'kilometers' });
                table += '  <tr> <td>   ' + data[i].properties.place_name + '<br> <small> ระยะห่าง : ' + distance.toFixed(1) + ' km </small> </td><td>   ' + data[i].properties.case_numbe + '    </td><td>  ' + data[i].properties.status_pat + '   </td></tr> '
            }
            document.getElementById('tabel_data').innerHTML = table

            var tb_announce = ''
            data_place_announce.forEach(function (f) {
                tb_announce += '<div class="card mb-3 "> <h3 class="card-header">' + f.properties.place + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + ' </div> </div> <hr>'
            });
            document.getElementById('tabel_announce').innerHTML = tb_announce


        }, error: function () {
            console.log('error  data!');
        }
    })



})




L.Control.watermark = L.Control.extend({
    onAdd: function (map) {
        var img = L.DomUtil.create('img');
        img.src = 'https://mapedia.co.th/assets/images/logo_1_1024.png';
        img.style.width = '30px';
        img.style.opacity = '0.5';
        return img;
    }
});
L.control.watermark = function (opts) {
    return new L.Control.watermark(opts);
}
L.control.watermark({ position: 'bottomleft' }).addTo(map);