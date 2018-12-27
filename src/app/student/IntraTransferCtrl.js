/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 14-Dec-18.
 */
angular.module('b')
  .controller('IntraTransferCtrl', function (CurrentUser,Payment,PaymentType,IntraUni,$uibModal,Access,Session,lodash,Semester) {
    Access.student();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.paid_transfer = false;
    vm.request_transfer = request_transfer;

    Session.getCurrent().$promise
      .then(function (data) {
        vm.session = data;
        getSemester();
      });
    function getSemester () {
      Semester.get().$promise
        .then(function (data) {
          vm.semester = data;
          getTransfer();
        });
    }
    function getTransfer() {
      IntraUni.query().$promise
        .then(function (data) {
          vm.transfer = lodash.find(data,{student:{id:vm.user.student.id},session:{id:vm.session.id}});
          getPayment();
        });
    }
    function getPayment() {
      PaymentType.query().$promise
        .then(function (data) {
          vm.payment_type = lodash.find(data,{tag:'intra_uni'});
          Payment.student({student:vm.user.student.id}).$promise
            .then(function (data) {
              vm.payment = lodash.find(data,{payment_type:{id:vm.payment_type.id},level:{id:vm.user.student.level.id},paid:true});
              if(vm.payment){
                vm.paid_transfer = true;
                if(vm.transfer.paid === false){
                  IntraUni.patch({id:vm.transfer.id, paid:true});
                }
              }
            });
        });
    }
    function request_transfer() {
      var options = {
        templateUrl: 'app/student/request_transfer_modal.html',
        controller: "RequestTransferModalController",
        controllerAs: 'vm',
        size: 'md'
      };
      $uibModal.open(options).result
        .then(function(){
          getTransfer();
        });
    }
  });
