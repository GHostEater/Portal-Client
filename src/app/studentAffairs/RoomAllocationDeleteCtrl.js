/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 09-Nov-17.
 */
angular.module('b')
  .controller('RoomAllocationDeleteCtrl',function (RoomAllocation,alloc,$uibModalInstance,toastr,SystemLog) {
    var vm = this;
    vm.header = "Delete Room Allocation";

    vm.ok = function () {
      RoomAllocation.delete({id:alloc.id}).$promise
        .then(function () {
          toastr.success("Room Allocation Deleted");
          SystemLog.add("Deleted Room Allocation");
          $uibModalInstance.close();
        });
    };
  });
