/**
 * Created by huanli<klx211@gmail.com> on 1/6/15.
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

(function () {

    'use strict';

    function toObject(x) {

        var ret;

        if (x === undefined) {

            throw new TypeError('undefined is not a valid object to be the target of the assignment.');

        } else if (x === null) {

            throw new TypeError('null is not a valid object to be the target of the assignment.');

        } else if (typeof x === 'boolean') {

            ret = Boolean(x);

        } else if (typeof x === 'number') {

            ret = Number(x);

        } else if (typeof x === 'string') {

            ret = String(x);

        } else if (typeof x === 'object') {

            ret = x;
        }
        return ret;
    }

    if (typeof Object.assign !== 'function') {

        Object.assign = function (oTarget) {

            oTarget = toObject(oTarget);

            var ret;

            if (arguments.length === 1) {

                ret = oTarget;

            } else {

                var aArgs = Array.prototype.slice.call(arguments, 1),
                    aPropNames,
                    oDescriptor;

                ret = aArgs.reduce(function (oT, oS) {

                    oS = toObject(oS);
                    aPropNames = Object.getOwnPropertyNames(oS);

                    aPropNames.forEach(function (sPropName) {

                        if (oS.propertyIsEnumerable(sPropName)) {

                            oDescriptor = Object.getOwnPropertyDescriptor(oS, sPropName);

                            if(oDescriptor !== undefined) {

                                Object.defineProperty(oT, sPropName, oDescriptor);
                            }
                        }
                    });
                    return oT;

                }, oTarget);
            }
            return ret;
        };
    }

}());