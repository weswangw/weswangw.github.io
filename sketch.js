let dataServer;
let pubKey = "pub-c-eb5f6792-172e-4842-b65f-e2947c26f261";
let subKey = "sub-c-2ab7dba1-e634-42df-ba90-fd36daff9ec5";
let secretKey = "sec-c-ODY5M2NkMjItNmZhMy00MDkxLThiZGMtYTQyODJkYjZkNGFh";

let channelName = "Wes' App";


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
/** END OF NEW CONTENT**/ 


let video;
let poseNet;
let pose;
var skeleton;
var who;
this.history = [];

let gesture = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

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

  gesture.push(new dataPoints(pose, skeleton, dataServer.getUUID()));
}

function gotPoses(poses){
  console.log(poses);
  if (poses.length > 0){
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded(){
  console.log('poseNet ready');
}

function draw() {
  //image(video, windowWidth/2, windowHeight/2);
  background(0);
  sendTheMessage();

  if (pose){
    let x = pose.nose.x;
    let y = pose.nose.y;
    
    
    fill(y, x, x, 40);
    //noStroke();
    
    //ellipse(pose.nose.x, pose.nose.y, 40, 30);
    //ellipse(pose.leftEye.x, pose.leftEye.y, 40, 30);
    //ellipse(pose.rightEye.x, pose.rightEye.y, 40, 30);
    // rect(pose.rightWrist.x, pose.rightWrist.y, 1, 9);
    // rect(pose.leftWrist.x, pose.leftWrist.y, 1, 8);
    // rect(pose.leftAnkle.x, pose.leftAnkle.y, 1, 10);
    // rect(pose.rightAnkle.x, pose.rightAnkle.y, 1, 11);
    // rect(pose.leftElbow.x, pose.leftElbow.y, 1, 6);
    // rect(pose.rightElbow.x, pose.rightElbow.y, 1, 12);
    // rect(pose.leftKnee.x, pose.leftKnee.y, 1, 13);
    // rect(pose.rightKnee.x, pose.rightKnee.y, 1, 7);
  
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(153, 204, 255);
      rect(x, y, 3, 22);
    }

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];  
      //print(skeleton.length);
      strokeWeight(1);
      stroke(y, x, x, 30);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }

    
    sendTheMessage();
  }

}

function dataPoints(pose, skeleton, who){
    // this.noseX = noseX;
    // this.noseY = noseY;

    // this.leftEyeX = leftEyeX;
    // this.leftEyeY = leftEyeY;

    // this.rightEyeX = rightEyeX;
    // this.rightEyeY = rightEyeY;

    // this.rightWristX = rightWristX;
    // this.leftWristX = leftWristX;

    // this.rigthWristY = rigthWristY;
    // this.leftWristY = leftWristY;

    // this.rightAnkleX = rightAnkleX;
    // this.rigthAnkleY = rightAnkleY;

    // this.leftAnkleY = leftAnkleY;
    // this.leftAnkleX = leftAnkleX;
    
    // this.leftElbowX = leftElbowX;
    // this.leftElbowY = leftElbowY;

    // this.rightElbowX = rightElbowX;
    // this.rightElbowY = rightElbowY;

    // this.leftElbowX = leftElbowY;
    // this.leftElbowY = leftElbowY;

    // this.leftKneeX = leftKneeX;
    // this.leftKneeY = leftKneeY;

    // this.rightKneeX = rightKneeX;
    // this.rightKneeY = rightKneeY;

    // this.leftElbowX = leftElbowY;
    // this.leftElbowY = leftElbowY;
    this.pose = pose;
    this.skeleton = skeleton;
    this.who = who;

    console.log(this);
}

function sendTheMessage(){
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        pose: pose,
        skeleton: skeleton
      }
    }
  )
}

function readIncoming(inMessage){

  if(inMessage.channel == channelName){

      who = inMessage.message.publisher;
      pose = inMessage.message.pose;
      skeleton = inMessage.message.skeleton;
      

      let newinput = true;

      for(var i = 0; i<gesture.length;i++)
      {
        if(who==gesture[i].who)
        {
          gesture[i].pose = pose;
          gesture[i].skeleton = skeleton;
          newinput = false;   
        }
      }
      if(newinput)
      {
        gesture.push( new dataPoints(pose, skeleton, who));
      }
  }
}
