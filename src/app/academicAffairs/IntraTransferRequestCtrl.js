/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 17-Dec-18.
 */
angular.module('b')
  .controller('IntraTransferRequestCtrl', function (CurrentUser,IntraUni,lodash,toastr,SystemLog,Access,Session,Semester,$uibModal) {
    Access.notStudent();
    var vm = this;
    vm.pending = true;
    vm.approved = false;
    vm.paid = false;
    vm.process = process;
    vm.decline = decline;
    vm.change_view = change_view;
    vm.transfer = transfer;
    Session.getCurrent().$promise
      .then(function (data) {
        vm.session = data;
        getSemester();
      });
    function getSemester() {
      Semester.get().$promise
        .then(function (data) {
          vm.semester = data;
          getIntraUni();
        });
    }
    function getIntraUni() {
     IntraUni.query().$promise
      .then(function (data) {
        vm.requests = lodash.filter(data,{session:{id:vm.session.id}});
      });
    }

    function change_view(view) {
      vm.pending = false;
      vm.approved = false;
      vm.paid = false;
      if(view === 'pending'){
        vm.pending = true;
      }
      if(view === 'approved'){
        vm.approved = true;
      }
      if(view === 'paid'){
        vm.paid = true;
      }
    }
    function decline(request) {
      var req = {
        id: request.id
      };
      IntraUni.remove(req).$promise
        .then(function () {
          toastr.success("Intra-University Transfer Request Declined");
          SystemLog.add("Declined Intra-University Transfer Request");
          getIntraUni();
        });
    }
    function process(request) {
      var data = {
        id: request.id,
        status: 1,
        handled_by: CurrentUser.profile.id
      };
      IntraUni.patch(data).$promise
        .then(function () {
          toastr.success("Intra-University Transfer Request Approved");
          SystemLog.add("Approved Intra-University Transfer Request");
          getIntraUni();
        });
    }
    function transfer(request) {
      var options = {
        templateUrl: 'app/academicAffairs/transfer_student_modal.html',
        controller: "TransferStudentModalCtrl",
        controllerAs: 'vm',
        size: 'lg',
        resolve:{
          request:function () {
            return request
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
          getIntraUni();
        });
    }
  });
