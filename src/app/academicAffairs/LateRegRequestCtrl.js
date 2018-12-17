/* eslint-disable angular/controller-name */
angular.module('b')
  .controller('LateRegRequestCtrl',function (CurrentUser,LateReg,lodash,toastr,SystemLog,Access,Session,Semester) {
    Access.notStudent();
    Session.getCurrent().$promise
      .then(function (data) {
        vm.session = data;
        getSemester();
      });
    function getSemester() {
      Semester.get().$promise
        .then(function (data) {
          vm.semester = data;
          getLateReg();
        });
    }
    var vm = this;
    function getLateReg() {
     LateReg.query().$promise
      .then(function (data) {
        vm.requests = lodash.filter(data,{session:{id:vm.session.id},semester:vm.semester.semester});
      });
    }
    vm.processLate = processLate;
    vm.decline = decline;

    function decline(request) {
      var req = {
        id: request.id
      };
      LateReg.remove(req).$promise
        .then(function () {
          toastr.success("Late Registration Declined");
          SystemLog.add("Declined Late Registration");
          getLateReg();
        });
    }
    function processLate(request) {
      var data = {
        id: request.id,
        status: 1
      };
      LateReg.patch(data).$promise
        .then(function () {
          var data = {
            student: request.student.id,
            approved_by: CurrentUser.profile.id,
            date: new Date()
          };
          LateReg.addLog(data).$promise
            .then(function () {
              toastr.success("Approval Logged");
            });
          toastr.success("Late Registration Approved");
          SystemLog.add("Approved Late Registration");
          getLateReg();
        });
    }
  });
