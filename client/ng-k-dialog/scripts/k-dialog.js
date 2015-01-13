/**
 * Created by huanli<klx211@gmail.com> on 1/7/15.
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

    var kDialogEvents = {
            DIALOG_OPENED: 'kDialogOpened',
            DIALOG_CLOSED: 'kDialogClosed',
            DIALOG_DATA_LOADING: 'kDialogDataLoading',
            DIALOG_DATA_LOADED: 'kDialogDataLoaded'
        },
        kDialogClassNames = {
            DIALOG: 'k-dialog',
            DIALOG_CONTENT: 'k-dialog-content',
            DIALOG_CLOSE_BTN: 'k-dialog-close-btn',
            DIALOG_MASK: 'k-dialog-mask',
            DIALOG_SIZE_LARGE: 'k-dialog-large',
            DIALOG_SIZE_MEDIUM: 'k-dialog-medium',
            DIALOG_SIZE_SMALL: 'k-dialog-small',
            DIALOG_SIZE_MINI: 'k-dialog-mini'
        },
        kDialogDefaults = {
            CONFIG: {
                bCloseOnEsc: true,
                bDraggable: false,
                bModal: true,
                bShowCloseBtn: true,
                sSize: 'medium'
            }
        };

    angular
        .module('kl.dialog', [
            'kl.draggable'
        ])
        .constant('kDialogEvents', kDialogEvents)
        .constant('kDialogDefaults', kDialogDefaults)
        .constant('kDialogClassNames', kDialogClassNames)
        .controller('KDialogController', KDialogController)
        .service('kInstanceService', kInstanceService)
        .service('kDialogService', kDialogService)
        .directive('kDialog', kDialog);

    KDialogController.$inject = [
        '$scope'
    ];

    kDialogService.$inject = [
        'kDialogDefaults',
        'kInstanceService',
        '$compile',
        '$rootScope'
    ];

    kDialog.$inject = [
        'kDialogClassNames',
        'kDialogEvents',
        'kInstanceService',
        'kDraggableService',
        '$document'
    ];

    function KDialogController($scope) {

        $scope.sSize = ['large', 'small', 'mini'].indexOf($scope.sSize) >= 0 ? $scope.sSize : 'medium';
        $scope.sTemplateUrl = angular.isString($scope.sTemplateUrl) ? $scope.sTemplateUrl : '';
    }

    function kInstanceService() {

        var oRegistry = {};
        /**
         *
         * @author Kevin Li<klx211@gmail.com>
         * @param {Object} oConfig A configuration object.
         * @param {jQuery} ngElement An AngularJS augmented jQuery wrapper of the directive element.
         * @returns {Object} An object containing.
         */
        this.newInstance = function (oConfig, ngElement) {

            var oInstance = {
                ngElement: ngElement,
                oConfig: oConfig
            };
            return (oRegistry[ngElement] = oInstance);
        };
        /**
         * Get an instance of the dialog by the directive element.
         *
         * @author Kevin Li<klx211@gmail.com>
         * @param {jQuery} ngElement An AngularJS augmented jQuery wrapper of the directive element.
         * @returns {Object} The instance of a dialog or undefined if no instance were found.
         */
        this.getInstance = function (ngElement) {

            return oRegistry[ngElement];
        };

        this.removeInstance = function (ngElement) {

            return (delete oRegistry[ngElement]);
        };
    }

    function kDialogService(kDD, kIS, $compile, $rootScope) {

        /**
         * Open a dialog according to the configuration object.
         *
         * @author Kevin Li<klx211@gmail.com>
         * @param {Object} oConfig A configuration object. All properties in this object are optional.
         * @example
         * {
         *      bCloseOnEsc: {boolean} - True if the dialog should be closed when the Esc key is pressed down. False if
         *                              the dialog should not close on Esc press.
         *      bDraggable: {boolean} - True if the dialog can be dragged with the Alt key held down. False if the
         *                              dialog can not be moved at all. The default value is false.
         *      bModal: {boolean} - True if the dialog is modal. False if it is modeless. The default value is true.
         *      bShowCloseBtn: {boolean} - True if the close button should be shown. False if it should be hidden.
         *      sDialogClass: {string} - A space separated string of class names to be applied to the dialog.
         *      sSize: {string} - A descriptor of the size of the dialog. Possible values are "large", "medium", "small"
         *                              , and "mini". The default value is medium.
         *      sTemplateUrl: {string} - The URL to the template which will be included into the dialog.
         * }
         * @returns {Object} An instance of the dialog which contains some methods to control the dialog.
         * @throw Will throw an error if the only argument is not an object.
         */
        this.open = function open(oConfig) {

            var oConf = checkConfig(oConfig),
                ngElement = setupDirective(oConf);

            angular.element('body').append(ngElement);

            return kIS.newInstance(oConfig, ngElement);
        };

        this.getInstance = kIS.getInstance;

        function checkConfig(oConfig) {

            var oConf = {};

            angular.extend(oConf, kDD.CONFIG, oConfig);

            if (angular.isUndefined(oConf.oScope)) {

                oConf.oScope = $rootScope;

            }
            return oConf;
        }

        function setupDirective(oConfig) {

            var ngElement = angular.element('<div k-dialog></div>');

            if (oConfig.bModal === false) {

                ngElement.attr('modal', 'false');
            }

            if (oConfig.bDraggable === true) {

                ngElement.attr('draggable', 'true');
            }

            if (oConfig.bCloseOnEsc === false) {

                ngElement.attr('close-on-esc', 'false');
            }

            if (oConfig.bShowCloseBtn === false) {

                ngElement.attr('show-close-btn', 'false');
            }

            ngElement
                .attr('dialog-class', 'oConfig.sDialogClass')
                .attr('size', oConfig.sSize)
                .attr('template-url', oConfig.sTemplateUrl);

            return $compile(ngElement)(oConfig.oScope);
        }
    }

    function kDialog(kDCN, kDE, kIS, kDraggableService, $document) {

        return {
            controller: 'KDialogController',
            link: function (scope, element, attrs) {

                var oInstance = kIS.getInstance(element);

                if (angular.isUndefined(oInstance)) {

                    oInstance = kIS.newInstance({
                        bCloseOnEsc: attrs.closeOnEsc,
                        bDraggable: attrs.draggable,
                        bModal: attrs.modal,
                        bShowCloseBtn: attrs.showCloseBtn,
                        sDialogClass: attrs.dialogClass,
                        sSize: attrs.size,
                        sTplUrl: attrs.templateUrl
                    }, element);
                }
                augmentInstance(oInstance, scope, element);

                if (scope.bDraggable === 'true') {

                    kDraggableService.makeDraggable({
                        xDraggable: element.find('.' + kDCN.DIALOG),
                        bWithAlt: true
                    });
                }

                if (!angular.isUndefined(scope.sDialogClass)) {

                    element.children('.' + kDCN.DIALOG).addClass(scope.sDialogClass);
                }

                scope.openDialog = function () {

                    var ngDialog = element.children('.' + kDCN.DIALOG),
                        ngDialogMask = element.children('.' + kDCN.DIALOG_MASK);

                    if (angular.equals(ngDialog.css('display'), 'none')) {

                        if (scope.bModal !== 'false') {

                            ngDialogMask.show(0);
                        }
                        ngDialog
                            .show(0)
                            .css('opacity', 1)
                            .on('transitionend', function () {

                                angular
                                    .element(this)
                                    .off('transitionend');

                                scope.$emit(kDE.DIALOG_OPENED, element);
                                scope.$broadcast(kDE.DIALOG_OPENED, element);
                            });
                    }
                };

                scope.isOpen = function () {

                    return angular.equals(element.children('.' + kDCN.DIALOG).css('display'), 'block');
                };

                registerEventListeners(scope, element);

                scope.openDialog();
            },
            restrict: 'EA',
            scope: {
                bCloseOnEsc: '@closeOnEsc',
                bDraggable: '@draggable',
                bModal: '@modal',
                bShowCloseBtn: '@showCloseBtn',
                sDialogClass: '@dialogClass',
                sSize: '@size',
                sTplUrl: '@templateUrl'
            },
            templateUrl: '../templates/ng-k-dialog.tpl.html'
        };

        /**
         *
         * @param {Object} oInstance
         * @param {Object} oScope
         * @param {jQuery} ngElement
         */
        function augmentInstance(oInstance, oScope, ngElement) {

            angular.extend(oInstance, {
                oScope: oScope,
                close: function () {

                    oScope.closeDialog();
                },
                destroy: function () {

                    oScope.closeDialog(true);
                    kIS.removeInstance(ngElement);
                },
                isOpen: function () {

                    return oScope.isOpen();
                },
                open: function () {

                    oScope.openDialog();
                }
            });
        }

        function registerEventListeners(oScope, ngElement) {

            listenOnDataLoading(oScope, ngElement);
            listenOnDataLoaded(oScope, ngElement);
            listenOnClick(oScope, ngElement);

            if (oScope.bCloseOnEsc !== 'false') {

                listenOnEscKey(oScope);
            }
        }

        function listenOnDataLoading(oScope, ngElement) {

            oScope.$on(kDE.DIALOG_DATA_LOADING, function () {

                ngElement.find([
                    '.' + kDCN.DIALOG_CONTENT + ' ~ .' + kDCN.LOADING_MASK,
                    '.' + kDCN.DIALOG_CONTENT + ' ~ .' + kDCN.LOADING_ICON
                ].join()).show();
            });
        }

        function listenOnDataLoaded(oScope, ngElement) {

            oScope.$on(kDE.DIALOG_DATA_LOADED, function () {

                ngElement.find([
                    '.' + kDCN.DIALOG_CONTENT + ' ~ .' + kDCN.LOADING_MASK,
                    '.' + kDCN.DIALOG_CONTENT + ' ~ .' + kDCN.LOADING_ICON
                ].join()).hide();
            });
        }

        function listenOnClick(oScope, ngElement) {

            oScope.closeDialog = function (bDestroy) {

                var ngDialog = ngElement.children('.' + kDCN.DIALOG),
                    ngDialogMask = ngElement.children('.' + kDCN.DIALOG_MASK);

                if (angular.equals(ngDialog.css('display'), 'block')) {

                    ngDialog
                        .css('opacity', 0)
                        .on('transitionend', function () {
                            angular
                                .element(this)
                                .hide(0)
                                .off('transitionend');

                            if (oScope.bModal !== 'false') {

                                ngDialogMask.hide(0);
                            }

                            oScope.$emit(kDE.DIALOG_CLOSED, ngElement);
                            oScope.$broadcast(kDE.DIALOG_CLOSED, ngElement);

                            if (bDestroy) {

                                oScope.$destroy();
                                ngElement.remove();
                            }
                        });
                }
            };
        }

        function listenOnEscKey(oScope) {

            $document.on('keydown', function (oEvent) {

                if (oEvent.keyCode === 27) {
                    // The Esc key
                    oScope.closeDialog();
                }
            });
        }
    }

}());