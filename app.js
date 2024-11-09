const $=document;
const input_haed=$.getElementById('input_head');
const dateElm=$.querySelector('.date');
const timeElm=$.querySelector('.right_time');
const iconLarg=$.querySelector('.icon_weather');
const todyElm=$.querySelector('.right_today');
const listWeatherDay=$.querySelector('.list_weather_day');
const listWeatherTime=$.querySelector('.list_weather_time');
const humidity=$.querySelector('.humidity');
const temp=$.querySelector('.temp');
const temp_down=$.querySelector('.temp_down');
const temp_up=$.querySelector('.temp_up');
const visibility=$.querySelector('.visibility');
const listha = document.querySelectorAll('.list');

let  interval, rezaltWeather, allBoxDay, allBoxHour, partdat, conter_id=0, time2=0, codamin_box_day=0 , imgwrongVaz=false, hour_now_exitly;

const fanc_err = function (vaz1 ,vaz2 ,vaz3){
    $.querySelector('.right_info').style.display=vaz1;
    listWeatherDay.style.display=vaz1;
    listWeatherTime.style.display=vaz1;
    $.querySelector('.p_div_wron').style.display=vaz2;
    dateElm.style.display=vaz1;
    timeElm.style.display=vaz1;
    todyElm.style.display=vaz1;
    imgwrongVaz=vaz3;
}
function apitime(timzoon){
    return new Promise ((rezalt,err)=>{
        fetch(`https://api.api-ninjas.com/v1/worldtime?timezone=${timzoon}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': '7fkjNSBkJobwrk9HT9IOyA==tfC6fRmje8J7iTsV' ,
            }
        })
        .then(response => {
            if (!response.ok)
                alert('api time trobbl')
            else
                return response.json();
        })
        .then(data => {
           rezalt(data)
        })
        .catch(error => {
           fanc_err('none','block',true)});
    })
}
// first loction 
// const  api_loaciton='http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone';
function set_coordinates(array_coordinate){
    return (`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${array_coordinate[0]},${array_coordinate[1]}?unitGroup=metric&key=9G6P5A47C66PNNK6ADKAGMFYP&contentType=json`)
}
function set_nameCity(city){
   return (`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=9G6P5A47C66PNNK6ADKAGMFYP&contentType=json`);
}
// for name city 
function setOpenweahterNamecity(lat,lon){
    return (`https://api.weatherapi.com/v1/current.json?key=dc2d45e79a024150ad0200142240511&q=${lat},${lon}&aqi=no`);
}
// function setOpenweahterNamecity(lat,lon){
//     return (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f0894defae7c5584798f8812232a40c2`);
// }
// fetch 
async function respanse_api(url) {
    try {
        const response = await fetch(url);
        if (!response.ok)  fanc_err('none','block',true);
        else{
            imgwrongVaz==true? fanc_err('flex','none',false):false;
            return(await response.json());
        } 
    } catch (error) {
        fanc_err('none','block',true)}
}
function set_icon_weather (icon ,kind){
    let vaz;
    kind=='dynamic'? vaz='icons_dynamic/':vaz='icons_static/';
    switch (icon){
      case "clear-night":
        return `${vaz}night.svg`;
      case "clear-day":
        return `${vaz}day.svg`;
      case "cloudy":
        return `${vaz}cloudy.svg`;
      case "partly-cloudy-night":
        return `${vaz}cloudy-night.svg`;
      case "partly-cloudy-day":
        return `${vaz}cloudy-day.svg`;
      case "rain":
         return `${vaz}rainy.svg`;
      case "snow":
        return `${vaz}snow.svg`;
      case "fog":
        return `${vaz}fog.png`;
      case "wind":
        return `${vaz}wind.svg`;
    }
  }
// --------------------------------------------------------------------------------------------------------
function placement(weather,status=true){
    iconLarg.src=set_icon_weather(weather.currentConditions.icon,'dynamic');
    temp.textContent=(`${Math.round(weather.currentConditions.temp)}°C`);
    temp_down.textContent=(`${Math.round(weather.days[0].tempmin)}°C`);
    temp_up.textContent=(`${Math.round(weather.days[0].tempmax)}°C`);
    humidity.textContent=(`${(weather.currentConditions.humidity)}%`);
    visibility.textContent=(`${weather.currentConditions.visibility}km`);
    if(status){
        listWeatherDay.innerHTML='';
        listWeatherTime.innerHTML='';
        tanzemCreateHourBox(weather.days[0].hours , hour_now_exitly);
        createDayBox(weather.days);
        remove_add_back_blue(allBoxDay[0],allBoxDay);
        remove_add_back_blue(allBoxHour[0],allBoxHour)
        rest_boxha();
    }
}
// timezoon give me -- set inter vall hour head
 function send_api_for_time(timezoon){
    clearInterval(interval);
    (apitime(timezoon)).then(res=>{
        todyElm.textContent=res.day_of_week;
        dateElm.textContent=res.date;
        tanzem_time(res.hour,res.minute,res.second);
        hour_now_exitly=res.hour;
        placement(rezaltWeather);
    })
}
function tanzem_time(hour,minute,second){
    let h= Number(hour) 
    let m = Number(minute); 
    let s = Number(second); 
    function padZero(num) {
        return num < 10 ? '0' + num : num;
    }
    function startTimer(h, m, s) {
        let totalSeconds = h * 3600 + m * 60 + s;
        interval=setInterval(() => {
            totalSeconds++;
            timeElm.textContent=(`${padZero(Math.floor(totalSeconds / 3600) % 24)}:${padZero(Math.floor((totalSeconds % 3600) / 60))}`);
        }, 1000);
    }
    startTimer(h,m,s);
}
// createDayBox 
function createDayBox(days){
    days.forEach((iteam,index)=> {
        partdat=(iteam.datetime).split('-')
        listWeatherDay.insertAdjacentHTML("beforeend",`
            <div class="p_iteam_day" onclick="wich_clicked_day(this)">
                <span class="id_day">${conter_id++}</span>
                <p class="iteam_day">${partdat[1]}-${partdat[2]}</p>
                <img src="${set_icon_weather(iteam.icon ,'static')}" alt="icon" class="iteam_img_day" draggable="false">
                <p class="iteam_temperature_day">${Math.round(iteam.temp)}°C</p>
            </div>`)
    });
    allBoxDay=$.querySelectorAll('.p_iteam_day');
    conter_id=0;
}
// createhourBox
function createeHourBox(iteam,partdat){
    listWeatherTime.insertAdjacentHTML("beforeend",`
    <div class="p_iteam_time" onclick="wich_clicked_hour(this)">
        <span class="id_time">${conter_id ++}</span>
        <p class="iteam_time">${partdat[0]}:00 </p>
        <img src="${set_icon_weather(iteam.icon ,'static')}" alt="icon" class="iteam_img_time" draggable="false">
        <p class="iteam_temperature_time">${Math.round(iteam.temp)}°C</p>
    </div>`);
}
// tanzem tadad box hour 
function tanzemCreateHourBox(hours,timenow ,vaz=false){
    if(vaz){
        hours.forEach((iteam)=>{
        partdat=(iteam.datetime).split(':');
        createeHourBox(iteam,partdat);
    })}
    else{
        let status=false;
        for (let i=Number(timenow); i < 24; i++) {
            partdat=hours[i].datetime.split(':')
            if(!status){
                conter_id=i+1;
                status=true;
                listWeatherTime.insertAdjacentHTML("beforeend",`
                    <div class="p_iteam_time" onclick="func_clied_now_hour(this)">
                        <p class="iteam_time">now</p>
                        <img src="${set_icon_weather(rezaltWeather.currentConditions.icon ,'static')}" alt="icon" class="iteam_img_time" draggable="false">
                        <p class="iteam_temperature_time">${Math.round(rezaltWeather.currentConditions.temp)}°C</p>
                    </div>`);
                    continue;
            }
            createeHourBox(hours[i] ,partdat);
        
        }
        for(let i=0 ; i<timenow ; i++){
            partdat=rezaltWeather.days[1].hours[i].datetime.split(':');
            createeHourBox(rezaltWeather.days[1].hours[i],partdat);
        }
    }
    allBoxHour=$.querySelectorAll('.p_iteam_time')
    conter_id=0;
}

function remove_add_back_blue(event , wich_box){
    wich_box.forEach(iteam=>{
        if(iteam.classList.contains('setBackgroundClikced'))
            iteam.classList.remove('setBackgroundClikced')})
        event.classList.add('setBackgroundClikced');
}
// clicked day box 
function wich_clicked_day(event){   
    let wich_day=rezaltWeather.days[event.firstElementChild.textContent];
        iconLarg.src=set_icon_weather(wich_day.icon,'dynamic');
        temp.textContent=(`${Math.round(wich_day.temp)}°C`);
        temp_down.textContent=(`${Math.round(wich_day.tempmin)}°C`);
        temp_up.textContent=(`${Math.round(wich_day.tempmax)}°C`);
        humidity.textContent=(`${(wich_day.humidity)}%`);
        visibility.textContent=(`${wich_day.visibility}km`);
        listWeatherTime.innerHTML='';
        if(event.firstElementChild.textContent > 0) tanzemCreateHourBox(wich_day.hours ,false,true);
        else tanzemCreateHourBox(wich_day.hours,hour_now_exitly);
        codamin_box_day=Number(event.firstElementChild.textContent);
        remove_add_back_blue(event,allBoxDay);
}
// clicked  time box -- sound apply for placement
function wich_clicked_hour(event){
    applay_time_placement(event.firstElementChild.textContent);
    remove_add_back_blue(event,allBoxHour);
}
function applay_time_placement(numbeBox){
    let wich_time=(rezaltWeather.days[codamin_box_day].hours[numbeBox]);
    if(numbeBox>23)
        wich_time=(rezaltWeather.days[1].hours[numbeBox-24]);
    iconLarg.src=set_icon_weather(wich_time.icon,'dynamic');
    temp.textContent=(`${Math.round(wich_time.temp)}°C`);
    temp_up.textContent=(`${Math.round(rezaltWeather.days[codamin_box_day].tempmax)}°C`);
    temp_down.textContent=(`${Math.round(rezaltWeather.days[codamin_box_day].tempmin)}°C`);
    humidity.textContent=(`${(wich_time.humidity)}%`);
    visibility.textContent=(`${wich_time.visibility}km`);
}
// clicked time now 
function func_clied_now_hour(event){
    placement(rezaltWeather,false)
    remove_add_back_blue(event,allBoxHour);
}
// start kebord 
const info_keybord = async function(inputValue){
    rezaltWeather=await respanse_api(set_nameCity(inputValue));
    if(rezaltWeather){
        getAdrass_in_map([rezaltWeather.longitude ,rezaltWeather.latitude]);
        setMarkwrite([rezaltWeather.longitude ,rezaltWeather.latitude])
        send_api_for_time(rezaltWeather.timezone);
        imgwrongVaz==true? fanc_err('flex','none',false):false;
    }
    else fanc_err('none','block',true);
}
async function info_map(array){
    rezaltWeather= await respanse_api(set_coordinates([array[0] ,array[1]]));
    send_api_for_time(rezaltWeather.timezone);
    fetch(setOpenweahterNamecity(array[0],array[1])).then(res=>{
        return res.json()
    }).then (res=>{
        input_haed.value = res.location.name;
    })
    .catch(err=>{
        input_haed.value ='';
    })
}
// keybordtime 
function keybordtime(){
    let time=new Date().getTime();
    time2=time;
    setTimeout(() => {
        if(time==time2 && input_haed.value !=='') { 
            info_keybord(input_haed.value)
        }
    },2000);}

window.onload=function(){
    info_map([38.10182778679747,46.2756785477053])
        $.querySelector('.right').style.display='block';
}

input_haed.addEventListener('keyup',keybordtime)

function rest_boxha() {
    listha.forEach(list=>{
        list.scrollLeft = 0
    })
}
function fanc_setEvent_move(mydiv) {
    let isDown = false;
    let startX;
    let scrollLeft;
    mydiv.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - mydiv.offsetLeft;
        scrollLeft = mydiv.scrollLeft;
    });
    mydiv.addEventListener('mouseleave', () => isDown = false);
    mydiv.addEventListener('mouseup', () => isDown = false);
    mydiv.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - mydiv.offsetLeft;
        const walk = (x - startX) * 1.5; // scroll speed
        mydiv.scrollLeft = scrollLeft - walk;
    });
    mydiv.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - mydiv.offsetLeft;
        scrollLeft = mydiv.scrollLeft;
    });
    mydiv.addEventListener('touchend', () => isDown = false);
    mydiv.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - mydiv.offsetLeft;
        const walk = (x - startX) * 1.2; // consistent scroll speed
        mydiv.scrollLeft = scrollLeft - walk;
    });
}
// Select all elements with the class 'list' and apply the function
listha.forEach(mylist => fanc_setEvent_move(mylist));

// map ----------------------
const mark=document.getElementById('loction_mark')
const view =new ol.View({
    projection:'EPSG:4326',
    center:[46.29291789644997,38.068463912105045],
    zoom:10,
});
let overlay=new ol.Overlay({
    element:mark,
})
let map= new ol.Map({
    target:'target',
    controls: ol.control.defaults({attribution:false ,zoom :false , rotate:false }),
    layers:[
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    overlays:[overlay],
    view:view,
})

let zoomslider = new ol.control.ZoomSlider();
map.addControl(zoomslider)
map.on('singleclick',function(event){
    let seletLoction=event.coordinate;
    overlay.setPosition(seletLoction)
    clik_map(seletLoction)
})
function setMarkwrite(array){
    overlay.setPosition(array)
}
// click map--------------------------
function clik_map(array_coordinate){
    info_map([array_coordinate[1],array_coordinate[0]])
    view.animate({
        center:array_coordinate,
        zoom:14,
    })
}
// move map--------------------
function getAdrass_in_map(arrayAddraess){
    view.animate({
        center:arrayAddraess,
        zoom:10,
        duration:1500,
    })
}
// ------------------------------------------------------ finsh