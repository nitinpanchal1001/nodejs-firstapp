const express = require("express")
const { mongo, default: mongoose } = require("mongoose")
const app = express()
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { name } = require("ejs")
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use(express.static("./public"))
app.set("view engine" , "ejs")
const dbURI = "mongodb+srv://new_user:12344321@cluster0.lqskhnl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(dbURI,{
    dbName : "backend",
})
.then(() => console.log("database connected"))
.catch((err) => console.log(err))

const userSchema = new mongoose.Schema({
    name : String , 
    email : String,
    password : String,
})

const User = mongoose.model("User" , userSchema)

app.get('/add' , async(req , res) =>{
   await Message.create({name : "Nitin" , email : "panch@panch.com"}) 
})
const isAuthenticated = async (req,res,next) => {
    const {token} = req.cookies
    if(token) {
        const decoded = jwt.verify(token , "sdjasdbajsdbjasd")
        req.user = await User.findById(decoded._id)
        next();
    }
    else{
        res.redirect('/login')
    }
}
app.get('/' , isAuthenticated ,(req,res) => {
    res.render("logout.ejs", {name : req.user.name})
    console.log(req.user        )
})
app.get("/login" , (req , res) => {
    res.render("login.ejs")
})
app.get('/register' , (req,res) => {
    res.render("register.ejs")
})
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    let user = await User.findOne({ email });
  
    if (!user) return res.redirect("/register");
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch)
      return res.render("login", { email, message: "Incorrect Password" });
  
    const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");
  
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 1000),
    });
    res.redirect("/");
  });
  app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
  
    let user = await User.findOne({ email });
    if (user) {
      return res.redirect("/login");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
  
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
  
    const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 1000),
    });
    res.redirect("/");
  });
app.get('/logout' , (req, res) => {
    res.cookie("token" , "null" , {
        httpOnly : true , 
        expires : new Date(Date.now())
    })
    res.redirect('/')
})



app.listen(5000 , () => {
    console.log("server is working");
})
