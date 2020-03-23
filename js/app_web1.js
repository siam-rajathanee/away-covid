

new Vue({
    el: '#app',
    data() {
        return {
            info: '',
        }
    },

    mounted() {
        axios
            .get('http://localhost:8888/away-covid/web_service/get_point.php')
            .then(function (res) {
                console.log(res.data);

                const case_point = res.data

                L.geoJson(case_point, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { icon: case_confirm });
                    }
                }).addTo(map)




                function onLocationFound(e) {
                    var radius = 2000;
                    var test_latlng = [100.198185, 16.771642] // e.latlng

                    var point = turf.point(test_latlng);
                    L.geoJson(point).addTo(map)

                    // L.marker(test_latlng).addTo(map)
                    //     .bindPopup("You are within " + radius + " meters from this point")



                    var buffered = turf.buffer(point, 2, { units: 'kilometers' });
                    var buffereds = L.geoJson(buffered, {
                        stroke: false,
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.1,
                    }).addTo(map)

                    console.log(buffered);
                    // L.geoJson(buffered).addTo(map)

                    // var test = L.circle(test_latlng, {
                    //     stroke: false,
                    //     color: 'red',
                    //     fillColor: '#f03',
                    //     fillOpacity: 0.1,
                    //     radius: radius
                    // }).addTo(map);
                    // map.setView(test_latlng, 12);

                    // console.log(test);

                    // var ptsWithin = turf.pointsWithinPolygon(case_point, buffered);
                    // console.log(ptsWithin);





                    map.fitBounds(buffereds.getBounds())

                }

                function onLocationError(e) {
                    alert(e.message);
                }

                map.on('locationfound', onLocationFound);
                map.on('locationerror', onLocationError);

                map.locate({ setView: true, maxZoom: 16 });







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
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
});
