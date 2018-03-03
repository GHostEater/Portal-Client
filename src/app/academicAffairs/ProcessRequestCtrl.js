/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 16-Aug-16.
 */
angular.module("b")
  .controller("ProcessRequestCtrl", function(CourseResultEditRequest,id,status,handled_by,toastr,$uibModalInstance,SystemLog){
    var vm = this;
    vm.status = status;
    CourseResultEditRequest.get({id:id}).$promise
      .then(function (data) {
        vm.request = data;
      });

    vm.ok = function(){
      var data = {
        id: id,
        status: status,
        date: new Date(),
        handled_by: handled_by
      };
      CourseResultEditRequest.patch(data).$promise
        .then(function(){
          if(status === 1){
            SystemLog.add("Approved Edit Request");
            toastr.success("Edit Request Approved");
          }
          else if(status === 2){
            SystemLog.add("Declined Edit Request");
            toastr.success("Edit Request Declined");
          }
          $uibModalInstance.close();
        })
        .catch(function(){
          if(status === 1){
            toastr.error("Unable to Approve Edit Request");
          }
          else if(status === 2){
            toastr.error("Unable to Decline Edit Request");
          }
        });
    };
  });
