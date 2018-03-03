/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 09-Nov-17.
 */
angular.module('b')
  .controller('RoomCtrl',function (Room,Hostel,$uibModal,Access) {
    Access.general();
    var vm = this;
    vm.add = add;
    vm.edit = edit;
    vm.remove = remove;
    function get_rooms() {
      vm.rooms = Room.query();
    }get_rooms();
    vm.hostels = Hostel.query();

    function add() {
      var options = {templateUrl:'app/studentAffairs/roomModal.html',controller:"RoomAddCtrl",controllerAs:'vm',size:'sm'};
      $uibModal.open(options).result
        .then(function(){
          get_rooms();
        });
    }
    function edit(room) {
      var options = {templateUrl:'app/studentAffairs/roomModal.html',controller:"RoomEditCtrl",controllerAs:'vm',size:'sm',
        resolve: {
          room: function () {
            return room;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
          get_rooms();
        });
    }
    function remove(room) {
      var options = {templateUrl:'app/layout/delete.html',controller:"RoomDeleteCtrl",controllerAs:'vm',size:'sm',
        resolve: {
          room: function () {
            return room;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
          get_rooms();
        });
    }
  });
