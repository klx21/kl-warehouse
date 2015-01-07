/**
 * Created by huanli<klx211@gmail.com> on 1/4/15.
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

    angular
        .module('kl.cardsBox')
        .directive('kCard', kCard);

    kCard.$inject = [
        'kCardsBoxService',
        '$timeout'
    ];

    function kCard(kCBS, $timeout) {

        return {
            link: function (scope, element, attrs, controller) {

                var oTimeoutPromise = null,
                    nTimeout = kCBS.getDblClickTimeout();

                // Listen on both single click and double click events.
                element.on('click', function (oEvent) {

                    oEvent.preventDefault();

                    if (oTimeoutPromise === null) {
                        // single click

                        /**
                         * Schedule an invocation of a function after a specified timeout in milliseconds.
                         * If another click event is fired before this times out, it's a double click.
                         * The scheduled invocation will be canceled. Otherwise, it's a single click.
                         * The scheduled invocation will be carried out.
                         * In both cases, the oTimeoutPromise will be cleared at the end.
                         */
                        oTimeoutPromise = $timeout(function () {

                            oTimeoutPromise = null;
                            clickListener.call(element, oEvent);

                        }, nTimeout);

                    } else {
                        // double click

                        if($timeout.cancel(oTimeoutPromise)) {

                            oTimeoutPromise = null;
                            dblclickListener.call(element, oEvent);
                        }
                    }
                });

                function clickListener(oEvent) {

                    alert('clicked');
                }

                function dblclickListener(oEvent) {

                    alert('double clicked');
                }
            },
            require: '^^kCardsBox',
            restrict: 'A',
            scope: {
                oData: '=cardData'
            },
            templateUrl: '../templates/ng-k-card.tpl.html'
        };
    }

}());