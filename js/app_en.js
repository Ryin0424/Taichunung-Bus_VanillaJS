var data = '';
var list = document.getElementById('list');


const xhr = new XMLHttpRequest();
xhr.open('get','https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Taichung?$top=300&$format=JSON');//
xhr.send(null);
xhr.onload = function () {
    data = JSON.parse(xhr.responseText);
    function showBusWay(items) {
        var str = '';
        for (var i = 0; i < items.length; i++){
            str += 
            `<li class="card" title="Detailed">
                <a href="bus-way_en.html?Zh_tw=${items[i].SubRoutes[0].SubRouteName.Zh_tw}&En=${items[i].SubRoutes[0].SubRouteName.En}" class="busLink">
                    <p class="bus-way">${ items[i].DepartureStopNameEn} - ${items[i].DestinationStopNameEn}</p>
                    <p class="bus-num">${ items[i].SubRoutes[0].SubRouteName.En}</p>
                </a>
            </li>`
        }
        list.innerHTML = str;
    }
    showBusWay(data);
}       
// console.log(data);

/* 搜尋功能 */ 
var search = document.querySelector('.search');
search.addEventListener('input',searchBus,false);

function searchBus() {
    var searchVu = search.value; // searchVu 為使用者輸入的路線號

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
            `<li class="card" title="Detailed">
                <a href="bus-way_en.html?Zh_tw=${items[i].SubRoutes[0].SubRouteName.Zh_tw}&En=${items[i].SubRoutes[0].SubRouteName.En}" class="busLink">
                    <p class="bus-way">${ items[i].DepartureStopNameEn}-${items[i].DestinationStopNameEn}</p>
                    <p class="bus-num">${ items[i].SubRoutes[0].SubRouteName.En}</p>
                </a>
            </li>`
        }
        list.innerHTML = str;
    }
    updatedList(filterItems(searchVu));
}