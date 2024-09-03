function createBlackSwan() {
    blackSwan = createInteractiveCharacter({
        image: swanImg, label: "黑天鹅", thumbnail: "./pic/thumbnail/blackswan_thumb.png", scale: 0.4,
        systemPrompt: `#你的角色 一只黑天鹅`,
        // AI TODO: 根据剧情更改角色初始设置
        firstMessage: "我要沙了你",
    });

    // AI TODO: 可能需要像girl.js中设置初始任务和初始指令

    itemUseDictionary.push(...[
        { do: "给出", toInteractiveCharacterOf: "黑天鹅", withItemOf: "尾羽", willCause: levelEnd },

        { do: "喂食", toInteractiveCharacterOf: "黑天鹅", withItemOf: "小面包", willCause: toStage2 },
        { do: "喂食", toInteractiveCharacterOf: "黑天鹅", withItemOf: "小鱼干", willCause: toStage2 },

        { do: "展示", toInteractiveCharacterOf: "黑天鹅", withItemOf: "all", willCause: function () { bubble("...?") } },

        { do: "提示", toInteractiveCharacterOf: "黑天鹅", withItemOf: "向导", willCause: function () { bubble("问问黑天鹅它的羽毛有什么力量") } },
        { do: "扔出", toInteractiveCharacterOf: "黑天鹅", withItemOf: "向导", willCause: waveWings },
    ])
}

function levelEnd() {
    // TODO
}

function toStage2() {
    // TODO: 可能要改文案或提示形式
    bubble("黑天鹅停止了攻击");
    bubble("它向你求助，希望你能帮它找回尾羽");
    bubble("尾羽有某种神奇的力量");
    bubble("解锁了其他场景");

    // TODO: 解锁场景

    // AI TODO: 更新Prompt
}

function waveWings() {
    // TODO: 画面效果？
    bubble("两只动物开始面对面挥动翅膀");
}