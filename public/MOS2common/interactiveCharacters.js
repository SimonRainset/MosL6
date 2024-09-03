

function createInteractiveCharacter(objectParams)
{
  //io = {};
  io = new interactiveCharacters.Sprite(); //注意这里交互物体必须是Sprite才能有agent
  //io.d = objectParams.d;
  io.image = objectParams.image;
  //io.tile = objectParams.tile ;
  io.scale = objectParams.scale ;
  io.label = objectParams.label;
  io.thumbnail =  objectParams.thumbnail;
  io.labelSprite = new labelSprites.Sprite(io.x, io.y +50  , labelSize*io.label.length, labelSize,'none'); io.labelSprite.text = io.label; 
 // io.labelSprite = new labelSprites.Sprite(io.x, 400 , labelSize*io.label.length, labelSize,'none'); io.labelSprite.text = io.label; 
  io.itemUsedCount = {};
  io.getItemUsedCount = function(doKey) {
    if (doKey === "") {
      var count = 0;
      for (var key in this.itemUsedCount) {
        count += this.itemUsedCount[key];
      }
      return count;
    }
    if (!(doKey in this.itemUsedCount)) {
      return 0;
    }
    return this.itemUsedCount[doKey];
  }
  
  addThumbnail(io);
  if (objectParams.systemPrompt!==undefined)
    {
      io.agent = new P5GLM();
      io.agent.setSystemPrompt(objectParams.systemPrompt);
      if (objectParams.firstMessage!==undefined) io.agent.messages.push({ role: "assistant", content: objectParams.firstMessage });
      if (objectParams.onSend!==undefined) io.onSend = objectParams.onSend;
      if (objectParams.onRespond!==undefined) io.onRespond = objectParams.onRespond;
    }
    if (objectParams.onInteract!==undefined) io.onInteract = objectParams.onInteract;
    if (objectParams.onApproach!==undefined) io.onApproach = objectParams.onApproach;
    if (objectParams.onLeave!==undefined) io.onLeave = objectParams.onLeave;
    interactiveCharacters.push(io);
  return io;
}

function deleteInteractiveCharacter(io)
{
  if (io===currentInteractiveCharacter) setCurrentInteractiveCharacter(null);
    io.labelSprite.remove();
    io.remove();
}

function deleteCurrentInteractiveCharacter()
{
  deleteInteractiveCharacter(currentInteractiveCharacter);
}

function setCurrentInteractiveCharacter(newIC)
{

  lastInterativeCharacter = currentInteractiveCharacter;
  if (lastInterativeCharacter) 
    {
      lastInterativeCharacter.visible = false;
      lastInterativeCharacter.labelSprite.visible = false;
      lastInterativeCharacter.onlineDot.style.display = "none";
      lastInterativeCharacter.thumbnail.style.opacity = 0.7;
    }
  currentInteractiveCharacter = newIC;
  if (newIC)
    {
      newIC.visible = true;
      newIC.labelSprite.visible =true;
      newIC.onlineDot.style.display = "block";
      newIC.thumbnail.style.opacity = 1;
    }
  if (lastInterativeCharacter!==currentInteractiveCharacter) 
    observeChangeOfCurrentInteractiveCharacter.notify({last:lastInterativeCharacter,current:currentInteractiveCharacter}); // notify all observer change of current interactive object
}


function addThumbnail(interactiveCharacter){

  const thumbnailContainer = document.getElementById('thumbnail-container');
  const thumbDiv = document.createElement('div');
  thumbDiv.classList.add("thumbnail-container");

  const thumbSrc = interactiveCharacter.thumbnail;
  console.log(thumbSrc);
  const thumbImg = document.createElement('img');
  thumbImg.src = thumbSrc;
  thumbImg.style.width = '100%'; // 缩略图宽度适应容器
  thumbImg.style.opacity = 0.7;

  thumbDiv.appendChild(thumbImg);

  const dot = document.createElement("span");
  dot.classList.add("character-online-dot");
  // 将小圆点添加到按钮
  thumbDiv.appendChild(dot);
  dot.style.display = "none"
  interactiveCharacter.onlineDot = dot;
  interactiveCharacter.thumbnail = thumbImg;

  thumbImg.addEventListener('click', function() {
    // 点击缩略图时的逻辑
    console.log('Thumbnail clicked');
    setCurrentInteractiveCharacter(interactiveCharacter);
    
    // 这里可以添加您需要执行的逻辑，比如切换到大图显示等

  });
  thumbnailContainer.appendChild(thumbDiv); 
}



function drawCurrentInteractiveCharacter()
{
  for( let i of interactiveCharacters)
    {
      if (i === currentInteractiveCharacter) {i.visible = true; i.labelSprite.visible = true;}
      else {i.visible= false; i.labelSprite.visible = false;}
    }

}

function setInteractiveCharacterImg(character, newImg){
  character.image = newImg;
}


function showCurrentInteractiveCharacter()
{
  currentInteractiveCharacter.visible = true;
  currentInteractiveCharacter.labelSprite.visible = true;

}

function hideCurrentInteractiveCharacter()
{
  currentInteractiveCharacter.visible = false;
  currentInteractiveCharacter.labelSprite.visible = false;

}