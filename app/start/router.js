'use strict'

const routerStart = (app) => {
    const route = new (require('../config/RouterConfig'))(app);
    
    // --------------------------
    //   ROUTES
    // --------------------------


    route.get('/', async (_, res) => {
        res.status(200).json({ message: 'Welcome to rio-image-converter version 0.0.1' })
    })
    
    route.post('/auth', 'ValidatorAuthPostMiddleware', 'AuthController.store')
    route.get('/image/:image', 'AuthMiddleware', 'ImageController.show')

}

module.exports = routerStart;