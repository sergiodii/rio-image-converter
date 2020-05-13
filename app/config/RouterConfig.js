'use strict'

class RouterConfig {
    app;
    constructor(app) {
        this.app = app;
    }
    controllerPath = '../controllers';
    middlewarePath = '../middlewares'

    pullExecution = [];

    _prepareController(controller) {
        var controllerClass;
        var controllerMethod;
        console.log(typeof controller)
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

    hasMiddleware = false;
    activeMiddleware;
    
    get = (url, middleware, controller) => this.app.get(...this._prepareParams(url, middleware, controller));
    post = (url, middleware, controller) => this.app.post(...this._prepareParams(url, middleware, controller));
    put = (url, middleware, controller) => this.app.put(...this._prepareParams(url, middleware, controller));
    delete = (url, middleware, controller) => this.app.delete(...this._prepareParams(url, middleware, controller));

    _prepareMiddleware(middlewareName) {
        return new (require(`${this.middlewarePath}/${middlewareName}`))(this.app).handle;
    }

    _prepareParams(url, middleware, controller) {
        if (middleware && !controller) {
            controller = middleware
            middleware = null;
        }
        var execution = [url];
        if (middleware) execution.push(this._prepareMiddleware(middleware))
        execution.push(this._prepareController(controller))
        return execution;
    }
  
}

module.exports = RouterConfig