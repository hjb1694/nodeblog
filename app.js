const express = require('express');
const path = require('path');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const pool = require('./utils/mysql');
const csrf = require('csurf');
const bodyParser = require('body-parser');

const postsRoute = require('./routes/posts');
const userRoute = require('./routes/user');

const port = process.env.PORT || 3001;
const host = 'localhost';

const sessionStore = new MysqlStore({},pool);


const app = express();

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret : 'thisisanincrediblesecret', 
    resave : false, 
    saveUninitialized : false,
    cookie : {
        maxAge : 1000 * 60 * 60 * 24
    }, 
    store : sessionStore
}));
app.use(csrf());

app.use((req,res,next)=>{

    res.locals.isLoggedIn = req.session.isLoggedIn

    next();

});


app.get('/', async (req,res,next) => {

    const [rows, fields] = await pool.query('SELECT * FROM posts');

    res.render('index',{
        pageTitle : 'Home', 
        posts : rows
    });


});

app.use('/posts',postsRoute);
app.use('/user',userRoute);


app.use(['*','/notfound'],(req,res,next)=>{

    res.render('notfound',{
        pageTitle : 'Not Found'
    });

});





app.listen(port, host, () => console.log(`listening on port ${port}`));
