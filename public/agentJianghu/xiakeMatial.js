class xiakeMartial {
  constructor(sprite, martialArts) {
    this.sprite = sprite;
    this.martialArts = martialArts || {
      attack: { name: '', type: '', data: [] },
      defense: { name: '', type: '', data: [] },
      move: { name: '', type: '', data: [] },
      xinfa: { name: '', type: '', data: [] }
    };
    this.currentAttackStage = 0; // 当前攻击阶段
    this.lastAttackTimestamp = 0; // 上一次攻击的时间戳
    this.attackTimeout = null; // 存储setTimeout的引用
  }

  // 执行攻击技能的详细逻辑
  performAttack(target) {
    // 检查是否有攻击数据
    if (!this.martialArts.attack.data.length) {
      console.error('No attack data available.');
      return;
    }
    // 执行攻击技能
    this.executeSkill('attack', target);
  }

  // 执行防御技能
  performDefense(target) {
    if (!this.martialArts.defense.data.length) {
      console.error('No defense data available.');
      return;
    }
    // 执行防御技能
    this.executeSkill('defense', target);
  }

  // 执行移动技能
  performMove(target) {
    if (!this.martialArts.move.data.length) {
      console.error('No move data available.');
      return;
    }
    // 执行移动技能
    this.executeSkill('move', target);
  }

  // 执行心法技能
  performXinfa(target) {
    if (!this.martialArts.xinfa.data.length) {
      console.error('No xinfa data available.');
      return;
    }
    // 执行心法技能
    this.executeSkill('xinfa', target);
  }

  // 执行技能的通用方法
  executeSkill(skillType, target) {
    if (this.attackTimeout !== null) {
      this.stopSkill();
    }

    // 检查技能数据
    const skillData = this.martialArts[skillType];
    if (!skillData.data.length) {
      console.error(`No ${skillType} data available.`);
      return;
    }

    // 执行当前阶段的技能
    this.executeNextSkillStage(skillData, target);
  }

  // 执行下一个技能阶段的通用方法
  executeNextSkillStage(skillData, target) {
    const currentStage = this[`current${skillData.name.charAt(0).toUpperCase() + skillData.name.slice(1)}Stage`];
    const skillTimeout = this[`skillTimeout`];

    if (currentStage < skillData.data.length) {
      const stageData = skillData.data[currentStage];
      this.spawnSprites(stageData.sprites, target);

      // 更新最后一次技能执行的时间戳
      this.lastAttackTimestamp = $.millis();

      // 设置下一次技能阶段的定时器
      const nextStageDelay = stageData.delay;
      this[`skillTimeout`] = setTimeout(() => {
        currentStage++;
        this[`current${skillData.name.charAt(0).toUpperCase() + skillData.name.slice(1)}Stage`] = currentStage;
        this.executeNextSkillStage(skillData, target);
      }, nextStageDelay);
    }
  }

  // 停止当前正在进行的技能
  stopSkill() {
    if (this.attackTimeout !== null) {
      clearTimeout(this.attackTimeout);
      this.attackTimeout = null;
    }
    // 重置当前技能阶段
    for (let key in this.martialArts) {
      this[`current${key.charAt(0).toUpperCase() + key.slice(1)}Stage`] = 0;
    }
    console.log('Skill has been stopped.');
  }

  // 根据指定的行为和属性创建Sprite的假设实现
  spawnSprites(spritesInfo, target) {
    // 此处应包含spawnSprites方法的实现细节
    // ...
  }
}

// 使用示例：
// 创建xiakeMartial实例，传入Sprite实例和武术技能数据
let xiakeMartialArts = new xiakeMartial(mySprite, martialArtsData);

// 在游戏循环或适当的时候调用相应的方法执行技能
// xiakeMartialArts.performAttack(/* 目标对象 */);
// xiakeMartialArts.performDefense(/* 目标对象 */);
// xiakeMartialArts.performMove(/* 目标对象 */);
// xiakeMartialArts.performXinfa(/* 目标对象 */);

// 在需要停止技能的时候调用stopSkill
// xiakeMartialArts.stopSkill();
  
  // // 定义攻击数据结构
  // let attackData = [
  //   {
  //     delay: 100, // 攻击阶段的延迟时间（毫秒）
  //     sprites: [
  //       // 第一阶段的Sprite属性
  //     ]
  //   },
  //   {
  //     delay: 1000, // 第二阶段的延迟时间（毫秒）
  //     sprites: [
  //       {
  //         width: 30,
  //         height: 30,
  //         color: 'blue',
  //         shape: 'circle',
  //         collider: 'dynamic',
  //         moveTo: (xiake, target) => {
  //           // 第二阶段的移动逻辑
  //           const angle = Math.random() * Math.PI * 2;
  //           const radius = 50;
  //           return {
  //             x: target.x + radius * Math.cos(angle),
  //             y: target.y + radius * Math.sin(angle)
  //           };
  //         }
  //       },
  //       // 可以添加更多Sprite属性
  //     ]
  //   },
  //   // 可以继续添加更多攻击阶段
  // ];
  
  // // 设置攻击数据
  // aiController.setAttackData(attackData);
  
  // // 在适当的时候调用startAttack开始攻击
  // // aiController.startAttack();