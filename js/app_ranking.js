// async function getUserProfile() {
//     profile = await liff.getProfile()
//     pictureUrl = profile.pictureUrl
//     userId = profile.userId
//     displayName = profile.displayName
//     decodedIDToken = liff.getDecodedIDToken().email
//     if (pictureUrl == undefined) {
//         pictureUrl = ''
//     }
//     document.getElementById('displayname').innerHTML = '<h5 id="displayname">' + displayName + '</h5>'
//     document.getElementById('img_profile').innerHTML = '<img id="img_profile" class="profile_img" src="' + pictureUrl + '" alt="">'

//     $.ajax({
//         url: 'https://mapedia.co.th/demo/add_tracking.php?type=login',
//         method: 'post',
//         data: ({
//             pictureUrl: pictureUrl,
//             userId: userId,
//             displayName: displayName,
//             page_view: 'map_dashboard.html'
//         }),
//         success: function (data) {
//         }
//     })
// }
// async function main() {
//     liff.ready.then(() => {
//         if (liff.isLoggedIn()) {
//             getUserProfile()
//         } else {
//             liff.login()
//         }
//     })
//     await liff.init({ liffId: "1653981898-EK590Od2" })
// }
// main()


document.getElementById('loading').innerHTML = ' <div id="loading" class="loader"></div>'


function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

$.getJSON("https://mapedia.co.th/demo/get_cv_province.php", function (data) {
    console.log(data);
    //  const found = data.find(e => e.province == province);

    document.getElementById('pro').innerHTML = '<h2 class="display-3" id="pro"> <i class="fa fa-location-arrow" aria-hidden="true"></i> ' + found.province + ' </h2>'
    document.getElementById('sum_val').innerHTML = ' <h3 id="sum_val">ผู้ป่วยสะสม : ' + found.patient_tt + ' ราย</h3>'
    document.getElementById('recovery').innerHTML = '  <div id="recovery">' + found.recovery + ' <br>รักษาหาย</div> '
    document.getElementById('admission').innerHTML = ' <div id="admission">' + found.admission + ' <br>รักษาอยู่</div> '
    document.getElementById('patient_new').innerHTML = ' <div id="patient_new">' + found.patient_new + ' <br>เพิ่มใหม่</div> '
    document.getElementById('acc_pui').innerHTML = '  <div id="acc_pui"> ' + found.acc_pui + '<br> PUI สะสม</div> '
    document.getElementById('death').innerHTML = '  <div id="death">' + found.death + ' <br>เสียชีวิต</div> '
    document.getElementById('update_1').innerHTML = ' <small id="update_1">ข้อมูลตาราง ณ วันที่  : ' + found.date + ' ที่มา <a target="_blank" href="' + found.link + '">Link </a></small>'
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
document.getElementById('loading').innerHTML = ''


