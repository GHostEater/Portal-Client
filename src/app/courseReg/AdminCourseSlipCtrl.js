/* eslint-disable angular/controller-name */
angular.module('b')
  .controller('AdminCourseSlipCtrl',function(CourseReg,Student,CourseWaving,CurrentUser,$stateParams,Semester,toastr,lodash,Session,$uibModal,LevelAdviser,SystemLog,Access,$filter){
    Access.notStudent();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.counter = 0;
    vm.reg_counter = 0;
    vm.regs = [];
    vm.outstandings = [];
    vm.deleteCourse = deleteCourse;
    vm.waveCourse = waveCourse;
    vm.unWaveCourse = unWaveCourse;
    vm.addCourse = addCourse;
    vm.removeCourse = removeCourse;
    vm.submitCourseForm = submitCourseForm;
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
      Student.get({user:$stateParams.userId}).$promise
      .then(function (data) {
        vm.student = data;
        if(vm.user.type === '1'){
          LevelAdviser.query().$promise
            .then(function (data) {
              vm.level_adviser = lodash.find(data,{major:{id:vm.student.major.id}});
            });
        }
        else{
          vm.level_adviser = vm.user.levelAdviser;
        }
        getRegistrableCourses();
      });
    }
    function getRegistrableCourses() {
      CourseReg.getRegistrableCourses({student:vm.student.id,session:vm.session.id}).$promise
      .then(function (data) {
        vm.courses = data.courses;
        vm.outstandings = data.outstandings;
        getRegisteredCourses();
      });
    }
    function getRegisteredCourses() {
      CourseReg.student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.reg_counter = 0;
          vm.reg_courses = lodash.filter(data,{course:{semester:Number(vm.semester.semester)},session:{id:vm.session.id}});
          for(var i = 0; i < vm.reg_courses.length; i++){
            vm.reg_counter += Number(vm.reg_courses[i].course.unit);
          }
          getWavedCourses();
        });
    }
    function getWavedCourses() {
      vm.wavings = CourseWaving.student({student:vm.student.id});
    }
    function addCourse(course,from){
      var c = {
        course: course,
        status: 0,
        from: from
      };
      vm.counter += Number(course.course.unit);
      vm.regs.push(c);
      if(from === 0){
        lodash.remove(vm.courses,{course:{code:course.course.code}});
      }
      else if(from === 1){
        lodash.remove(vm.outstandings,{course:{code:course.course.code}});
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
          SystemLog.add("Registered Courses for Student "+$filter('matricNo')(vm.student.user.username));
          toastr.success("Courses Registered");
          getRegistrableCourses();
          vm.regs = [];
          vm.counter = 0;
        });
    }
    function deleteCourse(id){
      var options = {
        templateUrl: 'app/courseReg/courseRegDelete.html',
        controller: "CourseRegDeleteCtrl",
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
          getRegistrableCourses();
        });
    }
    function waveCourse(id){
      var data = {
        course: id,
        student: vm.student.id,
        waved_by: vm.level_adviser.lecturer.id
      };
      CourseWaving.save(data).$promise
        .then(function () {
          toastr.success("Course Waved");
          SystemLog.add("Waved Course");
          getRegistrableCourses();
        })
        .catch(function(){
          toastr.warning("Unable to Wave Course");
        });

    }
    function unWaveCourse(id){
      CourseWaving.remove({id:id}).$promise
        .then(function () {
          toastr.success("Course Waving Removed");
          SystemLog.add("Removed Course Waving");
          getRegistrableCourses();
        })
        .catch(function(){
          toastr.warning("Unable to Remove Course Waving");
        });

    }
  });
