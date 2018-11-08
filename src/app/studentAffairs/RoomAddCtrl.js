/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 09-Nov-17.
 */
angular.module('b')
  .controller('RoomAddCtrl',function (Room,Hostel,$uibModalInstance,toastr,SystemLog) {
    var vm = this;
    vm.header = "Add Room";
    vm.hostels = Hostel.query();

    vm.ok = function () {
      if(vm.form.$valid){
        var data = {
          name: vm.room.name,
          size: vm.room.size,
          hostel: vm.room.hostel.id
        };
        Room.save(data).$promise
          .then(function () {
            toastr.success("Room Added");
            SystemLog.add("Added Room");
            $uibModalInstance.close();
          });
      }
      else{
        toastr.error("Errors in form...");
      }
    };
  });
