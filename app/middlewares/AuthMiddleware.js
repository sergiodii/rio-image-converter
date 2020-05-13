'use strict'

var jwt = require('jsonwebtoken');
class AuthMiddleware {
    app;
    constructor(app){
        this.app = app;
    }

    handle (req, res, next) {
        const bearerToken = req.headers['authorization'];
        if (bearerToken) {
            let token = bearerToken.split(' ')[1];
            jwt.verify(token, process.env.APP_KEY, (err, authData) => {
                if (err) {
                    res.status(403).json({ message: 'dont authorized' });
                } else {
                    next();
                }
            })
        } else {
            return res.status(403).json({ message: 'dont authorized' });
        }
    }
}

module.exports = AuthMiddleware;