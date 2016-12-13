'use strict';

angular.module('forefrontContactsApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('/adminsettings', {
            url: '/admin/settings',
            templateUrl: '/Client/app/Routes/admin/settings/settings.html',
            controller: 'AdminSettingsController',
            controllerAs: 'settings'
        });
  });
