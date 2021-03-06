/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 17-Dec-18.
 */
angular.module('b')
  .controller('TransferStudentModalCtrl', function (request,Session,College,Dept,Major,Level,IntraUni,toastr,$uibModalInstance,SystemLog,CurrentUser) {
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.colleges = College.query();
    vm.depts = Dept.query();
    vm.majors = Major.query();
    vm.levels = Level.query();
    vm.request = request;
    vm.session = Session.getCurrent();
    vm.college = request.major.dept.college;
    vm.dept = request.major.dept;
    vm.major = request.major;
    vm.level = request.student.level;

    vm.ok = function () {
      if(vm.form.$valid){
        var request = {
          student: vm.request.student.id,
          major: vm.major.id,
          level: vm.level.id
        };
        IntraUni.transfer_student(request).$promise
          .then(function () {
            SystemLog.add("Transferred Student");
            toastr.success("Transferred Student");
            $uibModalInstance.close();
          }).catch(function () {
            toastr.warning("Unable to Transfer Student");
          });
      }
      else if(vm.form.$invalid){
        toastr.error("Errors in form");
      }
    };
  });
