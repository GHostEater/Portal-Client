/* eslint-disable angular/controller-name */
angular.module("b")
  .controller("StudentListCtrl",function(CurrentUser,Student,lodash,Access){
    Access.lecturer();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.students = [];
    Student.dept({dept:vm.user.lecturer.dept.id}).$promise
      .then(function (data) {
        if(vm.user.hod){
          vm.students = lodash.filter(data,{major:{dept:{id:vm.user.hod.dept.id}}});
        }
        else if(vm.user.examOfficer){
          vm.students = lodash.filter(data,{major:{dept:{id:vm.user.examOfficer.dept.id}}});
        }
        else if(vm.user.levelAdviser && !vm.user.examOfficer && !vm.user.hod){
          vm.s = lodash.filter(data,{major:{id:vm.user.levelAdviser.major.id}});
          angular.forEach(vm.user.levelAdviser.level,function (level) {
            vm.t = lodash.filter(vm.s,{level:{id:level.id}});
            angular.forEach(vm.t,function (s) {
              vm.students.push(s);
            });
          });
        }
      });
  });
