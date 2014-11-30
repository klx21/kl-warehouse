/**
 * Created by huanli<klx211@gmail.com> on 11/17/14.
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

/**
 * Anything that emits events.
 *
 * @class
 */
var EventEmitter = (function () {
    /**
     * An array containing all instances of EventEmitter.
     *
     * @author Kevin Li<klx211@gmail.com>
     * @private
     * @type {Array}
     */
    var aInstances = [],
        /**
         * The constructor function of the EventEmitter.
         *
         * @author Kevin Li<klx211@gmail.com>
         * @private
         * @type {Function}
         */
        konstructor = function () {

            /**
             * An object containing all event/listeners pairs.
             *
             * @author Kevin Li<klx211@gmail.com>
             * @private
             * @type {Object}
             */
            var oRegistry = {},
                /**
                 * The number of maximum listeners for a specific event type.
                 * If the value is less than 0 it means no limit.
                 *
                 * @author Kevin Li<klx211@gmail.com>
                 * @private
                 * @type {Number}
                 */
                nLimits = -1,
                /**
                 * Add a listener for a specific event type.
                 *
                 * @author Kevin Li<klx211@gmail.com>
                 * @private
                 * @param {String} sEventType The event type for which a listener is to be added.
                 * @param {Function} fListener The listener that is added for a specific event type.
                 * @returns {EventEmitter} The instance of EventEmitter so that method calls can be chained.
                 */
                addListener = function (sEventType, fListener) {
                    if (nLimits !== 0 && typeof sEventType === 'string' && typeof fListener === 'function') {
                        if (typeof oRegistry[sEventType] === 'undefined') {
                            oRegistry[sEventType] = [];
                        }
                        if (nLimits < 0 || oRegistry[sEventType].length < nLimits) {
                            oRegistry[sEventType].push(fListener);
                        }
                    }
                    return this;
                },
                /**
                 * Tell whether the wrapper function is wrapping around the original function.
                 *
                 * @author Kevin Li<klx211@gmail.com>
                 * @private
                 * @param {Function} fListener The original function.
                 * @param {Function} fWrapped The wrapper function
                 * @returns {Boolean} True if the wrapper function is wrapping around the original function. False otherwise.
                 */
                isWrapped = function (fListener, fWrapped) {
                    var sListener = serialize(wrapForOnce(fListener)),
                        sWrapped = serialize(fWrapped);
                    return sListener === sWrapped;
                },
                /**
                 * Convert a JavaScript object to a string by making use of its toString() method. So as long as the object
                 * has a toString() method it can be converted to a string with all the spaces, tabs, carriage returns and
                 * line feeds removed.
                 *
                 * @author Kevin Li<klx211@gmail.com>
                 * @private
                 * @param {Array|Boolean|Function|Object|String} xTarget A JavaScript object.
                 * @returns {String} A string that is returned by the toString() method and that got all spaces, tabs, carriage
                 * returns and line feeds removed.
                 */
                serialize = function (xTarget) {
                    var ret = typeof xTarget !== 'undefined'
                        && typeof xTarget.toString === 'function'
                        && xTarget.toString();
                    if (ret) {
                        ret = ret.replace(/[\t\s\r\n]+/g, '');
                    }
                    return ret || '';
                },
                /**
                 * Wrap the original listener function for a specific event and return the wrapper function so that after
                 * this listener is invoked it'll be removed automatically.
                 *
                 * @author Kevin Li<klx211@gmail.com>
                 * @private
                 * @param {String} sEventType A specific event type.
                 * @param {Function} fListener The listener function which is to be wrapped.
                 * @returns {Function} The wrapper function.
                 */
                wrapForOnce = function (sEventType, fListener) {
                    return function () {
                        // DO NOT DELETE THESE COMMENTS
                        // ThisIsAOnceWrapper
                        fListener.apply(this, Array.prototype.slice.apply(arguments));
                        this.removeListener(sEventType, fListener);
                    }
                };

            $.extend(this, {
                    /**
                     * Add a listener for a specific event type.
                     *
                     * @author Kevin Li<klx211@gmail.com>
                     * @type {Function}
                     * @param {String} sEventType The event type for which a listener is to be added.
                     * @param {Function} fListener The listener that is added for a specific event type.
                     * @returns {EventEmitter} The instance of EventEmitter so that method calls can be chained.
                     */
                    addListener: addListener,
                    /**
                     * A shortcut for the method addListener.
                     *
                     * @type {Function}
                     */
                    on: addListener,
                    /**
                     * Add a listener which runs only once for a specific event type.
                     *
                     * @author Kevin Li<klx211@gmail.com>
                     * @param {String} sEventType The event type for which a listener that runs only once is to be added.
                     * @param {Function} fListener The listener that is added for a specific event type and will run only once.
                     * @returns {EventEmitter} The instance of EventEmitter so that method calls can be chained.
                     */
                    once: function (sEventType, fListener) {
                        if (nLimits !== 0 && typeof sEventType === 'string' && typeof fListener === 'function') {
                            if (typeof oRegistry[sEventType] === 'undefined') {
                                oRegistry[sEventType] = [];
                            }
                            if (nLimits < 0 || oRegistry[sEventType].length < nLimits) {
                                oRegistry[sEventType].push(wrapForOnce(sEventType, fListener));
                            }
                        }
                        return this;
                    },
                    /**
                     * Remove a listener for a specific event type.
                     *
                     * @author Kevin Li<klx211@gmail.com>
                     * @param {String} sEventType The event type for which a listener is to be removed.
                     * @param {Function} fListener The listener that is removed for a specific event type.
                     * @returns {EventEmitter} The instance of EventEmitter so that method calls can be chained.
                     */
                    removeListener: function (sEventType, fListener) {
                        if (typeof sEventType === 'string' && typeof fListener === 'function') {
                            if (typeof oRegistry[sEventType] !== 'undefined') {
                                var i,
                                    aListeners = oRegistry[sEventType];
                                for (i = 0; i < aListeners.length; i++) {
                                    if (aListeners[i] === fListener || isWrapped(fListener, aListeners[i])) {
                                        aListeners.splice(i, 1);
                                        break;
                                    }
                                }
                                if (aListeners.length === 0) {
                                    delete oRegistry[sEventType];
                                }
                            }
                        }
                        return this;
                    },
                    /**
                     * Remove all listeners for a specific event type. If the event type is not specified all listeners for
                     * all event type will be purged.
                     *
                     * @author Kevin Li<klx211@gmail.com>
                     * @param {String} sEventType The event type for which all listeners are to be removed. This parameter is
                     * optional. If it's omitted all listeners for all event types will be purged.
                     * @returns {EventEmitter} The instance of EventEmitter so that method calls can be chained.
                     */
                    removeAllListeners: function (sEventType) {
                        if (typeof sEventType === 'string') {
                            if (sEventType in oRegistry) {
                                delete oRegistry[sEventType];
                            }
                        } else if (typeof sEventType === 'undefined') {
                            oRegistry = {};
                        }
                        return this;
                    },
                    /**
                     * Set the maximum number of listeners that can be registered for one event.
                     *
                     * @author Kevin Li<klx211@gmail.com>
                     * @param {Number} nMaxListeners
                     * @returns {EventEmitter} The instance of EventEmitter so that method calls can be chained.
                     */
                    setMaxListeners: function (nMaxListeners) {
                        // TODO: cut out extra listeners, only keep newer ones
                        if (typeof nMaxListeners === 'number') {
                            nLimits = nMaxListeners;
                        }
                        return this;
                    },
                    /**
                     * Get the number of listeners for a specific event type. If the event type is not specified, the returned
                     * value will be 0.
                     *
                     * @author Kevin Li<klx211@gmail.com>
                     * @param {String} sEventType The event type for which a listener is to be counted.
                     * @returns {Number} The number of listeners for the specified event type. If the event type is missing,
                     * 0 will be returned.
                     */
                    listeners: function (sEventType) {
                        var ret = 0;
                        if (typeof sEventType === 'string') {
                            if (typeof oRegistry[sEventType] !== 'undefined') {
                                ret = oRegistry[sEventType].length;
                            }
                        }
                        return ret;
                    },
                    /**
                     * Emit an event for a specific event type.
                     *
                     * @author Kevin Li<klx211@gmail.com>
                     * @param {String} sEventType The event type for which a listener is to be removed.
                     * @param {...} args Any number of arguments to be passed to the listeners.
                     * @returns {EventEmitter} The instance of EventEmitter so that method calls can be chained.
                     */
                    emit: function (sEventType) {
                        if (typeof sEventType === 'string' && typeof oRegistry[sEventType] !== 'undefined') {
                            var args = Array.prototype.slice.call(arguments, 1),
                                i,
                                aListeners = oRegistry[sEventType];
                            for (i = 0; i < aListeners.length; i++) {
                                aListeners[i].apply(this, args);
                            }
                        }
                        return this;
                    }
                }
            );
        };

    return {
        /**
         * Tell whether the object is an instance of EventEmitter.
         *
         * @author Kevin Li<klx211@gmail.com>
         * @static
         * @param {Object} oInstance An object to test whether it's an instance of EventEmitter or not.
         * @returns {Boolean} True if the object is an instance of EventEmitter. False otherwise.
         */
        isInstanceOf: function (oInstance) {
            return aInstances.some(function (oItem) {
                return oItem === oInstance;
            });
        },
        /**
         * Get the number of listeners for a specific event type. If the event type is not specified, the returned
         * value will be 0.
         *
         * @author Kevin Li<klx211@gmail.com>
         * @static
         * @param {EventEmitter} oEventEmitter An instance of EventEmitter.
         * @param {String} sEventType The event type for which a listener is to be counted.
         * @returns {Number} The number of listeners for the specified event type. If the event type is missing,
         * 0 will be returned.
         */
        listenerCount: function (oEventEmitter, sEventType) {
            var ret = 0;
            if (this.isEventEmitter(oEventEmitter) && typeof sEventType === 'string') {
                ret = oEventEmitter.listeners(sEventType);
            }
            return ret;
        },
        /**
         * Create and return a new instance of EventEmitter. This instance will be remembered so that we can tell whether
         * a given object is an instance of EventEmitter or not easily.
         *
         * @author Kevin Li<klx211@gmail.com>
         * @static
         * @returns {EventEmitter} An instance of EventEmitter.
         */
        newInstance: function () {
            var instance = new konstructor();
            aInstances.push(instance);
            return instance;
        }
    };
}());

if(module) {
    module.exports = EventEmitter;
} else if(exports) {
    exports = EventEmitter;
}
