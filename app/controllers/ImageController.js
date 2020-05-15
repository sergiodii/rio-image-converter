'use strict'

const sharp = require('sharp');
const path = require('path')
const Driver = require('../config/DriverConfig')
const Fs = require('fs')

class ImageController {

    async show (req, res) {
        let { size } = req.query
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
            if (!req.params.image) return res.status(400).json({ message: 'param name not found' })
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
        let { name } = req.query
        let { image } = req.files
        if (!image) return res.status(404).json({ message: 'image not found' })
        var newName =  name || image.name.split('.')[0]
        Fs.access(`${Driver.rootPath}/${newName || image.name}`, Fs.constants.F_OK, (err) => {
            if(err) {
                Fs.readFile(image.path, async (err, data) => {
                    if (err){ 
                        res.status(500).json({ message: err })
                    }
                    else {
                        var result = await Driver.put(newName ? newName : image.name, data)
                        if (result) {
                            res.status(200).json({ file: 'ok' })
                        } else {
                            res.status(500).json({ message: 'error on save file' })
                        }
                    }
                })
            } else {
                res.status(400).json({ message: 'there is an image with the same name' })
            }
        })
  

    }
}

module.exports = ImageController;