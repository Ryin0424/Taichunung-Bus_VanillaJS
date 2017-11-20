var data = ''; // 儲存 xhr 拉回來的 json 資料
var list = document.getElementById('list');


const xhr = new XMLHttpRequest();
xhr.open('get','https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/Taichung?$top=300&$format=JSON');//
xhr.send(null);
xhr.onload = function () {
    data = JSON.parse(xhr.responseText);
    function showBusWay(items) {
        // console.log(items);
        var str = '';
        for (var i = 0; i < items.length; i++){
            str += 
            `<li class="card" title="路線詳情">
                <a href="bus-way.html?Zh_tw=${items[i].SubRoutes[0].SubRouteName.Zh_tw}" class="busLink">
                    <p class="bus-way">${ items[i].SubRoutes[0].Headsign }</p>
                    <p class="bus-num">${ items[i].SubRoutes[0].SubRouteName.Zh_tw}</p>
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
search.addEventListener('input',searchBus,false); //input屬性 = 使用者每次操作都跑一次 function

function searchBus() {
    var searchVu = search.value; // searchVu 為使用者輸入的路線號
    // console.log(searchVu);

    // for (var i = 0; i < data.length; i++) {
    //     var busNum = data[i].SubRoutes[0].SubRouteName.Zh_tw;
    //     if (searchVu == busNum){
    //         console.log(busNum);
    //     }
    // }
    function filterItems(searchVu) {
        return data.filter(function (i) {
            return i.SubRoutes[0].SubRouteName.Zh_tw.indexOf(searchVu.toUpperCase()) == 0;
            // 撈出開頭符合使用者搜尋的資料
            // .toUpperCase() 強制轉大寫
        })
    }
    console.log(filterItems(searchVu));

    function updatedList(items) { // 重新渲染路線結果
        var str = '';
        for (var i = 0; i < items.length; i++) {
            str +=
            `<li class="card" title="路線詳情">
                <a href="bus-way.html?Zh_tw=${items[i].SubRoutes[0].SubRouteName.Zh_tw}" class="busLink">
                    <p class="bus-way">${ items[i].SubRoutes[0].Headsign}</p>
                    <p class="bus-num">${ items[i].SubRoutes[0].SubRouteName.Zh_tw}</p>
                </a>
            </li>`
        }
        list.innerHTML = str;
    }
    updatedList(filterItems(searchVu));
}