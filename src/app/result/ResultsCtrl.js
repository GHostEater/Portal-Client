/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 08-Aug-18.
 */
angular.module('b')
  .controller('ResultsCtrl',function(CurrentUser,Hod,LevelAdviser,Dept,College,CourseReg,CourseToMajor,CourseWaving,CourseResult,CourseResultGPA,Level,Major,Student,Session,Semester,lodash,$window,Access,SystemLog,toastr,$filter){
    Access.notStudent();
    var vm = this;
    vm.print = print;
    vm.getResults = getResults;
    vm.change_view = change_view;
    vm.processResult = processResult;
    vm.releaseResult = releaseResult;
    vm.search_change = search_change;
    vm.overview_sheet = false;
    vm.broad_sheet = false;
    vm.res_comp = false;
    vm.search_special = false;
    vm.user = CurrentUser.profile;
    vm.sessions = Session.query();
    vm.colleges = College.query();
    vm.depts = Dept.query();
    vm.majors = Major.query();
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.status = CourseResult.getReleaseStatus();
    vm.level_advisers = LevelAdviser.query();
    Level.query().$promise
      .then(function (data) {
        vm.levels = data;
        if(vm.user.levelAdviser && !vm.user.hod && !vm.user.examOfficer){
          vm.levels = vm.user.levelAdviser.level;
          vm.college = vm.user.lecturer.dept.college;
          vm.dept = vm.user.lecturer.dept;
          vm.level_adviser = vm.user.levelAdviser;
          vm.major = vm.user.levelAdviser.major;
        }
      });
    if(!vm.user.hod){
      vm.hods = Hod.query();
    }
    if(vm.user.type === '5'){
      vm.college = vm.user.co.college;
    }
    else if(vm.user.type === '8'){
      vm.college = vm.user.dean.college;
    }
    if(vm.user.examOfficer){
      vm.college = vm.user.lecturer.dept.college;
      vm.dept = vm.user.lecturer.dept;
    }
    if(vm.user.hod){
      vm.hod = vm.user.hod;
      vm.college = vm.user.hod.dept.college;
      vm.dept = vm.user.hod.dept;
    }

    function getResults() {
      if(vm.user.type === '1' || vm.user.type === '2' || vm.user.type === '5' || vm.user.type === '8'){
        vm.level_adviser = lodash.find(vm.level_advisers,{major:{id:vm.major.id},level:[{id:vm.level.id}]});
        vm.hod = lodash.find(vm.hods,{dept:{id:vm.dept.id}});
      }
      else if(vm.user.hod){
        vm.level_adviser = lodash.find(vm.level_advisers,{major:{id:vm.major.id},level:[{id:vm.level.id}]});
      }
      else if(vm.user.examOfficer){
        vm.hod = lodash.find(vm.hods,{dept:vm.user.examOfficer.dept});
        vm.level_adviser = lodash.find(vm.level_advisers,{major:{id:vm.major.id},level:[{id:vm.level.id}]});
      }
      else if(vm.user.levelAdviser){
        vm.hod = lodash.find(vm.hods,{dept:{id:vm.user.levelAdviser.lecturer.dept.id}});
      }
      var data = {};
      if(vm.search_special === false){
        data = {
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
      else{
        var students = vm.student.split(",");
        for(var i=0; i<students.length; i++){
          students[i] = $filter('matricNo')(students[i]);
        }
        console.log(students);
        data = {
          session: vm.session.id,
          semester: vm.semester.semester,
          students: students,
          major: vm.major.id,
          level: vm.level.id
        };
        CourseResultGPA.rawResultAndCgpaSpecific(data).$promise
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
    }
    function change_view(view) {
      vm.overview_sheet = false;
      vm.broad_sheet = false;
      vm.res_comp = false;
      if(view === 'overview'){
        vm.overview_sheet = true;
        vm.active = view;
      }
      else if(view === 'broad'){
        vm.broad_sheet = true;
        vm.active = view;
      }
      else if(view === 'result'){
        vm.overview_sheet = true;
        vm.broad_sheet = true;
        vm.active = view;
      }
      else if(view === 'res_comp'){
        vm.res_comp = true;
        vm.active = view;
      }
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
    function print(){
      $window.print();
    }
  });
