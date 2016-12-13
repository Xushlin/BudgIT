(function () {
    'use strict';

    var app = angular.module('forefrontContactsApp', ['forefrontContactsApp.controllers', 'forefrontContactsApp.services',
        'ui.bootstrap',
        "ui.router",
        'ngTagsInput',
        'colorpicker.module',
        'LocalStorageModule',
        "angularFileUpload",
        "AdalAngular"
    ]).constant("appSettings", {
        serverPath: ""//"http://localhost:1079/"
    });


    //angular.module('holdCoApp.filters', []);
    angular.module('forefrontContactsApp.services', []);
    angular.module('forefrontContactsApp.controllers', []);

    app.run(['$rootScope', '$location', '$state', function ($rootScope,$location, $state) {
        //FastClick.attach(document.body);
        //$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        ////        // get me a login modal!
        //       $state.go('/login');

        //});
        $rootScope.username = '';
        $rootScope.checkCount = 0;
        $rootScope.perPageCountForEvent = 10;
        $rootScope.matchesRoute = function () {
            for (var i = 0; i < arguments.length; i++) {
                if ($location.path() === arguments[i]) {
                    return true;
                }
            }
            return false;
        };
    }]);

    app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'adalAuthenticationServiceProvider', '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, adalProvider, $httpProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('/start', {
                url: "/",
                templateUrl: '/Client/app/Routes/login/login.html',
                controller: 'LoginController',
                controllerAs: 'loginCtrl'
                        });

        adalProvider.init(
       {
           instance: 'https://login.microsoftonline.com/',
           tenant: 'ffcg.se',
           clientId: '77cae03e-128d-48ab-b1ae-ff07ed0d1400',
           extraQueryParameter: 'nux=1',
           //cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
       },
       $httpProvider
       );
        /*
      $routeProvider
        .otherwise({
            redirectTo: '',
            controller: 'HomeCtrl',
            controllerAs: 'dashboard',
          templateUrl: '/ClientApp/Routes/home/home.html'
        });
      */
        //$locationProvider.html5Mode({
        //    enabled: true, requireBase: false
        //});
    }]);

})();
