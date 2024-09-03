

function createDuck()
{
    duck = createInteractiveCharacter({   // 创建 duck NPC，函数文档见girl.js中相对应的部分
        image:duckImg, label:'旅行鸭鸭', thumbnail:'./pic/NPC/Duck_logo.png',scale:0.8,
        systemPrompt:`请你扮演一只小鸭子，用小鸭子的语气说话，
        你非常想去旅行，但因为不能到达很多地方感到沮丧。你会告诉用户，你非常想出去旅行，如果有机器人或者鸟类的帮助就好了。
        你的回复简短，像一只鸭子，不超过30个字`,
        firstMessage: "嘎嘎嘎，我是一只想要旅行的鸭子，要是有机器或者鸟类朋友的帮助就好了" ,
        });
        itemUseDictionary.push({do:"给出", toInteractiveCharacterOf:"旅行鸭鸭", withItemOf:"海洋机器人", willCause:ending1});
        itemUseDictionary.push({do:"给出", toInteractiveCharacterOf:"旅行鸭鸭", withItemOf:"鸟群的信物", willCause:ending2});

    // itemUseDictionary.push({...}) 为NPC注册新的物品交互逻辑。do值为交互动作名字，显示在界面上，toInteractiveCharacterOf值为NPC对象，比如下面两行都是潜水鸭鸭，说明这两个动作只会被等级在潜水鸭鸭NPC上。你也可以改为toInteractiveCharaterLike用来指一类NPC，比如 toInteractiveCharaterLike:"动物"
    // withItemLike指的是一类物品对象，比如这里指的就是凡是食物，都可以喂，你也可以把范围变窄，试试看把食物变成"素食"，willCause值就是最重要的交互行为结果了，比如feedDuck就定了喂鸭鸭的结果
    // itemUseDictionary.push({do:"喂", toInteractiveCharacterOf:"潜水鸭鸭", withItemLike:"食物", willCause:feedDuck})    
    // itemUseDictionary.push({do:"展示", toInteractiveCharacterOf:"潜水鸭鸭", withItemLike:"食物", willCause:function(){bubble('鸭鸭好像很高兴，它想吃这个')}})

}

function ending1()
{
    deleteCurrentItem();
    /*
    createInstantCutscene(
        cutSceneText = [
            {speaker:null,content:"你把研究员给你的海洋机器人交给了小鸭子"},
            {speaker:duck,content:"“嘎嘎？！这是！海洋楼的载人海洋机器人！”"},
            {speaker:duck,content:"“你是要把它给我吗嘎？！”"},
            {speaker:null,content:"你向小鸭子演示了机器人的用法并告诉他可以给它使用一段时间"},
            {speaker:duck,content:"“谢谢你嘎！那我就可以去海底旅行了嘎！”"},
            {speaker:null,content:"小鸭子带着海洋机器人开心的离开了"},
        ]
    )*/
    bubble('小鸭子乘着海洋机器人开心地向深海进发了')
    bubble('失去物品：海洋机器人')
    setTimeout(()=>{
        postCard_1 = createInteractiveCharacter({
            image:postCardImg_1, label:'', thumbnail:'./pic/PostCard/Postcards1_text.png',scale:0.4,
            systemPrompt:'请你扮演一张明信片，所以什么也不要说',
            firstMessage:"这是小鸭子成功使用海洋机器人遨游大海的明信片"
        });
        setCurrentInteractiveCharacter(postCard_1);        
    },4000)
}

function ending2()
{
    deleteCurrentItem();
    bubble('小鸭子带着鸟群的信物去寻求它们的帮助了')
    bubble('失去物品：鸟群的信物')
    setTimeout(()=>{
        postCard_2 = createInteractiveCharacter({
            image:postCardImg_2, label:'', thumbnail:'./pic/PostCard/Postcards2_text.png',scale:0.4,
            systemPrompt:'请你扮演一张明信片，所以什么也不要说',
            firstMessage:"这是小鸭子在鸟群的帮助下遨游世界的明信片"
        });
        setCurrentInteractiveCharacter(postCard_2);        
    },4000)
}

/*
function feedDuck(){ 

    addChatMessageFromSelf(`给你${ getCurrentItemName()}${getCurrentItemImage()}哇`);             // 用于为当前对话记录人为添加一行自己发的记录
    setTimeout(()=>{addChatMessage(`哇，谢谢啦，我有力气潜水啦。我去看看水下有什么好玩意`)},1000);    // 用于延时1000ms为当前对话记录人为添加一行收到的记录
    deleteCurrentItem();   
    bubble('鸭鸭去潜水了')                                                                      // 删除当前的物品，喂完当然就没了
    duck.rotationSpeed = 20; 
    duck.update = function(){this.scale*=0.98;}
    gua.play(); 
    setTimeout(()=>{
        duck.rotationSpeed = 0;
        duck.scale = 0.3;
        duck.rotation = 0;
        duck.update = ()=>{};
        
        bubble('鸭鸭找到了新物品，送给你啦')                                                            // bubble就是弹幕，想提示什么就都放在这
        addItemLike('任何物品',true);                                                                 // addItemLike可以为玩家添加一类物品，比如addItemLike('魔法物品')，这里我们认为鸭鸭可以潜水发现任何物品。你可以改为魔法物品试试；true代表会发送一条弹幕通知
        bubble('哈哈哈')
        bubble('真开心')


    },3000);
*/


    
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



