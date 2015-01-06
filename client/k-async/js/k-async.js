/**
 * @author Huan LI
 */

/**
 * Asynchronous result class for which the result is not returned immediately and instead, will be fully resolved at a
 * later time.
 *
 * @author Huan LI
 */
com.huanli.lang.OO.defineClass({
    qName: 'com.huanli.async.KAsync',
    equipper: function(STATIC, proto) {
        'use strict';
        /**
         * This asynchronous result is not done yet.
         *
         * @author Huan LI
         */
        STATIC.STATE_PENDING = 'pending';
        /**
         * This asynchronous result is in the state "done", which means it's fully resolved.
         *
         * @author Huan LI
         */
        STATIC.STATE_DONE = 'done';
        /**
         * This asynchronous result is in the state "error", which means it's done but error occurred.
         *
         * @author Huan LI
         */
        STATIC.STATE_ERROR = 'error';
        /**
         * If the callback function has been called
         *
         * @author Huan Li
         */
        proto._calledBack = false;
        /**
         * If the errorback function, which is the callback function for failures, has been called
         *
         * @author Huan Li
         */
        proto._erroredBack = false;

        /**
         * An empty function.
         *
         * @author Huan LI
         */
        var EMPTY_FUNCTION = function() {
            var message = 'This is an empty function. Please make sure it is used on purpose. Otherwise please replace it with a custom function.';
            if (console) {
                console.warn(message);
            } else {
                alert(message);
            }
        };

        /**
         * Wrap a function which will do something asynchronously into a new function which will return an asynchronous
         * result.
         *
         * The fct function will be called on the objScope object and with the arguments passed into the new function
         * when the new function gets called.
         *
         * @author Huan LI
         * @param {Function} fct The function that will do something asynchronously.
         * @param {Object} objScope The object on which the fct will be called. This is optional.
         * @returns {Function} A function that will return an asynchronous result.
         */
        STATIC.asynchronize = function(fct, objScope) {
            objScope = objScope || window;
            var retFct = function() {
                var ar = new STATIC(), arrAsyncArgs = Array.prototype.concat.apply([], arguments);
                fct.call(objScope, {
                    arrAsyncArgs: arrAsyncArgs,
                    done: function() {
                        ar.done.apply(ar, arguments);
                    },
                    fail: function() {
                        ar.fail.apply(ar, arguments);
                    }
                });
                return ar;
            };
            return retFct;
        };

        /**
         * Change the state of this asynchronous result to "done", cache the anyArg for future use and run the callback
         * function if it's present and has never been called.
         *
         * @author Huan LI
         * @private
         * @param {*} anyArg Any type of variable to be passed into the callback function.
         */
        proto._done = function(anyArg) {
            this._setDone();
            this._anyArg = anyArg;
            if (this.callback && !this.hasCalledBack()) {
                this._runCallback();
            }
        };

        /**
         * Change the state of this asynchronous result to "error", cache the anyArg for future use and run the errorback
         * function if it's present and has never been called.
         *
         * @author Huan LI
         * @private
         * @param {*} error Any type of variable that can describe the error that's occurred and will be passed into the
         * errorback function.
         */
        proto._fail = function(error) {
            this._setError();
            this._error = error;
            if (this.errorback && !this.hasErroredBack()) {
                this._runErrorback();
            }
        };

        /**
         * Run the callback function and remember this invocation so that it will not be called again in the future.
         *
         * @author Huan LI
         * @private
         */
        proto._runCallback = function() {
            this._setCalledBack();
            this.callback(this._anyArg);
        };

        /**
         * Run the errorback function and remember this invocation so that it will not be called again in the future.
         *
         * @author Huan LI
         * @private
         */
        proto._runErrorback = function() {
            this._setErroredBack();
            this.errorback(this._error);
        };

        /**
         * Mark the callback function of this asynchronous result as invoked so it won't be called again.
         *
         * @author Huan LI
         * @private
         */
        proto._setCalledBack = function() {
            this._calledBack = true;
        };

        /**
         * Set this asynchronous result's state to "done" if it's in "pending" state.
         *
         * @author Huan LI
         * @private
         */
        proto._setDone = function() {
            if (this.isPending()) {
                this._state = STATIC.STATE_DONE;
            }
        };

        /**
         * Set this asynchronous result's state to "error" if it's in "pending" state.
         *
         * @author Huan LI
         * @private
         */
        proto._setError = function() {
            if (this.isPending()) {
                this._state = STATIC.STATE_ERROR;
            }
        };

        /**
         * Mark the errorback function of this asynchronous result as invoked so it won't be called again.
         *
         * @author Huan LI
         * @private
         */
        proto._setErroredBack = function() {
            this._erroredBack = true;
        };

        /**
         * Set this asynchronous result's state to "pending" if it doesn't yet have any state.
         *
         * @author Huan LI
         * @private
         */
        proto._setPending = function() {
            if ( typeof this._state === 'undefined') {
                this._state = STATIC.STATE_PENDING;
            }
        };

        /**
         * Only when this asynchronous result and the new one "ar"( or the one created from "ar" when "ar" is a function)
         * are both done will the callback be called with an array, which contains the argument of this asynchronous
         * result's done method and that of the new asynchronous result's, as the only argument.
         *
         * If an error occurred the first one that was thrown will be passed to the errorback of this asynchronous
         * result, if any, and the errorback will then be called.
         *
         * @author Huan LI
         * @param {KAsync|Function} ar An asynchronous result instance or a function that will be wrapped in an
         * asynchronous result.
         * @param {Array} arrAsyncArgs An array containing all arguments that's to be passed into the function which is
         * wrapped in an asynchronous result. This is optional.
         * @param {Object} objScope The object on which the function, which is wrapped in an asynchronous result, will be
         * called. This is optional.
         * @returns {KAsync} A new asynchronous result.
         */
        proto.and = function(ar, arrAsyncArgs, objScope) {
            var _ar, _this = this, _arDone, _arFail;
            if ( typeof arrAsyncArgs !== 'undefined') {/* if there're at least two arguments */
                if (!( arrAsyncArgs instanceof Array)) {
                    /*
                     * if the "arrAsyncArgs" is not an array, it's considered the "objScope" and the "arrAsyncArgs" will
                     * be
                     * assigned an empty array
                     */
                    objScope = arrAsyncArgs;
                    arrAsyncArgs = [];
                }
            } else {/* if there's only one argument the "arrAsyncArgs" will be an empty array */
                arrAsyncArgs = [];
            }

            if ( ar instanceof STATIC) {// _ar is an instance of com.huanli.async.KAsync
                _ar = ar;
            } else if ( typeof ar === 'function') {/* _ar is a function that's to be made asynchronous */
                _ar = STATIC.asynchronize(ar, objScope)(arrAsyncArgs);
            } else {/* _ar is neither an instance of com.huanli.async.KAsync nor a function that\'s to be made
                 * asynchronous */
                throw 'The first argument for the method "and" can only be either an instance of com.huanli.async.KAsync or a function that\'s to be made asynchronous';
            }
            /* cache the original "done" and "fail" method of the new asynchronous result "_ar" */
            _arDone = _ar.done;
            _arFail = _ar.fail;
            /* Refactor the "done" method of the new asynchronous result "_ar" */
            _ar.done = function(anyArg) {
                _this.when(function(arg) {
                    _arDone.call(_ar, [].concat(arg, anyArg));
                }, function(e) {
                    _arFail.call(_ar, e);
                });
            };
            /* Refactor the "fail" method of the new asynchronous result "_ar" */
            _ar.fail = function(error) {
                if (_this.isError()) {// this asynchronous result has already finished executing and is in state "error"
                    _arFail.call(_ar, _this._error);
                } else {
                    /*
                     * As long as this asynchronous result is not in "error" state, the error from the new asynchronous
                     * result
                     * "_ar" should be reported
                     */
                    _arFail.call(_ar, error);
                }
            };
            return _ar;
        };

        /**
         * Called when the function which runs asynchronously returns successfully.
         *
         * @author Huan LI
         * @param {*} anyArg Any type of argument that's to be passed into the callback function.
         */
        proto.done = function(anyArg) {
            if (this.isPending()) {
                if ( anyArg instanceof STATIC) {
                    var _this = this;
                    anyArg.then(function(oa) {
                        _this._done(oa);
                    });
                } else {
                    this._done(anyArg);
                }
            }
        };

        /**
         * Called when the function which runs asynchronously returns unsuccessfully.
         *
         * @author Huan LI
         * @param {*} error Any type of argument that's to be passed into the callback function and can describe the
         * error.
         */
        proto.fail = function(error) {
            if (this.isPending()) {
                if ( error instanceof STATIC) {
                    var _this = this;
                    error.then(EMPTY_FUNCTION, function(e) {
                        _this._fail(e);
                    });
                } else {
                    this._fail(error);
                }
            }
        };

        /**
         * Tell if the callback function has been called.
         *
         * @author Huan LI
         * @returns {Boolean} True if the callback function has been called, false otherwise.
         */
        proto.hasCalledBack = function() {
            return this._calledBack;
        };

        /**
         * Tell if the errorback function has been called.
         *
         * @author Huan LI
         * @returns {Boolean} True if the errorback function has been called, false otherwise.
         */
        proto.hasErroredBack = function() {
            return this._erroredBack;
        };

        /**
         * Tell if this asynchronous result is in "pending" state.
         *
         * @author Huan LI
         * @returns {Boolean} True if this asynchronous result is in "pending" state, false otherwise.
         */
        proto.isPending = function() {
            return this._state === STATIC.STATE_PENDING;
        };

        /**
         * Tell if this asynchronous result is in "done" state.
         *
         * @author Huan LI
         * @returns {Boolean} True if this asynchronous result is in "done" state, false otherwise.
         */
        proto.isDone = function() {
            return this._state === STATIC.STATE_DONE;
        };

        /**
         * Tell if this asynchronous result is in "error" state.
         *
         * @author Huan LI
         * @returns {Boolean} True if this asynchronous result is in "error" state, false otherwise.
         */
        proto.isError = function() {
            return this._state === STATIC.STATE_ERROR;
        };

        /**
         * When either this asynchronous result or the new one "ar"( or the one created from "ar" when "ar" is a
         * function) is done will the callback be called with the argument of the done method of the "done" asynchronous
         * result as the only argument.
         *
         * If the asynchronous result which "done" first but returned an error, the error will be thrown. Other errors
         * will be ignored.
         *
         * @author Huan LI
         * @param {KAsync|Function} ar An asynchronous result instance or a function that will be wrapped in an
         * asynchronous result.
         * @param {Array} arrAsyncArgs An array containing all arguments that's to be passed into the function which is
         * wrapped in an asynchronous result. This is optional.
         * @param {Object} objScope The object on which the function, which is wrapped in an asynchronous result, will be
         * called.
         * @returns {KAsync} An asynchronous result instance. This is optional.
         */
        proto.or = function(ar, arrAsyncArgs, objScope) {
            var _ar;
            if ( typeof arrAsyncArgs !== 'undefined') {/* if there're at least two arguments */
                if (!( arrAsyncArgs instanceof Array)) {
                    /* if the "arrAsyncArgs" is not an array, it's considered the "objScope" and the "arrAsyncArgs" will
                     * be
                     * assigned an empty array */
                    objScope = arrAsyncArgs;
                    arrAsyncArgs = [];
                }
            } else {/* if there's only one argument the "arrAsyncArgs" will be an empty array */
                arrAsyncArgs = [];
            }
            
            if ( ar instanceof STATIC) {/* _ar is an instance of com.huanli.async.KAsync */
                _ar = ar;
            } else if ( typeof ar === 'function') {/* _ar is a function that's to be made asynchronous */
                _ar = STATIC.asynchronize(ar, objScope)(arrAsyncArgs);
            } else {/* _ar is neither an instance of com.huanli.async.KAsync nor a function that\'s to be made
                 * asynchronous */
                throw 'The first argument for the method "and" can only be either an instance of com.huanli.async.KAsync or a function that\'s to be made asynchronous';
            }
            this.when(function(anyArg) {
                _ar._done(anyArg);
            }, function(error) {
                _ar._fail(error);
            });
            return _ar;
        };

        /**
         * Register a callback function fctCallback and a errorback function fctErrorback for this asynchronous result so
         * that the callback function will be called when the state is moved to "done" and the errorback function will be
         * called when the state is moved to "error".
         *
         * This method also returns a new Asynchronous result instance so that the it's possible to make a chain. The
         * return value of the callback function of this asynchronous result will be passed into the callback function of
         * the new asynchronous result instance. Likewise, the return value of the errorback function of this
         * asynchronous result will be passed into the errorback function of the new asynchronous result instance, or the
         * error will be passed on directly if this asynchronous result doesn't have a errorback function registered.
         *
         * @author Huan LI
         * @param {Function} fctCallback The callback function which will be called when this asynchronous result is
         * done.
         * @param {Function} fctErrorback The errorback function which will be called when this asynchronous result is
         * failed. This is optional.
         * @param {Object} objScope The object on which the callback and the errorback function will be called. This is
         * optional.
         * @returns {KAsync} An asynchronous result instance.
         */
        proto.then = function(fctCallback, fctErrorback, objScope) {
            objScope = objScope || window;
            var ar = new STATIC(), _this = this;
            this.callback = function(anyArg) {
                ar.done(fctCallback.bind(objScope)(anyArg));
            };
            this.errorback = function(error) {
                if ( typeof fctErrorback === 'function') {
                    ar.fail(fctErrorback.bind(objScope)(error));
                } else {
                    ar.fail(error);
                }
            };
            if (this.isDone() && !this.hasCalledBack()) {
                _this._runCallback();
            } else if (this.isError() && !this.hasErroredBack()) {
                _this._runErrorback();
            }
            return ar;
        };

        /**
         * Register a callback function fctCallback and a errorback function fctErrorback for this asynchronous result so
         * that the callback function will be called when the state is moved to "done" and the errorback function will be
         * called when the state is moved to "error".
         *
         * @author Huan LI
         * @param {Function} fctCallback The callback function which will be called when this asynchronous result is
         * done.
         * @param {Function} fctErrorback The errorback function which will be called when this asynchronous result is
         * failed. This is optional.
         * @param {Object} objScope The object on which the callback and the errorback function will be called. This is
         * optional.
         */
        proto.when = function(fctCallback, fctErrorback, objScope) {
            objScope = objScope || window;
            this.callback = fctCallback.bind(objScope);
            if ( typeof fctErrorback === 'function') {
                this.errorback = fctErrorback.bind(objScope);
            } else {
                this.errorback = EMPTY_FUNCTION.bind(objScope);
            }
            if (this.isDone() && !this.hasCalledBack()) {
                this._runCallback();
            } else if (this.isError() && !this.hasErroredBack()) {
                this._runErrorback();
            }
        };

        /**
         * Get the value of the property with the name strPropName from the fully resolved value of the this asynchronous
         * result.
         *
         * @author Huan Li
         * @param {String} strPropName The name of the property of which the value is to be retrieved from the fully
         * resolved value, which is supposedly an object, of this asynchronous result.
         * @returns {KAsync} An asynchronous result that will be resolved at a later time and will return an object
         * containing a property with the name strPropName.
         */
        proto.get = function(strPropName) {
            return this.then(function(o) {
                return o[strPropName];
            });
        };

        /**
         * Call a method, which has the name strFctName and is of the fully resolved value of this asynchronous result,
         * with the anyArgs as the arguments.
         *
         * @author Huan Li
         * @param {String} strFctName The name of the method of the fully resolved value, which is supposedly an object,
         * of this asynchronous result.
         * @param {*} anyArgs Any number of arguments that will be passed to the function strFctName when it's finally
         * got called.
         * @returns {KAsync} An asynchronous result that will be resolved at a later time and will return an object
         * containing a method with the name strFctName.
         */
        proto.call = function(strFctName/* , arguments to be passed into the function named "strFctName" */) {
            return this.then(function(o) {
                return o[strFctName].apply(o, Array.prototype.slice.call(arguments, 1));
            });
        };
    },
    initializer: function() {'use strict';
        /**
         * Set the initial state of the asynchronous result instance to pending.
         *
         * @author Huan Li
         */
        this._setPending();
    }
});
