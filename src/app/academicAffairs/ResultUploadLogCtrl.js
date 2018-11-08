/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 29-Oct-18.
 */
angular.module('b')
  .controller('ResultUploadLogCtrl', function (CourseResultUploadLog,Access) {
    Access.notStudent();
    var vm = this;
    vm.date = {
      min: new Date(new Date().setDate(new Date().getDate()-1)),
      max: new Date(new Date().setDate(new Date().getDate()+1))
    };
    vm.getLogs = getLogs;
    function getLogs() {
      CourseResultUploadLog.query({min:vm.date.min,max:vm.date.max}).$promise
        .then(function(data){
          vm.logs = data;
        });
    }getLogs();
  });
