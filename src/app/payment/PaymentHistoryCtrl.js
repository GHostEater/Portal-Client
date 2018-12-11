/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 03-Dec-18.
 */
angular.module('b')
  .controller('PaymentHistoryCtrl', function (Payment,CurrentUser,Access,$rootScope) {
    Access.student();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.check_status = check_status;
    function getPayments() {
     Payment.student({student:vm.user.student.id}).$promise
      .then(function (data) {
        vm.payments = data;
      });
    }getPayments();
    function check_status(pay) {
      Payment.get_status({rrr:pay.rrr}).$promise
        .then(function () {
          getPayments();
          $rootScope.$broadcast('paymentMade');
        });
    }
  });
