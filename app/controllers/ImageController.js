'use strict'

const sharp = require('sharp');
const path = require('path')
const Driver = require('../config/DriverConfig')
const Fs = require('fs')
const { v4: uuidv4 } = require('uuid');

class ImageController {

    async show (req, res) {
        // ?size=800x500 
        // ?rounded=d100xr50
        // ?rotate=90
        let { size, rounded, rotate } = req.query
        var resize = '500x500';
        let diameter;
        let radius;

        if (size) {
            var containX = size.toLowerCase().split('x')
            if (typeof containX === 'object') resize = size;
            if (typeof containX === 'string') resize = `${size}x${size}`
        }
        if (rounded) {
            diameter = rounded.toLowerCase().split('x').filter(r => r.toLowerCase().match(/[d]/g))[0]
            diameter = diameter ? +diameter.toLowerCase().replace('d', '') : 500
            radius = rounded.split('x').filter(r => r.toLowerCase().match(/[r]/g))[0]
            radius = radius ? radius.toLowerCase().replace('r', '') : +diameter / 2
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
            
            // Variável de acumolo de execução
            let SHARP_EXEC = sharp(driverBuffer)

            if (rounded) {
                SHARP_EXEC.resize(+diameter, +diameter, options).composite([{
                    input: Buffer.from( `<svg width="${diameter}" height="${diameter}">
                        <rect x="0" y="0" fill="#FCB54B"  width="${diameter}" height="${diameter}" rx="${radius}" ry="${radius}" fill-opacity="1" />
                    </svg>` ),
                    blend: 'dest-in',
                }])
            }

            if (!rounded) {
                SHARP_EXEC.resize(...(resize.split('x')).map(s => +s), options)
            }
            if (rotate) {
                SHARP_EXEC.rotate(+rotate)
            }

            var resizeImageBuffer = await SHARP_EXEC.toBuffer();
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
        var newName =  name || uuidv4() || image.name.split('.')[0]
        Fs.access(`${Driver.rootPath}/${newName || image.name}`, Fs.constants.F_OK, (err) => {
            if(err) {
                Fs.readFile(image.path, async (err, data) => {
                    if (err){ 
                        res.status(500).json({ message: err })
                    } else {
                        var result = await Driver.put(newName ? newName : image.name, data)
                        if (result) {
                            res.status(200).json({ file: { name:  newName || image.name, ext: 'png', originalName: image.name.split('.')[0] }  })
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