new Vue({
    el: '#app_vue',
    data() {
        return {
            info: '',
            ptop: []
        }
    },

    mounted() {
        axios
            .get('http://119.59.125.134/mapedia.serv/get_point.php')
            .then(function (res) {
                console.log(res.data);

                const case_point = res.data

                L.geoJson(case_point, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { icon: case_confirm });
                    }
                }).addTo(map)

                function onLocationFound(e) {
                    var radius = 2;
                    var test_latlng = [100.198185, 16.771642] // e.latlng

                    var point = turf.point(test_latlng);
                    L.geoJson(point)
                        .bindPopup("ตำแหน่งปัจจุบันของท่าน")
                        .addTo(map)

                    var buffered = turf.buffer(point, radius, { units: 'kilometers' });
                    var buffereds = L.geoJson(buffered, {
                        stroke: false,
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.1,
                    }).addTo(map)

                    console.log(buffered);

                    var ptsWithin = turf.pointsWithinPolygon(case_point, buffered);

                    this.ptop = ptsWithin.features
                    console.log(this.ptop);
                    map.fitBounds(buffereds.getBounds())

                }

                function onLocationError(e) {
                    alert(e.message);
                }

                map.on('locationfound', onLocationFound);
                map.on('locationerror', onLocationError);

                map.locate();
            }
            )
    }
})




var map = L.map('map'
    , { attributionControl: false }
).setView([13.822496, 100.716057], 5);


var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map)

var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
})


var case_confirm = L.icon({
    iconUrl: 'https://covidtracker.5lab.co/images/confirmed.svg',

});
