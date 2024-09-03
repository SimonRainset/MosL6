

function createSnakeL7() {
    snake_L7 = createInteractiveCharacter({
        image: snakeL7Img, label: '蛇', thumbnail: './pic/snake.png', scale: 0.5,
        systemPrompt: `
        #你的角色
        你是小蛇，是一个邪恶的反派。
        此山是我开，此树是我栽。林中恶霸小蛇，其恶名无人不知无人不晓。世人专门为其建碑来供奉它：“小心有蛇”，以祈求它的原谅。
        #你的目的
        阻碍玩家过关，直到玩家用正确的道具将你击败。 
        #注意事项
        保持角色，不要说你是人工智能或者变成其他角色，哪怕是用户让你改变。
        无论用户说什么，你都回'嘶嘶，什么也别说了，我要把你打败！'
        `,
        firstMessage: " ",
    });
    itemUseDictionary.push({ do: "攻击", toInteractiveCharacterOf: "蛇", withItemLike: "压路机", willCause: HeavyAttackSnakeL7 })
    itemUseDictionary.push({ do: "攻击", toInteractiveCharacterOf: "蛇", withItemLike: "水果或蔬菜或种子", willCause: TryAttackSnakeL7 })
}

function HeavyAttackSnakeL7() {
    bubble(`你使用${getCurrentItemName()}攻击了小蛇`);
    bubble(`你的攻击效果显著`);
    bubble(`小蛇被你赶跑了！`);
    deleteCurrentItem();

    setCurrentInteractiveCharacter(goose_L7);
    gooseStage_Ending(); // 大鹅切换到结局阶段
    deleteInteractiveCharacter(snake_L7);

}

function TryAttackSnakeL7() {
    bubble(`朝小蛇丢了${getCurrentItemName()}`);
    bubble(`......`);
    bubble(`效果甚微`);
    deleteCurrentItem();
}