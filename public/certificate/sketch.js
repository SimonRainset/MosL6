let groupIndex = 6;
let font35,font95;
let ifSaved = false;

// 创建一个P5GLM对象
let agent = new P5GLM();
let finalWords =false;
let mtcSprite;
let campSprite;
let storyGroup;
let storyX = 20;
let storyY = 200;
let wordOut = true;
let author = ['李军','戴灏庄','高嘉婧，宫欣君','宗孚耕','李婧婷','肖岚茜，张子鹏\n于汉杰，邱诗涵','苏子霖，胡若晨，田润颜\n张修格，冀天扬'];
let title = ['恶魔的6亿个名字','宗教文本疗愈','Designer PsychoGraphy','EmotionGPT','大姨模拟器','AI Flow','世另我的蛋'];
let ifPrototype=[false,false,true,true,true,true,true];
let desc = [`游戏类型:文字冒险，推理，游戏核心玩法:玩家与恶魔对话，套出恶魔真名。玩家拥有“心模植入”的能力，可以更改恶魔的人格（动态改变prompt），通过另一个agent判断改变的人格是否与预设冲突，如果冲突则会导致失败。玩家需要在不断的轮回中挖掘出恶魔隐藏的真名。`,
  ` 一个利用宗教文本资料进行模型的微调，来实现借由宗教语言风格，如宗教用词去进行心理疗愈的交互体验。这是去宗教性的，它并非一个宗教知识问答网站，也并非一个某个宗教的对话平台。希望可以取各类宗教语言的精华 `,
  `结合知识图谱的概念，使用MoreThanChat来创作一个表示设计师在设计过程中心理地图的可视化。展示设计师在进行设计时考虑的各种因素及其相互关系。`,
  `在ChatGPT对话中增加多个情绪指标，这些情绪指标会对AI生成的文字产生影响，同时根据用户的对话内容和时间流逝，不同的情绪指标会发生不同的变化`,
  `利用gpt实现用户和“大姨”对话，应对过年时大姨的重重盘问，最后取得不同成就`,
  `AI Flow是一个数据与智能驱动的生成式可视化交互艺术作品，旨在通过流动感和动态感的生成艺术形式，表现AI思考的过程。在观众与AI互动的过程中，作品利用more than chat工具中的GLM大语言模型，实时生成AI的思维过程，并通过Processing生成艺术，将AI思考过程中产生的“思维模式”或“情绪反应”转化为流动的艺术形态。作品是艺术家对于“AI是否具备意识”这一问题的探讨，是艺术与科学的深度融合，通过沉浸式的交互艺术，探讨AI潜在的情感和意识维度，从而引发更广泛的哲学和社会讨论。`,
  `根据心理问答测试AI生成专属个性化心灵陪伴精灵`
];


// 接收到GPT消息时会调用的函数
function whenStream(t) {
  if (wordOut)
    {
      t = t.replace(/\s+/g, '');
      console.log(t.length);
      let storyWord = new storyGroup.Sprite();
      storyWord.text = t;
      storyWord.x = storyX;
      storyWord.y = storyY;
      storyWord.w = t.length*15;
      storyX += (storyWord.w + 15);
      if (storyX > width) 
        {storyX = 20; storyY+=25;} 
      if (storyY>height -200) 
        {
          wordOut = false;
          mtcSprite.collides(storyGroup);
          mtcSprite.moveTo(width/2,height/2,6);
        }
  
  
    }


}

function preload() {
  font35 = loadFont('./HY35.otf');
  font95 = loadFont('./HY95.otf')

}


function setup() {
  new Canvas(800, 800);
 

  let mtcText = `.      hhh           hhhh                                                            hhhhhhhhhhhhhh                                                                hhhhhhhhhhh                                                           
      hhhhhhh   hhhhhhhh                                      hhh               hhhh    hhh            hhh                                                     hhh           hhhh    hhh                                  hhhh          
      hhhhhhh   hhhhhhhh                                      hhh               hhhh    hhh            hhh                                                     hhh           hhhh    hhhh                                 hhhh          
      hhh    hhh    hhhh    hhhhhhhhhhh    hhhhhhh        hhhh   hhhh                   hhh            hhhhhhhhhh     hhhhhhhhhh        hhhhhhhh               hhh                   hhhhhhhhhhh    hhhhhhhhhhh        hhhhhhhhhhh      
      hhh    hhh    hhhh    hhhhhhhhhhh    hhhhhhh        hhhh   hhhh                   hhh            hhhhhhhhhh     hhhhhhhhhh        hhhhhhhh               hhh                   hhhhhhhhhhh    hhhhhhhhhhh        hhhhhhhhhhh      
      hhh           hhhh    hhh    hhhh    hhhh   hhhh    hhhhhhh                       hhh            hhh    hhh     hhh    hhh        hhhh    hhh            hhh           hhhh    hhhh   hhhh    hhhh   hhhh           hhhh          
      hhh           hhhh    hhh    hhhh    hhhh   hhhh    hhhhhhh                       hhh            hhh    hhh     hhh    hhh        hhhh    hhh            hhh           hhhh    hhhh   hhhh    hhhh   hhhh           hhhh          
      hhh           hhhh    hhhhhhhhhhh    hhhh               hhhhhhh                   hhh            hhh    hhh     hhhhhhhhhhhhhh    hhhh    hhh               hhhhhhhhhhh        hhhh   hhhh    hhhhhhhhhhhhhh        hhhh          
      hhh           hhhh    hhhhhhhhhhh    hhhh               hhhhhhh                   hhh            hhh    hhh     hhhhhhhhhhhhhh    hhhh    hhh               hhhhhhhhhhh        hhhh   hhhh    hhhhhhhhhhhhhh        hhhh          
    `;
  let campText = `.                                                                                                            
                                                                                    hhh    hhh               
                                                                                 hhhhhhhhhhhhhhhhh           
                                                 hhhh                            hhhhhhhhhhhhhhhhh           
                                                 hhhh                               hhh    hhh               
                                              hhhhh hhhhh                                                    
                                              hhhhh hhhhh                                                    
                 hhh      hhhhh         hhhhhh         hhhhh         hhh      hhhhhhhhhhhhhhhhhhhhhhh        
              hhhhhhhhhhhhhhhhhhh                      hhhhh  hhh    hhh     hhhhh              hhhhh        
              hhhhhhhhhhhhhhhhhhh                             hhh    hhh     hhhhh              hhhhh        
                 hhh       hhh                hhhhhhhhhhhhh   hhh    hhh           hhhhhhhhhhh               
                 hhh       hhh                hhhhhhhhhhhhh          hhh           hhhhhhhhhhh               
              hhhhhhhhhhhhhhhhhhh             hhh       hhh          hhh            hhh    hhh               
                                              hhh   hhhh         hhhhh              hhhhhhhhhhh              
                                              hhh   hhhhh        hhhh               hhhhhhhhhhh              
                hhhhh     hhhhh               hhh                                                            
                hhhhh     hhhhh               hhhhhhhhhhhhhh                     hhhhhhhhhhhhhhhhh           
                                              hhhhhhhhhhhhhh                     hhhhhhhhhhhhhhhhh           
                                                                                hhhhh        hhhhh           
                                                                                hhhhh        hhhhh           
                                                                                 hhh          hhh            
                                                                                 hhhhhhhhhhhhhhhh            
                                                                                 hhhhhhhhhhhhhhhh            
                                                                                                             

  `;
  let palette = {
		h: color('#FA577c'),
		
	};
  mtcSprite = new Sprite();
  mtcSprite.img = spriteArt(mtcText, 3,palette);
  mtcSprite.img.scale.y = 2;
  mtcSprite.x = width/2;
  mtcSprite.y = height+200;

  campSprite = new Sprite();
  campSprite.img = spriteArt(campText,3,palette);
  campSprite.img.scale.y = 2;
  campSprite.x = width/2+200;
  campSprite.y = height+400;
  




  //mtcSprite.overlaps(storyGroup);
  storyGroup = new Group();
  storyGroup.w = ()=>random(0,100)>50?50:25;
  storyGroup.h = 17;
  storyGroup.text = 'jhj';
  storyGroup.textSize = 10;
  storyGroup.drag = 0;
  storyGroup.friction = 0;
  
  storyGroup.bounciness = 0.6;
  storyGroup.color = color('#F6FE9A');
  
  storyGroup.stroke = color('#F6FE9A');
  storyGroup.textColor = color(100);
  storyGroup.textFont = font35;

  mtcSprite.overlaps(storyGroup);
  storyGroup.layer = 1;
  storyGroup.stoke = 'white';
  storyGroup.mass = 1;
  mtcSprite.layer = 2;
  mtcSprite.mass = 10;
  
  campSprite.overlaps(storyGroup);


  // agent.send(`请写一篇700字左右的故事，讲述${author[groupIndex].replace(/\s/g, '')}在一个叫做More Than Chat的共创营里经历各种困难并最终完成了一个叫做的“${title[groupIndex]}”项目，项目简介为："${desc[groupIndex]}"。请使用类似荒诞小说讲故事的语言风格，多包含一些作者的行为与语言`,true);
  // agent.onStream = whenStream;



}

function sendGLM()
{
  agent.send(`请写一篇700字左右的故事，讲述${author[groupIndex].replace(/\s/g, '')}在一个叫做More Than Chat的共创营里经历各种困难并最终完成了一个叫做的“${title[groupIndex]}”项目，项目简介为："${desc[groupIndex]}"。请使用类似奇谈类小说讲故事的语言风格，多包含一些作者的行为与语言`,true);
  agent.onStream = whenStream;
}

function draw() 
{
  clear();
  background('#ECFEF9');
  
  if(kb.pressed('1') )
  {
    groupIndex = 0;
    sendGLM();
  }
  if(kb.pressed('2') )
    {
      groupIndex = 1;
      sendGLM();
    }
    if(kb.pressed('3') )
      {
        groupIndex = 2;
        sendGLM();
      }
      if(kb.pressed('4') )
        {
          groupIndex = 3;
          sendGLM();
        }
        if(kb.pressed('5') )
          {
            groupIndex = 4;
            sendGLM();
          }
          if(kb.pressed('6') )
            {
              groupIndex = 5;
              sendGLM();
            }
            if(kb.pressed('7') )
              {
                groupIndex = 6;
                sendGLM();
              }
 

  if (mtcSprite.collides(storyGroup)) 
    {
      mtcSprite.collider = 's';
      campSprite.moveTo(width/2+200,height/2+320,8);
    }
  if(mtcSprite.collides(campSprite))
  {
    campSprite.collider = 's';
  }
  allSprites.draw();
  if (finalWords)
  {

    push();
    fill('#FA577c');
    let t;
    textFont(font35);
    if (ifPrototype[groupIndex]) t = 'We celebrate the idea and prototype of:';
    else t = 'We celebrate the idea of:';
    textSize(20);
    textAlign(CENTER);
    text(t , width/2, height/2-100);
    text('by',width/2,height/2);
    text('@',width/2,height/2+120);
    text('2024.7.10-17',120,height-50);
    
    textSize(50);
    textFont(font95);
    textAlign(CENTER);
    text(title[groupIndex],width/2,height/2-40);
    text(author[groupIndex],width/2,height/2+60);
    
    
    noFill();
    stroke('#FA577c');
    strokeWeight(10);
    rect(0,0,width,height);
    strokeWeight(1);
    rect(8,8,width-16,height-16);
    pop();
    
    if (!ifSaved)
      {
        saveCanvas('group'+ (groupIndex+1)+ '.jpg');
        ifSaved = true;
      }



  }



}

// 鼠标点击时调用的函数
function mousePressed() {
  storyGroup.drag = 10;
  finalWords = true;


 

}
