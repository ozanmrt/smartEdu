
 module.exports = (req,res,next)=>{
    if (userIN) {
        return res.redirect('/');
    }
    next();
 };