angular.module('b').run(runBlock);
  function runBlock(CurrentUser,$rootScope,$location,Student) {
    if(!CurrentUser.profile.loggedIn){
      $location.url('/');
    }
    else{
      $rootScope.user = CurrentUser.profile;
    }
    $rootScope.date = new Date();
    Student.autoWithdraw();
  }
