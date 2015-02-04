/**
 * Created by huanli<klx211@gmail.com> on 2/4/15.
 *
 * Variable prefixes' meanings:
 * -------------------------------------------------------------------------
 * --- The prefix of a variable's name reveals the type of data it holds ---
 * -------------------------------------------------------------------------
 *
 * a: Array
 * b: Boolean
 * d: DOM
 * f: Function
 * l: List(an array-like object)
 * n: Number
 * o: Object
 * r: Regular expression
 * s: String
 * x: More than one type
 *  : Special case or NOT my code
 *
 * *** These prefixes can be concatenated to indicate that the variable can
 *         hold the specified types of data ***
 */

var KAsync = (function () {
    'use strict';

    var aInstances = [],
        STATE_PENDING = 'pending',
        STATE_RESOLVED = 'resolved',
        STATE_REJECTED = 'rejected',
        factory = function () {

            var oInstance = {},
                oPromise = {},
                sState = STATE_PENDING,
                aRejectedCbs = [], // An array of all reject callback functions.
                aResolvedCbs = [], // An array of all resolve callback functions.
                aCompleteCbs = [], // An array of all complete callback functions.
                xArg; //The value with which the Promise object is resolved or the reason due to which the Promise object is rejected.

            // Augment the KAsync instance
            Object.assign(oInstance, {
                getState: getState,
                promise: promise,
                reject: reject,
                resolve: resolve
            });

            // Augment the Promise object
            Object.assign(oPromise, {
                complete: complete,
                done: done,
                fail: fail,
                then: then
            });

            return oInstance;

            //////////////////////////////////////////////////////////////////////////////
            ////////// start -- Public methods available on the deferred object //////////

            /**
             * Execute all callback functions in an array. This array is either the one of resolve callback function or
             * the one of reject callback functions. The array of complete callback functions is always executed in the
             * end regardless of resolved or rejected.
             *
             * @author Kevin Li<klx211@gmail.com>
             * @private
             * @param {Array} aCallbacks An array of callback functions.
             */
            function executeCbs(aCallbacks) {

                while (aCallbacks.length > 0) {

                    aCallbacks.shift().call(null, xArg);
                }

                while (aCompleteCbs.length > 0) {

                    aCompleteCbs.shift().call(null, xArg);
                }
            }

            /**
             * Fulfill the Promise object with the first argument as the value.
             *
             * @author Kevin Li<klx211@gmail.com>
             * @param {*} xValue The value with which the Promise object is resolved.
             */
            function fulfill(xValue) {

                sState = STATE_RESOLVED;
                xArg = xValue;

                executeCbs(aResolvedCbs);
            }

            /**
             * Get the current state of the deferred object.
             *
             * @author Kevin Li<klx211@gmail.com>
             * @returns {string} The state of the deferred object.
             */
            function getState() {

                return sState;
            }

            /**
             * Get the Promise object.
             *
             * @author Kevin Li<klx211@gmail.com>
             * @returns {Object} The Promise object.
             */
            function promise() {

                return oPromise;
            }

            /**
             * Reject the Promise object with the first argument as the reason.
             *
             * @author Kevin Li<klx211@gmail.com>
             * @param {*} xReason The reason due to which the Promise object is rejected.
             */
            function reject(xReason) {

                if (sState === STATE_PENDING) {

                    sState = STATE_REJECTED;
                    xArg = xReason;

                    executeCbs(aRejectedCbs);
                }
            }

            /**
             * Resolve the Promise object with the first argument as the value.
             *
             * @author Kevin Li<klx211@gmail.com>
             * @param {*} xValue The value with which the Promise object is resolved.
             */
            function resolve(xValue) {

                if (sState === STATE_PENDING) {

                    if (xValue === oPromise) {

                        reject(new TypeError('Cannot resolve a promise with itself.'));

                    } else if (KAsync.isPromise(xValue)) {

                        xValue.then(function (xV) {

                            resolve(xV);

                        }, function (xR) {

                            reject(xR);

                        }, function (x) {

                            complete(x);

                        });
                    } else if (typeof xValue === 'object' ||
                        typeof xValue === 'function') {

                        try {
                            var then = xValue.then,
                                bCalled = false;

                            if (typeof then === 'function') {

                                then.call(xValue, function (xV) {

                                    if (!bCalled) {

                                        bCalled = true;
                                        resolve(xV);
                                    }

                                }, function (xReason) {

                                    if (!bCalled) {

                                        bCalled = true;
                                        reject(xReason);
                                    }

                                }, function (x) {

                                    complete(x);

                                });
                            } else {

                                fulfill(xValue);
                            }
                        } catch (e) {

                            if (!bCalled) {

                                reject(e);
                            }
                        }
                    } else {

                        fulfill(xValue);
                    }
                }
            }

            ////////// end //////////
            /////////////////////////

            /////////////////////////////////////////////////////////////////////////////
            ////////// start -- Public methods available on the promise object //////////

            /**
             * Register callback functions which will be invoked when the Promise object is either resolved or rejected.
             *
             * @author Kevin Li<klx211@gmail.com>
             * @param {Function} fComplete The callback function.
             * @returns {Object} The Promise object for method chaining.
             */
            function complete(fComplete) {

                return then(null, null, fComplete);
            }

            /**
             * Register callback functions which will be invoked only when the Promise object is resolved.
             *
             * @author Kevin Li<klx211@gmail.com>
             * @param {Function} fResolved The callback function.
             * @returns {Object} The Promise object for method chaining.
             */
            function done(fResolved) {

                return then(fResolved, null, null);
            }

            /**
             * Register callback functions which will be invoked only when the Promise object is rejected.
             *
             * @author Kevin Li<klx211@gmail.com>
             * @param {Function} fRejected The callback function.
             * @returns {Object} The Promise object for method chaining.
             */
            function fail(fRejected) {

                return then(null, fRejected, null);
            }

            /**
             * Register callback functions which will be invoked when the Promise object is resolved or rejected.
             *
             * @author Kevin Li<klx211@gmail.com>
             * @param {Function} fResolved The callback function which will be invoked only when the Promise object is
             * resolved.
             * @param {Function} fRejected The callback function which will be invoked only when the Promise object is
             * rejected.
             * @param {Function} fComplete The callback function which will be invoked when the Promise object is either
             * resolved or rejected. But this callback function will be called after the ones which will be invoked only
             * when the Promise object is resolved or the ones which will be invoked only when the Promise object is
             * rejected.
             * @returns {Object} The Promise object for method chaining.
             */
            function then(fResolved, fRejected, fComplete) {

                if (typeof fResolved === 'function') {

                    aResolvedCbs.push(fResolved);
                }

                if (typeof fRejected === 'function') {

                    aRejectedCbs.push(fRejected);
                }

                if (typeof fComplete === 'function') {

                    aCompleteCbs.push(fComplete);
                }

                if (sState === STATE_RESOLVED) {

                    executeCbs(aResolvedCbs);

                } else if (sState === STATE_REJECTED) {

                    executeCbs(aRejectedCbs);
                }
                return oPromise;
            }

            ////////// end //////////
            /////////////////////////
        };

    return {
        STATE_PENDING: STATE_PENDING,
        STATE_RESOLVED: STATE_RESOLVED,
        STATE_REJECTED: STATE_REJECTED,
        isDeferred: isInstanceOf,
        isPromise: isPromise,
        defer: newInstance,
        resolve: resolve
    };

    /**
     * Tell whether the given object is an instance of the ClassName.
     *
     * @author Kevin Li<klx211@gmail.com>
     * @param {Object} oInstance The object to be checked for whether it's an instance of the ClassName.
     * @returns {Boolean} True if the object is an instance of the ClassName. False otherwise.
     */
    function isInstanceOf(oInstance) {

        return aInstances.indexOf(oInstance) > -1;
    }

    /**
     * Check whether an object is a Promise object or not.
     *
     * @author Kevin Li<klx211@gmail.com>
     * @param {Object} oPromise An object to be checked.
     * @returns {boolean} True if the only argument is a Promise object. False otherwise.
     */
    function isPromise(oPromise) {

        var ret = false;

        aInstances.forEach(function (oDeferred) {

            if (oDeferred.promise() === oPromise) {

                ret = true;
            }
        });

        return ret;
    }

    /**
     * A factory function to create a new instance of the ClassName. Any number of arguments can be passed in.
     *
     * @author Kevin Li<klx211@gmail.com>
     * @param {...} args Any number of arguments can be passed in.
     */
    function newInstance() {

        var instance = factory.apply(null, Array.prototype.slice.call(arguments, 0));

        return aInstances[aInstances.length] = instance;
    }

    /**
     * Resolve the Promise object passed in as the first argument with the second argument.
     *
     * @author Kevin Li<klx211@gmail.com>
     * @param {Object} oPromise A Promise object.
     * @param {*} xValue A value with which the Promise object is resolved.
     */
    function resolve(oPromise, xValue) {

        oPromise.resolve(xValue);
    }

}());
