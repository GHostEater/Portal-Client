/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 18-Mar-18.
 */
angular.module('b')
  .controller('ResultReleaseStatusCtrl',function (Access,SystemLog,CourseResult,toastr) {
    Access.admin();
    var vm = this;
    vm.status = CourseResult.getReleaseStatus();
    vm.change = change;

    function change() {
      var status = vm.status.status !== true;
      CourseResult.setReleaseStatus({status:status}).$promise
        .then(function () {
          toastr.success("Release Status Changed");
          vm.status = CourseResult.getReleaseStatus();
          SystemLog.add("Changed Result Release Status");
        });
    }
  });
