/**
 * Created by huanli<klx211@gmail.com> on 11/25/14.
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

var ClassName = (function() {
    'use strict';

    ///////////////////////////////////////////////////////
    // Here goes the private static members of the class //
    ///////////////////////////////////////////////////////

    var aInstances,
        /**
         * The constructor function.
         *
         * @constructor
         */
        Konstructor = function() {

        /////////////////////////////////////////////////
        // Here goes the private members of the class. //
        /////////////////////////////////////////////////

            $.extend(this, /* Other instances */ {
                ////////////////////////////////////////////////
                // Here goes the public members of the class. //
                ////////////////////////////////////////////////
            }
        );
    };

    return {
        ///////////////////////////////////////////////////////
        // Here goes the public static members of the class. //
        ///////////////////////////////////////////////////////
        /**
         * Tell whether the given object is an instance of the ClassName.
         *
         * @author Kevin Li<klx211@gmail.com>
         * @param {Object} oInstance The object to be checked for whether it's an instance of the ClassName.
         * @returns {Boolean} True if the object is an instance of the ClassName. False otherwise.
         */
        isInstanceOf: function(oInstance) {},
        /**
         * A factory function to create a new instance of the ClassName. Any number of arguments can be passed in.
         *
         * @param {...} args Any number of arguments can be passed in.
         */
        newInstance: function () {
            var instance = new Konstructor();
            aInstances.push(instance);
            return instance;
        }
    };

}());
