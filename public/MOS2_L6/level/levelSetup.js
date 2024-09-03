let girl,duck,frog,researcher,robot,professor,birds,postCard_1,postCard_2, postCard_3;

function preload() {
    bgImg = loadImage('./pic/BackGround/haiyang4.jpg'); // 替换为你的图片文件名
    girlImg = loadImage('./pic/girl.png')
    duckImg = loadImage('./pic/NPC/Duck_Pic.png')
    frogImg = loadImage('./pic/frog.png')
    robotImg = loadImage('./pic/robot.png')
    researcherImg = loadImage('./pic/researcher.png')
    proImg = loadImage('./pic/NPC/Professor_Pic.png')
    birdsImg = loadImage('./pic/NPC/Bird_Pic.png')
    postCardImg_1 = loadImage('./pic/PostCard/Postcards1_text.png')
    postCardImg_2 = loadImage('./pic/PostCard/Postcards2_text.png')
    postCardImg_3 = loadImage('./pic/PostCard/Postcards3_text.png')
    soundFormats('mp3');
    gua = loadSound('./sound/duck');
    // robotComImg1 = loadImage('./pic/ComponentPart/RobotPart1_logo.png');

}

function levelSetup()
{
    
    /////////////////////////////// setup interactiveCharacters /////////////////////////////////////
    var Components = 3;
    //createGirl();  //  学姐部分的设置，见 ./NPC_config/girl.js。其他角色也参见./NPC_config/中相应js文件
    //createFrog();   
    //createResearcher();
    createProfessor();
    proStage2();

    createDuck();
    
    createBirds();   
    birdsStage2();
    // addItem({name:'金钥匙', code:'1214', image:robotComImg1, description:'一把似乎平平无奇(?的钥匙' });  // code为识别码不要重复，手动加入正数code的物品是特殊道具，可以给任务使用。自动生成的code为负数，不会与手动code重复
    
    
    
    // addItem({name:'树叶',});  
    // addItem({name:'宝石' });  
    // addItem({name:'羽毛' });  
    // addItem({name:"机器人螺旋桨"})
    // addItem({name:"机器人潜水仓"})
    // addItem({name:"机器人探照镜"})
    
   
    ///////////////////////////////////// setup items ///////////////////////////////////////////////
    // addItem是为玩家增添物品栏物品的函数，可以传入多个参数，也可以只传入部分（至少包含name），其他将由AI自动补齐
    // addItem(image:"./pic/ComponentPart/RobotPart1_logo.png",)
    /*
    addItem({name:'金钥匙', code:'1214', image:'🔑', description:'一把似乎平平无奇(?的钥匙' });  // code为识别码不要重复，手动加入正数code的物品是特殊道具，可以给任务使用。自动生成的code为负数，不会与手动code重复
    addItem({name:'巧克力'});
    addItem({name:'玉米'});
    addItem({name:'衣服'});
    addItem({name:'牛奶',description:`非常香，非常香`});
    */
     ///////////////////////////////////// setup itemUseDictionary ///////////////////////////////////////////////
    // itemUseDictionary.push({...}) 为NPC注册新的物品交互逻辑。do值为交互动作名字，显示在界面上，toInteractiveCharacterOf值为NPC对象，展示动作为all，说明这个动作会被作用在所有NPC上。toInteractiveCharaterLike用来指一类NPC，比如"穿上"就只会作用在动物上。
    // withItemOf:all，指的是对所有物品都有效，withItemLike指的是一类物品对象，比如这里指的就是凡是可穿戴物，都可以穿上，willCause值就是最重要的交互行为结果了，比如穿上就会弹出bubble弹幕'穿上了''真开心'并且删除此物品。
    itemUseDictionary.push (...[
        {do:"展示", toInteractiveCharacterOf:"all", withItemOf:"all", willCause:function(){bubble('铛铛铛铛');bubble('一股难言的情感使你将它展示出来');bubble('似乎并没有什么事发生......');}},
        // {do:"穿上", toInteractiveCharacterLike:"动物", withItemLike:"可穿戴物", willCause:function(){bubble('穿上了');bubble('真开心');deleteCurrentItem()}},
        {do:"交出", toInteractiveCharacterLike:"研究员", withItemLike:"机器人零件", willCause:function(){bubble('交出了电子部件');bubble('研究员将它安装在机器人上');bubble('机器人看起来更完整了！');deleteCurrentItem()}},  
        // {do:"赠予", toInteractiveCharacterOf:"鸟群", withItemLike:"羽毛或亮闪闪的东西或树叶", willCause:function(){bubble('赠送给了鸟群');bubble('鸟群对这个礼物似乎很满意！');bubble('与鸟群的亲密度大大提高了！');deleteCurrentItem()}},
        // {do:"赠予", toInteractiveCharacterOf:"鸟群", withItemLike:["羽毛","亮闪闪的东西","树叶"], willCause:function(){bubble('赠送给了鸟群');bubble('鸟群对这个礼物似乎很满意！');bubble('与鸟群的亲密度大大提高了！');deleteCurrentItem()}},
        {do:"赠予", toInteractiveCharacterOf:"鸟群", withItemOf:"羽毛", willCause:function(){bubble('鸟群对这个礼物似乎很满意！');bubble('与鸟群的亲密度大大提高了！');deleteCurrentItem()}},
        {do:"赠予", toInteractiveCharacterOf:"鸟群", withItemLike:"亮闪闪的东西", willCause:function(){bubble('鸟群对这个礼物似乎很满意！');bubble('与鸟群的亲密度大大提高了！');deleteCurrentItem()}},
        {do:"赠予", toInteractiveCharacterOf:"鸟群", withItemOf:"树叶", willCause:function(){bubble('鸟群对这个礼物似乎很满意！');bubble('与鸟群的亲密度大大提高了！');deleteCurrentItem()}},
        ]);


    /////////////////////////////////// setup cutscene ///////////////////////////////////////
    cutsceneParams.push(...[
        {
            triggerType:"time", time:0, cutsceneText:[
            {speaker:null,content:"你来到了清华SIGS海洋大楼下"}, 
            {speaker:null,content:"有位年轻的研究员正在搬着一个大箱子"},
            {speaker:null,content:"似乎这位研究员独自搬运这些物品有些吃力"},
            {speaker:null,content:"你大步上前，提出帮忙的请求"},
            {speaker:null,content:"他抬头看向了你，向你微笑"},
            {speaker:professor,content:"“正需要一个人搭把手，谢谢你”"},
            {speaker:null,content:"你上前帮助研究员，和他一起把箱子搬上楼"},
            {speaker:professor,content:"“非常感谢你的帮助！”"},          
            {speaker:null,content:"获得了研究员的联系方式"},          
            {speaker:null,content:"你继续向前走"},
            {speaker:null,content:"遇到了一只鸭子"},
            {speaker:null,content:"它正出神地望向一群鸟儿，嘴里念叨着“好想看看远方的世界啊！”"},
            {speaker:null,content:"去问问它发生了什么吧"},
            ],
            willCause:()=>{setCurrentInteractiveCharacter(professor)},
            
        },
        /*
        {
            triggerType:"location", locationInfo:"笔" ,  repeatable:false,   // repeatable = false 不可以重复触发，反之触发多次，默认为false
            cutSceneText:[
            {speaker:null,content:"一股奇怪的味道传来"}, 
            {speaker:girl,content:"什么味道啊，这是？"}, 
            {speaker:null,content:"学姐皱着眉，而你在一旁寻找着什么"},
            {speaker:null,content:"突然，你看到了想要找的东西：DJ青蛙说的那个神奇笔"}],
            willCause:function(){addItem({name:"神奇笔", code:"1475609", description:"味道独特，也许可以拿给DJ青蛙看看"})}
        },*/
        {
            triggerType:"location", locationInfo:["楼", "清华","建筑","大厦"] ,  repeatable:true,   // repeatable = false 不可以重复触发，反之触发多次，默认为false
            cutSceneText:[
            {speaker:null,content:"在楼里找到了机器人的部件"}, 
            ],
            willCause:function(){
                switch(Components)
                {
                    case 3:
                    addItem({name:"机器人螺旋桨", code:"24678", description:"潜水机器人的螺旋桨，似乎可以用它来组装出一台潜水机器人"})
                    Components -= 1;
                    break;
                    case 2:
                    addItem({name:"机器人潜水仓", code:"24679", description:"机器人的潜水仓，似乎可以用它来组装出一台潜水机器人"})
                    Components -= 1;
                    break;
                    case 1:
                    addItem({name:"机器人探照镜", code:"24670", description:"机器人的探照镜，似乎可以用它来组装出一台潜水机器人"})
                    Components -= 1;
                    break; 
                    default:
                    bubble("好像已经没有机器人的部件了")                             
                }
            }
        },
        {
            triggerType:"location", locationInfo:["植","树","叶","木"] ,  repeatable:true, itemCount:3,  // repeatable = false 不可以重复触发，反之触发多次，默认为false
            cutSceneText:[
            {speaker:null,content:"找到了一片很少见树叶"}, 
            ],
            willCause:function(){addItem({name:"树叶", code:"13579", description:"一片很少见树叶，鸟群似乎对他们很感兴趣"})}
        },
        {
            triggerType:"location", locationInfo:["动物","羽毛"] ,  repeatable:true, itemCount:3,  // repeatable = false 不可以重复触发，反之触发多次，默认为false
            cutSceneText:[
            {speaker:null,content:"找到了一片五光十色的羽毛"}, 
            ],
            willCause:function(){addItem({name:"羽毛", code:"01203", description:"一片五光十色的羽毛，鸟群似乎对他们很感兴趣"})}
        },
        {
            triggerType:"location", locationInfo:["亮闪闪","金属"] ,  repeatable:true, itemCount:3,  // repeatable = false 不可以重复触发，反之触发多次，默认为false
            cutSceneText:[
            {speaker:null,content:"找到了一些闪闪发光的宝石"}, 
            ],
            willCause:function(){addItem({name:"宝石", code:"01204", description:"一块弥足珍贵的宝石，鸟群似乎对他们很感兴趣"})}
        },
        {
            triggerType:"generateItem", condition:function(){return random(0,100)>0}, itemCount:3,    // itemCount <= 5
            cutSceneText:[
            {speaker:null,content:"小鸭子正在前往该地点"}, 
            {speaker:null,content:"小鸭子发现了一些物品"},
            {speaker:null,content:"把他们捡起来吧"}]
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
    addShootCount(10);  // 增加拍摄 2次拍摄次数
    // addShootCount(2);  // 增加拍摄 2次拍摄次数
    console.log('shootCnt: '+getShootCount()); // 剩余拍摄次数
    console.log('current game time:' + getCurrentTime()); // 当前游戏时间，游戏时间每次拍摄+1 
    // //游戏结束逻辑
    // if(getShootCount <= 0 )
    // {
    //     gameOver()
    // } 
    // else
    // {
    //     if()
    //     {

    //         gameOver();
    //     }
    //     if()
    //     {
                
    //         gameOver();
    //     }
        
        
    // }
    if(getShootCount == 0)
    {
        createInstantCutscene(
            cutSceneText = [
                {speaker:null,content:"你费尽心思，好像没能找到什么办法能帮小鸭子去旅行"},
                {speaker:null,content:"你想去问问小鸭子还有没有什么办法，可是它好像已经不在原来的地方了"},
                {speaker:null,content:"几天后，你收到了小鸭子寄来的明信片"},]
            ),
        willCause = ()=>{
            setTimeout(()=>{
                postCard_3 = createInteractiveCharacter({
                    image:postCardImg_3, label:'', thumbnail:'./pic/PostCard/Postcards3_text.png',scale:0.4,
                    systemPrompt:'请你扮演一张明信片，所以什么也不要说',
                    firstMessage:"这是小鸭子徒步环游世界的明信片"
                });
                setCurrentInteractiveCharacter(postCard_3);        
            },4000) 
            deleteInteractiveCharacter(duck)
        }
    }
}

