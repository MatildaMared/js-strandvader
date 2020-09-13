//  // Create a request variable and assign a new XMLHttpRequest object to it.
// let request = new XMLHttpRequest()

// // Open a new connection, using the GET request on the URL endpoint
// request.open('GET', 'http://api.openweathermap.org/data/2.5/forecast?q=Tylösand&appid=d281633f352b5e2ecf2b04cd6db53196&lang=sv', true)
// console.log(request);
// request.onload = function () {
//   // Begin accessing JSON data here
//   if (request.status === 200) {
//       console.log(JSON.parse(request.response));
//   } else {
//       console.log(`error ${request.status} ${request.statusText}`)
//   }
// }

// Send request
// request.send()


fetch('http://api.openweathermap.org/data/2.5/forecast?q=Tylösand&appid=d281633f352b5e2ecf2b04cd6db53196&lang=sv&units=metric')
    .then(response => {
        return response.json();
    })

    .then(weather => {
        console.log(weather)
        console.log(Math.round(weather.list[0].main.temp));
        
        let currentStad = weather.city.name;
        let html = document.getElementById("stad").innerHTML = currentStad;
        document.getElementById("temp").innerHTML = "Temperaturen är " + Math.round(weather.list[0].main.temp) + " grader "
    });
