/**
 * Created by GHostEater on 20-Feb-16.
 */
(function () {
    'use strict';
angular.module("b")
  .controller("HeaderController",function(CurrentUser,$rootScope,$state,SystemLog,$interval){
    var vm = this;
    $rootScope.date = Date.now();
    vm.user = CurrentUser.profile;
    function tick() {
      $rootScope.date = Date.now();
    }
    $interval(tick,1000);

    vm.logOut = function(){
      SystemLog.add("Logout");
      delete vm.user;
      CurrentUser.logOut();
    };
  });
})();
