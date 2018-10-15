/* eslint-disable angular/controller-name */
angular.module('b')
  .controller('CourseRegCtrl',function (CurrentUser,Semester,Session,CourseReg,CourseToMajor,CourseWaving,CourseResult,lodash,toastr,SystemLog,LateReg,$state,Access){
    Access.student();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.student = vm.user.student;
    vm.addCourse = addCourse;
    vm.removeCourse = removeCourse;
    vm.submitCourseForm = submitCourseForm;
    vm.requestLateReg = requestLateReg;
    vm.regs = [];
    vm.outstandings = [];
    vm.counter = 0;
    vm.regStatus = CourseReg.status();
    vm.counter_limit = 0;
    if(vm.student.level.level === '400'){
      vm.counter_limit = 27;
    }
    else{
      vm.counter_limit = 24;
    }
    Session.getCurrent().$promise
      .then(function (data) {
        vm.session = data;
        getSemester();
      });
    function getSemester() {
      Semester.get().$promise
        .then(function (data) {
          vm.semester = data;
          getLateReg();
        });
    }
    function getLateReg() {
      LateReg.query().$promise
        .then(function (data) {
          vm.lateRegStatus = lodash.find(data,{student:{id:vm.student.id},session:{id:vm.session.id},semester:vm.semester.semester});
          getRegistrableCourses();
        });
    }
    function getRegistrableCourses() {
      CourseReg.getRegistrableCourses({student:vm.user.student.id,session:vm.session.id}).$promise
      .then(function (data) {
        vm.courses = data.courses;
        vm.outstandings = data.outstandings;
      });
    }
    function addCourse(course,from){
      var c = {
        course: course,
        status: 0,
        from: from
      };
      vm.counter += Number(course.course.unit);
      if(vm.counter <= vm.counter_limit){
        vm.regs.push(c);
        if(from === 0){
          lodash.remove(vm.courses,{course:{code:course.course.code}});
        }
        else if(from === 1){
          lodash.remove(vm.outstandings,{course:{code:course.course.code}});
        }
      }
      else{
        toastr.warning("Total Number of Units Exceeded");
        vm.counter -= Number(course.course.unit);
      }
    }
    function removeCourse(course,from){
      lodash.remove(vm.regs,{course:{course:{code:course.course.code}}});
      vm.counter -= Number(course.course.unit);
      if(from === 0){
        vm.courses.push(course);
      }
      else if(from === 1){
        vm.outstandings.push(course);
      }
    }
    function submitCourseForm(){
      var data = [];
      angular.forEach(vm.regs,function (reg) {
        data.push(reg.course.course.id);
      });
      var request = {
        student: vm.student.id,
        level: vm.student.level.id,
        session: vm.session.id,
        courses: data
      };
      CourseReg.registerCourses(request).$promise
        .then(function () {
          SystemLog.add("Registered Courses");
          toastr.success("Courses Registered");
          $state.go("courseSlip");
        });
    }
    function requestLateReg() {
      var data = {
        student: vm.student.id,
        session: vm.session.id,
        semester: vm.semester.semester,
        status: 0
      };
      LateReg.save(data).$promise
        .then(function () {
          SystemLog.add("Requested for Late Registration");
          toastr.success("Request for Late Registration Sent");
        });
    }
  });
