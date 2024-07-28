var data = ''; // 儲存 xhr 拉回來的 json 資料
const list = document.getElementById('list');
const favorite = document.getElementById('favorite');
let OriginalList = ""; // 儲存第一次 Request 時拉回來跑完 for 迴圈的表單 (原始表單)

const xhr = new XMLHttpRequest();
xhr.open('get','https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Taichung?$top=300&$format=JSON');//
xhr.send(null);
xhr.onload = function () {
    data = JSON.parse(xhr.responseText);
    function showBusWay(items) {
        // console.log(items);
        // var str = '';
        for (var i = 0; i < items.length; i++){
            OriginalList += 
            `<li class="card" title="路線詳情">
                <i class="fa fa-thumb-tack" title="加到最愛路線"></i>
                <a href="bus-way.html?Zh_tw=${items[i].SubRoutes[0].SubRouteName.Zh_tw}&En=${items[i].SubRoutes[0].SubRouteName.En}" class="busLink">
                    <p class="bus-way">${ items[i].SubRoutes[0].Headsign }</p>
                    <p class="bus-num">${ items[i].SubRoutes[0].SubRouteName.Zh_tw}</p>
                </a>
            </li>`
        }
        list.innerHTML = OriginalList;
    }
    showBusWay(data);
}       
// console.log(data);

/* 搜尋功能 */ 
var search = document.querySelector('.search');
search.addEventListener('input',searchBus,false); //input屬性 = 使用者每次操作都跑一次 function

function searchBus() {
    var searchVu = search.value; // searchVu 為使用者輸入的路線號
    // console.log(searchVu);

    function filterItems(searchVu) {
        return data.filter(function (i) {
            return i.SubRoutes[0].SubRouteName.Zh_tw.indexOf(searchVu.toUpperCase()) == 0;
            // 撈出開頭符合使用者搜尋的資料
            // .toUpperCase() 強制轉大寫
        })
    }
    // console.log(filterItems(searchVu));

    function updatedList(items) { // 重新渲染路線結果
        var str = '';
        for (var i = 0; i < items.length; i++) {
            str +=
            `<li class="card" title="路線詳情">
                <i class="fa fa-thumb-tack" title="加到最愛路線"></i>
                <a href="bus-way.html?Zh_tw=${items[i].SubRoutes[0].SubRouteName.Zh_tw}&En=${items[i].SubRoutes[0].SubRouteName.En}" class="busLink">
                    <p class="bus-way">${ items[i].SubRoutes[0].Headsign }</p>
                    <p class="bus-num">${ items[i].SubRoutes[0].SubRouteName.Zh_tw}</p>
                </a>
            </li>`
        }
        list.innerHTML = str;
    }
    updatedList(filterItems(searchVu));
}

