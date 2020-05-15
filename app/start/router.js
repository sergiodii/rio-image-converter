'use strict'

const routerStart = (app) => {
    const route = new (require('../config/RouterConfig'))(app);
    
    // --------------------------
    //   ROUTES
    // --------------------------


    route.get('/', async (_, res) => {
        res.status(200).json({ message: 'Welcome to rio-image-converter version 0.0.2' })
    })
    route.post('/auth', 'ValidatorAuthPostMiddleware', 'AuthController.store')


    route.get('/image', 'AuthMiddleware', async (_, res) => {
        res.status(200).json({message: 'to get image insert the image name in url'})
    })
    route.get('/image/:image', 'AuthMiddleware', 'ImageController.show')
    route.post('/image', 'AuthMiddleware', 'ImageController.store')

}

module.exports = routerStart;