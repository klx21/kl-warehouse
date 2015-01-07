/**
 * Created by huanli<klx211@gmail.com> on 12/29/14.
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
        .directive('kCardsBox', kCardsBox);

    kCardsBox.$inject = [
        'kCardsBoxEvents',
        'kCardsBoxDefaults',
        'kCardsBoxClassNames'
    ];

    function kCardsBox(kCBE, kCBD, kCBCN) {

        return {
            controller: 'KCardsBoxController',
            link: function (scope, element, attrs, controller) {

                checkScopeProperties(scope, element);

                scope.oCardStyles = {
                    height: scope.nCardHeight + 'px',
                    margin: (scope.nCardSpacing / 2) + 'px',
                    width: scope.nCardWidth + 'px'
                };

                registerEventListeners(scope, element);

                scope.$watch('aCards', function(newValue, oldValue) {

                    scope.$emit(kCBE.LOADING);

                }, true);
            },
            restrict: 'EA',
            scope: {
                aCards: '=cardsData',
                sCardTplUrl: '@cardTplUrl',
                sDlgTplUrl: '@dlgTplUrl',
                nColumnCount: '@columnCount',
                nRowHeight: '@rowHeight',
                nCardSpacing: '@cardSpacing',
                nCardRatio: '@cardRatio', // width / height ratio
                sDlgController: '@dlgController'
            },
            templateUrl: '../templates/ng-k-cards-box.tpl.html'
        };

        /**
         * Calculate the numbers regarding the cards layout.
         *
         * @author Kevin Li<huali@tibco-support.com>
         * @param {Object} scope The directive's scope object.
         * @param {jQuery} element An HTML element or an array of HTML elements wrapped by jQuery.
         */
        function checkScopeProperties(scope, element) {

            scope.nCardsBoxWidth = element.find('ul').width();
            scope.nColumnCount = parseInt(scope.nColumnCount, 10) || kCBD.COLUMN_COUNT;
            scope.nCardSpacing = parseFloat(scope.nCardSpacing, 10) || kCBD.CARD_SPACING;
            scope.nCardRatio = parseFloat(scope.nCardRatio, 10) || kCBD.CARD_RATIO;
            scope.nRowHeight = parseFloat(scope.nRowHeight, 10);
            scope.nCardWidth = scope.nCardsBoxWidth / scope.nColumnCount - scope.nCardSpacing;
            scope.nCardHeight = (scope.nRowHeight - scope.nCardSpacing) || (scope.nCardWidth / scope.nCardRatio);
        }

        function registerEventListeners(oScope, jqElement) {

            oScope.$on(kCBE.DATA_LOADING, function() {

                jqElement.find('.' + kCBCN.LOADING_MASK + ', .' + kCBCN.LOADING_ICON).show();
            });

            oScope.$on(kCBE.DATA_LOADED, function() {

                jqElement.find('.' + kCBCN.LOADING_MASK + ', .' + kCBCN.LOADING_ICON).hide();
            });
        }
    }

}());