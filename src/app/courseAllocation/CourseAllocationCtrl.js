/* eslint-disable angular/controller-name */
angular.module('b')
  .controller('CourseAllocationCtrl',function (CourseAllocation,Session,Semester,lodash,CurrentUser,toastr,$uibModal,$window,Access,Dept,College,CollegeOfficer,Hod) {
    Access.notStudent();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.sessions = Session.query();
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.depts = Dept.query();
    vm.colleges = College.query();
    vm.getHod = getHod;
    vm.getAllocations = getAllocations;
    vm.print = print;
    vm.allocate = allocate;
    vm.remove = remove;
    if(vm.user.type === '5'){
      vm.collegeOfficer = vm.user.co;
      vm.college = vm.user.co.college;
    }
    if(vm.user.hod){
      vm.hod = vm.user.hod;
      vm.college = vm.user.hod.dept.college;
      vm.dept = vm.user.hod.dept;
    }

    function getHod(){
      Hod.query().$promise
        .then(function (data) {
          vm.hod = lodash.find(data,{dept:{id:vm.dept.id}});
        });
      getAllocations();
    }
    function getAllocations() {
      CourseAllocation.query({session:vm.session.id}).$promise
        .then(function (data) {
          vm.allocations = lodash.filter(data,{allocated_by:{id:vm.hod.lecturer.id},course:{semester:Number(vm.semester.semester)}});
        });
    }
    function allocate() {
      var options = {
        templateUrl: 'app/courseAllocation/allocate.html',
        controller: "AllocateCtrl",
        controllerAs: 'vm',
        size: 'lg',
        resolve:{
          dept: function(){
            return vm.dept;
          }
        }
      };
      $uibModal.open(options).result
        .then(function () {
          getAllocations();
        });
    }
    function remove(id){
      var options = {
        templateUrl: 'app/courseAllocation/allocationDelete.html',
        controller: "AllocationDeleteCtrl",
        controllerAs: 'vm',
        size: 'sm',
        resolve:{
          id: function(){
            return id;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
          getAllocations();
        });
    }
    function print(){
      $window.print();
    }
  });
