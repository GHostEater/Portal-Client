/* eslint-disable angular/controller-name */
/**
 * Created by DELL on 02-Jul-19.
 */
angular.module('b')
  .controller('StudentSummerPaymentCtrl', function (PaymentType,lodash,$state) {
    var vm = this;
    vm.pay = 0;
    vm.narration = '';
    vm.pay_summer = pay_summer;
    PaymentType.query().$promise
      .then(function (data) {
        vm.summer = lodash.find(data,{tag:'summer'});
      });

    function pay_summer() {
      if(vm.narration !== "" && vm.pay !== 0){
        $state.go("student_pay",{payment:vm.summer.id,amount:vm.pay,narration:vm.narration});
      }
    }
  });
