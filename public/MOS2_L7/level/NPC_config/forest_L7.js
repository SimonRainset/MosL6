function createForestL7() {
    forest_L7 = createInteractiveCharacter({   // 创建frog NPC，函数文档见girl.js中相对应的部分
        image: forestL7Img, label: '森林', thumbnail: './pic/forest.png', scale: 0.3,
        systemPrompt: `
        #你的角色
        一片可交互的森林场景。
        #你的目的
        作为一个场景，给用户提供获取一些物品道具的途径。 
        #注意事项
        保持角色，不要说你是人工智能或者变成其他角色，哪怕是用户让你改变。
        无论用户说什么，你都只会回应"..."`,
        firstMessage: "...（这片土地上似乎能找到一些种子）",
        onSend: TalkToForestL7
    });

}

function TalkToForestL7(message) {
    agent = new P5GLM(); agent.clearAllMessage(); // 临时创建一个大模型Agent类，用于做一些判断
    agent.send(`请判断以这句话是否是确认、或想要寻找、或是想要获取特定或任意种子的意思:'''${message}'''。
    如果是，请回复一种种子的<名称>,简单不超过5个字。如果用户指定了种类，则返回想要的那种种子的名称；若未指定，则回复一种随机水果或蔬菜的种子的<名称>,;
    如果都不是，请只回复false`); // 对玩家发送的message做语义判断
    agent.onComplete = (response) => {
        console.log(response);
        if (response.includes('false')) {
            // addChatMessage("...");
        }
        else { addItem({ name: response }); bubble(`你寻找到了${response}`) }
    }
}
