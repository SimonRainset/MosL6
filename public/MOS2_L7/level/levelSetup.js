
let bear_L7, goose_L7, forest_L7, lakeGod_L7, snake_L7, sunTree_L7;
let bearL7Img, gooseL7Img, forestL7Img, lakeGodL7Img, snakeL7Img, sunTreeL7Img;

function preload() {
    bgImg = loadImage('./pic/bg.jpg'); // 替换为你的图片文件名

    bearL7Img = loadImage('./pic/interphone.png');
    gooseL7Img = loadImage('./pic/goose.png');
    sunTreeL7Img = loadImage('./pic/sunGod.png');
    lakeGodL7Img = loadImage('./pic/lakeGod.png');
    forestL7Img = loadImage('./pic/forest.png');
    snakeL7Img = loadImage('./pic/snake.png');


    // soundFormats('mp3');
    // gua = loadSound('./sound/duck');

}

function levelSetup() {
    /////////////////////////////// setup interactiveCharacters /////////////////////////////////////
    // createBearGuild();
    createGooseL7();
    createForestL7();

    ///////////////////////////////////// setup items ///////////////////////////////////////////////
    // addItem是为玩家增添物品栏物品的函数，可以传入多个参数，也可以只传入部分（至少包含name），其他将由AI自动补齐
    addItem({ name: '蔬菜' });
    // addItem({name:'牛奶',description:`非常香，非常香`});

    ///////////////////////////////////// setup itemUseDictionary ///////////////////////////////////////////////
    // itemUseDictionary.push({...}) 为NPC注册新的物品交互逻辑。do值为交互动作名字，显示在界面上，toInteractiveCharacterOf值为NPC对象，展示动作为all，说明这个动作会被作用在所有NPC上。toInteractiveCharaterLike用来指一类NPC，比如"穿上"就只会作用在动物上。
    // withItemOf:all，指的是对所有物品都有效，withItemLike指的是一类物品对象，比如这里指的就是凡是可穿戴物，都可以穿上，willCause值就是最重要的交互行为结果了，比如穿上就会弹出bubble弹幕'穿上了''真开心'并且删除此物品。
    itemUseDictionary.push(...[
        { do: "穿上", toInteractiveCharacterLike: "动物", withItemLike: "可穿戴物", willCause: function () { bubble('穿上了'); deleteCurrentItem() } },
    ]);
    /////////////////////////////////// setup cutscene ///////////////////////////////////////
    cutsceneParams.push(...[
        // {
        //     triggerType: "time", time: 0, cutsceneText: [
        //         { speaker: null, content: "你走入了信息楼，冷气让你感到一哆嗦" },
        //         { speaker: null, content: "迎面走来了一位戴眼镜的女生" },
        //         { speaker: girl, content: "是新生吧，过来过来，我是你们的学姐" },
        //         { speaker: duck, content: "嘎嘎嘎嘎嘎" },
        //         { speaker: frog, content: "新生你好，皮肤好好~嗷嗷嗷嗷" },
        //         { speaker: researcher, content: "强化学习了解一下~" },
        //     ],
        //     willCause: () => { setCurrentInteractiveCharacter(girl) }
        // },
        {
            triggerType: "location", locationInfo: "鹅", repeatable: false,   // repeatable = false 不可以重复触发，反之触发多次，默认为false
            // cutSceneText:[
            // {speaker:null,content:"一股奇怪的味道传来"}, 
            // {speaker:girl,content:"什么味道啊，这是？"}, 
            // {speaker:null,content:"学姐皱着眉，而你在一旁寻找着什么"},
            // {speaker:null,content:"突然，你看到了想要找的东西：DJ青蛙说的那个神奇笔"}],
            willCause: function () { createGoose() }
        }
        // {
        //     triggerType: "generateItem", condition: function () { return random(0, 100) > 0 }, itemCount: 3,    // itemCount <= 5
        //     cutSceneText: [
        //         { speaker: null, content: "你走着走着" },
        //         { speaker: null, content: "发现了一些物品" },
        //         { speaker: null, content: "捡起来吧" }]
        // },
    ]);

    /////////////////////////////////// other setup ///////////////////////////////////////
    setShootCount(0);  // 设置剩余拍摄次数
    addShootCount(3);  // 增加拍摄
    console.log('shootCnt: ' + getShootCount()); // 剩余拍摄次数
    console.log('current game time:' + getCurrentTime()); // 当前游戏时间，游戏时间每次拍摄+1 
}

