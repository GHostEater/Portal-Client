/**
 * Created by GHostEater on 5/24/2016.
 */
angular.module("b")
  .controller("AdminBroadSheetCtrl",function(CurrentUser,Hod,LevelAdviser,Dept,College,CourseReg,CourseToMajor,CourseWaving,CourseResult,CourseResultGPA,Level,Major,Student,Session,Semester,lodash,$window){
    var vm = this;
    vm.print = print;
    vm.getResults = getResults;
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
    vm.colleges = College.query();
    vm.depts = Dept.query();
    vm.majors = Major.query();
    vm.levelAdvisers = LevelAdviser.query();
    vm.majors = Major.query();
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.hods = Hod.query();
    vm.levels = Level.query();
    if(vm.user.type === '5'){
      vm.college = College.get({id:vm.user.co.collegeId});
    }

    function getResults() {
      vm.students = [];
      vm.levelAdviser = lodash.find(vm.levelAdvisers,{major:vm.major.name,level:[vm.level.id]});
      vm.hod = lodash.find(vm.hods,{dept:vm.dept.name});
      CourseResult.dept({session:vm.session.id,dept:vm.dept.id}).$promise
        .then(function (data) {
          vm.results = lodash.filter(data,{course:{semester:Number(vm.semester.semester)}});
          CourseToMajor.query({majorId:vm.major.id}).$promise
            .then(function (data) {
              vm.courses = data;
              computeGP();
            });
        });
    }
    function computeGP() {
      Student.dept({dept:vm.dept.id}).$promise
        .then(function (data) {
          vm.s = lodash.filter(data,{major:vm.major.name, level:vm.level.level});
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
          vm.result = lodash.filter(vm.results,{student:{id:Number(student.id)},course:{semester:Number(vm.semester.semester)},session:vm.session.session});
          vm.resultFail = [];
          vm.outstandings = [];
          vm.stdResults = data;
          vm.stdResultsFail = lodash.filter(data,{grade:"F"});
          angular.forEach(vm.stdResults,function (result) {
            if(!lodash.find(vm.stdResults,{course:{id:Number(result.course.id)},status:1})
              && !lodash.find(vm.wavings,{course:{id:Number(result.course.id)}})){
              vm.resultFail.push(result);
            }
          });
          angular.forEach(vm.courses,function (course) {
            if(!lodash.find(vm.registeredCourses,{course:{id:Number(course.course.id)}})
              && !lodash.find(vm.wavings,{course:{id:Number(course.course.id)}})
              && !lodash.find(vm.result,{course:{id:Number(course.course.id)}})){
              if(!lodash.find(vm.outstandings,{course:{id:Number(course.course.id)}})){
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
            vm.gps = lodash.remove(vm.gps,{session:vm.session.session,semester:vm.semester.semester});
            vm.last = lodash.findLast(vm.gps);
            var prob = 0;
            var withdraw = 0;
            var count = 0;
            for(var i=0; i<2; i++){
              if(vm.gps[i].cgpa < 1.5){count += 1;}
              if(count === 2){prob = 1;}
              else if(count === 3){withdraw = 1;}
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
            if(fail.length > 0 || outstandings.length > 0){status=0}
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
              vm.total = vm.pass.length+vm.pcso.length+vm.probation.length+vm.withdrawal+vm.leave.length+vm.sick.length+vm.deferment.length+vm.suspension.length;
              vm.students.push(dat);
            }
          });
      }
    }
    function print(){
      $window.print();
    }
  });
