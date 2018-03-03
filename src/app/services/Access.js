/**
 * Created by GHostEater on 02-Sep-16.
 */
angular.module('b')
  .factory("Access", function (toastr,$state,CurrentUser,$rootScope) {
    function admin() {
      if(CurrentUser.profile.type !== '1'){
        $state.go("login");
        toastr.error('Unauthorized Access');
      }
    }
    function lecturer() {
      if(CurrentUser.profile.type !== '6'){
        $state.go("login");
        toastr.error('Unauthorized Access');
      }
    }
    function student() {
      if(CurrentUser.profile.type !== '7'){
        $state.go("login");
        toastr.error('Unauthorized Access');
      }
    }
    function general() {
      if(!CurrentUser.profile.id || !$rootScope.user.id){
        $state.go("login");
        toastr.error('Unauthorized Access');
      }
    }
    return{
      admin: admin,
      lecturer: lecturer,
      student: student,
      general: general
    };
  });
