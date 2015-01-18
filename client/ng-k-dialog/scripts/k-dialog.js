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
        kDialogDefaults = {
            CONFIG: {
                bCloseOnEsc: true,
                bDraggable: false,
                bModal: true,
                bShowCloseBtn: true,
                sSize: 'medium'
            }
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
        .constant('kDialogSizes', kDialogSizes)
        .service('kDialogService', kDialogService)
        .directive('kDialog', kDialog);

    kDialogService.$inject = [
        'kDialogDefaults',
        'kDialogEvents',
        '$compile',
        '$rootScope',
        '$q',
        '$timeout'
    ];

    kDialog.$inject = [
        'kDialogClassNames',
        'kDialogEvents',
        'kDraggableService',
        '$document'
    ];

    function kDialogService(kDD,
                            kDE,
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
         *      bCloseOnEsc: {boolean}
         *      bDraggable: {boolean}
         *      bModal: {boolean}
         *      bOpenUponInit: {boolean}
         *      bShowCloseBtn: {boolean}
         *      oScope: {Object}
         *      sDialogClass: {string}
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

            if (oConfig.bOpenUponInit === true) {

                oInstance.open();
            }
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
                setDialogClass: setDialogClass,
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

            function setDialogClass(sDialogClass) {

                oPromise.then(function (oScope) {

                    $timeout(function () {

                        oScope.setDialogClass(sDialogClass);
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
                     kDE,
                     kDraggableService,
                     $document) {

        return {
            link: function (scope, element) {

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

                        if (ngDraggableElement.disableDraggable) {

                            ngDraggableElement.disableDraggable();
                        }
                    }
                });

                scope.$watch('sDialogClass', function (sNewValue, sOldValue) {

                    element
                        .children('.' + kDCN.DIALOG)
                        .removeClass(sOldValue)
                        .addClass(sNewValue);
                });

                scope.$emit(kDE.DIALOG_INITIALIZED, scope);

                function onEscKey(oEvent) {

                    if (oEvent.keyCode === 27) {
                        // The Esc key
                        scope.close();
                    }
                }
            },
            restrict: 'EA',
            scope: {
                bCloseOnEsc: '@closeOnEsc',
                bDraggable: '@draggable',
                bModal: '@modal',
                bShowCloseBtn: '@showCloseBtn',
                sDialogClass: '@dialogClass',
                sSize: '@size',
                sTemplateUrl: '@templateUrl'
            },
            templateUrl: '../templates/k-dialog.tpl.html'
        };

        function checkScopeProperties(oScope) {

            oScope.sDialogClass = checkDialogClass(oScope.sDialogClass);
            oScope.sSize = checkSize(oScope.sSize);
            oScope.sTemplateUrl = checkTemplateUrl(oScope.sTemplateUrl);
        }

        function checkDialogClass(sDialogClass) {

            return angular.isString(sDialogClass) ? sDialogClass : '';
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
                setDialogClass: setDialogClass,
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

            function setDialogClass(sDialogClass) {

                oScope.$apply(function () {

                    oScope.sDialogClass = checkDialogClass(sDialogClass);
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