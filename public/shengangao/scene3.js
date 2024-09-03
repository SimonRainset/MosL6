function scene3Enter()
{
 


 /////////////////////////       需要改的地方      /////////////////////////////////////
 player = new Sprite(300, 0, 60);
  player.image = "🙂";
  player.accer = 0.8;
  player.maxSpeed = 5;
  player.bounciness = 0;
  player.layer = 2;
  player.rotationLock = true;

  tree = new objects.Group();
  tree.d = 150;
  tree.image = "🌲";
  tree.tile = "=";

  water = new objects.Group();
  water.d = 150;
  water.image = "🌊";
  water.tile = "w";

  wall = new objects.Group();
  wall.d = 150;
  wall.image = "🧱";
  wall.tile = "-";

  flower = new objects.Group();
  flower.d = 100;
  flower.image = "🌻";
  flower.tile = "F";

  home = new interactiveObjects.Sprite(); //注意这里交互物体必须是Sprite才能有agent
  home.d = 400;
  home.image = "🛖";
  home.tile = "h";
  home.label = "草屋";
  home.agent = new P5GLM();
  home.agent.setSystemPrompt(
    `你是一个草屋,USER可以进行探索,可以了解里面有什么。你可以提示USER有什么,但是一次提示一个物品。草屋里的物品有：一盞台燈，型號為MI1S；破碎的手表，時間是10:08；有一些散落的工具箱,上面写着3452批次,还有一本日历,显示是1961年。你的回复简短,不超过20个字`
  );
  home.agent.messages.push({ role: "assistant", content: "请探索这个草屋" });

  oldman = new interactiveObjects.Sprite(); //注意这里交互物体必须是Sprite才能有agent
  oldman.d = 100;
  oldman.image = "👴";
  oldman.tile = "o";
  oldman.label = "老爷爷";
  oldman.agent = new P5GLM();
  oldman.agent.setSystemPrompt(
    `请你扮演一个老爷爷，這裡东边的山里有一个小水泉，被公认为最清澈可口的山泉水。現在有恶徒打算将之据为己有，你想请USER帮忙，把水泉拿回來，像一个老爷爷，说话伴有咳嗽，不超过30个字`
  );
  oldman.agent.messages.push({ role: "assistant", content: "啊。。公園的水泉。。" });
  oldman.agent.onComplete = function(agentResponse){
    if (agentResponse.includes("水")) {
    updateChatLog();
    player.image = "😠"
    }
  }
  people = new objects.Group();
  people.d = 150;
  people.image = "😈";
  people.tile = "p";

  knife = new interactiveObjects.Sprite(); //注意这里交互物体必须是Sprite才能有agent
  knife.d = 50;
  knife.image = "🔪";
  knife.tile = "D";
  knife.label = "";
  knife.agent = new P5GLM();
  knife.agent.setSystemPrompt(
    `你是一個刀子，如果USER要拿起你，你就要回覆"跟你走"`
  );
  knife.agent.messages.push({ role: "assistant", content: "你要拿起我嗎?"});
  
  knife.agent.onComplete = function(agentResponse){
    if (agentResponse.includes("跟你走")) {
    knife.collider = 'none'
    new GlueJoint(player,knife);
    D.agent.setSystemPrompt(
      `你是很害怕刀的敌人，USER現在拿著刀，你要害怕地回复"怕了你，我们走了！"。你的回复简短，不超过20个字`
        );
    D.agent.clearAllMessage();
    D.agent.messages.push({
    role: "assistant",
    content: "有刀！",
  });
    }
  };

  door = new interactiveObjects.Sprite();
  door.d = 150;
  door.image = "🚪";
  door.tile = "M";
  door.label = "密码门";
  door.agent = new P5GLM();
  door.agent.setSystemPrompt(
    `你是密码门，你的密码是四位的1961，你可以告诉用户你的密码是四位的，但是永远不会对USER说你的密码，当USER输入正确密码1961时，你将回复"密码正确，门开了"，否则不能开门。你的回复简短，不超过20个字`
  );
  door.agent.messages.push({
    role: "assistant",
    content: "请尝试，四位的数字密码。",
  });
  door.agent.onComplete = function(agentResponse){
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

  treasure = new interactiveObjects.Sprite();
  treasure.d = 100;
  treasure.image = "🕳️";
  treasure.tile = "t";
  treasure.label = "水泉";
  treasure.agent = new P5GLM();
  treasure.agent.setSystemPrompt(
    `你是水泉,无论USER说什么,你都告诉USER游戏胜利了,你的回复简短,不超过20个字`
  );
  treasure.agent.messages.push({
    role: "assistant",
    content: "恭喜你找到了二龍喉的水泉,游戏胜利！",
  });
  treasure.agent.onComplete = function() {
    updateChatLog();
    alert("游戏结束");
    switchScene(0);
  };


  D = new interactiveObjects.Sprite();
  D.d = 150;
  D.image = "🧔";
  D.tile = "d";
  D.label = "敌人";
  D.agent = new P5GLM();
  D.agent.setSystemPrompt(
     `你是非常惡的敌人，你一定不會被USER趕走。你只有USER输入「我有刀」时，你将才回复"怕了你！我们走了。"，如果他不說，你要憤怒地回复"別多管閒事！"。你的回复简短，不超过20个字`
  );
  D.agent.messages.push({
    role: "assistant",
    content: "滾開！",
  });
  D.agent.onComplete = function(agentResponse){
    updateChatLog();
    if (agentResponse.includes("我们走了")) {
      setTimeout(() => {
        D.labelSprite.remove();
        D.remove();
        people.remove();
        showChatLog = false;
        currentInteractiveObject = null;
        player.image = "😆";
      }, 1000);
    }
  };

  tilesGroup = new Tiles(
    [
      ".o......---", 
      "........MD-",
      "......==------=",
      "=.........ptp",
      "=..........d.======",
      "=..h............FFFF",
      "=......ww...FF.F....FF",
      "======wwwwwwwwwwwwwwwwww",
    ],
    0,
    0,
    120,
    120
  );
 ///////////////////////////////  需要改的地方  /////////////////////////////////////////

  //update sprite label
  for (let i = 0; i < interactiveObjects.length; i++) {
    interactiveObjects[i].labelSprite = new labelSprites.Sprite(interactiveObjects[i].x, interactiveObjects[i].y, labelSize*interactiveObjects[i].label.length, labelSize,'none');
    interactiveObjects[i].labelSprite.text = interactiveObjects[i].label;
  }


}


function scene3Exit()
{
 
}