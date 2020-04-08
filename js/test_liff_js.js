async function getUserProfile() {
    profile = await liff.getProfile()
    pictureUrl = profile.pictureUrl
    userId = profile.userId
    displayName = profile.displayName
    decodedIDToken = liff.getDecodedIDToken().email
    if (pictureUrl == undefined) {
        pictureUrl = ''
    }
    document.getElementById('displayname').innerHTML = '<h5 id="displayname">' + displayName + '</h5>'
    document.getElementById('img_profile').innerHTML = '<img id="img_profile" class="profile_img" src="' + pictureUrl + '" alt="">'
}

async function main() {
    liff.ready.then(() => {
        if (liff.isLoggedIn()) {
            getUserProfile()
        } else {
            liff.login()
        }
    })
    await liff.init({ liffId: "1653981898-ZNBANLd7" })
}
main()



$.getJSON("https://covid19.th-stat.com/api/open/today", function (data) {
    document.getElementById('Confirmed').innerHTML = ' <b id="Confirmed">' + data.Confirmed + '</b> '
    document.getElementById('Recovered').innerHTML = '<b id="Recovered">' + data.Recovered + '</b>  '
    document.getElementById('Hospitalized').innerHTML = '<b id="Hospitalized">' + data.Hospitalized + '</b>'
    document.getElementById('Deaths').innerHTML = ' <b  id="Deaths">' + data.Deaths + '</b> '

})

var map = L.map('map', {
    scrollWheelZoom: false,
    gestureHandling: true,
    attributionControl: false
}).setView([13.822496, 100.716057], 5);

var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map)

var case_confirm = L.icon({
    iconUrl: 'https://covidtracker.5lab.co/images/confirmed.svg',
});
function onLocationFound(e) {
    get_latlng = [e.latlng.lng, e.latlng.lat]
    var point = turf.point(get_latlng);


    province_geojson.features.forEach(e => {
        var ptsWithin = turf.pointsWithinPolygon(point, e);
        if (ptsWithin.features.length > 0) {
            province = e.properties.pv_tn
        }
    });




    $.getJSON("https://mapedia.co.th/demo/get_cv_province.php", function (data) {
        data.forEach(e => {
            if (e.province == province) {
                if (e.acc_pui == 0) {
                    e.acc_pui = 'ไม่ทราบ'
                }
                document.getElementById('pro').innerHTML = '<h2 class="display-3" id="pro"> <i class="fa fa-location-arrow" aria-hidden="true"></i> ' + e.province + ' </h2>'
                document.getElementById('sum_val').innerHTML = ' <h3 id="sum_val">ผู้ป่วยสะสม : ' + e.patient_tt + ' ราย</h3>'
                document.getElementById('recovery').innerHTML = '  <div id="recovery">' + e.recovery + ' <br>รักษาหาย</div> '
                document.getElementById('admission').innerHTML = ' <div id="admission">' + e.admission + ' <br>รักษาอยู่</div> '
                document.getElementById('patient_new').innerHTML = ' <div id="patient_new">' + e.patient_new + ' <br>เพิ่มใหม่</div> '
                document.getElementById('acc_pui').innerHTML = '  <div id="acc_pui"> ' + e.acc_pui + '<br> PUI สะสม</div> '
                document.getElementById('death').innerHTML = '  <div id="death">' + e.death + ' <br>ตาย</div> '
                document.getElementById('update_1').innerHTML = ' <small id="update_1">ข้อมูล ณ วันที่  : ' + e.date + '</small>'
                Number(e.patient_tt)
                var pa_tt = Number(e.patient_tt)

                if (pa_tt >= 100) {
                    document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 0%, rgb(228, 38, 0) 99%)'
                } else if (pa_tt >= 50) {
                    document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 0%, rgb(255, 86, 35) 99%)'
                } else if (pa_tt >= 10) {
                    document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 0%, rgb(255, 150, 13) 99%)'
                } else if (pa_tt > 0) {
                    document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 15%, rgb(255, 204, 63) 99%)'
                } else {
                    document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 15%, #48da48 99%)'
                }


            }
        })
    })


}

map.on('locationfound', onLocationFound);
map.locate();





$.getJSON("https://covid19.th-stat.com/api/open/cases", function (data) {
    var res = data.Data
    var group_1 = res.reduce(function (r, row) {
        r[row.Province] = ++r[row.Province] || 1;
        return r;
    }, {});
    this.data_pv_th = Object.keys(group_1).map(function (key) {
        return {
            Province: key,
            value: group_1[key]
        };
    });
    this.data_pv_th = this.data_pv_th.sort((a, b) => (a.value < b.value) ? 1 : -1)
    province_geojson.features.forEach(e => {
        for (let i = 0; i < this.data_pv_th.length; i++) {
            if (e.properties.pv_tn == this.data_pv_th[i].Province) {
                e.properties.value = this.data_pv_th[i].value
            }
        }
        if (e.properties.value == undefined) {
            e.properties.value = 0
        }
    });

    var geojson = L.geoJson(province_geojson, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map)


    var table = ''
    for (var i = 0; i < this.data_pv_th.length; i++) {
        if (this.data_pv_th[i].province == 'null') {
            this.data_pv_th[i].province = 'ไม่ระบุ'
        }
        table += '  <tr> <td>   ' + this.data_pv_th[i].Province + '  </td><td>   ' + this.data_pv_th[i].value + '    </td> </tr> '
    }
    document.getElementById('all_sum_table').innerHTML = table
    var categories_chart1 = []
    var data_chart1 = []
    for (var i = 0; i < 10; i++) {
        if (this.data_pv_th[i].Province == 'null') {
            this.data_pv_th[i].Province = 'ไม่ระบุ'
        }
        categories_chart1.push(this.data_pv_th[i].Province)
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
            enabled: true,
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
            data: data_chart1,
            color: '#FED976'
        }]
    });

})

$.getJSON("https://covid19.th-stat.com/api/open/cases/sum", function (data) {
    var data_chart1 = [{
        name: 'ชาย',
        y: data.Gender.Male,
        color: '#00b8e6'
    }, {
        name: 'หญิง',
        y: data.Gender.Female,
        color: '#ffb3ff'
    }, {
        name: 'ไม่ระบุ',
        y: data.Gender.Unknown,
        color: '#808080'
    }]
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
            enabled: true,
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
})


$.getJSON("https://covid19.th-stat.com/api/open/timeline", function (data) {
    var res = data.Data
    var categories_chart3 = []
    var data_chart3 = []
    var data_chart3_2 = []
    var death = []
    var Recovered = []
    var Hospitalized = []

    for (var i = 75; i < res.length; i++) {
        categories_chart3.push(res[i].Date)
        data_chart3.push(res[i].Confirmed)
        data_chart3_2.push(res[i].NewConfirmed)
        death.push(res[i].Deaths)
        Recovered.push(res[i].Recovered)
        Hospitalized.push(res[i].Hospitalized)
    }
    Highcharts.chart('container3', {

        chart: {

            type: 'line'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: categories_chart3,
            crosshair: true,

        },
        legend: {
            enabled: true,
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
            name: 'จำนวนผู้ป่วยสะสม',
            data: data_chart3,
            color: '#FD8D3C'

        }, {
            name: 'จำนวนผู้ป่วยรายวัน',
            data: data_chart3_2,
            color: '#FC4E2A'
        }, {
            name: 'กำลังรักษา',
            data: Hospitalized,
            color: '#80ffaa'
        }, {
            name: 'รักษาหาย',
            data: Recovered,
            color: '#00cc44'
        }, {
            name: 'ผู้เสียชีวิต',
            data: death,
            color: '#595959'
        }]
    });
})

function getColor(d) {
    return d > 200 ? '#800026' :
        d > 100 ? '#BD0026' :
            d > 50 ? '#E31A1C' :
                d > 20 ? '#FC4E2A' :
                    d > 10 ? '#FD8D3C' :
                        d > 5 ? '#FEB24C' :
                            d > 0 ? '#FED976' :
                                '#33cc33';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.value),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 1
    };
}

var legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5, 10, 20, 50, 100, 200],
        labels = [];


    div.innerHTML += '<i style="background:#33cc33"></i> ไม่มีผู้ป่วย <br>';
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            (grades[i] + 1) + (grades[i + 1] ? '&ndash;' + (grades[i + 1]) + '<br>' : '+');
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


var date = new Date();
date.setDate(date.getDate());
nowdate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

info.update = function (props) {
    this._div.innerHTML = ' ' + (props ?
        '<b  style="font-family: Prompt;">จังหวัด : ' + props.pv_tn + '</b><br /> <p style="font-family: Prompt;">จำนวนผู้ป่วย :' + props.value + ' คน </p>' :
        '<p style="font-family: Prompt;"> กดที่แผนที่เพื่อดูข้อมูล </p> ');
};
info.addTo(map);


L.Control.watermark = L.Control.extend({
    onAdd: function (map) {
        var img = L.DomUtil.create('img');
        img.src = 'https://mapedia.co.th/assets/images/logo_1_1024.png';
        img.style.width = '30px';
        img.style.opacity = '0.5';
        return img;
    }
});
L.control.watermark = function (opts) {
    return new L.Control.watermark(opts);
}
L.control.watermark({ position: 'bottomleft' }).addTo(map);




var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255,224,0, 1)',
                'rgba(255,224,0, 1)',
                'rgba(255,224,0, 1)',
                'rgba(255,224,0, 1)',
                'rgba(255,224,0, 1)',
                'rgba(255,224,0, 1)',
                'rgba(255,224,0, 1)',
            ],
            borderWidth: 1,
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});