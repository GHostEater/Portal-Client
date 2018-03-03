/**
 * Created by GHostEater on 20-Feb-16.
 */
(function () {
    'use strict';
angular.module("b")
  .controller("HeaderController",function(CurrentUser,$rootScope,$window,SystemLog){
    var vm = this;
    vm.user = CurrentUser.profile;

    vm.logOut = function(){
      SystemLog.add("Logout");
      CurrentUser.logOut();
      delete vm.user;
      delete $rootScope.user;
      $window.location.reload();
    };
  });
})();
