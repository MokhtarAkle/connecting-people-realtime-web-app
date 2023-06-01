let map;
var buttonList = document.querySelectorAll(".selectButton");
var buttonSlide = document.querySelector("#side-out");
var listAnimation = document.querySelector("#side-wrapper");
var sortButton = document.querySelector("#sort-button");
var listInformation = document.querySelectorAll(".zoneInfo");
var searchIcon = document.querySelector("#search-icon");
var buttonSlideFlip = document.querySelector("#side-out-flip");
var searchBar = document.querySelector("#search-bar");
var checkboxes = document.querySelectorAll("input[type=checkbox]");
var sortStyling = document.querySelector(".sortHidden");
var sortButton = document.querySelector("#sort-button");
var filterStyling = document.querySelector(".filterStyle");
var filterButton = document.querySelector("#filter-button");
var dynamicFill = document.querySelectorAll(".dynamicCard");
var searchForm = document.querySelector("#search-form");
let exitButton = document.querySelector(".exitButton");
let reserveForm = document.querySelector("#reserve-form");
let reserveButton = document.querySelectorAll(".reserveButton");

const media1 = window.matchMedia('(max-width: 980px)');
const media2 = window.matchMedia('(min-width: 980px)');

const filterLength = document.querySelectorAll("input[type='checkbox']")

var position;
var myStyles =[
  {
      featureType: "poi",
      stylers: [
      { visibility: "off" }
      ]
  }
];


function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 52.083004469900835, lng: 5.123430702685763},
    zoom: 16,
    minZoom: 10,
    styles: myStyles,
    restriction: {
      latLngBounds: {
        north: 54,
        south: 51,
        east: 7.5,
        west: 3,
      },
    },
  });
  setMarkers(map);
  infoWindow1 = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");

  locationButton.textContent = "Jouw locatie";
  locationButton.classList.add("map-location-center");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const posit = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        new google.maps.Marker({
          position: posit,
          map,
          title: " ",
        });
        infoWindow1.setPosition(posit);
        infoWindow1.setContent("Jouw locatie");
        infoWindow1.open(map);
        map.setCenter(posit);
        locationButton.addEventListener("click", () => {
          map.setCenter(posit);
        });
      },
    );
  } else {
    infoWindow1.setPosition({ lat: 52.083004469900835, lng: 5.123430702685763});
    infoWindow1.setContent("Error: The Geolocation service failed. Error: Your browser doesn't support geolocation.");
  }
;

}
  

async function setMarkers(map){
    
    const svgMarkerBig = {
      path: "M 10 10 H 140 V 70 H 10 L 10 10",
      fill: "",
      fillOpacity: 0.2,
      strokeWeight: 2,
      strokeColor: "#4F52C9",
      rotation: -20,
      scale: 0.5,
      anchor: new google.maps.Point(0, 0),
      };

      const svgMarkerSmall = {
        path: "M 10 10 H 90 V 90 H 10 L 10 10",
        fill: "",
        fillOpacity: 0.2,
        strokeWeight: 2,
        strokeColor: "#4F52C9",
        rotation: -20,
        scale: 0.5,
        anchor: new google.maps.Point(0, 0),
        };

        const svgMarkerMedium = {
          path: "M 10 10 H 120 V 90 H 10 L 10 10",
          fill: "",
          fillOpacity: 0.2,
          strokeWeight: 2,
          strokeColor: "#4F52C9",
          rotation: -20,
          scale: 0.5,
          anchor: new google.maps.Point(0, 0),
          };

        const requestURL = 'https://api.codingthecurbs.fdnd.nl/api/v1/smartzones?first=100&direction=ASC';
        const request = new Request(requestURL);
      
        const response = await fetch(request);
        const smartzones = await response.json();
          
      
      for (let i = 0; i < smartzones.smartzones.length; i++){
        
        function markerSelect(){
          if(smartzones.smartzones[i].size == "1"){
            return svgMarkerSmall
          }
          if(smartzones.smartzones[i].size == "1.5"){
            return svgMarkerMedium;
          }
          else
          return svgMarkerBig;
        }

      const marker = new google.maps.Marker({
          position: {lat: parseFloat(smartzones.smartzones[i].geolocation.latitude), lng: parseFloat(smartzones.smartzones[i].geolocation.longitude)},
          icon: markerSelect(),
          map: map,
          title: smartzones.smartzones[i].address,
        });

        console.log(smartzones.smartzones[i].utilization[0])
        const infoWindow = new google.maps.InfoWindow();

    
        function buttonPopulate(something){

          function utilChecker(){
            if(something[i].utilization[1] == undefined && something[i].utilization[2] == undefined){
              return " "
            }
            else if (something[i].utilization[2] == undefined){
              return " | <br>" + something[i].utilization[1]
            }
            else{
              return " | <br>" + something[i].utilization[1] + " | " + something[i].utilization[2]
            }
          }


          const contentString = "Smartzone " + something[i].name +
          "<br> <br>" + "Locatie: <span class='titleStyle'>" + something[i].town + " </span>" +
          "<br> <br>" + "Adres: " + something[i].address +
          "<br> <br>" + "Functie: " + something[i].utilization[0] + utilChecker() +
          "<br> <br>" + "Grootte: " + something[i].size +
          "<br> <br>" + "<a href='http://maps.google.com/maps?saddr=52.362440594307465,4.915010541817515&daddr=" + something[i].geolocation.latitude + "," + something[i].geolocation.longitude +"'><img class='directionsButton' src='/images/directions.svg'></a>";

          marker.addListener("click", () => {
            infoWindow.close();
            infoWindow.setContent(contentString);
            infoWindow.open(marker.getMap(), marker);
            map.setZoom(18);
          });
          
          function buttonAdd(){
            map.setCenter(new google.maps.LatLng(something[i].geolocation.latitude, something[i].geolocation.longitude));
            map.setZoom(16);
            infoWindow.close();
            infoWindow.setContent(contentString);
            infoWindow.setPosition(new google.maps.LatLng(something[i].geolocation.latitude, something[i].geolocation.longitude))
            infoWindow.open({anchor: undefined,
              map,
              shouldFocus: true,});
              listAnimation.classList.toggle("animation-hidden");
              listAnimation.classList.remove("animation-visible");
              buttonSlide.classList.toggle("side-out-flip");
          }
          buttonList[i].addEventListener("click", buttonAdd);
        }
        buttonPopulate(smartzones.smartzones);
        

        google.maps.event.addListener(map, "click", function(event) {
          infoWindow.close();
      });
      } 
    }


function classSlide(){
    if(media1.matches){
      listAnimation.classList.toggle("animation-visible");
      listAnimation.classList.remove("animation-hidden");
      buttonSlide.classList.toggle("side-out-flip");
    }
    else if(media2.matches){
      listAnimation.classList.toggle("animation-hidden");
      listAnimation.classList.remove("animation-visible");
      buttonSlide.classList.toggle("side-out-flip");
    }
}



function classToggle(element, class1, class2){
  if(element.classList.contains(class1)){
    element.classList.toggle(class2);
    element.classList.remove(class1);
  }
  else{
    element.classList.toggle(class2);
    element.classList.add(class1);
  }
}

classToggle(filterStyling, "filterHidden", "filterStyle");

function preventSubmit(event){
  event.preventDefault();
};


window.initMap = initMap;
buttonSlide.addEventListener("click", classSlide);
sortButton.addEventListener("click", () => {classToggle(sortStyling, "sortHidden", "sortStyle")});
filterButton.addEventListener("click", () => {classToggle(filterStyling, "filterHidden", "filterStyle")});
exitButton.addEventListener("click", () => {classToggle(reserveForm, "reserveHidden", "reserveStyle")});
for(let i = 0; i < reserveButton.length; i++){
  reserveButton[i].addEventListener("click", () => {classToggle(reserveForm, "reserveHidden", "reserveStyle")});
}

// https://developers.google.com/maps/documentation/javascript
// https://support.google.com/mymaps/answer/3024454?hl=en&co=GENIE.Platform%3DDesktop#:~:text=Create%20a%20map,map%20a%20name%20and%20description.
// https://stackoverflow.com/questions/41648702/prevent-marker-from-scaling-when-zoom-out

//connect to the socket
const socket = io();
//get the elements fr om the DOM
const messages = document.querySelector('#messages');
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#message-input")



//listen for the chat message event from the server
socket.on("chat message", (message) => {
  //output the message to the DOM
  outputMessage(message);
});

//Output the message to the DOM
const outputMessage = (message) => {
  //create a div element
  const div = document.createElement("div");
  div.classList.add("message");
  //check if the message is from the bot or the user
  if(message.sender === "bot"){
  div.innerHTML = `bot message: ${message.message}`}
  else{
  div.innerHTML = `user message: ${message.message}`}
  console.log(message)
  //append the div to the messages div
  messages.appendChild(div);
}

//attach an event listener to the form
chatForm.addEventListener("submit", (e) => {
  //prevent the default behaviour
  e.preventDefault();
  //get the message from the input
  const message = e.target.elements["message-input"].value;
  //sends the message to the server
  socket.emit("chat message", message);
  //clear the input field
  
  chatInput.value= "";
  chatInput.focus();
});

// Open chat popup
document.getElementById("open-chat").addEventListener("click", function() {
  document.getElementById("chat-popup").style.display = "block";
});

// Close chat popup
document.getElementById("close-chat").addEventListener("click", function() {
  document.getElementById("chat-popup").style.display = "none";
});

// Submit message
document.getElementById("chat-form").addEventListener("submit", function(e) {
  e.preventDefault();
  var messageInput = document.getElementById("message-input");
  var message = messageInput.value;
  if (message.trim() !== "") {
    // Append the message to the chat
    var messagesContainer = document.getElementById("messages");
    var newMessage = document.createElement("div");
    newMessage.className = "message";
    newMessage.textContent = message;
    messagesContainer.appendChild(newMessage);

    // Clear the input
    messageInput.value = "";
  }
});


