/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 11-Dec-18.
 */
angular.module('b')
  .controller('AcceptanceFormCtrl', function (CurrentUser,Access,$window) {
    Access.student();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.print = print;

    function print(){
      $window.print();
    }
  });
