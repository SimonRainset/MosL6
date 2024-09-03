let painterItemCnt = 0;

function createPainter() {
    painter = createInteractiveCharacter({
        image: painterImg, label: "艺术疯子", thumbnail: "./pic/thumbnail/painter_thumb.png", scale: 0.4,
        // AI TODO: 根据剧情更改角色初始设置
        systemPrompt: `#你的角色 一个艺术疯子`,
        firstMessage: "你好",
    });

    itemUseDictionary.push(...[
        { do: "给出", toInteractiveCharacterOf: "艺术疯子", withItemOf: "all", willCause: painterGetItem },

        { do: "展示", toInteractiveCharacterOf: "艺术疯子", withItemOf: "表演剧本", willCause: () => responseBasedOnItem(painter.agent) },
        { do: "展示", toInteractiveCharacterOf: "艺术疯子", withItemOf: "一幅画和画笔", willCause: () => responseBasedOnItem(painter.agent) },
        { do: "展示", toInteractiveCharacterOf: "艺术疯子", withItemOf: "生态瓶", willCause: () => responseBasedOnItem(painter.agent) },
        { do: "展示", toInteractiveCharacterOf: "艺术疯子", withItemOf: "小面包", willCause: () => responseBasedOnItem(painter.agent) },
        { do: "展示", toInteractiveCharacterOf: "艺术疯子", withItemOf: "小鱼干", willCause: () => responseBasedOnItem(painter.agent) },
        { do: "展示", toInteractiveCharacterOf: "艺术疯子", withItemOf: "糖葫芦", willCause: () => responseBasedOnItem(painter.agent) },
        { do: "展示", toInteractiveCharacterOf: "艺术疯子", withItemOf: "尾羽", willCause: () => responseBasedOnItem(painter.agent) },

        { do: "提示", toInteractiveCharacterOf: "艺术疯子", withItemOf: "向导", willCause: () => bubble('你可以问问艺术疯子在干什么') },
        { do: "帮助", toInteractiveCharacterOf: "艺术疯子", withItemOf: "向导", willCause: () => getGuideItem('国一景观') },
        { do: "扔出", toInteractiveCharacterOf: "艺术疯子", withItemOf: "向导", willCause: () => guide.image = '🦢' },
    ]);
}

function painterGetItem() {
    let code = getCurrentItemCode();
    let name = getCurrentItemName();
    if (8 <= code && code <= 14) { // 处理向导找到的道具
        switch (name) {
            case '一块布':
                addChatMessage('剩下一个地方是哪儿来着');
                break;
            case '一瓶水':
                addItem({ name: '天鹅湖的画' });
                break;
            case '芭蕉叶':
                addItem({ name: '海洋楼的画' });
                break;
            case '竹子':
                addItem({ name: '二校门' });
                break;
            case '金盏菊':
                addItem({ name: '信息楼一楼' });
                break;
            case '石头':
                addItem({ name: '院碑' });
                break;
            case '戴夫的锅':
                addItem({ name: '1312' });
                break;
            default:
                bubble('出现预期外的错误, 请查看painter.js的drawBasedOnItem函数');
                break;
        }
        if (++painterItemCnt == 3) {
            addItem(itemPool['painSet']);
            // AI TODO: NPC给玩家特殊道具后由AI来提示和回复玩家
            addChatMessage('给你画和画笔');
        }
    } else if (code < 0) {         // 处理AI生成道具
        // AI TODO: 发送消息的描述方式可能需要更改
        painter.agent.send(`请描述用如下道具如何创作一幅画:'''${name}'''。`);
        painter.agent.onComplete = (response) => addChatMessage(response);
    } else {                       // 处理特殊道具
        addChatMessage('这个对你有特殊用途，不用给我');
    }
}


