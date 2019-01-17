"use strict";
/* eslint-disable new-cap */
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const _ = require("lodash");
const jayson = require("jayson");
const api_1 = require("./api");
/* istanbul ignore next */
function createHTTPServer(options, httpPort) {
    const sunnycoinAPI = new api_1.SunnycoinAPI(options);
    const methodNames = _.filter(_.keys(api_1.SunnycoinAPI.prototype), k => {
        return typeof api_1.SunnycoinAPI.prototype[k] === 'function'
            && k !== 'connect'
            && k !== 'disconnect'
            && k !== 'constructor'
            && k !== 'SunnycoinAPI';
    });
    function applyPromiseWithCallback(fnName, callback, args_) {
        try {
            let args = args_;
            if (!_.isArray(args_)) {
                const fnParameters = jayson.Utils.getParameterNames(sunnycoinAPI[fnName]);
                args = fnParameters.map(name => args_[name]);
                const defaultArgs = _.omit(args_, fnParameters);
                assert(_.size(defaultArgs) <= 1, 'Function must have no more than one default argument');
                if (_.size(defaultArgs) > 0) {
                    args.push(defaultArgs[_.keys(defaultArgs)[0]]);
                }
            }
            Promise.resolve(sunnycoinAPI[fnName](...args))
                .then(res => callback(null, res))
                .catch(err => {
                callback({ code: 99, message: err.message, data: { name: err.name } });
            });
        }
        catch (err) {
            callback({ code: 99, message: err.message, data: { name: err.name } });
        }
    }
    const methods = {};
    _.forEach(methodNames, fn => {
        methods[fn] = jayson.Method((args, cb) => {
            applyPromiseWithCallback(fn, cb, args);
        }, { collect: true });
    });
    const server = jayson.server(methods);
    let httpServer = null;
    return {
        server: server,
        start: function () {
            if (httpServer !== null) {
                return Promise.reject('Already started');
            }
            return new Promise(resolve => {
                sunnycoinAPI.connect().then(() => {
                    httpServer = server.http();
                    httpServer.listen(httpPort, resolve);
                });
            });
        },
        stop: function () {
            if (httpServer === null) {
                return Promise.reject('Not started');
            }
            return new Promise(resolve => {
                sunnycoinAPI.disconnect();
                httpServer.close(() => {
                    httpServer = null;
                    resolve();
                });
            });
        }
    };
}
exports.createHTTPServer = createHTTPServer;
//# sourceMappingURL=http.js.map