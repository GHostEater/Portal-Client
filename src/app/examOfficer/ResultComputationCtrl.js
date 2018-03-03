/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 10-May-16.
 */
angular.module("b")
  .controller("ResultComputationCtrl",function(Access,toastr,CurrentUser,Lecturer,Hod,LevelAdviser,Dept,College,CourseToMajor,CourseReg,CourseWaving,CourseResult,CourseResultGPA,Level,Major,Student,Session,Semester,lodash,SystemLog){
    Access.lecturer();
    var vm = this;
    vm.getResults = getResults;
    vm.processResult = processResult;
    vm.releaseResult = releaseResult;
    vm.pass = [];
    vm.pcso = [];
    vm.probation = [];
    vm.withdrawal = [];
    vm.suspension = [];
    vm.deferment = [];
    vm.leave = [];
    vm.sick = [];
    vm.total = 0;
    vm.students = [];
    vm.outstandings = [];
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
      vm.students = [];
      if(vm.user.examOfficer){
        vm.hod = lodash.find(vm.hods,{dept:vm.user.examOfficer.dept});
        vm.levelAdviser = lodash.find(vm.levelAdvisers,{major:vm.major,level:[vm.level]});
      }
      else if(vm.user.levelAdviser){
        vm.hod = lodash.find(vm.hods,{dept:vm.user.levelAdviser.lecturer.dept});
        vm.levelAdviser = vm.user.levelAdviser;
        vm.major = vm.user.levelAdviser.major;
      }
      CourseResult.dept({session:vm.session,dept:vm.lecturer.dept}).$promise
        .then(function (data) {
          vm.results = lodash.filter(data,{course:{semester:Number(vm.semester.semester)}});
          CourseToMajor.query({major:vm.major.id}).$promise
            .then(function (data) {
              vm.courses = data;
              computeGP();
            });
        });
    }
    function computeGP() {
      Student.dept({dept:vm.lecturer.dept.id}).$promise
        .then(function (data) {
          vm.s = lodash.filter(data,{major:vm.major, level:vm.level});
          angular.forEach(vm.s,function (student) {
            if(student.status === '3'){vm.leave.push(student);}
            else if(student.status === '4'){vm.sick.push(student);}
            else if(student.status === '5'){vm.suspension.push(student);}
            else if(student.status === '6'){vm.deferment.push(student);}
            getWavings(student);
          });
        });
    }
    function getWavings(student) {
      CourseWaving.student({student:student.id}).$promise
        .then(function (data) {
          vm.wavings = data;
          getStudentCourseReg(student);
        });
    }
    function getStudentCourseReg(student) {
      CourseReg.student({student:student.id}).$promise
        .then(function (data) {
          vm.registeredCourses = data;
          getStudentResults(student);
        });
    }
    function getStudentResults(student) {
      CourseResult.student({student:student.id}).$promise
        .then(function (data) {
          vm.result = lodash.filter(vm.results,{student:{id:student.id},course:{semester:Number(vm.semester.semester)},session:{id:vm.session.id}});
          vm.resultFail = [];
          vm.outstandings = [];
          vm.stdResults = data;
          vm.stdResultsFail = lodash.filter(data,{grade:"F"});
          angular.forEach(vm.stdResults,function (result) {
            if(!lodash.find(vm.stdResults,{course:{id:result.course.id},status:1}) && !lodash.find(vm.wavings,{course:{id:result.course.id}})){
              vm.resultFail.push(result);
            }
          });
          angular.forEach(vm.courses,function (course) {
            if(!lodash.find(vm.registeredCourses,{course:{id:course.course.id}}) && !lodash.find(vm.wavings,{course:{id:course.course.id}}) && !lodash.find(vm.result,{course:{id:course.course.id}})){
              if(!lodash.find(vm.outstandings,{course:{id:course.course.id}})){
                vm.outstandings.push(course);
              }
            }
          });
          computeGP2(student, vm.result, vm.resultFail, vm.outstandings);
        });
    }
    function computeGP2(student, result, fail, outstandings) {
      if (student.status === '1') {
        CourseResultGPA.student({student: student.id}).$promise
          .then(function (data) {
            vm.gps = lodash.sortBy(data,['session','semester']);
            vm.gps = lodash.remove(vm.gps,{session:{id:vm.session.id},semester:vm.semester.semester});
            vm.last = lodash.findLast(vm.gps);
            var prob = 0;
            var withdraw = 0;
            var count = 0;
            for(var i=0; i<2; i++){
              if(vm.gps[i]){
                if(vm.gps[i].cgpa < 1.5){count += 1;}
                if(count === 2){prob = 1;}
                else if(count === 3){withdraw = 1;}
              }
            }
            var tnu = 0;
            var tcp = 0;
            var tce = 0;
            var status = 1;
            var gp_status = 0;
            angular.forEach(result,function (res) {
              tnu += Number(res.course.unit);
              tcp += Number(res.gp) * Number(res.course.unit);
              if (res.grade !== 'F') {
                tce += Number(res.gp);
              }
            });
            var gpa = tcp / tnu;
            if(tcp === 0 || tnu === 0) gpa = 0;
            if (!vm.last) {
              vm.last = {};
              vm.last.tce = 0;
              vm.last.tcp = 0;
              vm.last.tnu = 0;
              vm.last.cgpa = 0;
              vm.last.ctcp = 0;
              vm.last.ctnu = 0;
              vm.last.tce = 0;
            }
            tce += Number(vm.last.tce);
            var ctcp = tcp + Number(vm.last.tcp);
            var ctnu = tnu + Number(vm.last.tnu);
            var cgpa = ctcp / ctnu;
            if(ctcp === 0 || ctnu === 0) cgpa = 0;
            if(fail.length > 0 || outstandings.length > 0){status=0;}
            if(cgpa >= 4.00) {
              gp_status = 1;
            }
            if(cgpa >= 1.50 && cgpa <= 3.99) {
              gp_status = 2;
            }
            if(cgpa < 1.50) {
              gp_status = 3;
            }
            var dat = {
              info: student,
              result: result,
              resultFail: fail,
              outstandings: outstandings,
              tnu: tnu,
              ctnu: ctnu,
              tcp: tcp,
              ctcp: ctcp,
              tce: tce,
              gpa: gpa,
              cgpa: cgpa,
              prev_cgpa: vm.last.cgpa,
              prev_ctcp: vm.last.ctcp,
              prev_ctnu: vm.last.ctnu,
              prev_tce: vm.last.tce,
              status: status,
              gp_status: gp_status,
              prob: prob,
              withdraw: withdraw
            };
            if (!lodash.find(vm.students, {info: {id: dat.info.id}})) {
              if(Number(student.level) === 100){
                if(status === 1){
                  vm.pass.push(dat);
                }
                if(status === 0){
                  vm.pcso.push(dat);
                }
              }
              else if(Number(student.level) !== 100){
                if(status === 1 && gp_status <= 2){
                  vm.pass.push(dat);
                }
                if(status === 0 && gp_status <= 2){
                  vm.pcso.push(dat);
                }
                if(prob === 1 && gp_status === 3){
                  vm.probation.push(dat);
                }
                if(withdraw === 1 && gp_status === 3){
                  vm.withdrawal.push(dat);
                }
              }
              vm.total = vm.pass.length+vm.pcso.length+vm.probation.length+vm.withdrawal.length+vm.leave.length+vm.sick.length+vm.deferment.length+vm.suspension.length;
              vm.students.push(dat);
            }
          });
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
            SystemLog.add("Processed Result");
            toastr.success("Result Processed");
          })
          .catch(function (){
            toastr.error("Error");
          });
      });
    }
    function releaseResult(){
      CourseResultGPA.dept({dept:vm.user.examOfficer.dept.id, session:vm.session.id}).$promise
        .then(function(data){
          vm.gps = data;
          release();
        });
      function release(){
        angular.forEach(vm.results,function (result) {
          var data = {
            id: result.id,
            rel: 1
          };
          CourseResult.patch(data).$promise
            .then(function (){
              toastr.success("Result Released");
              SystemLog.add("Released Result");
            })
            .catch(function (){
              toastr.error("Error");
            });
        });
        angular.forEach(vm.gps,function (gp) {
          var data = {
            id: gp.id,
            rel: 1
          };
          CourseResultGPA.patch(data).$promise
            .then(function () {
              SystemLog.add("Released Result");
              toastr.success("Result Released");
            })
            .catch(function (){
              toastr.error("Error");
            });
        });
      }
    }
  });
