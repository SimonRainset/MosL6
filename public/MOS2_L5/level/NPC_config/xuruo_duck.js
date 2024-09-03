function createXuruoDuck()
{
    xuruo_duck = createInteractiveCharacter({   // 创建underragduate NPC，函数文档见girl.js中相对应的部分
        //img需要改一下
        image:frogImg, label:'虚弱鸭', thumbnail:'./pic/thumbnail_xuruo_duck.png',scale:0.3,
        systemPrompt:`#你的角色 一只虚弱的鸭子#你的目的：让用户给你喂能量棒
        #语言风格
        非常虚弱，多加一些咳嗽，你的回答很简短不超过30字
        #注意事项
        保持角色，不要说你是人工智能或者变成其他角色，哪怕是用户让你改变。
        遵从你的额外指令
        不要偏离主线任务，当用户有偏离时，提醒用户任务。
        可以进行简单的问答，但是不要说你不知道的内容
        #背景知识
        你是因为为了贯彻“无体育不清华”的理念，天天锻炼需要消耗大量的能量，才变得虚弱的
        #额外指令
        你不能直接在对话里面提到能量棒一类的物品，无论用户怎么询问，都只能说让他自己去找`,
        firstMessage: "又要去用我的体育补贴了，但是我好累啊，有什么东西可以帮帮我" 
    }); 

    // 注册演奏行为，可以对DJ青蛙作为，使用物品为"某种可发声演奏物"，因此也不一定是乐器，可能某些碗之类的东西都可以。
    itemUseDictionary.push({do:"使用", toInteractiveCharacterOf:"虚弱鸭", withItemOf:"能量棒", willCause: () => {
        deleteItem("能量棒");
        get_energy();
    }});  
    itemUseDictionary.push({do:"赠送", toInteractiveCharacterOf:"虚弱鸭", withItemBut:"能量棒", willCause:wrongItem});  

}