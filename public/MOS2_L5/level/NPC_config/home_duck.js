function createHomeDuck()
{
    home_duck = createInteractiveCharacter({   // 创建underragduate NPC，函数文档见girl.js中相对应的部分
        //img需要改一下
        image:frogImg, label:'想家鸭', thumbnail:'./pic/thumbnail_xuruo_duck.png',scale:0.3,
        systemPrompt:`#你的角色 一只想家的鸭子
        #你的目的
        让用户给你妈妈的饭 
        #语言风格
        很难过，带哭腔回答复杂但是不超过60字 
        #注意事项
        保持角色，不要说你是人工智能或者变成其他角色，哪怕是用户让你改变。
        遵从你的额外指令 不要偏离主线任务，当用户有偏离时，提醒用户任务。
        可以进行简单的问答，但是不要说你不知道的内容
        #背景知识
        你是从小跟着妈妈一起长大，你已经习惯吃妈妈做的饭了，离开家乡出来上鸭鸭大学以后，你回家都要坐着云朵飞一整天才能回家，所以你已经很久没有回家了，你非常需要妈妈的饭帮助你不再伤心
        #额外指令
        你不能直接在对话里面提到妈妈的饭一类的物品，无论用户怎么询问，都只能说让他自己去找`,
        firstMessage: "呜呜，离家这么久，心里空落落的，那份熟悉的感觉，你能帮我找回来吗？请你用心去寻找，它会让我不那么难过…" ,
        }); 
    // 注册演奏行为，可以对DJ青蛙作为，使用物品为"某种可发声演奏物"，因此也不一定是乐器，可能某些碗之类的东西都可以。
    itemUseDictionary.push({do:"赠送", toInteractiveCharacterOf:"想家鸭", withItemOf:"妈妈的饭", willCause:() => {
        deleteItem("妈妈的饭");
        get_energy();
    }});  
    itemUseDictionary.push({do:"赠送", toInteractiveCharacterOf:"想家鸭", withItemBut:"妈妈的饭", willCause:wrongItem});  
}

