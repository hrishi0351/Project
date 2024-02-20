const {getUser} = require('..//JWT/Auth.controller')

// middeleware used for authentication handler

async function restrictToLoggedinUserOnly(req, res, next){
    const userUid = req.cookies.Uid;

    if(!userUid) return res.redirect('/login')
    const user = getUser(userUid)

    if(!user) return res.redirect("/login");

    req.user=user;
    // next("/Home");
    next();
}

module.exports = {restrictToLoggedinUserOnly};