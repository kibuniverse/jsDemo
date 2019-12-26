const express = require('express');

var mysql = require('mysql');
var cookieParser = require('cookie-Parser');
var expressSession = require('cookie-session');

var server = express();

server.use(cookieParser());

var arr = [];
for (var i = 0; i < 10000; i++) {
    arr.push(Math.random() * 9999999 + "");
}
//生成加密数组作为秘钥


server.use(expressSession({
    name: 'sess', //设置ssion名称
    keys: arr, //手动设置session密钥.这个秘钥必须是字符串数组
    maxAge: 60 * 60 * 1000 //手动设置session过期时间，单位为毫秒
}));

//连接数据库
var connection = mysql.createConnection({
    host: 'localhost',
    //进入哪个数据库
    database: 'mysql',
    user: 'root',
    password: 'yankaizhi123'
});


connection.connect(function(err) {
    if (err) {
        console.log('与MySQL数据库建立连接失败。');
        console.log(err);
    } else {
        console.log('与MySQL数据库建立连接成功。');
    }
});


//解决跨域问题， 即统配所有的域
server.use('*', function(req, res, next) {
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', 'null');
    next(); // 链式操作
});



server.get('/logout', function(req, res) {
    req.session = null
    res.send({ok: true, way: 'logout', msg: '登出成功'});
    res.end();
});


server.get('/get_name', function(req, res) {
    res.send({ok : true, way: 'get_name', name: req.session.is_log});
    res.end();
})

server.get('/auto_login', function(req, res) {
    if('is_log' in req.session) {
        res.send({ok: true, way: 'auto_login', msg: '已经登陆'});
        res.end();
    } else {
        res.send({ok: false, way: 'auto_login', msg: '未存在登陆用户'});
        res.end();
    }
});




// 注册的函数
server.get('/register', function(req, res) {
    console.log('register');
    var sql = getSelectSql('mydata', req.query['user']);
    // 判断该用户名是否存在
    // 函数内部return promise对象

    isExist(connection, sql, 'register').then(function() {
        res.send({ok: false, way: 'register', msg: '该用户已存在'});
        res.end();
    })
    .catch(function() {
        console.log(sql);
        //  发送请求
        Query(connection, sql, function() {
            console.log('ok');
            res.send({ok: false, way: 'register',msg: '数据库错误'});
            res.end();
            // 插入数据
        }, function(result) {
                let sql = "INSERT INTO mydata SET ?";
                //得到需要存入到数据库中的对象
                var post = {
                    name: req.query['user'],
                    password: req.query['pass']
                };
                connection.query(sql, post, (err, result) => {
                    if(err) {
                        console.log(err);
                        res.send({ok: false, way: 'register', msg: '数据库错误'});
                        res.end();
                    } else {
                        // 插入成功
                        console.log(sql);
                        console.log('注册成功');
                        res.send({ok: true, way: 'register', msg: '注册成功'});
                        res.end();
                    }
                });
                //insert
        });
    });
    
});
// 登陆的函数
server.get('/login', function(req, res) {
    if(req.session[req.query['user']] != undefined) {
        res.send({ ok: false, way: 'login', msg: '请勿重复登陆'});
        res.end();  
    }
    else{
        let sql = getSelectSql('mydata', req.query['user']);
        // 判断该用户名是否存在
        isExist(connection, sql, 'login')
        .then(function() {
            Query(connection, sql, function() {
                res.send({ ok: false, way: 'login', msg: '数据库错误'});
                res.end();
            }, function(result) {
                 // 密码匹配
                if (result[0].password == req.query['pass']) {
                    req.session[req.query['user']] = result[0].password;
                    req.session.is_log = req.query['user'];
                    res.send({ok: true,way: 'login',msg: '登陆成功'});
                } else {
                    res.send({ ok: false, way: 'login', msg: '用户名或密码错误'});
                }
                res.end();
            });
        })
        .catch(function() {
            // 查询失败
            res.send({ok: false, way: 'login', msg: '用户名或密码错误'});
            res.end();
        });
    }
    
});






// 监听端口
server.listen(1912);

function getSelectSql(table, name) {
    var sql = 'SELECT * FROM ' + table + ' WHERE name=\'' + name + '\'';
    return sql;
};

/*
 * obj --> 需要执行的query的对象
 * sql --> sql语句
 * errFun --> sql语句出错时执行的函数
 * correctFun --> 对数据库操作成功时执行的函数
 */
function Query(obj, sql, errFun, correctFun) {
    obj.query(sql, (err, result) => {
        if (err) {
            errFun(err);
        } else {
            // 成功时执行的函数
            correctFun(result);
        }
    });
}

// 判断数据库中是否存在某个数据
/*
 * obj --> sql对象
 * sql --> 需要发送的sql 语句
 */

function isExist(obj, sql, ways) {

    return new Promise(
        function(resolve, reject) {
            obj.query(sql, (err, result) => {
                if(err) {
                    //sql 语句错误
                    res.send({
                        ok: false,
                        way: ways,
                        msg: '数据库错误'
                    });
                    res.end();
                    reject();
                } else {
                    // console.log(result);
                    if(result.length == 0) {
                        console.log('用户名或密码错误');
                        reject();
                    } else {
                        // console.log('该用户存在');
                        resolve();
                    }  
                }
            });
        })
}