/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 26-Feb-19.
 */
angular.module('b')
  .controller('StudentFinePaymentCtrl', function (PaymentType,lodash) {
    var vm = this;
    vm.partial_pay = 0;
    vm.custom_pay = false;
    PaymentType.query().$promise
      .then(function (data) {
        vm.fine = lodash.find(data,{tag:'fine'});
      });
  });
