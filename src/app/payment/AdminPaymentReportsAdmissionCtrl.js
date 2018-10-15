/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 01-May-18.
 */
angular.module('b')
  .controller('AdminPaymentReportsAdmissionCtrl',function (Access,PaymentType,Payment,Session) {
    Access.general();
    var vm = this;
    vm.sessions = Session.query();
    vm.session = Session.getCurrent();
    vm.getPaid = getPaid;
    vm.getUnPaid = getUnPaid;

    PaymentType.admission().$promise
      .then(function (data) {
        vm.payment_types = data;
      });

    function getPaid() {
      delete vm.payments;
      delete vm.students;
      var request = {
        session: vm.session.id,
        payment_type: vm.payment_type.id
      };
      Payment.getPaidAdmission(request).$promise
        .then(function (data) {
          vm.payments = data;
        });
    }
    function getUnPaid() {
      delete vm.payments;
      delete vm.students;
      var request = {
        session: vm.session.id,
        payment_type: vm.payment_type.id
      };
      Payment.getUnPaidAdmission(request).$promise
        .then(function (data) {
          vm.students = data;
        });
    }
  });
