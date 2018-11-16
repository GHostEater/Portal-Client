/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 26-Mar-18.
 */
angular.module('b')
  .controller('StudentPaymentCtrl',function (Payment,Session,PaymentType,PaymentToMajor,PaymentWaving,CurrentUser,Semester,Access,lodash,Level) {
    Access.student();
    var vm = this;
    vm.semester = Semester.get();
    vm.user = CurrentUser.profile;
    vm.levels = Level.query();
    vm.partial_pay = 0;
    vm.partial_pay2 = 0;
    vm.custom_pay = false;
    vm.custom_pay2 = false;
    vm.check_status = check_status;
    PaymentType.query().$promise
      .then(function (data) {
        vm.tuition_fee = lodash.find(data,{tuition:true});
      });
    PaymentType.tuition_student({student:vm.user.student.id}).$promise
      .then(function (data) {
        vm.tuition_total = data.total;
        vm.tuition_first = data.first;
        vm.tuition_second = data.second;
        getSession();
      });
    function getSession() {
      Session.getCurrent().$promise
        .then(function (data) {
          vm.session = data;
          getPayments();
        });
    }
    function getPayments() {
      PaymentWaving.student({student:vm.user.student.id}).$promise
        .then(function (data) {
          vm.waved_payments = data;
        });
      vm.expected_payments = PaymentToMajor.student({student:vm.user.student.id,session:vm.session.id});
      Payment.student({student:vm.user.student.id}).$promise
        .then(function (data) {
          vm.payments = data;
          vm.tuition_payments = lodash.filter(vm.payments,{payment_type:{tuition:true},level:{id:vm.user.student.level.id},paid:true});
          vm.tuition_payments_total = 0;
          angular.forEach(vm.tuition_payments,function (pay) {
            vm.tuition_payments_total += Number(pay.amount);
          });
          if(vm.tuition_payments_total >= vm.tuition_first){
            vm.paid_first = true;
          }
          if(vm.tuition_payments_total >= vm.tuition_second){
            vm.paid_second = true;
          }
          if(vm.tuition_payments_total >= vm.tuition_total){
            vm.paid_total = true;
          }
          if(!vm.paid_first){vm.paid_first=false;}
          if(!vm.paid_second){vm.paid_second=false;}
          if(!vm.paid_total){vm.paid_total=false;}

          vm.pay_remaining = Number(vm.tuition_total) - Number(vm.tuition_payments_total);
          vm.pay_remaining_percentage = (vm.pay_remaining/Number(vm.tuition_total))*100;

          vm.paid = Number(vm.tuition_payments_total);
          vm.paid_percentage = (vm.paid/Number(vm.tuition_total))*100;

          if(lodash.find(vm.waved_payments,{payment_type:{tuition:true},level:{id:vm.user.student.level.id}})){
            vm.pay_remaining = 0;
            vm.pay_remaining_percentage = (vm.pay_remaining/Number(vm.tuition_total))*100;

            vm.paid = Number(vm.tuition_total);
            vm.paid_percentage = (vm.paid/Number(vm.tuition_total))*100;
          }
        });
    }
    function check_status(pay) {
      Payment.get_status({rrr:pay.rrr}).$promise
        .then(function () {
          getPayments();
        });
    }
  });
