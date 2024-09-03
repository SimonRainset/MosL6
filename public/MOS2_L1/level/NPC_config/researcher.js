

function createResearcher() 
{
    researcher = createInteractiveCharacter({   // 创建 researcher NPC，函数文档见girl.js中相对应的部分
        image:researcherImg, label:'强化学习家', thumbnail:'./pic/thumbnail_researcher.png',scale:0.5,
        systemPrompt:`请你扮演一个研究员，你非常懂强化学习，你经常科普强化学习，但是你每次都只讲一点点。你的意图是让用户帮一个忙，给你一些书或学习用品。如果用户帮你了，你可以给他一些吃的。你的回复简短，不超过30个字`,
        firstMessage: "强化学习，就是RL" ,
        });    
    itemUseDictionary.push({do:"给出", toInteractiveCharacterOf:"强化学习家", withItemOf:"学姐的书", willCause:bookOfLove});     //注册交互行为，文档见duck.js中相对应的部分
    itemUseDictionary.push({do:"给出", toInteractiveCharacterOf:"强化学习家", withItemLike:"学习用品", willCause:researcherGiveFood});
      
}

function researcherGiveFood()    // 所用相关函数文档见duck.js中feedDuck()部分
{
    deleteCurrentItem();
    addChatMessage('谢谢，我给你一些吃的吧');
    addItemLike("吃的东西",true);
    setTimeout(()=>addItemLike("吃的东西",true),500);   
    
}

function bookOfLove()
{
    deleteCurrentItem();
    bubble('接到书的瞬间，学习家脸色一变')
    bubble('这不是学姐的书么？')
    bubble('啊')
    bubble('啊啊')
    bubble('啊啊啊')
    bubble('怎么在你这')
    bubble('难道')
    bubble('学姐已经心有所属？')
    bubble('她喜欢')
    bubble('这个毛头小子么？')
    bubble('？？')
    bubble('？？？')
    bubble('？？？？')
    bubble('不！！')
    bubble('我要证明给她看')
    bubble('学习家手里拿出一个遥控器')
    bubble(`"出来吧，RL3000"`)
    setTimeout(()=>{
        robot = createInteractiveCharacter({  // 创立新角色 Robot
            image:robotImg, label:'RL3000', thumbnail:'./pic/thumbnail_robot.png',scale:0.5,
            systemPrompt:`请你扮演一个机器人RL3000，你拥有强大的能力，可以组装机器人、机器生物等到机器物品。如果用户想让你制作物品，你答应用户，并立刻制作机器物品，请用户稍等片刻。你的回复简短，不超过30个字`,
            firstMessage: "RL3000，实现你的机器人梦想。我可以制作机器物品，你想要试试么，哇哈哈哈！" ,
            onSend :makeRobotEverything      // onSend 文档见 girl.js 创建 girl NPC相应部分
            }); 
        setCurrentInteractiveCharacter(robot);    // 让创立新角色 Robot成为立刻交互的角色

    },4000)
    
    
}

function makeRobotEverything(message)
{
    agent = new P5GLM(); agent.clearAllMessage(); // 临时创建一个大模型Agent类，用于做一些判断
    agent.send(`请判断以这句话是否是想要制作一个机器物品的意思:'''${message}'''。如果是，请回复想要制作的机器物品名称，简单不超过4个字，如果不是，请只回复false`); // 对玩家发送的message做语义判断
    agent.onComplete = (response) =>{
        console.log(response);
        if(response.includes('false')) return;                                      // 回复false说明玩家发送的message并不是要做机器物品
        else {addItem({name:response});bubble(`RL3000制作了${response}`)}            // 玩家要做机器物品，因此addItem此物品。
    }
}