//gọi expressjs
var express = require('express');
const Handlebars = require("express-handlebars");
//tạo app để cấu hình router
var app = express();

//chạy lên localhost với port 3111
app.listen(process.env.PORT || '3112');

app.engine('handlebars', Handlebars());
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.get('/',function (req, res){
    res.render("index")
})

//đưa layout vào '/handlebars'
app.get('/login',function (req,res) {
    res.render("login");
})

app.get('/sigup',function (req,res) {
    res.render("sigup");
})
