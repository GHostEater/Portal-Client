/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 09-Nov-17.
 */
angular.module('b')
  .controller('RoomEditCtrl',function (Room,Hostel,room,$uibModalInstance,toastr,SystemLog) {
    var vm = this;
    vm.header = "Edit Room";
    vm.room = room;
    vm.hostels = Hostel.query();

    vm.ok = function () {
      if(vm.form.$valid && vm.form.$dirty){
        var data = {
          id: vm.room.id,
          name: vm.room.name,
          size: vm.room.size,
          hostel: vm.room.hostel.id
        };
        Room.patch(data).$promise
          .then(function () {
            toastr.success("Room Changed");
            SystemLog.add("Edited Room");
            $uibModalInstance.close();
          });
      }
      else if(vm.form.$valid && vm.form.$pristine){
        toastr.info("No Changes");
        $uibModalInstance.close();
      }
      else{
        toastr.error("Errors in form...");
      }
    };
  });
