

class XiakeAgent {

    needs;
    state;
    health;
    name;
    objective;
    discoverDesire;
    fightDesire;

    constructor() {
        this.needs = {
            needOfFood: 0,
            needOfWater: 0,
            needOfDiscover: 100,
            // 可以添加更多的需求
        };
        this.state = 'resting';
        this.health = 100;
        this.name = '';
        this.objective = '';
        this.discoverDesire = 0;
        this.fightDesire = 0;
    }

    updateNeed(increment) {
        for (let key in increment) {
            if (this.needs.hasOwnProperty(key)) {
                this.needs[key] += increment[key];
                this.needs[key] = Math.max(-100, Math.min(100, this.needs[key])); //让所有need保持在-100到100之间
            }
        }
    }

    getNeedsSorted() {
        // 将需求按值排序并返回一个数组
        let sortedNeeds = Object.entries(this.needs).sort((a, b) => a[1] - b[1]);
        return sortedNeeds;
    }

    getMinNeed() {
        // 获取最小的需求
        let sortedNeeds = this.getNeedsSorted();
        return sortedNeeds[0];
    }
}

// // 示例用法
// let agent = new Agent();
// console.log(`Initial needs:`, agent.needs);

// let increment1 = { needOfFood: 10, needOfWater: 5 };
// agent.updateNeed(increment1);
// console.log(`After update:`, agent.needs);

// let increment2 = { needOfFood: -3, needOfWater: 2 };
// agent.updateNeed(increment2);
// console.log(`After another update:`, agent.needs);

// console.log(`Needs sorted:`, agent.getNeedsSorted());
// console.log(`Minimum need:`, agent.getMinNeed());
