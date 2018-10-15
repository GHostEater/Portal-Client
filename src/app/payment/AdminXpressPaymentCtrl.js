/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 19-Feb-18.
 */
angular.module('b')
  .controller('AdminXpressPaymentCtrl',function (Payment,Access) {
    Access.admin();
    var vm = this;
    vm.payments = Payment.query();
  });
