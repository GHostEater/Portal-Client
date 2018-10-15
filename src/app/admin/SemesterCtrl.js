/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 18-Mar-18.
 */
angular.module('b')
  .controller('SemesterCtrl',function (Access,Semester,toastr,SystemLog) {
    Access.admin();
    var vm = this;
    vm.semester = Semester.get();
    vm.change = change;

    function change() {
      var semester;
      if(vm.semester.semester === '1'){
        semester = 2;
      }
      else{
        semester = 1;
      }
      Semester.changeSemester({semester:semester}).$promise
        .then(function () {
          toastr.success("Semester Changed");
          vm.semester = Semester.get();
          SystemLog.add("Changed Semester");
        });
    }
  });
