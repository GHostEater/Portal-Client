/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 26-Mar-18.
 */
angular.module('b')
  .controller('StudentPaymentCtrl',function (Payment,Session,PaymentToMajor,CurrentUser,Semester,Access,lodash,Level) {
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
    PaymentToMajor.studentUnEdited({student:vm.user.student.id}).$promise
      .then(function (data) {
        vm.tuition100 = lodash.find(data,{payment_type:{name:"Tuition Fees 100%"},level:{id:vm.user.student.level.id}});
        vm.tuition60 = lodash.find(data,{payment_type:{name:"Tuition Fees 60%"},level:{id:vm.user.student.level.id}});
        vm.tuition40 = lodash.find(data,{payment_type:{name:"Tuition Fees 40%"},level:{id:vm.user.student.level.id}});
        vm.tuition_partial = lodash.find(data,{payment_type:{name:"Tuition Fees Partial"},level:{id:vm.user.student.level.id}});

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
      vm.expected_payments = PaymentToMajor.student({student:vm.user.student.id,session:vm.session.id});
      Payment.student({student:vm.user.student.id}).$promise
      .then(function (data) {
        vm.payments = data;
        vm.partial_payments = lodash.filter(data,{payment_type:{name:"Tuition Fees Partial"},session:{id:vm.session.id},level:{id:vm.user.student.level.id},paid:true});
        vm.partial_payments_total = 0;
        angular.forEach(vm.partial_payments,function (pay) {
          vm.partial_payments_total += Number(pay.amount);
        });
        vm.paid60 = lodash.find(data,{payment_type:{name:"Tuition Fees 60%"},session:{id:vm.session.id},level:{id:vm.user.student.level.id},paid:true});
        vm.paid40 = lodash.find(data,{payment_type:{name:"Tuition Fees 40%"},session:{id:vm.session.id},level:{id:vm.user.student.level.id},paid:true});
        vm.paid100 = lodash.find(data,{payment_type:{name:"Tuition Fees 100%"},session:{id:vm.session.id},level:{id:vm.user.student.level.id},paid:true});
        if(!vm.paid60){vm.paid60={amount:0};}
        if(!vm.paid40){vm.paid40={amount:0};}
        if(!vm.paid100){vm.paid100={amount:0};}

        vm.pay_remaining = Number(vm.tuition100.payment_type.amount) - (Number(vm.partial_payments_total)+Number(vm.paid40.amount)+Number(vm.paid60.amount)+Number(vm.paid100.amount));
        vm.pay_remaining_percentage = (vm.pay_remaining/Number(vm.tuition100.payment_type.amount))*100;

        vm.paid = Number(vm.partial_payments_total)+Number(vm.paid40.amount)+Number(vm.paid60.amount)+Number(vm.paid100.amount);
        vm.paid_percentage = (vm.paid/Number(vm.tuition100.payment_type.amount))*100;
      });
    }
    function check_status(pay) {
      Payment.get_status({rrr:pay.rrr}).$promise
        .then(function () {
          getPayment();
        });
    }
  });
