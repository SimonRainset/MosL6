let gameStatus = 'cutscene';   // game starts from 'cutscene' -> 'mainscene' -> 'camerascene' -> 'loadCutscene'
let currentTime = 0;
let img; // 图片变量
let imgWidth, imgHeight; // 图片的宽度和高度
let sendButton,inputBox,inputContainer,chatLog,inventory,itemButton,discoverButton,shootButton,thumbnailContainer;
let interactiveCharacters;
let currentInteractiveCharacter;
let lastInterativeCharacter;
let thumbImages;
let maxNumCharacters=20;
let items = [];
let showChatLog = false;
let iButtons;
let labelSize = 30;
let itemUseDictionary = [];
let itemUseNow = [];
let inventoryItems=[];
let currentItem_namepluscode = null;
let thingsLikeRecord = {};
let thingsNotLikeRecord = {};
let lastInterativeOject = null;
let lastItem_namepluscode = null;
let bubbleQueue = [];
let inputStatus = 'default';
let cutsceneParams = [];
let currentCutsceneText = [];
let combinedCutsceneWillCause=[];
let currentInteractionCount = 0;

let unreadItemCount = 0;

let shootCount = 1;

//--------为了camera新加的--------
let capture;
let capturedImg;
let cameraURL = '';
let lastCameraURL = '';
let videoInputs = [];
let currentCameraIndex = 0;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight );
    imageMode(CORNER); 
    inputContainer =document.getElementById('input-container'); 
    inputBox = document.getElementById('input-box');
    sendButton = document.getElementById('send-button');
    chatLog = document.getElementById('chat-log');
    inventory = document.getElementById('inventory');
    itemButton = document.getElementById('item-button');  
    discoverButton =  document.getElementById('discover-button');
    shootButton = document.getElementById('shoot-button');

    //--------为了camera新加的--------
    shootButton.addEventListener('click', openCamera);

    iButtons = document.getElementById('iButtons');
    thumbnailContainer = document.getElementById('thumbnail-container');
    inputSetup();
    interactiveCharacters = new Group();
    interactiveCharacters.x = window.innerWidth/2; 
    interactiveCharacters.y = window.innerHeight/2;console.log(interactiveCharacters.y)
    interactiveCharacters.d = window.innerWidth*0.618;
    interactiveCharacters.collider = 'none'
    interactiveCharacters.visible = false;
    labelSprites = new Group();
    labelSprites.textSize = labelSize*0.7;
    labelSprites.color = "#ECFEF9AA";
    labelSprites.strokeWeight = 0;
    labelSprites.visible = false;

    cameraButton = new Sprite(window.innerWidth/2,3*window.innerHeight/4,100);
    cameraButton.strokeWeight = 0;
    cameraButton.color = 'white';
    cameraButton.visible = false;


    const dot = document.createElement("span");
    dot.classList.add("notification-dot");
    dot.id = "item-button-notification-dot"
    // 将小圆点添加到按钮
    itemButton.appendChild(dot);
    dot.style.display = "block"

    switchCameraButton = new Sprite(5 * window.innerWidth/6,5* window.innerHeight/6, 80)
    switchCameraButton.strokeWeight = 0;
    switchCameraButton.color = 'red';
    switchCameraButton.visible = false;


    ///////////////////////////////////  需要改动的部分 start  ////////////////////////////////////////

    levelSetup();

 
    
    ///////////////////////////////////  需要改动的部分  end ////////////////////////////////////////
    
    setupCurrentCutscene('');
    
    

    
    



}

function draw() {
    background(0); // 设置背景颜色为白色
    if (kb.presses("enter") && inputBox.value !== "") {
        sendUserMessage(inputBox.value);
        inputBox.value = "";
        observeChangeOfInput.notify("default");
    }
    if (capture) {
        image(capture, 0, 0, width, height); // 将摄像头画面绘制到 canvas
    }
    // 获取所有视频输入设备


    if (gameStatus === 'camerascene')
    {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                videoInputs = devices.filter(device => device.kind === 'videoinput');
            })
            .catch(err => {
                console.error('枚举设备失败:', err);
            });

        if (switchCameraButton.mouse.presses()){
            switchCamera();
        }

        if (cameraButton.mouse.presses())
            {
                takePhoto();
                //observeChangeOfGameStatus.notify({last:'camerascene',current:'loadCutscene'});
                //gameStatus = 'loadCutscene';
            }
        

    }
    else if(gameStatus ==='loadCutscene')
    {
        drawBgImg();
        push()
        fill('white')
        textSize(40)
        textAlign(LEFT);
        text('loading'+'.'.repeat(frameCount/10%5),width/2-80,height/2)
        pop()

        loadCutsceneUpdate();
        
    
    }
    else if (gameStatus ==='cutscene')
    {
        drawBgImg();
        bubbleDraw();
    }
    else if (gameStatus ==='mainscene')
    {
        drawBgImg();
        bubbleDraw();
    }
   

    
 
}


// 当窗口大小变化时重新设置画布大小
function windowResized() {
      resizeCanvas(window.innerWidth, window.innerHeight );
    redraw(); // 重新绘制画布
}



 
