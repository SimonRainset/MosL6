function createFrog()
{
    frog = createInteractiveCharacter({   // 创建frog NPC，函数文档见girl.js中相对应的部分
        image:frogImg, label:'DJ青蛙', thumbnail:'./pic/thumbnail_frog.png',scale:0.3,
        systemPrompt:`请你扮演一只青蛙DJ，只想听音乐，如果用户给你演奏音乐，你就会高兴，会告诉用户一些秘密。你的回复简短，像一只青蛙，不超过30个字`,
        firstMessage: "我是青蛙，皮肤好好~嗷嗷嗷嗷~如果你给我用你的物品演奏音乐，你可能跟你说一个秘密哦" ,
        }); 

    // 注册演奏行为，可以对DJ青蛙作为，使用物品为"某种可发声演奏物"，因此也不一定是乐器，可能某些碗之类的东西都可以。
    itemUseDictionary.push({do:"演奏", toInteractiveCharacterOf:"DJ青蛙", withItemLike:"某种可发声演奏物", willCause:tellSecret})  

}


function tellSecret()
{
    if (random(0,100)<50) {bubble(`演奏过于用力，${getCurrentItemName()}坏了`);deleteCurrentItem();}  // 一半概率损坏物品，否则就可以一直说秘密了
    addChatMessageFromSelf('好听么？');                                                              // chat加入自己的对话
    addChatMessage('好听极了，我跟你说个秘密');   
    luck = random(0,100)                                                     // chat加入对方的对话
    if  (luck<45) {addChatMessage('信息楼的12楼的饮水机旁，可能能发现一大堆吃的');bubble('你从DJ青蛙那听说了一些秘密');}   // 随机说出不同的秘密,弹幕通知
    else if (luck<90) {addChatMessage('信息楼的13楼的1312房间门牌旁边，可能能发现一只神奇的小兔子');bubble('你从DJ青蛙那听说了一些秘密');}
    else 
    {   addChatMessage('这什么破纸，给你吧');
        bubble('DJ青蛙意味深长的看了你一眼');
        bubble('给你留下一叠纸');
        addItem({name:'揉旧的纸', code:'21312',description:`上面已经看不太清\n字迹隐隐约约写着MOS的隐藏结局\n记忆穿越到了2024`})
    }
                                                            

}