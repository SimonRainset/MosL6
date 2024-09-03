// 接收到GPT消息时会调用的函数
let player;
let objects;
let interactiveObjects;
let mainInteractiveObjects;
let bufferPlayer;
let labelSprites;
let currentInteractiveObject = null;
let sendButton;
let chatInput;
let chatLog;
let showChatLog = false;
let labelSize = 30;
let mainSceneAgents=[];
let currentScene = 0;

function sendUserMessage() {
  let message = chatInput.value();
  if (message.trim() !== "") {
    chatInput.value("");
    // 系统回复
    if (currentInteractiveObject.agent) {
      currentInteractiveObject.agent.send(message);
      updateChatLog();
      if (currentInteractiveObject.agent.onComplete === null)
        currentInteractiveObject.agent.onComplete = (t) => {
          updateChatLog();
        };
    }
  }
}

function setup() {
  new Canvas(1000, 800);
  
  var chatInterface = document.getElementById('chatInterface');
  chatInterface.style.left = width + 'px';

  sendButton = select("#sendButton");
  chatInput = select("#chatInput");
  chatLog = select("#chatLog");
  sendButton.mousePressed(sendUserMessage);

  objects = new Group();
  objects.collider = "s";
  objects.bounciness = 0;
  objects.layer = 1;

  interactiveObjects = new Group();
  interactiveObjects.collider = "s";
  interactiveObjects.layer = 1;
  interactiveObjects.textSize = 20;
  interactiveObjects.bounciness = 0;
  interactiveObjects.labelSprite = null;

  labelSprites = new Group();
  labelSprites.textSize = labelSize*0.7;
  labelSprites.color = "#ECFEF9";
  labelSprites.strokeWeight = 0;
  labelSprites.autoDraw = false;


  scene0Enter();

}





function draw() {
  clear();
  background("#ECFEF9");
  cursor(ARROW);

  camera.x = player.x;
  camera.y = player.y;
  player.rotation = 0;

  // keyboard events
  if (kb.pressing("`")) camera.zoomTo(0.2);
  else camera.zoomTo(0.7);
  if (kb.presses("enter") && chatInput.value().trim !== "") sendUserMessage();
  if (kb.presses("!")  ) {switchScene(1)}
  if (kb.presses("@")) {switchScene(2)}
  if (kb.presses("#")) {switchScene(3)}
  




  // UPDATING INTERACTIVE OBJECTS
  for (let i = 0; i < interactiveObjects.length; i++) {
    //interactiveObjects[i];

    if (
      dist(
        player.x,
        player.y,
        interactiveObjects[i].x,
        interactiveObjects[i].y
      ) -
        player.d / 2 <
      interactiveObjects[i].d / 2 + 50
    ) {
        interactiveObjects[i].labelSprite.autoDraw = true;
      if (interactiveObjects[i].mouse.hovering()) cursor(HAND);
    } else {
      interactiveObjects[i].labelSprite.autoDraw = false;
      // interactiveObjects[i].text = "";
    }

    if (interactiveObjects[i].labelSprite.autoDraw) {
      if (interactiveObjects[i].mouse.presses()) {
        currentInteractiveObject = interactiveObjects[i];
        showChatLog = true;
        updateChatLog();
      }
    }
  }

  if (currentInteractiveObject) {
    // now interacting
    if (
      dist(
        player.x,
        player.y,
        currentInteractiveObject.x,
        currentInteractiveObject.y
      ) -
        player.d / 2 >=
      currentInteractiveObject.d / 2 + 50
    ) {
      currentInteractiveObject = null;
      showChatLog = false;
    }
  }

  // updating ui
  let chatInterface = document.getElementById("chatInterface");
  if (showChatLog) {
    chatInterface.style.display = "block";
  } else {
    chatInterface.style.display = "none";
  }

  // updating player
  if (player.collides(objects) || player.collides(interactiveObjects)) {
    player.vel.x = 0;
    player.vel.y = 0;
  }
}

// 鼠标点击时调用的函数
function mousePressed() {
  if (mouseX < width) player.moveTo(mouse.x, mouse.y, player.maxSpeed);
}

function updateChatLog() {
  // clear all messages

  chatLog.html("");

  // push all current interactive objec t messages

  if (currentInteractiveObject) {
    if (currentInteractiveObject.agent) {
      for (let i = 0; i < currentInteractiveObject.agent.messages.length; i++) {
        let sender = currentInteractiveObject.agent.messages[i].role;
        let message = currentInteractiveObject.agent.messages[i].content;
        let bubbleClass = sender === "user" ? "bubble me" : "bubble you";
        let chatLabel =
          sender === "user" ? "你" : currentInteractiveObject.label;
        let messageElement = `<div class="${bubbleClass}">${message}<div class="time">${chatLabel}</div></div>`;
        chatLog.html(chatLog.html() + messageElement);
        // 自动滚动到底部
        chatLog.elt.scrollTop = chatLog.elt.scrollHeight;
      }
    }
  }
}



function switchScene(scene)
{

  

  let functionName = 'scene' + currentScene + 'Exit';
  if (typeof window[functionName] === 'function') {window[functionName](); console.log('exiting'+currentScene )}; 
  anySceneExit();
  functionName = 'scene' + scene + 'Enter';
  currentScene = scene;
  if (typeof window[functionName] === 'function') {window[functionName](); console.log('enter'+scene )}; 
  


}



function anySceneExit()
{
  
    objects.tile = '.';
    objects.removeAll();
    if(player)player.remove();
    interactiveObjects.removeAll();
    labelSprites.removeAll();
  
  
}