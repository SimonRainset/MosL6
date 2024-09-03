var tempFirstMessage = '';
var tempSecondMessage = '';
var countChat = 0;
var startPrompt = '我们来玩角色扮演，你扮演的角色第一次参加一个约会，利用以下信息找到你要扮演的角色，总结出角色姓名和描述，包括性格、典型语言风格、行为逻辑、身世、爱好等'+'\n请尤其注意描述角色对其他人的态度一般是如何的'+'\n只给出形容词，字数在30字以内。请依据以下经历完善你的角色描述：\n';

var directorPrompt = '';
let systemPrompt = '';
var firstStartflag;
var introduction = []

let moodF = '';
let likabilityF = 0;
let moodS = '';
let likabilityS = 0;

var flagSubmit1 = false;
var flagSubmit2 = false;

moodEmbedding();

document.getElementById('startButton').addEventListener('click', async() => {
    if(random(0,100) > 30){
        gptFirst.setModel(4);
        gptSecond.setModel(4);
    }
    await chatPerform();
    updateMessages();
})

let moodIndexMap1 = new Map()
let moodIndexMap2 = new Map()

async function chatPerform(){
    //console.log("Random number test:", generateRandomIndex(0, 10)); 
    //await moodEmbedding()
    //await moodMark(memoriesArray1)
    //await moodMark(memoriesArray2)
    print("聊天次数"+countChat);
    let promises = []
    if(flagSubmit1 == true && flagSubmit2 == true){
        combinedMemoArray = memoriesArray1.concat(memoriesArray2)
        for (let i = 0; i < combinedMemoArray; i++) {
            array[i] = []; // 确保每一行都初始化为一个数组
        }
        await moodMark(memoriesArray1).then(result => {
            print("没事了，开聊吧！")
            result.forEach(obj =>{
                if (!moodIndexMap1.has(obj.moodIndex)) {
                    moodIndexMap1.set(obj.moodIndex, []);
                }
                moodIndexMap1.get(obj.moodIndex).push(obj);
            })
        })
        await moodMark(memoriesArray2).then(result => {
            print("没事了，开聊吧！")
            result.forEach(obj =>{
                if (!moodIndexMap2.has(obj.moodIndex)) {
                    moodIndexMap2.set(obj.moodIndex, []);
                }
                moodIndexMap2.get(obj.moodIndex).push(obj);
            })
        })
        //print("随机来一个内容"+combinedMemoArray[10].content + "它对应的心情是"+ mood[linkArray[10].moodIndex])
        flagSubmit1 = false
        flagSubmit2 = false
    }
        
        if(!firstStartflag){
            print("角色2在说话")
            tempSecondMessage = ''
            let promise = rag.findMostSimilar(tempFirstMessage, memoriesArray2).then(result => {
                return new Promise(resolve => {
                    gptSecond.send('在聊天过程中，你的约会对象说'+tempFirstMessage +'\n这让你想起了'+ result + '\n如果你的约会对象说的话为空或没意思，流畅切换一个别的话题',true);
                    secondMessages.push({
                        role: 'user',
                        content: tempFirstMessage
                        })
                    gptSecond.onStream=(streamText) =>{
                        let cleanedText = processStreamText(streamText)
                        tempSecondMessage += cleanedText
                        handleNewText(cleanedText, 'right');};
                    gptSecond.onComplete=async (response)=>{
                        secondMessages.push({
                            role: 'assistant',
                            content: tempSecondMessage,
                            side: 'right'
                        })
                        //getWithMood(tempMood)
                        //await updateSystemprompt(2, tempSecondMessage)
                        lines.push({ content: "", side: 'right' })
                        resolve();
                        
                    }
                    firstStartflag = true
                })
            })
            promises.push(promise)
            
        }
        else{
            print("角色1在说话")
            tempFirstMessage = ''

            let promise = rag.findMostSimilar(tempSecondMessage, memoriesArray1).then(result => {
                return new Promise(resolve => {
                    gptFirst.send('你的约会对象说：'+tempSecondMessage +'\n这让你想起了'+ result + '\n如果你的约会对象说的话为空或没意思，流畅切换一个别的话题',true);
                    firstMessages.push({
                        role: 'user',
                        content: tempSecondMessage
                        })
                    gptFirst.onStream=(streamText) =>{
                        let cleanedText = processStreamText(streamText)
                        tempFirstMessage += cleanedText
                        handleNewText(cleanedText, 'left');};
                    gptFirst.onComplete=async (response)=>{
                        firstMessages.push({
                            role: 'assistant',
                            content: tempFirstMessage,
                            side: 'left'
                        })
                        //getWithMood(tempMood);
                    //     let tempMemo = new NewMemo
                    // tempMemo.content = tempMood
                    // rag.getEmbedding(tempMood).then(result =>{
                    //     tempMemo.embedding = result
                    //     print("tempMood的embedding"+result)
                    //     rag.findMostSimilarIndex(tempMemo, moodBase).then(result => {
                    //         console.log("当前的心情能够检索到的心情库内容index为"+result)
                    //         console.log("当前心情带来的经历话题为")
                    //         let moodIndexObject = moodIndexMap.get(result)
                    //         if (moodIndexObject) {
                    //             let randomIndex = generateRandomIndex(0, moodIndexObject.length - 1);
                    //             if (randomIndex < moodIndexObject.length) {
                    //                 let selectedItem = moodIndexObject[randomIndex];
                    //                 if (selectedItem) {
                    //                     console.log("Selected item's expIndex:", selectedItem.expIndex);
                    //                 } else {
                    //                     console.error("Selected item at index", randomIndex, "is undefined");
                    //                 }
                    //             } else {
                    //                 console.error("Generated random index", randomIndex, "is out of bounds");
                    //             }
                                
                    //             let expIndex = moodIndexObject[0].expIndex;
                    //             console.log("话题index为"+expIndex)
                    //             generateCard(combinedMemoArray[expIndex])
                    //         } else {
                    //             console.error("moodIndexObject is undefined for result:", result);
                    //         }
                    //     })
                    // })
                        //await updateSystemprompt(1, tempFirstMessage)
                        lines.push({ content: "", side: 'left' })
                        resolve();
                    }
                    firstStartflag = false;
                })
            })
            promises.push(promise)
        }
    countChat ++;
    await Promise.all(promises)
    console.log("Async task completed.");
}

function handleNewText(newText, side) {
    // 确保 lines 至少有一个元素且正确处理新行的 side
    if (lines.length === 0 || lines[lines.length - 1].side !== side) {
        lines.push({ content: "", side: side });
    }

    let lastLine = lines[lines.length - 1];

    newText.split("").forEach(char => {
        if (char === "。") {
            lines.push({ content: "", side: side });
            lastLine = lines[lines.length - 1]; // 更新最后一行的引用
        } else {
            lastLine.content += char;
        }
    });
}

async function updateSystemprompt(index){
    if(index == 1){
        systemPrompt = '请你做角色扮演游戏'+'\n[角色设定]\n' + introduction[0] + '\n[角色任务]\n'+'\n你现在就是这个人物，请不要提及人物出处。你在和某个人进行第一次约会，请和对方相处和互动。\n'+'\n[角色状态]\n'+'你当前的心情是'+moodF+'\n你当前对对方的好感度是'+likabilityF + '\n[语言风格]\n'+'简陋灵活口语化\n' + '[讨论话题]\n' +topic+ '\n【回复格式】\n((你想起的回忆))[[你当前的心情描述]]{{-10到10目前对对方的好感度的数字}}你的回复内容，总体不超过50字';
        console.log('systemprompt1'+systemPrompt);
        gptFirst.setSystemPrompt(systemPrompt);
    }
    else if(index == 2){
        systemPrompt = '请你做角色扮演游戏' + '\n[角色设定]\n' + introduction[1] + '\n[角色任务]\n'+'\n你现在就是这个人物，请不要提及人物出处。你在和某个人进行第一次约会，请和对方相处和互动。\n'+'\n[角色状态]\n'+'你当前的心情是'+moodS+'\n你当前对对方的好感度是'+likabilityS + '\n[语言风格]\n'+'简陋灵活口语化\n' +  '[讨论话题]\n' +topic+ '\n【回复格式】\n((你想起的回忆))[[你当前的心情描述]]{{-10到10目前对对方的好感度的数字}}你的回复内容，总体不超过50字';
        console.log('systemprompt2'+systemPrompt);
        gptSecond.setSystemPrompt(systemPrompt)
    }
}

let moodBase = []

async function moodEmbedding() {
    let moodStringBase = [
        '一种无精打采或麻木不仁的状态',
        '被误解：当他人误解了某人的言语或行为时，这可能会引发愤怒。',
        '被忽视：感觉到自己的需求或存在被忽视或轻视。',
        '失望：当期望未能实现时，常常会感到失望。',
        '焦虑：面对未知的未来或可能发生的不利情况时，可能会感到焦虑。',
        '激动：在期待某个积极事件或好消息时，可能会感到激动。',
        '疲惫：长时间工作或精神压力累积后，可能会感到疲惫。',
        '满足：完成一项重大任务或达到个人目标后，常感到满足。',
        '孤独：长时间缺乏社交互动或感到与他人隔离时，可能会感到孤独。',
        '惭愧：在做出不符合个人价值观的行为后，可能会感到惭愧。',
        '兴奋：在体验新鲜事物或进行令人兴奋的活动时，常感到兴奋。',
        '感激：当接受到他人的帮助或礼物时，通常会感到感激。',
        '沮丧：在遭遇连续挫折或失败时，可能会感到沮丧。',
        '恐惧：在面对真实的威胁或想象的危险时，通常会感到恐惧。',
        '安心：在解决了一个长期悬而未决的问题后，常感到安心。',
        '生气：当感觉到被不公正对待或受到侵犯时，可能会感到生气。',
        '悲伤：在失去亲近的人或经历重大失落时，通常会感到悲伤。',
        '欣喜：在收到好消息或达成某个重要成就时，可能会感到欣喜。',
        '无聊：在进行单调或缺乏兴趣的活动时，可能会感到无聊。',
        '振奋：在获得认可或实现个人突破时，常感到振奋。',
        '悔恨：在意识到可能已错过重要机会或做出错误决策后，可能会感到悔恨。',
        '羞耻：在公众面前出丑或做出不得体的行为时，可能会感到羞耻。',
        '紧张：在准备重要事件或面临考验时，通常会感到紧张。',
        '紧张：在准备重要事件或面临考验时，通常会感到紧张。',
        '释然：在解决长期困扰的问题后，常感到一种释然的感觉。',
        '欢愉：在参加庆祝活动或与亲朋好友共度美好时光时，通常会感到欢愉。',
        '后悔：在意识到自己的选择带来了不良后果时，可能会感到后悔。',
        '害羞：在成为注意的焦点或需要在人前表现时，通常会感到害羞。',
        '惊讶：在遇到意外事件或收到出乎意料的信息时，可能会感到惊讶。',
        '平静：在自然环境中或进行冥想后，通常会感到平静。',
        '感受到不公：感受到被不公平对待，如在工作、学校或家庭环境中被偏袒或歧视。',
        '亲人去世：失去家人、朋友或爱宠是引发悲伤的最常见原因之一。',
        '关系破裂：情感关系如恋爱、婚姻的结束，或与亲密朋友的关系破裂。',
        '挫折感：当个人的目标被阻挠，或感觉到自己的努力没有得到应有的回报时。',
        '预期涉及在考虑或等待预期事件时的快乐或焦虑。',
        '焦虑是内心动荡的不愉快状态。是对未来威胁的预期。',
        '冷漠是对某事缺乏感觉、情感、兴趣或关注。',
        '平静是内心平静的精神状态',
        '幸福是满足到强烈的喜悦。幸福的时刻由积极美满的事引发',
        '快乐与幸福、成功或好运密切相关'
    ];

    let promises = moodStringBase.map(mood => {
        let tempMemo = new NewMemo();
        tempMemo.content = mood;
        return rag.getEmbedding(mood).then(result => {
            tempMemo.embedding = result;
            moodBase.push(tempMemo);
        });
    });

    await Promise.all(promises);
    console.log(moodBase);
}

var combinedMemoArray = []

async function moodMark(array) {
    let i = 0;
    let linkArray = []; // 确保数组被初始化

    for (const element of array) {
        try {
            if (element.content.length >= 10) {
                let tempIndex = await moodEachMark(element);
                print("获得的mood中的index为" + tempIndex);
                linkArray.push({ expIndex: i, moodIndex: tempIndex }); // 确保这里总是执行
                i++;
            }
        } catch (error) {
            console.error('处理时发生错误:', error);
            continue;
        }
    }
    return linkArray; // 也许你想返回这个数组，便于后续操作
}


async function moodEachMark(element) {
    const timeoutId = setTimeout(() => {
        reject(new Error('请求超时'));
    }, 10000); // 设置5秒超时

    try {
        const result = await rag.findMostSimilarIndex(element, moodBase);
        clearTimeout(timeoutId);
        return result; // 直接返回结果
    } catch (error) {
        clearTimeout(timeoutId);
        throw error; // 抛出错误让调用者处理
    }
}

let mode = null
let buffer = ''
let tempMood = ''
let tempLikability = 0
let linkArray = []

function processStreamText(streamText) {
    let accumulatedText = ''

    let tempText = ''; // 临时存储正常文本

    for (let i = 0; i < streamText.length; i++) {
        let char = streamText[i];
        let nextChar = streamText[i + 1]; // 下一个字符，用于检查双字符模式

        if (mode) {
            buffer += char; // 继续累积特殊文本

            // 检查是否到达任何模式的结束
            if ((mode === 'doubleParen' && char === ')' && buffer.endsWith('))')) ||
                (mode === 'squareBracket' && char === ']' && buffer.endsWith(']]')) ||
                (mode === 'curlyBracket' && char === '}' && buffer.endsWith('}}'))) {
                if (mode === 'squareBracket') {
                    // 处理中括号中的文本，但不加入到accumulatedText
                    tempMood += buffer.slice(2, -2)
                    getWithMood(tempMood)
                    console.log(`Extracted from brackets: ${buffer.slice(2, -2)}`);
                }
                else if(mode == 'curlyBracket'){
                    tempLikability = parseInt(buffer.slice(2, -2), 10)
                }
                // 重置缓冲区和模式
                buffer = '';
                mode = null;
            }
        } else {
            // 检查新模式的开始
            if (char === '(' && nextChar === '(') {
                mode = 'doubleParen';
                buffer = char; // 开始收集文本
                i++; // 跳过下一个字符，因为已经检查过
            } else if (char === '[' && nextChar === '[') {
                mode = 'squareBracket';
                buffer = char;
                i++;
            } else if (char === '{' && nextChar === '{') {
                mode = 'curlyBracket';
                buffer = char;
                i++;
            } else {
                tempText += char; // 累积正常文本
            }
        }
    }

    accumulatedText += tempText;
    return accumulatedText;
}

function generateRandomIndex(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getWithMood(tempMood){
    //let tempMemo = new NewMemo();
    //tempMemo.content = tempMood;
    rag.getEmbedding(tempMood).then(result => {
        print("tempMood的embedding" + result);

        console.log("Checking maps content:");  // 提前打印映射内容
        console.log(moodIndexMap1);
        console.log(moodIndexMap2);
        let tempMemo = new NewMemo();
        tempMemo.content = tempMood;
        tempMemo.embedding = result;

        console.log("当前心情"+tempMemo.content);
        return rag.findMostSimilarIndex(tempMemo, moodBase);
    }).then(result => {
        let moodIndexObject = firstStartflag ? moodIndexMap1.get(result) : moodIndexMap2.get(result);
        if (!moodIndexObject) {
            console.error("moodIndexObject is undefined for result:", result);
            return; // 提前返回防止进一步错误执行
        }

        let randomIndex = generateRandomIndex(0, moodIndexObject.length - 1);
        if (randomIndex < moodIndexObject.length) {
            let selectedItem = moodIndexObject[randomIndex];
            if (selectedItem) {
                console.log("Selected item's expIndex:", selectedItem.expIndex);
                console.log("话题为" + combinedMemoArray[selectedItem.expIndex].content);
                generateCard(combinedMemoArray[selectedItem.expIndex].content);
            } else {
                console.error("Selected item at index", randomIndex, "is undefined");
            }
        } else {
            console.error("Generated random index", randomIndex, "is out of bounds");
        }
    }).catch(error => {
        console.error("Error during processing:", error);
    });
    tempMemo = '';
}


var topic = '随便聊聊吧先'

function generateCard(topicExp){
    let tempText = ''
    gptAgent.setSystemPrompt('以下内容为主角的经历，从中提炼出一个约会时能让该主角讨论到该经历的话题。以“来聊聊”+提炼的话题的格式输出，共不超过7个字。')
    gptAgent.send(topicExp)
    gptAgent.onStream=(streamText) =>{
        tempText += streamText
    }
    gptAgent.onComplete=(response) =>{
        addCard(response)
    }
    //addCard()
}
