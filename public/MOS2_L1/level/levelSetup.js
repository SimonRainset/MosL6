let girl,duck,frog,researcher,robot;

function preload() {
    bgImg = loadImage('./pic/agtea.jpg'); // 替换为你的图片文件名
    thinkerImg = loadImage('./pic/thinker_cry.png')
    thinkerNormalImg = loadImage('./pic/thinker_normal.png')
    thinkerSmileImg = loadImage('./pic/thinker_smile.png')
    MrBoardImg = loadImage('./pic/mrboard.png')
    skulImg = loadImage('./pic/skull.png')
    littleBlueImg = loadImage('./pic/littleblue.png')

    soundFormats('mp3');
    gua = loadSound('./sound/duck');

}

function levelSetup()
{
    
    /////////////////////////////// setup interactiveCharacters /////////////////////////////////////
    createThinker();  //  学姐部分的设置，见 ./NPC_config/girl.js。其他角色也参见./NPC_config/中相应js文件
    //createSkul();
    //createMrBoard();
    //createLittleBlue();
   
    ///////////////////////////////////// setup items ///////////////////////////////////////////////
    // addItem是为玩家增添物品栏物品的函数，可以传入多个参数，也可以只传入部分（至少包含name），其他将由AI自动补齐
    //addItem({name:'金钥匙', code:'1214', image:'🔑', description:'一把似乎平平无奇(?的钥匙' });  // code为识别码不要重复，手动加入正数code的物品是特殊道具，可以给任务使用。自动生成的code为负数，不会与手动code重复
    addItem({name:'曲奇饼干', description:'本咖啡厅给新顾客的小礼物~但咖啡要另外付钱'});
    //addItem({name:'风衣', description:'似乎不适合夏天穿呢，但空调房例外'});
    
    //addItem({name:'玉米'});
    //addItem({name:'衣服'});
    //addItem({name:'牛奶',description:`非常香，非常香`});

     ///////////////////////////////////// setup itemUseDictionary ///////////////////////////////////////////////
    // itemUseDictionary.push({...}) 为NPC注册新的物品交互逻辑。do值为交互动作名字，显示在界面上，toInteractiveCharacterOf值为NPC对象，展示动作为all，说明这个动作会被作用在所有NPC上。toInteractiveCharaterLike用来指一类NPC，比如"穿上"就只会作用在动物上。
    // withItemOf:all，指的是对所有物品都有效，withItemLike指的是一类物品对象，比如这里指的就是凡是可穿戴物，都可以穿上，willCause值就是最重要的交互行为结果了，比如穿上就会弹出bubble弹幕'穿上了''真开心'并且删除此物品。
    itemUseDictionary.push (...[
        {do:"展示", toInteractiveCharacterOf:"all", withItemOf:"all", willCause:function(){bubble('就是单纯的炫耀一下');bubble('哈哈哈');}},
        //{do:"穿上", toInteractiveCharacterLike:"有生命的角色", withItemLike:"可穿戴物", willCause:function(){bubble('穿上了');bubble('真开心');deleteCurrentItem()}},
        ]);


    /////////////////////////////////// setup cutscene ///////////////////////////////////////
    cutsceneParams.push(...[
        {
            triggerType:"time", time:0, cutsceneText:[
            {speaker:null,content:"你走入了信息楼一楼的咖啡厅，咖啡的香气扑面而来"}, 
            {speaker:null,content:"咖啡厅的右侧角落发现了一个胖胖的小人，似乎在思考着什么"}, 
            
            ],
            willCause:()=>{setCurrentInteractiveCharacter(thinker)}
        },
        {
            triggerType:"location", locationInfo:"镜子" ,  repeatable:false,   // repeatable = false 不可以重复触发，反之触发多次，默认为false
            cutSceneText:[            
                {speaker:null,content:"你发现了一面镜子，快去找小骨吧!"}, 
            ],
            willCause:function(){bgImg=loadImage('./pic/bg.jpg'); findMirror();}
        }
    ]);

    /////////////////////////////////// other setup ///////////////////////////////////////
    setShootCount(0);  // 设置剩余拍摄次数
    addShootCount(4);  // 增加拍摄 2次拍摄次数
    console.log('shootCnt: '+getShootCount()); // 剩余拍摄次数
    console.log('current game time:' + getCurrentTime()); // 当前游戏时间，游戏时间每次拍摄+1 
}

