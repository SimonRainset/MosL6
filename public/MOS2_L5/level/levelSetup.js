let girl,duck,frog,researcher,robot;
var allDuck = [0, 1, 2, 3, 4, 5, 6];
let currentDuck;

function preload() {
    bgImg = loadImage('./pic/bg.jpg'); // 替换为你的图片文件名

    girlImg = loadImage('./pic/girl.png');
    duckImg = loadImage('./pic/duck.png');
    frogImg = loadImage('./pic/frog.png');
    futureImg = loadImage('./pic/researcher.png');
    shibeiImg = loadImage('./pic/robot.png');
    // soundFormats('mp3');
    // gua = loadSound('./sound/duck');

}

function levelSetup()
{
    
    /////////////////////////////// setup interactiveCharacters /////////////////////////////////////
    createGirl();  //  学姐部分的设置，见 ./NPC_config/girl.js。其他角色也参见./NPC_config/中相应js文件
    // createDuck();
    // createFrog();   
    // createResearcher();    
    
    ///////////////////////////////////// setup items ///////////////////////////////////////////////
    // addItem是为玩家增添物品栏物品的函数，可以传入多个参数，也可以只传入部分（至少包含name），其他将由AI自动补齐
    // addItem({name:'金钥匙', code:'1214', image:'🔑', description:'一把似乎平平无奇(?的钥匙' });  // code为识别码不要重复，手动加入正数code的物品是特殊道具，可以给任务使用。自动生成的code为负数，不会与手动code重复
    // addItem({name:'巧克力'});
    // addItem({name:'玉米'});
    // addItem({name:'衣服'});
    // addItem({name:'牛奶',description:`非常香，非常香`});

     ///////////////////////////////////// setup itemUseDictionary ///////////////////////////////////////////////
    // itemUseDictionary.push({...}) 为NPC注册新的物品交互逻辑。do值为交互动作名字，显示在界面上，toInteractiveCharacterOf值为NPC对象，展示动作为all，说明这个动作会被作用在所有NPC上。toInteractiveCharaterLike用来指一类NPC，比如"穿上"就只会作用在动物上。
    // withItemOf:all，指的是对所有物品都有效，withItemLike指的是一类物品对象，比如这里指的就是凡是可穿戴物，都可以穿上，willCause值就是最重要的交互行为结果了，比如穿上就会弹出bubble弹幕'穿上了''真开心'并且删除此物品。
    // withItemBut指除了该物品都有效，比如这里指都是除了金钥匙都能丢掉。
    // withItemButLike指除了该类物品都有效，比如这里指的是除了液体都能切开。
    // itemUseDictionary.push (...[
    //     {do:"展示", toInteractiveCharacterOf:"all", withItemOf:"all", willCause:function(){bubble('就是单纯的炫耀一下');bubble('哈哈哈');}},
    //     {do:"穿上", toInteractiveCharacterLike:"动物", withItemLike:"可穿戴物", willCause:function(){bubble('穿上了');bubble('真开心');deleteCurrentItem()}},
    //     {do:"丢掉", toInteractiveCharacterOf:"all", withItemBut:"金钥匙", willCause:function(){bubble('丢进了垃圾桶');deleteCurrentItem()}},
    //     {do:"切开", toInteractiveCharacterOf:"all", withItemButLike:"液体", willCause:function(){bubble('切开了');bubble('但里面什么都没有');deleteCurrentItem()}},
    //     ]);


    /////////////////////////////////// setup cutscene ///////////////////////////////////////
    cutsceneParams.push(...[
        {
            triggerType:"time", time:0, cutsceneText:[
            {speaker:null,content:"你是SIGS的一名学生，来到了学院最具标志性的建筑——院碑处。"}, 
            {speaker:girl,content:"“欢迎来到院碑，这里是SIGS的象征性建筑。请你对着院碑拍一张照片作为纪念。”"}, 
            {speaker:null,content:"要现在拍照吗，还是待会再拍呢？"},     
            ],
            willCause:()=>{setCurrentInteractiveCharacter(girl)}
        },
        {
            triggerType:"location", locationInfo:"清华大学" ,  repeatable:false,   // repeatable = false 不可以重复触发，反之触发多次，默认为false
            cutSceneText:[
            {speaker:null,content:"你拍下了院碑。"}],
            willCause:function(){ShibeiAppears();}
        }
    ]);

    /////////////////////////////////// other setup ///////////////////////////////////////
    setShootCount(0);  // 设置剩余拍摄次数
    addShootCount(2);  // 增加拍摄 2次拍摄次数
    console.log('shootCnt: '+getShootCount()); // 剩余拍摄次数
    console.log('current game time:' + getCurrentTime()); // 当前游戏时间，游戏时间每次拍摄+1 
}

function CreateRandomDuck() {
    var r = Math.floor(Math.random() * allDuck.length);
    CreateDuck(allDuck[r]);
    allDuck.splice(r, 1);
}

function CreateDuck(i) {
    switch (i){
    case 0:
        createFishDuck();
        currentDuck = fish_duck;
        break;
    case 1:
        createGuolaoDuck();
        currentDuck = guolao_duck;
        break;
    case 2:
        createXuruoDuck();
        currentDuck = xuruo_duck;
        break;
    case 3:
        createJuanwangDuck();
        currentDuck = juanwang_duck;
        break;
    case 4:
        createShekongDuck();
        currentDuck = shekong_duck;
        break;
    case 5:
        createHomeDuck();
        currentDuck = home_duck;
        break;
    case 6:
        createNetDuck();
        currentDuck = net_duck;
        break
    }

}
