// 2031675dc6484b6e90b152228232404 api

//DOM
const locationName = document.querySelector("#locationName");
const currentTime = document.querySelector("#locationDate");
const weatherIcon = document.querySelector(".wIcon");
const flagDOM = document.querySelector(".flagIcon");

const temp = document.querySelector(".temperature");
const weatherText = document.querySelector("#weatherText");
const windStatus = document.querySelector(".details-data-wind");
const humidityStatus = document.querySelector(".details-data-humidity");
const feelsLikeStatus = document.querySelector(".details-data-feelsLike");

const weatherPicture = document.querySelector('.weatherPicture')

const searchBtn = document.querySelector('.search-submit')
const inputField = document.querySelector('.search-input');


//kad ucitamo prvi put stranicu poziva se funkcija sa gradom Tokyo kao default
window.onload = getWeather('Tokyo')

//sve se zasniva na pretrazivanju te se sve pokrece tek kad se stisne search btn
searchBtn.addEventListener('click',()=>{
    const NewInput = inputField.value;
     getWeather(NewInput)
  })


async function getWeather(town) {
  try {
    const response = await fetch(
      "https://api.weatherapi.com/v1/current.json?key=2031675dc6484b6e90b152228232404&q=" +
        town,
      { mode: "cors" }
    );
    const weatherData = await response.json();
    console.log(weatherData);
    //mjenja ikonu vremena(oblak,sunce itd.[ispod datuma i sata])
    weatherIcon.src = weatherData.current.condition.icon;
    //funkcija pretvar ime drzave u kod drzave i mjenja zastavu u DOM-u
    // (sluzi zato sto se korsti drugi api kako bi se puno ime drzave pretvorilo u kod te s tim kodom s interneta povlacimo ikonu zastave kojoj je potreban kod, npr Croatia u HR)
    //api je s jedne stranice i ikona zastave s druge
    await GetCountryCodeAndFlag(weatherData.location.country);

    // mjenja DOM u ime grada i drzave pretrazivanja
    locationName.textContent =
      weatherData.location.name + ", " + weatherData.location.country;
    //funkcija za mjenjanje DOM-a datuma i sati po lokalnom vremenu pretrazivanja po mojoj zelji
    getCurrentDateAndTime(weatherData.location.localtime);
    // mjenjanje detailsa(weatherText,wind,humidity,feels like)
    temp.textContent = weatherData.current.temp_c + "°C";
    weatherText.textContent = weatherData.current.condition.text;
    windStatus.textContent = weatherData.current.wind_kph + "k/m";
    humidityStatus.textContent = weatherData.current.humidity + "%";
    feelsLikeStatus.textContent = weatherData.current.feelslike_c + "°C";
    // funkcija za mjenjanje slike vremena
    changeWeatherPicture(weatherData.current.condition.text);
  } catch (e) {
    console.log(e);
  }
}

// funkcija za dobivanje koda drzave npr. Croatia u HR kako bih smo ga iskoristili za dobivanje zastave
async function GetCountryCodeAndFlag(name) {
  const response = await fetch(`https://restcountries.com/v3.1/name/` + name);
  const data = await response.json();
  const countryCode = data[0].altSpellings[0];
  return (flagDOM.src =
    "https://www.countryflagicons.com/SHINY/64/" + countryCode + ".png");
}

//funkcija prima local time i formatira ga prema mojoj zelji
function getCurrentDateAndTime(dateString) {
  const date = new Date(dateString);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.toLocaleString("en-US", { weekday: "long" });
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const hour = date.toLocaleString("en-US", { hour: "numeric", hour12: false });
  const minute = date.toLocaleString("en-US", { minute: "numeric" });
  const formattedDate = `${day} ${date.getDate()} ${month} ${year} | ${hour}:${minute}`;

  return (currentTime.textContent = formattedDate);
}

//funkcija za mijenjanje slike vremena tako sta provjerava text iz dohvacenog apia
function changeWeatherPicture(weatherStatus) {
  switch (true) {
    case weatherStatus.includes(
      "rain" ||
        weatherStatus.includes("drizzle") ||
        weatherStatus.includes("sleet")
    ):
      weatherPicture.src = "./images/rain.jpg";
      break;
    case weatherStatus.includes("Sunny"):
      weatherPicture.src = "./images/sunny.jpg";
      console.log("aa");
      break;
    case weatherStatus.includes("cloudy") ||
      weatherStatus.includes("overcast") ||
      weatherStatus.includes("mist"):
      weatherPicture.src = "./images/pexels-pixabay-158163.jpg";
      break;
    case weatherStatus.includes("Clear"):
      weatherPicture.src = "./images/clear.jpg";
      break;
    default:
      weatherPicture.src = "./images/pexels-pixabay-158163.jpg";
  }
}


