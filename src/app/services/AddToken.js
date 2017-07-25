angular.module('b')
    .factory('AddToken', function (CurrentUser, $q) {
      function request(config){
        if (CurrentUser.profile.loggedIn){
          config.headers.Authorization = "JWT "+CurrentUser.profile.token;
        }
        return $q.when(config);
      }
      return {
        request: request
      }
    })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('AddToken');
  });
