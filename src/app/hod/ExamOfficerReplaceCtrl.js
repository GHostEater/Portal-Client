/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 05-Mar-18.
 */
angular.module('b')
  .controller('ExamOfficerReplaceCtrl',function (CurrentUser,lodash,$uibModalInstance,ExamOfficer,officer,Lecturer,toastr) {
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.lecturer = officer.lecturer;
    vm.lecturer_orig = officer.lecturer;
    Lecturer.query().$promise
      .then(function (data) {
        vm.lecturers = lodash.filter(data,{dept:{id:vm.user.hod.dept.id}});
      });

    vm.ok = function () {
      if(vm.form.$valid){
        var data = {
          lecturer: vm.lecturer.id,
          dept: vm.user.hod.dept.id
        };
        ExamOfficer.delete({lecturer:vm.lecturer_orig.id}).$promise
          .then(function () {
            ExamOfficer.save(data).$promise
              .then(function () {
                toastr.success("Exam Officer Replaced");
                $uibModalInstance.close();
              })
              .catch(function () {
                toastr.error("Error");
              });
          })
          .catch(function () {
            toastr.error("Error");
          });
      }
      else{
        toastr.error("Errors in form");
      }
    };
  });
