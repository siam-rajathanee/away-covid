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
            .get('http://localhost:8888/away-covid/web_service/get_map_dashboard.php?type=geojson_1')
            .then(function (res) {
                const case_geojson = res.data
                var geojson = L.geoJson(case_geojson, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map)
            }
            )
    }
})

new Vue({
    el: '#app_chart1',
    data() {
        return {
            info: '',
            ptop: []
        }
    },

    mounted() {
        axios
            .get('http://localhost:8888/away-covid/web_service/get_map_dashboard.php?type=chart_1')
            .then(function (res) {
                console.log(res.data);
                var covid_dga = res.data

                var group_3 = covid_dga.reduce(function (r, row) {
                    r[row.date] = ++r[row.date] || 1;
                    return r;
                }, {});
                this.data_time = Object.keys(group_3).map(function (key) {
                    return { time: key, value: group_3[key] };
                });
                var categories_chart3 = []
                var data_chart3 = []

                for (var i = 0; i < this.data_time.length; i++) {
                    categories_chart3.push(this.data_time[i].time)
                    data_chart3.push(this.data_time[i].value)
                }





                Highcharts.chart('container3', {

                    chart: {

                        type: 'areaspline'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        categories: categories_chart3,
                        crosshair: true
                    },
                    legend: {
                        enabled: false,
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    yAxis: {
                        title: {
                            enabled: false,
                        }
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y} ราย</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    series: [{
                        name: 'จำนวนผู้ป่วย',
                        data: data_chart3,
                        color: '#FD8D3C'

                    }]
                });



                var group_1 = covid_dga.reduce(function (r, row) {
                    r[row.province] = ++r[row.province] || 1;
                    return r;
                }, {});
                this.data_pv_th = Object.keys(group_1).map(function (key) {
                    return { province: key, value: group_1[key] };
                });
                this.data_pv_th = this.data_pv_th.sort((a, b) => (a.value < b.value) ? 1 : -1)

                var categories_chart1 = []
                var data_chart1 = []
                for (var i = 0; i < 10; i++) {
                    categories_chart1.push(this.data_pv_th[i].province)
                    data_chart1.push(this.data_pv_th[i].value)
                }

                Highcharts.chart('container', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: ''
                    },
                    legend: {
                        enabled: false,
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {

                        categories: categories_chart1
                    },
                    yAxis: {
                        title: {
                            enabled: false,
                        }
                    },
                    plotOptions: {
                        area: {
                            fillOpacity: 0.5
                        }
                    },
                    series: [{
                        name: 'จำนวนผู้ป่วย',
                        data: data_chart1,
                        color: '#FED976'
                    }]
                });



                var group_2 = covid_dga.reduce(function (r, row) {
                    r[row.sex] = ++r[row.sex] || 1;
                    return r;
                }, {});
                this.data_sex = Object.keys(group_2).map(function (key) {
                    return { sex: key, value: group_2[key] };
                });
                console.log(this.data_sex);
                // this.data_pv_th = this.data_pv_th.sort((a, b) => (a.value < b.value) ? 1 : -1)



                var data_chart1 = []
                var color_pie = ['#ffb3ff', '#00b8e6', '#808080']
                for (var i = 0; i < this.data_sex.length; i++) {
                    data_chart1.push({
                        name: this.data_sex[i].sex,
                        y: this.data_sex[i].value,
                        color: color_pie[i]
                    })
                }



                Highcharts.chart('container2', {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: ''
                    },
                    accessibility: {
                        point: {
                            valueSuffix: '%'
                        }
                    },
                    legend: {
                        enabled: false,
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    series: [{
                        name: 'จำนวนผู้ป่วย',
                        colorByPoint: true,
                        data: data_chart1
                    }]

                });




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



function getColor(d) {
    return d > 200 ? '#800026' :
        d > 100 ? '#BD0026' :
            d > 50 ? '#E31A1C' :
                d > 20 ? '#FC4E2A' :
                    d > 10 ? '#FD8D3C' :
                        d > 5 ? '#FEB24C' :
                            d > 0 ? '#FED976' :
                                '#f2f2f2';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.count),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8
    };
}

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5, 10, 20, 50, 100, 200],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);


function zoomToFeature(e) {
    var layer = e.target;
    map.fitBounds(e.target.getBounds());
    info.update(layer.feature.properties);
}

function onEachFeature(feature, layer) {
    layer.on({
        click: zoomToFeature
    });
}


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4 style="font-family: Prompt;">แผนที่สรุปข้อมูลผู้ป่วย Covid 19</h4>' + (props ?
        '<b  style="font-family: Prompt;">จังหวัด : ' + props.pv_th + '</b><br /> <p style="font-family: Prompt;">จำนวนผู้ป่วย :' + props.count + ' คน </p>  <small style="font-family: Prompt;"> *รายงานผู้ป่วยยืนยันประจำวัน จาก กรมควบคุมโรค </small>'
        : '<p style="font-family: Prompt;"> กดที่แผนที่เพื่อดูข้อมูล </p>');
};

info.addTo(map);

