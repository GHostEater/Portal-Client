angular.module('b')
  .factory('VerifyToken', function (CurrentUser,$q) {
    function responseError(rejection) {
      if(CurrentUser.profile.loggedIn){
        if(rejection.status === 401){
          CurrentUser.logOut();
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
