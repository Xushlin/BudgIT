'use strict';

angular.module('forefrontBudgitApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('/user', {
            url: '/user?userId&eventId',
            templateUrl: '/Client/app/Routes/user/user.html',
            controller: 'UserController',
            controllerAs: 'user'
        });
  });
