angular.module("b")
  .controller("CourseSlipCtrl",function(CourseReg,Host,College,Student,Semester,toastr,lodash,Session,CurrentUser){
    var vm = this;
    vm.counter = 0;
    vm.host = Host.host;
    Session.getCurrent().$promise
      .then(function (data) {
        vm.session = data;
        getSemester();
      });
    function getSemester() {
      Semester.get().$promise
        .then(function (data) {
          vm.semester = data;
          getStudent();
        });
    }
    function getStudent() {
      Student.get({userId:CurrentUser.profile.id}).$promise
      .then(function (data) {
        vm.student = data;
        getCourses();
      });
    }
    function getCourses() {
      CourseReg.student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.courses = lodash.filter(data,{course:{semester:Number(vm.semester.semester)},session:vm.session.session});
          for(var i = 0; i < vm.courses.length; i++){
            vm.counter += Number(vm.courses[i].course.unit);
          }
        });
    }
  });
