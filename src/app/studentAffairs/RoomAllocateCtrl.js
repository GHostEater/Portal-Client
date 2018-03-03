/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 09-Nov-17.
 */
angular.module('b')
  .controller('RoomAllocateCtrl',function(rooms,hostel,students,allocations,RoomAllocation,toastr,$uibModalInstance,lodash,CurrentUser,SystemLog,Session){
    var vm = this;
    vm.header = "Allocate Room ("+hostel.name+")";
    vm.user = CurrentUser.profile;
    vm.studentSelect = 0;
    vm.selectStudent = selectStudent;
    vm.deSelectStudent = deSelectStudent;
    vm.rooms = rooms;
    vm.hostel = hostel;
    vm.allocations = allocations;
    vm.session = Session.getCurrent();
    vm.students = lodash.filter(students,{user:{sex:vm.hostel.sex}});
    angular.forEach(vm.allocations,function (alloc) {
      lodash.remove(vm.students,{id:alloc.student.id});
    });

    function selectStudent(student){
      vm.student = student;
      vm.studentSelect = 1;
    }
    function deSelectStudent(){
      delete vm.student;
      vm.studentSelect = 0;
    }
    vm.ok = function(){
      if(vm.form.$valid) {
        var data = {
          room: vm.room.id,
          student: vm.student.id,
          session: vm.session.id,
          allocated_by: vm.user.studentAffairs.id
        };
        RoomAllocation.save(data).$promise
          .then(function () {
            SystemLog.add("Allocated Room");
            toastr.success("Room Allocated");
            $uibModalInstance.close();
          })
          .catch(function () {
            toastr.error("Error");
          });
      }
    };
  });
