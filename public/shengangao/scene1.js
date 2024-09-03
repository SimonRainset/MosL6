function scene1Enter()
{
 
  ///////////////////////////////  需要改的地方 begin /////////////////////////////////////////

  player = new Sprite(300, 0, 60);
player.image = "😄";
player.accer = 0.8;
player.maxSpeed = 5;
player.bounciness = 0;
player.layer = 2;
player.rotationLock = true;

tree = new objects.Group();
tree.d = 150;
tree.image = "🧱";
tree.tile = "=";

water = new objects.Group();
water.d = 150;
water.image = "🧱";
water.tile = "w";

wall = new objects.Group();
wall.d = 150;
wall.image = "🧱";
wall.tile = "-";

flower = new objects.Group();
flower.d = 100;
flower.image = "🌻";
flower.tile = "F";

flower = new objects.Group();
flower.d = 100;
flower.image = "🌷";
flower.tile = "Y";



factory = new interactiveObjects.Sprite(); //注意这里交互物体必须是Sprite才能有agent
factory.d = 100;
factory.image = "👨‍🔧";
factory.tile = "f";
factory.label = "资深工程师";
factory.agent = new P5GLM();
factory.agent.setSystemPrompt(
   `你是一位资深工程师，你知道有什么工具可以清理杂物，可以清理杂物的工具分别是高压气枪，管道疏通器和弹簧钻头。USER可以问你问题。工具有：木铲子；高压气枪；皮塞子；铁丝；拖把；管道疏通器；弹簧钻头。你可以告诉USER有什么工具，一次提示三个工具，其中一定且只能包含二个可以清理杂物的工具和一个不可以清理杂物的工具。当USER主动提及可以使用的工具时，你需要回复四个字“试试看吧”。你的回复简短，不超过20个字`
);
factory.agent.messages.push({ role: "assistant", content: "我知道很多工具，你可以问问我，我会告诉你一些对的工具和一些错的工具" });

oldman = new interactiveObjects.Sprite(); //注意这里交互物体必须是Sprite才能有agent
oldman.d = 100;
oldman.image = "😷";
oldman.tile = "o";
oldman.label = "缺水的人";
oldman.agent = new P5GLM();
oldman.agent.setSystemPrompt(
  `请你扮演一个缺水的人，东江的供水口被杂物堵塞了，但是你不知道该用什么工具清理，你只知道或许在东边的资深工程师知道一些消息，你想请USER帮忙去问一下，你的回复简短，像一个口渴的人，说话伴有咳嗽，要表示自己不知道用什么工具，带有语气助词，不超过30个字`
);
oldman.agent.messages.push({ role: "assistant", content: "啊。。取水口被堵住了。。没有水喝了。。要用工具清理吧？。。" });

treasure = new interactiveObjects.Sprite();
treasure.d = 50;
treasure.image = "⛒";
treasure.tile = "t";
treasure.label = "取水口";
treasure.agent = new P5GLM();
treasure.agent.setSystemPrompt(
  `你是取水口，无论USER说什么，你都告诉USER游戏胜利了，你的回复简短，不超过20个字`
);
treasure.agent.messages.push({
  role: "assistant",
  content: "恭喜你清理了东江取水口的杂物，游戏胜利！",
});
treasure.agent.onComplete = function() {
  updateChatLog();
  alert("游戏结束");
  switchScene(0);
};


door = new interactiveObjects.Sprite();
door.d = 150;
door.image = "📦";
door.tile = "d";
door.label = "杂物";
door.agent = new P5GLM();
door.agent.setSystemPrompt(
  `你是杂物，你需要用：高压气枪，管道疏通器，弹簧钻头来清理。你只能回复"工具正确，成功清理"或“工具错误，无法清理”。你无法提供任何提示。只有当USER同时回复高压气枪，管道疏通器，弹簧钻头，你才回复"工具正确，成功清理"，否则不能被清理同时只能回复“工具错误，无法清理”。`
);
door.agent.messages.push({
  role: "assistant",
  content: "请同时尝试，三种不同的工具，提示：寻找资深工程师",
});
door.agent.onComplete = function(agentResponse){
  updateChatLog();
  if (agentResponse.includes("工具正确")) {
    setTimeout(() => {
      door.labelSprite.remove();
      door.remove();
      showChatLog = false;
      currentInteractiveObject = null;
    }, 1000);
  }
};

tilesGroup = new Tiles(
  [
    ".o..YYYY=============",
    "=..=...=......-t-.=",
    "=..=...=.==...-d-.======",
    "=..=..............f.FFFF",
    "=......ww...FFFF....FFFF",
    "======wwwwwwwwwwwwwwwwww",
  
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


function scene1Exit()
{

}