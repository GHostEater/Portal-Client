angular.module('b')
  .controller('LvlCourseSlipCtrl',function(CourseReg,College,Student,CourseResult,CourseToMajor,CourseWaving,CurrentUser,$stateParams,Semester,toastr,lodash,Session,$uibModal,Lecturer,SystemLog){
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.counter = 0;
    vm.outstandings = [];
    vm.deleteCourse = deleteCourse;
    vm.waveCourse = waveCourse;
    vm.unWaveCourse = unWaveCourse;
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
      Student.get({userId:$stateParams.userId}).$promise
      .then(function (data) {
        vm.student = data;
        getResult();
      });
    }
    function getResult() {
      CourseResult.student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.result = data;
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
      CourseToMajor.query({majorId:vm.student.majorId}).$promise
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
          getLecturer();
        });
    }
    function getLecturer() {
      vm.lecturer = Lecturer.get({userId:vm.user.id});
      sortCourses();
    }
    function sortCourses() {
      vm.counter = 0;
      vm.outstandings = [];
      for(var i=0; i<vm.resultFail.length; i++){
        if(lodash.find(vm.courses,{course:{code:vm.resultFail[i].course.code}})){
          if(!lodash.find(vm.result,{course:{code:vm.resultFail[i].course.code},status:'1'})
            && !lodash.find(vm.wavings,{course:{code:vm.resultFail[i].course.code}})){
            vm.course = lodash.find(vm.courses,{course:{code:vm.resultFail[i].course.code}});
            vm.outstandings.push(vm.course);
          }
        }
      }
      for(var j=0; j<vm.courses.length; j++){
        if(!lodash.find(vm.registeredCourses,{course:{code:vm.courses[j].course.code}})
          && !lodash.find(vm.wavings,{course:{code:vm.courses[j].course.code}})){
          vm.outstandings.push(vm.courses[j]);
        }
      }
      for(var k=0; k<vm.courses.length; k++){
        vm.counter += Number(vm.courses[k].course.unit);
      }
    }
    function deleteCourse(id){
      var options = {
        templateUrl: 'app/levelAdviser/courseRegDelete.html',
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
          sortCourses();
        });
    }
    function waveCourse(courseId){
      var data = {
        course: courseId,
        student: vm.student.id,
        wavedBy: vm.lecturer.id
      };
      CourseWaving.save(data).$promise
        .then(function () {
          toastr.success("Course Waved");
          SystemLog.add("Waved Course");
          sortCourses();
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
          sortCourses();
        })
        .catch(function(){
          toastr.warning("Unable to Remove Course Waving");
        });

    }
  });
