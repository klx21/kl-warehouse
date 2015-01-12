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
        .service('kCardsBoxService', kCardsBoxService);

    kCardsBoxService.$inject = [
        'kCardsBoxClassNames'
    ];

    function kCardsBoxService(kCBCN) {

        var oRegistry = {};

        this.getInstance = function(dsElement) {

            var oInstance,
                ngElement;

            if (angular.isString(dsElement) || angular.isObject(dsElement)) {

                ngElement = angular.element(dsElement);

                if (ngElement.length === 1) {

                    if (ngElement[0].nodeName.toLowerCase() === 'k-cards-box' ||
                        !angular.isUndefined(ngElement.attr('k-cards-box'))) {

                        if (oRegistry[ngElement]) {

                            oInstance = oRegistry[ngElement];
                        } else {
                            oInstance = {};
                            oInstance.ngElement = ngElement;
                            oInstance.oScope = ngElement.find('.' + kCBCN.CARDS_BOX).scope();
                            decorateInstance(oInstance, oInstance.oScope);
                            oRegistry[ngElement] = oInstance;
                        }
                    } else {

                        throw 'The element ' + ngElement +
                        ' is not the HTML element to which the k-cards-box directive is applied.';
                    }
                } else {

                    throw 'Only one element is expected but got ' + ngElement.length + ' elements.';
                }
            } else {

                throw 'The only argument is expected to be a string or an HTML element.';
            }
            return oInstance;
        };

        function decorateInstance(oInstance) {

            angular.extend(oInstance, {
                appendCard: appendCard,
                appendCards: appendCards,
                destroy: destroy,
                insertCard: insertCard,
                insertCards: insertCards,
                prependCard: prependCard,
                prependCards: prependCards,
                removeCard: removeCard,
                removeCards: removeCards,
                removeAllCards: removeAllCards,
                replaceCard: replaceCard,
                setCards: setCards,
                setCardTplUrl: setCardTplUrl,
                setDlgTplUrl: setDlgTplUrl
            });

            function appendCard(oCard) {

                if (!angular.isUndefined(oCard)) {

                    this.oScope.aCards.push(oCard);
                }
            }

            function appendCards(aCards) {

                if (angular.isArray(aCards)) {

                    Array.prototype.push.apply(this.oScope.aCards, aCards);
                }
            }

            function destroy() {

                var that = this;

                angular.forEach(oRegistry, function (oInstance, jqKey) {

                    if (angular.equals(that, oInstance)) {

                        oInstance.ngElement.remove();
                        delete oRegistry[jqKey];
                    }
                });
            }

            function insertCard(oCard, nIndex) {

                if (!angular.isUndefined(oCard)) {

                    if (!angular.isNumber(nIndex) || nIndex >= this.oScope.aCards.length) {

                        appendCard(oCard);

                    } else if (nIndex === 0) {

                        prependCard(oCard);

                    } else if (nIndex < 0) {

                        insertCard(oCard, this.oScope.aCards.length + nIndex);

                    } else {

                        this.oScope.aCards.splice(nIndex, 0, oCard);
                    }
                }
            }

            function insertCards(aCards, nStartIndex) {

                if (angular.isArray(aCards)) {

                    if (!angular.isNumber(nStartIndex) || nStartIndex >= this.oScope.aCards.length) {

                        appendCards(aCards);

                    } else if (nStartIndex === 0) {

                        prependCards(aCards);

                    } else if (nStartIndex < 0) {

                        insertCard(aCards, this.oScope.aCards.length + nStartIndex);

                    } else {

                        Array.prototype.splice.apply(this.oScope.aCards, aCards.unshift(nStartIndex, 0));
                    }
                }
            }

            function prependCard(oCard) {

                if (!angular.isUndefined(oCard)) {

                    this.oScope.aCards.unshift(oCard);
                }
            }

            function prependCards(aCards) {

                if (angular.isArray(aCards)) {

                    Array.prototype.unshift.apply(this.oScope.aCards, aCards);
                }
            }

            function removeCard(nIndex) {

                if (angular.isNumber(nIndex)) {

                    if (nIndex >= 0 && nIndex < this.oScope.aCards.length) {

                        this.oScope.aCards.splice(nIndex, 1);

                    } else if (nIndex < 0) {

                        removeCard(this.oScope.aCards.length + nIndex);
                    }
                }
            }

            function removeCards(aIndexes) {

                aIndexes.forEach(function (nIndex) {

                    removeCard(nIndex);
                });
            }

            function removeAllCards() {

                this.oScope.aCards = [];
            }

            function replaceCard(oCard, nIndex) {

                if (!angular.isUndefined(oCard) && angular.isNumber(nIndex)) {

                    if (nIndex >= 0 && nIndex < this.oScope.aCards.length) {

                        this.oScope.aCards[nIndex] = oCard;

                    } else if (nIndex < 0) {

                        replaceCard(oCard, this.oScope.aCards.length + nIndex);
                    }
                }
            }

            function setCards(aCards) {

                this.oScope.$apply(function () {

                    this.oScope.aCards = aCards;
                });
            }

            function setCardTplUrl(sCardTplUrl) {

                if (angular.isString(sCardTplUrl)) {

                    this.oScope.sCardTplUrl = sCardTplUrl;
                }
            }

            function setDlgTplUrl(sDlgTplUrl) {

                if (angular.isString(sDlgTplUrl)) {

                    this.oScope.sDlgTplUrl = sDlgTplUrl;
                }
            }
        }
    }

}());