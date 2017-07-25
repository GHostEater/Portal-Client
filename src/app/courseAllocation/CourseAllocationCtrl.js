angular.module('b')
  .controller('CourseAllocationCtrl',function (CourseAllocation,Lecturer,Session,Semester,lodash,CurrentUser,toastr,$uibModal,$window) {
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.sessions = Session.query();
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.lecturer = Lecturer.get({userId:vm.user.id});
    vm.allocate = allocate;
    vm.remove = remove;
    vm.getAllocations = getAllocations;
    vm.print = print;

    function getAllocations() {
      CourseAllocation.query({session:vm.session.id}).$promise
        .then(function (data) {
          vm.allocations = lodash.filter(data,{allocatedBy:vm.lecturer.id,course:{semester:Number(vm.semester.semester)}});
        });
    }
    function print(){
      $window.print();
    }
    function allocate() {
      var options = {
        templateUrl: 'app/courseAllocation/allocate.html',
        controller: "AllocateCtrl",
        controllerAs: 'vm',
        size: 'lg'
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
  });
