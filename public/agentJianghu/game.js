let thisgui;
let fps;
let checkbox;
let input;
let button;
let backgroundColor =220;
let textArea = {
    x: 450,
    y: 250,
    width: 250,
    height: 50,
    placeholder: "不超过十个字",
    isTitle: false,  
  };

let content = "";
let GPTforAgent = new P5GPT();
let storyAgent = new P5GPT();
let chatAgent = new P5GPT();
let playerAgent = new XiakeAgent();
let mapData = new JianghuMap();
let map;
let incrementPerFrame = { needOfFood: -0.13, needOfWater: -0.07 , needOfDiscover: -0.09};
let player;
let playerDiscoverRange = 600;
let mapWidth = 8000;
let mapHeight = 8000;
let canvasWidth = 1000;
let canvasHeight= 800;
const Nitems =100;
let items = []; // 存储所有物品实例的数组
let itemTypeData = []; // 存储从JSON文件中读取的物品类型数据
let healthDrop = -0.02;
let gameStatus = 'init';
let beginningPoet ;
let startWords= '';

let sendButton;
let chatInput;
let chatLog;
let scrollBar;
let gameTime = { day: 0, hour: 0, minute: 0 };
let gameLogs = [];
let previousAction, previousTarget;
let mouseItem;
let jhAreas;
let sword,a,enemy;
let xiakeFightAI;


function setup() {

  CA = createCanvas(canvasWidth, canvasHeight);
  CA.position(0,0);
  frameRate(60);

  // 创建管理GUI的系统
  thisgui = createGui();

  // 创建一个复选框
  // checkbox = createCheckbox("流传输", 20, 75, 20, 20, true);
  beginningPoet = jianghuPoet[Math.floor(Math.random() * jianghuPoet.length)];
  button = createButton("走江湖", canvasWidth/2, canvasHeight/2);


  
  player = new Sprite();
  player.x = random(mapWidth*0.4,mapWidth*0.6);
  player.y = random(mapHeight*0.4,mapHeight*0.6);
  player.w = 30;
  player.h = 30;
  player.image = '😆'; 
  player.rotationLock = true;
  player.xiakeAgent = new XiakeAgent();
  

  mapObjects = new Group();
  mapObjects.diameter = 5;
  mapObjects.collider = 's';
  //map.color = 'yellow';

  // map.tile = '=';
  // map = new Tiles(
  //     mapData.tileLines,
  //     0,
  //     0,
  //     map.w + 50,
  //     map.h + 50
  // );

    // 读取物品类型JSON文件
    loadJSON('items.json', (data) => {
      itemTypeData = data; // 将读取的数据存储到itemTypeData数组中
  
      // 根据物品类型创建N个JianghuObject实例
      
      for (let i = 0; i < Nitems; i++) spawnObject();

    });

   // storyAgent.setModel(4);
  sendButton = select('#sendButton');
  chatInput = select('#chatInput');
  chatLog = select('#chatLog');
  sendButton.mousePressed(sendUserMessage);
  //updateLogDisplay();
  //setInterval(generateLogEntry, 1000);
  addItem("金苹果", "🍎", ["food", "material"]);
  addItem("钻石剑", "⚔️", ["weapon", "rare"]);
  addItem("石头", "🥚", ["material", "common"]);


  //hometown init
  jhAreas = new jianghuAreas(400,mapWidth,mapHeight);
  jhAreas.createArea('家乡 ',player.x,player.y,1000,color(230,210,160));
  //console.log('area: '+jhAreas.areaGroups[0].amount);
  const numPoints = 20;
  const angleIncrement = (2 * Math.PI) / numPoints; 
  const R =1200;
  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleIncrement;
    const newX = player.x + R*random(1,2) * Math.cos(angle);
    const newY = player.y + R*random(1,2) * Math.sin(angle);
    jhAreas.createArea('试炼'+i,newX,newY,random(400,1000),color(random(160,230),random(160,230),random(160,230)));
  }

 
  
}





function draw() {
  clear();
  background(backgroundColor);
  
  if (frameCount %20 ===0 ) fps = floor(frameRate());

  if (kb.released('b')) 
    { 
      if (gameStatus!=='battle') 
      {
        button.visible = false; 
        textArea.input.remove();
        sword = new Sprite();
        sword.image = '✊'; 
        sword.rotation = 90;
        sword.collider = 'none';
        gameStatus = 'battle';
        player.x = 0; player.y = 0;
        sword.x = 30; sword.y = 0; sword.scale = 0.5;
        sword.overlaps(player);
        j = new HingeJoint(player, sword);
        j.maxPower = 0.1
        camera.x = 0; camera.y =0;
        enemy = new Sprite();
        enemy.diameter = 30;
        enemy.x = 100;
        enemy.y = 100;
        randomSequence(enemy);
      
        xiakeFightAI = new xiakeFight(player, enemy);




      }
      else gameStatus = 'init'; 
    }

  if(gameStatus === 'battle')
    {
      allSprites.visible = false;
      player.visible = true; enemy.visible = true;
      //sword.visible = true; 
      if (a) a.visible = true;
      sword.rotateTowards(mouse, 0.5, 90);     
      if (kb.pressing('a')) {player.vel.x += -1; if (player.vel.x < -5) player.vel.x = -5;}
      else if (kb.pressing('d')) {player.vel.x += 1; if (player.vel.x > 5) player.vel.x = 5;}
      else if (kb.pressing('w')) {player.vel.y += -1; if (player.vel.y < -5) player.vel.y = -5;}
      else if (kb.pressing('s')) {player.vel.y += 1; if (player.vel.y > 5) player.vel.y = 5;}
      else {
        let damping = 0.9
        player.vel.x*=damping; 
        player.vel.y*=damping;   
      }
      if (mouse.presses())
        {


          a = new Sprite();
          a.image = sword.image ; 
          a.rotation = sword.rotation ;
          a.collider = 'none';
          a.x = sword.x; a.y = sword.y ; a.scale = sword.scale ;
          a.speed = -2;
          a.moveTo(mouse,20);
          a.life = 20
          //a.visible = true;
          


        }
        xiakeFightAI.update();
       // xiakeFightAI.draw();



    }
 
  

  if (gameStatus.includes('init'))
  {
    allSprites.visible = false;
    
 
   fill('white');
   textArea = createTextArea(textArea);
   fill('black');
   textSize(30);
   textAlign(CENTER);
   text(beginningPoet,600,200);
   textAlign(LEFT);
   textSize(12);
   
    textWrap(CHAR);
    text(startWords, 100, 750,600);
    if (button.isPressed) {
      GPTforAgent.send('请根据如下一段文字所描绘的情景生成一个故事的开头，语言幽默，口语化(不超过70字)'+beginningPoet +''+textArea.text, true);
      startWords += beginningPoet +''+textArea.text+' | ';
      GPTforAgent.onStream = (text)=>{startWords+=text};  
      GPTforAgent.onComplete = ()=>{
        gameStatus = 'zoujianghu';
        camera.x = player.x;
        camera.y = player.y;
        setInterval(updateTime, 20);
        button.visible = false; 
        textArea.input.remove();
        storyAgent.send('请根据如下故事的开头，给出主角如下信息{主角:，主角江湖目标:，主角探险倾向（1-5）:主角战斗倾向（1-5）:}，只给出json结果，不做任何解释。故事开头：'+startWords,false);
        storyAgent.onComplete = (t) =>{

          // 使用正则表达式提取JSON字符串
          const jsonRegex = /({[^}]*})/g;
          const match = t.match(jsonRegex);

          if (match) {
          const jsonString = match[0];

          // 替换掉字段中的额外文本
          let cleanedJsonString = jsonString.replace(/(\(1-5\))/g, '');
          cleanedJsonString = cleanedJsonString.replace(/(\（1-5\）)/g, '');
          console.log(cleanedJsonString);

          // 解析处理过的JSON字符串
          const parsedResult = JSON.parse(cleanedJsonString);
          parsedResult.主角探险倾向 = parseInt(parsedResult.主角探险倾向, 10);
          parsedResult.主角战斗倾向 = parseInt(parsedResult.主角战斗倾向, 10);

          // 访问解析后的对象属性
          player.xiakeAgent.name = (parsedResult.主角);            // 输出: 令狐冲
          player.xiakeAgent.objective = (parsedResult.主角江湖目标);    // 输出: 成为武林盟主
          player.xiakeAgent.discoverDesire = parsedResult.主角探险倾向;    // 输出: 7
          player.xiakeAgent.fightDesire = parsedResult.主角战斗倾向;    // 输出: 9
          //console.log(player.xiakeAgent.fightDesire);
          setChatSystemPrompt();
          let a = new P5GPT();
          const s = '请帮我基于如下的故事的开头，生成二十个不重复的江湖地点名称，地点需要与故事有相关性，每个名称不超过5个字，用空格隔开，请只输出这些地点名称，不要给出任何解释。故事的开头为'+startWords;
          console.log(s);
          a.send(s);
          a.onComplete = (t)=>{ 
            const words =t.split(" "); 
            for(let i = 1; i<jhAreas.areaGroups.length;i++)  // '家乡是0，不能变
              {
                if (i<words.length) jhAreas.areaGroups[i].center.text = words[i];
                
              }
           }
        
        
          


          } else {
          console.log("No JSON found in the result.");
          }


        }
      }
    }
  }

  else if (gameStatus.includes('zoujianghu'))
  {
    textWrap(CHAR);
    
    
    allSprites.visible = true;
  ////////////////////////////  P5Play  ///////////////////////////////////
    camera.on();

   // console.time('player.update.need');

    //  UPDATE PLAYER

    // UPDATE PLAYER.update need 
    player.xiakeAgent.updateNeed(incrementPerFrame);

    // UPDATE PLAYER.discover new objects
    for (let i = 0; i<mapObjects.length;i++)
    {
    
      if (dist(player.x,player.y,mapObjects[i].x,mapObjects[i].y) < playerDiscoverRange)
      {
      
        let o = mapObjects[i];
        if (!o.jianghuObject.isDiscovered)
          {
            o.jianghuObject.isDiscovered = true;
                   
            o.w = 20;
            o.h = 20;
            o.image = o.jianghuObject.icon;
          }
          
          
          o.text = ''+o.jianghuObject.name +'\n'+o.jianghuObject.amount +'\n'+ calculateUtility(o.jianghuObject) +'\n';
          o.textSize=15;  
         
        
      
      }
    }
    //console.timeEnd('player.update.need');
    //console.time('player.utility');


    //UPDATE PLAYER.Utility and satisfy need 
    let maxUtility = 0;
    let highestUtilityItem = null;

    // 遍历所有已发现的物体
    for (let i = 0; i < mapObjects.length; i++) {
      const item = mapObjects[i].jianghuObject;
      if (item.isDiscovered) {
        const itemUtility = calculateUtility(item);


        // 如果当前物体的utility值大于已记录的最高utility值，更新最高utility值和对应的物体
        if (itemUtility > maxUtility) {
          maxUtility = itemUtility;
          highestUtilityItem = item;
        }
      }
    }

    //console.timeEnd('player.utility');


    //console.time('player.findneed');





      if (highestUtilityItem) {   // find needs, don't rest, get up 
        let ox = highestUtilityItem.x;
        let oy = highestUtilityItem.y;
        if (dist(ox,oy,player.x,player.y) < 300) player.moveTowards(ox,oy,0.04);
        else player.moveTo(ox,oy,6);
        player.xiakeAgent.target = highestUtilityItem;
        if (dist(ox,oy,player.x,player.y) < 100) 
          {
            highestUtilityItem.useItem(player.xiakeAgent);
            player.xiakeAgent.action = '使用'; 
            //console.log("eating");
          }
          else player.xiakeAgent.action = '前往'; 
        
      }
      else   // no urging need
      {
        if(player.xiakeAgent.target)   // if there is a target 
        {
          if (!player.xiakeAgent.target.isInUse)    // if target is not in use, then rest 
          {
            player.xiakeAgent.action = '休息'; 
            player.xiakeAgent.target = null;
          }
        }
        
      }

      if (previousAction!== player.xiakeAgent.action || previousTarget !== player.xiakeAgent.target)
        {
          generateLogEntry(player.xiakeAgent,'行动');
          setChatSystemPrompt();
        }

  // console.timeEnd('player.findneed');
    




  // console.time('player.control and placeitem');
    
    
    //UPDATE Player Attributes: health ...
    let sortedNeeds = player.xiakeAgent.getNeedsSorted();
    for (let i = 0; i < sortedNeeds.length; i++)  
    {
      if (sortedNeeds[i][1] < -90) {player.xiakeAgent.health += healthDrop;}
    }
    if (player.xiakeAgent.health<0) {camera.zoom = 0.1; noLoop();alert("you died!");}

    //UPDATE Player control 
    if(gameStatus ==='zoujianghu')
      {
        
        if (kb.pressing('a')) {player.vel.x += -1; if (player.vel.x < -5) player.vel.x = -5;}
        else if (kb.pressing('d')) {player.vel.x += 1; if (player.vel.x > 5) player.vel.x = 5;}
        else if (kb.pressing('w')) {player.vel.y += -1; if (player.vel.y < -5) player.vel.y = -5;}
        else if (kb.pressing('s')) {player.vel.y += 1; if (player.vel.y > 5) player.vel.y = 5;}
        else {
          let damping = 0.9
          player.vel.x*=damping; 
          player.vel.y*=damping; 
          
        }
      }
      else if (gameStatus ==='zoujianghu.placeitem')
        { 
          if (kb.pressing('a')) camera.x += -5; 
          else if (kb.pressing('d')) camera.x += 5; 
          else if (kb.pressing('w')) camera.y += -5; 
          else if (kb.pressing('s')) camera.y += 5; 

        }
    

    //Update player previous action and target
    previousAction = player.xiakeAgent.action;
    previousTarget = player.xiakeAgent.target;
    //console.timeEnd('player.control and placeitem');



   //console.time('world');

    //UPDATE WORLD 
    // delete used up , spawn object, and apply effect , make story based on used-up object
    for (let i =0;i<mapObjects.length;i++){
      mapObjects[i].jianghuObject.applyEffect(player.xiakeAgent);
      if (mapObjects[i].jianghuObject.isUsedUp()) 
        {
          let n = mapObjects[i].jianghuObject.name;
          mapObjects[i].remove();
          spawnObject();
          if (random()>0.5)
            {
              //storyAgent.send('在江湖路上，主角使用了如下的物品，请根据前文提到的故事情节，续写一小段不超过50字的主角日记，需要符合主角目标与物品内容。物品为：'+ n +'。请直接给出故事内容，不要说出主角日记几个字');
              //storyAgent.onComplete = (t) =>{
              //startWords+=t;
              //}
            }
          
        }
    
    }

    //console.timeEnd('world');

   // console.time('camera');







    // update camera
    if (kb.pressing(' '))
    {
      camera.zoomTo(0.3);
    }
    else camera.zoomTo(1);

    camera.moveTo(player,2); 

    let item = document.querySelector('.item.active');
    if (gameStatus === 'zoujianghu')
      {
        if (item) {
            gameStatus = "zoujianghu.placeitem";
            backgroundColor = 150;
            mouseItem = new Sprite();
            mouseItem.color = 'grey';
            mouseItem.w = 30;
            mouseItem.h = 30;
            mouseItem.x = mouse.x;
            mouseItem.y = mouse.y; 
            mouseItem.text = item.querySelector('.name').textContent;
            mouseItem.image = item.querySelector('.icon').textContent;
            mouseItem.collider = 'none';

            console.log('placing item');


        }

      }
    else if(gameStatus === 'zoujianghu.placeitem')
      {
        if (!item)
          {
            backgroundColor = 220;
            gameStatus = "zoujianghu";
            console.log('out');
            mouseItem.remove();

          }
      }

    //  console.timeEnd('camera');

    
     // console.time('camera.placeitem');


    // if (kb.released('q'))
    //   {
    //     if (gameStatus ==='zoujianghu') 
    //       { 
    //         backgroundColor = 150;
    //         gameStatus = "zoujianghu.placeitem";
    //         mouseItem = new Sprite();
    //         mouseItem.color = 'grey';
    //         mouseItem.w = 30;
    //         mouseItem.h = 30;
    //         mouseItem.x = mouse.x;
    //         mouseItem.y = mouse.y; 
    //         mouseItem.text = '';
    //         mouseItem.collider = 'none';

    //         console.log('placing item');
    //       }
    //       else if (gameStatus ==='zoujianghu.placeitem') 
    //         {
    //             backgroundColor = 220;
    //             gameStatus = "zoujianghu";
    //             console.log('out');
    //             mouseItem.remove();
    //         }
    //   }


    if (gameStatus ==='zoujianghu.placeitem') 
      {
        if (mouseItem)
          {
            mouseItem.x = mouse.x;
            mouseItem.y = mouse.y; 
            if (mouseY<canvasHeight)
              {
                let x = dist(camera.x,camera.y,mouse.x,mouse.y);
         
                const x1 = 80;
                const y1 = 0.6;
                const x2 = 400;
                const y2 = 4;
                const b = (y2 - (y1 - y2) * x2 / (x1 + x2)) / (x1 * x2);

                // 计算系数 a
                const a = (y1 - b * x1) / (x1 * x1);
              
                // 使用二次函数来计算scrollspeed
                let scrollspeed = a * x * x + b * x ;
                //return scrollspeed;
                if(scrollspeed <0) scrollspeed  = 0;

                camera.moveTo(mouse,scrollspeed); 

              }
            
            
            
           
          }
       
          if (mouse.presses())
            {
              let a = new Sprite();
              a.x = mouse.x;
              a.y = mouse.y;
              a.w = 30;
              a.h = 30;
              a.text = mouseItem.text;
              a.image = mouseItem.image;
              a.overlap(mouseItem);
              item.remove();


            }
        
      } 
     // console.timeEnd('camera.placeitem');

    if (frameCount%20 ===0)console.time('spritedraw');
      
      
      textSize(40);   

    allSprites.draw();
    player.draw();
    camera.off();
    if (frameCount%20 ===0)console.timeEnd('spritedraw');
  ///////////////////////////// P5Play ////////////////////////////////


     // console.time('ui');
    // UPDATE UI
      sortedNeeds = player.xiakeAgent.getNeedsSorted();
      for (let i = 0; i < sortedNeeds.length; i++)  
      {
        fill(0,50,0);
        if (sortedNeeds[i][1] < -70) {fill('red'); }
        text( ''+sortedNeeds[i][0] +': ', 10,10+12*i);
        text( ''+Math.floor(sortedNeeds[i][1]) , 120,10+12*i);
        
      
      }
      text('HEALTH:'+Math.floor(player.xiakeAgent.health),300,10);
      text('主角: '+player.xiakeAgent.name,500,10); 
      text('主角目标: '+player.xiakeAgent.objective,500,10+12);
      text('探索欲望: '+player.xiakeAgent.discoverDesire ,500,10+12*2);
      text('战斗欲望: '+player.xiakeAgent.fightDesire,500,10+12*3);
      fill('black');
      let timeString = `第${gameTime.day}天${String(gameTime.hour).padStart(2, '0')}时${String(gameTime.minute).padStart(2, '0')}分`;
      text(timeString, 800,10);
      text(startWords, 100, 750,600);
      text('FPS: ' +fps, 900, 20); // 将帧率打印到屏幕的(10, 20)位置
    //  console.timeEnd('ui');



  }

  drawGui();
  
    
    
  
}


function calculateUtility(item) {
  // 初始化utility值为0
  let utility = 0;

  // 遍历item的effects属性，计算满足urgingNeed的utility值
  for (let need in item.effects) {
    if (player.xiakeAgent.needs[need] < -70) {
      utility += item.effects[need];
    }
  }

  // 计算物体与玩家之间的距离
  const distance = dist(player.x, player.y, item.x, item.y);

  // 调整utility值与距离d的平方根呈反比
  utility *= 1 / Math.log(distance);

  // 返回计算出的utility值
  return utility;
}

function spawnObject()
{

  
        // 随机选择一个物品类型
        const randomIndex = floor(random(itemTypeData.length));
        const itemConfig = itemTypeData[randomIndex];
  
        // 随机生成物品的地点坐标
        const x = random(mapWidth);
        const y = random(mapHeight);
        itemConfig.x = x;
        itemConfig.y = y;
      
  
        // 创建物品实例并添加到数组中
        //items.push(new JianghuObject(itemConfig));
        let newItem = new mapObjects.Sprite();
        newItem.x =itemConfig.x;
        newItem.y =itemConfig.y;
        textSize(15);
        newItem.text = '';
        newItem.jianghuObject = new JianghuObject(itemConfig);
        




}


function setChatSystemPrompt()
{

  let lastFiveLog = gameLogs.slice(-5);
  let lflString = '';
  if (gameLogs.length>0) for(let l in lastFiveLog){
  //  let timeString = `第${l.gameTime.day}天${String(l.gameTime.hour).padStart(2, '0')}时${String(l.gameTime.minute).padStart(2, '0')}分`;
    lflString += l.content+'\n';
  } 
  let sp= '我们来做角色扮演游戏。你叫' + player.xiakeAgent.name +'，正在这个世界探险。USER是你的同伴。你们目前聊天的主题是兴趣，你很迷茫，没啥兴趣，想要问问USER建议。请你和USER进行自然对话，语言简洁不超过20个字，语言风格粗鄙。你可以参考行动日志：'+lflString +'请按如下json格式生成{"心理活动":"","动作":"","对话内容":""}';
 
  chatAgent.setSystemPrompt(sp);
  //console.log(sp);

}



// 要有中间升级过程，类似rogue   - 升段考试 - 类土豆兄弟游戏，按照克制玩法 1v1 通过几层考试后升级
// interest - > 功法 
// [古玩] -> 某些古玩经历 去古遗迹发掘 领悟了功法 【古代勇士之盾】 【防守】【】
// 功法有四种 tag【功】【防】【移】【辅】 
// 兴趣也会有不同种类，根据不同种类形成克制关系  【欲壑】【闲情】【智趣】 【艺境】【品味】 
//        【欲望】 【情思】 【智趣】 【冲击】 【持久】  
// 还是不要做动作系统先，先做rpg吧 

// 不同地域会有不同的偏好，如果想练不同的功，则需要不同偏好的   

// 基础逻辑是养成，需要有挑战，要有
// interest - 完全涌现  - 过程对话产生，物品交互中产生。涌现出兴趣之后，应该有
// 局外需要管理兴趣？
// need - design 随着人生的成长，需求也不断增加，兴趣也不断成长， 兴趣是过程，最终的目标是涌现与江湖的定义双重作用下生成
// jianghu 目标 - 小目标， 大目标 ， 人生目标 
// 江湖目标 



function addItem(name, icon, tags) {
  const inventory = document.getElementById("inventory");
  const itemDiv = document.createElement("div");
  itemDiv.className = "item";

  itemDiv.dataset.name = name;
  itemDiv.dataset.icon = icon;
  itemDiv.dataset.tags = tags;

  const itemName = document.createElement("span");
  itemName.className = "name";
  itemName.textContent = name;
  itemDiv.appendChild(itemName);

  const itemIcon = document.createElement("span");
  itemIcon.className = "icon";
  itemIcon.textContent = icon;
  itemDiv.appendChild(itemIcon);

  // 为每个物品添加两个标签
  tags.forEach(tag => {
    const itemTag = document.createElement("span");
    itemTag.className = `tag ${tag}`;
    itemTag.textContent = tag;
    itemDiv.appendChild(itemTag);
  });

  itemDiv.addEventListener("click", () => {
    if (itemDiv.classList.contains('active')) {
      // 如果物品已经是active状态，则恢复状态
      itemDiv.classList.remove('active');
    } else {
      // 如果物品不是active状态，则设置为active状态
      document.querySelectorAll('.item.active').forEach(item => {
        item.classList.remove('active');
      });
      itemDiv.classList.add('active');
    }
  });

  inventory.appendChild(itemDiv);
}

async function randomSequence(s) {
	let x = random(-200, 200);
	let y = random(-200, 200);
	//await enemy.rotateTo(x, y, 5);
	await s.moveTo(x, y, 3);
	randomSequence(s);
}