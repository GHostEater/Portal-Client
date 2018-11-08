/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 26-Apr-18.
 */
angular.module('b')
  .controller('AdminPaymentReportsCtrl',function (Access,PaymentType,Payment,College,Major,Dept,Session,Level) {
    Access.general();
    var vm = this;
    vm.colleges = College.query();
    vm.depts = Dept.query();
    vm.majors = Major.query();
    vm.sessions = Session.query();
    vm.session = Session.getCurrent();
    vm.levels = Level.query();
    vm.getPaid = getPaid;
    vm.getUnPaid = getUnPaid;

    PaymentType.student().$promise
      .then(function (data) {
        vm.payment_types = data;
      });

    function getPaid() {
      delete vm.payments;
      delete vm.students;
      var request = {
        session: vm.session.id,
        major: vm.major.id,
        level: vm.level.id,
        payment_type: vm.payment_type.id
      };
      Payment.getPaid(request).$promise
        .then(function (data) {
          vm.payments = data;
        });
    }
    function getUnPaid() {
      delete vm.payments;
      delete vm.students;
      var request = {
        session: vm.session.id,
        major: vm.major.id,
        level: vm.level.id,
        payment_type: vm.payment_type.id
      };
      Payment.getUnPaid(request).$promise
        .then(function (data) {
          vm.students = data;
        });
    }
  });
