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
            DIALOG_DATA_LOADED: 'kDialogDataLoaded',
            DIALOG_INITIALIZED: 'kDialogInitialized'
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
        kDialogAttributeNames = {
            CLOSE_ON_ESC: 'close-on-esc',
            DIALOG: 'k-dialog',
            DIALOG_CLASSES: 'dialog-classes',
            DRAGGABLE: 'draggable',
            MODAL: 'modal',
            OPEN_UPON_INIT: 'open-upon-init',
            SHOW_CLOSE_BTN: 'show-close-btn',
            SIZE: 'size',
            TEMPLATE_URL: 'template-url'
        },
        kDialogDefaults = {
            CONFIG: {
                bCloseOnEsc: true,
                bDraggable: false,
                bModal: true,
                bShowCloseBtn: true,
                sSize: 'medium'
            },
            Z_INDEX_BASE: 1500,
            Z_INDEX_STEP: 10
        },
        kDialogSizes = {
            LARGE: 'large',
            MEDIUM: 'medium',
            SMALL: 'small',
            MINI: 'mini'
        };

    angular
        .module('kl.dialog', [
            'kl.draggable'
        ])
        .constant('kDialogEvents', kDialogEvents)
        .constant('kDialogDefaults', kDialogDefaults)
        .constant('kDialogClassNames', kDialogClassNames)
        .constant('kDialogAttributeNames', kDialogAttributeNames)
        .constant('kDialogSizes', kDialogSizes)
        .service('kDialogService', kDialogService)
        .directive('kDialog', kDialog);

    kDialogService.$inject = [
        'kDialogDefaults',
        'kDialogEvents',
        'kDialogAttributeNames',
        '$compile',
        '$rootScope',
        '$q',
        '$timeout'
    ];

    kDialog.$inject = [
        'kDialogClassNames',
        'kDialogDefaults',
        'kDialogEvents',
        'kDraggableService',
        '$document',
        '$timeout'
    ];

    function kDialogService(kDD,
                            kDE,
                            kDAN,
                            $compile,
                            $rootScope,
                            $q,
                            $timeout) {

        var oRegistry = {};
        /**
         * Initialize a dialog instance and return it.
         *
         * @param {Object} oConfig A configuration object.
         * @example
         * {
         *      aDialogClasses: {Array}
         *      bCloseOnEsc: {boolean}
         *      bDraggable: {boolean}
         *      bModal: {boolean}
         *      bOpenUponInit: {boolean}
         *      bShowCloseBtn: {boolean}
         *      oScope: {Object}
         *      sSize: {string}
         *      sTemplateUrl: {string}
         * }
         * @returns {Object} A dialog instance.
         */
        this.initialize = function (oConfig) {

            var oInstance = {
                    oConfig: oConfig
                },
                ngElement = setupDirective(checkConfig(oConfig)),
                oDeferred = $q.defer();

            oInstance.ngElement = ngElement;

            listenOnInitialization(ngElement, oDeferred);
            augmentInstance(oInstance, oDeferred.promise);

            oRegistry[ngElement] = oInstance;

            return oInstance;
        };

        this.getInstance = function (ngElement) {

            return oRegistry[ngElement];
        };

        function checkConfig(oConfig) {

            var oConf = {};

            angular.extend(oConf, kDD.CONFIG, oConfig);

            if (angular.isUndefined(oConf.oScope)) {

                oConf.oScope = $rootScope;
            }
            return oConf;
        }

        function setupDirective(oConfig) {

            var ngElement = angular.element('<div ' + kDAN.DIALOG + '></div>');

            if (oConfig.bCloseOnEsc === false) {

                ngElement.attr(kDAN.CLOSE_ON_ESC, 'false');
            }

            if (oConfig.bDraggable === true) {

                ngElement.attr(kDAN.DRAGGABLE, 'true');
            }

            if (oConfig.bModal === false) {

                ngElement.attr(kDAN.MODAL, 'false');
            }

            if (oConfig.bOpenUponInit === true) {

                ngElement.attr(kDAN.OPEN_UPON_INIT, 'true');
            }

            if (oConfig.bShowCloseBtn === false) {

                ngElement.attr(kDAN.SHOW_CLOSE_BTN, 'false');
            }

            ngElement
                .attr(kDAN.DIALOG_CLASSES, angular.toJson(oConfig.aDialogClasses))
                .attr(kDAN.SIZE, oConfig.sSize)
                .attr(kDAN.TEMPLATE_URL, oConfig.sTemplateUrl);

            angular.element('body').append(ngElement);

            return $compile(ngElement)(oConfig.oScope.$new());
        }

        function listenOnInitialization(ngElement, oDeferred) {

            ngElement
                .scope()
                .$on(kDE.DIALOG_INITIALIZED, function (oEvent, oScope) {

                    oEvent.preventDefault();
                    oEvent.stopPropagation();

                    oDeferred.resolve(oScope);
                });
        }

        function augmentInstance(oInstance, oPromise) {

            angular.extend(oInstance, {
                close: close,
                open: open,
                setCloseOnEsc: setCloseOnEsc,
                setDialogClasses: setDialogClasses,
                setDraggable: setDraggable,
                setModal: setModal,
                setShowCloseBtn: setShowCloseBtn,
                setSize: setSize,
                setTemplateUrl: setTemplateUrl
            });

            function close(bDestroy) {

                var aArgs = Array.prototype.slice.call(arguments, 0);

                oPromise.then(function (oScope) {

                    if (bDestroy) {

                        removeInstance(oInstance);
                    }
                    $timeout(function () {

                        oScope.close.apply(oInstance, aArgs);
                    });
                });
            }

            function open() {

                oPromise.then(function (oScope) {

                    oScope.open();
                });
            }

            function setCloseOnEsc(bCloseOnEsc) {

                oPromise.then(function (oScope) {

                    $timeout(function () {

                        oScope.setCloseOnEsc(bCloseOnEsc);
                    });
                });
            }

            function setDialogClasses(aDialogClasses) {

                oPromise.then(function (oScope) {

                    $timeout(function () {

                        oScope.setDialogClasses(aDialogClasses);
                    });
                });
            }

            function setDraggable(bDraggable) {

                oPromise.then(function (oScope) {

                    $timeout(function () {

                        oScope.setDraggable(bDraggable);
                    });
                });
            }

            function setModal(bModal) {

                oPromise.then(function (oScope) {

                    $timeout(function () {

                        oScope.setModal(bModal);
                    });
                });
            }

            function setSize(sSize) {

                oPromise.then(function (oScope) {

                    $timeout(function () {

                        oScope.setSize(sSize);
                    });
                });
            }

            function setShowCloseBtn(bShowCloseBtn) {

                oPromise.then(function (oScope) {

                    $timeout(function () {

                        oScope.setShowCloseBtn(bShowCloseBtn);
                    });
                });
            }

            function setTemplateUrl(sTemplateUrl) {

                oPromise.then(function (oScope) {

                    $timeout(function () {

                        oScope.setTemplateUrl(sTemplateUrl);
                    });
                });
            }
        }

        function removeInstance(x) {

            if (x instanceof jQuery) {

                return delete oRegistry[x];

            } else {

                var p;

                for (p in oRegistry) {

                    if (oRegistry.hasOwnProperty(p)) {

                        if (angular.equals(oRegistry[p], x)) {

                            return delete oRegistry[p];
                        }
                    }
                }
            }
        }
    }

    function kDialog(kDCN,
                     kDD,
                     kDE,
                     kDraggableService,
                     $document,
                     $timeout) {

        var nCounter = 0;

        return {
            link: function (scope, element) {

                applyZIndex(scope);
                checkScopeProperties(scope);
                augmentScope(scope, element);
                registerEventListeners(scope, element);

                scope.$watch('bCloseOnEsc', function (sNewValue) {

                    if (sNewValue === 'false') {

                        $document.off('keydown', onEscKey);

                    } else {

                        $document.on('keydown', onEscKey);
                    }
                });

                scope.$watch('bDraggable', function (sNewValue) {

                    if (sNewValue === 'true') {

                        kDraggableService.makeDraggable({
                            xDraggable: element.children('.' + kDCN.DIALOG),
                            bWithAlt: true
                        });

                    } else {

                        var ngDraggableElement = element.children('.' + kDCN.DIALOG);

                        if (angular.isFunction(ngDraggableElement.scope().disableDraggable)) {

                            ngDraggableElement.scope().disableDraggable();
                        }
                    }
                });

                scope.$emit(kDE.DIALOG_INITIALIZED, scope);

                function onEscKey(oEvent) {

                    if (oEvent.keyCode === 27) {
                        // The Esc key
                        scope.close();
                    }
                }

                if (scope.bOpenUponInit === 'true') {

                    $timeout(function () {

                        scope.open();
                    });
                }
            },
            restrict: 'EA',
            scope: {
                aDialogClasses: '@dialogClasses',
                bCloseOnEsc: '@closeOnEsc',
                bDraggable: '@draggable',
                bModal: '@modal',
                bOpenUponInit: '@openUponInit',
                bShowCloseBtn: '@showCloseBtn',
                sSize: '@size',
                sTemplateUrl: '@templateUrl'
            },
            templateUrl: '../templates/k-dialog.tpl.html'
        };

        function applyZIndex(oScope) {

            oScope.nZIndex = kDD.Z_INDEX_BASE + (nCounter++) * kDD.Z_INDEX_STEP;
        }

        function checkScopeProperties(oScope) {

            oScope.sSize = checkSize(oScope.sSize);
            oScope.sTemplateUrl = checkTemplateUrl(oScope.sTemplateUrl);
        }

        function checkSize(sSize) {

            return [kDialogSizes.LARGE, kDialogSizes.SMALL, kDialogSizes.MINI].indexOf(sSize) >= 0 ?
                sSize :
                kDialogSizes.MEDIUM;
        }

        function checkTemplateUrl(sTemplateUrl) {

            return angular.isString(sTemplateUrl) ? sTemplateUrl : '';
        }

        function augmentScope(oScope, ngElement) {

            angular.extend(oScope, {
                close: close,
                open: open,
                setCloseOnEsc: setCloseOnEsc,
                setDialogClasses: setDialogClasses,
                setDraggable: setDraggable,
                setModal: setModal,
                setShowCloseBtn: setShowCloseBtn,
                setSize: setSize,
                setTemplateUrl: setTemplateUrl
            });

            function open() {

                var ngDialog = ngElement.children('.' + kDCN.DIALOG),
                    ngDialogMask = ngElement.children('.' + kDCN.DIALOG_MASK);

                if (oScope.bModal !== 'false') {

                    ngDialogMask.show();
                }

                ngDialog.show(function () {

                    oScope.$emit(kDE.DIALOG_OPENED, ngElement);
                    oScope.$broadcast(kDE.DIALOG_OPENED, ngElement);
                });
            }

            function close(bDestroy) {

                var ngDialog = ngElement.children('.' + kDCN.DIALOG),
                    ngDialogMask = ngElement.children('.' + kDCN.DIALOG_MASK);

                ngDialog.hide(function () {

                    if (oScope.bModal !== 'false') {

                        ngDialogMask.hide();
                    }

                    oScope.$emit(kDE.DIALOG_CLOSED, ngElement);
                    oScope.$broadcast(kDE.DIALOG_CLOSED, ngElement);

                    if (bDestroy) {

                        oScope.$apply(function () {

                            oScope.$destroy();
                            ngElement.remove();
                        });
                    }
                });
            }

            function setCloseOnEsc(bCloseOnEsc) {

                oScope.$apply(function () {

                    oScope.bCloseOnEsc = (!!bCloseOnEsc).toString();
                });
            }

            function setDialogClasses(aDialogClasses) {

                oScope.$apply(function () {

                    oScope.aDialogClasses = aDialogClasses;
                });
            }

            function setDraggable(bDraggable) {

            }

            function setModal(bModal) {

                // No need to be wrapped in an $apply 'cause bModal is not watched.
                oScope.bModal = (!!bModal).toString();
            }

            function setShowCloseBtn(bShowCloseBtn) {

                oScope.$apply(function () {

                    oScope.bShowCloseBtn = (!!bShowCloseBtn).toString();
                });
            }

            function setSize(sSize) {

                oScope.$apply(function () {

                    oScope.sSize = checkSize(sSize);
                });
            }

            function setTemplateUrl(sTemplateUrl) {

                oScope.$apply(function () {

                    oScope.sTemplateUrl = checkTemplateUrl(sTemplateUrl);
                });
            }
        }

        function registerEventListeners(oScope, ngElement) {

            listenOnDataLoading(oScope, ngElement);
            listenOnDataLoaded(oScope, ngElement);
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
    }

}());