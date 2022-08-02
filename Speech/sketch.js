var txt;


let dataServer;
let pubKey = "pub-c-f4c24ad7-df0f-4c7a-b58f-1fd1ac4cadd1";
let subKey = "sub-c-30c93d9c-20af-453f-8275-57c696a8a019";
let secretKey = "sec-c-MzgxMTg5NjItMzA3Zi00YmY5LWE0ZmEtMjg2NWQ4NzY5OGIx";

let channelName = "NFCs";
let lst = [];

let occupancy = 0; // variable we use to sense how many people are on the page

/**THIS SECTION BELOW IS NEW AND WILL ALLOW YOU TO RANDOMLY GENERATE USER NAMES**/

let you; // variable to randomly generate new UUIDs upon load

function preload() { 

// logic to create a random UUID
  you = random(0,1000000); 
  console.log(you);
  you = int(you);
  console.log(you);
  you = you.toString();

}


function setup() {
  noCanvas();

  let lang = navigator.language || 'en-US';
  let speechRec = new p5.SpeechRec(lang, gotSpeech);
  

  let contiunuous = true;
  let interim = false;
  speechRec.start(contiunuous, interim);
  
  txt = speechRec.resultString;
  
  function gotSpeech(){
    console.log(speechRec);
    if(speechRec.resultValue){
      createP(speechRec.resultString);
    }
  }

  // initialize our PubNub Server
  dataServer = new PubNub({
    subscribeKey: subKey,
    publishKey: pubKey,
    uuid: you,
    secretKey: secretKey,
    heartbeatInterval: 0,
  });

  dataServer.subscribe({ channels: [channelName]});
  // listen for messages coming through the subcription feed on this specific channel. 
  dataServer.addListener({ message: readIncoming});

  lst.push(new dataPoints(txt, dataServer.getUUID()));
}

function sendTheMessage(){
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        txt: txt,
        lst: lst
      }
    }
  )
}

function readIncoming(inMessage){

  if(inMessage.channel == channelName){

      who = inMessage.message.publisher;
      txt = inMessage.message.txt;
      lst = inMessage.message.lst;
  }  
}
