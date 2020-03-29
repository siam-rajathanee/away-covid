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
        url: 'https://mapedia.co.th/demo/add_tracking.php?type=login',
        method: 'post',
        data: ({
            pictureUrl: pictureUrl,
            userId: userId,
            displayName: displayName,
            decodedIDToken: decodedIDToken,
            page_view: 'volunteer.html'
        }),
        success: function (data) {
        }
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
    await liff.init({ liffId: "1653981898-P7gEnQ05" })
}
main()




var map = L.map('map'
    , { attributionControl: false }
).setView([14.431583, 100.694065], 6);
var markers = L.markerClusterGroup().addTo(map)

CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map)
document.getElementById('check_lat').innerHTML = '<button type="submit" class="btn btn-danger btn-block" disabled>กรุณาเปิดรับตำแหน่งก่อนบันทึกข้อมูล</button>'



$.getJSON("https://mapedia.co.th/demo/get_point_volunteer.php", function (data) {

    geojson = data
    L.geoJson(data, {

        pointToLayer: function (feature, latlng) {
            if (feature.properties.type_request == 'โรงพยาบาล') {
                var icon = hospital_icon
            } else {
                var icon = volunteer_icon
            }
            var mask, gel, alcohol, food, medical_tools, medicine = ''
            if (feature.properties.mask == 'true') {
                mask = '<li class="list-group-item">หน้ากากอนามัย</li> '
            } else { mask = '' }
            if (feature.properties.gel == 'true') {
                gel = '<li class="list-group-item">เจลล้างมือ</li> '
            } else { gel = '' }
            if (feature.properties.alcohol == 'true') {
                alcohol = '<li class="list-group-item">แอลกอฮอล์</li> '
            } else { alcohol = '' }
            if (feature.properties.food == 'true') {
                food = '<li class="list-group-item">อาหารแห้ง / ของใช้</li> '
            } else { food = '' }
            if (feature.properties.medical_tools == 'true') {
                medical_tools = '<li class="list-group-item">เครื่องมือทางการแพทย์</li> '
            } else { medical_tools = '' }
            if (feature.properties.medicine == 'true') {
                medicine = '<li class="list-group-item">ยารักษาโรค</li> '
            } else { medicine = '' }


            return L.marker(latlng, {
                icon: icon,
            }).bindPopup('<div class="card mb-3"> <h4 class="card-header">ประเภท : ' + feature.properties.type_request + ' </h4> <div class="card-body"> <h5 class="card-title">ผู้ขอรับบริจาค : ' + feature.properties.name_request + ' </h5> <h6 class="card-subtitle text-muted">ที่อยู่สำหรับจัดส่ง : ' + feature.properties.address_request + ' </h6> </div> <div class="card-body"> <p class="card-text">รายละเอียด/เหตุผลที่ขอรับ : ' + feature.properties.details_request + ' </p> </div> สิ่งที่ขอ : <ul class="list-group list-group-flush">  ' + mask + gel + alcohol + food + medical_tools + medicine + ' </ul > <div class="card-footer text-muted">วันที่ขอ : ' + feature.properties.donate_date + ' </div> </div > ')
        }

    }
    ).addTo(markers)


    var M_t1 = ''
    var M_t2 = ''
    var M_t3 = ''
    var M_t4 = ''
    var M_t5 = ''
    var M_t6 = ''
    for (var i = 0; i < data.features.length; i++) {
        var value = data.features[i].properties.gid;

        if (data.features[i].properties.mask == 'true') {
            M_t1 += '<tr> <td>' + data.features[i].properties.type_request + '</td> <td>' + data.features[i].properties.name_request + '</td> <td>' + data.features[i].properties.donate_date
                + '</td> <td><i class="fa fa-search" onClick="gotopoint(' + value + ')"></i> </td> </tr>'
        }
        if (data.features[i].properties.gel == 'true') {
            M_t2 += '<tr> <td>' + data.features[i].properties.type_request + '</td> <td>' + data.features[i].properties.name_request + '</td> <td>' + data.features[i].properties.donate_date
                + '</td> <td><i class="fa fa-search" onClick="gotopoint(' + value + ')"></i> </td> </tr>'
        }
        if (data.features[i].properties.alcohol == 'true') {
            M_t3 += '<tr> <td>' + data.features[i].properties.type_request + '</td> <td>' + data.features[i].properties.name_request + '</td> <td>' + data.features[i].properties.donate_date
                + '</td> <td><i class="fa fa-search" onClick="gotopoint(' + value + ')"></i> </td> </tr>'
        }
        if (data.features[i].properties.food == 'true') {
            M_t4 += '<tr> <td>' + data.features[i].properties.type_request + '</td> <td>' + data.features[i].properties.name_request + '</td> <td>' + data.features[i].properties.donate_date
                + '</td> <td><i class="fa fa-search" onClick="gotopoint(' + value + ')"></i> </td> </tr>'
        }
        if (data.features[i].properties.medical_tools == 'true') {
            M_t5 += '<tr> <td>' + data.features[i].properties.type_request + '</td> <td>' + data.features[i].properties.name_request + '</td> <td>' + data.features[i].properties.donate_date
                + '</td> <td><i class="fa fa-search" onClick="gotopoint(' + value + ')"></i> </td> </tr>'
        }
        if (data.features[i].properties.medicine == 'true') {
            M_t6 += '<tr> <td>' + data.features[i].properties.type_request + '</td> <td>' + data.features[i].properties.name_request + '</td> <td>' + data.features[i].properties.donate_date
                + '</td> <td><i class="fa fa-search" onClick="gotopoint(' + value + ')"></i> </td> </tr>'
        }
    }
    document.getElementById('mask_table').innerHTML = M_t1
    document.getElementById('gel_table').innerHTML = M_t2
    document.getElementById('alcohol_table').innerHTML = M_t3
    document.getElementById('food_table').innerHTML = M_t4
    document.getElementById('medical_tools_table').innerHTML = M_t5
    document.getElementById('medicine_table').innerHTML = M_t6

})



function gotopoint(id) {
    console.log(geojson);
    $("#volunteer").modal("hide");
    $("#mask").modal("hide");
    $("#gel").modal("hide");
    $("#alcohol").modal("hide");
    $("#food").modal("hide");
    $("#medical_tools").modal("hide");
    $("#medicine").modal("hide");

    for (var i = 0; i < geojson.features.length; i++) {
        if (geojson.features[i].properties.gid == id) {
            view_place = geojson.features[i]
        }
    }
    var lat = view_place.properties.lat
    var lon = view_place.properties.lon
    map.setView([lat, lon], 13)
}


function onLocationFound(e) {

    var radius = 150;
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
        .addTo(set_map)

    var buffered = turf.buffer(point, radius, { units: 'kilometers' });

    var buffereds = L.geoJson(buffered, {
        stroke: false,
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0.1,
    }).addTo(set_map)

    map.fitBounds(buffereds.getBounds())

    document.getElementById('check_lat').innerHTML = '<button type="submit" class="btn btn-warning btn-block">ลงทะเบียนขอรับบริจาค</button>'
}

map.on('locationfound', onLocationFound);
map.locate();

var local_icon = L.icon({
    iconUrl: 'https://mapedia-th.github.io/away-covid/img/icon.png',
    iconSize: [20, 20]
});
var volunteer_icon = L.icon({
    iconUrl: 'img/volunteer.png',
    iconSize: [45, 45]
});
var hospital_icon = L.icon({
    iconUrl: 'img/hospital_2.png',
    iconSize: [45, 45]
});


points_case = L.layerGroup().addTo(map)
set_map = L.layerGroup().addTo(map)


$("#form_query").submit(function (event) {

    event.preventDefault();
    var name_request = event.target.name_request.value
    var address_request = event.target.address_request.value
    var detail_request = event.target.detail_request.value
    var mask = event.target.mask.checked
    var gel = event.target.gel.checked
    var alcohol = event.target.alcohol.checked
    var food = event.target.food.checked
    var medical_tools = event.target.medical_tools.checked
    var medicine = event.target.medicine.checked
    var check_list = event.target.check_list.checked
    var type_request = event.target.type_request.value

    $.ajax({
        url: 'https://mapedia.co.th/demo/add_volunteer.php',
        method: 'post',
        data: ({
            name_request: name_request,
            address_request: address_request,
            details_request: detail_request,
            mask: mask,
            gel: gel,
            alcohol: alcohol,
            food: food,
            medical_tools: medical_tools,
            medicine: medicine,
            lat: latlng[1],
            lon: latlng[0],
            check_list: check_list,
            type_request: type_request
        }),
        success: function (data) {
            console.log(JSON.parse(data));
            var data = JSON.parse(data)
            if (data.insert == false) {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ท่านไม่สามารถลงทะเบียนขอรับบริจาคได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง ',
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'ลงทะเบียนสำเร็จ',
                    text: '#เราคนไทยร่วมใจสู้ภัยโควิด ',
                })
            }
        }, error: function () {
            console.log('error  data!');
        }
    })

})


