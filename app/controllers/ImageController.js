'use strict'

const sharp = require('sharp');
const path = require('path')
const Driver = require('../config/DriverConfig')

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
        try {
            var driverBuffer = await Driver.get(req.params.image)
            if (!driverBuffer) return res.status(404).json({ message: 'file not found' })
            var resizeImageBuffer = await sharp(driverBuffer).resize(...(resize.split('x')).map(s => +s), options).toBuffer()
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': resizeImageBuffer.length
             });
             return res.end(resizeImageBuffer); 
        } catch (e) {
            return res.status(500).json({ message: 'internal error: ' + e })
        }
    }

    async store (req, res) {

    }
}

module.exports = ImageController;