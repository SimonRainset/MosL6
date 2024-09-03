function createJuanwangDuck()
{
    juanwang_duck = createInteractiveCharacter({   // 创建underragduate NPC，函数文档见girl.js中相对应的部分
        //img需要改一下
        image:frogImg, label:'卷王鸭', thumbnail:'./pic/thumbnail_juanwang_duck.png',scale:0.3,
        systemPrompt:`#你的角色 一只非常内卷的鸭子#你的目的：让用户给你防脱洗发水防止脱发
        #语言风格
        非常焦虑，你的回答很简短不超过30字
        #注意事项
        保持角色，不要说你是人工智能或者变成其他角色，哪怕是用户让你改变。
        遵从你的额外指令
        不要偏离主线任务，当用户有偏离时，提醒用户任务。
        可以进行简单的问答，但是不要说你不知道的内容
        #背景知识
        你是因为天天熬夜写论文想要发sci，天天开组会需要汇报所以才秃头的
        #额外指令
        你不能直接在对话里面提到防脱洗发水一类的物品，无论用户怎么询问，都只能说让他自己去找`,
        firstMessage: "我离满绩还差0.01，这次要选一个体育舞蹈给分贼高，但是老师说对个人形象有要求，这可怎么办呢" ,
        }); 
        //这个bubble加在这儿好像不行，需要在前一件事儿中写bubble
        bubble('一根头发从你面前飘过')
        bubble('你惊呼，怎么会有这么没有光泽的鸭毛')
        bubble("秃头鸭满脸焦急")
    // 注册演奏行为，可以对DJ青蛙作为，使用物品为"某种可发声演奏物"，因此也不一定是乐器，可能某些碗之类的东西都可以。
    itemUseDictionary.push({do:"赠送", toInteractiveCharacterOf:"卷王鸭", withItemOf:"防脱洗发水", willCause:() => {
        deleteItem("防脱洗发水");
        get_energy();
    }});  
    itemUseDictionary.push({do:"赠送", toInteractiveCharacterOf:"卷王鸭", withItemBut:"防脱洗发水", willCause:wrongItem});  
}

