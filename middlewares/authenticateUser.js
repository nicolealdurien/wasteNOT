

function authenticateUser(req, res, next) {
    if(req.session) {
        if(req.session.user) {
            res.locals.userId = req.session.user.userId
            next()
        } else {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
}

module.exports = authenticateUser