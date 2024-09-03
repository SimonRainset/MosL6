

function scene0Enter()
{


  /////////////////////////       需要改的地方  Start  /////////////////////////////////////
  if (!bufferPlayer)
    {
      player = new Sprite(2000,500, 60);
      player.image = "😄";
      player.accer = 0.8;
      player.maxSpeed = 5;
      player.bounciness = 0;
      player.layer = 2;
      player.rotationLock = true;
    }
    else 
    {
      player = new Sprite();
      player.image = bufferPlayer.image;
      player.x =  bufferPlayer.x;
      player.y =  bufferPlayer.y;
      player.d =  bufferPlayer.d;
      player.accer = 0.8;
      player.maxSpeed = 5;
      player.bounciness = 0;
      player.layer = 2;
      player.rotationLock = true;

    }
  

    
    block = new objects.Group();
    block.d = 150;
    block.image = "❌";
    block.tile = "=";

    water = new objects.Group();
    water.d = 100;
    water.image = "🌊";
    water.tile = "!";


    szguy = new interactiveObjects.Sprite();
    szguy.d = 100;
    szguy.image = "🤵";
    szguy.tile = "a";
    szguy.label = "深圳人";
    szguy.agent = new P5GLM();
    szguy.agent.setSystemPrompt(`你是深圳人，如果USER想要去东深供水工程，你回复"好的，我们走"。你的回复简短，不超过20个字`);
    szguy.agent.messages.push({ role: "assistant", content: "去东深供水工程呀？" });
    szguy.agent.onComplete = function(agentResponse) {
      updateChatLog();
      if (agentResponse.includes("好的，我们走")) {
        switchScene(1);
        
      }
     
    };


    hkguy = new interactiveObjects.Sprite();
    hkguy.d = 100;
    hkguy.image = "👨‍🦳";
    hkguy.tile = "A";
    hkguy.label = "香港人";
    hkguy.agent = new P5GLM();
    hkguy.agent.setSystemPrompt(`你是香港人，如果USER想要去香港净水循环系统，你回复"好的，我们走"。你的回复简短，不超过20个字`);
    hkguy.agent.messages.push({ role: "assistant", content: "去香港净水循环系统么？" });
    hkguy.agent.onComplete = function(agentResponse) {
      updateChatLog();
      if (agentResponse.includes("好的，我们走")) {
        switchScene(2);
        
      }
     
    };


    moguy = new interactiveObjects.Sprite();
    moguy.d = 100;
    moguy.image = "🧒";
    moguy.tile = "1";
    moguy.label = "澳门人";
    moguy.agent = new P5GLM();
    moguy.agent.setSystemPrompt(`你是澳门人，如果USER想要去二龙喉，你回复"好的，我们走"。你的回复简短，不超过20个字`);
    moguy.agent.messages.push({ role: "assistant", content: "去二龙喉么？" });
    moguy.agent.onComplete = function(agentResponse) {
      updateChatLog();
      if (agentResponse.includes("好的，我们走")) {
        switchScene(3);
        
      }
     
    };

    flySpeed  = 60

    szairport = new interactiveObjects.Sprite();
    szairport.d = 200;
    szairport.image = "✈️";
    szairport.tile = "@";
    szairport.label = "深圳机场";
    szairport.agent = new P5GPT();
    szairport.agent.setSystemPrompt(`你是深圳机场，USER会说他的目的地。如果USER想飞香港，请你回复:"好的，准备前往香港"。如果USER想飞澳门，请你回复:"好的，准备前往澳门"。其他请求无法实现。你的回复简短，不超过20个字`);
    szairport.agent.messages.push({ role: "assistant", content: "深圳宝安国际机场欢迎您，请问想去哪呀" });
    szairport.agent.onComplete = function(agentResponse) {
      updateChatLog();
      if (agentResponse.includes("前往香港")) {
        player.collider = 'none';
        player.moveTo(hkairport,flySpeed);
        setTimeout(() => { player.collider = 'd'}, 2000);
      }
      else if (agentResponse.includes("前往澳门")) {
        player.collider = 'none';
        player.moveTo(moairport,flySpeed);
        setTimeout(() => { player.collider = 'd'}, 2000);
      }
    };

    hkairport = new interactiveObjects.Sprite();
    hkairport.d = 200;
    hkairport.image = "✈️";
    hkairport.tile = "#";
    hkairport.label = "香港机场";
    hkairport.agent = new P5GPT();
    hkairport.agent.setSystemPrompt(`你是香港机场，USER会说他的目的地。如果USER想飞深圳，请你回复:"好的，准备前往深圳"。如果USER想飞澳门，请你回复:"好的，准备前往澳门"。其他请求无法实现。你的回复简短，不超过20个字`);
    hkairport.agent.messages.push({ role: "assistant", content: "香港國際機場歡迎您，請問想去哪呀？" });
    hkairport.agent.onComplete = function(agentResponse) {
      updateChatLog();
      if (agentResponse.includes("前往深圳")) {
        player.collider = 'none';
        player.moveTo(szairport,flySpeed);
        setTimeout(() => { player.collider = 'd'}, 2000);
      }
      else if (agentResponse.includes("前往澳门")) {
        player.collider = 'none';
        player.moveTo(moairport,flySpeed);
        setTimeout(() => { player.collider = 'd'}, 2000);
      }
    };

    moairport = new interactiveObjects.Sprite();
    moairport.d = 200;
    moairport.image = "✈️";
    moairport.tile = "%";
    moairport.label = "澳门机场";
    moairport.agent = new P5GPT();
    moairport.agent.setSystemPrompt(`你是澳门机场，USER会说他的目的地。如果USER想飞香港，请你回复:"好的，准备前往香港"。如果USER想飞深圳，请你回复:"好的，准备前往深圳"。其他请求无法实现。你的回复简短，不超过20个字`);
    moairport.agent.messages.push({ role: "assistant", content: "澳門國際機場歡迎您，請問想去哪呀？" });
    moairport.agent.onComplete = function(agentResponse) {
      updateChatLog();
      if (agentResponse.includes("前往香港")) {
        player.collider = 'none';
        player.moveTo(hkairport,flySpeed);
        setTimeout(() => { player.collider = 'd'}, 2000);
      }
      else if (agentResponse.includes("前往深圳")) {
        player.collider = 'none';
        player.moveTo(szairport,flySpeed);
        setTimeout(() => { player.collider = 'd'}, 2000);
      }
    };
   
   
    tilesGroup = new Tiles(
      [
              "====================================================",
              "=!!!!!!!!!.........................................=",
              "=!!!!!!!!!.........................................=",
              "=!!!!!!!!!..@......................................=",
              "=!!!!!!!!!.........a...............................=",
              "=!!!!!!!!..........................................=",
              "=!!!!!!!!..........................................=",
              "=!!!!!!!...........................................=",
              "=!!!!!!!...........................................=",
              "=!!!!!!!!..........................................=",
              "=!!!!!!!!..........................................=",
              "=!!!!!!!!..........................................=",
              "=!!!!!!!!..........................................=",
              "=!!!!!!!!!!........................................=",
              "=!!!!!!!!!!........................................=",
              "=!!!!!!!!.....!!!!!!!!!!!..........................=",
              "=!!!!!!!!.....!!!!!!!!!!!..........................=",
              "=!!!!!!....!!!!!!!!!!!!!!!!!!!.....................=",
              "=!!!!!!....!!!!!!!!!!!!!!!!!!!.....................=",
              "=!!!!...!!!!!!!!!!!!!!!!!..........................=",
              "=!!!!...!!!!!!!!!!!!!!!!!..........................=",
              "=!!!!!!!!!!!!!!!!!!!!!.............................=",
              "=!!!!!!!!!!!!!!!!!!!!!.............................=",
              "=!!!!!!!!!!!!!!!!!.................................=",
              "=!!!!!!!!!!!!!!!!!.................................=",
              "=!!!!!!!!!!!!!!!...................................=",
              "=!!!!!!!!!!!!!!!...................................=",
              "=!!!!!!!!!!!.......................................=",
              "=!!!!!!!!!!!.......................................=",
              "=!!!!!!!!!!!!!!!...................................=",
              "=!!!!!!!!!!!!!!!...............A...................=",
              "=!!!!!!!!!!!!!!!!!!!!!!............................=",
              "=!!!!!!!!!!!!!!!!!!!!!!............................=",
              "=!!!!!!!!!!!!!!!!!!!!!!!!!...!!!...................=",
              "=!!!!!!!!!!!!!!!!!!!!!!!...........................=",
              "=!!!!!!!!!!!!!!!!!!!!!....!!!!!!!!.................=",
              "=!!!!!!!!!!!!!!!!!!!!!....!!!!!!!!.................=",
              "=!!!!!!!!!!!!!!!!!!....!!!!!!!!!!..!!!!!!....!!!!!!=",
              "=!!!!!!!!!!!!!!!!!!....!!!!!!!!!!..!!!!!!....!!!!!!=",
              "=!!!!!!!!!!............!!!!!!!!!!!.............!!!!=",
              "=!!!!!!!!!!....#.......!!!!!!!!!!!.............!!!!=",
              "=!!!!!!..............!!!!!!!!!!!................!!!=",
              "=!!!!!!..............!!!!!!!!!!!................!!!=",
              "=!!!!!..!!!!!!!!...!!!!!!!!!!!!!!!!!!!!!!........!!=",
              "=!!!!!..!!!!!!!!...!!!!!!!!!!!!!!!!!!!!!!........!!=",
              "=!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!....!!!!.!!=",
              "=!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!........!..!!!!.!!=",
              "=!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!...!!!!!!!!!!!!!!!!=",
              "=!!!!!!!!!!!!!!!!!!!!!!!!!!!!!...!!!!!!!!!!!!!!!!!!=",
              "=!!!!!!!!!!!!!!!!!!!!!!!!!!!...!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!!!!!!!!!!!!!!!!!!!!!...!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!!!!!!!!!!!!!!!!!!!...!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!!!........!!!!!!...!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!!................!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!!..............!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!!............!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!.............!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!.............!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!..........%..!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!..............!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!......1.......!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!.............!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!.............!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!..............!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!.................!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!................!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!................!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!................!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!................!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!...............!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!!...............!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!!...............!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!!!...............!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "=!!!!.................!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=",
              "====================================================",
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

  //if (mainSceneAgents.length>0) popAgents();




}


function scene0Exit()
{
  if (!bufferPlayer) bufferPlayer = new Sprite();
  bufferPlayer.x = player.x;
  bufferPlayer.y = player.y;
  bufferPlayer.d = player.d;
  bufferPlayer.image = player.image;
  bufferPlayer.visible = false;

}
