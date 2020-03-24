
var map = L.map('map'
    , { attributionControl: false }
).setView([14.431583, 100.694065], 6);


CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map)


function onLocationFound(e) {

    var radius = 150;
    latlng = [e.latlng.lng, e.latlng.lat] // e.latlng

    var point = turf.point(latlng);

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
        color: 'green',
        fillColor: 'green',
        fillOpacity: 0.1,
    }).addTo(set_map)

    map.fitBounds(buffereds.getBounds())


}

map.on('locationfound', onLocationFound);
map.locate();

var local_icon = L.icon({
    iconUrl: 'https://mapedia-th.github.io/away-covid/img/icon.png',
    iconSize: [20, 20]
});


points_case = L.layerGroup().addTo(map)
set_map = L.layerGroup().addTo(map)


$("#form_query").submit(function (event) {
    $("#form_query").modal("hide");
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


    $.ajax({
        url: 'http://localhost:8888/away-covid/web_service/add_volunteer.php',
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
            check_list: check_list
        }),
        success: function (data) {

        }, error: function () {
            console.log('error  data!');
        }
    })

})