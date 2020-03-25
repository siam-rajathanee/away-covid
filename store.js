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

        const b64 = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8cmVjdCB4PSIzMy4wNjciIHk9IjEzNi41MzMiIHN0eWxlPSJmaWxsOiNGRkQxNUM7IiB3aWR0aD0iNDQ0LjgiIGhlaWdodD0iMzMwLjY2NyIvPgo8cmVjdCB4PSIyODMuNzMzIiB5PSIyMjguMjY3IiBzdHlsZT0iZmlsbDojNDE1QTZCOyIgd2lkdGg9IjE2Mi4xMzMiIGhlaWdodD0iMjM4LjkzMyIvPgo8cmVjdCB4PSIyOTkuNzMzIiB5PSIyNDQuMjY3IiBzdHlsZT0iZmlsbDojOEFEN0Y4OyIgd2lkdGg9IjEzMC4xMzMiIGhlaWdodD0iMjA2LjkzMyIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRjA1NTQwOyIgZD0iTTAsMTAyLjR2NDhjMCwyOC44LDIyLjQsNTEuMiw1MS4yLDUxLjJzNTEuMi0yMi40LDUxLjItNTEuMnYtNDhIMHoiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0U4RUFFOTsiIGQ9Ik0xMDIuNCwxMDIuNHY0OGMwLDI4LjgsMjIuNCw1MS4yLDUxLjIsNTEuMnM1MS4yLTIyLjQsNTEuMi01MS4ydi00OEgxMDIuNHoiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0YwNTU0MDsiIGQ9Ik0yMDQuOCwxMDIuNHY0OGMwLDI4LjgsMjIuNCw1MS4yLDUxLjIsNTEuMmMyOC44LDAsNTEuMi0yMi40LDUxLjItNTEuMnYtNDhIMjA0Ljh6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNFOEVBRTk7IiBkPSJNMzA3LjIsMTAyLjR2NDhjMCwyOC44LDIyLjQsNTEuMiw1MS4yLDUxLjJjMjguOCwwLDUxLjItMjIuNCw1MS4yLTUxLjJ2LTQ4SDMwNy4yeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRjA1NTQwOyIgZD0iTTQwOS42LDEwMi40djQ4YzAsMjguOCwyMi40LDUxLjIsNTEuMiw1MS4yczUxLjItMjIuNCw1MS4yLTUxLjJ2LTQ4SDQwOS42eiIvPgo8cG9seWdvbiBzdHlsZT0iZmlsbDojRjM3MDVBOyIgcG9pbnRzPSIxMjQuOCwwIDM3LjMzMywwIDAsMTAyLjQgMTAyLjQsMTAyLjQgIi8+Cjxwb2x5Z29uIHN0eWxlPSJmaWxsOiNGM0YzRjM7IiBwb2ludHM9IjIxMi4yNjcsMCAxMjQuOCwwIDEwMi40LDEwMi40IDIwNC44LDEwMi40ICIvPgo8cG9seWdvbiBzdHlsZT0iZmlsbDojRjM3MDVBOyIgcG9pbnRzPSIyOTkuNzMzLDAgMjEyLjI2NywwIDIwNC44LDEwMi40IDMwNy4yLDEwMi40ICIvPgo8cG9seWdvbiBzdHlsZT0iZmlsbDojRjNGM0YzOyIgcG9pbnRzPSIzODcuMiwwIDI5OS43MzMsMCAzMDcuMiwxMDIuNCA0MDkuNiwxMDIuNCAiLz4KPHBvbHlnb24gc3R5bGU9ImZpbGw6I0YzNzA1QTsiIHBvaW50cz0iNDc0LjY2NywwIDM4Ny4yLDAgNDA5LjYsMTAyLjQgNTEyLDEwMi40ICIvPgo8cmVjdCB5PSI0NjcuMiIgc3R5bGU9ImZpbGw6I0NFRDZFMDsiIHdpZHRoPSI1MTIiIGhlaWdodD0iNDQuOCIvPgo8Zz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzQxNUE2QjsiIGN4PSIzMjAiIGN5PSIzNDcuNzMzIiByPSIxMy44NjciLz4KCTxyZWN0IHg9IjY1LjA2NyIgeT0iMjI4LjI2NyIgc3R5bGU9ImZpbGw6IzQxNUE2QjsiIHdpZHRoPSIxODAuMjY3IiBoZWlnaHQ9IjE2Mi4xMzMiLz4KPC9nPgo8cmVjdCB4PSI4MS4wNjciIHk9IjI0NC4yNjciIHN0eWxlPSJmaWxsOiM4QUQ3Rjg7IiB3aWR0aD0iMTQ4LjI2NyIgaGVpZ2h0PSIxMzAuMTMzIi8+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6IzU1QzBFQjsiIGQ9Ik0xNTguOTMzLDI2NC41MzNjLTIuMTMzLTIuMTMzLTcuNDY3LTIuMTMzLTkuNiwwTDk3LjA2NywzMTYuOGMtMi4xMzMsMi4xMzMtMi4xMzMsNy40NjcsMCw5LjYgICBzNy40NjcsMi4xMzMsOS42LDBsNTIuMjY3LTUyLjI2N0MxNjIuMTMzLDI3MC45MzMsMTYyLjEzMywyNjYuNjY3LDE1OC45MzMsMjY0LjUzM3oiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM1NUMwRUI7IiBkPSJNMTcwLjY2NywyOTUuNDY3Yy0yLjEzMy0yLjEzMy03LjQ2Ny0yLjEzMy05LjYsMEwxMjgsMzI4LjUzM2MtMi4xMzMsMi4xMzMtMi4xMzMsNy40NjcsMCw5LjYgICBzNy40NjcsMi4xMzMsOS42LDBsMzMuMDY3LTMzLjA2N0MxNzMuODY3LDMwMS44NjcsMTczLjg2NywyOTcuNiwxNzAuNjY3LDI5NS40Njd6Ii8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==';

        const icon = b64;
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






