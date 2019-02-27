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
    vm.paid_list = false;
    vm.unpaid_list = false;
    vm.level = null;
    vm.major = null;
    vm.dept = null;
    vm.college = null;

    PaymentType.student().$promise
      .then(function (data) {
        vm.payment_types = data;
      });

    function getPaid() {
      vm.paid_list = true;
      vm.unpaid_list = false;
      var request = {
        session: vm.session.id,
        payment_type: vm.payment_type.id
      };
      if(vm.level !== null ){
        request.level = vm.level.id;
      }
      if(vm.major !== null){
        request.major = vm.major.id;
      }
      if(vm.dept !== null ){
        request.dept = vm.dept.id;
      }
      if(vm.college !== null ){
        request.college = vm.college.id;
      }
      Payment.getPaid(request).$promise
        .then(function (data) {
          vm.students = data;
          vm.total_owing = 0;
          angular.forEach(vm.students,function (student) {
            vm.total_owing += Number(student.owing);
          });
        });
    }
    function getUnPaid() {
      vm.paid_list = false;
      vm.unpaid_list = true;
      var request = {
        session: vm.session.id,
        payment_type: vm.payment_type.id
      };
      if(vm.level !== null ){
        request.level = vm.level.id;
      }
      if(vm.major !== null){
        request.major = vm.major.id;
      }
      if(vm.dept !== null ){
        request.dept = vm.dept.id;
      }
      if(vm.college !== null ){
        request.college = vm.college.id;
      }
      Payment.getUnPaid(request).$promise
        .then(function (data) {
          vm.students = data;
          vm.total_owing = 0;
          angular.forEach(vm.students,function (student) {
            vm.total_owing += Number(student.owing);
          });
        });
    }
  });
