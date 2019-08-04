const pool = require('../utils/mysql');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator/check');
const session = require('express-session');


exports.create = (req,res,next) => {

    res.render('register',{
        pageTitle : 'Register', 
        csrfToken : req.csrfToken()
    });


}

exports.registerProcess = async (req,res,next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.json({errors : errors.array()});

    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const username = req.body.username;

    const [rows, fields] = await pool.execute('SELECT COUNT(id) AS count FROM users WHERE email = ? || username = ?',[email, username]);

    if(rows[0].count !== 0){

        res.send({errors : [{msg : 'This username or email already exists.'}]});

    }else{

        const hashedPassword = await bcrypt.hash(password,12);

        await pool.execute(`
        INSERT INTO users(name,email,username,password)
        VALUES(?,?,?,?)
        `,[name,email,username,hashedPassword]);

        req.session.isLoggedIn = true;
        req.session.username = username;

        res.status(201).json({success : 'success!'});

    }


}

exports.logout = (req,res,next) => {

    req.session.destroy();

    res.redirect('/');

}

exports.login = (req,res,next) => {

    res.render('login',{
        pageTitle : 'Login', 
        csrfToken : req.csrfToken()
    });

}

exports.loginProcess = async (req,res,next) => {

    const username = req.body.username;
    const password = req.body.password;

    const [rows,fields] = await pool.execute('SELECT password, is_admin FROM users WHERE username = ?',[username]);

    if(!rows.length){

        res.json({errors : [{msg : 'Authentification Failed'}]});

    } else {

        const isMatched = await bcrypt.compare(password,rows[0].password);

        if(!isMatched){

            res.json({errors : [{msg : 'Authentification Failed'}]});

        } else {

            req.session.isLoggedIn = true;

            res.json({success : 'Authentification successful'});


        }

    }


}