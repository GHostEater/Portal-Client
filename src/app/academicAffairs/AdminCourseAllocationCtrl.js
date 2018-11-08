/* eslint-disable angular/controller-name */
angular.module("b")
  .controller("AdminCourseAllocationCtrl",function(Access,CourseAllocation,Lecturer,Session,College,Dept,Semester,CollegeOfficer,Hod,lodash,CurrentUser,$window){
    Access.general();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.sessions = Session.query();
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.depts = Dept.query();
    College.query().$promise
      .then(function (data) {
        vm.colleges = data;
        if(vm.user.type === '5'){
          CollegeOfficer.get({user:vm.user.id}).$promise
            .then(function (data) {
              vm.collegeOfficer = data;
              vm.college = lodash.find(vm.colleges,{id:vm.collegeOfficer.college.id});
            });
        }
      });
    vm.getHod = getHod;
    vm.getAllocations = getAllocations;
    vm.print = print;

    function print(){
      $window.print();
    }
    function getHod(){
      Hod.query().$promise
        .then(function (data) {
          vm.hod = lodash.find(data,{dept:{id:vm.dept.id}});
        });
    }
    function getAllocations() {
      CourseAllocation.query({session:vm.session.id}).$promise
        .then(function (data) {
          vm.allocations = lodash.filter(data,{allocated_by:{id:vm.hod.lecturer.id},course:{semester:Number(vm.semester.semester)}});
        });
    }
  });
