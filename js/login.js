const Fblogin = document.getElementById('Fblogin');

function toggleSignIn () {
    event.preventDefault();
    // console.log('Hola');
    
    // 登入開始
    if (!firebase.auth().currentUser) {
        const provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('email');
        firebase.auth().signInWithPopup(provider).then(function (result) {
            // 登入成功後設立使用者資料(token)
            let token = result.credential.accessToken;
            let user = result.user;

        }).catch(function (error) { // 處理錯誤 
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            // 若一組帳戶同時使用兩種以上的登入模式
            if (errorCode === 'auth/account-exists-with-different-credential') {
                alert('You have already signed up with a different auth provider for that email.');
            } else {
                console.error(error);
            }
        });
    } else { // 登出功能
        firebase.auth().signOut();
    }
    // Fblogin.disabled = true;
}

function initApp() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // 若使用者已登入
            let name = user.displayName; // 記錄使用者信名資料
            var email = user.email;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            
            var userData = firebase.database().ref(uid); // 指向(建立)一個 uid變數 為名的 object

            // console.log(`這是登入時使用者的uid：  `+uid);

            firebase.database().ref().once('value', function (snapshot) {
                if ( snapshot.val() == null){ // 若資料庫內還沒有資料，先推送一次資料進去
                    for (i in data) {
                        userData.child("list").push({ // 推送資料到 Firebase database
                            "route_ZH": data[i].SubRoutes[0].SubRouteName.Zh_tw,
                            "route_EN": data[i].SubRoutes[0].SubRouteName.En,
                            "way_ZH": data[i].SubRoutes[0].Headsign,
                            "way_EN_First": data[i].DepartureStopNameEn,
                            "way_EN_End": data[i].DestinationStopNameEn
                        })
                    }
                }else{ // 若資料庫內已有 uid 資料
                    snapshot.forEach(function(items){
                        console.log(items.key);
                        if (uid == items.key) { // 已有該筆 uid 的資料
                            console.log(`已存在該筆 uid 資料`);
                            // 這邊要把 Firebase.database list、favorite 的資料 innerHTML
                        } else { // 若還沒有該筆 uid 的資料，再 push 一份上去
                            console.log(`推送資料`);
                            for (i in data) {
                                userData.child("list").push({ // 推送資料到 Firebase database
                                    "route_ZH": data[i].SubRoutes[0].SubRouteName.Zh_tw,
                                    "route_EN": data[i].SubRoutes[0].SubRouteName.En,
                                    "way_ZH": data[i].SubRoutes[0].Headsign,
                                    "way_EN_First": data[i].DepartureStopNameEn,
                                    "way_EN_End": data[i].DestinationStopNameEn
                                })
                            }
                        }
                    })
                }
            })
        
            document.getElementById('now-position').innerHTML = `歡迎，${name}`;
            Fblogin.innerHTML = 
            `<div class="fa fa-facebook-official" style="color: red"></div>
            <span>Facebook登出</span>`;
        } else {

            console.log(userData);
            console.log(`這是登出時使用者的uid  ` + uid);

            document.getElementById('now-position').innerHTML = `　`;
            Fblogin.innerHTML = 
            `<div class="fa fa-facebook-official"></div>
            <span>Facebook登入</span>`;
        }
        // document.getElementById('quickstart-sign-in').disabled = false;
    });
    Fblogin.addEventListener('click', toggleSignIn, false);
}
