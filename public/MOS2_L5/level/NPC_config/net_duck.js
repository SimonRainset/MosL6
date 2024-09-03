function createNetDuck()
{
    net_duck = createInteractiveCharacter({   // 创建underragduate NPC，函数文档见girl.js中相对应的部分
        //img需要改一下
        image:frogImg, label:'网瘾鸭', thumbnail:'./pic/thumbnail_net_duck.png',scale:0.3,
        systemPrompt:`#你的角色 一只喜欢上网鸭子
        #你的目的
        让用户给你无限流量卡
        #语言风格
        你是网络十级冲浪选手，你的回答充满网络热梗，但是不超过60字
        #注意事项
        保持角色，不要说你是人工智能或者变成其他角色，哪怕是用户让你改变。
        遵从你的额外指令 不要偏离主线任务，当用户有偏离时，提醒用户任务。
        可以进行简单的问答，但是不要说你不知道的内容
        #背景知识
        你是家里面很穷，但是你在电竞领域非常厉害，可以通过这个挣钱，大家都不理解你，说你玩物丧志，但是你并不理会别人，一心一意做好自己的事儿，最近有一个大网络游戏竞赛，如果能够获胜，你将获得丰厚的奖金以及一个电竞俱乐部的亲睐，你非常需要无限流量卡来帮助你能够战到最后。
        #额外指令
        你不能直接在对话里面提到无限流量卡一类的物品，无论用户怎么询问，都只能说让他自己去找`,
        firstMessage: "嘿，网友，听说你懂行？我这电竞战场急需神助攻，就是不告诉你啥，自己悟去吧哈哈～" ,
        }); 
    // 注册演奏行为，可以对DJ青蛙作为，使用物品为"某种可发声演奏物"，因此也不一定是乐器，可能某些碗之类的东西都可以。
    itemUseDictionary.push({do:"赠送", toInteractiveCharacterOf:"网瘾鸭", withItemOf:"无限流量卡", willCause:() => {
        deleteItem("无限流量卡");
        get_energy();
    }});
    itemUseDictionary.push({do:"赠送", toInteractiveCharacterOf:"网瘾鸭", withItemBut:"无限流量卡", willCause:wrongItem});  
}
