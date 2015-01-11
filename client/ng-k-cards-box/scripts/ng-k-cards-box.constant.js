/**
 * Created by huanli<klx211@gmail.com> on 1/5/15.
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

    var kCardsBoxEvents = {
            BOTTOM_REACHED: 'kCardsBoxBottomReached',
            CARDS_BOX_DATA_LOADED: 'kCardsBoxDataLoaded',
            CARDS_BOX_DATA_LOADING: 'kCardsBoxDataLoading',
            CARD_DATA_LOADED: 'kCardDataLoaded',
            CARD_DATA_LOADING: 'kCardDataLoading'
        },
        kCardsBoxDefaults = {
            COLUMN_COUNT: 3,
            CARD_SPACING: 30,
            CARD_RATIO: 3, // width / height ratio
            DOUBLE_CLICK_TIMEOUT: 200
        },
        kCardsBoxClassNames = {
            CARDS_BOX: 'k-cards-box',
            CARDS_LIST: 'k-cards-list',
            CARD: 'k-card',
            FOOTER_BAR: 'k-footer-bar',
            HEADER_BAR: 'k-header-bar',
            LOADING_MASK: 'loading-mask',
            LOADING_ICON: 'loading-icon'
        };

    angular
        .module('kl.cardsBox')
        .constant('kCardsBoxEvents', kCardsBoxEvents)
        .constant('kCardsBoxDefaults', kCardsBoxDefaults)
        .constant('kCardsBoxClassNames', kCardsBoxClassNames);

}());