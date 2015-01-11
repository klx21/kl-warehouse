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
            link: function (scope, element) {

                checkScopeProperties(scope, element);

                scope.oCardStyles = {
                    height: scope.nCardHeight + 'px',
                    margin: (scope.nCardSpacing / 2) + 'px',
                    width: scope.nCardWidth + 'px'
                };

                registerEventListeners(scope, element);
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
                sDlgController: '@dlgController',
                sBottomReachedNotification: '@bottomReachedNotification'
            },
            templateUrl: '../templates/ng-k-cards-box.tpl.html'
        };

        /**
         * Calculate the numbers regarding the cards layout.
         *
         * @author Kevin Li<huali@tibco-support.com>
         * @param {Object} oScope The directive's scope object.
         * @param {jQuery} jqElement An HTML element or an array of HTML elements wrapped by jQuery.
         */
        function checkScopeProperties(oScope, jqElement) {

            oScope.nCardsBoxWidth = jqElement.find('.' + kCBCN.CARDS_LIST).width();
            oScope.nColumnCount = parseInt(oScope.nColumnCount, 10) || kCBD.COLUMN_COUNT;
            oScope.nCardSpacing = parseFloat(oScope.nCardSpacing, 10) || kCBD.CARD_SPACING;
            oScope.nCardRatio = parseFloat(oScope.nCardRatio, 10) || kCBD.CARD_RATIO;
            oScope.nRowHeight = parseFloat(oScope.nRowHeight, 10);
            oScope.nCardWidth = oScope.nCardsBoxWidth / oScope.nColumnCount - oScope.nCardSpacing;
            oScope.nCardHeight = (oScope.nRowHeight - oScope.nCardSpacing) || (oScope.nCardWidth / oScope.nCardRatio);
        }

        function registerEventListeners(oScope, jqElement) {

            listenOnDataLoading(oScope, jqElement);
            listenOnDataLoaded(oScope, jqElement);
            listenOnScroll(oScope, jqElement);
        }

        function listenOnDataLoading(oScope, jqElement) {

            oScope.$on(kCBE.CARDS_BOX_DATA_LOADING, function (oEvent) {

                jqElement.find([
                    '.' + kCBCN.CARDS_LIST + ' ~ .' + kCBCN.LOADING_MASK,
                    '.' + kCBCN.CARDS_LIST + ' ~ .' + kCBCN.LOADING_ICON
                ].join()).show();
            });
        }

        function listenOnDataLoaded(oScope, jqElement) {

            oScope.$on(kCBE.CARDS_BOX_DATA_LOADED, function (oEvent) {

                jqElement.find([
                    '.' + kCBCN.CARDS_LIST + ' ~ .' + kCBCN.LOADING_MASK,
                    '.' + kCBCN.CARDS_LIST + ' ~ .' + kCBCN.LOADING_ICON
                ].join()).hide();
            });
        }

        function listenOnScroll(oScope, jqElement) {

            if (angular.isUndefined(oScope.sBottomReachedNotification)) {

                if (jqElement.parent().is(angular.element('body'))) {

                    angular.element(window).on('scroll', scrollWithPage);
                } else {

                    jqElement.parent().on('scroll', scrollWithinParent);
                }
            } else if (oScope.sBottomReachedNotification.trim().toLowerCase() !== 'false') {

                if (jqElement.parent(oScope.sBottomReachedNotification).is(jqElement.parent())) {

                    jqElement.parent().on('scroll', scrollWithinParent);
                } else {

                    jqElement.parents(oScope.sBottomReachedNotification).on('scroll', scrollWithPage);
                }
            }

            function scrollWithinParent(oEvent) {

                var jqContent = jqElement.find('.' + kCBCN.CARDS_BOX),
                    nOffsetTop = jqContent.offset().top,
                    nTargetHeight = angular.element(oEvent.target).height(),
                    nContentHeight = jqContent.outerHeight(true);

                if (Math.abs(nOffsetTop) + nTargetHeight >= nContentHeight) {

                    oScope.$emit(kCBE.BOTTOM_REACHED);
                }
            }

            function scrollWithPage(oEvent) {

                var jqContent = jqElement.find('.' + kCBCN.CARDS_BOX),
                    nOffsetTop,
                    nTargetHeight,
                    nContentHeight;

                if(angular.element(document).is(oEvent.target)) {

                    nOffsetTop = angular.element(window).scrollTop();
                    nTargetHeight = angular.element(window).height();
                    nContentHeight = angular.element(document).outerHeight(true);
                } else {

                    nOffsetTop = jqContent.offset().top;
                    nTargetHeight = angular.element(oEvent.target).height();
                    nContentHeight = jqContent.outerHeight(true);
                }

                if (Math.abs(nOffsetTop) + nTargetHeight >= nContentHeight) {

                    oScope.$emit(kCBE.BOTTOM_REACHED);
                }
            }
        }
    }

}());