var goData = '';
var backData = '';

var goBtn = document.getElementById('go');
var backBtn = document.getElementById('back');
var busList = document.getElementById('bus-way-list');

goBtn.addEventListener('click', getGoJson, false);
backBtn.addEventListener('click', getBackJson, false);

var helper = {
    getParameterByName: function (name, url) {
        var regex, results;
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, '\\$&');
        regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i');
        results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
};
let roadLine = helper.getParameterByName("Zh_tw"); //取得 路線中文名稱
// console.log(roadLine);
var GoUrl = `https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/Taichung?$filter=RouteName%2FZh_tw%20eq%20%27${roadLine}%27%20and%20Direction%20eq%20%270%27&$orderby=StopSequence%20asc&$top=100&$format=JSON`;
// console.log(GoUrl);
var BackUrl = `https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/Taichung?$filter=RouteName%2FZh_tw%20eq%20%27${roadLine}%27%20and%20Direction%20eq%20%271%27&$orderby=StopSequence%20asc&$top=100&$format=JSON`;

var address = document.getElementById('now-position'); //為了渲染成路線號
address.innerHTML = roadLine + ` 號公車路線`;
var updata; //記錄要渲染的路線資料

// 取得當前搜尋網址
toolBox = document.getElementById('toolBox');
toolBox.innerHTML =
    `<div class="container">
        <a href="#" title="Facebook 登入以使用最愛路線功能" class="fb-btn">
            <div class="fa fa-facebook-official"></div>
            <span>Facebook登入</span>
        </a>
        <a href="index.html" title="回到路線查詢頁面" class="return-btn">
            <div class="fa fa-undo"></div>
            <span>返回查詢頁面</span>
        </a>
        <a href="bus-way.html${ location.search}" title="切換繁中介面" class="Zh-btn">
            <div style="font-size:28px;font-weight:900;font-family:Microsoft JhengHei;" class="fa">繁</div>
            <span>繁體中文模式</span>
        </a>
        <a href="bus-way_en.html${ location.search}" title="Trans to English mode" class="En-btn">
            <div style="margin-right:4px;font-weight:900;font-family:monospace;" class="fa">E</div>
            <span>English Mode</span>
         </a>
    </div>`


/* 判斷去程回程 */
var check = 'go';

function checkWay() {
    if (check == "go"){
        getGoJson();
    }
    else{
        getBackJson();
    }
    
}
checkWay();

/* 首次執行，先渲染出 去程回程路線選擇按鈕 */
// function choseBtn(){
//     var xhr = new XMLHttpRequest();
//     xhr.open('get', GoUrl);
//     xhr.send(null);
//     xhr.onload = function () {
//             goData = JSON.parse(xhr.responseText);
//             const len = goData.length;
//             for (var i = 0; i < len; i++) {
//                 goBtn.innerHTML = `往 ${goData[len - 1].StopName.Zh_tw}`;
//                 backBtn.innerHTML = `往 ${goData[0].StopName.Zh_tw}`;
//             }
//         }
// }
// choseBtn();

/* 去程資料 */
function getGoJson(){
    clearInterval(getBackJson); // 讓畫面不會渲染出 回程路線
    check = "go";

    var xhr = new XMLHttpRequest();
    xhr.open('get', GoUrl);
    xhr.send(null);
    xhr.onload = function () {
        goData = JSON.parse(xhr.responseText);
        // console.log(goData);

        update = function (items) {
            var str = '';
            const len = items.length;
            for (var i = 0; i < len; i++) {
                goBtn.innerHTML = `往 ${items[len - 1].StopName.Zh_tw}`;
                backBtn.innerHTML = `往 ${items[0].StopName.Zh_tw}`;

                const Time = Math.floor(items[i].EstimateTime / 60); //將到站時間換算成分鐘
                if (items[i].EstimateTime == undefined) { //暫無公車靠近，顯示 過站
                    str +=
                        `<li class="bus-state">
                            <div class="station over">
                                <div class="time">過站</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.Zh_tw}</div>
                        </li>`
                } else if (items[i].EstimateTime < 0){ //末班駛離
                    str +=
                        `<li class="bus-state">
                            <div class="station stop">
                                <div class="time">末班駛離</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.Zh_tw}</div>
                        </li>`
                } else if (items[i].EstimateTime == 0) { //進站中
                    str +=
                        `<li class="bus-state">
                            <div class="station arrive">
                                <div class="time">進站中</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.Zh_tw}</div>
                            <div class="bus"> <i class="fa fa-bus"></i><span>${items[i].PlateNumb}</span></div>
                        </li>`
                } else if (items[i].EstimateTime == 60) { //剩餘一分
                    str +=
                        `<li class="bus-state">
                            <div class="station arrive">
                                <div class="time">${Time}分</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.Zh_tw}</div>
                            <div class="bus"> <i class="fa fa-bus"></i><span>${items[i].PlateNumb}</span></div>
                        </li>`
                } else if (items[i].EstimateTime) { //顯示多久到站
                    str +=
                        `<li class="bus-state">
                            <div class="station">
                                <div class="time">${Time}分</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.Zh_tw}</div>
                        </li>`
                }
                busList.innerHTML = str;
            }
            // console.log(1);
        }
        update(goData);
    }
    // setInterval(getGoJson, 30000);
}


/* 回程資料 */
function getBackJson() {
    clearInterval(getGoJson); // 讓畫面不會渲染出 去程路線
    check = "back";
    
    var xhr = new XMLHttpRequest();
    xhr.open('get', BackUrl);
    xhr.send(null);
    xhr.onload = function () {
        backData = JSON.parse(xhr.responseText);

        update = function (items) {
            var str = '';
            const len = items.length;
            for (var i = 0; i < len; i++) {

                const Time = Math.floor(items[i].EstimateTime / 60); //將到站時間換算成分鐘
                if (items[i].EstimateTime == undefined) { //暫無公車靠近，顯示 過站
                    str +=
                        `<li class="bus-state">
                            <div class="station over">
                                <div class="time">過站</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.Zh_tw}</div>
                        </li>`
                } else if (items[i].EstimateTime < 0) { //末班駛離
                    str +=
                        `<li class="bus-state">
                            <div class="station stop">
                                <div class="time">末班駛離</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.Zh_tw}</div>
                        </li>`
                } else if (items[i].EstimateTime == 0) { //進站中
                    str +=
                        `<li class="bus-state">
                            <div class="station arrive">
                                <div class="time">進站中</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.Zh_tw}</div>
                            <div class="bus"> <i class="fa fa-bus"></i><span>${items[i].PlateNumb}</span></div>
                        </li>`
                } else if (items[i].EstimateTime == 60) { //剩餘一分
                    str +=
                        `<li class="bus-state">
                            <div class="station arrive">
                                <div class="time"> ${Time}分 </div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.Zh_tw}</div>
                            <div class="bus"> <i class="fa fa-bus"></i><span>${items[i].PlateNumb}</span></div>
                        </li>`
                } else if (items[i].EstimateTime) { //顯示多久到站
                    str +=
                        `<li class="bus-state">
                            <div class="station">
                                <div class="time">${Time}分</div>
                            </div>
                            <div class="way"></div>
                            <div class="sta-name">${items[i].StopName.Zh_tw}</div>
                        </li>`
                }
                busList.innerHTML = str;
            }
        }
        update(backData);
    }
    // setInterval(getBackJson, 30000);
}

setInterval(checkWay, 30000);

