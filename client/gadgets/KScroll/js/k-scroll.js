/**
 * Created by huanli<klx211@gmail.com> on 11/27/14.
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

'use strict';

var KScroll = (function () {

    /**
     * An array containing all instances of KScroll.
     *
     * @type {Array}
     */
    var aInstances = [],
        /**
         * Initialize the scroll bars with the parameters provided in the oConfig.
         *
         * @author Huan Li
         * @param {Object} oConfig An object containing arguments to initialize scroll bars. The details of this
         * parameter is like the following:
         *
         * <pre>
         * {
         *     wrappee: {String|Object}, // Required. The wrapped element. If the &quot;wrappee&quot; property in the
         * &quot;oConfig&quot; argument is a string, it will be treated as the id of the element which is to be
         * wrapped.
         *
         *     nHowToMove: {Number}, // Optional. The number indicating different CSS properties that are changed when
         * moving elements. Either com.huanli.ui.KScroll.MOVE_BY_POSITION which means by using the &quot;left&quot; and
         * &quot;top&quot; properties or com.huanli.ui.KScroll.MOVE_BY_TRANSFORM which means by using the
         * &quot;transform&quot; property. The default value is the latter.
         *
         *     nMaxHeight: {Number}, // Optional. The maximum height to which the wrapper element can be resized if
         * specified. Otherwise, a default maximum height is used instead.
         *
         *     nMaxWidth: {Number}, // Optional. The maximum width to which the wrapper element can be resized if
         * specified. Otherwise, a default maximum width is used instead.
         *
         *     nMinHeight: {Number}, // Optional. The minimum height to which the wrapper element can be resized if
         * specified. Otherwise, a default minimum height is used instead.
         *
         *     nMinWidth: {Number}, // Optional. The minimum width to which the wrapper element can be resized if
         * specified. Otherwise, a default minimum width is used instead.
         *
         *     nWrapperHeight: {Number}, // Optional. The height of the wrapper element if specified. Otherwise, the
         * height of the wrapper element will be the same as the height of the wrapped element before it's wrapped.
         *
         *     nWrapperWidth: {Number}, // Optional. The width of the wrapper element if specified. Otherwise, the
         * width of the wrapper element will be the same as the width of the wrapped element before it's wrapped.
         *
         *     bAutoHide: {Boolean}, // Optional. True if the scroll bars are shown when the mouse cursor moves into the
         * wrapper element and hidden when the mouse cursor moves out of the wrapper element. False if the scroll bars
         * are shown constantly. The default value is true.
         *
         *     bDraggable: {Boolean}, // Optional. True if the wrapped element can be dragged. False otherwise. The
         * default value is false.
         *
         *     bFlipXY: {Boolean}, // Optional. True if the directions of the scrolling action of the mouse wheel flips
         * which means that when you roll the wheel down the wrapped element will scroll to the right and when you roll
         * the wheel up the wrapped element will scroll down. False otherwise. False otherwise. The default value is
         * false.
         *
         *     bGlideable: {Boolean}, // Optional. True if the wrapped element will glide for a mount of distance after a
         * drag-and-release action. False otherwise. The default value is true.
         *
         *     bHorizontalBarVisible: {Boolean}, // Optional. True if the horizontal scroll bar will be shown when
         * needed. False if the horizontal scroll bar will never be shown. The default value is true.
         *
         *     bHorizontalScrollable: {Boolean}, // Optional. True if the horizontal scroll is enabled. False otherwise.
         * The default value is true.
         *
         *     bPageMode: {Boolean}, // Optional. True if the scrolling would be carried out page by page. False if the
         * scrolling is continuous. The default value is false.
         *
         *     bResizeable: {Boolean}, // Optional. True if the wrapper element can be resized. False otherwise. The
         * default value is false. The default value is false.
         *
         *     bResizeKnobVisible: {Boolean}, // Optional. True if the resize knob is visible. False otherwise. The
         * default value is false.
         *
         *     bScrollableByArrowKeys: {Boolean}, // Optional. True if the arrow keys can control the scroll of the
         * wrapped element. False otherwise. The default value is true.
         *
         *     bScrollableByMouseWheel: {Boolean}, // Optional. True if the user can scroll with the mouse wheel. False
         * otherwise. The default value is true.
         *
         *     bSmooth// {Boolean}, // Optional. True if the &quot;transition&quot; property of CSS is used to make the
         * scrolling smooth. False otherwise. The default value is false.
         *
         *     bVerticalBarVisible: {Boolean}, // Optional. True if the vertical scroll bar will be shown when needed.
         * False if the vertical scroll bar will never be shown. The default value is true.
         *
         *     bVerticalScrollable: {Boolean}, // Optional. True if the vertical scroll is enabled. False otherwise. The
         * default value is true.
         *
         *     sScrollBarColor: {String}, // Optional. The color of the scroll bars. If it's omitted the default color
         * will be used.
         *
         *     oEventHandlers: {Object}, // Optional. A key-value pair object containing the event handler functions.
         * The currently available events that can be subscribed include the following:
         *         1. &quot;scrolled&quot;, fired when the wrapped element is just moved for an amount of distance.
         *         2. &quot;endReached&quot;, fired when one of the four ends of the wrapped element is reached.
         *         3. &quot;bottomEndReached&quot;, fired when the bottom end of the wrapped element is reached.
         *         4. &quot;leftEndReached&quot;, fired when the left end of the wrapped element is reached.
         *         5. &quot;rightEndReached&quot;, fired when the right end of the wrapped element is reached.
         *         6. &quot;topEndReached&quot;, fired when the top end of the wrapped element is reached.
         *     The key in this object should be the subject of the events which are listed above and the value should be
         * a function accepting an key-value pair object as the only argument.
         *
         *     sScrollBarColor: {String} // Optional. The color that's going to be used for the scroll bars. The
         * default value is &quot;#2ED6AB&quot;.
         * }
         * </pre>
         */
        konstructor = function (oConfig) {
            if (typeof oConfig === 'undefined' || typeof oConfig.wrappee === 'undefined') {
                throw 'The "wrappee", which is the wrapped element, MUST be provided!';
            }
            var _this = this,
                /**
                 * The CSS classes used.
                 */
                cssClasses = {
                    cursorMove: 'cursor-move',
                    cursorSeResize: 'cursor-se-resize',
                    noUserSelect: 'no-user-select',
                    transition: 'transition'
                },
                /**
                 * The id of the horizontal bar.
                 */
                sHBarIdPrefix = 'h_bar',
                /**
                 * The id of the horizontal scroll bar.
                 */
                sHScrollBarIdPrefix = 'h_scroll_bar',
                /**
                 * The id of the resize knob.
                 */
                sResizeKnobIdPrefix = 'resize_knob',
                /**
                 * The id of the vertical bar.
                 */
                sVBarIdPrefix = 'v_bar',
                /**
                 * The id of the vertical scroll bar.
                 */
                sVScrollBarIdPrefix = 'v_scroll_bar',
                /**
                 * The prefix of the id of the wrapper.
                 */
                sWrapperIdPrefix = 'wrapper',
                /**
                 * The HTML string of the wrapper element.
                 */
                sHtmlWrapper = '<div class="wrapper"></div>',
                /**
                 * The HTML string of the bar element in the horizontal scroll bar element.
                 */
                sHtmlHBar = '<div class="absolute-position bar h-bar round-corner-3px"' +
                    ( typeof oConfig.sScrollBarColor === 'string' ? ' style="background-color: ' +
                    oConfig.sScrollBarColor + '"' : '') + '></div>',
                /**
                 * The HTML string of the horizontal scroll bar element.
                 */
                sHtmlHScrollBar = '<div class="absolute-position scroll-bar h-scroll-bar round-corner-3px opaque-6" style="display: none;"></div>',
                /**
                 * The HTML string of the knob element, which is actually a point and is used to drag to resize the wrapper
                 * if
                 * resizing is enabled.
                 */
                sHtmlResizeKnob = '<div class="absolute-position bar resize-knob round-corner-3px opaque-6" style="display: none;"></div>',
                /**
                 * The HTML string of the bar element in the vertical scroll bar element.
                 */
                sHtmlVBar = '<div class="absolute-position bar v-bar round-corner-3px"' +
                    ( typeof oConfig.sScrollBarColor === 'string' ? ' style="background-color: ' +
                    oConfig.sScrollBarColor + '"' : '') + '></div>',
                /**
                 * The HTML string of the vertical scroll bar element.
                 */
                sHtmlVScrollBar = '<div class="absolute-position scroll-bar v-scroll-bar round-corner-3px opaque-6" style="display: none;"></div>',
                /**
                 * The bar element of the horizontal scroll bar element.
                 */
                dHBar,
                /**
                 * The horizontal scroll bar element.
                 */
                dHScrollBar,
                /**
                 * The knob element, which is actually a point and is used to drag to resize the wrapper if resizing is
                 * enabled.
                 */
                oResizeKnob,
                /**
                 * The bar element of the vertical scroll bar element.
                 */
                dVBar,
                /**
                 * The vertical scroll bar element.
                 */
                dVScrollBar,
                /**
                 * The wrapped element. If the "wrappee" property in the "oConfig" argument is a string, it will be treated
                 * as the id of the element which is to be wrapped.
                 */
                dWrappee = typeof oConfig.wrappee === 'string' ? $('#' + oConfig.wrappee) : $(oConfig.wrappee),
                /**
                 * The wrapper element.
                 */
                dWrapper,
                /**
                 * How will the wrapped element be moved, either by changing the "left" and "top" or by changing the
                 * "transform".
                 */
                _nHowToMove = typeof oConfig.nHowToMove === 'number' ? oConfig.nHowToMove : KScroll.MOVE_BY_TRANSFORM,
                /**
                 * The maximum height to which the wrapper element can be resized.
                 */
                _nMaxHeight = typeof oConfig.nMaxHeight === 'number' ? oConfig.nMaxHeight : KScroll.WRAPPER_MAX_HEIGHT,
                /**
                 * The maximum width to which the wrapper element can be resized.
                 */
                _nMaxWidth = typeof oConfig.nMaxWidth === 'number' ? oConfig.nMaxWidth : KScroll.WRAPPER_MAX_WIDTH,
                /**
                 * The minimum height to which the wrapper element can be resized.
                 */
                _nMinHeight = typeof oConfig.nMinHeight === 'number' ? oConfig.nMinHeight : KScroll.WRAPPER_MIN_HEIGHT,
                /**
                 * The minimum width to which the wrapper element can be resized.
                 */
                _nMinWidth = typeof oConfig.nMinWidth === 'number' ? oConfig.nMinWidth : KScroll.WRAPPER_MIN_WIDTH,
                /**
                 * The height of the wrapper element if specified. If undefined, the height of the wrapper element will be
                 * the same as the height of the wrapped element before it's wrapped.
                 */
                _nWrapperHeight = oConfig.nWrapperHeight,
                /**
                 * The width of the wrapper element if specified. If undefined, the width of the wrapper element will be the
                 * same as the width of the wrapped element before it's wrapped.
                 */
                _nWrapperWidth = oConfig.nWrapperWidth,
                /**
                 * Whether the scroll bars are auto hidden after the mouse cursor moves out of the wrapper element.
                 */
                _bAutoHide = typeof oConfig.bAutoHide !== 'undefined' ? !!oConfig.bAutoHide : true,
                /**
                 * Whether the wrapped element can be dragged.
                 */
                _bDraggable = typeof oConfig.bDraggable !== 'undefined' ? !!oConfig.bDraggable : false,
                /**
                 * Whether the directions of the scrolling action of the mouse wheel is flipped.
                 */
                _bFlipXY = typeof oConfig.bFlipXY !== 'undefined' ? !!oConfig.bFlipXY : false,
                /**
                 * Whether the wrapped element will glide for a mount of distance after a drag-and-release action.
                 */
                _bGlideable = typeof oConfig.bGlideable !== 'undefined' ? !!oConfig.bGlideable : true,
                /**
                 * Whether the horizontal scroll bar is shown when needed.
                 */
                _bHorizontalBarVisible = typeof oConfig.bHorizontalBarVisible !==
                'undefined' ? !!oConfig.bHorizontalBarVisible : true,
                /**
                 * Whether the horizontal scroll is enabled.
                 */
                _bHorizontalScrollable = typeof oConfig.bHorizontalScrollable !==
                'undefined' ? !!oConfig.bHorizontalScrollable : true,
                /**
                 * Whether the scrolling is page by page or continuous.
                 */
                _bPageMode = typeof oConfig.bPageMode !== 'undefined' ? !!oConfig.bPageMode : false,
                /**
                 * Whether the wrapper element can be resized.
                 */
                _bResizeable = typeof oConfig.bResizeable !== 'undefined' ? !!oConfig.bResizeable : false,
                /**
                 * Whether the resize knob is visible.
                 */
                _bResizeKnobVisible = typeof oConfig.bResizeKnobVisible !==
                'undefined' ? !!oConfig.bResizeKnobVisible : false,
                /**
                 * Whether the arrow keys can control the scroll of the wrapped element.
                 */
                _bScrollableByArrowKeys = typeof oConfig.bScrollableByArrowKeys !==
                'undefined' ? !!oConfig.bScrollableByArrowKeys : true,
                /**
                 * Whether the user can scroll with the mouse wheel.
                 */
                _bScrollableByMouseWheel = typeof oConfig.bScrollableByMouseWheel !==
                'undefined' ? !!oConfig.bScrollableByMouseWheel : true,
                /**
                 * Whether to use the "transition" property of CSS to make the scrolling smooth.
                 */
                _bSmooth = typeof oConfig.bSmooth !== 'undefined' ? !!oConfig.bSmooth : false,
                /**
                 * Whether the vertical scroll bar is shown when needed.
                 */
                _bVerticalBarVisible = typeof oConfig.bVerticalBarVisible !==
                'undefined' ? !!oConfig.bVerticalBarVisible : true,
                /**
                 * Whether the horizontal scroll is enabled.
                 */
                _bVerticalScrollable = typeof oConfig.bVerticalScrollable !==
                'undefined' ? !!oConfig.bVerticalScrollable : true,
                /**
                 * A key-value object containing the event handler functions.
                 */
                _oEventHandlers = oConfig.oEventHandlers || {},
                /**
                 * The color that's going to be used for the scroll bars.
                 */
                _sScrollBarColor = oConfig.sScrollBarColor,
                /**
                 * Whether the scroll bars are being dragged.
                 */
                bDraggingScrollBar = false,
                /**
                 * Whether the wrapped element is being dragged.
                 */
                bDraggingWrappee = false,
                /**
                 * Whether the mouse cursor is inside the wrapper element.
                 */
                bMouseIn = false,
                /**
                 * Whether the wrapper element is being resized.
                 */
                bResizing = false,
                /**
                 * Whether the bottom end of the wrapped element is reached.
                 */
                bBottomEndReached = false,
                /**
                 * Whether the left end of the wrapped element is reached.
                 */
                bLeftEndReached = false,
                /**
                 * Whether the right end of the wrapped element is reached.
                 */
                bRightEndReached = false,
                /**
                 * Whether the top end of the wrapped element is reached.
                 */
                bTopEndReached = false,
                /**
                 * The total number of instances of the the class "com.huanli.ui.KScroll".
                 */
                nInstanceCount,
                /**
                 * The key of the window.Timeout invocation which is used to provide a delay before the scroll bars fade out.
                 */
                timeoutVisibility,
                /**
                 * The height and the width including paddings of the wrapped element before it's wrapped into the wrapper
                 * element.
                 */
                oWrappeeOldSizes = {
                    height: dWrappee.innerHeight(),
                    width: dWrappee.innerWidth()
                },
                /**
                 * Add the CSS "transition" property for the ordinary scrolling functionality.
                 *
                 * @author Huan Li
                 * @param {Boolean} bScrollOnce True if the transition runs only once. False if the transition runs for
                 * multiple times.
                 */
                addTransition4Scroll = function (bScrollOnce) {
                    $([dWrappee, dHBar, dVBar]).each(function (index, elem) {
                        $(elem).css({
                            transitionProperty: noTransform() ? 'left, top' : getBrowserSpecificPrefix() + 'transform',
                            transitionDuration: ( bScrollOnce ? KScroll.SCROLL_ONCE_TRANSITION_DURATION : KScroll.DEFAULT_TRANSITION_DURATION) +
                            'ms',
                            transitionTimingFunction: 'ease-out'
                        });
                    });
                },
                /**
                 * Add the CSS "transition" property for the gliding effect.
                 *
                 * @author Huan Li
                 * @param {Object} oT A key-value pair object containing the transition durations for both the X and the Y
                 * axes.
                 * @param {Object} oOutOfRange A key-value pair object containing whether the glide is going beyond the
                 * boundaries of the wrapped element for both the X and the Y axes.
                 */
                addTransition4Glide = function (oT, oOutOfRange) {
                    var oTransition = {};
                    if (noTransform()) {
                        oTransition.transitionProperty = 'left, top';
                        oTransition.transitionTimingFunction = getBezierCurve(oOutOfRange.x) + ', ' +
                        getBezierCurve(oOutOfRange.y);
                    } else {
                        oTransition.transitionProperty = getBrowserSpecificPrefix() + 'transform';
                        oTransition.transitionTimingFunction = getBezierCurve(oOutOfRange.x || oOutOfRange.y);
                    }
                    oTransition.transitionDuration = Math.min(oT.x, oT.y) + 'ms';
                    $([dWrappee, dHBar, dVBar]).each(function (index, elem) {
                        $(elem).css(oTransition);
                    });
                },
                /**
                 * Add the CSS "transition" property for the scrolling by pages functionality.
                 *
                 * @author Huan Li
                 */
                addTransition4PageScroll = function () {
                    $([dWrappee, dHBar, dVBar]).each(function (index, elem) {
                        $(elem).css({
                            transitionProperty: noTransform() ? 'left, top' : getBrowserSpecificPrefix() + 'transform',
                            transitionDuration: KScroll.SCROLL_ONCE_TRANSITION_DURATION + 'ms',
                            transitionTimingFunction: 'ease-out'
                        });
                    });
                },
                /**
                 * Append a suffix, which is the total number of the instances of the class "com.huanli.ui.KScroll", to the
                 * prefix of an id to form a unique id.
                 *
                 * @author Huan Li
                 * @param {String} idPrefix A prefix of an id.
                 * @returns {String} The unique id by combining the prefix of the id and the total number of instances.
                 */
                appendIdSuffix = function (idPrefix) {
                    return idPrefix + '_' + nInstanceCount;
                },
                /**
                 * Bars move first and then drive the wrapped element to move accordingly.
                 *
                 * @author Huan Li
                 * @param {Object} oMovement A key-value pair object containing the movement along the X and the Y axes.
                 * @param {Boolean} bVBar True if the driving bar is the vertical bar. False if it's the horizontal bar.
                 */
                barsDriveWrappee = function (oMovement, bVBar) {
                    if (bVBar) {
                        vBarDrivesWrappee(oMovement.y);
                    } else {
                        hBarDrivesWrappee(oMovement.x);
                    }
                },
                /**
                 * Check on the movement that the oBar is about to make in order to keep it inside the track of scroll bar.
                 * Calculation will be performed if necessary.
                 *
                 * @author Huan Li
                 * @param {jQuery} oBar The bar that's about to move.
                 * @param {Object} oCoordinate The current position of the oBar and is expressed with the properties "x"
                 * and "y" which stand for the coordinates on the X and the Y axes, respectively.
                 * @param {Object} oMovement The movement that the oBar is about to make and is expressed with the
                 * properties "x" and "y" which stand for how much it moves along the X and the Y axes,
                 * respectively.
                 * @returns {Object} How much the oBar can move which is expressed with the properties "x" and "y" which
                 *          stand for how much it moves along the X and the Y axes, respectively. The maximum movements are
                 *          the ones specified by the oMovement argument and if those movements can make the oBar out of
                 *          its track of the scroll bar then the return value would be the distance to the farthest position
                 *          it can move along the track.
                 */
                calcBarBound = function (oBar, oCoordinate, oMovement) {
                    var ret = {};
                    if (oBar.is(dHBar)) {
                        if (oCoordinate.x + oMovement.x < 0) {
                            ret.x = -oCoordinate.x;
                        } else if (oCoordinate.x + oMovement.x > oBar.parent().width() - oBar.outerWidth(true)) {
                            ret.x = oBar.parent().width() - (oCoordinate.x + oBar.outerWidth(true));
                        } else {
                            ret.x = oMovement.x;
                        }
                    } else {
                        ret.x = 0;
                    }
                    if (oBar.is(dVBar)) {
                        if (oCoordinate.y + oMovement.y < 0) {
                            ret.y = -oCoordinate.y;
                        } else if (oCoordinate.y + oMovement.y > oBar.parent().height() - oBar.outerHeight(true)) {
                            ret.y = oBar.parent().height() - (oCoordinate.y + oBar.outerHeight(true));
                        } else {
                            ret.y = oMovement.y;
                        }
                    } else {
                        ret.y = 0;
                    }
                    return ret;
                },
                /**
                 * Calculate the shifting of the wrapped element after a dragging action is finished. Because the wrapped
                 * element can't go beyond the visible area of the wrapper element so the shifting need to be calculated.
                 *
                 * @author Huan Li
                 * @param {Object} oV0 A key-value pair object containing the initial values of velocity for both the X and
                 * the Y axes.
                 * @param {Object} oS A key-value pair object containing the values of shifting calculated from the initial
                 * velocity and the acceleration for both the X and the Y axes.
                 * @returns {Object} A key-value pair object containing the values of shifting that are within the boundaries
                 * of the wrapped element for both the X and the Y axes.
                 */
                calcGlideShifting = function (oV0, oS) {
                    var currentPosition, oNewS = {
                        x: oS.x,
                        y: oS.y
                    };
                    if (noTransform()) {
                        currentPosition = {
                            x: dWrappee.position().left,
                            y: dWrappee.position().top
                        };
                    } else {
                        currentPosition = parseTransform(dWrappee.css('transform'));
                    }
                    if (_bHorizontalScrollable) {
                        if (currentPosition.x + oS.x > 0 ||
                            currentPosition.x + oS.x < dWrapper.innerWidth() - dWrappee.outerWidth(true)) {
                            if (oV0.x > 0) {
                                oNewS.x = -currentPosition.x;
                            } else {
                                oNewS.x = dWrapper.innerWidth() - dWrappee.outerWidth(true) - currentPosition.x;
                            }
                        }
                    }
                    if (_bVerticalScrollable) {
                        if (currentPosition.y + oS.y > 0 ||
                            currentPosition.y + oS.y < dWrapper.innerHeight() - dWrappee.outerHeight(true)) {
                            if (oV0.y > 0) {
                                oNewS.y = -currentPosition.y;
                            } else {
                                oNewS.y = dWrapper.innerHeight() - dWrappee.outerHeight(true) - currentPosition.y;
                            }
                        }
                    }
                    return oNewS;
                },
                /**
                 * Calculate the position of the horizontal bar, i.e. where it should be put in the horizontal scroll bar.
                 *
                 * @author Huan Li
                 * @returns {Number} The position of the horizontal bar in pixels.
                 */
                calcHBarPosition = function () {
                    var ret, nHRatio = getHorizontalMovementRatio();
                    if (isWrappeeOutOfBoundsHorizontally()) {
                        ret = dHScrollBar.width() - dHBar.outerWidth(true);
                    } else {
                        if (noTransform()) {
                            ret = -dWrappee.position().left / nHRatio;
                        } else {
                            ret = -parseTransform(dWrappee.css('transform')).x / nHRatio;
                        }
                    }
                    return ret;
                },
                /**
                 * Calculate the width of the horizontal bar. The maximum value is equal to the width of the track of the
                 * horizontal scroll bar.
                 *
                 * @author Huan Li
                 * @returns {Number} The width of the horizontal bar.
                 */
                calcHBarWidth = function () {
                    var ret = dWrapper.width() / dWrappee.outerWidth(true) * dHScrollBar.width();
                    if (ret > dHScrollBar.width()) {
                        ret = dHScrollBar.width();
                    }
                    return ret;
                },
                /**
                 * Calculate the inertia related data, which are the initial velocity, the time for reducing the velocity to
                 * zero and the shifting the wrapped element will make during this time. The acceleration is fixed.
                 *
                 * @author Huan Li
                 * @param {Object} oStartPoint A key-value pair object containing the coordinates and a timestamp of the
                 * point where the wrapped element started moving.
                 * @param {Object} oEndPoint A key-value pair object containing the coordinates and a timestamp of the
                 * point where the wrapped element ended moving.
                 * @returns {Object} A key-value pair object containing the values of initial velocity, time span of the
                 * shifting and the shifting itself for both the X and the Y axes.
                 */
                calcInertia = function (oStartPoint, oEndPoint) {
                    var ret, oT, oV0, oS;
                    if (oStartPoint && oEndPoint) {
                        oV0 = {
                            x: (oEndPoint.x - oStartPoint.x) / (oEndPoint.time - oStartPoint.time),
                            y: (oEndPoint.y - oStartPoint.y) / (oEndPoint.time - oStartPoint.time)
                        };
                        oT = {
                            x: Math.abs(oV0.x / KScroll.DEFAULT_ACCELERATION),
                            y: Math.abs(oV0.y / KScroll.DEFAULT_ACCELERATION)
                        };
                        oS = {
                            x: oV0.x / (2 * KScroll.DEFAULT_ACCELERATION),
                            y: oV0.y / (2 * KScroll.DEFAULT_ACCELERATION)
                        };
                        ret = {
                            v0: oV0,
                            t: oT,
                            s: oS
                        };
                    }
                    return ret;
                },
                /**
                 * Calculate the current page numbers.
                 *
                 * @author Huan Li
                 * @returns {Object} A key-value pair object containing the current page numbers both horizontally and
                 * vertically.
                 */
                calcPageNumber = function () {
                    var oCoordinates = noTransform() ? {
                        x: dWrappee.position().left,
                        y: dWrappee.position().top
                    } : parseTransform(dWrappee.css('transform')), oPageSize = {
                        x: dWrapper.width(),
                        y: dWrapper.height()
                    };
                    return {
                        x: Math.ceil(Math.abs(oCoordinates.x) / oPageSize.x),
                        y: Math.ceil(Math.abs(oCoordinates.y) / oPageSize.y)
                    };
                },
                /**
                 * Calculate the total number of pages.
                 *
                 * @author Huan Li
                 * @returns {Object} A key-value pair object containing the total number of pages both horizontally and
                 * vertically.
                 */
                calcTotalPageCount = function () {
                    var oPageSize = {
                        x: dWrapper.width(),
                        y: dWrapper.height()
                    };
                    return {
                        x: Math.ceil(dWrappee.outerWidth(true) / oPageSize.x),
                        y: Math.ceil(dWrappee.outerHeight(true) / oPageSize.y)
                    };
                },
                /**
                 * Calculate the width of the vertical bar. The maximum value is equal to the height of the track of the
                 * vertical scroll bar.
                 *
                 * @author Huan Li
                 * @returns {Number} The height of the vertical bar.
                 */
                calcVBarHeight = function () {
                    var ret = dWrapper.height() / dWrappee.outerHeight(true) * dVScrollBar.height();
                    if (ret > dVScrollBar.height()) {
                        ret = dVScrollBar.height();
                    }
                    return ret;
                },
                /**
                 * Calculate the position of the vertical bar, i.e. where it should be put in the vertical scroll bar.
                 *
                 * @author Huan Li
                 * @returns {Number} The position of the vertical bar in pixels.
                 */
                calcVBarPosition = function () {
                    var ret, nVRatio = getVerticalMovementRatio();
                    if (isWrappeeOutOfBoundsVertically()) {
                        ret = dVScrollBar.height() - dVBar.outerHeight(true);
                    } else {
                        if (noTransform()) {
                            ret = -dWrappee.position().top / nVRatio;
                        } else {
                            ret = -parseTransform(dWrappee.css('transform')).y / nVRatio;
                        }
                    }
                    return ret;
                },
                /**
                 * Check on the movement that the wrapped element is about to make in order to keep it inside the range of
                 * the wrapper element. Calculation will be performed if necessary.
                 *
                 * @author Huan Li
                 * @param {Object} oCoordinate The current position of the wrapped element and is expressed with the
                 * properties "x" and "y" which stand for the coordinates on the X and the Y axes, respectively.
                 * @param {Object} oMovement The movement that the wrapped element is about to make and is expressed with
                 * the properties "x" and "y" which stand for how much it moves along the X and the Y axes, respectively.
                 * @returns {Object} How much the wrapped element can move which is expressed with the properties "x" and "y"
                 * which stand for how much it moves along the X and the Y axes, respectively. The maximum movements are the
                 * ones specified by the oMovement argument and if those movements will make the wrapped element out of the
                 * range of the wrapper element then the return value would be the distance to the farthest position it can
                 * move along the axis.
                 */
                calcWrappeeBound = function (oCoordinate, oMovement) {
                    var ret = {};
                    if (dWrappee.outerWidth(true) > dWrapper.width()) {
                        if (oCoordinate.x + oMovement.x > 0) {
                            ret.x = -oCoordinate.x;
                            bLeftEndReached = true;
                        } else if (oCoordinate.x + oMovement.x < dWrapper.width() - dWrappee.outerWidth(true)) {
                            ret.x = Math.abs(oCoordinate.x) + dWrapper.width() - dWrappee.outerWidth(true);
                            bRightEndReached = true;
                        } else {
                            ret.x = oMovement.x;
                        }
                    } else {
                        ret.x = 0;
                    }
                    if (dWrappee.outerHeight(true) > dWrapper.height()) {
                        if (oCoordinate.y + oMovement.y > 0) {
                            ret.y = -oCoordinate.y;
                            bTopEndReached = true;
                        } else if (oCoordinate.y + oMovement.y < dWrapper.height() - dWrappee.outerHeight(true)) {
                            ret.y = Math.abs(oCoordinate.y) + dWrapper.height() - dWrappee.outerHeight(true);
                            bBottomEndReached = true;
                        } else {
                            ret.y = oMovement.y;
                        }
                    } else {
                        ret.y = 0;
                    }
                    return ret;
                },
                /**
                 * Capitalize the first letter in the string passed in as an argument.
                 *
                 * @author Huan Li
                 * @param {String} sSrc The string whose first letter is to be capitalized.
                 * @returns {String} The string value of the argument with the first letter is capitalized.
                 */
                capitalizeInitial = function (sSrc) {
                    if (typeof sSrc === 'string') {
                        return sSrc.charAt(0).toUpperCase() + sSrc.slice(1);
                    }
                },
                /**
                 * One of the bars is dragged to move along the track of the scroll bar so that the wrapped element will be
                 * scrolled.
                 *
                 * @author Huan Li
                 * @param {jQuery} oBar The bar that's dragged.
                 * @param {Object} oMovement The movement that the bar which is dragged will make and is expressed with the
                 * properties "x" and "y" which stand for how much it moves along the X and the Y axes, respectively.
                 */
                dragScrollBar = function (oBar, oMovement) {
                    barsDriveWrappee(oMovement, oBar.is(dVBar));
                },
                /**
                 * The wrapped element is dragged to move within the range of the wrapper element and the scroll bars will
                 * move accordingly.
                 *
                 * @author Huan Li
                 * @param {Object} oMovement The movement that the bar which is dragged will make and is expressed with the
                 * properties "x" and "y" which stand for how much it moves along the X and the Y axes, respectively.
                 */
                dragWrappee = function (oMovement) {
                    wrappeeDrivesBars(oMovement, KScroll.MOVEMENT_TRIGGER_ACTION_DRAG);
                },
                /**
                 * Invoke the event handler function for handling the event "endReached" which means one of the four ends of
                 * the wrapped element has been reached after scrolling.
                 *
                 * @author Huan Li
                 * @param {Object} oShift A key-value pair object containing the values of shifting along both the X and
                 * the Y axes.
                 */
                fireEndReached = function (oShift) {
                    _this.emit(KScroll.EVENT_END_REACHED, {
                        dWrappee: dWrappee,
                        dWrapper: dWrapper,
                        oShift: oShift,
                        oCoordinates: noTransform() ? {
                            x: dWrappee.position().left,
                            y: dWrappee.position().top
                        } : parseTransform(dWrappee.css('transform')),
                        oWhichEndReached: {
                            bottom: bBottomEndReached,
                            left: bLeftEndReached,
                            right: bRightEndReached,
                            top: bTopEndReached
                        }
                    });
                },
                /**
                 * Invoke the event handler function for handling the event "bottomEndReached" which means the bottom end of
                 * the wrapped element has been reached after scrolling.
                 *
                 * @author Huan Li
                 * @param {Object} oShift A key-value pair object containing the values of shifting along both the X and
                 * the Y axes.
                 */
                fireBottomEndReached = function (oShift) {
                    _this.emit(KScroll.EVENT_BOTTOM_END_REACHED, {
                        dWrappee: dWrappee,
                        dWrapper: dWrapper,
                        oShift: oShift,
                        oCoordinates: noTransform() ? {
                            x: dWrappee.position().left,
                            y: dWrappee.position().top
                        } : parseTransform(dWrappee.css('transform'))
                    });
                },
                /**
                 * Invoke the event handler function for handling the event "leftEndReached" which means the left end of the
                 * wrapped element has been reached after scrolling.
                 *
                 * @author Huan Li
                 * @param {Object} oShift A key-value pair object containing the values of shifting along both the X and
                 * the Y axes.
                 */
                fireLeftEndReached = function (oShift) {
                    _this.emit(KScroll.EVENT_LEFT_END_REACHED, {
                        dWrappee: dWrappee,
                        dWrapper: dWrapper,
                        oShift: oShift,
                        oCoordinates: noTransform() ? {
                            x: dWrappee.position().left,
                            y: dWrappee.position().top
                        } : parseTransform(dWrappee.css('transform'))
                    });
                },
                /**
                 * Invoke the event handler function for handling the event "rightEndReached" which means the right end of
                 * the wrapped element has been reached after scrolling.
                 *
                 * @author Huan Li
                 * @param {Object} oShift A key-value pair object containing the values of shifting along both the X and
                 * the Y axes.
                 */
                fireRightEndReached = function (oShift) {
                    _this.emit(KScroll.EVENT_RIGHT_END_REACHED, {
                        dWrappee: dWrappee,
                        dWrapper: dWrapper,
                        oShift: oShift,
                        oCoordinates: noTransform() ? {
                            x: dWrappee.position().left,
                            y: dWrappee.position().top
                        } : parseTransform(dWrappee.css('transform'))
                    });
                },
                /**
                 * Invoke the event handler function for handling the event "topEndReached" which means the top end of the
                 * wrapped element has been reached after scrolling.
                 *
                 * @author Huan Li
                 * @param {Object} oShift A key-value pair object containing the values of shifting along both the X and
                 * the Y axes.
                 */
                fireTopEndReached = function (oShift) {
                    _this.emit(KScroll.EVENT_TOP_END_REACHED, {
                        dWrappee: dWrappee,
                        dWrapper: dWrapper,
                        oShift: oShift,
                        oCoordinates: noTransform() ? {
                            x: dWrappee.position().left,
                            y: dWrappee.position().top
                        } : parseTransform(dWrappee.css('transform'))
                    });
                },
                /**
                 * Invoke the event handler function for handling the event "scrolled" which means the wrapped element has
                 * just been scrolled once.
                 *
                 * @author Huan Li
                 * @param {Object} oShift A key-value pair object containing the values of shifting along both the X and
                 * the Y axes.
                 * @param {String} sTriggerAction A string describing the trigger action of the scrolling that was just
                 * done.
                 */
                fireScrolled = function (oShift, sTriggerAction) {
                    _this.emit(KScroll.EVENT_SCROLLED, {
                        dWrappee: dWrappee,
                        dWrapper: dWrapper,
                        oShift: oShift,
                        oCoordinates: noTransform() ? {
                            x: dWrappee.position().left,
                            y: dWrappee.position().top
                        } : parseTransform(dWrappee.css('transform')),
                        sTriggerAction: sTriggerAction
                    });
                },
                /**
                 * Get the corresponding Bezier Curve based on whether there will be a bouncing back effect.
                 *
                 * @author Huan Li
                 * @param {Boolean} bBounce True if the bouncing effect is required. False otherwise.
                 * @returns {String} The value of the CSS "transition-timing-function" property.
                 */
                getBezierCurve = function (bBounce) {
                    var ret = KScroll.BEZIER_CURVE_NO_BOUNCE;
                    if (bBounce) {
                        ret = KScroll.BEZIER_CURVE_BOUNCE;
                    }
                    return ret;
                },
                /**
                 * Get the browser specific prefix for CSS properties by using browser sniffing.
                 *
                 * @author Huan Li
                 * @returns {String} The browser specific prefix for CSS properties.
                 */
                getBrowserSpecificPrefix = function () {
                    var ret = '', userAgent = navigator.userAgent.toLowerCase(), match = /(webkit)[ \/]([\w.]+)/.exec(userAgent) ||
                        /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(userAgent) || /(msie) ([\w.]+)/.exec(userAgent) ||
                        !/compatible/.test(userAgent) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(userAgent) ||
                        [], browserName = match[1];
                    if (browserName === 'mozilla') {
                        ret = '-moz-';
                    } else if (browserName === 'webkit') {
                        ret = '-webkit-';
                    } else if (browserName === 'msie') {
                        ret = '-ms-';
                    } else if (browserName === 'opera') {
                        ret = '-o-';
                    }
                    return ret;
                },
                /**
                 * Get the appropriate event subject for the device on which the browser is running.
                 *
                 * @author Huan Li
                 * @param {String} sEventType The type of the event. It can be anyone of KScroll.EVENT_TYPE_START,
                 * KScroll.EVENT_TYPE_MOVE, KScroll.EVENT_TYPE_END or KScroll.EVENT_TYPE_CANCEL
                 * @returns {String} The event subject of the corresponding event type.
                 */
                getEventSubject = function (sEventType) {
                    switch (sEventType) {
                        case KScroll.EVENT_TYPE_START:
                            return isTouchable() ? KScroll.EVENT_TOUCH_START : KScroll.EVENT_MOUSE_DOWN;
                        case KScroll.EVENT_TYPE_MOVE:
                            return isTouchable() ? KScroll.EVENT_TOUCH_MOVE : KScroll.EVENT_MOUSE_MOVE;
                        case KScroll.EVENT_TYPE_END:
                            return isTouchable() ? KScroll.EVENT_TOUCH_END : KScroll.EVENT_MOUSE_UP;
                        case KScroll.EVENT_TYPE_CANCEL:
                            return isTouchable() ? KScroll.EVENT_TOUCH_CANCEL : KScroll.EVENT_MOUSE_UP;
                        default:
                            return sEventType;
                    }
                },
                /**
                 * Get the ratio of the distance that the wrapped element can be moved horizontally to the distance that the
                 * horizontal bar can be moved. <b>Please beware that this ratio is the one of the wrapped element to the
                 * horizontal bar.</b>
                 *
                 * @author Huan Li
                 * @returns {Number} The ratio of the distance that the wrapped element can be moved horizontally to the
                 * distance that the horizontal bar can be moved.
                 */
                getHorizontalMovementRatio = function () {
                    return (dWrappee.outerWidth(true) - dWrapper.width()) /
                        (dHScrollBar.width() - dHBar.outerWidth(true));
                },
                /**
                 * Get the height of the horizontal scroll bar. If it's hidden the result will be 0.
                 *
                 * @author Huan Li
                 * @returns {Number} The height of the horizontal scroll bar. 0 will be returned if it's hidden.
                 */
                getHScrollBarHeight = function () {
                    return shouldShowHorizontalScrollBar() || _bResizeable ? dHScrollBar.outerHeight(true) : 0;
                },
                /**
                 * Get the position of an element relative to the wrapped element.
                 *
                 * @author Huan Li
                 * @param {String|HTMLElement|jQuery} element An element of which the position that's relative to the wrapped
                 * element is to be retrieved.
                 * @returns {Object} The key-value pair object containing the x and y coordinates of the element.
                 */
                getPositionToWrappee = function (element) {
                    var ret = {
                        x: 0,
                        y: 0
                    }, oPosition, oParentsPosition;
                    if (element) {
                        element = $(element);
                        if (!$(element).is(dWrappee)) {
                            oParentsPosition = getPositionToWrappee($(element).offsetParent());
                            oPosition = $(element).position();
                            ret = {
                                x: oParentsPosition.x + oPosition.left,
                                y: oParentsPosition.y + oPosition.top
                            };
                        }
                    }
                    return ret;
                },
                /**
                 * Get the ratio of the distance that the wrapped element can be moved vertically to the distance that
                 * the vertical bar can be moved.
                 * <b>Please beware that this ratio is the one of the wrapped element to the horizontal bar.</b>
                 *
                 * @author Huan Li
                 * @returns {Number} The ratio of the distance that the wrapped element can be moved vertically to the
                 *          distance that the vertical bar can be moved.
                 */
                getVerticalMovementRatio = function () {
                    return (dWrappee.outerHeight(true) - dWrapper.height()) /
                        (dVScrollBar.height() - dVBar.outerHeight(true));
                },
                /**
                 * Get the height of the vertical scroll bar. If it's hidden the result will be 0.
                 *
                 * @author Huan Li
                 * @returns {Number} The height of the vertical scroll bar. 0 will be returned if it's hidden.
                 */
                getVScrollBarWidth = function () {
                    return shouldShowVerticalScrollBar() || _bResizeable ? dVScrollBar.outerWidth(true) : 0;
                },
                /**
                 * Get the X coordinate of the mouse cursor or the touch depending on the device used.
                 *
                 * @author Huan Li
                 * @param {Event} evt The mouse event or the touch event depending on the device used.
                 * @returns {Number} The X coordinate of the mouse cursor or the touch depending on the device used.
                 */
                getXCoordinate = function (evt) {
                    var ret;
                    if (isTouchable()) {
                        ret = evt.originalEvent.changedTouches.item(0).clientX;
                    } else {
                        ret = evt.pageX;
                    }
                    return ret;
                },
                /**
                 * Get the Y coordinate of the mouse cursor or the touch depending on the device used.
                 *
                 * @author Huan Li
                 * @param {Event} evt The mouse event or the touch event depending on the device used.
                 * @returns {Number} The Y coordinate of the mouse cursor or the touch depending on the device used.
                 */
                getYCoordinate = function (evt) {
                    var ret;
                    if (isTouchable()) {
                        ret = evt.originalEvent.changedTouches.item(0).clientY;
                    } else {
                        ret = evt.pageY;
                    }
                    return ret;
                },
                /**
                 * Continue to move the wrapped element for a mount of distance after the mouse button is released after a
                 * dragging action.
                 *
                 * @author Huan Li
                 * @param {Object} oStartPoint A key-value pair object containing the coordinates and a timestamp of the
                 * point where the wrapped element started moving.
                 * @param {Object} oEndPoint A key-value pair object containing the coordinates and a timestamp of the
                 * point where the wrapped element ended moving.
                 */
                glide = function (oStartPoint, oEndPoint) {
                    var oInertia = calcInertia(oStartPoint, oEndPoint),
                        oV0 = oInertia.v0,
                        oS = oInertia.s,
                        oT = oInertia.t,
                        oNewS = calcGlideShifting(oV0, oS),
                        oOutOfRange = {
                            x: oS.x !== oNewS.x,
                            y: oS.y !== oNewS.y
                        },
                        oNewT = {
                            x: Math.max(oOutOfRange.x ? 2 * oNewS.x / oV0.x : oT.x, KScroll.MINIMUM_TRANSITION_TIME),
                            y: Math.max(oOutOfRange.y ? 2 * oNewS.y / oV0.y : oT.y, KScroll.MINIMUM_TRANSITION_TIME)
                        };
                    addTransition4Glide(oNewT, oOutOfRange);
                    wrappeeDrivesBars(oNewS, KScroll.MOVEMENT_TRIGGER_ACTION_GLIDE);
                },
                /**
                 * Handle the event fired when arrow keys are held down. The wrapped element will be scrolled when an arrow
                 * key is held down.
                 *
                 * @author Huan Li
                 * @param {Event} event The event fired when arrow keys are held down.
                 */
                handleArrowKeysDown = function (event) {
                    if (bMouseIn) {
                        switch (event.keyCode) {
                            case KScroll.CODE_DOWN_ARROW_KEY:
                                wrappeeDrivesBars({
                                    x: 0,
                                    y: -1 * KScroll.SHIFTING_BY_ARROW_KEYS
                                }, KScroll.MOVEMENT_TRIGGER_ACTION_ARROW_KEY_DOWN);
                                break;
                            case KScroll.CODE_LEFT_ARROW_KEY:
                                wrappeeDrivesBars({
                                    x: KScroll.SHIFTING_BY_ARROW_KEYS,
                                    y: 0
                                }, KScroll.MOVEMENT_TRIGGER_ACTION_ARROW_KEY_LEFT);
                                break;
                            case KScroll.CODE_RIGHT_ARROW_KEY:
                                wrappeeDrivesBars({
                                    x: -1 * KScroll.SHIFTING_BY_ARROW_KEYS,
                                    y: 0
                                }, KScroll.MOVEMENT_TRIGGER_ACTION_ARROW_KEY_RIGHT);
                                break;
                            case KScroll.CODE_UP_ARROW_KEY:
                                wrappeeDrivesBars({
                                    x: 0,
                                    y: KScroll.SHIFTING_BY_ARROW_KEYS
                                }, KScroll.MOVEMENT_TRIGGER_ACTION_ARROW_KEY_UP);
                                break;
                        }
                    }
                },
                /**
                 * Handle the event fired when the mouse is up after dragging the scroll bars to stop the wrapped element
                 * moving as the mouse cursor moves.
                 *
                 * @author Huan Li
                 * @param {Event} event The event fired when the mouse is up after dragging the scroll bars.
                 */
                handleEndDragScrollBars = function (event) {
                    $(document).off('mousemove', handleMoveDragScrollBars);
                    $(document).off('mouseup', handleEndDragScrollBars);
                },
                /**
                 * Handle the event fired when the left button of the mouse is released after dragging the horizontal bar so
                 * as to
                 * stop the horizontal bar moving as the mouse cursor moves.
                 *
                 * @author Huan Li
                 * @param {Event} evt The event fired when the left button of the mouse is released after dragging the
                 * horizontal
                 *          bar.
                 */
                handleEndDragHBar = function (evt) {
                    if (bDraggingScrollBar) {
                        bDraggingScrollBar = false;
                        $(document).off('mousemove', handleMoveDragHBar);
                        if (_bAutoHide) {
                            observeScrollBarsVisibility();
                            if (!bMouseIn) {
                                hideScrollBars();
                            }
                        }
                        if (_bSmooth) {
                            resumeTransition4Scroll();
                        }
                        $(document).off('mouseup', handleEndDragHBar);
                    }
                },
                /**
                 * Handle the event fired when the left button of the mouse is released after dragging the vertical bar so as
                 * to
                 * stop the vertical bar moving as the mouse cursor moves.
                 *
                 * @author Huan Li
                 * @param {Event} evt The event fired when the left button of the mouse is released after dragging the vertical bar.
                 */
                handleEndDragVBar = function (evt) {
                    if (bDraggingScrollBar) {
                        bDraggingScrollBar = false;
                        $(document).off('mousemove', handleMoveDragVBar);
                        if (_bAutoHide) {
                            observeScrollBarsVisibility();
                            if (!bMouseIn) {
                                hideScrollBars();
                            }
                        }
                        if (_bSmooth) {
                            resumeTransition4Scroll();
                        }
                        $(document).off('mouseup', handleEndDragVBar);
                    }
                },
                /**
                 * Handle the event fired when the mouse is up after resizing the wrapper element so as to stop the wrapper
                 * element resizing as the mouse cursor moves.
                 *
                 * @author Huan Li
                 * @param {Event} event The event fired when the mouse is up after resizing the wrapper element.
                 */
                handleEndDragToResize = function (event) {
                    if (bResizing) {
                        bResizing = false;
                        $(document).off(getEventSubject(KScroll.EVENT_TYPE_MOVE), handleMoveDragToResize);
                        $(document).off(getEventSubject(KScroll.EVENT_TYPE_END), handleEndDragToResize);
                    }
                },
                /**
                 * Handle the event fired when the mouse is up after dragging the wrapped element so as to stop the wrapped
                 * element moving as the mouse cursor moves.
                 *
                 * @author Huan Li
                 * @param {Event} event The event fired when the mouse is up after dragging the wrapped element.
                 */
                handleEndDragWrappee,
                /**
                 * Handle the event fired when the mouse cursor enters the wrapper element so as to show the scroll bars.
                 *
                 * @author Huan Li
                 * @param {Event} event The event fired when the mouse cursor enters the wrapper element.
                 */
                handleMouseEnterScrollBarsVisibility = function (event) {
                    showScrollBars();
                },
                /**
                 * Handle the event fired when the mouse cursor leaves the wrapper element so as to hide the scroll bars.
                 *
                 * @author Huan Li
                 * @param {Event} event The event fired when the mouse cursor leaves the wrapper element.
                 */
                handleMouseLeaveScrollBarsVisibility = function (event) {
                    hideScrollBars();
                },
                /**
                 * Handle the event fired when the mouse moves while the mouse is dragging the scroll bars.
                 *
                 * The implementation of this function is inside the "handleStartDragScrollBars" function because it needs
                 * the x and y coordinates which can only be obtained inside the "handleStartDragScrollBars" function.
                 */
                handleMoveDragScrollBars,
                /**
                 * Handle the event fired when the mouse moves while the left button is held down on the horizontal bar so
                 * that
                 * the horizontal bar can move as the mouse moves.
                 *
                 * The implementation of this function is inside the horizontal bar's mousedown event's handler because it
                 * needs
                 * the x and y coordinates which can only be obtained inside the horizontal bar's mousedown event's handler.
                 */
                handleMoveDragHBar,
                /**
                 * Handle the event fired when the mouse moves while the left button is held down on the vertical bar so that
                 * the
                 * vertical bar can move as the mouse moves.
                 *
                 * The implementation of this function is inside the vertical bar's mousedown event's handler because it
                 * needs
                 * the x and y coordinates which can only be obtained inside the vertical bar's mousedown event's handler.
                 */
                handleMoveDragVBar,
                /**
                 * Handle the event fired when the mouse moves while the left button is held down on the resize knob so that
                 * the wrapper element is resized as the mouse moves.
                 *
                 * The implementation of this function is inside the "handleStartDragToResize" function because it needs the
                 * x and y coordinates which can only be obtained inside the "handleStartDragToResize" function.
                 *
                 * @author Huan Li
                 * @param {Event} event The event fired when the mouse moves while the left button has been keeping held
                 * down on the resize knob.
                 */
                handleMoveDragToResize,
                /**
                 * Handle the event fired when the mouse moves while the left button is held down on the wrapped element so
                 * that the wrapped element can move as the mouse moves.
                 *
                 * The implementation of this function is inside the "handleStartDragWrappee" function because it needs the x
                 * and y coordinates which can only be obtained inside the "handleStartDragWrappee" function.
                 *
                 * @author Huan Li
                 * @param {Object} oPosition The x and y coordinates of the mouse cursor when the left button of the
                 * mouse is held down on the wrapped element.
                 * @param {Event} event The event fired when the mouse moves while the left button has been keeping held
                 * down on the wrapped element.
                 */
                handleMoveDragWrappee,
                /**
                 * Handle the event fired when the mouse cursor hovers on the wrapped element. Change the mouse cursor to a
                 * hand which indicates draggable when the wrapped element is set to be draggable.
                 *
                 * @author Huan Li
                 * @param {Event} event The event fired when the mouse cursor hovers on the wrapped element.
                 */
                handleMouseOverDragWrappee = function (event) {
                    if (_bDraggable) {
                        dWrappee.addClass(cssClasses.cursorMove);
                    }
                },
                /**
                 * Handle the vent fired when the scroll bars are dragged back and forth so the wrapped element will move as
                 * the scroll bars are dragged around.
                 *
                 * @author Huan Li
                 * @param {Event} event The event fired when the mouse is down when the cursor hovers on the scroll bars.
                 */
                handleStartDragScrollBars = function (event) {
                    var oldX = getXCoordinate(event), oldY = getYCoordinate(event);
                    event.preventDefault();
                    /**
                     * Handle the event fired when the mouse moves while the mouse is dragging the scroll bars.
                     *
                     * @author Huan Li
                     * @param {Event} evt
                     */
                    handleMoveDragScrollBars = function (evt) {

                    };
                    $(document).mousemove(handleMoveDragScrollBars);
                    $(document).mouseup(handleEndDragScrollBars);
                },
                /**
                 * Handle the event fired when the left button of the mouse is held down on the resize knob. Also register an
                 * event handler to handle the move of the mouse when the left button is held down on the resize knob so that
                 * the wrapper element is resized as the mouse cursor moves. Finally unregister the event handler when the
                 * left button of the mouse is released.
                 *
                 * @author Huan Li
                 * @param {Event} evt The event fired when the left button of the mouse is held down on the resize knob.
                 */
                handleStartDragToResize = function (evt) {
                    var oldX = getXCoordinate(evt), oldY = getYCoordinate(evt);
                    evt.preventDefault();
                    bResizing = true;
                    /**
                     * Handle the event fired when the mouse moves while the left button is held down on the resize knob so
                     * that the wrapper element is resized as the mouse moves.
                     *
                     * This function was declared outside the "handleStartDragToResize" function because it needs to be
                     * called by other functions which are at the same level as the "handleStartDragToResize" function is,
                     * and is implemented here because it needs the x and y coordinates which can only be obtained inside the
                     * "handleStartDragToResize" function.
                     *
                     * @author Huan Li
                     * @param {Event} event The event fired when the mouse moves while the left button has been keeping held
                     * down on the resize knob.
                     */
                    handleMoveDragToResize = function (event) {
                        event.preventDefault();
                        resizeWrapper({
                            x: getXCoordinate(event) - oldX,
                            y: getYCoordinate(event) - oldY
                        });
                        oldX = getXCoordinate(event);
                        oldY = getYCoordinate(event);
                    };
                    $(document).mousemove(handleMoveDragToResize);
                    $(document).mouseup(handleEndDragToResize);
                },
                /**
                 * Handle the event fired when the left button of the mouse is held down on the wrapped element. Also
                 * register an event handler to handle the move of the mouse when the left button is held down on the wrapped
                 * element so that the wrapped element can move as the mouse moves. Finally unregister the event handler when
                 * the left button of the mouse is released.
                 *
                 * @author Huan Li
                 * @param {Event} evt The event fired when the left button of the mouse is held down on the wrapped element.
                 */
                handleStartDragWrappee = function (evt) {
                    var timer;
                    evt.preventDefault();
                    bDraggingWrappee = true;
                    if (noTransform()) {
                        dWrappee.css({
                            left: dWrappee.position().left,
                            top: dWrappee.position().top
                        });
                    } else {
                        dWrappee.css('transform', toTransformString(parseTransform(dWrappee.css('transform'))));
                    }
                    removeTransition();
                    if (_bAutoHide) {
                        unobserveScrollBarsVisibility();
                    }
                    /**
                     * Handle the event fired when the mouse moves while the left button is held down on the wrapped element
                     * so that the wrapped element can move as the mouse moves.
                     *
                     * This function was declared outside the "handleStartDragWrappee" function because it needs to be called
                     * by other functions which are at the same level as the "handleStartDragWrappee" function is, and is
                     * implemented here because it needs the x and y coordinates which can only be obtained inside the
                     * "handleStartDragWrappee" function.
                     *
                     * @author Huan Li
                     * @param {Object} oPosition The x and y coordinates of the mouse cursor when the left button of the
                     * mouse is held down on the wrapped element.
                     * @param {Event} event The event fired when the mouse moves while the left button has been keeping held
                     * down on the wrapped element.
                     */
                    handleMoveDragWrappee = (function (oPosition, event) {
                        timer = new Date().getTime();
                        event.preventDefault();
                        dragWrappee({
                            x: getXCoordinate(event) - oPosition.x,
                            y: getYCoordinate(event) - oPosition.y
                        });
                        oPosition.x = getXCoordinate(event);
                        oPosition.y = getYCoordinate(event);
                    }).bind(null, {
                            x: getXCoordinate(evt),
                            y: getYCoordinate(evt)
                        });
                    /**
                     * Handle the event fired when the left button of the mouse is released after dragging the wrapped
                     * element so as to stop the wrapped element moving as the mouse cursor moves.
                     *
                     * @author Huan Li
                     * @param {Object} oStartPoint
                     * @param {Event} event The event fired when the left button of the mouse is released after dragging the
                     * wrapped element.
                     */
                    handleEndDragWrappee = (function (oStartPoint, event) {
                        if (bDraggingWrappee) {
                            var oEndPoint = {
                                x: getXCoordinate(event),
                                y: getYCoordinate(event),
                                time: (new Date()).getTime()
                            };
                            bDraggingWrappee = false;
                            $(document).off(getEventSubject(KScroll.EVENT_TYPE_MOVE), handleMoveDragWrappee);
                            $(document).off(getEventSubject(KScroll.EVENT_TYPE_END), handleEndDragWrappee);
                            if (_bAutoHide) {
                                observeScrollBarsVisibility();
                                if (!bMouseIn) {
                                    hideScrollBars();
                                }
                            }
                            if (_bPageMode) {
                                if (new Date().getTime() - timer > KScroll.END_DRAG_TIMEOUT) {
                                    scrollByPage();
                                } else {
                                    scrollOnePage({
                                        left: oStartPoint.x === oEndPoint.x ? 0 : (oStartPoint.x > oEndPoint.x),
                                        up: oStartPoint.y === oEndPoint.y ? 0 : (oStartPoint.y > oEndPoint.y)
                                    });
                                }
                            } else {
                                if (new Date().getTime() - timer > KScroll.END_DRAG_TIMEOUT) {
                                    if (_bSmooth) {
                                        resumeTransition4Scroll();
                                    } else {
                                        removeTransition();
                                    }
                                } else {
                                    if (_bGlideable) {
                                        glide(oStartPoint, oEndPoint);
                                    }
                                }
                            }
                        }
                    }).bind(null, {
                            x: getXCoordinate(evt),
                            y: getYCoordinate(evt),
                            time: new Date().getTime()
                        });
                    $(document).on(getEventSubject(KScroll.EVENT_TYPE_MOVE), handleMoveDragWrappee);
                    $(document).on(getEventSubject(KScroll.EVENT_TYPE_END), handleEndDragWrappee);
                },
                /**
                 * Handle the event fired when a CSS transition ends.
                 *
                 * @author Huan Li
                 */
                handleTransitionEnd = function (event) {
                    if (_bSmooth) {
                        resumeTransition4Scroll();
                    } else {
                        removeTransition();
                    }
                },
                /**
                 * Move the horizontal bar to a distance as long as nXMovement because of user triggered events, either
                 * dragging the scroll bar or scrolling the mouse wheel. Then move the wrapped element accordingly based on
                 * how much the scroll bar has moved.
                 *
                 * @author Huan Li
                 * @param {Number} nXMovement How much the horizontal scroll bar has moved.
                 */
                hBarDrivesWrappee = function (nXMovement) {
                    var nHRatio = getHorizontalMovementRatio();
                    moveHBar(nXMovement);
                    moveWrappee(keepWrappeeInBound({
                        x: -nXMovement * nHRatio,
                        y: 0
                    }));
                },
                /**
                 * Hide the scroll bars based on the configurations.
                 *
                 * @author Huan Li
                 */
                hideScrollBars = function () {
                    timeoutVisibility = window.setTimeout(function () {
                        if (shouldShowHorizontalScrollBar()) {
                            dHScrollBar.fadeOut('fast');
                        }
                        if (shouldShowVerticalScrollBar()) {
                            dVScrollBar.fadeOut('fast');
                        }
                        if ((shouldShowHorizontalScrollBar() && shouldShowVerticalScrollBar()) || _bResizeable) {
                            oResizeKnob.fadeOut('fast');
                        }
                        timeoutVisibility = null;
                    }, KScroll.TIMEOUT_SCROLL_BARS_VISIBILITY);
                },
                /**
                 * Initialize the scroll bars on the web page.
                 *
                 * @author Huan Li
                 */
                initialize = function () {
                    setInstanceCount();
                    wrap();
                    observeMouseHoversWrapper();
                    observeDragScrollBars();
                    if (_bAutoHide) {
                        observeScrollBarsVisibility();
                    } else {
                        showScrollBars();
                    }
                    if (_bScrollableByMouseWheel) {
                        observeMouseWheel();
                    }
                    if (_bDraggable) {
                        observeDragWrappee();
                    }
                    if (_bScrollableByArrowKeys) {
                        observeArrowKeys();
                    }
                    if (_bResizeable) {
                        observeDragToResize();
                    }
                    if (_bSmooth) {
                        addTransition4Scroll();
                    }
                    observeTransitionEnd();
                    //prepareCustomEventHandlers();
                },
                /**
                 * Tell if the browser that's displaying the web page is on a touchable device.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the device is touchable. False otherwise.
                 */
                isTouchable = function () {
                    return typeof window.ontouchstart !== 'undefined';
                },
                /**
                 * Tell if the wrapped element's left or right border is moved into the visible part of the wrapper element.
                 * Because the visible part of the wrapper element, which is the part inside the rectangle of the wrapper
                 * element, is supposed to show only the content of the wrapped element. So either the left or the right
                 * border of the wrapped element must not be moved inside the visible part of the wrapper element.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the wrapped element is out of bounds horizontally. False otherwise.
                 */
                isWrappeeOutOfBoundsHorizontally = function () {
                    var ret = false;
                    if (noTransform()) {
                        if (Math.abs(dWrappee.left) + dWrapper.width() > dWrappee.outerWidth(true)) {
                            ret = true;
                        }
                    } else {
                        if (Math.abs(parseTransform(dWrappee.css('transform')).x) + dWrapper.width() >
                            dWrappee.outerWidth(true)) {
                            ret = true;
                        }
                    }
                    return ret;
                },
                /**
                 * Tell if the wrapped element's top or bottom border is moved into the visible part of the wrapper element.
                 * Because the visible part of the wrapper element, which is the part inside the rectangle of the wrapper
                 * element, is supposed to show only the content of the wrapped element. So either the top or the bottom
                 * border of the wrapped element must not be moved inside the visible part of the wrapper element.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the wrapped element is out of bounds vertically. False otherwise.
                 */
                isWrappeeOutOfBoundsVertically = function () {
                    var ret = false;
                    if (noTransform()) {
                        if (Math.abs(dWrappee.top) + dWrapper.height() > dWrappee.outerHeight(true)) {
                            ret = true;
                        }
                    } else {
                        if (Math.abs(parseTransform(dWrappee.css('transform')).y) + dWrapper.height() >
                            dWrappee.outerHeight(true)) {
                            ret = true;
                        }
                    }
                    return ret;
                },
                /**
                 * Keep one of the bars inside the visible part of its parent scroll bar track, which is the round-cornered
                 * rectangle of the scroll bar.
                 *
                 * @author Huan Li
                 * @param {jQuery} oBar The bar that's going to be moved.
                 * @param {Object} oMovement A key-value pair object containing the movement, which is supposedly going to
                 *          be made to one of the bars, along the X and the Y axes.
                 * @returns {Object} A key-value pair object containing the movement, which is actually going to be made to
                 *          one of the bars, along the X and the Y axes.
                 */
                keepBarInBound = function (oBar, oMovement) {
                    var ret, oTransform;
                    if (_nHowToMove === KScroll.MOVE_BY_POSITION) {
                        ret = calcBarBound(oBar, {
                            x: oBar.position().left,
                            y: oBar.position().top
                        }, oMovement);
                    } else {
                        oTransform = parseTransform(oBar.css('transform'));
                        ret = calcBarBound(oBar, oTransform, oMovement);
                    }
                    return ret;
                },
                /**
                 * Keep the numbers of pages in the range of the total page numbers both horizontally and vertically. If the
                 * number is out of bounds it'll be changed to the biggest page number. Otherwise it's left untouched.
                 *
                 * @author Huan Li
                 * @param {Object} oPageCount A key-value pair object containing the numbers of pages which are going to be
                 * tested for out-of-bounds exceptions.
                 * @returns {Object} A key-value pair object containing the numbers of pages which are tested to be in the
                 * range of the total page numbers.
                 */
                keepPageCountInBound = function (oPageCount) {
                    var ret = oPageCount, oCurrentPageNumber = calcPageNumber(), oTotalPageCount = calcTotalPageCount();
                    ret.x = ret.x > 0 ? Math.min(ret.x, oTotalPageCount.x -
                    oCurrentPageNumber.x) : Math.max(ret.x, -(oCurrentPageNumber.x));
                    ret.y = ret.y > 0 ? Math.min(ret.y, oTotalPageCount.y -
                    oCurrentPageNumber.y) : Math.max(ret.y, -(oCurrentPageNumber.y));
                    return ret;
                },
                /**
                 * Keep the wrapped element's content inside the visible part, which is the part inside the rectangle, of the
                 * wrapper element.
                 *
                 * @author Huan Li
                 * @param {Object} oMovement A key-value pair object containing the movement, which is supposedly going to
                 * be made to the wrapped element, along the X and the Y axes.
                 * @returns {Object} A key-value pair object containing the movement, which is actually going to be made to
                 * the wrapped element, along the X and the Y axes.
                 */
                keepWrappeeInBound = function (oMovement) {
                    var ret, oTransform;
                    if (noTransform()) {
                        ret = calcWrappeeBound({
                            x: dWrappee.position().left,
                            y: dWrappee.position().top
                        }, oMovement);
                    } else {
                        oTransform = parseTransform(dWrappee.css('transform'));
                        ret = calcWrappeeBound(oTransform, oMovement);
                    }
                    return ret;
                },
                /**
                 * Move a target element by changing its CSS position properties which are normally the "left" and the "top".
                 *
                 * @author Huan Li
                 * @param {jQuery} oTarget The target element that's going to be moved.
                 * @param {Object} oMovement A key-value pair object containing the movement along the X and the Y axes.
                 */
                moveByPosition = function (oTarget, oMovement) {
                    if (oMovement.x !== 0 || oMovement.y !== 0) {
                        var newLeft = oTarget.position().left + oMovement.x,
                            newTop = oTarget.position().top + oMovement.y,
                            oNewPosition = {
                                left: newLeft,
                                top: newTop
                            };
                        oTarget.css(oNewPosition);
                    }
                },
                /**
                 * Move a target element by changing its CSS "transform" property, which is introduced in CSS3.
                 *
                 * @author Huan Li
                 * @param {Object} oTarget The target element that's going to be moved.
                 * @param {Object} oMovement A key-value pair object containing the movement along the X and the Y axes.
                 */
                moveByTransform = function (oTarget, oMovement) {
                    if (oMovement.x !== 0 || oMovement.y !== 0) {
                        var oTransform = parseTransform(oTarget.css('transform'));
                        oTransform.x += parseFloat(oMovement.x);
                        oTransform.y += parseFloat(oMovement.y);
                        oTarget.css('transform', toTransformString(oTransform));
                    }
                },
                /**
                 * Move the horizontal bar.
                 *
                 * @author Huan Li
                 * @param {Number} nXMovement How much the horizontal bar is going to be moved along the X axis.
                 */
                moveHBar = function (nXMovement) {
                    var _oMovement = keepBarInBound(dHBar, {
                        x: nXMovement,
                        y: 0
                    });
                    if (_nHowToMove === KScroll.MOVE_BY_POSITION) {
                        moveByPosition(dHBar, _oMovement);
                    } else {
                        moveByTransform(dHBar, _oMovement);
                    }
                },
                /**
                 * Move the vertical bar.
                 *
                 * @author Huan Li
                 * @param {Number} nYMovement How much the vertical bar is going to be moved along the Y axis.
                 */
                moveVBar = function (nYMovement) {
                    var _oMovement = keepBarInBound(dVBar, {
                        x: 0,
                        y: nYMovement
                    });
                    if (_nHowToMove === KScroll.MOVE_BY_POSITION) {
                        moveByPosition(dVBar, _oMovement);
                    } else {
                        moveByTransform(dVBar, _oMovement);
                    }
                },
                /**
                 * Move the wrapped element.
                 *
                 * @author Huan Li
                 * @param {Object} oMovement A key-value pair object containing the movement, which is going to be made to
                 * the wrapped element, along the X and the Y axes.
                 * @param {String} sTriggerAction A string describing the action which has triggered the scroll.
                 */
                moveWrappee = function (oMovement, sTriggerAction) {
                    if (!_bHorizontalScrollable) {
                        oMovement.x = 0;
                    }
                    if (!_bVerticalScrollable) {
                        oMovement.y = 0;
                    }
                    if (noTransform()) {
                        moveByPosition(dWrappee, oMovement);
                    } else {
                        moveByTransform(dWrappee, oMovement);
                    }
                    /**
                     * In order to let the rendering finish first
                     * these event handler invocations are put into a setTimeout.
                     */
                    window.setTimeout(function () {
                        if (oMovement.x !== 0 || oMovement.y !== 0) {
                            fireScrolled(oMovement, sTriggerAction);
                        }
                        if (bTopEndReached) {
                            fireTopEndReached(oMovement);
                        }
                        if (bRightEndReached) {
                            fireRightEndReached(oMovement);
                        }
                        if (bBottomEndReached) {
                            fireBottomEndReached(oMovement);
                        }
                        if (bLeftEndReached) {
                            fireLeftEndReached(oMovement);
                        }
                        if (bTopEndReached || bRightEndReached || bBottomEndReached || bLeftEndReached) {
                            fireEndReached(oMovement);
                            bTopEndReached = bRightEndReached = bBottomEndReached = bLeftEndReached = false;
                        }
                    });
                },
                /**
                 * Tell if the CSS "transform" property is used to do the movement.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the CSS "transform" property is not used, which means the CSS properties "left"
                 * and "top" are used. False otherwise.
                 */
                noTransform = function () {
                    return _nHowToMove === KScroll.MOVE_BY_POSITION;
                },
                /**
                 * Register an event handler to handle the pressing of arrow keys. The wrapped element will be scrolled when
                 * an arrow key is pressed.
                 *
                 * @author Huan Li
                 */
                observeArrowKeys = function () {
                    $(document).on('keydown', handleArrowKeysDown);
                },
                /**
                 * Register event handlers to handler the dragging action on the scroll bars. The wrapped element will be
                 * scrolled as the scroll bars are dragged around.
                 */
                observeDragScrollBars = function () {
                    if (_bVerticalScrollable) {
                        observeDragVBar();
                    }
                    if (_bHorizontalScrollable) {
                        observeDragHBar();
                    }
                },
                /**
                 * Register event handlers to handle the dragging action on the horizontal bar so that it moves as the mouse
                 * moves if the left button of the mouse is being held down on the horizontal bar. Finally unregister the
                 * event
                 * handlers which were just registered when the left button of the mouse is released.
                 *
                 * @author Huan Li
                 */
                observeDragHBar = function () {
                    dHBar.mousedown(function (evt) {
                        evt.preventDefault();
                        bDraggingScrollBar = true;
                        if (_bSmooth) {
                            removeTransition();
                        }
                        if (_bAutoHide) {
                            unobserveScrollBarsVisibility();
                        }
                        /**
                         * Handle the event fired when the mouse moves while the left button is held down on the horizontal
                         * bar so that
                         * the horizontal bar can move as the mouse moves.
                         *
                         * This function was declared outside the horizontal bar's mousedown event's handler because it needs
                         * to be
                         * called by other functions which are at the same level as the "observeHScrollBarMove" function is,
                         * and is
                         * implemented here because it needs the x and y coordinates which can only be obtained inside the
                         * horizontal
                         * bar's mousedown event's handler.
                         *
                         * @author Huan Li
                         * @param {Object} oPosition The x and y coordinates of the mouse cursor when the left button of
                         * the mouse is
                         *          held down on the horizontal bar.
                         * @param {Event} event The event fired when the mouse moves while the left button has been keeping
                         * held down
                         *          on the horizontal bar.
                         */
                        handleMoveDragHBar = (function (oPosition, event) {
                            event.preventDefault();
                            dragScrollBar(dHBar, {
                                x: event.pageX - oPosition.x,
                                y: 0
                            });
                            oPosition.x = event.pageX;
                        }).bind(null, {
                                x: evt.pageX
                            });
                        $(document).mousemove(handleMoveDragHBar);
                        $(document).mouseup(handleEndDragHBar);
                    });
                },
                /**
                 * Register an event handler to handle the dragging action on the vertical bar so that it moves as the mouse
                 * cursor moves if the left button of the mouse is being held down on the vertical bar. And unregister the
                 * event handlers which were just registered when the left button of the mouse is released.
                 *
                 * @author Huan Li
                 */
                observeDragVBar = function () {
                    dVBar.mousedown(function (evt) {
                        evt.preventDefault();
                        bDraggingScrollBar = true;
                        if (_bSmooth) {
                            removeTransition();
                        }
                        if (_bAutoHide) {
                            unobserveScrollBarsVisibility();
                        }
                        /**
                         * Handle the event fired when the mouse moves while the left button is held down on the vertical bar
                         * so that the vertical bar can move as the mouse moves.
                         *
                         * This function was declared outside the vertical bar's mousedown event's handler because it needs
                         * to be
                         * called by other functions which are at the same level as the "observeHScrollBarMove" function is,
                         * and is
                         * implemented here because it needs the x and y coordinates which can only be obtained inside the
                         * vertical
                         * bar's mousedown event's handler.
                         *
                         * @author Huan Li
                         * @param {Object} oPosition The x and y coordinates of the mouse cursor when the left button of
                         * the mouse is
                         *          held down on the vertical bar.
                         * @param {Event} event The event fired when the mouse moves while the left button has been keeping
                         * held down
                         *          on the vertical bar.
                         */
                        handleMoveDragVBar = (function (oPosition, event) {
                            event.preventDefault();
                            dragScrollBar(dVBar, {
                                x: 0,
                                y: event.pageY - oPosition.y
                            });
                            oPosition.y = event.pageY;
                        }).bind(null, {
                                y: evt.pageY
                            });
                        $(document).mousemove(handleMoveDragVBar);
                        $(document).mouseup(handleEndDragVBar);
                    });
                },
                /**
                 * Register event handlers to handle the dragging action on the resize knob so that the wrapper element is
                 * resized as the mouse cursor moves if the left button of the mouse is being held down on the resize knob.
                 *
                 * @author Huan Li
                 */
                observeDragToResize = function () {
                    oResizeKnob.addClass(cssClasses.cursorSeResize).mousedown(handleStartDragToResize);
                },
                /**
                 * Register event handlers to handle the dragging action on the wrapped element so that it moves as the mouse
                 * cursor moves if the left button of the mouse is being held down on the wrapped element. And unregister the
                 * event handlers which were just registered when the left button of the mouse is released.
                 *
                 * @author Huan Li
                 */
                observeDragWrappee = function () {
                    dWrappee.addClass(cssClasses.noUserSelect).on(KScroll.EVENT_MOUSE_OVER, handleMouseOverDragWrappee).on(getEventSubject(KScroll.EVENT_TYPE_START), handleStartDragWrappee);
                },
                /**
                 * Register event handlers to handle the mouse cursor entering and leaving the wrapper element so that at any
                 * given time whether the mouse cursor if inside the wrapper element or not is known.
                 *
                 * @author Huan Li
                 */
                observeMouseHoversWrapper = function () {
                    $(dWrapper).on({
                        mouseenter: function (evt) {
                            if (bMouseIn !== true) {
                                bMouseIn = true;
                            }
                        },
                        mouseleave: function (evt) {
                            if (bMouseIn !== 'false') {
                                bMouseIn = false;
                            }
                        }
                    });
                },
                /**
                 * Register event handlers to handle the rolling of the mouse wheel so that the wrapped element scrolls as
                 * the mouse wheel rolls if it's inside the wrapper element's visible part which is the part inside the
                 * rectangle of the wrapper element.
                 *
                 * @author Huan Li
                 */
                observeMouseWheel = function () {
                    /**
                     * Some browsers fire "wheel" event and some fire "mousewheel" event so here I make it listen to both
                     * events.
                     */
                    dWrapper.on('wheel mousewheel', function (e) {
                        var originalEvent = e.originalEvent,
                            deltaX = originalEvent.wheelDeltaX || -originalEvent.deltaX || 0,
                            deltaY = originalEvent.wheelDeltaY || -originalEvent.deltaY || 0;
                        if (originalEvent.deltaMode === 1) {
                            deltaX = deltaX * KScroll.SHIFTING_BY_SCROLL;
                            deltaY = deltaY * KScroll.SHIFTING_BY_SCROLL;
                        }
                        scroll({
                            x: deltaX || 0,
                            y: deltaY || 0
                        });
                    });
                },
                /**
                 * Register an event handler to show and hide the scroll bars according to the configurations as the mouse
                 * cursor moves in and out of the wrapper element.
                 *
                 * @author Huan Li
                 */
                observeScrollBarsVisibility = function () {
                    dWrapper.on({
                        mouseenter: handleMouseEnterScrollBarsVisibility,
                        mouseleave: handleMouseLeaveScrollBarsVisibility
                    });
                },
                /**
                 * Register and event handler to do something when a CSS transition ends.
                 *
                 * @author Huan Li
                 */
                observeTransitionEnd = function () {
                    dWrapper.on('transitionend webkitTransitionEnd oTransitionEnd msTransitionEnd', handleTransitionEnd);
                },
                /**
                 * Get the arguments of the matrix function of the CSS property "transform" and save them as key-value pairs
                 * in an object. If any of the arguments could not be parsed successfully a default value will be used
                 * instead. The default values for all arguments are {a: 1, b: 0, c: 0, d: 1, x: 0, y: 0}.
                 *
                 * @author Huan Li
                 * @param {String} sTransform The original string value of the CSS property "transform" obtained from by
                 * the native window.getComputedStyle() function or the jQuery's $.css() function.
                 * @returns {Object} A key-value pair object containing the the arguments of the transform's matrix function.
                 */
                parseTransform = function (sTransform) {
                    var oTransform = {
                        a: 1,
                        b: 0,
                        c: 0,
                        d: 1,
                        x: 0,
                        y: 0
                    }, aResults;
                    if (typeof sTransform === 'string') {
                        aResults = sTransform.split(/\(|\)/);
                        if (aResults.length > 1) {
                            aResults = aResults[1].split(/\s*,\s*/);
                            if (aResults.length === 6) {
                                oTransform.a = parseFloat(aResults[0], 10);
                                oTransform.b = parseFloat(aResults[1], 10);
                                oTransform.c = parseFloat(aResults[2], 10);
                                oTransform.d = parseFloat(aResults[3], 10);
                                oTransform.x = parseFloat(aResults[4], 10);
                                oTransform.y = parseFloat(aResults[5], 10);
                            }
                        }
                    }
                    return oTransform;
                },
                /**
                 * Put the horizontal bar in a proper position inside its parent scroll bar. Its size and position are
                 * recalculated.
                 *
                 * @author Huan Li
                 */
                positionHBar = function () {
                    dHBar.width(calcHBarWidth());
                    var nPosition = calcHBarPosition(), oTransform = parseTransform(dHBar.css('transform'));
                    if (noTransform()) {
                        dHBar.css('left', nPosition);
                    } else {
                        oTransform.x = nPosition;
                        dHBar.css('transform', toTransformString(oTransform));
                    }
                    if (typeof _sScrollBarColor === 'string') {
                        dHBar.css('backgroundColor', _sScrollBarColor);
                    }
                },
                /**
                 * Put the vertical bar in a proper position inside its parent scroll bar. Its size and position will be
                 * recalculated.
                 *
                 * @author Huan Li
                 */
                positionVBar = function () {
                    dVBar.height(calcVBarHeight());
                    var nPosition = calcVBarPosition(), oTransform = parseTransform(dVBar.css('transform'));
                    if (noTransform()) {
                        dVBar.css('top', nPosition);
                    } else {
                        oTransform.y = nPosition;
                        dVBar.css('transform', toTransformString(oTransform));
                    }
                    if (typeof _sScrollBarColor === 'string') {
                        dVBar.css('backgroundColor', _sScrollBarColor);
                    }
                },
                /**
                 * Add the event handlers which are specified by the values in the configuration object.
                 *
                 * @author Huan Li
                 */
                prepareCustomEventHandlers = function () {
                    var sEventSubject;
                    for (sEventSubject in _oEventHandlers) {
                        if (typeof _oEventHandlers[sEventSubject] === 'function') {
                            registerCustomEventHandler(sEventSubject, _oEventHandlers[sEventSubject]);
                        }
                    }
                },
                /**
                 * Register a event handler for a custom event.
                 *
                 * @author Huan Li
                 * @param {String} sEventType The event subject.
                 * @param {Function} fctEventHandler The event handler function.
                 */
                registerCustomEventHandler = function (sEventSubject, fctEventHandler) {
                    _this['on' + capitalizeInitial(sEventSubject)] = fctEventHandler;
                },
                /**
                 * Remove the CSS "transition" property from the wrapped element and the scroll bars.
                 *
                 * @author Huan Li
                 */
                removeTransition = function () {
                    $([dWrappee, dHBar, dVBar]).each(function (index, item) {
                        $(item).css('transition', 'none');
                    });
                },
                /**
                 * Render both bars. Setting the dimension and position of the bars.
                 *
                 * @author Huan Li
                 */
                renderBars = function () {
                    positionHBar();
                    positionVBar();
                },
                /**
                 * Render both scroll bars by setting the styles to them and the bars inside them.
                 *
                 * @author Huan Li
                 */
                renderScrollBars = function () {
                    if (shouldShowHorizontalScrollBar()) {
                        dHScrollBar.css({
                            bottom: 0,
                            left: 0,
                            width: dWrapper.width() - getVScrollBarWidth()
                        });
                    }
                    if (shouldShowVerticalScrollBar()) {
                        dVScrollBar.css({
                            height: dWrapper.height() - getHScrollBarHeight(),
                            right: 0,
                            top: 0
                        });
                    }
                    renderBars();
                },
                /**
                 * Resize the wrapper element.
                 *
                 * @author Huan Li
                 * @param {Object} oMovement A key-value pair object containing the movement of the mouse cursor along the
                 * X and Y axes.
                 */
                resizeWrapper = function (oMovement) {
                    var nHeight = dWrapper.height() + oMovement.y,
                        nWidth = dWrapper.width() + oMovement.x;
                    if (nHeight < _nMinHeight) {
                        nHeight = _nMinHeight;
                    } else if (nHeight > _nMaxHeight) {
                        nHeight = _nMaxHeight;
                    }
                    if (nWidth < _nMinWidth) {
                        nWidth = _nMinWidth;
                    } else if (nWidth > _nMaxWidth) {
                        nWidth = _nMaxWidth;
                    }
                    dWrapper.css({
                        height: nHeight,
                        width: nWidth
                    });

                    /* Take care of the visibility of the scroll bars */
                    if (!shouldShowHorizontalScrollBar()) {
                        dHScrollBar.fadeOut('fast');
                    } else {
                        dHScrollBar.fadeIn('fast');
                    }
                    if (!shouldShowVerticalScrollBar()) {
                        dVScrollBar.fadeOut('fast');
                    } else {
                        dVScrollBar.fadeIn('fast');
                    }

                    /* Start taking care of the positioning of the wrapped element */
                    reviseWrappeePosition();
                    /* End taking care of the positioning of the wrapped element */

                    /* Resize and reposition the scroll bars */
                    renderScrollBars();
                },
                /**
                 * Re-grant the possession of the CSS "transition" property to the wrapped element and the scroll bars.
                 *
                 * @author Huan Li
                 */
                resumeTransition4Scroll = function () {
                    addTransition4Scroll();
                },
                /**
                 * Check to see if the position of the wrapped element is out of the range of the wrapper element. If so move it
                 * back in the range.
                 *
                 * @author Huan Li
                 */
                reviseWrappeePosition = function () {
                    var oCoordinates = {x: 0, y: 0},
                        oWrappeeMovement = {x: 0, y: 0};
                    if (noTransform()) {
                        oCoordinates = {
                            x: dWrappee.position().left,
                            y: dWrappee.position().top
                        };
                    } else {
                        oCoordinates = parseTransform(dWrappee.css('transform'));
                    }

                    if (oCoordinates.x !== 0 || oCoordinates.y !== 0) {
                        if (dWrappee.outerHeight(true) <= dWrapper.height()) {
                            oWrappeeMovement.y = 0 - oCoordinates.y;
                        } else {
                            if (oCoordinates.y > 0) {
                                oWrappeeMovement.y = 0 - oCoordinates.y;
                            } else if (oCoordinates.y < dWrappee.outerHeight(true) - dWrapper.height()) {
                                oWrappeeMovement.y = dWrappee.outerHeight(true) - dWrapper.height();
                            }
                        }

                        if (dWrappee.outerWidth(true) <= dWrapper.width()) {
                            oWrappeeMovement.x = 0 - oCoordinates.x;
                        } else {
                            if (oCoordinates.x > 0) {
                                oWrappeeMovement.x = 0 - oCoordinates.x;
                            } else if (oCoordinates.x < dWrappee.outerWidth(true) - dWrapper.width()) {
                                oWrappeeMovement.x = dWrappee.outerWidth(true) - dWrapper.width();
                            }
                        }

                        if (oWrappeeMovement.x !== 0 || oWrappeeMovement.y !== 0) {
                            moveWrappee(oWrappeeMovement);
                        }
                    }
                },
                /**
                 * Move the wrapped element based on how much the mouse wheel has been scrolled.
                 *
                 * @author Huan Li
                 * @param {Object} oDelta A key-value pair object containing how much the mouse wheel has been scrolled
                 * along the X, the Y and the Z axes.
                 */
                scroll = function (oDelta) {
                    if (_bFlipXY) {
                        var temp = oDelta.x;
                        oDelta.x = oDelta.y;
                        oDelta.y = temp;
                    }
                    wrappeeDrivesBars(oDelta, KScroll.MOVEMENT_TRIGGER_ACTION_MOUSE_WHEEL);
                },
                /**
                 * Move the wrapped element by pages instead of by random distance. This means that the distance every time
                 * the wrapped element is moved is a multiple of the size of a single page.
                 *
                 * @author Huan Li
                 */
                scrollByPage = function () {
                    var oShiftInOnePage = shiftWithInOnePage(), oPageSize = {
                        x: dWrapper.width(),
                        y: dWrapper.height()
                    }, oShiftMoreThanHalfPage = {
                        x: oShiftInOnePage.x > oPageSize.x / 2,
                        y: oShiftInOnePage.y > oPageSize.y / 2
                    }, oMovement = {
                        x: 0,
                        y: 0
                    };
                    if (oShiftMoreThanHalfPage.x) {
                        oMovement.x = -(oPageSize.x - oShiftInOnePage.x);
                    } else {
                        oMovement.x = oShiftInOnePage.x;
                    }
                    if (oShiftMoreThanHalfPage.y) {
                        oMovement.y = -(oPageSize.y - oShiftInOnePage.y);
                    } else {
                        oMovement.y = oShiftInOnePage.y;
                    }
                    addTransition4PageScroll();
                    scrollOnce(oMovement);
                },
                /**
                 * Scroll down the wrapped element for a amount of distance which is specified by "nMovement".
                 *
                 * @author Huan Li
                 * @param {Number} nMovement The amount of distance the wrapped element is supposed to be moved.
                 */
                scrollDown = function (nMovement) {
                    scrollOnce({
                        x: 0,
                        y: -1 * (parseFloat(nMovement, 10) || 0)
                    });
                },
                /**
                 * Scroll the wrapped element to the left for a amount of distance which is specified by "nMovement".
                 *
                 * @author Huan Li
                 * @param {Number} nMovement The amount of distance the wrapped element is supposed to be moved.
                 */
                scrollLeft = function (nMovement) {
                    scrollOnce({
                        x: parseFloat(nMovement) || 0,
                        y: 0
                    });
                },
                /**
                 * Scroll a specified amount distance at one time.
                 *
                 * @author Huan Li
                 * @param {Object} oMovement A key-value pair object containing the movement, which is going to be made to
                 * the wrapped element, along the X and the Y axes.
                 */
                scrollOnce = function (oMovement) {
                    showScrollBars();
                    addTransition4Scroll(true);
                    wrappeeDrivesBars(oMovement, KScroll.MOVEMENT_TRIGGER_ACTION_PROGRAM);
                    if (!bMouseIn) {
                        hideScrollBars();
                    }
                },
                /**
                 * Scroll the wrapped element by one page.
                 *
                 * @author Huan Li
                 * @param {String} oScrollDirection A key-value pair object containing the boolean values which indicate
                 * the directions of the scroll both horizontally and vertically.
                 */
                scrollOnePage = function (oScrollDirection) {
                    scrollPages({
                        x: oScrollDirection.left === 0 ? 0 : (oScrollDirection.left ? -1 : 1),
                        y: oScrollDirection.up === 0 ? 0 : (oScrollDirection.y ? -1 : 1)
                    });
                },
                /**
                 * Scroll the wrapped element by the number of pages which is specified by the parameter. If the parameter is
                 * omitted nothing will be done.
                 *
                 * @author Huan Li
                 * @param {Number} oPageCount A key-value pair object containing the numbers of pages to scroll both
                 * horizontally and vertically.
                 */
                scrollPages = function (oPageCount) {
                    if (oPageCount && (( typeof oPageCount.x === 'number' && oPageCount.x !== 0) ||
                        ( typeof oPageCount.y === 'number' && oPageCount.y !== 0))) {
                        var oMovement = {
                            x: 0,
                            y: 0
                        }, oPageSize = {
                            x: dWrapper.width(),
                            y: dWrapper.height()
                        }, oShiftWithInOnePage = shiftWithInOnePage(), oNewPageCount = keepPageCountInBound(oPageCount);
                        if (oPageCount.x > 0) {
                            oMovement.x = (oNewPageCount.x - 1) * oPageSize.x + oShiftWithInOnePage.x;
                        } else if (oPageCount.x < 0) {
                            oMovement.x = (oNewPageCount.x + 1) * oPageSize.x + (oShiftWithInOnePage.x - oPageSize.x);
                        }
                        if (oPageCount.y > 0) {
                            oMovement.y = (oNewPageCount.y - 1) * oPageSize.y + oShiftWithInOnePage.y;
                        } else if (oPageCount.y < 0) {
                            oMovement.y = (oNewPageCount.y + 1) * oPageSize.y + (oShiftWithInOnePage.y - oPageSize.y);
                        }
                        scrollOnce(oMovement);
                    }
                },
                /**
                 * Scroll the wrapped element to the right for a amount of distance which is specified by "nMovement".
                 *
                 * @author Huan Li
                 * @param {Number} nMovement The amount of distance the wrapped element is supposed to be moved.
                 */
                scrollRight = function (nMovement) {
                    scrollOnce({
                        x: -1 * parseFloat(nMovement) || 0,
                        y: 0
                    });
                },
                /**
                 * Scroll the wrapped element to reveal one of its descendants.
                 *
                 * @author Huan Li
                 * @param {String|HTMLElement|jQuery} element The element, which is a descendant of the wrapped element, to
                 * reveal.
                 */
                scrollToElement = function (element) {
                    if (element) {
                        element = $(element);
                        if ($.contains(dWrappee[0], element[0])) {
                            var oElementPosition, oWrappeeCoordinates, oMovement;
                            oElementPosition = getPositionToWrappee(element);
                            if (noTransform()) {
                                oWrappeeCoordinates = dWrappee.position();
                                oMovement = {
                                    x: -(oElementPosition.x + oWrappeeCoordinates.left),
                                    y: -(oElementPosition.y + oWrappeeCoordinates.top)
                                };
                            } else {
                                oWrappeeCoordinates = parseTransform(dWrappee.css('transform'));
                                oMovement = {
                                    x: -(oElementPosition.x + oWrappeeCoordinates.x),
                                    y: -(oElementPosition.y + oWrappeeCoordinates.y)
                                };
                            }
                            scrollOnce(oMovement);
                        }
                    }
                },
                /**
                 * Scroll the wrapped element up for a amount of distance which is specified by "nMovement".
                 *
                 * @author Huan Li
                 * @param {Number} nMovement The amount of distance the wrapped element is supposed to be moved.
                 */
                scrollUp = function (nMovement) {
                    scrollOnce({
                        x: 0,
                        y: parseFloat(nMovement) || 0
                    });
                },
                /**
                 * Set the position of the scroll bars according to the position of the wrapped element.
                 *
                 * @author Huan Li
                 * @param {Object} oWrappeePosition A key-value pair object containing the coordinates of the wrapped
                 * element.
                 * @param {Object} oWrappeeMovement A key-value pair object containing the values of how much the wrapped
                 * element has just moved.
                 */
                setBarsPosition = function (oWrappeePosition, oWrappeeMovement) {
                    var nHRatio = getHorizontalMovementRatio(),
                        nVRatio = getVerticalMovementRatio(),
                        oBarsNewPosition = {
                            x: -(oWrappeePosition.x + oWrappeeMovement.x) / nHRatio,
                            y: -(oWrappeePosition.y + oWrappeeMovement.y) / nVRatio
                        };
                    if (noTransform()) {
                        if (_bHorizontalScrollable) {
                            dHBar.css('left', oBarsNewPosition.x);
                        }
                        if (_bVerticalScrollable) {
                            dVBar.css('top', oBarsNewPosition.y);
                        }
                    } else {
                        if (_bHorizontalScrollable) {
                            dHBar.css('transform', toTransformString({
                                x: oBarsNewPosition.x
                            }));
                        }
                        if (_bVerticalScrollable) {
                            dVBar.css('transform', toTransformString({
                                y: oBarsNewPosition.y
                            }));
                        }
                    }
                },
                /**
                 * Set the total number of instances of the the class "com.huanli.ui.KScroll".
                 *
                 * @author Huan Li
                 */
                setInstanceCount = function () {
                    nInstanceCount = KScroll.INSTANCE_COUNTER++;
                },
                /**
                 * Calculate the values of shifting with respect to the size of one page.
                 *
                 * @author Huan Li
                 * @returns {Object} A key-value pair object containing the values of shifting with respect to the size of
                 * one page for both the X and the Y axes.
                 */
                shiftWithInOnePage = function () {
                    var ret = {
                        x: 0,
                        y: 0
                    }, oWrappeePosition, oPageSize = {
                        x: dWrapper.width(),
                        y: dWrapper.height()
                    };
                    if (_nHowToMove === KScroll.MOVE_BY_POSITION) {
                        oWrappeePosition = {
                            x: dWrappee.position().left,
                            y: dWrappee.position().top
                        };
                    } else {
                        oWrappeePosition = parseTransform(dWrappee.css('transform'));
                    }
                    ret.x = Math.abs(oWrappeePosition.x) -
                    Math.floor(Math.abs(oWrappeePosition.x) / oPageSize.x) * oPageSize.x;
                    ret.y = Math.abs(oWrappeePosition.y) -
                    Math.floor(Math.abs(oWrappeePosition.y) / oPageSize.y) * oPageSize.y;
                    return ret;
                },
                /**
                 * Determine whether the horizontal scroll bar should be displayed based on the configurations.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if it should be displayed based on the configurations. False otherwise.
                 */
                shouldShowHorizontalScrollBar = function () {
                    return _bHorizontalBarVisible && dWrappee.outerWidth(true) > dWrapper.width();
                },
                /**
                 * Determine whether the vertical scroll bar should be displayed based on the configurations.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if it should be displayed based on the configurations. False otherwise.
                 */
                shouldShowVerticalScrollBar = function () {
                    return _bVerticalBarVisible && dWrappee.outerHeight(true) > dWrapper.height();
                },
                /**
                 * Show the scroll bars based on the configurations.
                 *
                 * @author Huan Li
                 */
                showScrollBars = function () {
                    if (timeoutVisibility) {
                        window.clearTimeout(timeoutVisibility);
                        timeoutVisibility = null;
                    }
                    if (shouldShowHorizontalScrollBar()) {
                        dHScrollBar.fadeIn('fast');
                    }
                    if (shouldShowVerticalScrollBar()) {
                        dVScrollBar.fadeIn('fast');
                    }
                    if (_bResizeKnobVisible &&
                        ((shouldShowHorizontalScrollBar() && shouldShowVerticalScrollBar()) || _bResizeable)) {
                        oResizeKnob.fadeIn('fast');
                    }
                },
                /**
                 * Set necessary styles to the wrapped element.
                 *
                 * @author Huan Li
                 */
                styleWrappee = function () {
                    dWrappee.css({
                        overflow: 'visible',
                        position: 'absolute'
                    }).addClass('wrappee');
                },
                /**
                 * Set necessary styles to the wrapper element.
                 *
                 * @author Huan Li
                 */
                styleWrapper = function () {
                    dWrapper.css({
                        border: dWrappee.css('border'),
                        display: dWrappee.css('display') !== 'block' ? 'inline-block' : 'block',
                        height: typeof _nWrapperHeight !== 'undefined' ? _nWrapperHeight : oWrappeeOldSizes.height,
                        overflow: 'hidden',
                        padding: 0,
                        position: dWrappee.css('position') === 'absolute' ? 'absolute' : 'relative',
                        width: typeof _nWrapperWidth !== 'undefined' ? _nWrapperWidth : oWrappeeOldSizes.width
                    });
                },
                /**
                 * Convert the arguments of the matrix function of the CSS property "transform" which are saved as key-value
                 * pairs in an object to a string. If any of the arguments could not be converted a default value will be
                 * used instead. The default values for all arguments are (1, 0, 0, 1, 0, 0).
                 *
                 * @author Huan Li
                 * @param {Object} oTransform An object containing the the arguments of the matrix function as key-value
                 * pairs.
                 * @returns {String} A string of the matrix function of the CSS property "transform".
                 */
                toTransformString = function (oTransform) {
                    var sTransform = 'matrix(';
                    if (typeof oTransform.a !== 'undefined') {
                        sTransform += (oTransform.a + ', ');
                    } else {
                        sTransform += '1, ';
                    }
                    if (typeof oTransform.b !== 'undefined') {
                        sTransform += (oTransform.b + ', ');
                    } else {
                        sTransform += '0, ';
                    }
                    if (typeof oTransform.c !== 'undefined') {
                        sTransform += (oTransform.c + ', ');
                    } else {
                        sTransform += '0, ';
                    }
                    if (typeof oTransform.d !== 'undefined') {
                        sTransform += (oTransform.d + ', ');
                    } else {
                        sTransform += '1, ';
                    }
                    if (typeof oTransform.x !== 'undefined') {
                        sTransform += (oTransform.x + ', ');
                    } else {
                        sTransform += '0, ';
                    }
                    if (typeof oTransform.y !== 'undefined') {
                        sTransform += (oTransform.y + ')');
                    } else {
                        sTransform += '0)';
                    }
                    return sTransform;
                },
                /**
                 * Unregister the event handler which handles the pressing of arrow keys.
                 *
                 * @author Huan Li
                 */
                unobserveArrowKeys = function () {
                    $(document).off('keydown', handleArrowKeysDown);
                },
                /**
                 * Unregister the event handler which handles the dragging action on the resize knob in order to disable
                 * resizing the wrapper element.
                 *
                 * @author Huan Li
                 */
                unobserveDragToResize = function () {
                    oResizeKnob.off(getEventSubject(KScroll.EVENT_TYPE_START), handleStartDragToResize).removeClass(cssClasses.cursorSeResize);
                },
                /**
                 * Unregister the event handler which handles the dragging action on the wrapped element in order to disable
                 * dragging to move the wrapped element.
                 *
                 * @author Huan Li
                 */
                unobserveDragWrappee = function () {
                    dWrappee.off(KScroll.EVENT_MOUSE_OVER, handleMouseOverDragWrappee).off(getEventSubject(KScroll.EVENT_TYPE_START), handleStartDragWrappee);
                    dWrappee.removeClass(cssClasses.cursorMove);
                    dWrappee.removeClass(cssClasses.noUserSelect);
                },
                /**
                 * Unregister the event handler which scrolls the wrapped element as the mouse wheel scrolls.
                 *
                 * @author Huan Li
                 */
                unobserveMouseWheel = function () {
                    dWrapper.off('wheel mousewheel');
                },
                /**
                 * Unregister the event handler which shows and hides the scroll bars according to the configurations as the
                 * mouse cursor moves in and out of the wrapper element. This will cause the scroll bars to be shown
                 * constantly.
                 *
                 * @author Huan Li
                 */
                unobserveScrollBarsVisibility = function () {
                    dWrapper.off({
                        mouseenter: handleMouseEnterScrollBarsVisibility,
                        mouseleave: handleMouseLeaveScrollBarsVisibility
                    });
                    showScrollBars();
                },
                /**
                 * Unregister the event handler for a custom event.
                 *
                 * @author Huan Li
                 * @param {String} sEventSubject The event subject.
                 */
                unregisterCustomEventHandler = function (sEventSubject) {
                    var key = 'on' + capitalizeInitial(sEventSubject);
                    if (typeof _this[key] !== 'undefined') {
                        delete _this[key];
                    }
                },
                /**
                 * Move the vertical bar to a distance as long as nYMovement because of user triggered events, either
                 * dragging the scroll bar or scrolling the mouse wheel. Then move the wrapped element accordingly based on
                 * how much the scroll bar has moved.
                 *
                 * @author Huan Li
                 * @param {Number} nYMovement How much the vertical scroll bar has moved.
                 */
                vBarDrivesWrappee = function (nYMovement) {
                    var nVRatio = getVerticalMovementRatio();
                    moveVBar(nYMovement);
                    moveWrappee(keepWrappeeInBound({
                        x: 0,
                        y: -nYMovement * nVRatio
                    }));
                },
                /**
                 * Wrap the target element with the wrapper element and scroll bars.
                 *
                 * @author Huan Li
                 */
                wrap = function () {
                    var sHScrollBarId = appendIdSuffix(sHScrollBarIdPrefix),
                        sVScrollBarId = appendIdSuffix(sVScrollBarIdPrefix),
                        sResizeKnobId = appendIdSuffix(sResizeKnobIdPrefix),
                        sHBarId = appendIdSuffix(sHBarIdPrefix),
                        sVBarId = appendIdSuffix(sVBarIdPrefix);
                    dWrapper = dWrappee.wrap($(sHtmlWrapper).attr('id', appendIdSuffix(sWrapperIdPrefix))).parent();
                    dWrapper.append($(sHtmlHScrollBar).attr('id', sHScrollBarId), $(sHtmlVScrollBar).attr('id', sVScrollBarId), $(sHtmlResizeKnob).attr('id', sResizeKnobId));
                    styleWrapper();
                    styleWrappee();
                    dHScrollBar = dWrapper.find('#' + sHScrollBarId);
                    dVScrollBar = dWrapper.find('#' + sVScrollBarId);
                    oResizeKnob = dWrapper.find('#' + sResizeKnobId);
                    dHBar = dHScrollBar.append($(sHtmlHBar).attr('id', sHBarId)).find('#' + sHBarId);
                    dVBar = dVScrollBar.append($(sHtmlVBar).attr('id', sVBarId)).find('#' + sVBarId);
                    renderScrollBars();
                    if (!_bResizeKnobVisible) {
                        oResizeKnob.hide();
                    }
                },
                /**
                 * Move the wrapped element to a distance as long as the values contained in the oMovement along the X and
                 * the Y axes. Then move the bars accordingly based on how much the wrapped element has been moved. Call
                 * event handlers accordingly.
                 *
                 * @author Huan Li
                 * @param {Object} oMovement A key-value pair object containing the movement along the X and the Y axes.
                 * @param {String} sTriggerAction A string describing the action which has triggered the scroll.
                 */
                wrappeeDrivesBars = function (oMovement, sTriggerAction) {
                    var oWrappeePosition = noTransform() ? {
                            x: dWrappee.position().left,
                            y: dWrappee.position().top
                        } : parseTransform(dWrappee.css('transform')),
                        oNewMovement;
                    oNewMovement = keepWrappeeInBound(oMovement);
                    moveWrappee(oNewMovement, sTriggerAction);
                    setBarsPosition(oWrappeePosition, oNewMovement);
                };

            $.extend(this, EventEmitter.newInstance(), {

                /**
                 * Get how the elements in the web page are moved.
                 *
                 * @author Huan Li
                 * @returns {Number} The number indicating different CSS properties that are changed when moving elements.
                 * Either com.huanli.ui.KScroll.MOVE_BY_POSITION or com.huanli.ui.KScroll.MOVE_BY_TRANSFORM.
                 */
                getHowToMove: function () {
                    return _nHowToMove;
                },
                /**
                 * Tell if the scroll bars are automatically hidden.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the scroll bars are shown when the mouse cursor moves into the wrapper element
                 * and hidden when the mouse cursor moves out of the wrapper element. False if the scroll bars are shown
                 * constantly.
                 */
                isAutoHide: function () {
                    return _bAutoHide;
                },
                /**
                 * Tell if the wrapped element can be dragged around.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the wrapped element can be dragged around. False otherwise.
                 */
                isDraggable: function () {
                    return _bDraggable;
                },
                /**
                 * Tell if the wrapped element will glide for an amount of distance after a dragging action.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the wrapped element will glide for an amount of distance after a dragging
                 * action. False otherwise.
                 */
                isGlideable: function () {
                    return _bGlideable;
                },
                /**
                 * Tell if the horizontal scroll bar will be shown.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the horizontal scroll bar will be shown when needed. False if the horizontal
                 * scroll bar will never be shown.
                 */
                isHorizontalBarVisible: function () {
                    return _bHorizontalBarVisible;
                },
                /**
                 * Tell if the wrapped element can be scrolled horizontally.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the wrapped element can be scrolled horizontally. False otherwise.
                 */
                isHorizontalScrollable: function () {
                    return _bHorizontalScrollable;
                },
                /**
                 * Tell if the wrapped element is scrolled by pages.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the wrapped element is scrolled by pages. False otherwise.
                 */
                isPageMode: function () {
                    return _bPageMode;
                },
                /**
                 * Tell if the wrapper element can be resized.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the wrapper element can be resized. False otherwise.
                 */
                isResizeable: function () {
                    return _bResizeable;
                },
                /**
                 * Tell if the resize knob is visible.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the the resize knob is visible. False otherwise.
                 */
                isResizeKnobVisible: function () {
                    return _bResizeKnobVisible;
                },
                /**
                 * Tell if the arrow keys can control the scroll of the wrapped element.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the arrow keys can control the scroll of the wrapped element. False otherwise.
                 */
                isScrollableByArrowKeys: function () {
                    return _bScrollableByArrowKeys;
                },
                /**
                 * Tell if the mouse wheel can scroll the wrapped element.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the mouse wheel can scroll the wrapped element. False otherwise.
                 */
                isScrollableByMouseWheel: function () {
                    return _bScrollableByMouseWheel;
                },
                /**
                 * Tell if the scrolling will be smooth.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the scrolling will be smooth. False otherwise.
                 */
                isSmooth: function () {
                    return _bSmooth;
                },
                /**
                 * Tell if the vertical scroll bar will be shown.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the vertical scroll bar will be shown when needed. False if the vertical scroll
                 * bar will never be shown.
                 */
                isVerticalBarVisible: function () {
                    return _bVerticalBarVisible;
                },
                /**
                 * Tell if the wrapped element can be scrolled vertically.
                 *
                 * @author Huan Li
                 * @returns {Boolean} True if the wrapped element can be scrolled vertically. False otherwise.
                 */
                isVerticalScrollable: function () {
                    return _bVerticalScrollable;
                },
                /**
                 * Revise the position of the wrapped element and redraw both scroll bars including their dimension and position.
                 * This must be explicitly called when the size of the wrapper or the wrapped element has changed not by dragging
                 * the resize knob.
                 *
                 * @author Huan Li
                 */
                refresh: function () {
                    reviseWrappeePosition();
                    renderScrollBars();
                },
                /**
                 * Scroll down the wrapped element for a amount of distance which is specified by "nMovement".
                 *
                 * @author Huan Li
                 * @param {Number} nMovement The amount of distance the wrapped element is supposed to be moved.
                 */
                scrollDown: scrollDown,
                /**
                 * Scroll the wrapped element to the left for a amount of distance which is specified by "nMovement".
                 *
                 * @author Huan Li
                 * @param {Number} nMovement The amount of distance the wrapped element is supposed to be moved.
                 */
                scrollLeft: scrollLeft,
                /**
                 * Scroll the wrapped element to the right for a amount of distance which is specified by "nMovement".
                 *
                 * @author Huan Li
                 * @param {Number} nMovement The amount of distance the wrapped element is supposed to be moved.
                 */
                scrollRight: scrollRight,
                /**
                 * Scroll the wrapped element to reveal one of its descendants.
                 *
                 * @author Huan Li
                 * @param {String|HTMLElement|jQuery} element The element, which is a descendant of the wrapped element, to
                 * reveal.
                 */
                scrollToElement: scrollToElement,
                /**
                 * Scroll up the wrapped element for a amount of distance which is specified by "nMovement".
                 *
                 * @author Huan Li
                 * @param {Number} nMovement The amount of distance the wrapped element is supposed to be moved.
                 */
                scrollUp: scrollUp,
                /**
                 * Set if the scroll bars are automatically shown and hidden when the mouse cursor enters and leaves the
                 * wrapper element.
                 *
                 * @author Huan Li
                 * @param {Boolean} bAutoHide True if the scroll bars are automatically shown and hidden. False otherwise.
                 */
                setAutoHide: function (bAutoHide) {
                    if (typeof bAutoHide === 'boolean' && _bAutoHide !== bAutoHide) {
                        if (bAutoHide) {
                            observeScrollBarsVisibility();
                            _bAutoHide = true;
                        } else {
                            unobserveScrollBarsVisibility();
                            showScrollBars();
                            _bAutoHide = false;
                        }
                    }
                },
                /**
                 * Set if the wrapped element is supposed to be draggable.
                 *
                 * @author Huan Li
                 * @param {Boolean} bDraggable True if the wrapped element is supposed to be able to be dragged. False
                 * otherwise.
                 */
                setDraggable: function (bDraggable) {
                    if (typeof bDraggable === 'boolean' && _bDraggable !== bDraggable) {
                        if (bDraggable) {
                            _bDraggable = true;
                            observeDragWrappee();
                        } else {
                            _bDraggable = false;
                            unobserveDragWrappee();
                        }
                    }
                },
                /**
                 * Set if the wrapped element will glide for an amount of distance after a dragging action.
                 *
                 * @author Huan Li
                 * @param {Boolean} bGlideable True if the wrapped element will glide for an amount of distance after a
                 * dragging action. False otherwise.
                 */
                setGlideable: function (bGlideable) {
                    if (typeof bGlideable === 'boolean' && _bGlideable !== bGlideable) {
                        _bGlideable = bGlideable;
                    }
                },
                /**
                 * Set if the horizontal scroll bar is supposed to be shown when needed.
                 *
                 * @author Huan Li
                 * @param {Boolean} bHorizontalBarVisible True if the horizontal scroll bar is supposed to be shown when
                 * needed. False if it's supposed to be never shown. If the value of this argument is not of type Boolean
                 * nothing will be done.
                 */
                setHorizontalBarVisible: function (bHorizontalBarVisible) {
                    if (typeof bHorizontalBarVisible === 'boolean' &&
                        _bHorizontalBarVisible !== bHorizontalBarVisible) {
                        _bHorizontalBarVisible = bHorizontalBarVisible;
                        refresh();
                    }
                },
                /**
                 * Set if the wrapped element can be scrolled horizontally.
                 *
                 * @author Huan Li
                 * @param {Boolean} bHorizontalScrollable True if the wrapped element can be scrolled horizontally. False
                 * otherwise.
                 */
                setHorizontalScrollable: function (bHorizontalScrollable) {
                    if (typeof bHorizontalScrollable === 'boolean' &&
                        _bHorizontalScrollable !== bHorizontalScrollable) {
                        _bHorizontalScrollable = bHorizontalScrollable;
                    }
                },
                /**
                 * Set the way how elements are moved in the web page.
                 *
                 * @author Huan Li
                 * @param {Number} nHowToMove A number indicating different CSS properties that are changed when moving
                 * elements. Either com.huanli.ui.KScroll.MOVE_BY_POSITION or com.huanli.ui.KScroll.MOVE_BY_TRANSFORM. If the
                 * value of this argument is neither one of what're just mentioned the default value, which is
                 * com.huanli.ui.KScroll.MOVE_BY_TRANSFORM will be used.
                 */
                setHowToMove: function (nHowToMove) {
                    if (nHowToMove === KScroll.MOVE_BY_POSITION) {
                        _nHowToMove = KScroll.MOVE_BY_POSITION;
                    } else {
                        _nHowToMove = KScroll.MOVE_BY_TRANSFORM;
                    }
                },
                /**
                 * Set if the wrapped element is scrolled by pages.
                 *
                 * @author Huan Li
                 * @param {Boolean} bPageMode True if the wrapped element is scrolled by pages. False otherwise.
                 */
                setPageMode: function (bPageMode) {
                    if (typeof bPageMode !== 'undefined' && _bPageMode !== bPageMode) {
                        _bPageMode = bPageMode;
                    }
                },
                /**
                 * Set if the wrapper element is supposed to be resizeable.
                 *
                 * @author Huan Li
                 * @param {Boolean} bResizeable True if the wrapper element is supposed to be able to be resized by dragging
                 * the resize knob. False otherwise.
                 */
                setResizeable: function (bResizeable) {
                    if (_bResizeable !== bResizeable && typeof bResizeable === 'boolean') {
                        if (bResizeable) {
                            _bResizeable = true;
                            observeDragToResize();
                        } else {
                            _bResizeable = false;
                            unobserveDragToResize();
                        }
                    }
                },
                /**
                 * Set if the resize knob is visible.
                 *
                 * @author Huan Li
                 * @param {Boolean} bResizeKnobVisible True if the the resize knob is visible. False otherwise.
                 */
                setResizeKnobVisible: function (bResizeKnobVisible) {
                    if (_bResizeKnobVisible !== bResizeKnobVisible && typeof bResizeKnobVisible === 'boolean') {
                        if (bResizeKnobVisible) {
                            _bResizeKnobVisible = true;
                            if (_bResizeKnobVisible &&
                                ((shouldShowHorizontalScrollBar() && shouldShowVerticalScrollBar()) || _bResizeable)) {
                                oResizeKnob.fadeIn('fast');
                            }
                        } else {
                            _bResizeKnobVisible = false;
                            oResizeKnob.fadeOut('fase');
                        }
                    }
                },
                /**
                 * Set if the arrow keys can control the scroll of the wrapped element.
                 *
                 * @author Huan Li
                 * @param {Boolean} bScrollableByArrowKeys True if the arrow keys can control the scroll of the wrapped
                 * element. False otherwise.
                 */
                setScrollableByArrowKeys: function (bScrollableByArrowKeys) {
                    if (typeof bScrollableByArrowKeys === 'boolean' &&
                        _bScrollableByArrowKeys !== bScrollableByArrowKeys) {
                        if (bScrollableByArrowKeys) {
                            _bScrollableByArrowKeys = true;
                            observeArrowKeys();
                        } else {
                            _bScrollableByArrowKeys = false;
                            unobserveArrowKeys();
                        }
                    }
                },
                /**
                 * Set if the mouse wheel can scroll the wrapped element.
                 *
                 * @author Huan Li
                 * @param {Boolean} bScrollableByMouseWheel True if the mouse wheel can scroll the wrapped element. False
                 * otherwise.
                 */
                setScrollableByMouseWheel: function (bScrollableByMouseWheel) {
                    if (typeof bScrollableByMouseWheel === 'boolean' &&
                        _bScrollableByMouseWheel !== bScrollableByMouseWheel) {
                        _bScrollableByMouseWheel = bScrollableByMouseWheel;
                        if (bScrollableByMouseWheel) {
                            observeMouseWheel();
                        } else {
                            unobserveMouseWheel();
                        }
                    }
                },
                /**
                 * Set if the scrolling will be smooth.
                 *
                 * @author Huan Li
                 * @param {Boolean} bSmooth True if the scrolling will be smooth. False otherwise.
                 */
                setSmooth: function (bSmooth) {
                    if (typeof bSmooth === 'boolean' && _bSmooth !== bSmooth) {
                        if (bSmooth) {
                            _bSmooth = true;
                            addTransition4Scroll();
                        } else {
                            _bSmooth = false;
                            removeTransition();
                        }
                    }
                },
                /**
                 * Set if the vertical scroll bar is supposed to be shown when needed.
                 *
                 * @author Huan Li
                 * @param {Boolean} bVerticalBarVisible True if the vertical scroll bar is supposed to be shown when needed.
                 * False if it's supposed to be never shown. If the value of this argument is not of type Boolean nothing
                 * will be done.
                 */
                setVerticalBarVisible: function (bVerticalBarVisible) {
                    if (typeof bVerticalBarVisible === 'boolean' && _bVerticalBarVisible !== bVerticalBarVisible) {
                        _bVerticalBarVisible = bVerticalBarVisible;
                        refresh();
                    }
                },
                /**
                 * Set if the wrapped element can be scrolled vertically.
                 *
                 * @author Huan Li
                 * @param {Boolean} bVerticalScrollable True if the wrapped element can be scrolled vertically. False
                 * otherwise.
                 */
                setVerticalScrollable: function (bVerticalScrollable) {
                    if (typeof bVerticalScrollable === 'boolean' && _bVerticalScrollable !== bVerticalScrollable) {
                        _bVerticalScrollable = bVerticalScrollable;
                    }
                },
                /**
                 * Set the height of the wrapper element to the size specified by the parameter only if the parameter is a
                 * number.
                 *
                 * @author Huan Li
                 * @param {Number} nWrapperHeight The size to which the height of the wrapper element is to be set. This parameter must be a
                 * number.
                 */
                setWrapperHeight: function (nWrapperHeight) {
                    if (typeof nWrapperHeight === 'number') {
                        _nWrapperHeight = nWrapperHeight;
                        dWrapper.height(_nWrapperHeight);
                        refresh();
                    }
                },
                /**
                 * Set the width of the wrapper element to the size specified by the parameter only if the parameter is a
                 * number.
                 *
                 * @author Huan Li
                 * @param {Number} nWrapperWidth The size to which the width of the wrapper element is to be set. This parameter must be a
                 * number.
                 */
                setWrapperWidth: function (nWrapperWidth) {
                    if (typeof nWrapperWidth === 'number') {
                        _nWrapperWidth = nWrapperWidth;
                        dWrapper.width(_nWrapperWidth);
                        refresh();
                    }
                }
            });

            initialize();
        };

    return {
        CODE_UP_ARROW_KEY: 38,
        CODE_RIGHT_ARROW_KEY: 39,
        CODE_DOWN_ARROW_KEY: 40,
        BEZIER_CURVE_BOUNCE: 'cubic-bezier(0, 0, 0.1, 1.4)',
        BEZIER_CURVE_NO_BOUNCE: 'cubic-bezier(0, 0, 0.46, 1)',
        DEFAULT_ACCELERATION: 0.0015, // The unit is "px/ms^2"
        DEFAULT_TRANSITION_DURATION: 200,
        END_DRAG_TIMEOUT: 50,
        EVENT_MOUSE_DOWN: 'mousedown',
        EVENT_MOUSE_MOVE: 'mousemove',
        EVENT_MOUSE_OVER: 'mouseover',
        EVENT_MOUSE_UP: 'mouseup',
        EVENT_TOUCH_CANCEL: 'touchcancel',
        EVENT_TOUCH_END: 'touchend',
        EVENT_TOUCH_MOVE: 'touchmove',
        EVENT_TOUCH_START: 'touchstart',
        EVENT_TYPE_CANCEL: 'cancel',
        EVENT_TYPE_END: 'end',
        EVENT_TYPE_MOVE: 'move',
        EVENT_TYPE_START: 'start',
        EVENT_SCROLLED: 'scrolled',
        EVENT_END_REACHED: 'endReached',
        EVENT_BOTTOM_END_REACHED: 'bottomEndReached',
        EVENT_LEFT_END_REACHED: 'leftEndReached',
        EVENT_RIGHT_END_REACHED: 'rightEndReached',
        EVENT_TOP_END_REACHED: 'topEndReached',
        INSTANCE_COUNTER: 0,
        MINIMUM_TRANSITION_TIME: 800,
        MOVE_BY_POSITION: 1,
        MOVE_BY_TRANSFORM: 2,
        MOVEMENT_TRIGGER_ACTION_ARROW_KEY_DOWN: 'arrow_key_down',
        MOVEMENT_TRIGGER_ACTION_ARROW_KEY_LEFT: 'arrow_key_left',
        MOVEMENT_TRIGGER_ACTION_ARROW_KEY_RIGHT: 'arrow_key_right',
        MOVEMENT_TRIGGER_ACTION_ARROW_KEY_UP: 'arrow_key_up',
        MOVEMENT_TRIGGER_ACTION_DRAG: 'drag',
        MOVEMENT_TRIGGER_ACTION_GLIDE: 'glide',
        MOVEMENT_TRIGGER_ACTION_MOUSE_WHEEL: 'mouse_wheel',
        MOVEMENT_TRIGGER_ACTION_PROGRAM: 'program',
        SCROLL_ONCE_TRANSITION_DURATION: 500,
        SHIFTING_BY_ARROW_KEYS: 30,
        SHIFTING_BY_SCROLL: 10,
        TIMEOUT_SCROLL_BARS_VISIBILITY: 1000,
        WRAPPER_MAX_HEIGHT: Number.POSITIVE_INFINITY,
        WRAPPER_MAX_WIDTH: Number.POSITIVE_INFINITY,
        WRAPPER_MIN_HEIGHT: 100,
        WRAPPER_MIN_WIDTH: 100,
        /**
         *
         * @param {Object} oInstance
         * @returns {Boolean}
         */
        isInstanceOf: function (oInstance) {
            return aInstances.some(function (oItem) {
                if (oInstance === oItem) {
                    return true;
                }
            });
        },
        /**
         *
         * @param {Object} oConfig
         * @returns {KScroll}
         */
        makeScrollable: function (dWrappee, oConfig) {
            oConfig = oConfig || {};
            oConfig.wrappee = dWrappee;
            var instance = new konstructor(oConfig);
            aInstances.push(instance);
            return instance;
        }
    };
}());
