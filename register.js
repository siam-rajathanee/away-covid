$(document).ready(function () {
    loadMap();
    getAccount();
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
    var pro = L.tileLayer.wms("https://cors-anywhere.herokuapp.com/http://rti2dss.com:8080/geoserver/th/wms?", {
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
        "ขอบจังหวัด": pro.addTo(map)
    }
    L.control.layers(baseMap, overlayMap).addTo(map);
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
    $.get(url + `/acc-api/getaddress/${x}/${y}`).done((res) => {
        tam = res.data[0].tam_name;
        amp = res.data[0].amp_name;
        pro = res.data[0].pro_name;
        place = `ต.${tam} อ.${amp} จ.${pro}`;
        $('#address').val(place)
    })
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

var isNew = true;
function getAccount() {
    const obj = {
        userid: urlParams.get('userid')
    }
    $.post(url + '/anticov-api/getaccount', obj).done((res) => {
        console.log(res.data)
        $("#n").text('Save');
        if (res.data.length > 0) {
            isNew = false;
            $('#ocupation').val(res.data[0].ocupation);
            $('#birthdate').val(res.data[0].birthdate);
            $('#sex').val(res.data[0].sex);
            $('#healthy').val(res.data[0].healthy);

            $("#n").text('Update');
        }
    })
}

$('#fieldForm').submit(function (e) {
    e.preventDefault();
    const obj = {
        userid: urlParams.get('userid'),
        ocupation: $('#ocupation').val(),
        birthdate: $('#birthdate').val(),
        sex: $('#sex').val(),
        healthy: $('#healthy').val(),
        place: place,
        geom: JSON.stringify(gps.toGeoJSON().geometry)
    }

    if (isNew) {
        console.log('insert', obj)
        $.post(url + '/anticov-api/insert', obj).done((res) => {
            // console.log(res)
            $('#modal').modal('show');
            getAccount()
        })
    } else {
        console.log('update', obj)
        $.post(url + '/anticov-api/update', obj).done((res) => {
            // console.log(res)
            $('#modal').modal('show');
            getAccount();
        })
    }
    // console.log(obj)
    return false;
});

