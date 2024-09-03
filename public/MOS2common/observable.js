///////////////// 观察者模式 //////////////////
function createObservable() {
    // 存储观察者列表
    const observers = [];
  
    // 注册观察者
    const subscribe = (observer) => {
      if (typeof observer === 'function') {
        observers.push(observer);
      } else {
        throw new Error('Observer must be a function');
      }
    };
  
    // 移除观察者
    const unsubscribe = (observer) => {
      observers.splice(observers.indexOf(observer), 1);
    };
  
    // 通知所有观察者
    const notify = (data) => {
      observers.forEach(observer => observer(data));
    };
  
    // 返回一个对象，包含订阅和通知的方法
    return {
      subscribe,
      unsubscribe,
      notify
    };
  }
  
  const observeChangeOfCurrentItem = createObservable();
  const observeChangeOfCurrentInteractiveCharacter =  createObservable();
  const observeChangeOfInventory =  createObservable();
  const observeChangeOfGameStatus = createObservable();
  const observeChangeOfInput = createObservable();

  const observeChangeOfCurrentCharacter = createObservable();


  observeChangeOfCurrentItem.subscribe(updateIButtons);
  observeChangeOfCurrentInteractiveCharacter.subscribe(chatLogDisplayToggle);
  observeChangeOfCurrentInteractiveCharacter.subscribe(updateIButtons);
  observeChangeOfCurrentInteractiveCharacter.subscribe(drawCurrentInteractiveCharacter);
  observeChangeOfInventory.subscribe(updateInventory);
  observeChangeOfGameStatus.subscribe(sceneUIToggle);
  observeChangeOfGameStatus.subscribe(cutsceneEnterExit);
  observeChangeOfGameStatus.subscribe(cameraSceneEnterExit);
  observeChangeOfGameStatus.subscribe(loadCutsceneEnterExit);
  observeChangeOfGameStatus.subscribe(mainsceneEnterExit);
  
  observeChangeOfInput.subscribe(inputUpdate);
  

  
  
