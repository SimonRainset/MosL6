// 接收到GPT消息时会调用的函数
let player;
let objects;
let interactiveObjects;
let mainInteractiveObjects;
let bufferPlayer;
let labelSprites;
let currentInteractiveObject = null;
let itemButton;
let sendButton;
let chatInput;
let chatLog;
let inventory;
let iButtons;
let showChatLog = false;
let labelSize = 30;
let currentScene = 0;
let itemUseDictionary = [];
let itemUseNow = [];
let inventoryItems=[];
let currentItem_namepluscode = null;
let thingsLikeRecord = {};
let lastInterativeOject = null;
let lastItem_namepluscode = null;
let bubbleQueue = [];


function sendUserMessage() {
  if (currentInteractiveObject.onSend!==undefined) currentInteractiveObject.onSend();
  let message = chatInput.value();
  if (message.trim() !== "") {
    chatInput.value("");
    // 系统回复
    if (currentInteractiveObject.agent) {
      currentInteractiveObject.agent.send(message);
      updateChatLog();
      currentInteractiveObject.agent.onComplete = (t) => {
        if (currentInteractiveObject.onRespond!==undefined)  currentInteractiveObject.onRespond(t);
        updateChatLog();
      };
    
    }
  }
}

function setup() {
  new Canvas(700, 800);
  frameRate(60);
  p5play.renderStats = true;

  
  var chatInterface = document.getElementById('chatInterface');
  chatInterface.style.left = width + 'px';
  chatInterface.style.height = height + 'px';

  inventory = select("#inventory");
  sendButton = select("#sendButton");
  itemButton = select('#itemButton');
  chatInput = select("#chatInput");
  chatLog = select("#chatLog");
  iButtons = document.getElementById('iButtons');

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
  labelSprites.color = "#ECFEF9AA";
  labelSprites.strokeWeight = 0;
  labelSprites.autoDraw = false;

  scene0Enter();
  observeChangeOfInventory.notify();


}





function draw() {
  clear();
  background("#ECFEF9");
  cursor(ARROW);

  camera.on();

  camera.x = player.x;
  camera.y = player.y;
  player.rotation = 0;

  // keyboard events
  if (kb.pressing("`")) camera.zoomTo(0.2);
  else camera.zoomTo(0.7);
  if (kb.presses("enter") && chatInput.value().trim !== "") sendUserMessage();
    

  
  
  
  // UPDATING INTERACTIVE OBJECTS
  for (let i = 0; i < interactiveObjects.length; i++) {

    if (dist(player.x,player.y,interactiveObjects[i].x,interactiveObjects[i].y) -player.d / 2 <interactiveObjects[i].d / 2 + 50) {
      if (interactiveObjects[i].labelSprite.autoDraw === false && interactiveObjects[i].onApproach!==undefined) {interactiveObjects[i].onApproach(); }
      interactiveObjects[i].labelSprite.autoDraw = true;
      if (interactiveObjects[i].mouse.hovering()) cursor(HAND);
    } else {
      if (interactiveObjects[i].labelSprite.autoDraw && interactiveObjects[i].onLeave!==undefined) interactiveObjects[i].onLeave();
      interactiveObjects[i].labelSprite.autoDraw = false;
      
    }
 
    if (interactiveObjects[i].labelSprite.autoDraw) {
      if (interactiveObjects[i].mouse.presses()) {
        setCurrentInteractiveObject(interactiveObjects[i]);
        if (interactiveObjects[i].onInteract!==undefined) interactiveObjects[i].onInteract();
      }
    }
    
    
  }
  
  if (currentInteractiveObject) {
    // now interacting
    if (dist(player.x,player.y,currentInteractiveObject.x,currentInteractiveObject.y) -player.d / 2 >=currentInteractiveObject.d / 2 + 50) 
    {
      setCurrentInteractiveObject(null);
    }
  }
  
  // console.time("updateUI");
  // console.timeLog("updateUI");
  
  // updating ui
  let chatLog = document.getElementById("chatLog");
  let inputDiv= document.getElementById("inputDiv");
  if (showChatLog) {
    chatLog.style.display = "block";
    inputDiv.style.display = "block";
  } else {
    chatLog.style.display = "none";
    inputDiv.style.display = "none";
  }
  // console.timeEnd("updateUI");

  // updating player
  if (player.collides(objects) || player.collides(interactiveObjects)) {
    player.drag =30;
    setTimeout(() => {
      player.drag =0;
      }, 200);  
  }

  // bubble update
  for (let i = 0; i < bubbleQueue.length;) {
    bubbleQueue[i].timeOut--; // 减少 timeOut
    if (bubbleQueue[i].timeOut < 0) {
      // timeOut 小于零，显示泡泡并从队列中删除记录
      bubbleText(bubbleQueue[i].sprite, bubbleQueue[i].text);
      bubbleQueue.splice(i, 1); // 删除当前记录，i 不变，继续循环
    } else {
      i++; // 继续检查下一个记录
    }
  }


  // console.time("updateiButtons");
  // console.timeLog("updateiButtons");
  camera.off();


  // draw attributes 
  push()
  textSize(15); // 设置文本大小
  textAlign(LEFT, TOP); // 设置文本对齐方式
  noStroke(); // 移除边框
  fill(0); // 设置文本颜色为黑色
  drawAttributes();
  pop();
  

}

// 鼠标点击时调用的函数
function mousePressed() {
  if (mouseX < width) player.moveTo(mouse.x, mouse.y, player.maxSpeed);
}

///////////////////////////////////  UI update /////////////////////////////////

function drawAttributes() {
  let x = 10; // X坐标起始位置
  const spacing = 30; // 属性值之间的间隔

  // 遍历属性数组并显示
  for (let i = 0; i < player.attributes.length; i++) {
    let attribute = player.attributes[i];
    let { name, symbol, quantity } = attribute;

    // 根据数量决定显示的文本
    let displayValue = quantity > 4 ? `${symbol}X ${quantity}` : symbol.repeat(quantity);
    if (quantity ===0) displayValue = '0';

    // 计算当前属性文本的宽度
    let textWidthValue = textWidth(`${name}: ${displayValue}`);

    // 如果不是第一个属性，添加间隔
    if (i > 0) {
      x += spacing;
    }
    // 显示属性名和格式化后的值
    text(`${name}: ${displayValue}`, x, 10);
    // 更新X坐标为下一个属性的位置
    x += textWidthValue;
  }
}

function modifyAttribute(attributeName, changeAmount) {
  // 遍历属性数组，找到对应的属性
  for (let attribute of player.attributes) {
    if (attribute.name === attributeName) {
      // 计算新的属性值，确保它不会小于0
      attribute.quantity = Math.max(attribute.quantity + changeAmount, 0);
      break; // 找到属性后退出循环
    }
  }
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


function updateInventory()
{
  inventory.html("");
  inventoryItems.forEach((item, index) => {
    const itemDiv = createDiv();
    itemDiv.class('item');
    itemDiv.attribute('namepluscode', item.name+item.code);


    // 添加图像
    const imageSpan = createSpan(item.image);
    imageSpan.class('image');
    itemDiv.child(imageSpan);

    // 添加名称
    const nameSpan = createP(item.name);
    nameSpan.class('name');
    itemDiv.child(nameSpan);

    // 添加描述，初始时不显示
    const descriptionSpan = createP(item.description);
    descriptionSpan.class('description');

    itemDiv.child(descriptionSpan);

    // 鼠标悬停事件，显示和隐藏描述
    itemDiv.mouseOver(function() {
      descriptionSpan.style('display', 'block');
    });
    itemDiv.mouseOut(function() {
      descriptionSpan.style('display', 'none');
    });

    // 将itemDiv添加到容器
    inventory.child(itemDiv);
    if (itemDiv.attribute('namepluscode') === currentItem_namepluscode) itemDiv.addClass('highlight');
    itemDiv.elt.addEventListener('click', function() {
      if (itemDiv.hasClass('highlight')) {itemDiv.removeClass('highlight');setCurrentItem(null)}
      else 
      {
        const allItemDivs = document.querySelectorAll('.item'); // 假设所有itemDiv都有'item'这个类名
        // 移除所有itemDiv的高亮类
        allItemDivs.forEach(div => {
          div.classList.remove('highlight');
        });
        itemDiv.addClass('highlight');
        setCurrentItem(itemDiv.attribute('namepluscode'));

      }
        
    });
    inventory.elt.scrollTop = inventory.elt.scrollHeight;

  });
}

///////////////////////////////// Object Management /////////////////////////
function createObject(objectParams)
{
  o = new objects.Group();
  o.d = objectParams.d;
  o.image = objectParams.image;
  o.tile = objectParams.tile;
  return o;
}

function createInteractiveObject(objectParams)
{
  io = new interactiveObjects.Sprite(); //注意这里交互物体必须是Sprite才能有agent
  io.d = objectParams.d;
  io.image = objectParams.image;
  io.tile = objectParams.tile ;
  io.label = objectParams.label;
  if (objectParams.systemPrompt!==undefined)
    {
      io.agent = new P5GLM();
      io.agent.setSystemPrompt(objectParams.systemPrompt);
      if (objectParams.firstMessage!==undefined) io.agent.messages.push({ role: "assistant", content: objectParams.firstMessage });
      if (objectParams.onSend!==undefined) io.onSend = objectParams.onSend;
      if (objectParams.onRespond!==undefined) io.onRespond = objectParams.onRespond;
    }
    if (objectParams.onInteract!==undefined) io.onInteract = objectParams.onInteract;
    if (objectParams.onApproach!==undefined) io.onApproach = objectParams.onApproach;
    if (objectParams.onLeave!==undefined) io.onLeave = objectParams.onLeave;
    
  return io;
}

function deleteInteractiveObject(io)
{
  if (io===currentInteractiveObject) setCurrentInteractiveObject(null);
    io.labelSprite.remove();
    io.remove();
        
}

function deleteCurrentInteractiveObject()
{
  deleteInteractiveObject(currentInteractiveObject);
}

function setCurrentInteractiveObject(newIO)
{
  lastInterativeOject = currentInteractiveObject;
  currentInteractiveObject = newIO;
  if (lastInterativeOject!==currentInteractiveObject) 
    observeChangeOfCurrentInteractiveObject.notify({last:lastInterativeOject,current:currentInteractiveObject}); // notify all observer change of current interactive object
}

////////////////////////////  Item Management ////////////////////////////////


function addItem(itemOptions)
{
  let itemName,itemCode,itemImage,itemDescription;
  if (itemOptions.name === undefined) return;
  itemName = itemOptions.name;
  if (itemOptions.code === undefined) itemCode = floor(random(-100000,-1));
  else itemCode = itemOptions.code;
  if (itemOptions.image === undefined || itemOptions.description === undefined)
  {
    if (itemOptions.image === undefined) itemImage = '❓';
    else itemImage = itemOptions.image;
    if (itemOptions.description === undefined) itemDescription = '???';
    else itemDescription = itemOptions.description;
    inventoryItems.push({name:itemName,code:itemCode,image:itemImage,description:itemDescription});
    observeChangeOfInventory.notify();
    let itemGenerateAgent = new P5GLM();
    itemGenerateAgent.send(`请帮我为物体${itemName}生成一个emoji和一小段不超过30字的描述，emoji必须严格为一个字符。请严格使用Json格式，两个key为"emoji"和"description":`);
    itemGenerateAgent.onComplete = (text) => {
      const chineseCommaRegex = /(?<=":)\s*，|(?<=",)\s*(?=\s*[{])/g; // 可能误用中文逗号
      text = text.replace(chineseCommaRegex, ',');  
      text = text.match(/{[^{}]*}/); // 提取回答中的json格式
      try{
        jsonData = JSON.parse(text);
      }
      catch(error)
      {
        console.log('parse error');
        itemGenerateAgent.send(`请帮我为物体${itemName}生成一个emoji和一小段不超过30字的描述，emoji必须严格为一个字符。请严格使用Json格式，两个key为"emoji"和"description":`);
      }
      itemGenerateAgent.onError = ()=>{console.log('parse error2');itemGenerateAgent.send(`请帮我为物体${itemName}生成一个emoji和一小段不超过30字的描述，emoji必须严格为一个字符。请严格使用Json格式，两个key为"emoji"和"description":`);};
      
      if (itemOptions.image === undefined) itemImage= jsonData["emoji"];
      else itemImage = itemOptions.emoji;
      if (itemOptions.description === undefined) itemDescription =  jsonData["description"];
      else itemDescription = itemOptions.description;
      for (let i of inventoryItems)
      {
        if (i.code === itemCode) 
        {
          if (i.image === '❓') i.image = itemImage;
          if (i.description === '???') i.description = itemDescription;
        }
      }
      
      observeChangeOfInventory.notify();
    }

  }
  else {
    itemImage = itemOptions.image;
    itemDescription = itemOptions.description;
    inventoryItems.push({name:itemName,code:itemCode,image:itemImage,description:itemDescription});
    observeChangeOfInventory.notify();

  }

  
}

// ItemUse    
function findItemWithNamepluscode(namepluscode)
{
  for (let ii of inventoryItems)
    {if ((ii.name+ii.code) === namepluscode) return ii;}
  return null;
}

function createItemUseButton(text, callback){
  let newbutton = document.createElement('button');
  newbutton.textContent = text; // 设置按钮上的文字

  // 为按钮添加点击事件监听器
  newbutton.addEventListener('click', function() {
    let itemName=findItemWithNamepluscode(currentItem_namepluscode).name;
    let ioName = currentInteractiveObject?'对'+currentInteractiveObject.label:'';
    bText = `你${ioName}${text}了${itemName}`;
    bubble(bText);
    
  });
  newbutton.addEventListener('click', function() {
     callback(); // 当按钮被点击时，调用回调函数
  });
  iButtons.appendChild(newbutton);
}


function checkIOCondiction(itemUse)
{
  if (itemUse.toInteractiveObjectOf === 'none' && currentInteractiveObject === null) itemUse.IOCondition = true;
  if (itemUse.toInteractiveObjectOf === 'all' && currentInteractiveObject !== null) itemUse.IOCondition = true;
  if (currentInteractiveObject) if (itemUse.toInteractiveObjectOf === currentInteractiveObject.label) itemUse.IOCondition = true;
  if (itemUse.toInteractiveObjectLike !== undefined && currentInteractiveObject) 
    {
      let judgeAgent = new P5GLM();
      let currentIO = currentInteractiveObject.label;
      
      if (isThingPairing(currentIO,itemUse.toInteractiveObjectLike)) itemUse.IOCondition = true; // 已经存在于判断表里，不会继续判断
      else{
        judgeAgent.send(`请判断${currentIO}是否是${itemUse.toInteractiveObjectLike}，请仅用true/false回答，不要解释`);  
        judgeAgent.onComplete= (t)=>{
        console.log(`判断${currentIO}是否是${itemUse.toInteractiveObjectLike}结果是${t}`);
        if (t.includes('true')) {itemUse.IOCondition = true; addThingPairing(currentIO,itemUse.toInteractiveObjectLike);}
        if (itemUse.itemCondition=== true && itemUse.IOCondition === true && currentIO === currentInteractiveObject.label) {itemUseNow.push(itemUse);mergeActionandCreateButtions();}
        }
      }
      
    }
  if (itemUse.itemCondition=== true && itemUse.IOCondition === true) itemUseNow.push(itemUse);

}

function checkItemCondition(itemUse)
{
  if (currentItem_namepluscode === null) return;
  if (itemUse.withItemOf ==="all") itemUse.itemCondition=true;
  if (itemUse.withItemOf !== undefined && currentItem_namepluscode) if (currentItem_namepluscode.includes(itemUse.withItemOf)) itemUse.itemCondition=true;
  if (itemUse.withItemLike!== undefined  && currentItem_namepluscode) 
    {
      let currentItem = findItemWithNamepluscode(currentItem_namepluscode) ;
      let judgeAgent = new P5GLM();
      let currentItemName= currentItem.name;
      let currentItemNameCode= currentItem.name + currentItem.code;
      if (isThingPairing(currentItem.name,itemUse.withItemLike)) itemUse.itemCondition = true; // 已经存在于判断表里，不会继续判断
      else 
      {
        judgeAgent.send(`请判断${currentItem.name}是否是${itemUse.withItemLike}，请仅用true/false回答，不要解释`);
        judgeAgent.onComplete= (t)=>
          {
            console.log(`判断${currentItemName}是否是${itemUse.withItemLike}结果是${t}`);
            if (t.includes('true')) {itemUse.itemCondition = true; addThingPairing(currentItemName,itemUse.withItemLike);}
            if (itemUse.itemCondition=== true && itemUse.IOCondition === true && currentItemNameCode === currentItem_namepluscode) {itemUseNow.push(itemUse);mergeActionandCreateButtions();}
          };

      }
      
    }
  if (itemUse.itemCondition=== true && itemUse.IOCondition === true) itemUseNow.push(itemUse);
}

// 函数：添加配对到记录表
function addThingPairing(thing1, thing2) {
  // 使用thing1和thing2的组合作为键，保持原始顺序
  var key = [thing1, thing2].join(':');
  // 将键值对添加到记录表中
  thingsLikeRecord[key] = true;
}

// 函数：检查配对是否存在于记录表
function isThingPairing(thing1, thing2) {
  // 使用thing1和thing2的组合作为键，保持原始顺序
  var key = [thing1, thing2].join(':');
  // 检查键是否存在于记录表中
  return thingsLikeRecord.hasOwnProperty(key);
}

function mergeActionandCreateButtions()
{
  var uniqueItemUseNow = [...new Map(itemUseNow.map(item => [JSON.stringify(item), item])).values()];
  // 这个数据结构的一个数组 itemUseNow 存了很多这个数据。现在我需要找到所有 do值有重复的数据，
  // 并且将他们的willCause合并成一个回调函数，作为合并后的元素的willCause。
  // 所有 itemUseNow 中的数据都要通过这个操作，合并相同的do值
  var willCauseMap = {};
  // 遍历itemUseNow数组，填充willCauseMap
  uniqueItemUseNow.forEach(item => {
    // 如果这个do值还没有记录，初始化一个空数组
    if (!willCauseMap[item.do]) {
      willCauseMap[item.do] = [];
    }
    // 将当前项的willCause添加到对应do值的数组中
    willCauseMap[item.do].push(item.willCause);
  });

  // 创建一个新的数组，包含合并后的do和willCause
  var mergedActions = Object.keys(willCauseMap).map(doKey => {
    // 对于每个do值，创建一个合并后的willCause回调函数
    const mergedWillCause = function() {
      willCauseMap[doKey].forEach(callback => callback());
    };
    
    
    // 返回包含do值和合并后的willCause的元素
    return {
      do: doKey,
      willCause: mergedWillCause
    };
  });

  iButtons.innerHTML = '';
  mergedActions.forEach(action => {
    createItemUseButton(action.do, action.willCause);
  });


}

function updateIButtons()
{
  
  itemUseNow = [];
  for (let itemUse of itemUseDictionary) 
    {
      itemUse.IOCondition = false; 
      itemUse.itemCondition = false;
      checkIOCondiction(itemUse);
      checkItemCondition(itemUse);
    
    }

    mergeActionandCreateButtions();
}


function deleteItem(itemNameOrCode)
{
  // 从后向前遍历，避免索引问题
  for (var i = inventoryItems.length - 1; i >= 0; i--) {
    iNamepluscode = inventoryItems[i].name + inventoryItems[i].code;
    if (iNamepluscode.includes(itemNameOrCode)) {
      if (iNamepluscode === currentItem_namepluscode) setCurrentItem(null);
      inventoryItems.splice(i, 1);
      observeChangeOfInventory.notify();
    }
  }
  
}

function deleteCurrentItem()
{
  deleteItem(currentItem_namepluscode);
}

function setCurrentItem(namepluscode)
{
  lastItem_namepluscode = currentItem_namepluscode;
  currentItem_namepluscode = namepluscode;
  if (lastItem_namepluscode!==currentItem_namepluscode) 
    observeChangeOfCurrentItem.notify({last:lastItem_namepluscode,current:currentItem_namepluscode});
}


//////////////////////////////////// bubble //////////////////////////////////////////////////
function bubbleFromSprite(sprite, text) {
  let maxTimeOut = 0;
  let spriteBubbling = false;
  // 检查队列中是否已经有相同 sprite 的记录
  for (let i = 0; i < bubbleQueue.length; i++) {
    if (bubbleQueue[i].sprite === sprite) {
      maxTimeOut = Math.max(maxTimeOut, bubbleQueue[i].timeOut);
      spriteBubbling = true;
    }
  }
  if (spriteBubbling)maxTimeOut+=25
  // 添加新泡泡记录到队列
  bubbleQueue.push({
    sprite: sprite,
    text: text,
    timeOut: maxTimeOut  // 设置 timeOut
  });
}

function bubble(text){bubbleFromSprite(player,text)}

function bubbleText(sprite,text)
{
  if (sprite === undefined || sprite ===  null) return
  bubbleSprite = new Sprite(sprite.x+random(-80,80), sprite.y - 60, labelSize*text.length, labelSize,'none');
  bubbleSprite.textSize = labelSize*0.7;
  bubbleSprite.color = "#F9EEEC";
  bubbleSprite.strokeWeight = 0;
  bubbleSprite.text = text;
  bubbleSprite.vel.y = -1;
  bubbleSprite.life = 100;

}

////////////////////////////  Scene Management ////////////////////////////////

function switchScene(scene)
{

  let functionName = 'scene' + currentScene + 'Exit';
  if (typeof window[functionName] === 'function') {window[functionName](); console.log('exiting'+currentScene )}; 
  sceneExit(); 
  functionName = 'scene' + scene + 'Enter';
  currentScene = scene;
  if (typeof window[functionName] === 'function') {window[functionName](); console.log('enter'+scene )}; 
}



function sceneExit()
{
    objects.tile = '.';
    objects.removeAll();
    if(player)player.remove();
    interactiveObjects.removeAll();
    labelSprites.removeAll();
}


//////////////////////////// Observer /////////////////////////////////////

function createObservable() {
  // 存储观察者列表
  const observers = [];

  // 注册观察者
  const subscribe = (observer) => {
    if (typeof observer === 'function') {
      observers.push(observer);
    } else {
      throw new Error('Observer must be a function');
    }
  };

  // 移除观察者
  const unsubscribe = (observer) => {
    observers.splice(observers.indexOf(observer), 1);
  };

  // 通知所有观察者
  const notify = (data) => {
    observers.forEach(observer => observer(data));
  };

  // 返回一个对象，包含订阅和通知的方法
  return {
    subscribe,
    unsubscribe,
    notify
  };
}

const observeChangeOfCurrentItem = createObservable();
const observeChangeOfCurrentInteractiveObject =  createObservable();
const observeChangeOfInventory =  createObservable();
const chatLogObserver = (interactiveObject)=>{
  if (interactiveObject.current === null) showChatLog = false;
  else showChatLog = true;
  updateChatLog();
};
observeChangeOfCurrentItem.subscribe(updateIButtons);
observeChangeOfCurrentInteractiveObject.subscribe(chatLogObserver);
observeChangeOfCurrentInteractiveObject.subscribe(updateIButtons);
observeChangeOfInventory.subscribe(updateInventory);

