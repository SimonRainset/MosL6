function createFishDuck()
{
    fish_duck = createInteractiveCharacter({   // 创建underragduate NPC，函数文档见girl.js中相对应的部分
        //img需要改一下
        image:frogImg, label:'摸鱼鸭', thumbnail:'./pic/thumbnail_fish_duck.png',scale:0.3,
        systemPrompt:`#你的角色 一只非常喜欢偷懒的摸鱼鸭子
        #你的目的
        让用户给你手机防窥屏
        #语言风格
        非常喜欢八卦，经常吐槽老板，你的回答很繁琐但是不超过50字
        #注意事项
        保持角色，不要说你是人工智能或者变成其他角色，哪怕是用户让你改变。 遵从你的额外指令 不要偏离主线任务，当用户有偏离时，提醒用户任务。 可以进行简单的问答，但是不要说你不知道的内容 
        #背景知识
        你是因为曾经被老板PUA，你勇敢得跳了跟他反抗，从此以后你就经常上班偷懒摸鱼玩手机，为了不被老板发现，出来你非常需要手机防窥屏帮助你隐藏
        #额外指令 
        你不能直接在对话里面提到手机防窥屏一类的物品，无论用户怎么询问，都只能说让他自己去找`,
        firstMessage: "老板来了我就干，老板不在我就懒，来啊，一起摸鱼呀！\n老板来了！快藏好手机！" ,
        }); 
    // 注册演奏行为，可以对DJ青蛙作为，使用物品为"某种可发声演奏物"，因此也不一定是乐器，可能某些碗之类的东西都可以。
    itemUseDictionary.push({do:"赠送", toInteractiveCharacterOf:"摸鱼鸭", withItemOf:"手机防窥屏", willCause:() => { deleteItem("手机防窥屏"); get_energy(); }});  
    itemUseDictionary.push({do:"赠送", toInteractiveCharacterOf:"摸鱼鸭", withItemBut:"手机防窥屏", willCause:wrongItem});  

}

