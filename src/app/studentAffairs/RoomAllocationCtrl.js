/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 09-Nov-17.
 */
angular.module('b')
  .controller('RoomAllocationCtrl',function (Room,Hostel,Session,RoomAllocation,$uibModal,CurrentUser,Student,Access) {
    Access.general();
    var vm = this;
    vm.get_allocations = get_allocations;
    vm.reset = reset;
    vm.allocate = allocate;
    vm.remove = remove;
    vm.user = CurrentUser.profile;
    vm.rooms = Room.query();
    vm.hostels = Hostel.query();
    vm.sessions = Session.query();
    vm.session = Session.getCurrent();
    vm.students = Student.query();

    function get_allocations(){
      RoomAllocation.sessionHostel({session:vm.session.id,hostel:vm.hostel.id}).$promise
        .then(function (data) {
          vm.allocations = data;
        });
    }
    function reset() {
      delete vm.allocations;
    }
    function allocate() {
      var options = {templateUrl:'app/studentAffairs/allocate.html',controller:"RoomAllocateCtrl",controllerAs:'vm',size:'lg',
        resolve: {
          rooms: function () {
            return vm.rooms;
          },
          hostel: function () {
            return vm.hostel;
          },
          students: function () {
            return vm.students;
          },
          allocations: function () {
            return vm.allocations;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
          get_allocations();
        });
    }
    function remove(alloc) {
      var options = {templateUrl:'app/layout/delete.html',controller:"RoomAllocationDeleteCtrl",controllerAs:'vm',size:'sm',
        resolve: {
          alloc: function () {
            return alloc;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
          get_allocations();
        });
    }
  });
