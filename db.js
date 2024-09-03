// 引入mysql模块
let mysql = require("mysql");

//创建连接对象
let connection =mysql.createConnection({
    host: "localhost",//连接本地计算机
    port:3306,//端口
    user:"root",//数据库账号
    password:"C@ptbt%ptp#0827",//密码
    database:"more_than_chat"//连接的数据库名
});

//调用connect方法创造连接
connection.connect((err)=>{//回调函数,如果报错会把err填充上
    if(err){
        console.error("连接失败"+err.stack);//打印堆栈信息
        return;
    }
    console.log("连接成功");
});


//关闭数据库连接
connection.end();
