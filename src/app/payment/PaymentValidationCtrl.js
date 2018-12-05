/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 03-Dec-18.
 */
angular.module('b')
  .controller('PaymentValidationCtrl', function (Payment,CurrentUser,Access) {
    Access.student();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.check_status = check_status;
    function getPayments() {
     Payment.student({student:vm.user.student.id}).$promise
      .then(function (data) {
        vm.payments = [];
        angular.forEach(data,function (pay) {
          if((pay.rrr !== null || '') && (pay.paid === false)){
            vm.payments.push(pay);
          }
        });
      });
    }getPayments();
    function check_status(pay) {
      Payment.get_status({rrr:pay.rrr}).$promise
        .then(function () {
          getPayments();
        });
    }
  });
