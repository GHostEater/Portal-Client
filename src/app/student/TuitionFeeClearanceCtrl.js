/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 25-Oct-18.
 */
angular.module('b')
  .controller('TuitionFeeClearanceCtrl', function (Payment,CurrentUser,PaymentToMajor,lodash,Session,Semester) {
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.semester = Semester.get();
    PaymentToMajor.studentUnEdited({student:vm.user.student.id}).$promise
      .then(function (data) {
        vm.tuition100 = lodash.find(data,{payment_type:{name:"Tuition Fees 100% "+vm.user.student.major.dept.college.acronym},level:{id:vm.user.student.level.id}});
        vm.tuition60 = lodash.find(data,{payment_type:{name:"Tuition Fees 60% "+vm.user.student.major.dept.college.acronym},level:{id:vm.user.student.level.id}});
        vm.tuition40 = lodash.find(data,{payment_type:{name:"Tuition Fees 40% "+vm.user.student.major.dept.college.acronym},level:{id:vm.user.student.level.id}});
        vm.tuition_partial = lodash.find(data,{payment_type:{name:"Tuition Fees Partial"},level:{id:vm.user.student.level.id}});
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
        });
      Payment.student({student:vm.user.student.id}).$promise
        .then(function (data) {
          vm.partial_payments = lodash.filter(data,{payment_type:{name:"Tuition Fees Partial"},session:{id:vm.session.id},level:{id:vm.user.student.level.id},paid:true});
          vm.partial_payments_total = 0;
          angular.forEach(vm.partial_payments,function (pay) {
            vm.partial_payments_total += Number(pay.amount);
          });
          vm.paid60 = lodash.find(data,{payment_type:{name:"Tuition Fees 60% "+vm.user.student.major.dept.college.acronym},session:{id:vm.session.id},level:{id:vm.user.student.level.id},paid:true});
          vm.paid40 = lodash.find(data,{payment_type:{name:"Tuition Fees 40% "+vm.user.student.major.dept.college.acronym},session:{id:vm.session.id},level:{id:vm.user.student.level.id},paid:true});
          vm.paid100 = lodash.find(data,{payment_type:{name:"Tuition Fees 100% "+vm.user.student.major.dept.college.acronym},session:{id:vm.session.id},level:{id:vm.user.student.level.id},paid:true});
          if(!vm.paid60){vm.paid60={amount:0};}
          if(!vm.paid40){vm.paid40={amount:0};}
          if(!vm.paid100){vm.paid100={amount:0};}

          vm.pay_remaining = Number(vm.tuition100.payment_type.amount) - (Number(vm.partial_payments_total)+Number(vm.paid40.amount)+Number(vm.paid60.amount)+Number(vm.paid100.amount));
          vm.pay_remaining_percentage = (vm.pay_remaining/Number(vm.tuition100.payment_type.amount))*100;

          vm.paid = Number(vm.partial_payments_total)+Number(vm.paid40.amount)+Number(vm.paid60.amount)+Number(vm.paid100.amount);
          vm.paid_percentage = (vm.paid/Number(vm.tuition100.payment_type.amount))*100;
        });
    }
  });
