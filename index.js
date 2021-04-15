//gọi expressjs
var express = require('express');
var router = express.Router();
const Handlebars = require("express-handlebars");
//tạo app để cấu hình router
var app = express();

const mongoose = require('mongoose');

async function connectdb() {
    await mongoose.connect('mongodb+srv://admin:admin@cluster0.5xypv.mongodb.net/databaseben?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    console.log("connect successfully!1")
}

connectdb();

var user = new mongoose.Schema({
    Name: String,
    Gender: String,
    Email: String,
    Password: String,
    Phone: String,
    ImageURL: String
})

var userConnect = mongoose.model("users", user);


//chạy lên localhost với port 3111
app.listen(process.env.PORT || '3112');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/data/uploads/')
    },
    filename: function (req, file, cb) {

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.jpg'
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

app.post('/upload', uploadx, function (req, res) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any
    console.log(req.file, req.body);

    // (req, res, function (error) {
    //     if (error instanceof multer.MulterError) {
    //         return res.send("File size Maximum is 1MB.Please try again!!!")
    //     } else {
    //         return res.send('Loi ko xac dinh');
    //     }
    res.send('Successfully!!')
    // });
});

app.engine('handlebars', Handlebars());
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));

app.get('/upload', async function (req, res, next) {
    const userList = await userConnect.find({});
    res.render('upload', {title: 'Express', userList});
});

app.get('/', async function (req, res) {
    res.render("index")
})

app.post("/postdata", async (req, res, next) => {
    await userConnect.create(req.body);
    res.redirect("/sigup");
})

app.get('/login', function (req, res) {
    res.render("login");
})
app.get("/userList", async (req, res) => {
    let userList = await userConnect.find({});
    userList = userList.map((item) => item.toObject());
    // res.status(200).json(userList);
    res.render("userList", {
        userList,
        title: "users list",
        isHasData: userList.length > 0 ? true : false
    });
})
app.route("/user/:id").get(async (req, res) => {
    const user = (await userConnect.findById({_id: req.params.id})).toObject();
    // res.status(200).json(user);
    res.render("userDetail", {user});
}).post(uploadx, async (req, res) => {
    const data = {
        ...req.body,
        ImageURL: "/" + req.file.path.split("\\").slice(1, req.file.path.split("\\").length).join("/")
    }
    const newUser = await userConnect.findByIdAndUpdate({_id: req.params.id}, data);
    res.redirect('/userList')
})

app.get("/user/:id/delete", async (req, res) => {
    await userConnect.findByIdAndDelete({_id: req.params.id});
    res.redirect("back")
})
app.route("/signup")
    .get(function (req, res) {
        res.render("signup");
    })
    .post(uploadx, async function (req, res, next) {
        const data = {
            ...req.body,
            ImageURL: "/" + req.file.path.split("\\").slice(1, req.file.path.split("\\").length).join("/")
        }
        const newUser = await userConnect.create(data);
        res.redirect('/userList')
    })
