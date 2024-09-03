let performerItemCnt = 0;

function createPerformer() {
    performer = createInteractiveCharacter({
        image: performerImg, label: "表演狂人", thumbnail: "./pic/thumbnail/performer_thumb.png", scale: 0.4,
        // AI TODO: 根据剧情更改角色初始设置
        systemPrompt: `#你的角色 一个表演狂人`,
        firstMessage: "你好",
    });

    itemUseDictionary.push(...[
        { do: "给出", toInteractiveCharacterOf: "表演狂人", withItemOf: "all", willCause: performerGetItem },

        { do: "展示", toInteractiveCharacterOf: "表演狂人", withItemOf: "表演剧本", willCause: () => responseBasedOnItem(performer.agent) },
        { do: "展示", toInteractiveCharacterOf: "表演狂人", withItemOf: "一幅画和画笔", willCause: () => responseBasedOnItem(performer.agent) },
        { do: "展示", toInteractiveCharacterOf: "表演狂人", withItemOf: "生态瓶", willCause: () => responseBasedOnItem(performer.agent) },
        { do: "展示", toInteractiveCharacterOf: "表演狂人", withItemOf: "小面包", willCause: () => responseBasedOnItem(performer.agent) },
        { do: "展示", toInteractiveCharacterOf: "表演狂人", withItemOf: "小鱼干", willCause: () => responseBasedOnItem(performer.agent) },
        { do: "展示", toInteractiveCharacterOf: "表演狂人", withItemOf: "糖葫芦", willCause: () => responseBasedOnItem(performer.agent) },
        { do: "展示", toInteractiveCharacterOf: "表演狂人", withItemOf: "尾羽", willCause: () => responseBasedOnItem(performer.agent) },
        
        { do: "提示", toInteractiveCharacterOf: "表演狂人", withItemOf: "向导", willCause: () => bubble('你可以问问表演狂人在干什么') },
        { do: "帮助", toInteractiveCharacterOf: "表演狂人", withItemOf: "向导", willCause: () => getGuideItem('国一景观') },
        { do: "扔出", toInteractiveCharacterOf: "表演狂人", withItemOf: "向导", willCause: () => bubble('表演狂人和向导鸭一起进行了一段莫名的演出') },
    ]);
}

function performerGetItem() {
    let code = getCurrentItemCode();
    let name = getCurrentItemName();
    if (8 <= code && code <= 14) { // 处理向导找到的道具, TODO: 加入图片
        switch (name) {
            case '一块布':
                break;
            case '一瓶水':
                break;
            case '芭蕉叶':
                break;
            case '竹子':
                break;
            case '金盏菊':
                break;
            case '石头':
                break;
            case '戴夫的锅':
                break;
            default:
                bubble('出现预期外的错误');
                break;
        }
        if (++performerItemCnt == 3) {
            addItem(itemPool['script']);
            // AI TODO: NPC给玩家特殊道具后由AI来提示和回复玩家
            addChatMessage('给你剧本');
        }
    } else if (code < 0) {         // 处理AI生成道具
        // AI TODO: 发送消息的描述方式可能需要更改
        painter.agent.send(`请根据如下道具生成一段表演过程，用文字描述:'''${name}'''。`);
        painter.agent.onComplete = (response) => addChatMessage(response);
    } else {                       // 处理特殊道具
        addChatMessage('这个对你有特殊用途，不用给我');
    }
}

