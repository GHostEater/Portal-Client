/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 17-Dec-18.
 */
angular.module('b')
  .controller('TransferStudentModalCtrl', function (request,Session,College,Dept,Major,Student,toastr,$uibModalInstance,SystemLog,CurrentUser) {
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.colleges = College.query();
    vm.depts = Dept.query();
    vm.majors = Major.query();
    vm.request = request;
    vm.session = Session.getCurrent();
    vm.college = request.major.dept.college;
    vm.dept = request.major.dept;
    vm.major = request.major;
    vm.level = request.student.level;

    vm.ok = function () {
      if(vm.form.$dirty && vm.form.$valid){
        var request = {
          major: vm.major.id,
          level: vm.level.id
        };
        Student.patch(request).$promise
          .then(function () {
            SystemLog.add("Transferred Student");
            toastr.success("Transferred Student");
            $uibModalInstance.close();
          }).catch(function () {
            toastr.warning("Unable to Transfer Student");
          });
      }
      else if(vm.form.$pristine && vm.form.$valid){
        toastr.info("No Changes");
        $uibModalInstance.close();
      }
      else if(vm.form.$invalid){
        toastr.error("Errors in form");
      }
    };
  });
