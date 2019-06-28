/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 26-Feb-19.
 */
angular.module('b')
  .controller('StudentFinePaymentCtrl', function (PaymentType,lodash,$state) {
    var vm = this;
    vm.pay = 0;
    vm.narration = '';
    vm.pay_fine = pay_fine;
    PaymentType.query().$promise
      .then(function (data) {
        vm.fine = lodash.find(data,{tag:'fine'});
      });

    function pay_fine() {
      if(vm.narration !== "" && vm.pay !== 0){
        $state.go("student_pay",{payment:vm.fine.id,amount:vm.pay,narration:vm.narration});
      }
    }
  });
