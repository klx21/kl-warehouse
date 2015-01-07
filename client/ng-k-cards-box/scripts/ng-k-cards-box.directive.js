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
        .directive('cardsBox', cardsBox);

    cardsBox.$inject = [
        'kCardsBoxEvents',
        'kCardsBoxDefaults'
    ];

    function cardsBox(kCardsBoxEvents, kCardsBoxDefaults) {

        return {
            controller: 'CardsBoxController',
            link: function (scope, element, attrs, controller) {

                checkScopeProperties(scope, element, kCardsBoxDefaults);

                scope.oCardStyles = {
                    height: scope.nCardHeight + 'px',
                    margin: (scope.nCardSpacing / 2) + 'px',
                    width: scope.nCardWidth + 'px'
                };

                scope.$watch('aCards', function(newValue, oldValue) {

                    scope.$emit(kCardsBoxEvents.LOADING);

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
                oDlgController: '@dlgController'
            },
            templateUrl: '../templates/ng-k-cards-box.tpl.html'
        };

        /**
         * Calculate the numbers regarding the cards layout.
         *
         * @author Kevin Li<huali@tibco-support.com>
         * @param {Object} scope The directive's scope object.
         * @param {jQuery} element An HTML element or an array of HTML elements wrapped by jQuery.
         * @param {Object} kCardsBoxDefaults An object containing constant values.
         */
        function checkScopeProperties(scope, element, kCardsBoxDefaults) {

            if (!angular.isNumber(scope.nColumnCount)) {
                scope.nColumnCount = kCardsBoxDefaults.COLUMN_COUNT;
            }
            if (!angular.isNumber(scope.nCardSpacing)) {
                scope.nCardSpacing = kCardsBoxDefaults.CARD_SPACING;
            }
            if (!angular.isNumber(scope.nCardRatio)) {
                scope.nCardRatio = kCardsBoxDefaults.CARD_RATIO;
            }
            if (angular.isNumber(scope.nRowHeight)) {
                scope.nCardHeight = scope.nRowHeight - scope.nCardSpacing;
            }
            scope.nCardsBoxWidth = element.find('ul').width();
            scope.nCardWidth = scope.nCardsBoxWidth / scope.nColumnCount - scope.nCardSpacing;
            scope.nCardHeight = scope.nCardHeight || (scope.nCardWidth / scope.nCardRatio);
        }
    }

}());