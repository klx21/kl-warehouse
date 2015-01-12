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
        'kCardsBoxService'
    ];

    function kCard(kCBE, kCBCN, kCBS) {

        return {
            link: function (scope, element, attrs, controller) {

                registerEventListeners(scope, element);
            },
            require: '^^kCardsBox',
            restrict: 'A',
            scope: {
                oCard: '=cardData',
                sCardTplUrl: '@cardTplUrl',
                sDlgTplUrl: '@dlgTplUrl'
            },
            templateUrl: '../templates/ng-k-card.tpl.html'
        };

        function registerEventListeners(oScope, jqElement) {

            listenOnDataLoading(oScope, jqElement);
            listenOnDataLoaded(oScope, jqElement);
        }

        function listenOnDataLoading(oScope, jqElement) {

            oScope.$on(kCBE.CARD_DATA_LOADING, function () {

                jqElement.find([
                    '.' + kCBCN.CARD_CONTAINER + ' ~ .' + kCBCN.LOADING_MASK,
                    '.' + kCBCN.CARD_CONTAINER + ' ~ .' + kCBCN.LOADING_ICON
                ].join()).show();
            });
        }

        function listenOnDataLoaded(oScope, jqElement) {

            oScope.$on(kCBE.CARD_DATA_LOADED, function () {

                jqElement.find([
                    '.' + kCBCN.CARD_CONTAINER + ' ~ .' + kCBCN.LOADING_MASK,
                    '.' + kCBCN.CARD_CONTAINER + ' ~ .' + kCBCN.LOADING_ICON
                ].join()).hide();
            });
        }
    }

}());