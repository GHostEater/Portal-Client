/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 16-Dec-18.
 */
angular.module('b')
  .controller('ExtraUnitRequestCtrl', function (CurrentUser,ExtraUnit,lodash,toastr,SystemLog,Access,Session,Semester) {
    Access.notStudent();
    var vm = this;
    vm.pending = true;
    vm.approved = false;
    vm.paid = false;
    vm.process = process;
    vm.decline = decline;
    vm.change_view = change_view;
    Session.getCurrent().$promise
      .then(function (data) {
        vm.session = data;
        getSemester();
      });
    function getSemester() {
      Semester.get().$promise
        .then(function (data) {
          vm.semester = data;
          getExtraUnit();
        });
    }
    function getExtraUnit() {
     ExtraUnit.query().$promise
      .then(function (data) {
        vm.requests = lodash.filter(data,{session:{id:vm.session.id},semester:vm.semester.semester});
      });
    }

    function change_view(view) {
      vm.pending = false;
      vm.approved = false;
      if(view === 'pending'){
        vm.pending = true;
      }
      if(view === 'approved'){
        vm.approved = true;
      }
    }
    function decline(request) {
      var req = {
        id: request.id
      };
      ExtraUnit.remove(req).$promise
        .then(function () {
          toastr.success("Extra Unit Request Declined");
          SystemLog.add("Declined Extra Unit Request");
          getExtraUnit();
        });
    }
    function process(request) {
      var data = {
        id: request.id,
        status: 1
      };
      ExtraUnit.patch(data).$promise
        .then(function () {
          var data = {
            student: request.student.id,
            handled_by: CurrentUser.profile.id,
            date: new Date()
          };
          ExtraUnit.addLog(data).$promise
            .then(function () {
              toastr.success("Approval Logged");
            });
          toastr.success("Extra Unit Request Approved");
          SystemLog.add("Approved Extra Unit Request");
          getExtraUnit();
        });
    }
  });
