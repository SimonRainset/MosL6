function includeKeywords(keywords, str)
{
    if (typeof keywords === "string") {
        return str.includes(keywords)
    }
    else {
        const regex = new RegExp(keywords.join("|"));
        return regex.test(str)
    }
}


function setupCurrentCutscene(locaInfo)
{
    
    currentCutsceneText = [];
    combinedCutsceneWillCause = []; // 存储所有willCause函数
    //console.log("location info:" + locaInfo)
    
    
    // time trigger
    for (cs of cutsceneParams) 
    {
        if (cs.triggerType === 'instant' && !('triggered' in cs))
        {
            cs.triggered = true;
            console.log("instant")
            currentCutsceneText.push(...cs.cutsceneText)
            if (cs.willCause!==undefined) { // 如果存在willCause函数
                combinedCutsceneWillCause.push(cs.willCause); // 将其添加到数组中
            }
        }
        if (cs.triggerType === 'time')
            if (cs.time === currentTime && !('triggered' in cs))
            {
                cs.triggered = true;
                currentCutsceneText.push(...cs.cutsceneText)
                if (cs.willCause!==undefined) { // 如果存在willCause函数
                    combinedCutsceneWillCause.push(cs.willCause); // 将其添加到数组中
                }
            }
    }

    
    // location trigger 
    
    for (let i = 0; i < cutsceneParams.length; i++) {
        let cs = cutsceneParams[i];
        if (cs.triggerType === 'location') {
            console.log("keywords: " + cs.locationInfo)
            if (includeKeywords(cs.locationInfo, locaInfo)) {
                console.log(cs.locationInfo + "these keywords are included")
                currentCutsceneText.push(...cs.cutSceneText);
                if (cs.willCause) {
                    combinedCutsceneWillCause.push(cs.willCause);
                }
                if (cs.repeatable !== undefined && !cs.repeatable) {
                    // 从数组中删除cs对象
                    cutsceneParams.splice(i, 1);
                    // 由于数组长度改变，需要更新索引
                    i--; // 减少索引以保持循环的同步
                }
            }
        }
    }


    // item trigger

    for (let cs of cutsceneParams) {
        if (cs.triggerType === 'item') {
            if (cs.hasItemOf !== undefined && hasItemOf(cs.hasItemOf, cs.exactMatch) ) {// itemOf
                currentCutsceneText.push(...cs.cutsceneText)
                if (cs.willCause!==undefined) { // 如果存在willCause函数
                    combinedCutsceneWillCause.push(cs.willCause); // 将其添加到数组中
                }
            } 
        }
    }

    // generate trigger (only happen if time  and location does not trigger)
    if (currentCutsceneText.length ===0)
    {
        for (let cs of cutsceneParams) {
            if (cs.triggerType === 'generateItem') {
               
               
                if (cs.condition() ) 
                {
                    currentCutsceneText.push(...cs.cutSceneText);
                    if (cs.willCause) {
                        combinedCutsceneWillCause.push(cs.willCause);
                    }
                    let n = 1;
                    if (cs.itemCount!==undefined) n = cs.itemCount>5?5:cs.itemCount;
            
                    itemAgent = new P5GLM();
                    itemAgent.setModel('glm-4-airx')
                    itemAgent.send(`请根据下面的场景描述输出${n}个场景中的可以被拾取物品，只回复物品的名字，中间用逗号隔开，每个物品名不超过五个字。场景为'''${locaInfo}'''`);
                    itemAgent.onComplete= function(response)
                    {
                        console.log(response);
                        const elements = response.split(/，|,/);
                        elements.forEach(element => {
                            let iname = element.trim(); // 使用trim()去除可能的前后空白字符
                            currentCutsceneText.push({speaker:null,content:`你发现并获得了${iname}`});
                            addItem({name:iname});
                            bubble(`发现了${iname}`);



                        });
                        
                        
                    }
                    
                }
            }
        }
    

    }
   





    // Nothing trigger
    if (currentCutsceneText.length ===0)
    {
        currentCutsceneText.push({speaker:null,content:'好像什么也没发生'});
    }

}

function drawCutscene(startX, startY, imgWidth, imgHeight)
{
   
    if (currentCutsceneText.length>0)
    {
        
        push();
        fill(255,255,255,220);
        noStroke()
        rect(startX+width/10,startY , imgWidth-width/5, imgHeight);
        fill(40,40,40)
        textSize(25);
        textWrap(CHAR);
        text(currentCutsceneText[0].content,startX+width/10+25,startY+25,imgWidth-width/5-50);
    
        if (currentCutsceneText[0].speaker!==null) 
            {   
                push()
                translate(startX+imgWidth-100,startY+imgHeight-50);
                scale(currentCutsceneText[0].speaker.scale*0.5)
                imageMode(CENTER)
                image(currentCutsceneText[0].speaker.image,0,0);
                pop()
            }
     
        pop();

    }


    if (mouse.released())
    {
        currentCutsceneText= currentCutsceneText.slice(1);
        if (currentCutsceneText.length ===0)
        {
            observeChangeOfGameStatus.notify({last:'cutscene',current:'mainscene'});
            gameStatus = 'mainscene';
            
        }
    }

}



function cutsceneEnterExit(scene)
{
    if (scene.current ==='cutscene') // enter cutscene: [loadCutscene] -> [cutscene]
    {

    }
    
    else if (scene.last === 'cutscene')  // exit cutscene : [cutscene] -> [mainscene]
    {
        if (combinedCutsceneWillCause.length > 0) {
           
            combinedCutsceneWillCause.forEach(willCauseFunc => {
                willCauseFunc();
            });
        }

       showCurrentInteractiveCharacter();
    }
    

}


function loadCutsceneEnterExit(scene)
{
    if(scene.current ==='loadCutscene')    // enter loadCutscene : [camerascene] -> [loadCutscene]
    {
        console.log('enterloadcutscene')
        
    } 
    else if (scene.last ==='loadCutscene') // exit loadCutscene: [loadCutscene] -> [cutscene]
    {
        console.log('exitloadcutscene')
        
    } 

}

function loadCutsceneUpdate()
{

    if (lastCameraURL !== cameraURL)
    {
        console.log(`upload done, start analysis: 请描述图里出现的场景，内容，物品，和出现的文字 ${cameraURL}`)

        sceneAgent = new P5GLM4V();

        sceneAgent.send(`请描述图里出现的场景，内容，物品，和出现的文字: ${cameraURL}`)
        sceneAgent.onComplete = function(response)
        {
            console.log(response);
            observeChangeOfGameStatus.notify({last:'loadCutscene',current:'cutscene'});
            gameStatus = 'cutscene'
            setupCurrentCutscene(response);
        }


    }



    lastCameraURL = cameraURL;



}

function mainsceneEnterExit(scene)
{
    if(scene.current ==='mainscene') // enter mainscene : [loadCutscene] ->[mainscene]
    {

    }
    else if (scene.last === 'mainscene') // exit mainscene: [mainscene] -> [camerascene]
    {

    }
}

function sceneUIToggle(scene)
{
    if (scene.current === 'mainscene') showAllUI(); // 只有mainscene需要ui
    else hideAllUI();
  
}

function hideAllUI()
{
    inputContainer.classList.add('hidden');
    chatLog.classList.add('hidden');
    thumbnailContainer.classList.add('hidden');

    console.log("hiding UI...")
    //console.log("currentInteractiveCharacter:"+currentInteractiveCharacter)
    if (currentInteractiveCharacter != null)
    {
        currentInteractiveCharacter.visible = false;
        currentInteractiveCharacter.labelSprite.visible = false;
    }
}


function showAllUI()
{
    inputContainer.classList.remove('hidden');
    chatLog.classList.remove('hidden');
    thumbnailContainer.classList.remove('hidden');

    
    console.log("showing UI...")
    if (currentInteractiveCharacter != null)
    {
        currentInteractiveCharacter.visible = true;
        currentInteractiveCharacter.labelSprite.visible = true;
    }
}

function drawBgImg()
{
    
       // 计算图像宽高比和屏幕宽高比
    let imgAspect = bgImg.width / bgImg.height;
    let screenAspect = window.innerWidth / window.innerHeight;

    // 根据宽高比确定图像的显示尺寸
    let imgWidth, imgHeight;
    if (screenAspect > imgAspect) {
        // 屏幕宽高比大于图像宽高比，高度决定显示尺寸
        imgHeight = height;
        imgWidth = imgHeight * imgAspect;
    } else {
        // 屏幕宽高比小于或等于图像宽高比，宽度决定显示尺寸
        imgWidth = width;
        imgHeight = imgWidth / imgAspect;
    }

    // 计算图像绘制的起始位置，实现截取效果
    let startX = (width - imgWidth) / 2;
    let startY = (height - imgHeight) / 2;
    

    // 绘制图像，使用起始位置和计算后的尺寸
    image(bgImg, startX, startY, imgWidth, imgHeight); 
    
    if (gameStatus === 'cutscene') drawCutscene(startX, startY, imgWidth, imgHeight);
  
}


function createInstantCutscene(cutsceneText, willCause)
{
    cutsceneParams.push(
        {
            triggerType:'instant',
            cutsceneText:cutsceneText,
            willCause:willCause
        }
    );
    observeChangeOfGameStatus.notify({last:'loadCutscene',current:'cutscene'});
    setupCurrentCutscene('')
    gameStatus = 'cutscene'
}