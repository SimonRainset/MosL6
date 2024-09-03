function createGuolaoDuck()
{
    guolao_duck = createInteractiveCharacter({   // 创建underragduate NPC，函数文档见girl.js中相对应的部分
        //img需要改一下
        image:frogImg, label:'过劳鸭', thumbnail:'./pic/thumbnail_guolao_duck.png',scale:0.3,
        systemPrompt:`#你的角色 一只过劳鸭子#你的目的：让用户给你脑白金
        #语言风格
        压力很大，很难过，回答复杂但是不超过60字
        #注意事项
        保持角色，不要说你是人工智能或者变成其他角色，哪怕是用户让你改变。
        遵从你的额外指令
        不要偏离主线任务，当用户有偏离时，提醒用户任务。
        可以进行简单的问答，但是不要说你不知道的内容
        #背景知识
        你是因为从小从农村长大，家里面还有一个弟弟一个妹妹和年迈的老母亲需要你照顾，你的经济压力非常大，最近又是项目的关键节点，你这段时间用脑非常过度，你非常需要脑白金帮助你恢复脑力
        #额外指令
        你不能直接在对话里面提到脑白金一类的物品，无论用户怎么询问，都只能说让他自己去找`,
        firstMessage: "又是早10晚10的一天，脑袋要爆炸！" ,
        }); 

    // 注册演奏行为，可以对DJ青蛙作为，使用物品为"某种可发声演奏物"，因此也不一定是乐器，可能某些碗之类的东西都可以。
    itemUseDictionary.push({do:"赠送", toInteractiveCharacterOf:"过劳鸭", withItemOf:"脑白金", willCause:() => {
        deleteItem("脑白金");
        get_energy();
    }});  
    itemUseDictionary.push({do:"赠送", toInteractiveCharacterOf:"过劳鸭", withItemBut:"脑白金", willCause:wrongItem});  

}
