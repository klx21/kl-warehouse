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
        .factory('cardsBoxService', cardsBoxService);

    function cardsBoxService() {

        var oScope = null;

        return {
            setScope: setScope,
            setCards: setCards,
            setCardTplUrl: setCardTplUrl,
            setDlgTplUrl: setDlgTplUrl,
            appendCard: appendCard,
            prependCard: prependCard,
            insertCard: insertCard,
            removeCard: removeCard,
            removeAllCard: removeAllCards,
            changeCard: changeCard
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

                    throw 'The scope object has already been set for the cardsBoxService.';
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

        function prependCard(oCard) {

            if(!angular.isUndefined(oCard)) {

                oScope.aCards.unshift(oCard);
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

        function removeCard(nIndex) {

            if(angular.isNumber(nIndex)) {

                if(nIndex >=0 && nIndex < oScope.aCards.length) {

                    oScope.aCards.splice(nIndex, 1);

                } else if(nIndex < 0) {

                    removeCard(oScope.aCards.length + nIndex);
                }
            }
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
    }

}());