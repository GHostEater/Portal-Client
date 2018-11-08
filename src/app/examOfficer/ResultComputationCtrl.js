/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 10-May-16.
 */
angular.module("b")
  .controller("ResultComputationCtrl",function(Access,toastr,CurrentUser,Hod,LevelAdviser,CourseResult,CourseResultGPA,Level,Major,Session,Semester,lodash,SystemLog){
    Access.lecturer();
    var vm = this;
    vm.status = CourseResult.getReleaseStatus();
    vm.getResults = getResults;
    vm.processResult = processResult;
    vm.releaseResult = releaseResult;
    vm.user = CurrentUser.profile;
    vm.sessions = Session.query();
    vm.levelAdvisers = LevelAdviser.query();
    vm.majors = Major.query();
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.lecturer = vm.user.lecturer;
    vm.hods = Hod.query();
    if(vm.user.examOfficer){
      Level.query().$promise
        .then(function (data) {
          vm.levels = data;
        });
    }
    else if(vm.user.levelAdviser){
      vm.levels = vm.user.levelAdviser.level;
    }

    function getResults() {
      if(vm.user.examOfficer){
        vm.hod = lodash.find(vm.hods,{dept:vm.user.examOfficer.dept});
        vm.levelAdviser = lodash.find(vm.levelAdvisers,{major:vm.major,level:[vm.level]});
      }
      else if(vm.user.levelAdviser){
        vm.hod = lodash.find(vm.hods,{dept:vm.user.levelAdviser.lecturer.dept});
        vm.levelAdviser = vm.user.levelAdviser;
        vm.major = vm.user.levelAdviser.major;
      }

      var data = {
        session: vm.session.id,
        semester: vm.semester.semester,
        major: vm.major.id,
        level: vm.level.id
      };
      CourseResultGPA.rawResultAndCgpa(data).$promise
        .then(function (data) {
          vm.students = data.students;
          vm.total = data.total;
          vm.pass = data.pass;
          vm.pcso = data.pcso;
          vm.probation = data.probation;
          vm.withdrawal = data.withdrawal;
          vm.leave = data.leave;
          vm.sick = data.sick;
          vm.deferment = data.deferment;
          vm.suspension = data.suspension;
        });
    }
    function processResult(){
      angular.forEach(vm.students,function (student) {
        var data = {
          student: student.info.id,
          session: vm.session.id,
          dept: vm.hod.lecturer.dept.id,
          semester: vm.semester.semester,
          tcp: student.tcp,
          tnu: student.tnu,
          gpa: student.gpa,
          ctcp: student.ctcp,
          ctnu: student.ctnu,
          cgpa: student.cgpa,
          tce: student.tce,
          prev_tce: student.prev_tce,
          prev_ctcp: student.prev_ctcp,
          prev_ctnu: student.prev_ctnu,
          prev_cgpa: student.prev_cgpa,
          status: student.status,
          rel: 0
        };
        CourseResultGPA.save(data).$promise
          .then(function (){
            SystemLog.add("Processed Result for "+vm.major.name+" "+vm.level.level+" Level in "+vm.session.session+" Session "+vm.semester.semester+" Semester");
            toastr.success("Result Processed for "+vm.major.name+" "+vm.level.level+" Level in "+vm.session.session+" Session "+vm.semester.semester+" Semester");
          })
          .catch(function (){
            toastr.error("Error");
          });
      });
    }
    function releaseResult(){
      var request = {
        session: vm.session.id,
        semester: vm.semester.semester,
        major: vm.major.id,
        level: vm.level.id
      };
      CourseResultGPA.releaseResultAndCgpa(request).$promise
        .then(function(){
          toastr.success("Results Released for "+vm.major.name+" "+vm.level.level+" Level in "+vm.session.session+" Session "+vm.semester.semester+" Semester");
          SystemLog.add("Released Results for "+vm.major.name+" "+vm.level.level+" Level in "+vm.session.session+" Session "+vm.semester.semester+" Semester");
        })
        .catch(function () {
          toastr.error("Error");
        });
    }
  });
