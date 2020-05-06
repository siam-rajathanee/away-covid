
// async function getUserProfile() {
//     profile = await liff.getProfile()
//     pictureUrl = profile.pictureUrl
//     userId = profile.userId
//     displayName = profile.displayName
//     if (pictureUrl == undefined) {
//         pictureUrl = ''
//     }
//     $.ajax({
//         url: 'https://mapedia.co.th/demo/add_tracking.php?type=login',
//         method: 'post',
//         data: ({
//             pictureUrl: pictureUrl,
//             userId: userId,
//             displayName: displayName,
//             page_view: 'view_tracking.html'
//         }),
//         success: function (data) { }
//     })

//     init_map()
// }
// async function main() {
//     liff.ready.then(() => {
//         if (liff.isLoggedIn()) {
//             getUserProfile()
//         } else {
//             liff.login()
//         }
//     })
//     await liff.init({
//         liffId: "1653981898-Xak2roza"
//     })
// }
// main()



userId = 'Uac75c4babcd74ff01cc3faa0efa2a4b2'
displayName = 'TEERAYOOT'
init_map()

function init_map() {

    var mymap = L.map('mapid', {
        attributionControl: false
    }).setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(mymap);


    var case_place_announce = L.icon({
        iconUrl: 'img/place.svg',
        iconSize: [50, 50], // size of the icon
    });


    $.getJSON("https://mapedia.co.th/demo/view_tracking.php?type=json_user&userid=" + userId,
        function (data_user) {
            json_user = data_user
            var p_t_l = [
                [
                    Number(json_user.features[0].properties.lng),
                    Number(json_user.features[0].properties.lat)
                ],
                [
                    Number(json_user.features[0].properties.lng),
                    Number(json_user.features[0].properties.lat)
                ]
            ]
            for (var i = 0; i < json_user.features.length; i++) {
                p_t_l.push(
                    [
                        Number(json_user.features[i].properties.lng),
                        Number(json_user.features[i].properties.lat)
                    ]
                )
            }
            var line = turf.lineString(p_t_l);
            view_line = L.geoJson(line).addTo(mymap)
            mymap.fitBounds(view_line.getBounds())
            $.getJSON("https://mapedia.co.th/demo/view_tracking.php?type=json_pui",
                async function (data_pui) {
                    json_pui = data_pui


                    let json_check = []
                    json_pui.features.forEach(e => {
                        var d2 = new Date(e.properties.date_pui),
                            month2 = '' + (d2.getMonth() + 1),
                            day2 = '' + d2.getDate() - 14,
                            year2 = d2.getFullYear();
                        if (month2.length < 2)
                            month2 = '0' + month2;
                        if (day2.length < 2)
                            day2 = '0' + day2;
                        let date_pui = [year2, month2, day2].join('-');


                        let date_json = e.properties.date_view
                        var d = new Date(date_json),
                            month = '' + (d.getMonth() + 1),
                            day = '' + d.getDate(),
                            year = d.getFullYear();
                        if (month.length < 2)
                            month = '0' + month;
                        if (day.length < 2)
                            day = '0' + day;
                        let date_view = [year, month, day].join('-');



                        var buffered_pui = turf.buffer(e, 0.1, { units: 'kilometers' });
                        var ptsWithin = turf.pointsWithinPolygon(json_user, buffered_pui);

                        ptsWithin.features.forEach(element => {
                            let date_within = element.properties.date_view
                            var d = new Date(date_within),
                                month = '' + (d.getMonth() + 1),
                                day = '' + d.getDate(),
                                year = d.getFullYear();
                            if (month.length < 2)
                                month = '0' + month;
                            if (day.length < 2)
                                day = '0' + day;
                            let date_target = [year, month, day].join('-');


                            if (date_view == date_target && date_target > date_pui) {
                                json_check.push(element)
                            }

                        });
                    });

                    let json_comfirm = []
                    for (let i = 0; i < json_check.length; i++) {
                        var lat = json_check[i].properties.lat
                        var lon = json_check[i].properties.lng



                        if (i < 1) {
                            await $.getJSON('https://locationiq.org/v1/reverse.php?key=06e95f2c5c85dd&lat=' + lat + '&lon=' + lon + '&format=json',
                                function (data_pui) {
                                    json_check[i].properties.display_name = data_pui.display_name
                                })
                            json_comfirm.push(json_check[i])
                        } else {

                            var distance = turf.distance(json_check[i], json_check[i - 1], { units: 'kilometers' });
                            if (distance > 0.1) {
                                await $.getJSON('https://locationiq.org/v1/reverse.php?key=06e95f2c5c85dd&lat=' + lat + '&lon=' + lon + '&format=json',
                                    function (data_pui) {
                                        json_check[i].properties.display_name = data_pui.display_name
                                    })
                                json_comfirm.push(json_check[i])
                            }
                        }
                    }




                    let list_data = ''
                    json_comfirm.forEach(e => {
                        list_data += '<li> <a class="float-right">วันที่ ' + e.properties.date_view + '</a> <p>' + e.properties.display_name + ' </p> <small> ละติจูด : ' + Number(e.properties.lat).toFixed(4) + ' ลองจิจูด : ' + Number(e.properties.lng).toFixed(4) + '</small> </li>'
                    });
                    document.getElementById('list_data').innerHTML = list_data

                    view_line = L.geoJson(json_comfirm, {
                        pointToLayer: function (f, latlng) {
                            return L.marker(latlng, {
                                icon: case_place_announce,
                                opacity: 1
                            }).bindPopup('จุดเสี่ยง เมื่อวันที่ : ' + f.properties.date_view)
                        }
                    }).addTo(mymap)
                })
        })
}




    //https://locationiq.org/v1/reverse.php?key=06e95f2c5c85dd&lat=' + lat + '&lon=' + lon + '&format=json


