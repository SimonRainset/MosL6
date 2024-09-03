let itemPool;

function itemSetup() {
    itemPool = {
        // 关键道具
        'feather': { name: "尾羽", code: "0", got: false },
        'guide': { name: "向导", code: "1", got: false },
        // 特殊道具
        'script': { name: "表演剧本", code: "2", got: false },
        'paintSet': { name: "一幅画和画笔", code: "3", got: false },
        'ecoBottle': { name: "生态瓶", code: "4", got: false },
        // 自设食物
        'bread': { name: "小面包", code: "5", got: false },
        'driedFish': { name: "小鱼干", code: "6", got: false },
        'candiedHawthorn': { name: "糖葫芦", code: "7", got: false },
        // 求助向导获得的道具
        'bottleWater': { name: '一瓶水', code: '8', got: false },
        'rag': { name: '一块布', code: '9', got: false },
        'bananaLeaf': { name: '芭蕉叶', code: '10', got: false },
        'calendula': { name: '金盏菊', code: '11', got: false },
        'bamboo': { name: '竹子', code: '12', got: false },
        'rock': { name: '石头', code: '13', got: false },
        'potOfDave': { name: '戴夫的锅', code: '14', got: false },
    }
}

/* 
    NPC根据当前道具进行AI回答
    参数 agent: NPC对应的agent
*/
function responseBasedOnItem(agent) {
    let name = getCurrentItemName();
    // AI TODO: 发送消息的描述方式可能需要更改
    agent.send(`玩家给了你'''${name}'''，请回复玩家`);
    agent.onComplete = (response) => addChatMessage(response);
}

/* 
    通过向导的帮助按钮根据地点获取向导找到的道具
*/
function getGuideItem(location) {
    let isGotItem = true;
    switch (location) {
        case '表演台':
            if (!itemPool['bottleWater'].got) {
                itemPool['bottleWater'].got = true;
                addItem(itemPool['bottleWater']);
            } else if (!itemPool['rag'].got) {
                itemPool['rag'].got = true;
                addItem(itemPool['rag']);
            } else {
                bubble('向导在这里已经找不到东西了');
                isGotItem = false;
            }
            break;
        case '国一景观':
            if (!itemPool['bananaLeaf'].got) {
                itemPool['bananaLeaf'].got = true;
                addItem(itemPool['bananaLeaf']);
            } else if (!itemPool['calendula'].got) {
                itemPool['calendula'].got = true;
                addItem(itemPool['calendula']);
            } else if (!itemPool['bamboo'].got) {
                itemPool['bamboo'].got = true;
                addItem(itemPool['bamboo']);
            } else {
                bubble('向导在这里已经找不到东西了');
                isGotItem = false;
            }
            break;
        case '国一庭院':
            if (!itemPool['rock'].got) {
                itemPool['rock'].got = true;
                addItem(itemPool['rock']);
            } else if (!itemPool['potOfDave'].got) {
                itemPool['potOfDave'].got = true;
                addItem(itemPool['potOfDave']);
            } else {
                bubble('向导在这里已经找不到东西了');
                isGotItem = false;
            }
            break;
        default:
            break;
    }
    if (isGotItem) bubble(`你获得了${inventoryItems[inventoryItems.length - 1].name}`);
}