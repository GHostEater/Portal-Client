/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 01-Mar-18.
 */
angular.module('b')
  .controller('AdminStudentListCtrl',function (CurrentUser,Student,lodash,Access,College,Dept) {
    Access.general();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.getStudents = getStudents;
    College.query().$promise
      .then(function(data){
        vm.colleges = data;
        if(vm.user.type === '5'){
          vm.college = vm.user.co.college;
        }
        if(vm.user.type === '8'){
          vm.college = vm.user.dean.college;
        }
      });
    vm.depts = Dept.query();

    function getStudents() {
      vm.students = Student.dept({dept:vm.dept.id});
    }
  });
