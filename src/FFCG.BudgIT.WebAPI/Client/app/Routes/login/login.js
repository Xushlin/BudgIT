'use strict';

angular.module('forefrontContactsApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('/login', {
            url: '/login',
            templateUrl: '/Client/app/Routes/login/login.html',            
            controllerAs: 'loginCtrl',
            controller: 'LoginController'
        });
  });
