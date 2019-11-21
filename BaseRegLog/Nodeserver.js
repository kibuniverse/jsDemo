const express = require('express');
var server = express();
var mysql = require('mysql');
//连接数据库
var connection = mysql.createConnection({
    host: 'localhost',
    //进入那个数据库
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
    var findRe = getSelectSql('mydata', req.query['user']);
    console.log(findRe);
    connection.query(findRe, (err, result) => {
        if (err) {
            res.send({
                ok: false,
                way: 'register',
                msg: '数据库错误'
            });
            res.end();
        } else { // 查找成功则说明该用户名已经存在
            console.log(result);
            if (result.length == 0) {
                let sql = "INSERT INTO mydata SET ?";
                //得到需要存入到数据库中的对象
                var post = {
                    name: req.query['user'],
                    password: req.query['pass']
                };
                connection.query(sql, post, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('注册成功');
                        res.send({
                            ok: true,
                            way: 'register',
                            msg: '注册成功'
                        });
                         res.end();
                    }
                }); // 
                //insert
            } else {
                res.send({
                    ok: false,
                    way: 'register',
                    msg: '该用户已存在'
                });
                res.end();
            }
        }
       
    });
});
// 登陆的函数
server.get('/login', function(req, res) {
    let sql = getSelectSql('mydata', req.query['user']);

    Query(connection, sql, 
        function(){
            res.send({
                ok: false,
                way: 'register',
                msg: '数据库错误'
            });
            res.end();
            }, function(result){
                if(result.length == 0) {
                    res.send({
                        ok: false,
                        way: 'register',
                        msg: '该用户名不存在'
                    });
                    res.end();
                } else {
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
                }
            }
    );

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
        if(err) {
            errFun();
        } else {
            correctFun(result);
        }
    });
}