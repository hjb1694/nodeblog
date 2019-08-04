const pool = require('../utils/mysql');
const session = require('express-session');


exports.readPost = async (req,res,next) => {

    const postId = req.params.id;

    const [rows,fields] = await pool.execute('SELECT * FROM posts WHERE id = ?',[postId]);

    if(rows.length === 0){
        res.redirect('/notfound');
    }else{

        res.status(200).render('post',{
            pageTitle : rows[0].title,
            post : rows[0]
        });



    }

}