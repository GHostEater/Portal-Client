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
          getResult();
        });
    }
    function getResult() {
      CourseResult.student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.result = lodash.sortBy(data,['session','semester']);
          vm.resultLast = lodash.find(data,{session:{id:Number(vm.session.id)-1}});
          vm.resultFail = lodash.filter(data,{grade:'F'});
          getRegisteredCourses();
        });
    }
    function getRegisteredCourses() {
      CourseReg.student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.registeredCourses = data;
          getCourses();
        });
    }
    function getCourses() {
      CourseToMajor.query({major:vm.student.major.id}).$promise
        .then(function (data) {
          vm.courses = data;
          vm.cous = data;
          getWavedCourses();
        });
    }
    function getWavedCourses() {
      CourseWaving.student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.wavings = data;
          sortCourses();
        });
    }
    function sortCourses(){
      for(var j=0; j<vm.resultFail.length; j++){
        if(lodash.find(vm.courses,{course:{code:vm.resultFail[j].course.code}})){
          if(!lodash.find(vm.result,{course:{code:vm.resultFail[j].course.code},status:1})&&!lodash.find(vm.wavings,{course:{code:vm.resultFail[j].course.code}})){
            vm.course = lodash.find(vm.courses,{course:{code:vm.resultFail[j].code}});
            if(!lodash.find(vm.outstandings,{course:{code:vm.course.code}})){
              vm.outstandings.push(vm.course);
            }
          }
        }
      }

      if(vm.student.level.level === '100'&&vm.semester.semester === '1'){
        vm.outstandings = [];
      }
      else if(vm.student.mode_of_entry === 'D/E'&&vm.student.level.level === '200'&&vm.semester.semester === '1'){
        for(var k=0; k<vm.courses.length; k++){
          if(!lodash.find(vm.wavings,{course:{code:vm.courses[k].code}}) && vm.courses[k].course.semester === vm.semester.semester){
            if(vm.courses[k].level.level < vm.student.level.level){
              if(!lodash.find(vm.outstandings,{course:{code:vm.course.code}})){
                vm.outstandings.push(vm.courses[k]);
              }
            }
          }
        }
      }
      else if(vm.student.mode_of_entry === 'D/E 300'&&vm.student.level.level === '300'&&vm.semester.semester === '1'){
        for(var l=0; l<vm.courses.length; l++){
          if(!lodash.find(vm.wavings,{course:{code:vm.courses[l].course.code}}) && vm.courses[l].course.semester === vm.semester.semester){
            if(vm.courses[l].level < vm.student.level){
              if(!lodash.find(vm.outstandings,{course:{code:vm.course.code}})){
                vm.outstandings.push(vm.courses[l]);
              }
            }
          }
        }
      }
      else{
        for(var m=0; m<vm.courses.length; m++){
          if(!lodash.find(vm.registeredCourses,{course:{code:vm.courses[m].course.code}}) && !lodash.find(vm.wavings,{course:{code:vm.courses[m].course.code}}) && vm.courses[m].level.level <= vm.student.level.level && vm.courses[m].course.semester === vm.semester.semester){
            if(!lodash.find(vm.outstandings,{course:{code:vm.course.code}})){
              vm.outstandings.push(vm.courses[m]);
            }
          }
        }
      }
    }
    function addCourse(course,from){
      var c = {
        id: course.id,
        code: course.code,
        unit: course.unit,
        student: vm.student.id,
        level: vm.student.level,
        session: vm.session,
        status: 0,
        from: from
      };
      vm.counter += Number(course.unit);
      if(!lodash.find(vm.regs,{code:course.code}) && vm.counter <= 24){
        vm.regs.push(c);
        if(from === 0){
          lodash.remove(vm.courses,{course:{code:course.code}});
        }
        else if(from === 1){
          lodash.remove(vm.outstandings,{course:{code:course.code}});
        }
      }
      else{
        toastr.warning("Total Number of Units Exceeded");
        vm.counter -= Number(course.unit);
      }
    }
    function removeCourse(course,from){
      if(lodash.find(vm.regs,{code:course.code})){
        lodash.remove(vm.regs,{code:course.code});
        vm.counter -= Number(course.unit);
        vm.course = lodash.find(vm.cous,{course:{code:course.code}});
        if(from === 0){
          vm.courses.push(vm.course);
        }
        else if(from === 1){
          vm.outstandings.push(vm.course);
        }
      }
    }
    function submitCourseForm(){
      for(var i=0; i < vm.regs.length; i++){
        var data = {
          course: vm.regs[i].id,
          student: vm.student.id,
          level: vm.student.level.id,
          session: vm.session.id
        };
        CourseReg.save(data).$promise
          .then(function () {
            SystemLog.add("Registered Course");
            toastr.success("Course Registered");
          });
      }
      $state.go("courseSlip");
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
