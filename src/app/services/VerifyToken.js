angular.module('b')
  .factory('VerifyToken', function (CurrentUser,$q,$window) {
    function responseError(rejection) {
      if(CurrentUser.profile.loggedIn){
        if(rejection.status === 401){
          CurrentUser.logOut();
          $window.location.reload();
        }
      }
      return $q.reject(rejection);
    }
    return {
      responseError: responseError
    };
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('VerifyToken');
  });
