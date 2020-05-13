'use strict'

class ValidatorAuthPostMiddleware {
    app;
    constructor(app){
        this.app = app;
    }
    handle = (req, res, next) => !req.body.key ?  res.status(400).json({ message: 'password not found' }) : next();
}

module.exports = ValidatorAuthPostMiddleware;