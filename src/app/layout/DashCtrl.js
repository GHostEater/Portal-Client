/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 25-Oct-18.
 */
angular.module('b')
  .controller('DashCtrl',function (CourseReview,Payment,Session,Semester,CurrentUser,$rootScope,PaymentType,lodash) {
    var vm = this;
    vm.user = CurrentUser.profile;
    Semester.get().$promise
      .then(function (data) {
        vm.semester = data;
        AccessFee();
      });
    PaymentType.query().$promise
      .then(function (data) {
        vm.tuition_fee = lodash.find(data,{tuition:true});
      });
    function AccessFee() {
      Payment.access_fee_restrict({student:vm.user.student.id}).$promise
        .then(function (data) {
          vm.access_fee_paid = data.paid;
        });
      Payment.tuition_fee_clearance({student:vm.user.student.id}).$promise
        .then(function (data) {
          vm.payments = data.payments;
          vm.pay_status = data.pay_status;
        });
    }
    $rootScope.$on('paymentMade',function(){
      if(vm.user.student){
          AccessFee();
        }
    })
  });
