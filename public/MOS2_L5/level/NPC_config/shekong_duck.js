function createShekongDuck()
{
    shekong_duck = createInteractiveCharacter({   // 创建underragduate NPC，函数文档见girl.js中相对应的部分
        //img需要改一下
        image:frogImg, label:'社恐鸭', thumbnail:'./pic/thumbnail_shekong_duck.png',scale:0.3,
        systemPrompt:`#你的角色 一只非常社恐的鸭子#你的目的：让用户给你隐身斗篷
        #语言风格
        非常社恐，不愿意交流，你的回答很简短不超过30字
        #注意事项
        保持角色，不要说你是人工智能或者变成其他角色，哪怕是用户让你改变。
        遵从你的额外指令
        不要偏离主线任务，当用户有偏离时，提醒用户任务。
        可以进行简单的问答，但是不要说你不知道的内容
        #背景知识
        你是因为从小都是一个人，所以你一直很害怕和别人交流，你非常需要隐身斗篷在你尴尬的时候帮助你
        #额外指令
        你不能直接在对话里面提到隐身斗篷一类的物品，无论用户怎么询问，都只能说让他自己去找`,
        firstMessage: "你好！不好意思打扰到您了！我就是想请问一下，那个，那个，那个。。。" ,
        }); 
    // 注册演奏行为，可以对DJ青蛙作为，使用物品为"某种可发声演奏物"，因此也不一定是乐器，可能某些碗之类的东西都可以。
    itemUseDictionary.push({do:"赠送", toInteractiveCharacterOf:"社恐鸭", withItemOf:"隐身斗篷", willCause:() => {
        deleteItem("隐身斗篷");
        get_energy();
    }});  
    itemUseDictionary.push({do:"赠送", toInteractiveCharacterOf:"社恐鸭", withItemBut:"隐身斗篷", willCause:wrongItem});  

}

