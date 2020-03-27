// async function getUserProfile() {
//     profile = await liff.getProfile()
//     pictureUrl = profile.pictureUrl
//     userId = profile.userId
//     displayName = profile.displayName
//     decodedIDToken = liff.getDecodedIDToken().email
//     if (pictureUrl == undefined) {
//         pictureUrl = ''
//     }

//     $.ajax({
//         url: 'https://rti2dss.com/mapedia.serv/add_tracking.php?type=login',
//         method: 'post',
//         data: ({
//             pictureUrl: pictureUrl,
//             userId: userId,
//             displayName: displayName,
//             decodedIDToken: decodedIDToken,
//             page_view: 'route.html'
//         }),
//         success: function (data) {
//         }
//     })

// }
// async function main() {
// 	await liff.init({ liffId: "1653984157-0qam36em" })
//     liff.ready.then(() => {
//         if (liff.isLoggedIn()) {
//             getUserProfile()
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
var url = 'https://rti2dss.com:3200';

document.getElementById('loading').innerHTML = '  <div class="spinner-grow text-danger loading" role="status"><span class="sr-only"></span></div>'
document.getElementById('btn_search').innerHTML = '<button class="btn btn-warning" type="button" disabled> <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังรอรับค่าตำแหน่ง Location . . . . </button>'


function onLocationFound(e) {
    document.getElementById('loading').innerHTML = ''

    var radius = 50;
    latlng = [e.latlng.lng, e.latlng.lat]

    var point = turf.point(latlng);

    L.geoJson(point, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: local_icon,
                highlight: 'permanent'
            });
        }
    })
        .bindPopup("ตำแหน่งปัจจุบันของท่าน")
        .addTo(map)

    var buffered = turf.buffer(point, radius, { units: 'kilometers' });

    var buffereds = L.geoJson(buffered, {
        stroke: false,
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0.1,
    }).addTo(map)

    map.fitBounds(buffereds.getBounds())


    let covidlab = L.layerGroup().addTo(map);
    $.getJSON("https://rti2dss.com:3200/anticov-api/labcovid", function (res) {
        const items = res.data;

        const icon = 'https://github.com/mapedia-th/away-covid/blob/master/img/hospital.png?raw=true';
        const iconMarker = L.icon({
            iconUrl: icon,
            iconSize: [50, 50],
        });

        items.forEach(item => {
            let mk = L.marker([Number(item.lat), Number(item.long)], {
                icon: iconMarker
            }).bindPopup(
                '<br/><span >สถานที่: </span>' + item.name +
                '<br/><span >ลิ้งค์: </span><a href="https://www.google.com/maps/dir/' + latlng[1] + ',' + latlng[0] + '/' + Number(item.lat) + ',' + Number(item.long) + '/data=!3m1!4b1!4m2!4m1!3e0">เส้นทาง</a>'
            );

            mk.addTo(covidlab);

            $('#select_place').append($('<option>', {
                value: item.lat + ',' + item.long,
                text: item.name
            }));
        });

    })

    document.getElementById('btn_search').innerHTML = '<button type="button" class="btn btn-warning" data-toggle="modal" data-target="#search"> <i class="fa fa-search" aria-hidden="true"></i> ค้นหาสถานพยาบาลใกล้ตัว </button>'


}

map.on('locationfound', onLocationFound);
map.locate();


var local_icon = L.icon({
    iconUrl: 'https://mapedia-th.github.io/away-covid/img/icon.png',
    iconSize: [20, 20]
});






$('#select_place').change(e => {
    let latlng = e.target.value.split(",");
    map.setView([Number(latlng[0]), Number(latlng[1])], 19);
})
