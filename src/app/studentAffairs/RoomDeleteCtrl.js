/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 09-Nov-17.
 */
angular.module('b')
  .controller('RoomDeleteCtrl',function (Room,Hostel,room,$uibModalInstance,toastr,SystemLog) {
    var vm = this;
    vm.header = "Delete Room";

    vm.ok = function () {
      Room.delete({id:room.id}).$promise
        .then(function () {
          toastr.success("Room Deleted");
          SystemLog.add("Deleted Room");
          $uibModalInstance.close();
        });
    };
  });
