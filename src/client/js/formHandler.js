
// Storing credentials of Geonames, WeatherBit & Pixabay API
const baseUrl1 =  "http://api.geonames.org/searchJSON";
const username1 = "shash68i";

const baseUrl2 = "https://api.weatherbit.io/v2.0/forecast/daily";
const ApiKey2 = "b4ac3b6698ee4bdb82332b4939d1f4c2";

const baseUrl3 = "https://pixabay.com/api/";
const ApiKey3 = "16549681-1feef3709b211ba3ea8c5817f";

let details = {};
const submitBtn = document.getElementById("submit");
const saveBtn = document.getElementById("save-btn");

// Event listeners
submitBtn.addEventListener("click", handleSubmit);
saveBtn.addEventListener("click", handleSave);


//Helper function to fetch data from WeatherbitAPI
const fetchWeatherbitAPI = (data) => {
    console.log(data);
    
    const latitude = data.lat;
    const longitude = data.lng;
    console.log(latitude, longitude);

    
    
    // Fetched api of Weatherbit
    var weatherbitUrl = encodeURI(`${baseUrl2}?lat=${latitude}&lon=${longitude}&key=${ApiKey2}`);
    return fetch(weatherbitUrl)
    .then((res) => res.json())
}

//Helper function to update UI
const updateUI = (climateData, depDate, loc) => {
    const climateInfo = climateData.data[0];

    const location = document.getElementsByClassName("place");
    const climate = document.getElementById("climate");
    
    var today = new Date();
    console.log(today);

    location[0].innerText = `${loc}`;
    location[1].innerText = `${loc} is ${depDate.slice(8, 10)-today.getDate()} days away`;
    climate.innerHTML = `High: ${climateInfo.app_max_temp} &nbsp &nbsp Low: ${climateInfo.app_min_temp}
                        <br> ${climateInfo.weather.description}`;

    console.log(loc);
    console.log(climateData);
};


// Helper function to fetch data from Pixabay API
const fetchPixabayAPI = (loc, depDate, hotel, flight) => {
    var pixabayUrl = encodeURI(`${baseUrl3}?key=${ApiKey3}&q=${loc}&image_type=photo`);

    fetch(pixabayUrl)
    .then((res) => res.json())
    .then((imageData) => {
        const image = document.getElementById("location-pic");
        const trips = document.getElementById("section__trips");

        document.getElementById("hotel-details").innerText = `Hotel: ${hotel}`;
        document.getElementById("flight-details").innerText = `Flight: ${flight}`;
        console.log(imageData);


        const imageInfo = imageData.hits[0].pageURL;
        console.log(imageInfo);

        image.src=imageInfo;
        trips.style.display = "block";
        trips.scrollIntoView();

        document.getElementById("submit").innerText = "Submit"


        const data = { loc: loc,
                    depDate: depDate,
                    imageUrl: `${imageInfo}`,
                    hotel: hotel,
                    flight: flight
                    };
        
        details = data;
    });
    console.log(details);
};


// Helper function to fetch data from all the API's
const fetchData = (loc, depDate, hotel, flight) => {
    const geoname = encodeURI(`${baseUrl1}?q=${loc}&maxRows=10&username=${username1}`);    
    console.log(geoname);
    // Fetch Geoname api
    fetch(geoname)    
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        return data.geonames[0]; 
    })
    // Pass lat & long data to Weatherbit fetch api
    .then( (data) => fetchWeatherbitAPI(data))
    .then( (climateData) => updateUI(climateData, depDate, loc))
    .then(() => fetchPixabayAPI(loc,depDate, hotel, flight))
    // .catch((error) => console.log(error));
    .catch( (error) => console.log(error));
};




// Callback function for click on submit button
function handleSubmit(event) {
    event.preventDefault();

    const loc = document.getElementById("location").value;
    const depDate = document.getElementById("start-date").value;
    const hotel = document.getElementById('hotel').value;
    const flight = document.getElementById('flight').value;

    fetchData(loc, depDate, hotel, flight);
}

function handleSave(event) {

     const postData = () => {
        console.log(details);
         
        fetch('http://localhost:8082/addData',{
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(details)
        })
        .then(res => res.send)
        .then( () => {
            console.log(res);
        })
        .catch((error) => console.log(error));

        saveBtn.disabled = "true";
        saveBtn.innerText = "Saved";
        saveBtn.style.pointerEvents = "none";
    }

    postData();
}

export { 
    handleSubmit,
    handleSave
    }
