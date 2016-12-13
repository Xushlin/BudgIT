'use strict';

angular.module('forefrontContactsApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('/adminuser', {
            url: '/adminuser?userId&eventId',
            templateUrl: '/Client/app/Routes/admin/user/adminuser.html',
            controller: 'AdminUserController',
            controllerAs: 'adminuser'
        });
  });
