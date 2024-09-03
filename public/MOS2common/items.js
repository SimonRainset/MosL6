function updateInventory() {
  const inventory = document.getElementById('inventory'); // 获取库存容器
  inventory.innerHTML = ""; // 清空库存容器的内容

  inventoryItems.forEach((item, index) => {
    // 创建一个新的 div 元素作为 item 容器
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item'; // 设置类名
    itemDiv.setAttribute('namepluscode', item.name + item.code); // 设置自定义属性

    // 创建图像 span 并设置类名和内容
    const imageSpan = document.createElement('span');
    imageSpan.className = 'image';
    imageSpan.textContent = item.image; // 假设 item.image 是图像的文本表示
    itemDiv.appendChild(imageSpan); // 添加到 itemDiv

    // 创建名称 p 元素并设置类名和内容
    const nameSpan = document.createElement('p');
    nameSpan.className = 'name';
    nameSpan.textContent = item.name;
    itemDiv.appendChild(nameSpan); // 添加到 itemDiv

    // 创建描述 p 元素并设置类名，初始不显示
    const descriptionSpan = document.createElement('p');
    descriptionSpan.className = 'description';
    descriptionSpan.textContent = item.description;
    descriptionSpan.style.display = 'none'; // 设置为不显示
    itemDiv.appendChild(descriptionSpan); // 添加到 itemDiv

    const dot = document.createElement("span");
    dot.classList.add("notification-dot");
    itemDiv.appendChild(dot);
    if (item.unread) dot.style.display = "block"
    else dot.style.display = "none"
    item.dot = dot
    console.log(item.name + ".unread:" + item.unread)

    // 鼠标悬停事件的原生 JavaScript 绑定
    itemDiv.addEventListener('mouseover', function() {
      descriptionSpan.style.display = 'block';
    });
    itemDiv.addEventListener('mouseout', function() {
      descriptionSpan.style.display = 'none';
    });

    // 添加点击事件监听器
    itemDiv.addEventListener('click', function() {
      if (itemDiv.classList.contains('highlight')) {
        itemDiv.classList.remove('highlight');
        setCurrentItem(null);
      } else {
        const allItemDivs = document.querySelectorAll('.item');
        // 移除所有itemDiv的高亮类
        allItemDivs.forEach(div => {
          div.classList.remove('highlight');
        });
        itemDiv.classList.add('highlight');
        setCurrentItem(itemDiv.getAttribute('namepluscode'));
        let currentItem = findItemWithNamepluscode(itemDiv.getAttribute('namepluscode'))
        if (currentItem.unread) {
          currentItem.unread = false;
          unreadItemCount -= 1;
          currentItem.dot.style.display = "none"
          updateItemButtonDisplay()
          //observeChangeOfInventory.notify()
        }
      }
    });

    inventory.appendChild(itemDiv); // 将 itemDiv 添加到库存容器
    if (itemDiv.getAttribute('namepluscode') === currentItem_namepluscode) {
      itemDiv.classList.add('highlight'); // 假设 currentItem_namepluscode 是全局变量
    }
    // 滚动到底部的代码可能不需要，除非您想确保每次更新后都滚动到底部
  });
}


function addItem(itemOptions)
{
  let itemName,itemCode,itemImage,itemDescription, itemDescriptionLike;
  if (itemOptions.name === undefined) return;
  itemName = itemOptions.name;
  if (itemOptions.code === undefined) itemCode = floor(random(-100000,-1));
  else itemCode = itemOptions.code;
  if (itemOptions.image === undefined || itemOptions.description === undefined)
  {
    if (itemOptions.image === undefined) itemImage = '❓';
    else itemImage = itemOptions.image;
    if (itemOptions.description === undefined) itemDescription = '???';
    else itemDescription = itemOptions.description;
    itemDescriptionLike = itemOptions.descriptionLike ? `关于${itemOptions.descriptionLike}` : ""
    inventoryItems.push({
      name:itemName,
      code:itemCode,
      image:itemImage,
      description:itemDescription,
      unread:true,
      dot:null
    });
    observeChangeOfInventory.notify();
    let itemGenerateAgent = new P5GLM();
    itemGenerateAgent.send(`请帮我为物体${itemName}生成一个emoji和一小段不超过30字${itemDescriptionLike}的描述，emoji必须严格为一个字符${itemDescriptionLike}。请严格使用Json格式，两个key为"emoji"和"description":`);
    itemGenerateAgent.onComplete = (text) => {
      const chineseCommaRegex = /(?<=":)\s*，|(?<=",)\s*(?=\s*[{])/g; // 可能误用中文逗号
      text = text.replace(chineseCommaRegex, ',');  
      text = text.match(/{[^{}]*}/); // 提取回答中的json格式
      try{
        jsonData = JSON.parse(text);
      }
      catch(error)
      {
        console.log('parse error json');
        itemGenerateAgent.send(`请帮我为物体${itemName}生成一个emoji和一小段不超过30字的描述，emoji必须严格为一个字符。请严格使用Json格式，两个key为"emoji"和"description":`);
      }
      itemGenerateAgent.onError = ()=>{console.log('parse error agent');itemGenerateAgent.send(`请帮我为物体${itemName}生成一个emoji和一小段不超过30字的描述，emoji必须严格为一个字符。请严格使用Json格式，两个key为"emoji"和"description":`);};
      
      if (itemOptions.image === undefined) itemImage= jsonData["emoji"];
      else itemImage = itemOptions.image;
      if (itemOptions.description === undefined) itemDescription =  jsonData["description"];
      else itemDescription = itemOptions.description;
      for (let i of inventoryItems)
      {
        if (i.code === itemCode) 
        {
          if (i.image === '❓') i.image = itemImage;
          if (i.description === '???') i.description = itemDescription;
        }
      }
      
      observeChangeOfInventory.notify();
    }

  }
  else {
    itemImage = itemOptions.image;
    itemDescription = itemOptions.description;
    inventoryItems.push({
      name:itemName,
      code:itemCode,
      image:itemImage,
      description:itemDescription,
      unread:true,
      dot:null
    });
    observeChangeOfInventory.notify();
  }
  unreadItemCount += 1;
  updateItemButtonDisplay()
}


function addItemLike(itemlike,ifNotice = false)
{
    agent= new P5GLM(); agent.clearAllMessage(); agent.setTemperature(1);
  
    agent.send(`请生成五个随机的${itemlike}。请只回复${itemlike}名称，不需要序号，用逗号隔开，${itemlike}名称不超过4个字`);
    agent.onComplete=function(response)
        { 

            console.log(response);
            let reponseSplit = response.split(/，|,/);//中文或英文逗号
            let realItem = reponseSplit[floor(random(0,5))];
            
            addItem({name:realItem});
            if (ifNotice) bubble(`你获得了${realItem}。`)

          
        }
    
}

// ItemUse    
function findItemWithNamepluscode(namepluscode)
{
  for (let ii of inventoryItems)
    {if ((ii.name+ii.code) === namepluscode) return ii;}
  return null;
}

function getCurrentItemName()
{
  return findItemWithNamepluscode(currentItem_namepluscode).name;
}

function getCurrentItemImage()
{
  return findItemWithNamepluscode(currentItem_namepluscode).image;
}

function getCurrentItemCode()
{
  return findItemWithNamepluscode(currentItem_namepluscode).code;
}

function getCurrentItemDescription()
{
  return findItemWithNamepluscode(currentItem_namepluscode).description;
}


function createItemUseButton(text, callback){
  let newbutton = document.createElement('button');
  newbutton.textContent = text; // 设置按钮上的文字

  // 为按钮添加点击事件监听器
  newbutton.addEventListener('click', function() {
    let itemName=findItemWithNamepluscode(currentItem_namepluscode).name;
    let ioName = currentInteractiveCharacter?'对'+currentInteractiveCharacter.label:'';
    bText = `你${ioName}${text}了${itemName}`;
    bubble(bText);
    currentInteractionCount++;
    
  });
  newbutton.addEventListener('click', function() {
     callback(); // 当按钮被点击时，调用回调函数
  });
  newbutton.className = 'iButtons';
  iButtons.appendChild(newbutton);
}


function checkIOCondiction(itemUse)
{
  if (itemUse.toInteractiveCharacterOf === 'none' && currentInteractiveCharacter === null) itemUse.IOCondition = true;
  if (itemUse.toInteractiveCharacterOf === 'all' && currentInteractiveCharacter !== null) itemUse.IOCondition = true;
  if (currentInteractiveCharacter) if (itemUse.toInteractiveCharacterOf === currentInteractiveCharacter.label) itemUse.IOCondition = true;
  if (itemUse.toInteractiveCharacterLike !== undefined && currentInteractiveCharacter) 
    {
      let judgeAgent = new P5GLM();
      let currentIO = currentInteractiveCharacter.label;
      
      if (isThingPairing(currentIO,itemUse.toInteractiveCharacterLike)) itemUse.IOCondition = true; // 已经存在于判断表里，不会继续判断
      else{
        judgeAgent.send(`请判断${currentIO}是否是${itemUse.toInteractiveCharacterLike}，请仅用true/false回答，不要解释`);  
        judgeAgent.onComplete= (t)=>{
        console.log(`判断${currentIO}是否是${itemUse.toInteractiveCharacterLike}结果是${t}`);
        if (t.includes('true')) {itemUse.IOCondition = true; addThingPairing(currentIO,itemUse.toInteractiveCharacterLike);}
        if (itemUse.itemCondition=== true && itemUse.IOCondition === true && currentIO === currentInteractiveCharacter.label) {itemUseNow.push(itemUse);mergeActionandCreateButtions();}
        }
      }
      
    }
  if (itemUse.itemCondition=== true && itemUse.IOCondition === true) itemUseNow.push(itemUse);

}

function checkItemCondition(itemUse)
{
  if (currentItem_namepluscode === null) return;
  if (itemUse.withItemOf ==="all") itemUse.itemCondition=true;
  let currentItem = findItemWithNamepluscode(currentItem_namepluscode);
  if (itemUse.withItemOf !== undefined && currentItem_namepluscode) if (isItem(currentItem, itemUse.withItemOf, itemUse.exactMatch)) itemUse.itemCondition=true;
  if (itemUse.withItemBut !== undefined && currentItem_namepluscode) if (!isItem(currentItem, itemUse.withItemBut, itemUse.exactMatch)) itemUse.itemCondition=true;
  if (itemUse.withItemLike!== undefined  && currentItem_namepluscode) 
    {
      let judgeAgent = new P5GLM();
      let currentItemName= currentItem.name;
      let currentItemNameCode= currentItem.name + currentItem.code;
      if (isThingPairing(currentItem.name,itemUse.withItemLike)) itemUse.itemCondition = true; // 已经存在于判断表里，不会继续判断
      else if (isThingPairing(currentItem.name, itemUse.withItemLike)) itemUse.itemCondition = false;
      else 
      {
        judgeAgent.send(`请判断${currentItem.name}是否是${itemUse.withItemLike}，请仅用true/false回答，不要解释`);
        judgeAgent.onComplete= (t)=>
          {
            console.log(`判断${currentItemName}是否是${itemUse.withItemLike}结果是${t}`);
            if (t.includes('true')) {itemUse.itemCondition = true; addThingPairing(currentItemName,itemUse.withItemLike);}
            else {addThingNotPairing(currentItemName, itemUse.withItemLike);}
            if (itemUse.itemCondition=== true && itemUse.IOCondition === true && currentItemNameCode === currentItem_namepluscode) {itemUseNow.push(itemUse);mergeActionandCreateButtions();}
          };

      }
      
    }
    if (itemUse.withItemButLike!== undefined  && currentItem_namepluscode) 
    {
      let judgeAgent = new P5GLM();
      let currentItemName= currentItem.name;
      let currentItemNameCode= currentItem.name + currentItem.code;
      if (isThingNotPairing(currentItem.name,itemUse.withItemButLike)) itemUse.itemCondition = true; // 已经存在于判断表里，不会继续判断
      else if (isThingPairing(currentItem.name, itemUse.withItemButLike)) itemUse.itemCondition = false;
      {
        judgeAgent.send(`请判断${currentItem.name}是否是${itemUse.withItemButLike}，请仅用true/false回答，不要解释`);
        judgeAgent.onComplete= (t)=>
          {
            console.log(`判断${currentItemName}是否是${itemUse.withItemButLike}结果是${t}`);
            if (t.toLowerCase().includes('false')) {console.log(currentItemName);itemUse.itemCondition = true; addThingNotPairing(currentItemName,itemUse.withItemButLike);}
            else {addThingPairing(currentItemName, itemUse.withItemButLike);}
            if (itemUse.itemCondition=== true && itemUse.IOCondition === true && currentItemNameCode === currentItem_namepluscode) {itemUseNow.push(itemUse);mergeActionandCreateButtions();}
          };

      }
      
    }
  if (itemUse.itemCondition=== true && itemUse.IOCondition === true) itemUseNow.push(itemUse);
}

// 函数：添加配对到记录表
function addThingPairing(thing1, thing2) {
  // 使用thing1和thing2的组合作为键，保持原始顺序
  var key = [thing1, thing2].join(':');
  // 将键值对添加到记录表中
  thingsLikeRecord[key] = true;
}

function addThingNotPairing(thing1, thing2) {
  // 使用thing1和thing2的组合作为键，保持原始顺序
  var key = [thing1, thing2].join(':');
  // 将键值对添加到记录表中
  thingsNotLikeRecord[key] = true;
}

// 函数：检查配对是否存在于记录表
function isThingPairing(thing1, thing2) {
  // 使用thing1和thing2的组合作为键，保持原始顺序
  var key = [thing1, thing2].join(':');
  // 检查键是否存在于记录表中
  return thingsLikeRecord.hasOwnProperty(key);
}

function isThingNotPairing(thing1, thing2) {
  // 使用thing1和thing2的组合作为键，保持原始顺序
  var key = [thing1, thing2].join(':');
  // 检查键是否存在于记录表中
  return thingsNotLikeRecord.hasOwnProperty(key);
}

function mergeActionandCreateButtions()
{
  var uniqueItemUseNow = [...new Map(itemUseNow.map(item => [JSON.stringify(item), item])).values()];
  // 这个数据结构的一个数组 itemUseNow 存了很多这个数据。现在我需要找到所有 do值有重复的数据，
  // 并且将他们的willCause合并成一个回调函数，作为合并后的元素的willCause。
  // 所有 itemUseNow 中的数据都要通过这个操作，合并相同的do值
  var willCauseMap = {};
  // 遍历itemUseNow数组，填充willCauseMap
  uniqueItemUseNow.forEach(item => {
    // 如果这个do值还没有记录，初始化一个空数组
    if (!willCauseMap[item.do]) {
      willCauseMap[item.do] = [];
    }
    // 将当前项的willCause添加到对应do值的数组中
    willCauseMap[item.do].push(item.willCause);
  });

  // 创建一个新的数组，包含合并后的do和willCause
  var mergedActions = Object.keys(willCauseMap).map(doKey => {
    // 对于每个do值，创建一个合并后的willCause回调函数
    const mergedWillCause = function() {
      IncreaseItemUsedCount(doKey);
      willCauseMap[doKey].forEach(callback => callback());
    };
    
    
    // 返回包含do值和合并后的willCause的元素
    return {
      do: doKey,
      willCause: mergedWillCause
    };
  });

  iButtons.innerHTML = '';
  mergedActions.forEach(action => {
    createItemUseButton(action.do, action.willCause);
  });


}

function IncreaseItemUsedCount(doKey) {
  if (!currentInteractiveCharacter) return;
  if (doKey in currentInteractiveCharacter.itemUsedCount) {
    currentInteractiveCharacter.itemUsedCount[doKey] += 1;
  } else {
    currentInteractiveCharacter.itemUsedCount[doKey] = 1;
  }
}


function updateIButtons()
{
  
  itemUseNow = [];
  for (let itemUse of itemUseDictionary) 
    {
      itemUse.IOCondition = false; 
      itemUse.itemCondition = false;
      checkIOCondiction(itemUse);
      checkItemCondition(itemUse);
    
    }

    mergeActionandCreateButtions();
}


function deleteItem(itemNameOrCode)
{
  // 从后向前遍历，避免索引问题
  for (var i = inventoryItems.length - 1; i >= 0; i--) {
    iNamepluscode = inventoryItems[i].name + inventoryItems[i].code;
    if (iNamepluscode.includes(itemNameOrCode)) {
      if (iNamepluscode === currentItem_namepluscode) setCurrentItem(null);
      inventoryItems.splice(i, 1);
      observeChangeOfInventory.notify();
    }
  }
  
}

function deleteCurrentItem()
{
  deleteItem(currentItem_namepluscode);
}

function setCurrentItem(namepluscode)
{
  lastItem_namepluscode = currentItem_namepluscode;
  currentItem_namepluscode = namepluscode;
  if (lastItem_namepluscode!==currentItem_namepluscode) 
    observeChangeOfCurrentItem.notify({last:lastItem_namepluscode,current:currentItem_namepluscode});
}
function isItem(item, itemNameOrCode, exactMatch=false) {
  if (exactMatch) {
    return item.name == itemNameOrCode || item.code == itemNameOrCode;
  }
  iNamepluscode = item.name + item.code;
  return iNamepluscode.includes(itemNameOrCode);
}

function hasItemOf(itemNameOrCode, exactMatch=false) {
  for (var i = 0; i < inventoryItems.length; i++) {
    if (isItem(inventoryItems[i], itemNameOrCode, exactMatch)) {
      return true;
    }
  }
  return false;
}


function updateItemButtonDisplay()
{
  let dots = itemButton.getElementsByClassName("notification-dot")
  let dot = dots[0]
  if (unreadItemCount > 0) dot.style.display = "block"
  else dot.style.display = "none"
}
