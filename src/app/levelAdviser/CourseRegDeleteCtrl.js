angular.module("b")
  .controller('CourseRegDeleteCtrl',function(CourseReg,id,toastr,$uibModalInstance,SystemLog){
    var vm = this;
    vm.ok = function(){
      CourseReg.remove({id:id}).$promise
        .then(function(){
          SystemLog.add("Deleted Student Registered Course");
          toastr.success("Course Removed");
          $uibModalInstance.close();
        })
        .catch(function(){
          toastr.error("Unable to Remove Course");
        });
    };
  });
