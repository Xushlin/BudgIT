'use strict';

angular.module('forefrontContactsApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('/adminevent', {
            url: '/adminevent/:id',
            templateUrl: '/Client/app/Routes/admin/event/adminevent.html',
            controller: 'AdminEventController',
            controllerAs: 'adminevent'
        });
  });
