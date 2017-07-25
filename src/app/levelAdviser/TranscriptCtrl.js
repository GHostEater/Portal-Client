/**
 * Created by GHostEater on 5/19/2016.
 */
angular.module("b")
  .controller("TranscriptCtrl",function(CourseResult,CourseResultGPA,CourseReg,CourseToMajor,CourseWaving,Student,lodash,toastr,$stateParams,Session,Semester,CurrentUser,$window){
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.results = [];
    vm.fails = [];
    vm.outstandings = [];
    vm.sessions = Session.query();
    vm.semester = Semester.get();
    Student.get({userId:$stateParams.userId}).$promise
      .then(function (data) {
        vm.student = data;
        getGP();
      });
    function getGP() {
      CourseResultGPA.student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.gps = data;
          var z=0;
          for(var i=0; i<vm.gps.length; i++){
            CourseResult.student({student:vm.student.id}).$promise
              .then(function (data) {
                vm.result = lodash.filter(data,{session:vm.gps[z].session,course:{semester:vm.gps[z].semester}});
                vm.resultFail = lodash.filter(data,{grade:'F'});
                getCourseToMajor();
                sortResults();
              });
            function sortResults(){
              var dat = {
                result: vm.result,
                gp: vm.gps[z]
              };
              vm.results.push(dat);
              z+=1;
            }
            function getCourseToMajor() {
              CourseToMajor.query({majorId:vm.student.majorId}).$promise
                .then(function (data) {
                  vm.courses = data;
                  getCourseReg();
                });
            }
            function getCourseReg() {
              CourseReg.student({student:vm.student.id}).$promise
                .then(function (data) {
                  vm.registeredCourses = data;
                  getWavings();
                });
            }
            function getWavings(){
              CourseWaving.student({student:vm.student.id}).$promise
                .then(function (data) {
                  vm.wavings = data;
                  sortOutstandings();
                });
            }
            function sortOutstandings(){
              for(var j=0; j<vm.resultFail.length; j++){
                if(lodash.find(vm.courses,{course:{id:vm.resultFail[j].course.id}})){
                  if(!lodash.find(vm.result,{course:{id:vm.resultFail[j].course.id,status:'1'}})&&!lodash.find(vm.wavings,{course:{id:vm.resultFail[j].course.id}})){
                    vm.course = lodash.find(vm.courses,{course:{id:vm.resultFail[j].course.id}});
                    vm.fails.push(vm.course);
                  }
                }
              }
              for(var k=0; k<vm.courses.length; k++){
                if(!lodash.find(vm.registeredCourses,{course:vm.courses[k].course.id})&&!lodash.find(vm.wavings,{course:{id:vm.courses[k].course.id}}) && Number(vm.courses[k].level) <= Number(vm.student.level) && vm.courses[k].course.semester === vm.semester.semester){
                  vm.outstandings.push(vm.courses[k]);
                }
              }
            }
          }
        });
    }
    vm.print = function(){
      $window.print();
    };
  });
