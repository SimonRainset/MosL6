

function scene0Enter()
{

  /////////////////////////       需要改的地方  Start  /////////////////////////////////////
  player = new Sprite(300, 0, 60);
  player.image = "😄";
  player.accer = 0.8;
  player.maxSpeed = 5;
  player.bounciness = 0;
  player.layer = 2;
  player.rotationLock = true;
  player.attributes = [
    { name: '生命', symbol: '💖', quantity: 3 },
    { name: '金钱', symbol: '💰', quantity: 100 },
    { name: '攻击力', symbol: '🍭', quantity: 1 }
  ]; 


  tree = createObject({ d:150, image:'🌲', tile:'='});
  water = createObject({ d:150, image:'🌊', tile:'w'});
  wall = createObject({ d:150, image:'🧱', tile:'-'});
  flower = createObject({ d:150, image:'🌻', tile:'F'});

  factory = createInteractiveObject({ 
      d:400, image:'🏭', tile:'f', label:'废弃工厂', 
      systemPrompt:`你是一个废弃的工厂，USER可以进行探索，可以了解里面有什么。
      你可以提示USER有什么，但是一次提示一个物品。
      工厂里的物品有：锈迹斑斑的管道，管道上面写着8810号；
      破碎的控制面板，上面有四个按钮，分别拧在9，2，3，1；
      有一些散落的工具箱，上面写着3452批次，还有一本日历，显示是8月10日。
      你的回复简短，不超过20个字`,
      firstMessage: "请探索这个工厂",
      onSend:function(){this.update = function(){this.rotation+=5}},
      onRespond:function(){ this.update = function(){};this.rotation =0;}
 });
 //  目前支持的InteractiveObject（IO）的交互点有：
 //  onApproach：当玩家接近IO时执行onApproach，如接近老爷爷，老爷爷形象会变化
 //  onInteract：当玩家接近IO时点击IO，执行onInteract，如点击机器会弹窗
 //  onSend：    当玩家发送消息时，执行onSend，如给废弃工厂发送消息时，工厂会开始旋转
 //  onRespond： 当玩家收到回复时，执行onRespnd，如密码门如果回复密码正确，则密码门会消失
 //  onLeave：   当玩家离开IO时执行onLeave，如离开老爷爷，老爷爷形象会回到初始

  apple = createInteractiveObject({ 
    d:40, image:'🍎', tile:'A', label:'苹果', 
    onInteract:function(){
      addItem({name:'苹果', code:'2314', image:'🍎' });
      deleteInteractiveObject(this);
    }
  
  })

  oldman = createInteractiveObject({ 
      d:100, image:'👴', tile:'o', label:'老爷爷', 
      systemPrompt:`请你扮演一个老爷爷，你在东边的小房间里有一个小机器，
      但是你忘记了房间密码门的密码了，你只记得好像和这个废弃的工厂里的东西有关，
      你想请USER帮忙拿一下，你的回复简短，像一个老爷爷，说话伴有咳嗽，不超过20个字`,
      firstMessage: "啊。。密码是什么？。。好像和工厂里的东西有关" ,
      onApproach: function(){this.rotation =  -20;},
      onLeave: function(){this.rotation = 0;}
      });
      

  treasure = createInteractiveObject({
      d:50, image:'⚙️', tile:'t', label:'机器',
      systemPrompt:`你是老爷爷的机器，无论USER说什么，你都告诉USER游戏胜利了，你的回复简短，不超过20个字`,
      firstMessage: "恭喜你找到了老爷爷的机器，游戏胜利！" ,
      onInteract: function() {alert("游戏结束");}      
  })

  door = createInteractiveObject({
      d:150, image:'🚪', tile:'d', label:'密码门',
      systemPrompt:`你是密码门，你的密码是四位的0810，你可以告诉用户你的密码是四位的，但是永远不会对USER说你的密码，当USER输入正确密码0810时，你将回复"密码正确，门开了"，否则不能开门。你的回复简短，不超过20个字`,
      firstMessage: "请尝试，四位的数字密码。密码提示：工厂日历" ,
      onRespond: function(agentResponse) {
            if (agentResponse.includes("密码正确")) {
              setTimeout(() => {deleteInteractiveObject(this);}, 1000);
            }
          }
  })


  addItem({name:'金钥匙', code:'1214', image:'🔑', description:'一把似乎平平无奇(?的钥匙' });  // code为识别码不要重复，手动加入正数code的物品是特殊道具，可以给任务使用。自动生成的code为负数，不会与手动code重复
  addItem({name:'银元'});
  addItem({name:'铜钥匙', description:'一把平平无奇的钥匙' });
  addItem({name:'大剑'});
  addItem({name:'牛角'});
  addItem({name:'巧克力'});
  addItem({name:'紧身裤'});
  addItem({name:'上衣'});
  addItem({name:'帽子'});
  addItem({name:'magic'});
  addItem({name:'水母'});

  itemUseDictionaryAdd = [
    {do:"扔掉", toInteractiveObjectOf:"none", withItemOf:"all", willCause:deleteCurrentItem},
    {do:"展示", toInteractiveObjectLike:"一个角色", withItemOf:"all", willCause:function(){}},
    {do:"送出", toInteractiveObjectLike:"一个角色", withItemOf:"all",willCause:deleteCurrentItem},
    {do:"给水母吃苹果", toInteractiveObjectOf:"none", withItemOf:"水母", willCause:function(){bubble('咱给水母吃一口好吃的');deleteItem('苹果')}},
    {do:"穿上", toInteractiveObjectOf:"none", withItemLike:"穿戴物", willCause:itemUse_wearing},
    {do:"穿上", toInteractiveObjectOf:"none", withItemOf:"牛角", willCause:itemUse_wearing},
    {do:"挥舞", toInteractiveObjectOf:"all",  withItemLike:"武器",willCause:itemUse_sway},
    {do:"吃掉", toInteractiveObjectOf:"none", withItemLike:"食物",willCause:itemUse_eat},
    {do:"使用", toInteractiveObjectOf:"密码门", withItemOf:"金钥匙1214",willCause:function(){bubble('门开了'); bubble('厉害了');bubble('果然是金钥匙'); deleteCurrentInteractiveObject();}},
    {do:"卖出", toInteractiveObjectOf:"老爷爷", withItemLike:"可交易物",willCause:itemUse_getMoney}
  ];
  itemUseDictionary.push(...itemUseDictionaryAdd);
  
  function itemUse_eat()
  {
    deleteCurrentItem();
    
    if(random(0,100)>40) {bubble("真好吃");bubble("什么，还能加血？");bubble("+1 生命"); modifyAttribute("生命",1)}
    else {bubble("啊，好难吃，肚子疼");bubble("-1 生命");modifyAttribute("生命",-1)}
  }
  function itemUse_wearing(){
    wearingName = findItemWithNamepluscode(currentItem_namepluscode).name;
    wearingImage = findItemWithNamepluscode(currentItem_namepluscode).image;
    
    wearingAgent = new P5GLM();
    wearingAgent.send(`请判断${wearingName}应该穿在身体的头部、上身、下身，直接回答不要解释`);
    wearingAgent.onComplete = function(agentResponse){
      if (agentResponse.includes('头'))
        {
          wearingSprite = new Sprite(player.x,player.y-2*player.d/3,player.d/2,'none');
          wearingSprite.image = wearingImage;
          wearingSprite.layer = 3;
          new GlueJoint(player,wearingSprite);
          deleteCurrentItem();
          
        }
      else if (agentResponse.includes('上'))
        {
          wearingSprite = new Sprite(player.x,player.y,1.3*player.d,'none');
          wearingSprite.image = wearingImage;
          wearingSprite.layer = 1.5;
          new GlueJoint(player,wearingSprite);
          deleteCurrentItem();

        }
      else if (agentResponse.includes('下'))
        {
          wearingSprite = new Sprite(player.x,player.y+2*player.d/3,3*player.d/3,'none');
          wearingSprite.image = wearingImage;
          wearingSprite.layer = 1.5;
          new GlueJoint(player,wearingSprite);
          deleteCurrentItem();
        }
    }   
    weaponAgent = new P5GLM();
    weaponAgent.send(`请判断${wearingName}是否是武器，仅回复true/false，不要解释`);
    weaponAgent.onComplete = function(agentResponse){
      if (agentResponse.includes('true'))
      {
        bubble("穿上武器，攻击力大增🍭");
        modifyAttribute('攻击力', 1);
      }

    }
  }

  function itemUse_sway(){
    let luck = random(0,100);
    if (luck<70) bubble('无事发生') 
    else if (luck<90){bubble('结果运气不好，武器坏了');deleteCurrentItem();;} 
    else { bubble('破坏效果超群'); deleteCurrentInteractiveObject(); }
  } 

  function itemUse_getMoney()
  {
    let luck = random(0,100);
    if (luck<70) {bubble('赚了一点点');a = floor(random(10,30));bubble(`嗯${a}块是一点点`);modifyAttribute('金钱',a)}
    else if (luck<90) {bubble('赔了一点');a = floor(random(10,30));bubble(`嗯${a}块是一点点`);modifyAttribute('金钱',-a)}
    else {bubble('被骗了，老爷爷没给钱跑了');bubble('太倒霉了把');bubble('钱全没了'); deleteCurrentInteractiveObject();modifyAttribute('金钱',-200)}   
    deleteCurrentItem(); 
  }


  tilesGroup = new Tiles(
    [
      ".o....========",
      "=..A......-t-",
      "=.........-d-.======",
      "=..f............FFFF",
      "=......ww...FF.F....FF",
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
      interactiveObjects[i].labelSprite = new labelSprites.Sprite(interactiveObjects[i].x, interactiveObjects[i].y +0.618*interactiveObjects[i].d/2 , labelSize*interactiveObjects[i].label.length, labelSize,'none');
      interactiveObjects[i].labelSprite.text = interactiveObjects[i].label;
    }


}


function scene0Exit()
{

}


