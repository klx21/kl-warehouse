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

    if (typeof jQuery === 'undefined') {

        throw 'k-draggable: jQuery must be present in order for the k-draggable directive to work correctly.';
    }
    /**
     * All the event subjects that will be emitted during the process of dragging.
     *
     * @author Kevin Li<klx211@gmail.com>
     * @type {Object}
     */
    var kDraggableEvents = {
            DRAG_START: 'kDraggableDragStart',
            DRAG_END: 'kDraggableDragEnd'
        },
        /**
         * All the class name constants.
         *
         * @author Kevin Li<klx211@gmail.com>
         * @type {Object}
         */
        kDraggableClassNames = {
            DRAGGABLE: 'k-draggable',
            DRAGGING: 'k-dragging',
            HANDLE: 'k-handle'
        },
        kDraggableAttributeNames = {
            DRAGGABLE: 'k-draggable',
            WITH_ALT: 'with-alt'
        };

    angular
        .module('kl.draggable', [])
        .constant('kDraggableEvents', kDraggableEvents)
        .constant('kDraggableClassNames', kDraggableClassNames)
        .constant('kDraggableAttributeNames', kDraggableAttributeNames)
        .service('kDraggableService', kDraggableService)
        .directive('kDraggable', kDraggable);

    kDraggableService.$inject = [
        'kDraggableAttributeNames',
        '$compile'
    ];

    kDraggable.$inject = [
        'kDraggableEvents',
        'kDraggableClassNames',
        'kDraggableAttributeNames',
        '$document'
    ];

    function kDraggableService(kDAN, $compile) {

        /**
         * Make an HTML element draggable based on the configuration provided.
         *
         * @author Kevin Li<klx211@gmail.com>
         * @param {Object} oConfig A configuration object to make an HTML element draggable.
         * {
         *     xDraggable: {string|jQuery|Node}, Required. The jQuery selector of the target draggable HTML element, or
         *                                      a jQuery wrapper object of the target draggable HTML element, or the
         *                                      target draggable HTML element itself.
         *     sDragHandle: {string}, Optional. The jQuery selector for the handle HTML element. If this is omitted, the
         *                                      draggable element itself will be used as the handle.
         *     bWithAlt: {boolean} Optional. True if the Alt key should be held down during dragging. False if it should
         *                                      not.
         *     bCopy: {boolean} Optional. True if a copy of the draggable element should be created when dragging. False
         *                                      if no copy should be created.
         * }
         * @throws Will throw an error if the configuration object is absent.
         * @throws Will throw an error if the target draggable element's selector or itself is absent in the
         * configuration object.
         * @throws Will throw an error if the target draggable element selector or the jQuery object did not match any
         * element or matched more than one elements.
         */
        this.makeDraggable = function (oConfig) {

            if (!angular.isObject(oConfig)) {

                throw 'k-draggable: The configuration object must be provided.';

            } else if (!angular.isString(oConfig.xDraggable) &&
                !(oConfig.xDraggable instanceof jQuery) &&
                oConfig.xDraggable.nodeType !== Node.ELEMENT_NODE) {
                // It's not a string,
                // it's not a jQuery object,
                // it's not a regular HTML element.

                throw 'k-draggable: The selector for selecting the target draggable HTML element, or a jQuery ' +
                'wrapper object of the target draggable HTML element, or the target draggable HTML element itself ' +
                'must be provided.';

            } else {

                var ngDraggable = angular.element(oConfig.xDraggable),
                    sDragHandle = angular.isString(oConfig.sDragHandle) && oConfig.sDragHandle.length > 0 ?
                        oConfig.sDragHandle : '';

                if (ngDraggable.length !== 1) {

                    throw 'k-draggable: No draggable element or more than one draggable elements were found.';

                } else {

                    ngDraggable.attr(kDAN.DRAGGABLE, sDragHandle);

                    if (oConfig.bWithAlt === true) {

                        ngDraggable.attr(kDAN.WITH_ALT, '');
                    }
                    $compile(ngDraggable)(ngDraggable.scope());
                }
            }
        };
    }

    function kDraggable(kDE, kDCN, kDAN, $document) {

        return {
            link: function (scope, element, attrs) {

                scope.bWithAlt = !angular.isUndefined(attrs.withAlt);

                element.addClass(kDCN.DRAGGABLE);

                var sDragHandle = attrs.kDraggable,
                    ngHandleElement;

                if (angular.isString(sDragHandle) && sDragHandle.length > 0) {

                    ngHandleElement = element.find(sDragHandle);

                    if (ngHandleElement.length > 0) {

                        if (!scope.bWithAlt) {

                            ngHandleElement.addClass(kDCN.HANDLE);
                        }
                    } else {

                        throw 'k-draggable: The selector `' + sDragHandle +
                        '` does not match any HTML element who is a descendant of ' +
                        element;
                    }
                } else {

                    if (!scope.bWithAlt) {

                        element.addClass(kDCN.HANDLE);
                    }
                }
                registerListeners(kDCN, kDAN, scope, element, ngHandleElement);
            },
            restrict: 'AC'
        };

        /**
         * Register all the necessary listeners for dragging an HTML element.
         *
         * @author Kevin Li<klx211@gmail.com>
         * @param {Object} kDCN An object containing class names.
         * @param {Object} kDAN An object containing attributes names.
         * @param {Object} oScope The directive's scope object.
         * @param {jQuery} ngDE The HTML element which is wrapped by jQuery and is to be dragged.
         * @param {jQuery} ngHE The HTML element which is wrapped by jQuery and is the handle for dragging.
         */
        function registerListeners(kDCN, kDAN, oScope, ngDE, ngHE) {

            ngHE = ngHE || ngDE;

            if (oScope.bWithAlt) {

                $document
                    .on('keydown', onKeyDown)
                    .on('keyup', onKeyUp);
            }
            ngHE.on('mousedown', onMouseDown);

            oScope.disableDraggable = disableDraggable;

            /**
             * Disable the dragging functionality of the draggable element. Remove relevant listeners, classes and
             * variables on the scope.
             *
             * @author Kevin Li<klx211@gmail.com>
             */
            function disableDraggable() {

                ngHE.off('mousedown', onMouseDown);

                if (oScope.bWithAlt) {

                    $document
                        .off('keydown', onKeyDown)
                        .off('keyup', onKeyUp);
                }

                ngDE
                    .removeAttr(kDAN.DRAGGABLE)
                    .removeAttr(kDAN.WITH_ALT)
                    .removeClass(kDCN.DRAGGABLE);

                delete oScope.disableDraggable;
                delete oScope.bWithAlt;
            }

            function onKeyDown(oEvent) {

                if (oEvent.keyCode === 18) {
                    // The Alt key
                    ngHE.addClass(kDCN.HANDLE);
                }
            }

            function onKeyUp(oEvent) {

                if (oEvent.keyCode === 18) {
                    // The Alt key
                    ngHE.removeClass(kDCN.HANDLE);
                }
            }

            /**
             * The event handler of the mousedown event.
             *
             * @author Kevin Li<klx211@gmail.com>
             * @param {Object} oEvent The jQuery's event object.
             */
            function onMouseDown(oEvent) {

                if (oEvent.target === this ||
                    ngHE === ngDE &&
                    ngDE.find(oEvent.target).length > 0) {
                    // The HTML element on which the mousedown event is triggered must be the handle element itself,
                    // instead of any children of the handle element.
                    // If the handle element is just the draggable element itself, the HTML element on which the
                    // mousedown event is triggered must be a descendant of the draggable element.

                    if (oScope.bWithAlt && oEvent.altKey || !oScope.bWithAlt) {
                        // The Alt key must be held down in order to start dragging,
                        // and the Alt key is indeed held down,
                        // or the Alt key is not required to start dragging.

                        oEvent.stopPropagation();
                        oEvent.preventDefault();
                        /**
                         * The value of left property of the HTML element to be dragged when the mouse button is held
                         * down.
                         *
                         * @author Kevin Li<klx211@gmail.com>
                         * @type {number}
                         */
                        var nElementLeft = ngDE.position().left,
                            /**
                             * The value of top property of the HTML element to be dragged when the mouse button is held
                             * down.
                             *
                             * @author Kevin Li<klx211@gmail.com>
                             * @type {number}
                             */
                            nElementTop = ngDE.position().top,
                            /**
                             * The X position of the mouse cursor when the mouse button is held down.
                             *
                             * @author Kevin Li<klx211@gmail.com>
                             * @type {number}
                             */
                            nMouseX = oEvent.pageX,
                            /**
                             * The Y position of the mouse cursor when the mouse button is held down.
                             *
                             * @author Kevin Li<klx211@gmail.com>
                             * @type {number}
                             */
                            nMouseY = oEvent.pageY,
                            /**
                             * A counter to tell whether it's the first time to move the mouse after the mouse button is
                             * held down.
                             *
                             * @author Kevin Li<klx211@gmail.com>
                             * @type {number}
                             */
                            nCounter = 0,
                            /**
                             * The event handler of the mousemove event.
                             *
                             * @author Kevin Li<klx211@gmail.com>
                             * @param {Object} oEvent The jQuery's event object.
                             */
                            onMousemove = function (oEvent) {

                                if (nCounter === 0) {

                                    // This is the first move of the mouse after the mouse button is held down.
                                    nCounter += 1;
                                    oScope.$emit(kDE.DRAG_START);
                                }

                                ngDE.css({
                                    left: nElementLeft + (oEvent.pageX - nMouseX),
                                    top: nElementTop + (oEvent.pageY - nMouseY)
                                });
                            },
                            /**
                             * The event handler of the mouseup event.
                             *
                             * @author Kevin Li<klx211@gmail.com>
                             */
                            onMouseUp = function () {

                                $document
                                    .off('mousemove', onMousemove)
                                    .off('mouseup', onMouseUp);

                                // Remove the box shadows so that it looks like the HTML element has just been put down.
                                ngDE.removeClass(kDCN.DRAGGING);

                                // Reset the counter when the mouse button is released.
                                nCounter = 0;

                                oScope.$emit(kDE.DRAG_END);
                            },
                            onAltKeyUp = function (oEvent) {

                                oEvent.preventDefault();
                                oEvent.stopPropagation();

                                if (oEvent.keyCode === 18) {
                                    // The Alt key
                                    $document
                                        .trigger(jQuery.Event('mouseup'))
                                        .off('keyup', onAltKeyUp);
                                }
                            };

                        if (oScope.bWithAlt) {
                            // The Alt key must be held down in order to start dragging,
                            $document.on('keyup', onAltKeyUp);
                        }
                        // Add box shadows so that it looks like the HTML element has just been lifted up.
                        ngDE.addClass(kDCN.DRAGGING);

                        $document
                            .on('mousemove', onMousemove)
                            .on('mouseup', onMouseUp);
                    }
                }
            }
        }
    }

}());