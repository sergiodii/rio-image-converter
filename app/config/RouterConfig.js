'use strict'

class RouterConfig {
    constructor(app) {
        this.app = app;
        this.controllerPath = '../controllers';
        this.middlewarePath = '../middlewares'
        this.pullExecution = [];
    }
    


    _controllerPreparer(controller) {
        var controllerClass;
        var controllerMethod;
        if (typeof controller === 'function') {
            return controller;
        }
        else if (typeof controller === 'string') {
            var controllerList = controller.split('.');
            if (typeof controllerList === 'object' && controllerList.length === 2) {
                controllerClass = controllerList[0]
                controllerMethod = controllerList[1]
            }
            return new (require(`${this.controllerPath}/${controllerClass}`))()[controllerMethod];
        } else {
            throw { message: 'error on controllerpass' }
        }
    }
    
    get = (url, middleware, controller) => this.app.get(...this._parameterPreparer(url, middleware, controller));
    post = (url, middleware, controller) => this.app.post(...this._parameterPreparer(url, middleware, controller));
    put = (url, middleware, controller) => this.app.put(...this._parameterPreparer(url, middleware, controller));
    delete = (url, middleware, controller) => this.app.delete(...this._parameterPreparer(url, middleware, controller));

    _getMiddlewareInstance(middlewareName) {
        return new (require(`${this.middlewarePath}/${middlewareName}`))(this.app).handle;
    }

    _parameterPreparer(url, middleware, controller) {
        if (middleware && !controller) {
            controller = middleware
            middleware = null;
        }
        var execution = [url, this._fileRetriever];
        if (middleware) execution.push(this._getMiddlewareInstance(middleware))
        execution.push(this._controllerPreparer(controller))
        return execution;
    }

    _fileRetriever (req, res, next) {
        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
        req.files = {};
        try {
            if (req.headers && req.headers['content-type'] && req.headers['content-type'].match(/multipart[/]fo/g)) {
                form.parse(req, function (err, fields, files) {
                  if(Object.keys(files).length) {
                    req.files = files;
                    next()
                  } else {
                    next()
                  }
                })
              } else {
                next()
              }
        } catch (e) {
            console.log(e)
            res.status(500),json({ message: 'internal Error: ' + e })
        }
      }
  
}

module.exports = RouterConfig