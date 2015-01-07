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
        .directive('card', card);

    card.$inject = [
        'kCardsBoxEvents',
        '$modal'
    ];

    function card(kCardsBoxEvents, $modal) {

        return {
            link: function (scope, element, attrs, controller) {

                var oModalInstance,
                    oConf = {
                        backdrop: 'static',
                        scope: scope,
                        size: 'lg',
                        templateUrl: scope.$parent.$parent.sDlgTplUrl
                    };

                if(!angular.isUndefined(scope.$parent.$parent.oDlgController)) {
                    oConf.controller = scope.$parent.$parent.oDlgController;
                    oConf.controllerAs = 'dc';
                }

                element.on('click', function (oEvent) {

                    oModalInstance = $modal.open(oConf);

                    scope.$emit(kCardsBoxEvents.DIALOG_OPEN, scope);
                });
            },
            require: '^^cardsBox',
            restrict: 'A',
            scope: {
                oData: '=cardData'
            },
            templateUrl: '../templates/ng-k-card.tpl.html'
        };
    }

}());