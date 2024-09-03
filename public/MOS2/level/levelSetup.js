let girl,duck,frog,researcher,robot;

function preload() {
    bgImg = loadImage('./pic/bg.jpg'); // 替换为你的图片文件名

    girlImg = loadImage('./pic/girl.png')
    duckImg = loadImage('./pic/duck.png')
    frogImg = loadImage('./pic/frog.png')
    robotImg = loadImage('./pic/robot.png')
    researcherImg = loadImage('./pic/researcher.png')
    soundFormats('mp3');
    gua = loadSound('./sound/duck');

}

function levelSetup()
{
    
    /////////////////////////////// setup interactiveCharacters /////////////////////////////////////
    createGirl();  //  学姐部分的设置，见 ./NPC_config/girl.js。其他角色也参见./NPC_config/中相应js文件
    createDuck();
    createFrog();   
    createResearcher();    
   
    ///////////////////////////////////// setup items ///////////////////////////////////////////////
    // addItem是为玩家增添物品栏物品的函数，可以传入多个参数，也可以只传入部分（至少包含name），其他将由AI自动补齐
    addItem({name:'金钥匙', code:'1214', image:'🔑', description:'一把似乎平平无奇(?的钥匙' });  // code为识别码不要重复，手动加入正数code的物品是特殊道具，可以给任务使用。自动生成的code为负数，不会与手动code重复
    addItem({name:'巧克力'});
    addItem({name:'玉米'});
    addItem({name:'衣服'});
    addItem({name:'牛奶',description:`非常香，非常香`});

     ///////////////////////////////////// setup itemUseDictionary ///////////////////////////////////////////////
    // itemUseDictionary.push({...}) 为NPC注册新的物品交互逻辑。do值为交互动作名字，显示在界面上，toInteractiveCharacterOf值为NPC对象，展示动作为all，说明这个动作会被作用在所有NPC上。toInteractiveCharaterLike用来指一类NPC，比如"穿上"就只会作用在动物上。
    // withItemOf:all，指的是对所有物品都有效，withItemLike指的是一类物品对象，比如这里指的就是凡是可穿戴物，都可以穿上，willCause值就是最重要的交互行为结果了，比如穿上就会弹出bubble弹幕'穿上了''真开心'并且删除此物品。
    // withItemBut指除了该物品都有效，比如这里指都是除了金钥匙都能丢掉。
    // withItemButLike指除了该类物品都有效，比如这里指的是除了液体都能切开。
    itemUseDictionary.push (...[
        {do:"展示", toInteractiveCharacterOf:"all", withItemOf:"all", willCause:function(){bubble('就是单纯的炫耀一下');bubble('哈哈哈');}},
        {do:"穿上", toInteractiveCharacterLike:"动物", withItemLike:"可穿戴物", willCause:function(){bubble('穿上了');bubble('真开心');deleteCurrentItem()}},
        {do:"丢掉", toInteractiveCharacterOf:"all", withItemBut:"金钥匙", willCause:function(){bubble('丢进了垃圾桶');deleteCurrentItem()}},
        {do:"切开", toInteractiveCharacterOf:"all", withItemButLike:"液体", willCause:function(){bubble('切开了');bubble('但里面什么都没有');deleteCurrentItem()}},
        ]);


    /////////////////////////////////// setup cutscene ///////////////////////////////////////
    cutsceneParams.push(...[
        {
            triggerType:"time", time:0, cutsceneText:[
            {speaker:null,content:"你走入了信息楼，冷气让你感到一哆嗦"}, 
            {speaker:null,content:"迎面走来了一位戴眼镜的女生"}, 
            {speaker:girl,content:"是新生吧，过来过来，我是你们的学姐"},
            {speaker:duck,content:"嘎嘎嘎嘎嘎"},
            {speaker:frog,content:"新生你好，皮肤好好~嗷嗷嗷嗷"},
            {speaker:researcher,content:"强化学习了解一下~"},           
            ],
            willCause:()=>{setCurrentInteractiveCharacter(girl)}
        },
        {
            triggerType:"location", locationInfo:"笔" ,  repeatable:false,   // repeatable = false 不可以重复触发，反之触发多次，默认为false
            cutSceneText:[
            {speaker:null,content:"一股奇怪的味道传来"}, 
            {speaker:girl,content:"什么味道啊，这是？"}, 
            {speaker:null,content:"学姐皱着眉，而你在一旁寻找着什么"},
            {speaker:null,content:"突然，你看到了想要找的东西：DJ青蛙说的那个神奇笔"}],
            willCause:function(){addItem({name:"神奇笔", code:"1475609", description:"味道独特，也许可以拿给DJ青蛙看看"})}
        },
        {
            triggerType:"generateItem", condition:function(){return random(0,100)>0}, itemCount:3,    // itemCount <= 5
            cutSceneText:[
            {speaker:null,content:"你走着走着"}, 
            {speaker:null,content:"发现了一些物品"},
            {speaker:null,content:"捡起来吧"}]
        },
        {
            triggerType:"generateNPC", condition:function(){return random(0,100)>95}, cutSceneText:[
            {speaker:null,content:"这里。。"}, 
            {speaker:null,content:"怎么。。"},
            {speaker:null,content:"好像。。有东西。。"},
            {speaker:null,content:"走过来了"}]
        }
        
    ]);

    /////////////////////////////////// other setup ///////////////////////////////////////
    setShootCount(0);  // 设置剩余拍摄次数
    addShootCount(2);  // 增加拍摄 2次拍摄次数
    console.log('shootCnt: '+getShootCount()); // 剩余拍摄次数
    console.log('current game time:' + getCurrentTime()); // 当前游戏时间，游戏时间每次拍摄+1 
}

