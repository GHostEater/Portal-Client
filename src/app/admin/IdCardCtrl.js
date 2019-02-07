/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 11-Dec-18.
 */
angular.module('b')
  .controller('IdCardCtrl', function (CurrentUser,Student,lodash,Access,College,Dept,Excel,$timeout,SystemLog) {
    Access.general();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.getStudents = getStudents;
    vm.exportToExcel = exportToExcel;
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
    function exportToExcel(tableId){
      vm.exportHref=Excel.tableToExcel(tableId,'ID Card Info');
      $timeout(function(){location.href=vm.exportHref;},100);
      SystemLog.add("Exported JUPEB Admission Table to Excel");
    }
  });
