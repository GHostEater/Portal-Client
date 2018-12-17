/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 17-Aug-16.
 */
angular.module("b")
  .controller("ResultEditLogCtrl", function (CourseResultEditLog,Access) {
    Access.notStudent();
    var vm = this;
    vm.logs = CourseResultEditLog.query();
  });
