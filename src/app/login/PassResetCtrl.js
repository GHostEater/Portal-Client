/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 13-Dec-18.
 */
angular.module('b')
  .controller('PassResetCtrl', function ($state,toastr,User,$stateParams) {
    var vm = this;
    vm.rand = $stateParams.rand;
    vm.rand2 = $stateParams.rand2;
    if(!vm.rand && !vm.rand2){
      toastr.error("Unauthorized Access");
      $state.go('login');
    }
    vm.error = false;
    vm.reset_pass = reset_pass;
    User.get({id:$stateParams.id}).$promise
      .then(function(data){
        vm.user = data;
      })
      .catch(function () {
        toastr.error("Unauthorized Access");
        $state.go('login');
      });

    function reset_pass() {
      if(vm.password === vm.password2){
        vm.user.password = vm.password;
        delete vm.user.img;
        delete vm.user.sign;
        User.patch(vm.user).$promise
          .then(function (data) {
            vm.user = data;
            toastr.success("Password Reset Successfully");
            $state.go('login');
          })
          .catch(function () {
            toastr.error("Unable to Reset Password");
          });
      }
      else{
        vm.error = true;
      }
    }
  });
