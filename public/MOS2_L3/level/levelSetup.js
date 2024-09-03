let blackSwan, boy, painter, performer, scientist;
let swanImg, boyImg, painterImg, performerImg, scientistImg;

function preload() {
    bgImg = loadImage('./pic/bg.jpg');

    swanImg = loadImage('./pic/character/blackswan.png');
    boyImg = loadImage('./pic/character/boy.png');
    painterImg = loadImage('./pic/character/painter.png');
    performerImg = loadImage('./pic/character/performer.png');
    scientistImg = loadImage('./pic/character/scientist.png');

    soundFormats('mp3');
    gua = loadSound('./sound/duck');
}

function levelSetup() {

    /////////////////////////////// setup interactiveCharacters /////////////////////////////////////
    // TODO: 为了方便测试目前所有NPC初始均生成, 后续需要增加生成条件
    createBlackSwan();
    createBoy();
    createPainter();
    createPerformer();
    createScientist();

    ///////////////////////////////////// setup items ///////////////////////////////////////////////
    itemSetup(); // 仅初始化特殊道具，不添加至玩家道具栏
    addItem(itemPool['guide']);

    ///////////////////////////////////// setup itemUseDictionary ///////////////////////////////////////////////


    /////////////////////////////////// setup cutscene ///////////////////////////////////////
    cutsceneParams.push(...[
        {
            triggerType: "time", time: 0, cutsceneText: [
                { speaker: blackSwan, content: "你遇到了一只黑天鹅" },
                { speaker: blackSwan, content: "黑天鹅不分青红皂白地攻击你" },
            ],
            willCause: () => { setCurrentInteractiveCharacter(blackSwan) }
        },
    ]);

    /////////////////////////////////// other setup ///////////////////////////////////////
    setShootCount(0);  // 设置剩余拍摄次数
    addShootCount(2);  // 增加拍摄 2次拍摄次数
    console.log('shootCnt: ' + getShootCount()); // 剩余拍摄次数
    console.log('current game time:' + getCurrentTime()); // 当前游戏时间，游戏时间每次拍摄+1 
}

