/**
 * Created by huanli<klx211@gmail.com> on 1/6/15.
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

    /**
     * All the event subjects that will be emitted during the process of dragging.
     *
     * @author Kevin Li<huali@tibco-support.com>
     * @type {Object}
     */
    var kDraggableEvents = {
            DRAG_START: 'kDraggableDragStart',
            DRAG_END: 'kDraggableDragEnd'
        },
        /**
         * All the class name constants.
         *
         * @author Kevin Li<huali@tibco-support.com>
         * @type {Object}
         */
        kClassNames = {
            DRAGGABLE: 'k-draggable',
            DRAGGING: 'k-dragging',
            HANDLE: 'k-handle'
        };

    angular
        .module('kl.draggable', [])
        .constant('kDraggableEvents', kDraggableEvents)
        .constant('kClassNames', kClassNames)
        .directive('kDraggable', kDraggable);

    kDraggable.$inject = [
        'kDraggableEvents',
        'kClassNames',
        '$document'
    ];

    /**
     * Facotry function of the directive.
     *
     * @author Kevin Li<huali@tibco-support.com>
     * @param {Object} kDE An object containing all the event subjects that will be emitted during the process of
     * dragging.
     * @param {Object} kCN An object containing all the class name constants.
     * @param {jQuery} $document A jQuery wrapper for the browser's window.document object.
     * @returns {Object} The directive's definition object.
     */
    function kDraggable(kDE, kCN, $document) {

        return {
            link: function (scope, element, attrs) {

                attrs.$addClass(kCN.DRAGGABLE);

                var sSelector = attrs.kDraggable,
                    jqHandleElement;

                if (angular.isString(sSelector) && sSelector.length > 0) {

                    jqHandleElement = element.find(sSelector);
                    jqHandleElement.addClass(kCN.HANDLE);

                } else {

                    attrs.$addClass(kCN.HANDLE);
                }

                registerListeners(scope, element, jqHandleElement);
            },
            restrict: 'A',
            scope: {}
        };

        /**
         * Register all the necessary listeners for dragging an element.
         *
         * @author Kevin Li<huali@tibco-support.com>
         * @param {Object} oScope The directive's scope object.
         * @param {jQuery} jqDraggableElement The HTML element which is wrapped by jQuery and is to be dragged.
         * @param {jQuery} jqHE The HTML element which is wrapped by jQuery and is the handle for dragging.
         */
        function registerListeners(oScope, jqDraggableElement, jqHE) {

            jqHE = jqHE || jqDraggableElement;

            jqHE.on('mousedown', onMousedown);

            function onMousedown(oEvent) {

                /**
                 * The value of left property of the HTML element to be dragged when the mouse button is held down.
                 *
                 * @author Kevin Li<huali@tibco-support.com>
                 * @type {number}
                 */
                var nElementLeft = jqDraggableElement.position().left,
                    /**
                     * The value of top property of the HTML element to be dragged when the mouse button is held down.
                     *
                     * @author Kevin Li<huali@tibco-support.com>
                     * @type {number}
                     */
                    nElementTop = jqDraggableElement.position().top,
                    /**
                     * The X position of the mouse cursor when the mouse button is held down.
                     *
                     * @author Kevin Li<huali@tibco-support.com>
                     * @type {number}
                     */
                    nMouseX = oEvent.pageX,
                    /**
                     * The Y position of the mouse cursor when the mouse button is held down.
                     *
                     * @author Kevin Li<huali@tibco-support.com>
                     * @type {number}
                     */
                    nMouseY = oEvent.pageY,
                    /**
                     * A counter to tell whether it's the first time to move the mouse after the mouse button is held
                     * down.
                     *
                     * @author Kevin Li<huali@tibco-support.com>
                     * @type {number}
                     */
                    nCounter = 0;

                // Add box shadows so that it looks like the HTML element has just been lifted up.
                jqDraggableElement.addClass(kCN.DRAGGING);

                $document.on('mousemove', onMousemove);
                $document.on('mouseup', onMouseup);

                function onMousemove(oEvent) {

                    if (nCounter === 0) {

                        // This is the first move of the mouse after the mouse button is held down.
                        nCounter += 1;
                        oScope.$emit(kDE.DRAG_START);
                    }

                    jqDraggableElement.css({
                        left: nElementLeft + (oEvent.pageX - nMouseX),
                        top: nElementTop + (oEvent.pageY - nMouseY)
                    });
                }

                function onMouseup() {

                    $document.off('mousemove', onMousemove);
                    $document.off('mouseup', onMouseup);

                    // Remove the box shadows so that it looks like the HTML element has just been put down.
                    jqDraggableElement.removeClass(kCN.DRAGGING);

                    nCounter = 0; // Reset the counter when the mouse button is released.
                    oScope.$emit(kDE.DRAG_END);
                }
            }
        }
    }

}());