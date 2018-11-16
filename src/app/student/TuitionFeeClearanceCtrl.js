/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 25-Oct-18.
 */
angular.module('b')
  .controller('TuitionFeeClearanceCtrl', function (Access,Payment,CurrentUser,PaymentType,lodash,Session,Semester,$window) {
    Access.student();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.print = print;
    vm.semester = Semester.get();
    PaymentType.query().$promise
      .then(function (data) {
        vm.tuition_fee = lodash.find(data,{tuition:true});
      });
    PaymentType.tuition_student({student:vm.user.student.id}).$promise
      .then(function (data) {
        vm.tuition_total = data.total;
        vm.tuition_first = data.first;
        vm.tuition_second = data.second;
        Session.getCurrent().$promise
          .then(function (data) {
            vm.session = data;
            getClearance();
          });
      });
    function getClearance() {
      Payment.tuition_fee_clearance({student:vm.user.student.id}).$promise
        .then(function (data) {
          vm.payments = data.payments;
          vm.pay_status = data.pay_status;
          vm.waved_payments = data.waved_payments;
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
    function print(){
      $window.print();
    }
  });
