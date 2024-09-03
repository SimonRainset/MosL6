class JianghuObject {
    constructor(itemConfig) {
      this.name = itemConfig.name; 
      this.icon = itemConfig.icon; 
      this.x = itemConfig.x; // 物品的地点x坐标
      this.y = itemConfig.y; // 物品的地点y坐标
      this.amount = itemConfig.amount; // 物品的剩余数量
      this.usageTime = itemConfig.usageTime; // 使用物品消耗的时间（帧数）
      this.effects = itemConfig.effects; // 使用物品后满足的需求列表及其增加值
      this.isInUse = false; // 物品是否正在使用中
      this.currentUsageTime = 0; // 当前已使用的时间
      this.isDiscovered = false; 
      
    }

    isUsedUp(){
      return(this.amount === 0 && !this.isInUse);
    }
  
    // 使用物品的方法
    useItem(player) {
      if (!this.isDiscovered) return; 
      if (this.amount > 0 && !this.isInUse) {
        this.amount--; // 使用后数量减少
        this.isInUse = true; // 设置物品正在使用中
        this.currentUsageTime = 0; // 重置已使用时间
      } else {
        console.log('物品数量不足或正在使用中，无法使用。');
      }
    }
  
    // 在P5.js的draw函数中调用此方法来逐渐应用效果
    applyEffect(player) {
      if (this.isInUse) {
        this.currentUsageTime++;
        // 计算每个需求本帧应该增加的值
        const frameEffects = {};
        for (let need in this.effects) {
          if (player.needs.hasOwnProperty(need)) {
            frameEffects[need] = this.effects[need] / this.usageTime;
          }
        }
        // 更新玩家的需求状态
        player.updateNeed(frameEffects);
  
        // 如果使用时间达到，停止使用物品
        if (this.currentUsageTime >= this.usageTime) {
          this.isInUse = false;
          console.log('物品效果应用完毕。');
        }
      }
    }
  }
  
//   // 创建物品的JSON配置
//   const itemConfig = {
//     x: 10,
//     y: 20,
//     amount: 5,
//     usageTime: 10,
//     effects: { needOfFood: 20, needOfWater: -10 }
//   };
  
//   // 使用JSON配置创建物品实例
//   const item = new JianghuObject(itemConfig);
  
//   // P5.js的draw函数示例
//   function draw() {
//     // ... 其他绘图逻辑 ...
  
//     // 更新玩家的需求状态
//     item.applyEffect(player);
  
//     // ... 其他绘图逻辑 ...
//   }
  