/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 16-Aug-16.
 */
angular.module("b")
  .controller("DisableEditCtrl", function(CourseResultEditRequest,id,toastr,$uibModalInstance,SystemLog){
    var vm = this;

    vm.ok = function(){
      CourseResultEditRequest.delete({id:id}).$promise
        .then(function(){
          SystemLog.add("Disabled Edit Privileges");
          toastr.success("Edit Disabled");
          $uibModalInstance.close();
        })
        .catch(function(){
          toastr.error("Unable to Disable Edit");
        });
    };
  });
