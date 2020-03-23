
new Vue({
    el: '#app_vue',
    data() {
        return {
            info: null,
        }
    },
    mounted() {
        axios
            .get('https://rti2dss.com/mapedia.serv/get_point.php?date=1')
            .then(function (res) {

                case_point = res.data

                var option_dropdown = '<option value="">- - กรุณาเลือก - -</option>'
                for (var i = 0; i < case_point.features.length; i++) {
                    option_dropdown += ' <option value="' + case_point.features[i].properties.place_name + '"> ' + case_point.features[i].properties.place_name + '</option>'
                }
                document.getElementById('select_place').innerHTML = option_dropdown

                L.geoJson(case_point, {
                    pointToLayer: function (f, latlng) {
                        if (f.properties.status_pat == 'รักษาหายแล้ว') {
                            return L.marker(latlng, {
                                icon: case_success,
                                highlight: "temporary"
                            });
                        } else if (f.properties.status_pat == 'กำลังรักษา') {
                            return L.marker(latlng, {
                                icon: case_confirm,
                                highlight: "temporary"
                            });
                        } else if (f.properties.status_pat == 'กักตัว 14 วัน') {
                            return L.marker(latlng, {
                                icon: case_warning,
                                highlight: "temporary"
                            });
                        } else if (f.properties.status_pat == 'ไม่ทราบสถานะ') {
                            return L.marker(latlng, {
                                icon: case_null,
                                highlight: "temporary"
                            });
                        }
                    }
                }).addTo(map)

                this.set_map = L.layerGroup().addTo(map)

                function onLocationFound(e) {

                    ptop = []
                    var radius = 20;
                    var test_latlng = [e.latlng.lng, e.latlng.lat] // e.latlng

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
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.1,
                    }).addTo(set_map)

                    var ptsWithin = turf.pointsWithinPolygon(case_point, buffered);
                    map.fitBounds(buffereds.getBounds())
                    var data = ptsWithin.features

                    var table = ''
                    for (var i = 0; i < data.length; i++) {
                        table += '  <tr> <td>   ' + data[i].properties.place_name + '  </td><td>   ' + data[i].properties.case_numbe + '    </td><td>  ' + data[i].properties.status_pat + '   </td> <td> <i class="fa fa-search"></i> </td> </tr> '
                    }
                    document.getElementById('tabel_data').innerHTML = table

                }


                map.on('locationfound', onLocationFound);
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
    iconUrl: 'img/confirm_case.png',
    iconSize: [50, 50], // size of the icon
});
var case_success = L.icon({
    iconUrl: 'img/success_case.png',
    iconSize: [50, 50], // size of the icon
});
var case_warning = L.icon({
    iconUrl: 'img/warning_case.png',
    iconSize: [50, 50], // size of the icon
});
var case_null = L.icon({
    iconUrl: 'img/null_case.png',
    iconSize: [50, 50], // size of the icon
});
var local_icon = L.icon({
    iconUrl: 'https://mapedia-th.github.io/away-covid/img/icon.png',
    iconSize: [20, 20]
});




$("#form_query").submit(function (event) {
    event.preventDefault();
    var place = event.target.place.value
    view_place = ''
    for (var i = 0; i < case_point.features.length; i++) {
        if (case_point.features[i].properties.place_name == place) {
            view_place = case_point.features[i]
        }
    }
    var lat = view_place.properties.lat
    var lon = view_place.properties.lon
    map.setView([lat, lon], 17);

})


function get_loca() {
    this.set_map.clearLayers()
    map.locate();
}