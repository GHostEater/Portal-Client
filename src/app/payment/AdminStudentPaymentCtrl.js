/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 14-Nov-18.
 */
angular.module('b')
  .controller('AdminStudentPaymentCtrl', function (Level,CurrentUser,User,lodash,Access,$stateParams,Student,SystemLog,toastr,PaymentWaving,PaymentType,Session,PaymentToMajor,Payment) {
    Access.notStudent();
    var vm = this;
    vm.user = CurrentUser.profile;
    Student.get({user:$stateParams.user}).$promise
      .then(function (data) {
        vm.student = data;
        getPaymentType();
      });
    vm.check_status = check_status;
    vm.wavePayment = wavePayment;
    vm.unWavePayment = unWavePayment;
    vm.levels = Level.query();
    function getPaymentType() {
      PaymentType.query().$promise
        .then(function (data) {
          vm.tuition_fee = lodash.find(data,{tuition:true});
        });
      PaymentType.tuition_student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.tuition_total = data.total;
          vm.tuition_first = data.first;
          vm.tuition_second = data.second;
          getSession();
        });
    }
    function getSession() {
      Session.getCurrent().$promise
        .then(function (data) {
          vm.session = data;
          getPayments();
        });
    }
    function getPayments() {
      PaymentWaving.student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.waved_payments = data;
        });
      vm.expected_payments = PaymentToMajor.student({student:vm.student.id,session:vm.session.id});
      Payment.student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.payments = data;
          vm.tuition_payments = lodash.filter(vm.payments,{payment_type:{tuition:true},level:{id:vm.student.level.id},paid:true});
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

          if(lodash.find(vm.waved_payments,{payment_type:{tuition:true},level:{id:vm.student.level.id}})){
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
    function wavePayment(id,level){
      var request = {};
      if(vm.user.type === '1'){
        request = {
          payment_type: id,
          student: vm.student.id,
          level: level
        };
      }
      else if(vm.user.type === '3'){
        request = {
          payment_type: id,
          student: vm.student.id,
          waved_by: vm.user.bursar.id,
          level: level
        };
      }
      PaymentWaving.save(request).$promise
        .then(function () {
          toastr.success("Payment Waved");
          SystemLog.add("Waved Payment");
          getPayments();
        })
        .catch(function(){
          toastr.warning("Unable to Wave Payment");
        });

    }
    function unWavePayment(id){
      PaymentWaving.remove({id:id}).$promise
        .then(function () {
          toastr.success("Payment Waving Removed");
          SystemLog.add("Removed Payment Waving");
          getPayments();
        })
        .catch(function(){
          toastr.warning("Unable to Remove Payment Waving");
        });

    }
  });
