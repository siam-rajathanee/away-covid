async function getUserProfile() {
    profile = await liff.getProfile()
    pictureUrl = profile.pictureUrl
    userId = profile.userId
    displayName = profile.displayName
    if (pictureUrl == undefined) {
        pictureUrl = ''
    }
    document.getElementById('displayname').innerHTML = '<h4 id="displayname">' + displayName + '</h4>'
    document.getElementById('img_profile').innerHTML = '<img id="img_profile" class="profile_img" src="' + pictureUrl + '" alt="">'
    $.ajax({
        url: 'https://mapedia.co.th/demo/add_tracking.php?type=login',
        method: 'post',
        data: ({
            pictureUrl: pictureUrl,
            userId: userId,
            displayName: displayName,
            page_view: 'index.html'
        }),
        success: function (data) { }
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
        liffId: "1653981898-q0jEx1on"
    })
}
main()



// userId = 'U813edb9e9e22c2dc43d39fcdab3d9ff9'
// displayName = 'MAPEDIA'
$(function () {
    $('.btn-group-fab').on('click', '.btn', function () {
        $('.btn-group-fab').toggleClass('active');
    });
    $('has-tooltip').tooltip();
});


$(async function () {
    $('[data-toggle="popover"]').popover()
})


var map = L.map('map', {
    attributionControl: false
}).setView([13.751569, 100.501634], 9);



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
    CartoDB_Positron.addTo(map)
} else {
    CartoDB_DarkMatter.addTo(map)
}


points_case = L.layerGroup().addTo(map)
//markerClusterGroup = L.markerClusterGroup().addTo(map)
markerClusterGroup = L.layerGroup().addTo(map)
point_ann = L.layerGroup().addTo(map)
set_map = L.layerGroup().addTo(map)
line_track = L.layerGroup().addTo(map)
checkpoint = L.layerGroup().addTo(map)



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
    iconSize: [20, 20], // size of the icon
});


function onEachFeature_place_announce(f, layer) {
    var popup = '<div class="card mb-3"> <h3 class="card-header">' + f.properties.place + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <h5 class="card-title">เหลืออีก ' + f.properties.daysDiff + ' วัน จะพ้นระยะเฝ้าระวัง </h5><p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + '</div> </div>'
    //  var popup = '<div class="card mb-3"> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <h5 class="card-title">เหลืออีก ' + f.properties.daysDiff + ' วัน จะพ้นระยะเฝ้าระวัง </h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + '</div> </div>'
    layer.bindPopup(popup)
}

function onEachFeature(f, layer) {
    var popup = '<div class="card mb-3"> <h3 class="card-header">' + f.properties.place_name + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">จำนวนผู้ป่วย : ' + f.properties.case_number + ' ราย</h5> <p class="card-title">สถานะ : ' + f.properties.status_pat + ' </p> <p class="card-title">รายละเอียด : ' + f.properties.description + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.ref_sources + ' </p> </div> <div class="card-body"></div> <div class="card-body"> <a href="' + f.properties.link_news + '" class="card-link" targer="_blank"> Link ข่าวอ้างอิง </a> </div> <div class="card-footer text-muted">วันที่ลงข่าว : ' + f.properties.date_start + '</div> </div>'
    layer.bindPopup(popup)
}

// function get_track() {
//     document.getElementById('tracking').innerHTML = '<button id="tracking" class="btn btn-tracking  btn-xs" onclick="get_tracking()"> <i class="fa fa-thumb-tack  fa-lg" aria-hidden="true"></i> <br> ปักหมุด <br>ตำแหน่ง<br>ปัจจุบัน </button>'
// }
// map.on('click', function () {
//     document.getElementById('tracking').innerHTML = '<button id="tracking" class="btn btn-tracking  btn-xs" onclick="get_tracking()"> <i class="fa fa-thumb-tack  fa-lg" aria-hidden="true"></i> <br> ปักหมุด <br>ตำแหน่ง<br>ปัจจุบัน </button>'
// })

var legend = L.control({
    position: 'bottomright'
});







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
var list_lock_pro = ['สมุทรสาคร', 'สมุทรสงคราม'];
//var list_curfew_pro = ['แม่ฮ่องสอน', 'กรุงเทพมหานคร', 'นนทบุรี'];

lockdown = []
for (let i = 0; i < list_lock_pro.length; i++) {
    lockdown.push(province_geojson.features.find(e => e.properties.pv_tn == list_lock_pro[i]))
    L.geoJson(province_geojson.features.find(e => e.properties.pv_tn == list_lock_pro[i]), {
        style: style_lock
    }).addTo(map)
}

hideDisclaimer()
get_point()


// curfew = []
// for (let i = 0; i < list_curfew_pro.length; i++) {
//     curfew.push(province_geojson.features.find(e => e.properties.pv_tn == list_curfew_pro[i]))
//     L.geoJson(province_geojson.features.find(e => e.properties.pv_tn == list_curfew_pro[i]), {
//         style: style_curfew
//     }).addTo(map)
// }
var marker;

map.on('locationfound', function (e) {

    document.getElementById('loading').innerHTML = ''
    document.getElementById('tracking').innerHTML = '<button id="tracking" class="btn btn-tracking btn-xs" onclick="get_tracking()"> <i class="fa fa-thumb-tack  fa-lg" aria-hidden="true"></i> <br> ปักหมุด <br>ตำแหน่ง<br>ปัจจุบัน </button>'
    document.getElementById('routing').innerHTML = '<button type="button" class="btn btn-routing btn-xs" onclick="viewRouting()"> <i class="fa fa-map-signs" aria-hidden="true"></i> <br> ตรวจสอบ <br> เส้นทาง </button>'

    var radius = 5;
    get_latlng = [e.latlng.lng, e.latlng.lat] // e.latlng16.7289774,100.1912686
    //  get_latlng = [100.266778, 16.842412]

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
    // document.getElementById('lock_down').innerHTML = '<p id="lock_down" class=" alert_curfew_text" data-toggle="popover" title=" คำแนะนำ" data-content="ท่านอยู่ในพื้นที่ Curfew ห้ามประชาชนออกนอกเคหสถานระหว่างเวลา 22.00 น. ถึงเวลา 04.00 น."  data-placement="bottom" ><i class="fa fa-bolt" aria-hidden="true"></i> Curfew</p>'

    for (let i = 0; i < lockdown.length; i++) {
        var pointlock = turf.pointsWithinPolygon(point, lockdown[i]);
        if (pointlock.features.length == 1) {
            //document.getElementById('lock_down').innerHTML = '<p id="lock_down" class=" alert_lockdown_text"   data-toggle="popover" title=" คำแนะนำ" data-content="ท่านอยู่ในพื้นที่ Lockdown ห้ามประชาชนเดินทางเข้า-ออกข้ามเขตพื้นที่เพื่อป้องกันและสกัดโรคโควิด-19 ห้ามประชาชนออกนอกเคหสถานระหว่างเวลา 22.00 น. ถึงเวลา 04.00 น."  data-placement="bottom" ><i class="fa fa-lock"></i> Lockdown</p>'
        }
    }
    // for (let i = 0; i < curfew.length; i++) {
    //     var pointlock = turf.pointsWithinPolygon(point, curfew[i]);
    //     if (pointlock.features.length == 1) {
    //         document.getElementById('lock_down').innerHTML = '<p id="lock_down" class=" alert_curfew_text" data-toggle="popover" title=" คำแนะนำ" data-content="ท่านอยู่ในพื้นที่ Curfew ห้ามประชาชนออกนอกเคหสถานระหว่างเวลา 23.00 น. ถึงเวลา 05.00 น."  data-placement="bottom" ><i class="fa fa-bolt" aria-hidden="true"></i> Curfew</p>'
    //     }
    // }




    var buffered = turf.buffer(point, radius, {
        units: 'kilometers'
    });
    var buffereds = L.geoJson(buffered)
    map.fitBounds(buffereds.getBounds())

    var ptsWithin = turf.pointsWithinPolygon(case_point, buffered);
    var ptsWithplace_announce = turf.pointsWithinPolygon(place_announce, buffered);
    console.log(ptsWithplace_announce);
    console.log(ptsWithin);

    var data = ptsWithin.features
    var table = ''
    for (var i = 0; i < data.length; i++) {
        var distance = turf.distance(point, data[i], {
            units: 'kilometers'
        });
        table += '  <tr> <td>   ' + data[i].properties.place_name + '<br> <small> ระยะห่าง : ' + distance.toFixed(1) + ' km </small> </td><td>   ' + data[i].properties.case_numbe + '    </td><td>  ' + data[i].properties.status_pat + '   </td></tr> '
    }
    document.getElementById('tabel_data').innerHTML = table

    var data_place_announce = ptsWithplace_announce.features
    var tb_announce = ''
    data_place_announce.forEach(function (f) {
        tb_announce += '<div class="card mb-3 "> <h3 class="card-header">' + f.properties.place + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + ' </div> </div> <hr>'
        //  tb_announce += '<div class="card mb-3 "> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + ' </div> </div> <hr>'
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
})






async function get_point() {

    var data_drive_sheet1, data_drive_sheet2, data_drive_sheet3
    var data_drive_1 = [], data_drive_2 = [], data_drive_3 = []


    await $.ajax({
        type: "GET",
        url: "https://spreadsheets.google.com/feeds/list/15GEtbPIRtWHPdUyrI9iy78MJp3r68Tn2V7x3PYpTzZk/1/public/values?alt=json",
        dataType: "json",
        success: function (data) {
            data.feed.entry.forEach(e => {
                var point = turf.point([Number(e.gsx$lon.$t), Number(e.gsx$lat.$t)]);
                point.properties = {
                    gid: e.gsx$gid.$t,
                    place_name: e.gsx$placename.$t,
                    lat: e.gsx$lat.$t,
                    lon: e.gsx$lon.$t,
                    case_number: e.gsx$casenumber.$t,
                    date_start: e.gsx$datestart.$t,
                    status_news: e.gsx$statusnews.$t,
                    status_pat: e.gsx$statuspatient.$t,
                    description: e.gsx$description.$t,
                    ref_sources: e.gsx$refsources.$t,
                    link_news: e.gsx$linknews.$t,
                    tb_code: e.gsx$tbcode.$t,
                    tb_th: e.gsx$tbth.$t,
                    ap_th: e.gsx$apth.$t,
                    pro_th: e.gsx$proth.$t,
                    postcode: e.gsx$postcode.$t,
                    age: e.gsx$age.$t,
                    gender: e.gsx$gender.$t
                }
                data_drive_1.push(point)
            });
            data_drive_sheet1 = data_drive_1
        }
    });

    var date = new Date();
    date.setDate(date.getDate() - 14);
    finalDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()

    var json_query = []
    for (let i = 0; i < data_drive_sheet1.length; i++) {
        if (Date.parse(data_drive_sheet1[i].properties.date_start) >= Date.parse(finalDate)) {
            json_query.push(data_drive_sheet1[i])
        }
    }
    var nietos = [];
    var obj = {};
    obj["type"] = "FeatureCollection";
    obj["features"] = json_query
    nietos.push(obj)
    case_point = nietos[0]


    await $.ajax({
        type: "GET",
        url: "https://spreadsheets.google.com/feeds/list/15GEtbPIRtWHPdUyrI9iy78MJp3r68Tn2V7x3PYpTzZk/2/public/values?alt=json",
        dataType: "json",
        success: function (data) {
            data.feed.entry.forEach(e => {
                var point = turf.point([Number(e.gsx$lon.$t), Number(e.gsx$lat.$t)]);
                point.properties = {
                    id: e.gsx$id.$t,
                    place: e.gsx$place.$t,
                    pro_th: e.gsx$proth.$t,
                    type: e.gsx$type.$t,
                    lat: e.gsx$lat.$t,
                    lon: e.gsx$lon.$t,
                    date_risk: e.gsx$daterisk.$t,
                    time_risk: e.gsx$timerisk.$t,
                    todo: e.gsx$todo.$t,
                    announce: e.gsx$announce.$t,
                    annou_date: e.gsx$annoudate.$t,
                    tb_th: e.gsx$tbth.$t,
                    ap_th: e.gsx$apth.$t,
                    pro_th: e.gsx$proth.$t,
                    postcode: e.gsx$postcode.$t
                }
                data_drive_2.push(point)
            });
            data_drive_sheet2 = data_drive_2
        }
    });

    await $.ajax({
        type: "GET",
        url: "https://spreadsheets.google.com/feeds/list/15GEtbPIRtWHPdUyrI9iy78MJp3r68Tn2V7x3PYpTzZk/3/public/values?alt=json",
        dataType: "json",
        success: function (data) {
            data.feed.entry.forEach(e => {
                data_drive_3.push({
                    province: e.gsx$province.$t,
                    type_rick: e.gsx$typerick.$t,
                })
            });
            data_drive_sheet3 = data_drive_3
        }
    });

    var nietos2 = [];
    var obj2 = {};
    obj2["type"] = "FeatureCollection";
    obj2["features"] = data_drive_sheet2
    nietos2.push(obj2)
    geojson_ann = nietos2[0]



    for (let i = 0; i < data_drive_sheet3.length; i++) {
        if (data_drive_sheet3[i].type_rick == 'สีเขียว') {
            L.geoJson(province_geojson.features.find(e => e.properties.pv_tn == data_drive_sheet3[i].province), {
                fillColor: '#1aff1a',
                weight: 3,
                opacity: 0.1,
                color: '#ffffff',
                dashArray: '3',
                fillOpacity: 0.1
            }).addTo(map)
        } else if (data_drive_sheet3[i].type_rick == 'สีเหลือง') {
            L.geoJson(province_geojson.features.find(e => e.properties.pv_tn == data_drive_sheet3[i].province), {
                fillColor: '#ffff66',
                weight: 3,
                opacity: 0.1,
                color: '#ffffff',
                dashArray: '3',
                fillOpacity: 0.1
            }).addTo(map)
        } else if (data_drive_sheet3[i].type_rick == 'สีส้ม') {
            L.geoJson(province_geojson.features.find(e => e.properties.pv_tn == data_drive_sheet3[i].province), {
                fillColor: '#ff944d',
                weight: 3,
                opacity: 0.1,
                color: '#ffffff',
                dashArray: '3',
                fillOpacity: 0.1
            }).addTo(map)
        } else if (data_drive_sheet3[i].type_rick == 'สีแดง') {
            L.geoJson(province_geojson.features.find(e => e.properties.pv_tn == data_drive_sheet3[i].province), {
                fillColor: '#990000',
                weight: 3,
                opacity: 0.1,
                color: '#ffffff',
                dashArray: '3',
                fillOpacity: 0.2
            }).addTo(map)
        }

    }

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


    // ck_point_phs = L.geoJson(geojson_checkpoint, {
    //     pointToLayer: function (f, latlng) {
    //         return L.marker(latlng, {
    //             icon: warning_covid,
    //         }).bindPopup('<b>' + f.properties.check_name + ' </b><br>' + f.properties.description)
    //     },
    // })


    // ck_point = L.geoJson(checkpoint_th, {
    //     pointToLayer: function (f, latlng) {
    //         return L.marker(latlng, {
    //             icon: warning_covid,
    //         }).bindPopup('<p>' + f.properties.name + ' </p>')
    //     },
    // })

    // map.on('zoomend', function (e) {
    //     zoom = e.target._zoom
    //     if (zoom <= 9) {
    //         checkpoint.clearLayers()
    //     } else {
    //         ck_point_phs.addTo(checkpoint)
    //         ck_point.addTo(checkpoint)
    //     }
    // });
}








async function get_loca() {

    document.getElementById('routing_readme').innerHTML = ''
    document.getElementById('loading').innerHTML = ' <div id="loading" class="loader"></div>'
    document.getElementById('routing_list').innerHTML = ''
    // document.getElementById("form_setting").submit();
    markerClusterGroup.clearLayers()
    points_case.clearLayers()
    point_ann.clearLayers()
    line_track.clearLayers()
    map.off('click');


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

    document.getElementById('loading').innerHTML = ''
    document.getElementById('tracking').innerHTML = '<button id="tracking" class="btn btn-tracking btn-xs" onclick="get_tracking()"> <i class="fa fa-thumb-tack  fa-lg" aria-hidden="true"></i> <br> ปักหมุด <br>ตำแหน่ง<br>ปัจจุบัน </button>'
    document.getElementById('routing').innerHTML = '<button type="button" class="btn btn-routing btn-xs" onclick="viewRouting()"> <i class="fa fa-map-signs" aria-hidden="true"></i> <br> ตรวจสอบ <br> เส้นทาง </button>'

    var radius = 5;


    var point = turf.point(get_latlng);
    L.geoJson(point, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: local_icon,
            });
        }
    })
        .bindPopup("ตำแหน่งปัจจุบันของท่าน")
    //document.getElementById('lock_down').innerHTML = '<p id="lock_down" class=" alert_curfew_text" data-toggle="popover" title=" คำแนะนำ" data-content="ท่านอยู่ในพื้นที่ Curfew ห้ามประชาชนออกนอกเคหสถานระหว่างเวลา 22.00 น. ถึงเวลา 04.00 น."  data-placement="bottom" ><i class="fa fa-bolt" aria-hidden="true"></i> Curfew</p>'

    for (let i = 0; i < lockdown.length; i++) {
        var pointlock = turf.pointsWithinPolygon(point, lockdown[i]);
        if (pointlock.features.length == 1) {
            //document.getElementById('lock_down').innerHTML = '<p id="lock_down" class=" alert_lockdown_text"   data-toggle="popover" title=" คำแนะนำ" data-content="ท่านอยู่ในพื้นที่ Lockdown ห้ามประชาชนเดินทางเข้า-ออกข้ามเขตพื้นที่เพื่อป้องกันและสกัดโรคโควิด-19 ห้ามประชาชนออกนอกเคหสถานระหว่างเวลา 22.00 น. ถึงเวลา 04.00 น."  data-placement="bottom" ><i class="fa fa-lock"></i> Lockdown</p>'
        }
    }

    var buffered = turf.buffer(point, radius, {
        units: 'kilometers'
    });


    var ptsWithin = turf.pointsWithinPolygon(case_point, buffered);
    var ptsWithplace_announce = turf.pointsWithinPolygon(place_announce, buffered);

    var data = ptsWithin.features
    var table = ''
    for (var i = 0; i < data.length; i++) {
        var distance = turf.distance(point, data[i], {
            units: 'kilometers'
        });
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












$("#form_setting").submit(async function (event) {
    map.off('click');
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
        osm.remove()
        ghyb.remove()
        CartoDB_DarkMatter.remove()
    } else if (basemap == 'base2') {
        CartoDB_Positron.remove()
        osm.addTo(map)
        ghyb.remove()
        CartoDB_DarkMatter.remove()
    } else if (basemap == 'base3') {
        CartoDB_Positron.remove()
        osm.remove()
        ghyb.addTo(map)
        CartoDB_DarkMatter.remove()
    } else {
        CartoDB_Positron.remove()
        osm.remove()
        ghyb.remove()
        CartoDB_DarkMatter.addTo(map)
    }

    var date = new Date();
    date.setDate(date.getDate() - event.target.date.value);
    finalDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()







    var data_drive_sheet1, data_drive_sheet2
    var data_drive_1 = [], data_drive_2 = []
    await $.ajax({
        type: "GET",
        url: "https://spreadsheets.google.com/feeds/list/15GEtbPIRtWHPdUyrI9iy78MJp3r68Tn2V7x3PYpTzZk/1/public/values?alt=json",
        dataType: "json",
        success: function (data) {
            data.feed.entry.forEach(e => {
                var point = turf.point([Number(e.gsx$lon.$t), Number(e.gsx$lat.$t)]);
                point.properties = {
                    gid: e.gsx$gid.$t,
                    place_name: e.gsx$placename.$t,
                    lat: e.gsx$lat.$t,
                    lon: e.gsx$lon.$t,
                    case_number: e.gsx$casenumber.$t,
                    date_start: e.gsx$datestart.$t,
                    status_news: e.gsx$statusnews.$t,
                    status_pat: e.gsx$statuspatient.$t,
                    description: e.gsx$description.$t,
                    ref_sources: e.gsx$refsources.$t,
                    link_news: e.gsx$linknews.$t,
                    tb_code: e.gsx$tbcode.$t,
                    tb_th: e.gsx$tbth.$t,
                    ap_th: e.gsx$apth.$t,
                    pro_th: e.gsx$proth.$t,
                    postcode: e.gsx$postcode.$t,
                    age: e.gsx$age.$t,
                    gender: e.gsx$gender.$t
                }
                data_drive_1.push(point)
            });
            data_drive_sheet1 = data_drive_1
        }
    });


    var json_query = []
    for (let i = 0; i < data_drive_sheet1.length; i++) {
        if (Date.parse(data_drive_sheet1[i].properties.date_start) >= Date.parse(finalDate)) {
            json_query.push(data_drive_sheet1[i])
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

    // L.geoJson(geojson_checkpoint, {
    //     pointToLayer: function (f, latlng) {
    //         return L.marker(latlng, {
    //             icon: warning_covid,
    //         }).bindPopup('<b>' + f.properties.check_name + ' </b><br>' + f.properties.description)
    //     },
    // }).addTo(points_case)

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

    var buffered = turf.buffer(point, radius, {
        units: 'kilometers'
    });
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
        var distance = turf.distance(point, data[i], {
            units: 'kilometers'
        });
        table += '  <tr> <td>   ' + data[i].properties.place_name + '<br> <small> ระยะห่าง : ' + distance.toFixed(1) + ' km </small> </td><td>   ' + data[i].properties.case_numbe + '    </td><td>  ' + data[i].properties.status_pat + '   </td></tr> '
    }
    document.getElementById('tabel_data').innerHTML = table

    var tb_announce = ''
    data_place_announce.forEach(function (f) {
        tb_announce += '<div class="card mb-3 "> <h3 class="card-header">' + f.properties.place + '</h3> <div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + ' </div> </div> <hr>'
        //  tb_announce += '<div class="card mb-3 "><div class="card-body"> <h6 class="card-subtitle text-muted">พื้นที่ ต.' + f.properties.tb_th + ' อ.' + f.properties.ap_th + ' จ.' + f.properties.pro_th + '</h6> <h5 class="card-title">วันที่พบการติดเชื้อ : ' + f.properties.date_risk + ' <br> เวลา :' + f.properties.time_risk + '</h5> <p class="card-title">คำแนะนำ : ' + f.properties.todo + ' </p> <p class="card-title">แหล่งข่าว : ' + f.properties.announce + ' </p> </div> <div class="card-body"></div> <div class="card-body"> </div> <div class="card-footer text-muted">วันที่ประกาศ : ' + f.properties.annou_date + ' </div> </div> <hr>'
    });
    document.getElementById('tabel_announce').innerHTML = tb_announce

})










function get_tracking() {
    document.getElementById('routing').innerHTML = ''

    var json_buf = []
    json_place_ann.forEach(e => {
        buffered = turf.buffer(e, 1, {
            units: 'kilometers'
        });
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
            var p_t_l = [
                [
                    Number(json_track.features[0].properties.lng),
                    Number(json_track.features[0].properties.lat)
                ],
                [
                    Number(json_track.features[0].properties.lng),
                    Number(json_track.features[0].properties.lat)
                ]
            ]

            for (var i = 0; i < json_track.features.length; i++) {
                p_t_l.push(
                    [
                        Number(json_track.features[i].properties.lng),
                        Number(json_track.features[i].properties.lat)
                    ]
                )
                trac_table += ' <tr> <td>  ' + parseInt(json_track.features[i].properties.lng).toFixed(2) + ' , ' +
                    parseInt(json_track.features[i].properties.lat).toFixed(2) + '  </td>  <td> ' +
                    json_track.features[i].properties.date_view + ' </td></tr > '
            }

            var line = turf.lineString(p_t_l);
            view_line = L.geoJson(line).addTo(line_track)


            document.getElementById('tracking').innerHTML = '<button id="tracking"  class="btn btn-warning btn-xs"  onclick="get_loca()"> <i class="fa fa-compass  fa-lg" aria-hidden="true"></i><br> ปิด <br>การบันทึก <br> ตำแหน่ง</button>'

        },
        error: function (e) { }
    })

}







function viewRouting() {

    document.getElementById('routing_readme').innerHTML = '<div id="routing_readme" class="alert alert-dismissible alert-success"> <button type="button" class=" btn btn-link" data-dismiss="alert">X</button> <strong>ตรวจสอบเส้นทาง!</strong> <br> กดจุดหมายปลายทางลงบนแผนที่ เพื่อค้นหาเส้นทาง </div>'
    document.getElementById('tracking').innerHTML = ''

    document.getElementById('routing').innerHTML = '<button  type="button" class="btn btn-warning btn-xs" onclick="get_loca()"> <i class="fa fa-times-circle" aria-hidden="true"></i> <br> ปิด <br>การแสดง <br>เส้นทาง </button>'

    markerClusterGroup.clearLayers()
    points_case.clearLayers()
    point_ann.clearLayers()



    map.setView([13.817504, 100.715385], 6)
    map.on('click', function (e) {
        document.getElementById('loading').innerHTML = ' <div id="loading" class="loader"></div>'
        points_case.clearLayers()



        var waypoints = [
            L.latLng(get_latlng[1], get_latlng[0]),
            L.latLng(e.latlng.lat, e.latlng.lng)
        ]

        $.getJSON("https://idc.mapedia.co.th:3000/api/route/" + waypoints[0].lat + "/" + waypoints[0].lng + "/" + waypoints[1].lat + "/" + waypoints[1].lng + "", function (data) {
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
            var buffered = turf.buffer(linestring1, 10, {
                units: 'kilometers'
            });

            var line_view = L.geoJson(linestring1).addTo(points_case)
            map.fitBounds(line_view.getBounds())

            document.getElementById('routing_list').innerHTML = '<div class="alert alert-dismissible alert-primary" id="routing_list2"> <table class="table table-hover"> <thead> <tr> <th scope="col">รายละเอียด</th> <th scope="col">จำนวนเคส</th> <th scope="col">สถานะ</th> <th scope="col">จังหวัด</th> </tr> </thead> <tbody id="case_list_table"> </tbody> </table> </div>'

            var case_list_table = ''
            case_point.features.forEach(e => {
                var ptsWithin = turf.pointsWithinPolygon(e, buffered);
                if (ptsWithin.features.length > 0) {
                    var list_within = ptsWithin.features[0]

                    case_list_table += ' <tr><th>' + list_within.properties.place_name + '</th><td>' + list_within.properties.case_numbe + '</td><td>' + list_within.properties.status_pat + '</td><td>' + list_within.properties.pro_th + '</td></tr>'

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


            document.getElementById('case_list_table').innerHTML = case_list_table

        })


    });



}









L.Control.watermark = L.Control.extend({
    onAdd: function (map) {
        var img = L.DomUtil.create('img');
        img.src = 'https://mapedia.co.th/assets/images/logo_1_1024.png';
        img.style.width = '80px';
        img.style.opacity = '0.8';
        return img;
    }
});
L.control.watermark = function (opts) {
    return new L.Control.watermark(opts);
}
L.control.watermark({
    position: 'bottomleft'
}).addTo(map);

