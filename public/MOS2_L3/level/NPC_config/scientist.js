let scientistItemCnt = 0;

function createScientist() {
    scientist = createInteractiveCharacter({
        image: scientistImg, label: "科学怪人", thumbnail: "./pic/thumbnail/scientist_thumb.png", scale: 0.4,
        // AI TODO: 根据剧情更改角色初始设置
        systemPrompt: `#你的角色 一个科学怪人`,
        firstMessage: "你好",
    });

    itemUseDictionary.push(...[
        { do: "给出", toInteractiveCharacterOf: "科学怪人", withItemOf: "all", willCause: scientistGetItem },

        { do: "展示", toInteractiveCharacterOf: "科学怪人", withItemOf: "表演剧本", willCause: () => responseBasedOnItem(scientist.agent) },
        { do: "展示", toInteractiveCharacterOf: "科学怪人", withItemOf: "一幅画和画笔", willCause: () => responseBasedOnItem(scientist.agent) },
        { do: "展示", toInteractiveCharacterOf: "科学怪人", withItemOf: "生态瓶", willCause: () => responseBasedOnItem(scientist.agent) },
        { do: "展示", toInteractiveCharacterOf: "科学怪人", withItemOf: "小面包", willCause: () => responseBasedOnItem(scientist.agent) },
        { do: "展示", toInteractiveCharacterOf: "科学怪人", withItemOf: "小鱼干", willCause: () => responseBasedOnItem(scientist.agent) },
        { do: "展示", toInteractiveCharacterOf: "科学怪人", withItemOf: "糖葫芦", willCause: () => responseBasedOnItem(scientist.agent) },
        { do: "展示", toInteractiveCharacterOf: "科学怪人", withItemOf: "尾羽", willCause: () => responseBasedOnItem(scientist.agent) },

        { do: "提示", toInteractiveCharacterOf: "科学怪人", withItemOf: "向导", willCause: () => bubble('你可以问问科学怪人在干什么') },
        { do: "帮助", toInteractiveCharacterOf: "科学怪人", withItemOf: "向导", willCause: () => getGuideItem('国一庭院') },
        { do: "扔出", toInteractiveCharacterOf: "科学怪人", withItemOf: "向导", willCause: () => bubble('科学怪人和向导鸭一起进行了一段莫名的演出') },
    ]);
}

function scientistGetItem() {
    let code = getCurrentItemCode();
    let name = getCurrentItemName();
    if (code < 0 || (8 <= code && code <= 14)) {         // 处理普通道具(包括自设和AI道具)
        // AI TODO: 发送消息的描述方式可能需要更改
        scientist.agent.send(`请根据如下道具生成一段研究报告，用文字描述:'''${name}'''。`);
        scientist.agent.onComplete = (response) => addChatMessage(response);

        if (++scientistItemCnt == 3) {
            addItem(itemPool['ecoBottle']);
            // AI TODO: NPC给玩家特殊道具后由AI来提示和回复玩家
            addChatMessage('给你剧本');
        }
    } else {                       // 处理特殊道具
        addChatMessage('这个对你有特殊用途，不用给我');
    }
}

