/* eslint-disable angular/controller-name */
angular.module("b")
  .controller("StudentListCtrl",function(CurrentUser,Student,lodash,Access){
    Access.lecturer();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.students = [];
    Student.dept({dept:vm.user.lecturer.dept.id}).$promise
      .then(function (data) {
        if(vm.user.levelAdviser){
          vm.s = lodash.filter(data,{major:vm.user.levelAdviser.major});
          angular.forEach(vm.user.levelAdviser.level,function (level) {
            vm.t = lodash.filter(vm.s,{level:level});
            angular.forEach(vm.t,function (s) {
              vm.students.push(s);
            });
          });
        }
        else if(vm.user.examOfficer){
          vm.students = lodash.filter(data,{dept:vm.user.examOfficer.dept});
        }
      });
  });
