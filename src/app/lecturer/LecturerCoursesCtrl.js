/* eslint-disable angular/controller-name */
angular.module("b")
  .controller("LecturerCoursesCtrl",function(CourseAllocation,CurrentUser,lodash,Session,Semester,Access){
    Access.lecturer();
    var vm = this;
    vm.user = CurrentUser.profile;
    Semester.get().$promise
      .then(function(data){
        vm.semester = data;
        getSession();
      });
    function getSession() {
      Session.getCurrent().$promise
        .then(function(data){
          vm.session = data;
          getAllocations();
        });
    }
    function getAllocations() {
      CourseAllocation.query({session:vm.session.id}).$promise
        .then(function (data) {
          vm.allocations = lodash.filter(data,{lecturer:{user:{id:vm.user.id}},course:{semester:Number(vm.semester.semester)}});
        });
    }
  });
