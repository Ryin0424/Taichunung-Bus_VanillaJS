const Fblogin = document.getElementById('Fblogin');

function toggleSignIn() {
    event.preventDefault();

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
            // uid = user.uid; // 將 uid 拉到全域
            // var providerData = user.providerData;

            var userData = firebase.database().ref(uid); // 指向(建立)一個 uid變數 為名的 object
            var userArray = []; // 建立一個空陣列以儲存 所有 user 的 uid
            // console.log(userData);
            console.log(`這是登入時使用者的uid： ` + uid);

            firebase.database().ref().once('value', function (snapshot) {
                snapshot.forEach(function (items) {
                    // console.log(items.key);
                    userArray.push(items.key);
                })
                // console.log(userArray);
                // console.log(userArray.join(` `));
                // console.log(userArray.join(` `).indexOf(uid) > -1);
                if (userArray.indexOf(uid) > -1 == true) { // 若已儲存該筆 uid 資料
                    console.log(`已存在該筆 uid 資料`);
                    // 這邊要把 Firebase.database list、favorite 的資料 innerHTML
                } else {
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
            document.getElementById('now-position').innerHTML = `歡迎，${name}`;
            Fblogin.innerHTML =
                `<div class="fa fa-facebook-official" style="color: red"></div>
            <span>Facebook登出</span>`;

            /* 登入之後渲染路線(Favorite、list) */
            // function showUserList() {
                userData.child("favorite").orderByChild('route_ZH').on('value', function (snapshot) {
                    // var data = snapshot.val();
                    // console.log(data);
                    var str = "";
                    snapshot.forEach(function (i) {
                        var data = i.val();
                        str +=
                        `<li class="card" title="路線詳情">
                            <i class="fa fa-thumb-tack" title="取消最愛路線" data-key="${i.key}" data-route_zh="${data.route_ZH}" data-route_en="${data.route_EN}" data-way_zh="${data.way_ZH}" data-way_en_first="${data.way_EN_First}" data-way_en_end="${data.way_EN_End}"></i>
                            <a href="bus-way.html?Zh_tw=${data.route_ZH}&En=${data.route_EN}" class="busLink">
                                <p class="bus-way">${data.way_ZH}</p>
                                <p class="bus-num">${data.route_ZH}</p>
                            </a>
                        </li>`
                    })
                    favorite.innerHTML = str;
                })

                userData.child("list").orderByChild('route_ZH').on('value', function (snapshot) {
                    var str = '';
                    snapshot.forEach(function (i) {
                        var data = i.val();
                        str +=
                        `<li class="card" title="路線詳情">
                            <i class="fa fa-thumb-tack" title="加到最愛路線" data-key="${i.key}" data-route_zh="${data.route_ZH}" data-route_en="${data.route_EN}" data-way_zh="${data.way_ZH}" data-way_en_first="${data.way_EN_First}" data-way_en_end="${data.way_EN_End}"></i>
                            <a href="bus-way.html?Zh_tw=${data.route_ZH}&En=${data.route_EN}" class="busLink">
                                <p class="bus-way">${data.way_ZH}</p>
                                <p class="bus-num">${data.route_ZH}</p>
                            </a>
                        </li>`
                    })
                    list.innerHTML = str;

                    /* 資料庫端的搜尋功能 */
                    search.addEventListener('input', searchBusDatabase, false);
                    function searchBusDatabase(){
                        var searchVu = search.value;
                        var databaseAry = [];

                        snapshot.forEach(function (items) {
                            var dataBaseList = {
                                "key": items.key,
                                "route_ZH": items.val().route_ZH,
                                "route_EN": items.val().route_EN,
                                "way_ZH": items.val().way_ZH,
                                "way_EN_Firtst": items.val().way_EN_Firtst,
                                "way_EN_End": items.val().way_EN_End,
                            }
                            databaseAry.push(dataBaseList);
                        })
                        // console.log(databaseAry);

                        function filterItems(searchVu) {
                            return databaseAry.filter(function (i) {
                                return i.route_ZH.indexOf(searchVu.toUpperCase()) == 0;
                            })
                        }
                        // console.log(filterItems(searchVu));

                        function updatedList(items) { // 重新渲染路線結果
                            var str = '';
                            for (var i = 0; i < items.length; i++) {
                                // console.log(items[i].key);
                                str +=
                                `<li class="card" title="路線詳情">
                                    <i class="fa fa-thumb-tack" title="加到最愛路線" data-key="${items[i].key}" data-route_zh="${items[i].route_ZH}" data-route_en="${items[i].route_EN}" data-way_zh="${items[i].way_ZH}" data-way_en_first="${items[i].way_EN_First}" data-way_en_end="${items[i].way_EN_End}"></i>
                                    <a href="bus-way.html?Zh_tw=${items[i].route_ZH}&En=${items[i].route_EN}" class="busLink">
                                        <p class="bus-way">${items[i].way_ZH}</p>
                                        <p class="bus-num">${items[i].route_ZH}</p>
                                    </a>
                                </li>`    
                            }
                            list.innerHTML = str;
                        }
                        updatedList(filterItems(searchVu));
                    }
                })
            // }
            // showUserList();

            /* 增加、刪除最愛路線 */
            // function toggleFavorite() {
                list.addEventListener('click', function (e) {
                    if (e.target.nodeName = "I") {
                        var key = e.target.dataset.key; // dataset 讀取 data 中的項目，這邊讀取的我們設定的 data-key
                        var route_zh = e.target.dataset.route_zh;
                        var route_en = e.target.dataset.route_en;
                        var way_en_first = e.target.dataset.way_en_first;
                        var way_en_end = e.target.dataset.way_en_end;
                        var way_zh = e.target.dataset.way_zh;

                        userData.child("favorite").push({ // 推送資料到 Firebase database
                            "route_ZH": route_zh,
                            "route_EN": route_en,
                            "way_ZH": way_zh,
                            "way_EN_First": way_en_first,
                            "way_EN_End": way_en_end
                        })
                        console.log(`List：成功加入 #favorite 資料！`);
                        userData.child("list").child(key).remove();
                        console.log(`List：成功刪除 #list 資料！`);
                    }
                })
                favorite.addEventListener('click', function (e) {
                    if (e.target.nodeName = "I") {
                        var key = e.target.dataset.key; // dataset 讀取 data 中的項目，這邊讀取的我們設定的 data-key
                        var route_zh = e.target.dataset.route_zh;
                        var route_en = e.target.dataset.route_en;
                        var way_en_first = e.target.dataset.way_en_first;
                        var way_en_end = e.target.dataset.way_en_end;
                        var way_zh = e.target.dataset.way_zh;

                        userData.child("list").push({ // 將資料加回到 #list
                            "route_ZH": route_zh,
                            "route_EN": route_en,
                            "way_ZH": way_zh,
                            "way_EN_First": way_en_first,
                            "way_EN_End": way_en_end
                        })
                        console.log(`Favorite：成功加入 #list 資料！`);
                        userData.child("favorite").child(key).remove(); // 將 #favorite 中的資料刪掉
                        console.log(`Favorite：成功刪除 #favorite 資料！`);
                    }
                })
            // }
            // toggleFavorite();

        } else { /* 登出時候的狀態 */
            // console.log(userData);
            console.log(`這是登出時使用者的uid： ` + uid);
            document.getElementById('now-position').innerHTML = `　`;
            Fblogin.innerHTML =
                `<div class="fa fa-facebook-official"></div>
            <span>Facebook登入</span>`;
            list.innerHTML = OriginalList;
            favorite.innerHTML = '';
            
            if (uid == undefined){
                list.addEventListener('click', function (e) {
                        if (e.target.nodeName = "I") {
                            console.log(`請先登入以使用"加入最愛"功能唷 =D`);
                        }
                })
            }
            

            search.addEventListener('input', searchBusLocal, false); //input屬性 = 使用者每次操作都跑一次 function
        }
    });
    Fblogin.addEventListener('click', toggleSignIn, false);
}