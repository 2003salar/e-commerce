const isUserAdmin = (req, res, next) => {
    const user = req.user;
    if (!user || !user.isAdmin) {
        return res.status(403).json({success: false, message: 'Forbidden'})
    }
    next();
}

module.exports = isUserAdmin;