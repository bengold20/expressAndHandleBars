//gọi expressjs
var express = require('express');
var router = express.Router();
const Handlebars = require("express-handlebars");
//tạo app để cấu hình router
var app = express();

//chạy lên localhost với port 3111
app.listen(process.env.PORT || '3112');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/data/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

var uploadx = multer({
    dest: './public/data/uploads/'
    , storage: storage,
    limits: {
        fileSize: 1 * 1024 * 1024, // gioi han file size <= 1MB

    }
}).single('avatar')

app.post('/upload',uploadx, function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any
    console.log(req.file, req.body);

    // (req, res, function (error) {
    //     if (error instanceof multer.MulterError) {
    //         return res.send("File size Maximum is 1MB.Please try again!!!")
    //     } else {
    //         return res.send('Loi ko xac dinh');
    //     }
        res.send('OK nhe')
    // });
});

app.engine('handlebars', Handlebars());
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.get('/upload', function (req, res, next) {
    res.render('upload', {title: 'Express'});
});

app.get('/',function (req, res){
    res.render("index")
})


app.get('/login',function (req,res) {
    res.render("login");
})

app.get('/sigup',function (req,res) {
    res.render("sigup");
})
