function sendUserMessage(message) {
    
    if (message.trim() !== "") {
      if (currentInteractiveCharacter.onSend!==undefined) currentInteractiveCharacter.onSend(message);
    
      // 系统回复
      if (currentInteractiveCharacter.agent) {
       
          currentInteractiveCharacter.agent.send(message);
          updateChatLog();
          currentInteractiveCharacter.agent.onComplete = (t) => {
            if (currentInteractiveCharacter.onRespond!==undefined)  currentInteractiveCharacter.onRespond(t);
            updateChatLog();
          };
        
      
      }
    }
  }

function updateChatLog() {
    // 清空所有消息
    chatLog.innerHTML = "";

    // 如果有当前交互对象且它有代理，则显示所有消息
    if (currentInteractiveCharacter && currentInteractiveCharacter.agent) {
        currentInteractiveCharacter.agent.messages.forEach((msg) => {
            let sender = msg.role;
            let message = msg.content;
            let bubbleClass = sender === "user" ? "bubble me" : "bubble you";
            let chatLabel = sender === "user" ? "你" : currentInteractiveCharacter.label;

            // 创建消息元素
            let messageElement = document.createElement("div");
            messageElement.className = bubbleClass;
            messageElement.innerHTML = `${message}<div class="time">${chatLabel}</div>`;

            // 将消息元素添加到 chatLog
            chatLog.appendChild(messageElement);
        });

        // 自动滚动到最新消息
        chatLog.scrollTop = chatLog.scrollHeight;
    }
}


function chatLogDisplayToggle(interactiveCharacter){
  if (interactiveCharacter.current === null) showChatLog = false;
  else showChatLog = true;
  updateChatLog();
};

function addChatMessage(message)
{
  addChatMessageToInteractiveCharacter(currentInteractiveCharacter,message);
  updateChatLog();

}

function addChatMessageFromSelf(message)
{
  addChatMessageFromSelfToInteractiveCharacter(currentInteractiveCharacter,message);
  updateChatLog();

}

function addChatMessageToInteractiveCharacter(interactiveCharacter,message)
{
  interactiveCharacter.agent.messages.push({role:"assistant",content:message})
  updateChatLog();
}

function addChatMessageFromSelfToInteractiveCharacter(interactiveCharacter,message)
{
  interactiveCharacter.agent.messages.push({role:"user",content:message})
  updateChatLog();
}