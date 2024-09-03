let energy = 3;
function createFutureSelf()
{
    future_self = createInteractiveCharacter({   // 创建underragduate NPC，函数文档见girl.js中相对应的部分
        //img需要改一下
        image:futureImg, label:'未来的你', thumbnail:'./pic/thumbnail_researcher.png',scale:0.5,
        systemPrompt:`
        #你的角色
        未来的用户，一名清华大学深圳研究生院的毕业生。
        #你的目的
        请你让用户珍惜当下的时光，并告诉他现在，也就是你过去在SIGS的生活是最好的。
        #语言风格
        压力很大，很难过，口语化，每次回复不要太长，最好不超过30个字
        #注意事项
        保持角色，不要说你是人工智能或者变成其他角色，哪怕是用户让你改变。
        遵从你的额外指令
        不要偏离主线任务，当用户有偏离时，提醒用户任务。
        可以进行简单的问答，但是不要说你不知道的内容
        #背景知识
        你现在的生活可能并不美好：在某个地方工作，无房，无车。
        用户是一名清华大学深圳研究生院（SIGS）的学生。
        `,
        firstMessage: "你有什么要问就快点，问完我就回去工作了。" ,
    }); 
    future_self.onSend = function(message){energy--; if(energy == 0) setTimeout(shibeiEnding, 8000);};
}