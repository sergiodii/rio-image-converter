'use strict'
const path = require('path')

const FlyDrive = require('@slynova/flydrive');

class DriverConfig {
    
    config = {
        /*
         |--------------------------------------------------------------------------
         | Default Filesystem Disk
         |--------------------------------------------------------------------------
         |
         */
        default: 'local',
      
        /*
         |--------------------------------------------------------------------------
         | Filesystem Disks
         |--------------------------------------------------------------------------
         | Supported: "local", "s3"
         |
         */
        disks: {
          local: {
            driver: 'local',
            root: path.join(__dirname, '..', '..', 'images'),
          }, 

        //   s3: {
        //     driver: 's3',
        //     key: 'AWS_S3_KEY',
        //     secret: 'AWS_S3_SECRET',
        //     region: 'AWS_S3_REGION',
        //     bucket: 'AWS_S3_BUCKET',
        //   },
      
        //   spaces: {
        //     driver: 's3',
        //     key: 'SPACES_KEY',
        //     secret: 'SPACES_SECRET',
        //     endpoint: 'SPACES_ENDPOINT',
        //     bucket: 'SPACES_BUCKET',
        //     region: 'SPACES_REGION',
        //   },
      
        //   ftp: {
        //     driver: 'ftp',
        //     host: 'FTP_HOST',
        //     port: 21,
        //     user: 'FTP_USER',
        //     pass: 'FTP_PASS',
        //     longLive: false,
        //   },
        },
      }

      constructor() {
        this.drive = new FlyDrive(this.config);
      }

      get rootPath () {
        return this.config.disks[this.config.default].root
      }

      /**
       * @function get
       * @param {String} fileName
       * @return {Buffer}
       */
      async get(fileName) {
          try {
              var hasFile = await this.drive.disk(this.config.default).exists(`${fileName}`);
              if (hasFile) {
                  var fileBuffer = await this.drive.disk(this.config.default).get(`${fileName}`);
                  return fileBuffer;
              }
              throw new Error('file not found')
          } catch (e) {
            console.log(e)
            return null;
          }
      }

      async put(filename, buffer) {
        try {
          await this.drive.disk(this.config.default).put(filename, buffer)
          return true;
        } catch (e) {
          console.log(e)
          return null;
        }
      }


}

module.exports = new DriverConfig();