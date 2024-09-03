 
// 接收到GPT消息时会调用的函数
let player;
let tree; 
let factory;
let xiaole;
let objects;
let interactiveObjects;
let currentInteractiveObject = null;
let sendButton;
let chatInput;
let chatLog;
let showChatLog = false;



function sendUserMessage() {
  let message = chatInput.value();
  if (message.trim() !== '') {
   
    chatInput.value('');
    // 系统回复
    if (currentInteractiveObject.agent)
      {
        currentInteractiveObject.agent.send(message);
          updateChatLog();
          if(currentInteractiveObject.agent.onComplete===null)
            currentInteractiveObject.agent.onComplete = (t)=>{
            updateChatLog();
          };
      }
      
  }
}




function setup() {
  new Canvas(1000, 800);
  
  // 
  var chatInterface = document.getElementById('chatInterface');
  chatInterface.style.left = width + 'px';

  sendButton = select('#sendButton');
  chatInput = select('#chatInput');
  chatLog = select('#chatLog');
  sendButton.mousePressed(sendUserMessage);

   objects = new Group();
  objects.collider = 's';
  objects.bounciness = 0;
  objects.layer = 1;
  
  interactiveObjects = new objects.Group();
  interactiveObjects.textSize = 20;
  interactiveObjects.bounciness = 0;


  /////////////////////////       需要改的地方      /////////////////////////////////////
  player = new Sprite(230,0,60);
  player.image = '😄';
  player.accer = 0.8;
  player.maxSpeed = 5;
  player.bounciness  = 0;
  player.layer =2;
  player.rotationLock = true;
  player.collider= 'none'

  tree = new objects.Group();
  tree.w = 150;
  tree.h = 150;
  //tree.image = "";
  tree.tile = "-";
  
  block = new objects.Group();
  block.d = 150;
  block.image = "❌";
  block.tile = "=";


  tilesGroup = new Tiles(
    [
            "====================================================",
            "=.........-----------------------------------------=",
            "=.........-----------------------------------------=",
            "=........------------------------------------------=",
            "=.......-------------------------------------------=",
            "=........------------------------------------------=",
            "=........------------------------------------------=",
            "=..........----------------------------------------=",
            "=........-----...........--------------------------=",
            "=......----...................---------------------=",
            "=....---.................--------------------------=",
            "=.....................-----------------------------=",
            "=.................---------------------------------=",
            "=...............-----------------------------------=",
            "=...........---------------------------------------=",
            "=...............-----------------------------------=",
            "=......................----------------------------=",
            "=...............................-------------------=",
            "=.....................--..........-----------------=",
            "=..................----..........--......----......=",
            "=..........------------...........-------------....=",
            "=......--------------...........----------------...=",
            "=.....--........---......................--------..=",
            "=.........................................--....-..=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=.......--------...................................=",
            "=......------------................................=",
            "=......------------................................=",
            "=......------------................................=",
            "=.....-------------................................=",
            "=.....-------------................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
            "=..................................................=",
      "====================================================",
          ],
    0,
    0,
    120,
    120
  );
  ///////////////////////////////  需要改的地方  /////////////////////////////////////////

}

function draw() 
{
  clear();
  background('#ECFEF9');
  cursor(ARROW);



  camera.x = player.x;
  camera.y = player.y;
  

  // keyboard events
  if(kb.pressing('`')) camera.zoomTo(0.1);
  else camera.zoomTo(0.8);
  if (kb.presses('enter') && chatInput.value().trim!=='') sendUserMessage();
  
  // UPDATING INTERACTIVE OBJECTS
  for (let i =0; i<interactiveObjects.length; i++)
  {
    //interactiveObjects[i];
    
    if ( dist(player.x,player.y,interactiveObjects[i].x,interactiveObjects[i].y) - player.d/2 < interactiveObjects[i].d/2 +50) 
    {
      interactiveObjects[i].text = interactiveObjects[i].label;
      if (interactiveObjects[i].mouse.hovering()) cursor(HAND);
    }
    else interactiveObjects[i].text = "";

    if (interactiveObjects[i].text !== "")
    {
      if (interactiveObjects[i].mouse.presses()) 
        {
          currentInteractiveObject = interactiveObjects[i];
          showChatLog = true;
          updateChatLog();
        }
    }
  }

  if (currentInteractiveObject) // now interacting 
  {
    if ( dist(player.x,player.y,currentInteractiveObject.x,currentInteractiveObject.y) - player.d/2 >= currentInteractiveObject.d/2 +50) 
    {
      currentInteractiveObject = null;
      showChatLog = false;
    }
   

  }

  // updating ui
  let chatInterface = document.getElementById('chatInterface');
    if (showChatLog) {
        chatInterface.style.display = 'block';
    } else {
        chatInterface.style.display = 'none';
    }


    // updating player
    if (player.collides(objects))
    {
      player.vel.x = 0;
      player.vel.y = 0;
    }


}

// 鼠标点击时调用的函数
function mousePressed() {
  if (mouseX<width) player.moveTo(mouse.x,mouse.y,player.maxSpeed);

}


function updateChatLog()
{
  // clear all messages 

    chatLog.html('');
  
  // push all current interactive object messages  

  if (currentInteractiveObject)
  {
    if (currentInteractiveObject.agent)
    {
      for (let i =0; i<currentInteractiveObject.agent.messages.length; i++)
      {
        let sender = currentInteractiveObject.agent.messages[i].role;
        let message = currentInteractiveObject.agent.messages[i].content;
        let bubbleClass = sender === 'user' ? 'bubble me' : 'bubble you';
        let chatLabel = sender === 'user' ? "你":currentInteractiveObject.label;
        let messageElement = `<div class="${bubbleClass}">${message}<div class="time">${chatLabel}</div></div>`;
        chatLog.html(chatLog.html() + messageElement);
        // 自动滚动到底部
        chatLog.elt.scrollTop = chatLog.elt.scrollHeight;

      }

        

    }

    

  }





}

// bounciness = 0； near enough -> lable appera; coursor change; press to dialog 