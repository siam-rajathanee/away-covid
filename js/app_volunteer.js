
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
    test_latlng = [e.latlng.lng, e.latlng.lat] // e.latlng

    var point = turf.point(test_latlng);

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