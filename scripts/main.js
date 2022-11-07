const OWKey = "5eb3261492e9af00907c365814ccbbab";
const UKey = "bt4EnCAoUQgSuEYeuFY0-YZoBlt-iFfIqPok0JfhZ14";
const form = document.getElementById("city-name-form");
const main = document.querySelector("main");
const error = document.getElementById("error");
let now = new Date();
const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

const displayError = () => {
    error.innerHTML = "Please Enter A Valid City!";
};

const getCoordinates = async (cityName) => {
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${OWKey}`);
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

const setImage = async (name) => {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${name}&client_id=${UKey}`);
        const responseJSON = await response.json();
        imageURL = responseJSON.results[5].urls.regular;
        console.log(imageURL);
        document.body.style.backgroundImage = `url(${imageURL})`;
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";
    } catch(error) {
        console.log(error);
    }
};

const setWeatherFont = (weather, weatherDisplay) => {
    const font = document.createElement("i");
    switch(weather) {
        case "Rain":
            font.classList.add("fa-solid", "fa-cloud-showers-heavy");
            weatherDisplay.prepend(font);
            break;
        case "Clouds":
            font.classList.add("fa-solid", "fa-cloud");
            weatherDisplay.prepend(font);
            break;
        case "Clear":
            font.classList.add("fa-solid", "fa-sun");
            weatherDisplay.prepend(font);
            break;
    }
};

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
        setWeatherFont(weatherInfos.list[i].weather[0].main, weatherDisplay);

        const temperaturesDisplay = document.createElement("p");
        const minDisplay = document.createElement("span");
        minDisplay.classList.add("min");
        const maxDisplay = document.createElement("span");
        maxDisplay.classList.add("max");
        const tempMin = weatherInfos.list[i].main.temp_min;
        const tempMax = weatherInfos.list[i].main.temp_max;
        minDisplay.innerHTML = `${tempMin}°C`;
        maxDisplay.innerHTML = `${tempMax}°C`;
        temperaturesDisplay.append(minDisplay, " - ", maxDisplay);
        
        rowDisplay.append(dayDisplay, weatherDisplay, temperaturesDisplay);
        main.append(rowDisplay);
    }

    setImage(name);
};

const resetDisplay = () => {
    error.innerHTML = "";
    main.innerHTML = "";
    main.style.visibility = "hidden";
    document.body.style.backgroundImage = "none";
};

const getWeather = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    resetDisplay();
    if(formData.cityName != "") {
        try {
            const cityInfos = await getCoordinates(formData.cityName);
            const lat = cityInfos.lat;
            const lon = cityInfos.lon;
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OWKey}&units=metric`);
            const weatherInfos = await response.json();
            displayWeather(weatherInfos);      
        } catch(err) {
            console.log(err);
        }    
    } else {
        resetDisplay();
    }
};

form.addEventListener("submit", getWeather);