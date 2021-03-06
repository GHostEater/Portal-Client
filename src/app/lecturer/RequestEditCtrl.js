/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 16-Aug-16.
 */
angular.module("b")
  .controller("RequestEditCtrl", function(CourseResultEditRequest,id,toastr,$uibModalInstance,SystemLog,$rootScope){
    var vm = this;

    vm.ok = function(){
      var data = {
        lecturer: id,
        status: 0
      };
      CourseResultEditRequest.save(data).$promise
        .then(function(){
          var request = {
            lecturer:id,
            email:$rootScope.noreply_email,
            school_name:$rootScope.school_med_name
          };
          CourseResultEditRequest.notifyDean(request).$promise
            .then(function () {
              SystemLog.add("Requested Edit Privileges");
              toastr.success("Request Sent");
              $uibModalInstance.close();
            });
        })
        .catch(function(){
          toastr.warning("Error Sending Request");
        });
    };
  });
