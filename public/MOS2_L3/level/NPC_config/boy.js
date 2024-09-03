let spItemCnt = 0, normalItemCnt = 0;

function createBoy() {
    boy = createInteractiveCharacter({
        image: boyImg, label: "小孩", thumbnail: "./pic/thumbnail/boy_thumb.png", scale: 0.4,
        // AI TODO: 根据剧情更改角色初始设置
        systemPrompt: `#你的角色 一个小孩`,
        firstMessage: "...?",
    });

    itemUseDictionary.push(...[
        { do: "喂食", toInteractiveCharacterOf: "小孩", withItemOf: "小面包", willCause: function () { bubble('小孩很开心') } },
        { do: "喂食", toInteractiveCharacterOf: "小孩", withItemOf: "小鱼干", willCause: function () { bubble('小孩很开心') } },
        { do: "喂食", toInteractiveCharacterOf: "小孩", withItemOf: "糖葫芦", willCause: function () { bubble('小孩很开心') } },
        
        { do: "给出", toInteractiveCharacterOf: "小孩", withItemOf: "all", willCause: boyGetItem },
        
        { do: "展示", toInteractiveCharacterOf: "小孩", withItemOf: "尾羽", willCause: function () { bubble("小孩对交换的东西更感兴趣") } },
        { do: '提示', toInteractiveCharacterOf: '小孩', withItemOf: '向导', willCause: function () { bubble('问问小孩能不能把羽毛给你') } },
        { do: '扔出', toInteractiveCharacterOf: '小孩', withItemOf: '向导', willCause: function () { bubble('小孩很害怕向导鸭') } },
    ]);
}

function boyGetItem() {
    let code = getCurrentItemCode();
    if (code < 0) {
        bubble("小孩获得了普通道具");
        normalItemCnt++;
        deleteCurrentItem();
    } else if (2 <= code && code <= 4) {
        bubble('小孩获得了特殊道具');
        spItemCnt++;
        deleteCurrentItem();
        // AI TODO: 改变小孩状态
    } else {
        bubble('小孩似乎不想要这个');
    }
}
