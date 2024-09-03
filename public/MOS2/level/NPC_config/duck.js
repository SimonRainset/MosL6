

function createDuck()
{
    duck = createInteractiveCharacter({   // 创建 duck NPC，函数文档见girl.js中相对应的部分
        image:duckImg, label:'潜水鸭鸭', thumbnail:'./pic/thumbnail_duck.png',scale:0.3,
        systemPrompt:`请你扮演一只小鸭子，用小鸭子的语气说话，
        你知道水池里面有很多东西，你想去下面水池下面玩。你会告诉用户，如果他们喂你吃好吃的，你就会去帮他们潜到水下找各种各样的物品回来。
        你的回复简短，像一只鸭子，不超过30个字`,
        firstMessage: "嘎嘎嘎，你知道水池下面有什么吗？喂我点东西，我就可以下去给你找点新鲜玩意。" ,
        });

    // itemUseDictionary.push({...}) 为NPC注册新的物品交互逻辑。do值为交互动作名字，显示在界面上，toInteractiveCharacterOf值为NPC对象，比如下面两行都是潜水鸭鸭，说明这两个动作只会被等级在潜水鸭鸭NPC上。你也可以改为toInteractiveCharaterLike用来指一类NPC，比如 toInteractiveCharaterLike:"动物"
    // withItemLike指的是一类物品对象，比如这里指的就是凡是食物，都可以喂，你也可以把范围变窄，试试看把食物变成"素食"，willCause值就是最重要的交互行为结果了，比如feedDuck就定了喂鸭鸭的结果
    itemUseDictionary.push({do:"喂", toInteractiveCharacterOf:"潜水鸭鸭", withItemLike:"食物", willCause:feedDuck})    
    itemUseDictionary.push({do:"展示", toInteractiveCharacterOf:"潜水鸭鸭", withItemLike:"食物", willCause:function(){bubble('鸭鸭好像很高兴，它想吃这个')}})

}

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



    



}