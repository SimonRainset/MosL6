class xiakeFight {
    constructor(sprite, target) {
      this.sprite = sprite;
      this.target = target;
      this.speed = 1; // 移动速度
      this.chaseRange = 150; // 追逐范围
      this.idleRange = 180; // 空闲范围
  
      // 初始化状态
      this.setState('idle');
    }
  
    // 设置当前状态，并执行状态的onEntry函数
    setState(stateName) {
      if (this.states[stateName]) {
        if (this.state && this.states[this.state].onExit) {
          this.states[this.state].onExit.call(this);
        }
        this.state = stateName;
        if (this.states[stateName].onEntry) {
          this.states[stateName].onEntry.call(this);
        }
      } else {
        console.error(`State ${stateName} is not defined.`);
      }
    }
  
    // 定义状态行为和转换条件
    states = {
      idle: {
        onEntry: () => {
          this.sprite.image = '😶'
          console.log('Entering IDLE state.');
        },
        onExit: () => {
          console.log('Exiting IDLE state.');
        },
        update: () => {
          // 空闲状态的复杂更新逻辑...
          this.idleBehavior();
        },
        transitions: {
          chase: () => this.sprite.distanceTo(this.target) < this.chaseRange
        }
      },
      chase: {
        onEntry: () => {
          console.log('Entering CHASE state.');
          this.sprite.image = '😡'
        },
        onExit: () => {
          console.log('Exiting CHASE state.');
        },
        update: () => {
          // 追逐状态的复杂更新逻辑...
          this.chaseBehavior();
        },
        transitions: {
          idle: () => this.sprite.distanceTo(this.target) > this.idleRange
        }
      }
    };
  
    // 空闲行为
    idleBehavior() {
     
      if (frameCount%300<150) this.sprite.vel.x = 2;
      else  this.sprite.vel.x = -2;
    }
  
    // 追逐行为
    chaseBehavior() {
      this.sprite.moveTo(this.target, this.speed);
    }
  
    // 更新当前状态，处理状态转换
    update() {
      const state = this.states[this.state];
      state.update.call(this); // 执行当前状态的更新逻辑
  
      // 检查状态转换条件
      for (let nextState in state.transitions) {
        if (state.transitions[nextState].call(this)) {
          this.setState(nextState); // 状态转换
          break;
        }
      }
    }
  
  
  }
  
  // 使用示例保持不变