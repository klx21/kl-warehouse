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
        .factory('kCardsBoxService', kCardsBoxService);

    kCardsBoxService.$inject = [
        'kCardsBoxDefaults'
    ];

    function kCardsBoxService(kCBD) {

        var oScope = null,
            nDblClickTimeout = kCBD.DOUBLE_CLICK_TIMEOUT;

        return {
            setScope: setScope,
            setCards: setCards,
            setCardTplUrl: setCardTplUrl,
            setDlgTplUrl: setDlgTplUrl,
            appendCard: appendCard,
            appendCards: appendCards,
            prependCard: prependCard,
            prependCards: prependCards,
            insertCard: insertCard,
            insertCards: insertCards,
            removeCard: removeCard,
            removeCards: removeCards,
            removeAllCards: removeAllCards,
            changeCard: changeCard,
            setDblClickTimeout: setDblClickTimeout,
            getDblClickTimeout: getDblClickTimeout
        };

        /**
         * Set the scope object of the "cardsBox" directive. This method can be called only once with an argument that
         * is neither undefined nor null. Successive invocation will raise an error. For this only one time this method
         * is called by the post link function of the "cardsBox" directive.
         *
         * @author Kevin Li<huali@tibco-support.com>
         * @param {Object} scope The scope object. If this argument is undefined or null the method will do nothing.
         * @throws Will throw an error if this method is called more than once with an argument that is neither
         * undefined nor null.
         */
        function setScope(scope) {

            if(!angular.isUndefined(scope) && scope !== null) {

                if (oScope === null) {

                    oScope = scope;

                } else {

                    throw 'The scope object has already been set for the kCardsBoxService.';
                }
            }
        }

        function setCards(aCards) {

            oScope.$apply(function () {

                oScope.aCards = aCards;
            });
        }

        function setCardTplUrl(sCardTplUrl) {

            if(angular.isString(sCardTplUrl)) {

                oScope.sCardTplUrl = sCardTplUrl;
            }
        }

        function setDlgTplUrl(sDlgTplUrl) {

            if(angular.isString(sDlgTplUrl)) {

                oScope.sDlgTplUrl = sDlgTplUrl;
            }
        }

        function appendCard(oCard) {

            if(!angular.isUndefined(oCard)) {

                oScope.aCards.push(oCard);
            }
        }

        function appendCards(aCards) {

            if(angular.isArray(aCards)) {

                Array.prototype.push.apply(oScope.aCards, aCards);
            }
        }

        function prependCard(oCard) {

            if(!angular.isUndefined(oCard)) {

                oScope.aCards.unshift(oCard);
            }
        }

        function prependCards(aCards) {

            if(angular.isArray(aCards)) {

                Array.prototype.unshift.apply(oScope.aCards, aCards);
            }
        }

        function insertCard(oCard, nIndex) {

            if(!angular.isUndefined(oCard)) {

                if(!angular.isNumber(nIndex) || nIndex >= oScope.aCards.length) {

                    appendCard(oCard);

                } else if(nIndex === 0) {

                    prependCard(oCard);

                } else if(nIndex < 0) {

                    insertCard(oCard, oScope.aCards.length + nIndex);

                } else {

                    oScope.aCards.splice(nIndex, 0, oCard);
                }
            }
        }

        function insertCards(aCards, nStartIndex) {

            if(angular.isArray(aCards)) {

                if(!angular.isNumber(nStartIndex) || nStartIndex >= oScope.aCards.length) {

                    appendCards(aCards);

                } else if(nStartIndex === 0) {

                    prependCards(aCards);

                } else if(nStartIndex < 0) {

                    insertCard(aCards, oScope.aCards.length + nStartIndex);

                } else {

                    Array.prototype.splice.apply(oScope.aCards, aCards.unshift(nStartIndex, 0));
                }
            }
        }

        function removeCard(nIndex) {

            if(angular.isNumber(nIndex)) {

                if(nIndex >=0 && nIndex < oScope.aCards.length) {

                    oScope.aCards.splice(nIndex, 1);

                } else if(nIndex < 0) {

                    removeCard(oScope.aCards.length + nIndex);
                }
            }
        }

        function removeCards(aIndexes) {

            aIndexes.forEach(function(nIndex) {

                removeCard(nIndex);
            });
        }

        function removeAllCards() {

            oScope.aCards = [];
        }

        function changeCard(oCard, nIndex) {

            if(!angular.isUndefined(oCard) && angular.isNumber(nIndex)) {

                if(nIndex >= 0 && nIndex < oScope.aCards.length) {

                    oScope.aCards[nIndex] = oCard;

                } else if(nIndex < 0) {

                    changeCard(oCard, oScope.aCards.length + nIndex);
                }
            }
        }

        function setDblClickTimeout(nTimeout) {

            if(angular.isNumber(nTimeout) && nTimeout > 0) {

                nDblClickTimeout = nTimeout;
            }
        }

        function getDblClickTimeout() {

            return nDblClickTimeout;
        }
    }

}());