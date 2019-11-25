const express = require('express');
var server = express();
var mysql = require('mysql');
//连接数据库
var connection = mysql.createConnection({
    host: 'localhost',
    //进入哪个数据库
    database: 'mysql',
    user: 'root',
    password: 'yankaizhi123',
    dataStrings: true
});
connection.connect(function(err) {
    if (err) {
        console.log(err);
        console.log('与MySQL数据库建立连接失败。');
    } else {
        console.log('与MySQL数据库建立连接成功。');
    }
});
//解决跨域问题， 即统配所有的域
server.use('*', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'null');
    next(); // 链式操作
});
// 注册的函数
server.get('/register', function(req, res) {
    var sql = getSelectSql('mydata', req.query['user']);
    // 判断该用户名是否存在
    if( isExist(connection, sql, 'register') ) {
        console.log('income');
        res.send({ok: false, way: 'register', msg: '该用户已存在'});
        res.end();
    } else {
        console.log(sql);
        //  自己封装的Query
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
                        res.send({ok: false,way: 'register',msg: '数据库错误'});
                        res.end();
                    } else {
                        // 插入成功
                        console.log('注册成功');
                        res.send({ok: true,way: 'register',msg: '注册成功'});
                        res.end();
                    }
                });
                //insert
        });
    }
    
});
// 登陆的函数
server.get('/login', function(req, res) {
    let sql = getSelectSql('mydata', req.query['user']);
    // 判断该用户名是否存在
    if(isExist(connection, sql, 'login') == false) {
        res.send({ok: false, way: 'login', msg: '该用户不存在'});
        res.end();

    } else {
        Query(connection, sql, function() {
        res.send({
            ok: false,
            way: 'login',
            msg: '数据库错误'
        });
        res.end();
    }, function(result) {
        // 密码匹配
        if (result[0].password == req.query['pass']) {
            res.send({
                ok: true,
                way: 'login',
                msg: '登陆成功'
            });
        } else {
            res.send({
                ok: false,
                way: 'login',
                msg: '密码错误'
            });
        }
        res.end();
    });
    }
    
});
// 监听端口
server.listen(1912);

function getSelectSql(table, name) {
    var sql = 'SELECT * FROM ' + table + ' WHERE name=\'' + name + '\'';
    return sql;
}
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
    // 因为是异步执行 所以将返回值以回调函数方式去执行
    return obj.query(sql, (err, result) => {
        if(err) {
            //sql 语句错误
            res.send({
                ok: false,
                way: ways,
                msg: '数据库错误'
            });
            res.end();
        } else {
            console.log(result);
            // 未查询到 --> return 0
            if(result.length == 0) {
                console.log('该用户不存在');
                return false;
            // 查询到了 --> return 1
            } else {
                console.log('该用户存在');
                return true;
            }  
        }
    });
}