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
        'kCardsBoxEvents',
        'kCardsBoxClassNames',
        'kDialogService'
    ];

    function kCard(kCBE, kCBCN, kDS) {

        return {
            link: function (scope, element, attrs, controller) {

                if(angular.isString(scope.sCardClasses)) {

                    element.addClass(scope.sCardClasses);
                }
                prepareBtnClicks(scope, element, controller);
                registerEventListeners(scope, element);
            },
            require: '^^kCardsBox',
            restrict: 'A',
            scope: {
                oCard: '=cardData',
                sCardClasses: '@cardClasses',
                sCardTplUrl: '@cardTplUrl',
                sDlgTplUrl: '@dlgTplUrl',
                openDialog: '&openDialog'
            },
            templateUrl: '../templates/ng-k-card.tpl.html'
        };

        function prepareBtnClicks(oScope, ngElement, oController) {

            angular.extend(oScope, {
            });
        }

        function registerEventListeners(oScope, ngElement) {

            listenOnDataLoading(oScope, ngElement);
            listenOnDataLoaded(oScope, ngElement);
        }

        function listenOnDataLoading(oScope, ngElement) {

            oScope.$on(kCBE.CARD_DATA_LOADING, function () {

                ngElement.find([
                    '.' + kCBCN.CARD_CONTAINER + ' ~ .' + kCBCN.LOADING_MASK,
                    '.' + kCBCN.CARD_CONTAINER + ' ~ .' + kCBCN.LOADING_ICON
                ].join()).show();
            });
        }

        function listenOnDataLoaded(oScope, ngElement) {

            oScope.$on(kCBE.CARD_DATA_LOADED, function () {

                ngElement.find([
                    '.' + kCBCN.CARD_CONTAINER + ' ~ .' + kCBCN.LOADING_MASK,
                    '.' + kCBCN.CARD_CONTAINER + ' ~ .' + kCBCN.LOADING_ICON
                ].join()).hide();
            });
        }
    }

}());