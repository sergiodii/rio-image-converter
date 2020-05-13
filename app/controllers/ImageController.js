'use strict'

var sharp = require('sharp');
var path = require('path')

class ImageController {

    async show (req, res) {
        let { size } = req.query
        
        console.log(size, req.params.image)
        var resize = '500x500';
        if (size) {
            var containX = size.split('x')
            if (typeof containX === 'object') resize = size;
            if (typeof containX === 'string') resize = `${size}x${size}`
        }
        var options = {}
        if (Object.keys(req.query).length) {
            Object.keys(req.query).forEach(k => {
                if (k !== 'size') options[k] = req.query[k]
            })
        }
        var buffer = await sharp(path.join(__dirname, '..', '..', 'image.png')).resize(...(resize.split('x')).map(s => +s), options).toBuffer()
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': buffer.length
         });
         res.end(buffer); 
    }

    async store (req, res) {

    }
}

module.exports = ImageController;