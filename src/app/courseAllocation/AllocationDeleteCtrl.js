/* eslint-disable angular/controller-name */
angular.module("b")
  .controller('AllocationDeleteCtrl',function(CourseAllocation,id,toastr,$uibModalInstance,SystemLog){
    var vm = this;

    vm.ok = function(){
      CourseAllocation.remove({id:id}).$promise
        .then(function(){
          SystemLog.add("Deleted Allocated Course");
          toastr.success("Course Allocation Removed");
          $uibModalInstance.close();
        })
        .catch(function(){
          toastr.error("Unable to Remove Allocation");
        });
    };
  });
