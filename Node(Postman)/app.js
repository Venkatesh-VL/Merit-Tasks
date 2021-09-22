var express = require("express");
var app = express();
var path = require("path");

var cnt_group = []


const {MongoClient,ObjectId, Db} = require("mongodb")
const url = 'mongodb://127.0.0.1:27017/';

app.use(express.static("uploads"))


app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.set('view engine','pug');
app.set('views','./views');

const multer = require("multer")


const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,__dirname+'/uploads');
    },
    filename: (req,file,cb) => {
        var fileext = path.extname(file.originalname);
        console.log(file);
        const uniqueSuffix = Date.now() + '-' +Math.round(Math.random() * 1E9)
        cb(null,file.fieldname+'-'+uniqueSuffix+fileext)
    }
})

const upload = multer({storage: storage})

app.get("/",(req,res)=>{
    MongoClient.connect(url,(err,conn)=>{
        var db = conn.db("merit")
        db.collection('contact').find().toArray((err,data)=>{
            res.render("contacts",{
                allcontacts:data
            })
        });       
    });   
})

app.get("/view",(req,res)=> {
    MongoClient.connect(url,(err,conn)=>{
        var db = conn.db("merit")
        db.collection('contact').find().toArray((err,data)=>{
            res.send(data);
        });       
    });   
});

app.get("/viewdb/:id?",(req,res)=> {
    MongoClient.connect(url,(err,conn)=>{
        var db = conn.db("merit")
        db.collection('contact').find({_id : ObjectId(req.params.id)}).toArray((err,data)=>{
            res.render("view",{
                contact: data
            })
        });       
    });   
});

app.get("/contact",(req,res)=>{
    res.sendFile(__dirname+"/addcontacts.html")
})

app.post("/addcontact",upload.single('propic'),(req,res)=>{
    MongoClient.connect(url,(err,conn)=>{
        var db = conn.db("merit");
        req.body.propic = req.file.filename
        db.collection("contact").insertOne(req.body)
            res.redirect("/");
        })
        })

app.get('/deletecontact/:id?',(req,res) => {
    MongoClient.connect(url,(err,conn) => {
        var db = conn.db('merit');
        db.collection('contact').deleteOne({_id : ObjectId(req.params.id)});
        res.redirect('/');
    });
});

app.get('/updatecontact/:id?',(req,res) => {
    MongoClient.connect(url,(err,conn) => {
        var db = conn.db('merit');
        db.collection('contact').find({_id : ObjectId(req.params.id)}).toArray((err,data) =>{
            res.render('update.pug',{
                usr : data[0]
            });
        });
    });
})

app.post('/update/:id?',upload.single('propic'),(req,res) => {
    MongoClient.connect(url,(err,conn) => {
        var db = conn.db('merit');
        db.collection('contact')
        .updateOne({_id : ObjectId(req.body.id)},
        {$set: {pno:req.body.pno,email: req.body.email,group:req.body.group,propic:req.file.filename}},
            (err,data) =>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log(data);
                    res.redirect("/");
                }
        });
    });
});

//group middlewaare

function group(req,res,next){
    var group = req.url.replace('/', '');
    MongoClient.connect(url,(err,conn) => {
        var db = conn.db('merit');
        db.collection('contact').find({group:group}).toArray((err,data) =>{
            cnt_group = data
            next()
        });
    });
}

app.get('/friend',group,(req,res) => {
    res.render('contacts.pug',{
        allcontacts : cnt_group
    })
})

app.get('/work',group,(req,res) => {
    res.render('contacts.pug',{
        allcontacts : cnt_group
    })
})

app.get('/family',group,(req,res) => {
    res.render('contacts.pug',{
        allcontacts : cnt_group
    })
})


app.listen(8000,function(){console.log("App listening on 8000")});