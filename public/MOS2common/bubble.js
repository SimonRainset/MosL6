function bubbleFromSprite(sprite, text) {
    let maxTimeOut = 0;
    let spriteBubbling = false;
    // 检查队列中是否已经有相同 sprite 的记录
    for (let i = 0; i < bubbleQueue.length; i++) {
      if (bubbleQueue[i].sprite === sprite) {
        maxTimeOut = Math.max(maxTimeOut, bubbleQueue[i].timeOut);
        spriteBubbling = true;
      }
    }
    if (spriteBubbling)maxTimeOut+=35
    // 添加新泡泡记录到队列
    bubbleQueue.push({
      sprite: sprite,
      text: text,
      timeOut: maxTimeOut  // 设置 timeOut
    });
  }
  
  function bubble(text){bubbleFromSprite(currentInteractiveCharacter,text)}
  
  function bubbleText(sprite,text)
  {
    console.log(sprite.label);
    if (sprite === undefined || sprite ===  null) return
    console.log('bubbling')
    bubbleSprite = new Sprite(sprite.x+random(-50,-0), sprite.y, labelSize*text.length, labelSize,'none');
    bubbleSprite.textSize = labelSize*0.7;
    bubbleSprite.color = "#F9EEEC";
    bubbleSprite.strokeWeight = 0;
    bubbleSprite.text = text;
    bubbleSprite.vel.y = -1;
    bubbleSprite.life = 600;
  
  }

function bubbleDraw()
{
  for (let i = 0; i < bubbleQueue.length;) {
    bubbleQueue[i].timeOut--; // 减少 timeOut
    if (bubbleQueue[i].timeOut < 0) {
      // timeOut 小于零，显示泡泡并从队列中删除记录
      bubbleText(bubbleQueue[i].sprite, bubbleQueue[i].text);
      bubbleQueue.splice(i, 1); // 删除当前记录，i 不变，继续循环
    } else {
      i++; // 继续检查下一个记录
    }
  }
}