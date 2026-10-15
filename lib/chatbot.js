// Chatbot logic shared by the socket.io connection (local) and the /api/chat endpoint (Vercel, which has no websockets)

const welcome = "Welcome to the Coding the curbs support app, say hello to the bot!";

// Returns the bot replies for a user message and the user's new progress
function respond(message, progress) {
  let botresponse = "";

  //logic to check the user's progress
  switch(progress){
    case 0:
      //if the user replies, increase the progress and send the default message
      return { progress: 1, replies: [`Press any of the following keys to interact with our bot and choose the most relevant topic to your issue: <br>
  1. Frequently asked questions <br>
  2. Contact support <br>
  3. Report an app error <br>
  4. Live support chat <br>`] };
    case 1:
      //the user has selected an option, so we check which option they selected
      if(message === "1"){
        botresponse = "You selected option 1 <br> Frequently asked questions: <br> 1. How do I use the application? <br> 2. How do I control the map? <br> 3. Why is the site asking for my location? <br> 4. None of the above (Contact support) <br> Press any other key to return to previous screen";
        progress = 2;
      }else if(message === "2"){
        botresponse = 'You selected option 2 <br> Contact support: <br> You can contact our support team <a href="https:/www.codingthecurbs.com/contact">here</a> <br> Press any other key to return to previous screen';
        progress = 0;
      }else if (message === "3"){
        botresponse = 'You selected option 3 <br> Report an app error: <br> You can find this project on gitHub and report any problems you encounter <a href="https://github.com/MokhtarAkle/connecting-people-realtime-web-app/issues">here</a> <br> Press any other key to return to previous screen';
      progress = 0;
      }else if(message === "4"){
        botresponse = "You selected option 4 <br> Live support chat: WIP <br> Press any other key to return to previous screen";
        progress = 0;
      }else if(message === "5"){
        botresponse = "You selected option 5 <br> Return to previous screen <br> Press any other key to return to previous screen";
        progress = 0;
      }else{
        //if the user enters an invalid option, we send the default message
        botresponse = "Invalid option <br> Press any of the following keys: <br> 1. Frequently asked questions: <br> 2. Contact support: <br> 3. Report an app error: <br> 4. Live support chat <br>";
//set the progess as 1 until the proper input is recieved
        progress = 1;
      }
      return { progress, replies: [botresponse] };

      case 2:
        if(message === "1"){
          botresponse = "Q: How do I use the application? <br> A: For general instructions on available functions and controls, refer to: <a href='https://github.com/MokhtarAkle/connecting-people-realtime-web-app'>gitHub readme</a>";
        }else if(message === "2"){
          botresponse = "Q: How do I control the map? <br> A: The map used by this application makes use of the Google maps API. For any questions regarding controls and/or functions of the map, refer to: <a href='https://support.google.com/maps/?hl=en#topic=3092425'>Google Maps support</a>";
        }else if(message === "3"){
          botresponse = "Q: Why is the site asking for my location? <br> A: The site uses the geolocation API to ping your location and display it on the map as a point of reference. If you don't want to share your location data you can deny the question and still make use of the application freely.";
        }else if(message === "4"){
          botresponse = "Q: None of the above (Contact support) <br> A: If your question could not be answered or you have further questions, you can contact the official Coding the Curbs support team: <a href='https://www.codingthecurbs.com/contact'>Here</a> ";
        }
        else{
          return { progress: 0, replies: [] };
        }

        return { progress: 1, replies: [botresponse, `Press 1 to return to previous screen`] };
  }

  return { progress, replies: [] };
}

module.exports = { welcome, respond };
