const APIKey = "5eb3261492e9af00907c365814ccbbab";
const form = document.getElementById
const cityInput = document.getElementById("city-input");
const main = document.querySelector("main");
const letsGoButton = document.getElementById("letsGo-button");
const error = document.getElementById("error");
let now = new Date();
const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const displayError = () => {
    error.innerHTML = "Please Enter A Valid City!";
};

const getCoordinates = async (cityName) => {
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIKey}`);
        const cityInfos = await response.json();
        if(cityInfos.length != 0) {
            return cityInfos[0];
        } else {
            displayError();
        }
    } catch(err) {
        console.log(err);
    }
};

/*
<h2>Bruxelles</h2>
<div class="row">
    <p>jour</p>
    <p>Pluie</p>
    <p>min - max</p>
</div>
*/

const displayWeather = (weatherInfos) => {
    main.style.visibility = "visible";
    const name = weatherInfos.city.name;
    const nameDisplay = document.createElement("h2");
    nameDisplay.innerHTML = name;
    main.append(nameDisplay);

    
    for(let i = 0; i < weatherInfos.list.length; i += 8) {
        const rowDisplay = document.createElement("div");
        rowDisplay.classList.add("row");

        const dayDisplay = document.createElement("p")
        const date = new Date(weatherInfos.list[i].dt_txt);
        const day = daysOfWeek[date.getDay()];
        dayDisplay.innerHTML = day;

        const weatherDisplay = document.createElement("p");
        const weather = weatherInfos.list[i].weather[0].main;
        weatherDisplay.innerHTML = weather;

        const temperaturesDisplay = document.createElement("p");
        const tempMin = weatherInfos.list[i].main.temp_min;
        const tempMax = weatherInfos.list[i].main.temp_max;
        temperaturesDisplay.innerHTML = `${tempMin}°C - ${tempMax}°C`;

        rowDisplay.append(dayDisplay, weatherDisplay, temperaturesDisplay);
        main.append(rowDisplay);
    }
};

const resetDisplay = () => {
    error.innerHTML = "";
    main.innerHTML = "";
    main.style.visibility = "hidden";
};

const getWeather = async (e) => {
    e.preventDefault();
    const cityName = cityInput.value;
    resetDisplay();
    if(cityName != "") {
        try {
            const cityInfos = await getCoordinates(cityName);
            const lat = cityInfos.lat;
            const lon = cityInfos.lon;
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`);
            const weatherInfos = await response.json();
            displayWeather(weatherInfos);            
        } catch(err) {
            console.log(err);
        }    
    } else {
        resetDisplay();
    }
};

letsGoButton.addEventListener("click", getWeather);