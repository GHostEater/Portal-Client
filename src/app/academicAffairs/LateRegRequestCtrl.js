angular.module('b')
  .controller('LateRegRequestCtrl',function (CurrentUser,LateReg,lodash,toastr,SystemLog) {
    var vm = this;
    function getLateReg() {
     LateReg.query().$promise
      .then(function (data) {
        vm.requests = lodash.filter(data,{status:0});
      });
    }getLateReg();
    vm.processLate = processLate;

    function processLate(request) {
      var data = {
        id: request.id,
        status: 1
      };
      LateReg.patch(data).$promise
        .then(function () {
          var data = {
            student: request.student.id,
            approvedBy: CurrentUser.profile.id,
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
