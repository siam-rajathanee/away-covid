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

    $.ajax({
        url: 'https://mapedia.co.th/demo/add_tracking.php?type=login',
        method: 'post',
        data: ({
            pictureUrl: pictureUrl,
            userId: userId,
            displayName: displayName,
            page_view: 'map_dashboard.html'
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
    await liff.init({ liffId: "1653981898-EK590Od2" })
}
main()


document.getElementById('loading').innerHTML = ' <div id="loading" class="loader"></div>'
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
    iconUrl: 'img/place.svg',
});

function onLocationFound(e) {

    get_latlng = [e.latlng.lng, e.latlng.lat]
    //  get_latlng = [100.602242, 13.729625]
    // get_latlng = [100.956508, 12.894307]
    // get_latlng = [105.102829, 19.635037]


    var point = turf.point(get_latlng);

    province = ''
    province_geojson.features.forEach(e => {
        var ptsWithin = turf.pointsWithinPolygon(point, e);
        if (ptsWithin.features.length > 0) {
            province = e.properties.pv_tn
        }
    });
    if (province == '') {
        province = 'กรุงเทพมหานคร'
    }

    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    $.getJSON("https://covid19.th-stat.com/api/open/today", function (data) {
        document.getElementById('update_2').innerHTML = ' <small id="update_1">ข้อมูล ณ วันที่  : ' + data.UpdateDate + ' </small>'

        document.getElementById('Confirmed').innerHTML = ' <b id="Confirmed">' + formatNumber(data.Confirmed) + '<sup><small>(+' + formatNumber(data.NewConfirmed) + ')</small>  </sup></b> '
        document.getElementById('Recovered').innerHTML = '<b id="Recovered">' + formatNumber(data.Recovered) + '<sup><small>(+' + formatNumber(data.NewRecovered) + ')</small>  </sup></b>  '
        document.getElementById('Hospitalized').innerHTML = '<b id="Hospitalized">' + formatNumber(data.Hospitalized) + '<sup><small>(+' + formatNumber(data.NewHospitalized) + ')</small>  </sup></b>'
        document.getElementById('Deaths').innerHTML = ' <b  id="Deaths">' + formatNumber(data.Deaths) + '<sup><small>(+' + formatNumber(data.NewDeaths) + ')</small>  </sup></b> '
    })


    $.getJSON("https://mapedia.co.th/demo/get_cv_province.php", function (data) {
        // console.log(data);
        // const found = data.find(e => e.province == province);
        // if (found.acc_pui == 0) {
        //     found.acc_pui = 'ไม่ทราบ'
        // }
        // document.getElementById('pro').innerHTML = '<h2 class="display-3" id="pro"> <i class="fa fa-location-arrow" aria-hidden="true"></i> ' + found.province + ' </h2>'
        // document.getElementById('sum_val').innerHTML = ' <h3 id="sum_val">ผู้ป่วยสะสม : ' + found.patient_tt + ' ราย</h3>'
        // document.getElementById('recovery').innerHTML = '  <div id="recovery">' + found.recovery + ' <br>รักษาหาย</div> '
        // document.getElementById('admission').innerHTML = ' <div id="admission">' + found.admission + ' <br>รักษาอยู่</div> '
        // document.getElementById('patient_new').innerHTML = ' <div id="patient_new">' + found.patient_new + ' <br>เพิ่มใหม่</div> '
        // document.getElementById('acc_pui').innerHTML = '  <div id="acc_pui"> ' + found.acc_pui + '<br> PUI สะสม</div> '
        // document.getElementById('death').innerHTML = '  <div id="death">' + found.death + ' <br>เสียชีวิต</div> '
        // document.getElementById('update_1').innerHTML = ' <small id="update_1">ข้อมูลตาราง ณ วันที่  : ' + found.date + ' ที่มา <a target="_blank" href="' + found.link + '">Link </a></small>'
        // Number(found.patient_tt)
        // pa_tt = Number(found.patient_tt)

        // if (pa_tt >= 200) {
        //     document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 20%, #99002e 99%)'
        //     document.getElementById("jumbotron").style.color = '#4d0017'
        // } else if (pa_tt >= 100) {
        //     document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 20%, #fe1b1b 99%)'
        //     document.getElementById("jumbotron").style.color = '#650101'
        // } else if (pa_tt >= 50) {
        //     document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 20%, #ea484b 99%)'
        //     document.getElementById("jumbotron").style.color = '#5b0b0c'
        // } else if (pa_tt >= 20) {
        //     document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 20%, #FC4E2A 99%)'
        //     document.getElementById("jumbotron").style.color = '#7e2102'
        // } else if (pa_tt > 10) {
        //     document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 15%, #FD8D3C 99%)'
        //     document.getElementById("jumbotron").style.color = '#652b01'
        // } else if (pa_tt > 5) {
        //     document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 15%, #FEB24C 99%)'
        //     document.getElementById("jumbotron").style.color = '#653a01'
        // } else {
        //     document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 15%, #33cc33 99%)'
        // }


    })
    get_chart()
    document.getElementById('loading').innerHTML = ''
}

map.on('locationfound', onLocationFound);
map.locate();

function get_chart() {

    var data_drive_sheet = []
    $.getJSON("https://spreadsheets.google.com/feeds/list/11Gx-Wc2bXb2pAcwKT4jcuLLZ0BYoCrjixo54UxX3KTw/4/public/values?alt=json", function (data) {
        data.feed.entry.forEach(e => {
            data_drive_sheet.push({
                province: e.gsx$province.$t,
                case_number: e.gsx$casenumber.$t,
            })
        });


        province_geojson.features.forEach(e => {
            for (let i = 0; i < data_drive_sheet.length; i++) {
                if (e.properties.pv_tn == data_drive_sheet[i].province) {
                    e.properties.value = data_drive_sheet[i].case_number
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


        data_drive_sheet = data_drive_sheet.sort((a, b) => (Number(a.case_number) < Number(b.case_number)) ? 1 : -1)



        var table = ''
        for (var i = 0; i < data_drive_sheet.length; i++) {
            if (data_drive_sheet[i].province == 'null') {
                data_drive_sheet[i].province = 'ไม่ระบุ'
            }
            table += '  <tr> <td>' + (i + 1) + '</td> <td>   ' + data_drive_sheet[i].province + '  </td><td>   ' + data_drive_sheet[i].case_number + '    </td> </tr> '
        }
        document.getElementById('all_sum_table').innerHTML = table
        var categories_chart1 = []
        var data_chart1 = []
        for (var i = 0; i < 20; i++) {
            if (data_drive_sheet[i].Province == 'null') {
                data_drive_sheet[i].Province = 'ไม่ระบุ'
            }
            categories_chart1.push(data_drive_sheet[i].province)
            data_chart1.push(Number(data_drive_sheet[i].case_number))
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
                color: '#b30000'
            }]
        });



        const found = data_drive_sheet.find(e => e.province == province);
        if (found.acc_pui == 0) {
            found.acc_pui = 'ไม่ทราบ'
        }
        if (found.case_number == '') {
            found.case_number = 0
        }
        document.getElementById('pro').innerHTML = '<h2 class="display-3" id="pro"> <i class="fa fa-location-arrow" aria-hidden="true"></i> ' + found.province + ' </h2>'
        document.getElementById('sum_val').innerHTML = ' <h3 id="sum_val">ผู้ป่วยสะสม : ' + found.case_number + ' ราย</h3>'
        document.getElementById('recovery').innerHTML = '  <div id="recovery"> - <br>รักษาหาย</div> '
        document.getElementById('admission').innerHTML = ' <div id="admission"> - <br>รักษาอยู่</div> '
        document.getElementById('patient_new').innerHTML = ' <div id="patient_new"> - <br>เพิ่มใหม่</div> '
        document.getElementById('acc_pui').innerHTML = '  <div id="acc_pui"> - <br> PUI สะสม</div> '
        document.getElementById('death').innerHTML = '  <div id="death"> - <br>เสียชีวิต</div> '
        document.getElementById('update_1').innerHTML = ' <small id="update_1">ข้อมูลตาราง ณ วันที่  : - ที่มา <a target="_blank" href="' + found.link + '">Link </a></small>'
        Number(found.patient_tt)
        pa_tt = Number(found.patient_tt)

        if (pa_tt >= 200) {
            document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 20%, #99002e 99%)'
            document.getElementById("jumbotron").style.color = '#4d0017'
        } else if (pa_tt >= 100) {
            document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 20%, #fe1b1b 99%)'
            document.getElementById("jumbotron").style.color = '#650101'
        } else if (pa_tt >= 50) {
            document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 20%, #ea484b 99%)'
            document.getElementById("jumbotron").style.color = '#5b0b0c'
        } else if (pa_tt >= 20) {
            document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 20%, #FC4E2A 99%)'
            document.getElementById("jumbotron").style.color = '#7e2102'
        } else if (pa_tt > 10) {
            document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 15%, #FD8D3C 99%)'
            document.getElementById("jumbotron").style.color = '#652b01'
        } else if (pa_tt > 5) {
            document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 15%, #FEB24C 99%)'
            document.getElementById("jumbotron").style.color = '#653a01'
        } else {
            document.getElementById("jumbotron").style.background = 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 15%, #33cc33 99%)'
        }


    })




    $.getJSON("https://covid19.th-stat.com/api/open/cases", function (data) {
        var res = data.Data

        document.getElementById('update_date_chart').innerHTML = '<small id="update_date_chart">ข้อมูลกราฟ ณ วันที่ : ' + data.UpdateDate + ' ที่มา: <a href="https://covid19.ddc.moph.go.th/" target="_blank"> กรมควบคุมโรค </a></small>'


        var data_chart4 = []
        res.forEach(e => {
            if (e.Province == province && e.ConfirmDate > "2021-12-02") {
                data_chart4.push(e)
            }
        });
        var group_2 = data_chart4.reduce(function (r, row) {
            r[row.ConfirmDate] = ++r[row.ConfirmDate] || 1;
            return r;
        }, {});
        this.ConfirmDate = Object.keys(group_2).map(function (key) {
            return {
                ConfirmDate: key,
                value: group_2[key]
            };
        });


        ConfirmDate = this.ConfirmDate.sort((a, b) => (a.ConfirmDate > b.ConfirmDate) ? 1 : -1)

        var labels = []
        var data_vale = []
        ConfirmDate.forEach(e => {
            var date = e.ConfirmDate.split(" ");
            labels.push([date[0]])
            data_vale.push(e.value)
        });


        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '  จำนวนผู้ป่วย',
                    data: data_vale,
                    backgroundColor: 'rgb(255, 204, 63)',
                    borderWidth: 0
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



        // var group_1 = res.reduce(function (r, row) {
        //     r[row.Province] = ++r[row.Province] || 1;
        //     return r;
        // }, {});
        // data_drive_sheet = Object.keys(group_1).map(function (key) {
        //     return {
        //         Province: key,
        //         value: group_1[key]
        //     };
        // });
        // data_drive_sheet = data_drive_sheet.sort((a, b) => (a.value < b.value) ? 1 : -1)


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
                type: 'variablepie'
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
                minPointSize: 10,
                innerSize: '20%',
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

        for (var i = 10; i < res.length; i++) {
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

}




function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 500 ? '#BD0026' :
            d > 100 ? '#E31A1C' :
                d > 50 ? '#FC4E2A' :
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
        grades = [0, 5, 10, 50, 100, 500, 1000],
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
        '<b  style="font-family: Prompt;">จังหวัด : ' + props.pv_tn + '</b><br /> <p style="font-family: Prompt;">จำนวนผู้ติดเชื้อสะสม :' + props.value + ' คน </p>' :
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



