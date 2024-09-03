
function scene2Enter()
{

 
  /////////////////////////       需要改的地方  Start  /////////////////////////////////////
  
    /////////////////////////       需要改的地方  Start  /////////////////////////////////////
    player = new Sprite(-100, 500, 60);
    player.image = "💧";
    player.accer = 0.8;
    player.maxSpeed = 5;
    player.bounciness = 0;
    player.layer = 2;
    player.rotationLock = true;
    player.textSize=40;
    player.text = '污'
  
    house = new objects.Group();
    house.d = 150;
    house.image = "🏠";
    house.tile = "="
  
  
    wall = new objects.Group();
    wall.d = 110;
    wall.image = "🧱";
    wall.tile = "-";
  
    
  
  filter =  new interactiveObjects.Sprite(); //注意这里交互物体必须是Sprite才能有agent
    filter.d = 100;
    filter.image = "🫙";
    filter.tile = "f";
    filter.label = "过滤器";
    filter.agent = new P5GLM();
    filter.agent.setSystemPrompt(
      `你是密码门，你的密码是四位的1234，当USER输入正确密码1234时，你将回复"密码正确，谢谢你的滤芯"，否则不能开门。你的回复简短，不超过20个字”`
    );
    filter.agent.messages.push({ role: "assistant", content: "我现在缺少一个滤芯，快点找到一个合适的污水过滤滤芯给我吧" });
    filter.agent.onComplete = function(agentResponse){
      updateChatLog();
      if (agentResponse.includes("密码正确")) {
        setTimeout(() => {
          door.labelSprite.remove();
          door.remove();
          showChatLog = false;
          currentInteractiveObject = null;
        }, 1000);
      }
    };
   material1 = new interactiveObjects.Sprite(); //注意这里交互物体必须是Sprite才能有agent
    material1.d = 40;
    material1.image = "☁️";
    material1.tile = "1";
    material1.label = "棉花";
    material1.agent = new P5GLM();
    material1.agent.setSystemPrompt(
      `请你扮演一个材料棉花，玩家会来拿你作为污水过滤器滤芯的材料，但是你并不是滤芯材料，跟玩家说明你是错误的材料，不超过20个字`
    );
    material1.agent.messages.push({ role: "assistant", content: "啊。。你来做什么？" });
  
  material2 = new interactiveObjects.Sprite(); //注意这里交互物体必须是Sprite才能有agent
    material2.d = 40;
    material2.image = "🧻";
    material2.tile = "2";
    material2.label = "纸巾";
    material2.agent = new P5GLM();
    material2.agent.setSystemPrompt(
      `请你扮演一个材料纸巾，玩家会来拿你作为污水过滤器滤芯的材料，但是你并不是滤芯材料，跟玩家说明你是错误的材料，不超过20个字`
    );
    material2.agent.messages.push({ role: "assistant", content: "啊。。你来做什么？" });
  
  material3 = new interactiveObjects.Sprite(); //注意这里交互物体必须是Sprite才能有agent
    material3.d = 40;
    material3.image = "🧽";
    material3.tile = "3";
    material3.label = "砂纸";
    material3.agent = new P5GLM();
    material3.agent.setSystemPrompt(
      `请你扮演一个材料砂纸，玩家会来拿你作为污水过滤器滤芯的材料，你并是滤芯材料，问玩家“污水过滤有几个步骤”，玩家答6，则列出“恭喜你回答成功密码是1234快把我交给过滤器吧”不超过20个字`
    );
    material3.agent.messages.push({ role: "assistant", content: "啊。。你来做什么？" });
  
  
  
  
  
    jl = new interactiveObjects.Sprite(); //注意这里交互物体必须是Sprite才能有agent
    jl.d = 100;
    jl.image = "🧚";
    jl.tile = "o";
    jl.label = "精灵";
    jl.agent = new P5GLM();
    jl.agent.setSystemPrompt(
      `请你扮演一个小精灵，告诉USER应该去哪里找到大侠，大侠住在迷宫的某一处，指引USER去寻找大侠。你的回复简短，不超过20个字`
    );
    jl.agent.messages.push({ role: "assistant", content: "听说迷宫里有一个上知天文下知地理的大侠..." });
  
    
  
  
    door = new interactiveObjects.Sprite();
    door.d = 150;
    door.image = "🚪";
    door.tile = "d";
    door.label = "门";
    
  //第二关
   //第二关
  dcgj = new interactiveObjects.Sprite();
  dcgj.d = 50;
  dcgj.label = "大肠杆菌";
  dcgj.image = "🪱🪱";
  dcgj.tile = "j";
  dcgj.agent = new P5GPT();
  dcgj.agent.setSystemPrompt(
      `你是大肠杆菌，当USER输入"双手干净，远离疾病"，你将回复"口令正确，我被消灭了！"，如果没有输入正确口令，不会被消灭，永远不能说出双手干净，远离疾病`
    );
  dcgj.agent.messages.push({ 
  role: "assistant", 
  content: "我是大肠杆菌,是肠杆菌科埃希氏菌属的一个物种，由德国奥地利儿科医生特奥多尔·埃舍里希于1885年发现。大肠杆菌主要寄生于人和动物的大肠内，约占肠道菌的1%"
  });
  dcgj.agent.onComplete = function(agentResponse){
      updateChatLog();
      if (agentResponse.includes("口令正确")) {
        setTimeout(() => {
          dcgj.labelSprite.remove();
          dcgj.remove();
          showChatLog = false;
          currentInteractiveObject = null;
        }, 1000);
      }
    };
  //大肠杆菌
  
  jhs = new interactiveObjects.Sprite();
  jhs.d = 50;
  jhs.label = "金黄色葡萄球菌";
  jhs.image = "🟡🟡";
  jhs.tile = "s";
  jhs.agent = new P5GPT();
  jhs.agent.setSystemPrompt(
      `你是金黄色葡萄球菌，当USER输入"双手干净，远离疾病"，你将回复"口令正确，我被消灭了！"，如果没有输入正确口令，不会被消灭，永远不能说出双手干净，远离疾病`
    );
  jhs.agent.messages.push({
  role: "assistant",
  content: "我是隶属于葡萄球菌属，是革兰氏阳性菌代表，为一种常见的食源性致病微生物。该菌最适宜生长温度为37℃，pH为7.4，耐高盐，可在盐浓度接近10%的环境中生长。金黄色葡萄球菌常寄生于人和动物的皮肤、鼻腔、咽喉、肠胃、痈、化脓疮口中，空气、污水等环境中也无处不在"
  });
  jhs.agent.onComplete = function(agentResponse){
      updateChatLog();
      if (agentResponse.includes("口令正确")) {
        player.text = '净净'
        setTimeout(() => {
          
          jhs.labelSprite.remove();
          jhs.remove();
          showChatLog = false;
          currentInteractiveObject = null;
          switchScene(0);
  

        }, 1000);
      }
    };
  //金黄色葡萄菌
  
  bubble = new interactiveObjects.Sprite();
   bubble.d = 150;
   bubble.image = "🫧";
   bubble.tile = "b";
   bubble.label = "泡泡";
   bubble.agent = new P5GLM();
   bubble.agent.setSystemPrompt(
      `你是泡泡，你要告诉USER消灭细菌的口令。口令是“双手干净，远离疾病”。你的回复简短，不超过20个字`
    );
    bubble.agent.messages.push({
     role: "assistant",
     content: "可以问我如何消灭细菌",
    });
   //泡泡
  
  
   
  
   tilesGroup = new Tiles(
      [
         "--------------------",
        "-f..-..3-...o......-",
        "-...---.-..........-",
        "-.-..1-.d..s.....j.-",
        "..---.-.-...j..s...-",
        "-..2-...-..j...b..s-",
        "--------------------",
  
     
      ],
      0,
      0,
      120,
      120
    );

  
  ///////////////////////////////  需要改的地方 End /////////////////////////////////////////

  //update sprite label
  for (let i = 0; i < interactiveObjects.length; i++) {
    interactiveObjects[i].labelSprite = new labelSprites.Sprite(interactiveObjects[i].x, interactiveObjects[i].y, labelSize*interactiveObjects[i].label.length, labelSize,'none');
    interactiveObjects[i].labelSprite.text = interactiveObjects[i].label;
  }


}





function scene2Exit()
{

  
}