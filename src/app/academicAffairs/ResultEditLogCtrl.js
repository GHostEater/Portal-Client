/**
 * Created by GHostEater on 17-Aug-16.
 */
angular.module("b")
  .controller("ResultEditLogCtrl", function (CourseResultEditLog) {
    var vm = this;
    vm.logs = CourseResultEditLog.query();
  });
