/* eslint-disable angular/controller-name,no-undef */
/**
 * Created by GHostEater on 16-Aug-16.
 */
angular.module("b")
  .controller("ProcessRequestCtrl", function(CurrentUser,CourseResultEditRequest,id,status,handled_by,toastr,$uibModalInstance,SystemLog){
    var vm = this;
    vm.status = status;
    CourseResultEditRequest.get({id:id}).$promise
      .then(function (data) {
        vm.request = data;
      });
    vm.date = new Date();
    vm.days = 0;
    vm.hours = 0;
    vm.minutes = 0;

    vm.ok = function(){
      vm.end_date = moment(vm.date).add(vm.hours,'hours').add(vm.minutes,'minutes').add(vm.days,'days');
      var data = {
        id: id,
        status: status,
        date: vm.date,
        end_date: vm.end_date,
        handled_by: CurrentUser.profile.id
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
