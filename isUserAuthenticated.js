const isUserAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({success: false, message: 'Not authorized'});
}

module.exports = isUserAuthenticated;