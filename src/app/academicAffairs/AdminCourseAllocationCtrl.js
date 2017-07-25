angular.module("b")
  .controller("AdminCourseAllocationCtrl",function(CourseAllocation,Lecturer,Session,College,Dept,Semester,CollegeOfficer,Hod,lodash,CurrentUser,$window){
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.sessions = Session.query();
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.ds = Dept.query();
    College.query().$promise
      .then(function (data) {
        vm.colleges = data;
        if(vm.user.type === '5'){
          CollegeOfficer.get({userId:vm.user.id}).$promise
            .then(function (data) {
              vm.collegeOfficer = data;
              vm.college = lodash.find(vm.colleges,{name:vm.collegeOfficer.college});
            });
        }
      });
    vm.getHod = getHod;
    vm.getDepts = getDepts;
    vm.getAllocations = getAllocations;
    vm.print = print;

    function print(){
      $window.print();
    }
    function getDepts(){
      vm.depts = lodash.filter(vm.ds,{college:vm.college.name});
    }
    function getHod(){
      Hod.query().$promise
        .then(function (data) {
          vm.hod = lodash.find(data,{dept:vm.dept.name});
        });
    }
    function getAllocations() {
      CourseAllocation.query({session:vm.session.id}).$promise
        .then(function (data) {
          vm.allocations = lodash.filter(data,{allocatedBy:vm.hod.lecturer.id,course:{semester:Number(vm.semester.semester)}});
        });
    }
  });
