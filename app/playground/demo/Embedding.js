agent = new P5GPT();
agent.onComplete = (content) => {
  console.log(content);
};

embedding = agent.embedding("我好可爱。");
