/* eslint-disable angular/controller-name */
angular.module('b')
  .controller('CourseRegCtrl',function (CurrentUser,Semester,Payment,PaymentType,Session,$uibModal,CourseReview,ExtraUnit,CourseReg,CourseToMajor,CourseWaving,CourseResult,lodash,toastr,SystemLog,LateReg,$state,Access){
    Access.student();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.student = vm.user.student;
    vm.addCourse = addCourse;
    vm.removeCourse = removeCourse;
    vm.submitCourseForm = submitCourseForm;
    vm.requestLateReg = requestLateReg;
    vm.request_extra_unit = request_extra_unit;
    vm.paid_late_reg = false;
    vm.paid_extra_unit = false;
    vm.can_submit = false;
    vm.regs = [];
    vm.outstandings = [];
    vm.counter_1 = 0;
    vm.counter_2 = 0;
    vm.regStatus = CourseReg.status();
    vm.counter_limit_1 = 0;
    vm.counter_limit_2 = 0;
    if(vm.student.level.level === '400'){
      vm.counter_limit_1 = 27;
      vm.counter_limit_2 = 27;
    }
    else{
      vm.counter_limit_1 = 24;
      vm.counter_limit_2 = 24;
    }
    Session.getCurrent().$promise
      .then(function (data) {
        vm.session = data;
        Session.query().$promise
          .then(function (data) {
            vm.sessions = lodash.orderBy(data,['session'],['desc']);
            getSemester();
          });
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
        vm.reg_courses = data.reg_courses;
        angular.forEach(vm.reg_courses,function (reg) {
          if(Number(reg.course.semester) === 1){
            vm.counter_limit_1 -= Number(reg.course.unit);
          }
          else if(Number(reg.course.semester) === 2){
            vm.counter_limit_2 -= Number(reg.course.unit);
          }
        });
        course_review_restrict();
      });
    }
    function course_review_restrict() {
      var session;
      var semester;
      if(vm.semester.semester === "2"){
        semester = '1';
        session = vm.session;
        vm.sess = vm.session;
      }
      else{
        semester = '2';
        session = vm.sessions[1];
        vm.sess = vm.sessions[1];
      }
      CourseReview.restrict({semester:semester,session:session.id,student:vm.user.student.id}).$promise
        .then(function (data) {
          vm.done_reviews = data.done_reviews;
          getPayment();
        });
    }
    function getPayment() {
      PaymentType.query().$promise
        .then(function (data) {
          vm.late_reg_payment_type = lodash.find(data,{tag:'late_reg'});
          vm.extra_unit_payment_type = lodash.find(data,{tag:'extra_unit'});
          Payment.student({student:vm.user.student.id}).$promise
            .then(function (data) {
              vm.late_reg_payment = lodash.find(data,{payment_type:{id:vm.late_reg_payment_type.id},level:{id:vm.user.student.level.id},paid:true});
              if(vm.late_reg_payment){
                vm.paid_late_reg = true;
              }
              vm.extra_unit_payment = lodash.find(data,{payment_type:{id:vm.extra_unit_payment_type.id},level:{id:vm.user.student.level.id},paid:true});
              if(vm.extra_unit_payment){
                vm.paid_extra_unit = true;
              }
              getExtraUnit();
            });
        });
    }
    function getExtraUnit() {
      ExtraUnit.query().$promise
        .then(function (data) {
          vm.extra_unit = lodash.find(data,{student:{id:vm.user.student.id},session:{id:vm.session.id},semester:Number(vm.semester.semester)});
          if(vm.extra_unit){
            if(vm.extra_unit.status === 1 && vm.paid_extra_unit === true){
              vm.counter_limit_1 += Number(vm.extra_unit.units);
              vm.counter_limit_2 += Number(vm.extra_unit.units);
            }
          }
        });
    }
    function request_extra_unit() {
      var options = {
        templateUrl: 'app/courseReg/request_extra_unit_modal.html',
        controller: "RequestExtraUnitModalController",
        controllerAs: 'vm',
        size: 'sm'
      };
      $uibModal.open(options).result
        .then(function(){
          getExtraUnit();
        });
    }
    function submit_verify_first (){
      var reg_count = 0;
      angular.forEach(vm.reg_courses,function (reg) {
        if(Number(reg.course.semester) === 1) {
          reg_count += Number(reg.course.unit);
        }
      });
      var counter = vm.counter_1+reg_count;
      if((counter >= 15 && counter <= vm.counter_limit_1) || (vm.student.level.level === '400' && counter >= 1 && counter <= vm.counter_limit_1)){
        return true;
      }
      else{
        return false;
      }
    }
    function submit_verify_second (){
      var reg_count = 0;
      angular.forEach(vm.reg_courses,function (reg) {
        if(Number(reg.course.semester) === 2) {
          reg_count += Number(reg.course.unit);
        }
      });
      var counter = vm.counter_2+reg_count;
      if((counter >= 15 && counter <= vm.counter_limit_2) || (vm.student.level.level === '400' && counter >= 1 && counter <= vm.counter_limit_2) || ((vm.student.level.level === '300' || vm.student.level.level === '400') && counter >= 6)){
        return true;
      }
      else{
        return false;
      }
    }
    function submit_verify() {
      if(submit_verify_first() && submit_verify_second()){
        return true;
      }
      else{
        return false;
      }
    }
    function addCourse(course,from){
      var c = {
        course: course,
        status: 0,
        from: from
      };
      if(Number(course.course.semester) === 1){
        vm.counter_1 += Number(course.course.unit);
        if(vm.counter_1 <= vm.counter_limit_1){
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
          vm.counter_1 -= Number(course.course.unit);
        }
      }
      else if(Number(course.course.semester) === 2){
        vm.counter_2 += Number(course.course.unit);
        if(vm.counter_2 <= vm.counter_limit_2){
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
          vm.counter_2 -= Number(course.course.unit);
        }
      }
      vm.can_submit = submit_verify();
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
      vm.can_submit = submit_verify();
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
