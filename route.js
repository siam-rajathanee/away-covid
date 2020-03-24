$(document).ready(async function () {
    await liff.init({ liffId: "1653984157-0qam36em" })
    loadMap();
});

var map = L.map('map', {
    center: [16.820378, 100.265787],
    zoom: 13
});

var urlParams = new URLSearchParams(window.location.search);
var marker, gps, dataurl, tam, amp, pro, x, y;
var url = 'https://rti2dss.com:3200';
// var url = 'http://localhost:3100';

function loadMap() {
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var Stamen = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
    });
    const grod = L.tileLayer('https://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const ghyb = L.tileLayer('https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    var pro = L.tileLayer.wms("http://rti2dss.com:8080/geoserver/th/wms?", {
        layers: 'th:province_4326',
        format: 'image/png',
        transparent: true
    });
    var baseMap = {
        "OSM": osm,
        "แผนที่ขาวดำ": Stamen.addTo(map),
        "แผนที่ถนน": grod,
        "แผนที่ภาพถ่าย": ghyb
    }
    var overlayMap = {
        // "ขอบจังหวัด": pro.addTo(map)
    }
    // L.control.layers(baseMap, overlayMap).addTo(map);
}

var place;
function onLocationFound(e) {
    // console.log(e)
    x = e.latlng.lat;
    y = e.latlng.lng;
    gps = L.marker(e.latlng, { draggable: true });
    // gps.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();
    // gps.on('dragend', (e) => {
    //     console.log(e)
    // })
}

function onLocationError(e) {
    console.log(e.message);
}

function refreshPage() {
    location.reload(true);
}

map.on('locationfound', onLocationFound);
// map.on('locationerror', onLocationError);
// map.locate({ setView: true, maxZoom: 18 });

var lc = L.control.locate({
    position: 'topleft',
    strings: {
        title: "Show me where I am, yo!"
    },
    locateOptions: {
        enableHighAccuracy: true,
    }
}).addTo(map);

lc.start();

// copy from nui
let covidlab = L.layerGroup().addTo(map);
$.get(url + '/anticov-api/labcovid').done((res) => {
    const items = res.data;

    const icon = 'https://github.com/mapedia-th/away-covid/blob/master/img/hospital.png?raw=true';
    const iconMarker = L.icon({
        iconUrl: icon,
        iconSize: [50, 50],
        // iconAnchor: [12, 37],
        // popupAnchor: [5, -36]
    });


    $.each(items, function (i, item) {
        // console.log(gps._latlng)
        let mk = L.marker([Number(item.lat), Number(item.long)], {
            icon: iconMarker
        }).bindPopup(
            '<br/><span >สถานที่: </span>' + item.name +
            '<br/><span >ลิ้งค์: </span><a href="https://www.google.com/maps/dir/' + gps._latlng.lat + ',' + gps._latlng.lng + '/' + Number(item.lat) + ',' + Number(item.long) + '/data=!3m1!4b1!4m2!4m1!3e0">เส้นทาง</a>'
        );

        mk.addTo(covidlab);

        $('#select_place').append($('<option>', {
            value: item.lat + ',' + item.long,
            text: item.name
        }));
    });

})

// $('#getroute').click(e => {
//     console.log(e)
// })

$('#select_place').change(e => {
    let latlng = e.target.value.split(",");
    // $("#getroute").attr("href", 'https://www.google.com/maps/dir/' + gps._latlng.lat + ',' + gps._latlng.lng + '/' + Number(latlng[0]) + ',' + Number(latlng[1]) + '/data=!3m1!4b1!4m2!4m1!3e0')
    map.setView([Number(latlng[0]), Number(latlng[1])], 19);
    // console.log(latlng)
})
