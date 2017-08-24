angular.module('b')
  .controller('CourseToMajorDeleteCtrl', function (id,toastr,$uibModalInstance,CourseToMajor,SystemLog) {
    var vm = this;
    vm.ok = function () {
      CourseToMajor.remove({id:id}).$promise
        .then(function(){
          SystemLog.add("Delete Course To Major");
          toastr.success("Course To Major Assignment Removed");
          $uibModalInstance.close();
        })
        .catch(function(){
          toastr.error("Error");
        });
    }
  });
