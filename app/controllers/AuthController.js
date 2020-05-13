'use strict'

class AuthController {


    async index(req , res) {
        // res.status(200).json({ 'Ola': 'Seja bem vindo' })
    }

    async store (req, res) {
        if (req.body.key !== process.env.SERVER_PASS) return res.status(403).json({ message: 'user or pass not found' })
        jwt.sign({ uid: 'admin_user' }, process.env.APP_KEY, (err, token) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'internal error' });
            }
            return res.status(200).json({ type: 'Bearer', token });
        });
    }
}

module.exports = AuthController