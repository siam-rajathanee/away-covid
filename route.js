// async function main() {
//     await liff.init({ liffId: "1653984157-0qam36em" })
//     liff.ready.then(() => {
//         if (liff.isLoggedIn()) {
//         } else {
//             liff.login()
//         }
//     })

// }
// main()


var map = L.map('map', {
    center: [13.742701, 100.673909],
    zoom: 13
});
var Stamen = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map)

var urlParams = new URLSearchParams(window.location.search);
var marker, gps, dataurl, tam, amp, pro, x, y;

document.getElementById('loading').innerHTML = '  <div class="spinner-grow text-danger loading" role="status"><span class="sr-only"></span></div>'
document.getElementById('btn_search').innerHTML = '<button class="btn btn-warning  btn-lg  btn-block" type="button" disabled> <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังรอรับค่าตำแหน่ง Location . . . . </button>'


markerClusterGroup = L.markerClusterGroup().addTo(map)
covidlab = L.layerGroup().addTo(map);


var case_hospital = L.icon({
    iconUrl: 'img/hospital.png',
    iconSize: [50, 50], // size of the icon
});
var case_hospital_1 = L.icon({
    iconUrl: 'img/hospital_1.png',
    iconSize: [30, 30], // size of the icon
});


async function onLocationFound(e) {
    document.getElementById('loading').innerHTML = ''

    var radius = 100;
    get_latlng = [e.latlng.lng, e.latlng.lat]

    var point = turf.point(get_latlng);

    L.geoJson(point, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: local_icon,
                highlight: 'permanent'
            });
        }
    }).bindPopup("ตำแหน่งปัจจุบันของท่าน")
        .addTo(map)

    var buffered = turf.buffer(point, radius, { units: 'kilometers' });
    var buffereds = L.geoJson(buffered, {
        stroke: false,
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0.1,
    }).addTo(map)
    map.fitBounds(buffereds.getBounds())

    L.geoJson(hospital, {
        pointToLayer: function (f, latlng) {
            var distance = turf.distance(point, f, { units: 'kilometers' });
            f.properties.dis = Number(distance.toFixed(0))
            return L.marker(latlng, {
                icon: case_hospital_1,
            }).bindPopup('<div class="card mb-3"> <h5 class="card-header">' + f.properties.name_th + '</h5> <h5 class="card-header">' + f.properties.street + '</h5> <div class="card-footer text-muted text-right"> <div class="row"> <div class="col-xs-6  text-left"> ระยะห่าง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right" > <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.lon) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">เส้นทาง</a> </div> </div> </div>')
        },
    }).addTo(markerClusterGroup)
    var show_hos = ''
    var data_set_hos = []
    hospital.features.forEach(f => {
        var distance = turf.distance(point, f, { units: 'kilometers' });
        f.properties.dis = Number(distance.toFixed(0))
        data_set_hos.push(f.properties)
    });
    data_set_hos.sort((a, b) => (a.dis > b.dis) ? 1 : -1)
    for (let i = 0; i < 50; i++) {
        show_hos += '<div class="card mb-3"> <h5 class="card-header">' + data_set_hos[i].name_th + '</h5> <h5 class="card-header">' + data_set_hos[i].street + '</h5> <div class="card-footer text-muted text-right"> <div class="row"> <div class="col-xs-6  text-left"> ระยะห่าง ' + data_set_hos[i].dis + ' km </div> <div class="col-xs-6  text-right" onClick="select_place(' + data_set_hos[i].lat + ',' + data_set_hos[i].lon + ' )"> <i class="fa fa-search"></i> ตำแหน่ง</div> </div> </div> </div><hr>'
    }
    document.getElementById('show_hos').innerHTML = show_hos




    L.geoJson(labcovid, {
        pointToLayer: function (f, latlng) {
            var distance = turf.distance(point, f, { units: 'kilometers' });
            f.properties.dis = Number(distance.toFixed(0))
            return L.marker(latlng, {
                icon: case_hospital,
            }).bindPopup('<div class="card mb-3"> <h5 class="card-header">' + f.properties.name + '</h5> <div class="card-body"> <div class="row"> <div class="col-xs-4  text-center"> <img style="border-radius: 10px;" src="' + f.properties.webimage + '" alt="" width="100%"> </div> <div class="col-xs-8"> <h6 class="card-subtitle text-muted">จังหวัด : ' + f.properties.prov + '</h6> <h6 class="card-subtitle text-muted">ที่อยู่ : ' + f.properties.add + '</h6> </div> </div> </div> <div class="card-footer text-muted text-right"> <div class="row"> <div class="col-xs-6  text-left"> ระยะห่าง ' + f.properties.dis + ' km </div> <div class="col-xs-6  text-right"> <a href="https://www.google.com/maps/dir/' + get_latlng[1] + ',' + get_latlng[0] + '/' + Number(f.properties.lat) + ',' + Number(f.properties.long) + '/data=!3m1!4b1!4m2!4m1!3e0" target="_blank">เส้นทาง</a></div> </div> </div> </div>')
        }
    }).addTo(covidlab)
    var show_lab = ''
    var data_set_labcovid = []
    labcovid.features.forEach(f => {
        var distance = turf.distance(point, f, { units: 'kilometers' });
        f.properties.dis = Number(distance.toFixed(0))
        data_set_labcovid.push(f.properties)
    });
    data_set_labcovid.sort((a, b) => (a.dis > b.dis) ? 1 : -1)
    data_set_labcovid.forEach(f => {
        show_lab += '<div class="card mb-3"> <h5 class="card-header">' + f.name + '</h5> <div class="card-body"> <div class="row"> <div class="col-xs-4  text-center"> <img style="border-radius: 10px;" src="' + f.webimage + '" alt="" width="100%"> </div> <div class="col-xs-8"> <h6 class="card-subtitle text-muted">จังหวัด : ' + f.prov + '</h6> <h6 class="card-subtitle text-muted">ที่อยู่ : ' + f.add + '</h6> </div> </div> </div> <div class="card-footer text-muted text-right"> <div class="row"> <div class="col-xs-6  text-left"> ระยะห่าง ' + f.dis + ' km </div> <div class="col-xs-6  text-right"  onClick="select_place(' + f.lat + ',' + f.long + ' )"> <i class="fa fa-search"></i> ตำแหน่ง</div> </div> </div> </div> <hr>'
    })
    document.getElementById('show_lab').innerHTML = show_lab






    document.getElementById('btn_search').innerHTML = '<button type="button" class="btn btn-warning btn-lg btn-block" data-toggle="modal" data-target="#search"> <i class="fa fa-search" aria-hidden="true"></i> ค้นหาสถานพยาบาล </button>'

}

map.on('locationfound', onLocationFound);
map.locate();


var local_icon = L.icon({
    iconUrl: 'https://mapedia-th.github.io/away-covid/img/icon.png',
    iconSize: [20, 20]
});


function select_place(lat, lng) {
    $("#search").modal("hide");
    map.setView([lat, lng], 19);
}


