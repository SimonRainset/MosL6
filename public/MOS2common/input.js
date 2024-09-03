

function hideInputElement(element)
{
    element.classList.add('hidden');
}

function showInputElement(element)
{
    element.classList.remove('hidden');
}

function inputContainerToggle()
{
    inputContainer.classList.toggle('hidden');
}

function inputSetup()
{
    sendButton.dataset.clicked = false;
    


    sendButton.addEventListener('click', function(event) {
        
        console.log('Message:', inputBox.value);
        sendUserMessage(inputBox.value);
        inputBox.value = '';
        observeChangeOfInput.notify("default");
      
    
    });


    discoverButton.addEventListener('click', function() {
        if (discoverButton.innerText === '发现') {observeChangeOfInput.notify("discover");}
        else if (discoverButton.innerText === '返回') {observeChangeOfInput.notify("default");}
     
    
    });

    inputBox.addEventListener('input', function() {
        // 检查 inputBox 是否有文字
        if (inputBox.value.trim() !== '') {
            observeChangeOfInput.notify("text");
        } else {
            observeChangeOfInput.notify("default");
        }
      });
      
 
    // itemButton.addEventListener('click', function() {
    //     observeChangeOfInput.notify("itemDefault");

    //     });

     // 监听按钮点击事件以显示/隐藏inventory
     itemButton.addEventListener('click', function() {
        if(inputStatus === 'itemDefault')
        {
            observeChangeOfInput.notify("default");
        }
        else 
        {
            observeChangeOfInput.notify("itemDefault");
        }
      });

      shootButton.innerText = `拍摄（剩余${shootCount}次）`
      shootButton.addEventListener('click',function(){
        if (shootCount===0) return;
        else {
            observeChangeOfGameStatus.notify({last:'mainscene',current:'camerascene'});
            gameStatus = 'camerascene';
            shootCount--;
            shootButton.innerText = `拍摄（剩余${shootCount}次）`
        }


      })







}




function inputOnDefault()
{
    console.log("unreadItemCount = " + unreadItemCount);
    inventory.classList.remove('show');
    inputContainer.classList.remove('show');
    
    showInputElement(discoverButton);  discoverButton.innerText = '发现';
    showInputElement(inputBox);

    let dot = document.getElementById("item-button-notification-dot")
    if (unreadItemCount > 0)
        dot.style.display = "block"
    else dot.style.display = "none"

    showInputElement(itemButton);
    hideInputElement(sendButton);
    hideInputElement(shootButton);
    hideInputElement(iButtons);
}

function inputOnDiscover()
{
    showInputElement(discoverButton);   discoverButton.innerText = '返回';
    hideInputElement(inputBox);         
    hideInputElement(itemButton);
    hideInputElement(sendButton);
    showInputElement(shootButton);
    hideInputElement(iButtons);
}

function inputOnText()
{
    showInputElement(discoverButton);   
    showInputElement(inputBox);         
    hideInputElement(itemButton);
    showInputElement(sendButton);
    hideInputElement(shootButton);
    hideInputElement(iButtons);
}

function inputOnItemDefault()
{
    inventory.classList.add('show');
    inputContainer.classList.add('show');
    hideInputElement(discoverButton);
    hideInputElement(inputBox);
    showInputElement(iButtons);


}
function inputOnItemSelect()
{

}

function inputUpdate(notice)
{
    inputStatus = notice;
    if(notice ==='default') inputOnDefault();
    if(notice === 'text') inputOnText();
    if(notice === 'discover') inputOnDiscover();
    if(notice === 'itemDefault') inputOnItemDefault();
    if(notice === 'itemSelect') inputOnItemSelect();
}





