let userId;
$(document).ready(async function () {
    await liff.init({ liffId: "1653984157-Yn4O7eAO" })
    // const profile = await liff.getProfile();
    // userid = profile.userId;
    await loadMap();
    getStore();
});

let map = L.map('map', {
    center: [13.802664, 99.950034],
    zoom: 6
});

var gps;
var isNew = true;
var url = 'https://rti2dss.com:3200';
// var url = 'http://localhost:3200';

function loadMap() {
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);
}

function onLocationFound(e) {
    gps = L.marker(e.latlng, { draggable: true });
}

function onLocationError(e) {
    console.log(e.message);
}

function refreshPage() {
    location.reload(true);
}

map.on('locationfound', onLocationFound);

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

function saveStore() {
    // alert(userId)
    let obj = {
        userid: userid,
        storeName: $('#storeName').val(),
        storeId: $('#storeId').val(),
        facebook: $('#facebook').val(),
        lineid: $('#lineid').val(),
        tel: $('#tel').val(),
        maskVol: $('#maskVol').val(),
        maskLowprice: $('#maskLowprice').val(),
        maskHighprice: $('#maskHighprice').val(),
        gelVol: $('#gelVol').val(),
        gelLowprice: $('#gelLowprice').val(),
        gelHighprice: $('#gelHighprice').val(),
        geom: JSON.stringify(gps.toGeoJSON().geometry)
    }

    if (isNew) {
        $.post(url + '/anticov-api/savestore', obj).done((res) => {
            getStore();
        })
    } else {
        $.post(url + '/anticov-api/updatestore', obj).done((res) => {
            getStore();
        })
    }

}
let store = L.layerGroup().addTo(map);
async function getStore() {
    let obj = {
        userid: userid
    }
    await $.post(url + '/anticov-api/getstore', obj).done((res) => {
        if (res.data.length > 0) {
            isNew = false;
            $('#storeName').val(res.data[0].storename);
            $('#storeId').val(res.data[0].storeid);
            $('#facebook').val(res.data[0].facebook);
            $('#lineid').val(res.data[0].lineid);
            $('#tel').val(res.data[0].tel);
            $('#maskVol').val(res.data[0].maskvol);
            $('#maskLowprice').val(res.data[0].masklowprice);
            $('#maskHighprice').val(res.data[0].maskhighprice);
            $('#gelVol').val(res.data[0].gelvol);
            $('#gelLowprice').val(res.data[0].gellowprice);
            $('#gelHighprice').val(res.data[0].gelhighprice);
        }

    })

    await $.get(url + '/anticov-api/getallstore').done((res) => {
        let items = res.data;

        const icon = 'shop.svg';
        const iconMarker = L.icon({
            iconUrl: icon,
            iconSize: [30, 30],
            // iconAnchor: [12, 37],
            // popupAnchor: [5, -36]
        });

        items.forEach(item => {
            console.log(item)
            let mk = L.marker([Number(item.lat), Number(item.lng)], {
                icon: iconMarker
            }).bindPopup(
                '<h5>ข้อมูลร้านค้า</h5> <br>' +
                '<b>ชื่อร้าน:</b>' + item.storename + '<br>' +
                '<b>เลขทะเบียนการค้า:</b>' + item.storename + '<br>' +
                '<b>facebook:</b>' + item.facebook + '<br>' +
                '<b>Line:</b>' + item.lineid + '<br>' +
                '<b>โทรศัพท์:</b>' + item.tel + '<br>' +
                '<b>จำนวนหน้ากาก:</b>' + item.maskvol + ' <br>' +
                '<b>ราคาต่ำสุด:</b>' + item.masklowprice + ' ' + ' บาท <b>ราคาสูงสุด:</b>' + item.maskhighprice + ' บาท<br>' +
                '<b>จำนวนเจลล้างมือ:</b>' + item.gelvol + ' <br>' +
                '<b>ราคาต่ำสุด:</b>' + item.gellowprice + ' ' + ' บาท <b>ราคาสูงสุด:</b>' + item.gelhighprice + ' บาท<br>'
                // '<br/><span >สถานที่: </span>' + item.name +
                // '<br/><span >ลิ้งค์: </span><a href="https://www.google.com/maps/dir/' + gps._latlng.lat + ',' + gps._latlng.lng + '/' + Number(item.lat) + ',' + Number(item.long) + '/data=!3m1!4b1!4m2!4m1!3e0">เส้นทาง</a>'
            );

            mk.addTo(store);
        });
    })
}






