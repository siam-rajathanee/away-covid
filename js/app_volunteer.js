
var map = L.map('map'
    , { attributionControl: false }
).setView([14.431583, 100.694065], 6);


CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map)
document.getElementById('check_lat').innerHTML = '<button type="submit" class="btn btn-danger btn-block" disabled>กรุณาเปิดรับตำแหน่งก่อนบันทึกข้อมูล</button>'


$.getJSON("https://rti2dss.com/mapedia.serv/get_point_volunteer.php", function (data) {
    console.log(data);


    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: volunteer_icon,
            });
        }
    }).addTo(map)

    var M_t1 = ''
    for (var i = 0; i < data.features.length; i++) {
        M_t1 += '<tr> <td>' + data.features[i].properties.type_request + '</td> <td>' + data.features[i].properties.name_request + '</td> <td>' + data.features[i].properties.donate_date + '</td> <td><i class="fa fa-search"></i> </td> </tr>'
    }
    document.getElementById('mask_table').innerHTML = M_t1




})




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
        url: 'https://rti2dss.com/mapedia.serv/add_volunteer.php',
        method: 'post',
        data: ({
            name_request: name_request,
            address_request: address_request,
            detail_request: detail_request,
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