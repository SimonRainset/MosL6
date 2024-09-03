const LearnConfig = {
  P5原生: {
    mainTitle: "P5原生",
    mainDesc:
      "P5.js (前身processing) 是大名鼎鼎的交互艺术与交互设计的原型工具，它的语言风格很友好，非常适合大众进行原型创新。P5.js 也有很强的社区，很多人为它制作新的工具，MoreThanChat也可以认为是一个P5.js为了AI原生创意而制作的新工具（或工具集）。接下来，我们就从零开始了解一下P5.js的功能吧！本页只展示了一些基础的用法，如果需要更完整的文档，请参考P5官方文档：https://p5js.org/reference/",
    content: [
      {
        title: "P5：人机交互引擎",
        tags: ["p5.js"],
        desc: "虽然P5中交互艺术最为流行，但是它的功能完全可以支持它作为一个人机交互引擎（交互设计，App设计，游戏）。了解它必须从理解P5.js最重 要的两个函数 setup(), draw()开始。试试看通过下面的例子理解它们分别都在干什么吧？",
        file: "p5-1",
      },
      {
        title: "P5是画布",
        tags: ["p5.js", "canvas"],
        desc: "你应该可以看懂setup()里面的每一行单词的意思（square, ellipse)，但是后面的数字又是什么玩意？想要了解他们的意义，最简单的方法就是自己改一改😎。（后面每个数字都试试改改吧，你是不是感觉已经可以做一幅画了，哈哈哈）",
        file: "p5-2",
      },
      {
        title: "P5动起来",
        tags: ["p5.js", "交互设计"],
        desc: `既然要交互，那必须不能是静止的界面。我们在【P5：人机交互引擎】的例子中已经了解了如何通过让背景变化。现在，我们完全可以让画面也动起来！请试试看如何能让椭圆动的慢一点？
        另外，draw()中的push与pop是什么意思？？试试删掉它们？`,
        file: "p5-3",
        referenceName: "【改编自：https://p5js.org/examples/shapes-and-color-shape-primitives/】",
        referenceLink: "https://p5js.org/examples/shapes-and-color-shape-primitives/",
      },
      {
        title: "P5交互",
        tags: ["p5.js", "交互设计"],
        desc: `最后，我们将输入与画面的动作结合起来，就变成了一个完整的交互了。所谓交互，你做一个动作，机器给你一个反馈，周而复始。下面的红球就是一个例子。你能知道如何让红球变大么，如何又能让红球移动么？`,
        file: "p5-4",
      },
      {
        title: "P5原生挑战",
        tags: ["挑战"],
        desc: `基于上面的例子，请实现一个挑战：在红球内部按住鼠标，红球会变大。在红球外部按住鼠标，红球会朝鼠标位置移动。`,
        file: "p5-5",
      },
    ],
  },

  GUI: {
    mainTitle: "如何实现GUI",
    mainDesc:
      "一个小应用的实现，怎么能少得了一些交互组件呢？但是，仅仅使用原生的p5工具是不足够的，在这里，我们将介绍touchgui来帮助构建开关、按钮、滑条等GUI组件。接下来，我们就一起看看他们是怎么实现的吧~ || P5.touchgui官方主页：https://github.com/L05/p5.touchgui || P5.touchgui案例：https://github.com/L05/p5.touchgui/tree/master/examples ",
    content: [
      {
        title: "原生输入框Input",
        tags: ["原生P5", "createInput"],
        desc: `不借助其他任何库，只使用原生的p5，就可以使用createInput()函数生成一个输入框，它可以使用其他p5原生的功能函数，比如设置它的位置。你输入在框中的的内容可以被调用哦~。`,
        file: "gui-1",
      },
      {
        title: "按钮Button",
        tags: ["touchgui", "createButton"],
        desc: "从这里开始，你就可以在原生p5的基础上接触到touchgui的使用啦。首先，你需要使用createGui()函数创建一个管理GUI的系统。你应该能够猜到createButton()的意思是生成一个按钮，快试试修改函数中的每一个参数，看看都有什么变化吧！在draw()里，你可以设定一些鼠标事件，通过自定义一些鼠标事件，让和按钮的交互变得更有趣😆。",
        file: "gui-2",
        referenceLink: `https://github.com/L05/p5.touchgui`,
        referenceName: "【参考链接：p5.touchgui】",
      },
      {
        title: "滑条Slider",
        tags: ["touchgui", "createSlider"],
        desc: "你已经知道使用touchgui如何创建一个按钮，类似地，你也可以使用createSlider生成一个滑条。相比按钮，滑条增加了两个新的参数，猜一猜是什么，然后在代码中修改验证你的猜想吧~",
        file: "gui-3",
      },
      {
        title:"开关Toggle",
        tags: ["touchgui", "createToggle"],
        desc: "刚看到代码效果的时候，是不是觉得开关和前面学到的按钮很像呢？可以看到，在draw()函数里，开关打开后的操作挂在了val下，放在isPressed鼠标事件下会有什么效果呢？（想一想，如果想让开关默认是激活状态，应该怎么做呢？）",
        file: "gui-4",
      },
      {
        title:"调色挑战",
        tags: ["挑战"],
        desc: "请你试一试用上面学到的内容做一个调色板吧~看看能不能使用滑条调出任意不同的颜色🎨。（进阶：试试展示随机一个颜色作为标准色卡，让玩家使用调色盘尝试调出和色卡相近的颜色）",
        file: "gui-challenge2"
      },
      {
        title:"Gold Clicker",
        tags: ["挑战"],
        desc: "请你尝试做一个点击爆金币的小游戏，每按下一次按钮就可以爆金币加钱💰，需要在屏幕中显示当前获得的金币数量。（进阶：可以点击升级每一次的点击）",
        file: "gui-challenge1",
      }
    ],
  },

  LLM:{
    mainTitle: "大语言模型",
    mainDesc:`MoreThanChat的一个核心功能就是将P5.js与大语言模型相连，我们设计了非常简单易懂的代码方式，让每个人可以快速打造自己的AI创意原型。`,
    content:[
      {
        title: "第一次对话",
        tags: ["LLM","发送与回收"],
        desc: `在MoreThanChat使用大语言模型的方法非常简单，你可以设定一个变量 agent= new P5GLM(), 它将负责与一个叫chatGLM的大语言模型沟通。每次需要向大语言模型发送一段话的时候就调用 agent.send("你想发送的话")。 然后接着用agent.onComplete来定义你希望大模型返回答案之后的行动。在下面的例子里，我们鼠标点击屏幕的时候就会向大语言模型发出"你好"。你可以试试是否可以将大模型返回的内容显示为红色的😁。`,
        file: "LLM-1",
      },
      {
        title: "等待的反馈",
        tags: ["LLM","交互"],
        desc: `下面我们可以尝试一个很有必要的交互，就是在我们等待大模型思考的时候进行一些UI上的反馈。其实，这不需要新的功能，就用我们刚刚学习的send与onComplete就可以实现。你可以看看下面代码是如何实现的，并且尝试设计一个更生动反馈的方式吧~`,
        file: "LLM-2",
      },
      {
        title: "系统提示词",
        tags: ["LLM","SystemPrompt"],
        desc: `大语言模型可以设定系统提示词，它一般定义了大语言模型在这个应用中所代表的角色或者功能。我们可以通过 agent.setSystemPrompt来定义系统提示词。这里我们成功的将大语言模型变成了一只喜欢说emoji的大熊猫就🐼（代码28行），哈哈，尝试和它说说话吧。你还可以怎么设定这个角色呢，尝试给大语言模型换个角色吧。`,
        file: "LLM-3",
      },
      {
        title: "流式传输",
        tags: ["LLM","Streaming"],
        desc: `大语言模型并不是一次性把所有的文字一次性返回的，而是一个词一个词返回。有的时候，我们希望大语言模型生成的过程也能像打字机效果一样展示出来，这个时候就可以用到流式传输的功能。它只需要在agent.send的时候增加一个参数true，代表了打开流式传输：  agent.send(“你好”,true)，然后在agent.onStream中定义每一次收到返回的时候干什么，就可以了。下面的例子里就可以看到打字机的效果。你可以试试在whenStream函数中试试代码29行 content += '!'，看看有什么效果，理解agent.onStream的功能。`,
        file: "LLM-4",
      },

    ],

  },

  Prompt: {
    mainTitle: "提示词工程",
    mainDesc:
      "提示词指的是你输入给大模型的内容，你输入的越好，它生成的越满足要求，因此不断打磨提示词的过程就叫提示词工程（Prompt Engineering）。提示词工程对于AI原生创意来说非常重要。掌握好它就像掌握好一种语言技能，可以让AI的行动或者语言更好的符合预期。下面就让我们一起来学习这门语言的艺术吧（本节所有内容引用并改编自：https://github.com/henry-gu/prompt-engineering-for-developers/blob/main/content/2.%20%E6%8F%90%E7%A4%BA%E5%8E%9F%E5%88%99%20Guidelines.ipynb）",
    content: [
      {
        title: "提示词使用清晰具体的指令",
        tags: ["Prompt Engineering", "指令"],
        desc: `以清晰、具体的方式表达您的需求。假设您面前坐着一位来自外星球的新朋友，其对人类语言和常识都一无所知。在这种情况下，您需要把想表达的意图讲得非常明确，不要有任何歧义。同样的，在提供 Prompt 的时候，也要以足够详细和容易理解的方式，把您的需求与上下文说清楚。
并不是说 Prompt 就必须非常短小简洁。事实上，在许多情况下，更长、更复杂的 Prompt 反而会让语言模型更容易抓住关键点，给出符合预期的回复。原因在于，复杂的 Prompt 提供了更丰富的上下文和细节，让模型可以更准确地把握所需的操作和响应方式。
下面，请你提供你的提示词，并让大模型生成类似的话吧。`,
        file: "prompt1",
      },
      {
        title: "黄金公式：提示词 = 指令+用户输入",
        tags: ["Prompt Engineering", "指令"],
        desc: `在设计一个AI原生应用时，Prompt由两部分构成：设计师设计的指令，以及用户的输入。比如一个帮宠物起名字的应用，他的Prompt可能是："请你给宠物【用户输入】起一个名字"。其中“请你给宠物……起一个名字”是指令，是设计师设计的，隐藏在应用中，而【用户输入】则可能是“猫”“狗”“蛇”等等，而真正的Prompt则是两者合成：请你给宠物狗起一个名字。这样的Prompt传给大模型，他就可以返回一个狗的名字。下面的例子，你将通过这个黄金公式完善Prompt（代码第40行），从而实现一个调侃名人的应用。`,
        file: "prompt2",
      },
      {
        title: "让大模型做步骤归纳题",
        tags: ["Prompt Engineering", "指令"],
        desc: `现在我们设计一个更加复杂一点的应用，一个步骤归纳题应用，它可以将有步骤的输入进行分步，没有步骤的输入将输出：没什么步骤可言。在下面的例子里，你有两段不同的语料，一个有步骤一个没有步骤，你可以修改指令，让Prompt（代码35行）可以针对不同输入达到预期的效果。`,
        file: "prompt3",
      },
      {
        title:"少样本学习",
        tags: ["Prompt Engineering", "few shots"],
        desc: "有的时候，提供案例是一个非常有效的方式。你可以尝试一下在【黄金公式：提示词 = 指令+用户输入】案例中，不设计指令，而是通过案例来实现同样的效果。这就叫大模型的少样本学习。",
        file: "prompt4",
      },
      {
        title:"情绪动物电台",
        tags: ["Prompt Engineering", "挑战"],
        desc: "接下来我们做一个综合练习，你可以和一个有情绪的动物对话，用户可以选择不同动物（2-3个），以及不同的情绪（2-3个），选择完之后可以与之对话。",
        file: "prompt5",
      },
    ],
  },
  LLM进阶: {
    mainTitle: "大模型进阶",
    mainDesc:
      "在学习完MoreThanChat的大语言模型基础与提示词工程之后，我们再尝试一下更加复杂但也更加强大的大模型用法。",
    content: [
      {
        title: "用JSON实现多输出",
        tags: ["LLM Adv", "JSON"],
        desc: `在很多时候，我们希望大模型一次返回多个输出，比如希望大模型回答问题的时候同时回复【思考过程】，并且将【思考过程】与最终答案放在UI的不同位置或设计不同特效。这时候，使用JSON格式是最方便的做法。JSON格式简单来说就是{名称/值}的集合，我们可以把想要的内容比如【思考过程】【思考结果】作为名称，而大模型返回的答案作为值，并最终对大模型进行JSON解析，提取相关的信息。试试看修改systemPrompt，让LLM生成更多不同输出吧？更多JSON资料请参考：https://www.json.cn/wiki.html`,
        file: "LLMadv-1",
      },
      {
        title: "返回文字的妙用",
        tags: ["LLM Adv", "JSON"],
        desc: `大模型返回的文字，不仅仅可以作为文字，它还有很多的妙用，比如可以输出数值，输出 true/false。这些数值又可以直接被p5程序使用，实现一些AI原生功能。试玩一下下面的小游戏，尝试修改代码，看看怎么样可以让小明有更多表情呢😂😊😜🙃😤？`,
        file: "LLMadv-2",
      },
      {
        title: "多个agent",
        tags: ["LLM Adv", "multi-agent"],
        desc: `在MoreThanChat中，你可以定义多个大模型agent，给他们赋予不同的使命。比如一个agent用来代表林妹妹，一个agent是伏地魔，让他们进行一场约会（开玩笑……。 你甚至可以再加入一个丘比特agent来判断他们的约会是否及格，是不是可以有下一次🤭 。在下面的例子里，我们设定了两个agent，一个叫xiaomingAgent，负责代表小明与用户对话，另一个是 sceneAgent，用来生成场景，并且根据对话内容判断是否需要变化场景。在这个例子中，我们还用了agent的一个功能，就是调用agent的历史对话，这个对话记录在xiaomingAgent.messages数组之中。`,
        file: "LLMadv-3",
      },
      {
        title: "小丑的礼物",
        tags: ["LLM Adv", "挑战"],
        desc: `下面可以尝试一个综合挑战：小丑🤡有一个惊喜礼盒，当用户说出心愿时，小丑惊喜礼盒会酝酿一会儿，然后突然爆出礼物名字，礼物描述和礼物图样（用emoji表示）。如果用户说的不是心愿，则小丑会消失。进阶：增加爆出礼物时的有趣的特效`,
        file: "LLMadv-4",
      },
      
    ],
  },
  P5Play: {
    mainTitle: "P5Play",
    mainDesc:
      "P5.play是P5的游戏引擎库，集成了物理，相机等一系列对于制作游戏非常友好的工具。强烈建议想做游戏的设计者读完P5.play的教程（https://p5play.org/learn/）。这个教程非常直观，大约3小时左右就可以通关 ✌✌✌",
      content: [
        {
          title: "Let's Play",
          tags: ["P5Play", "Playground"],
          desc: `P5Play的learn非常做的非常好了，这里就只留一个Playground吧`,
          file: "P5Play-1",
        },]

  }
};

export default LearnConfig;
