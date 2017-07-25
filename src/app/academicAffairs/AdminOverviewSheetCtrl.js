/**
 * Created by GHostEater on 5/24/2016.
 */
angular.module("b")
  .controller("AdminOverviewSheetCtrl",function(CurrentUser,Hod,LevelAdviser,Dept,College,CourseToMajor,CourseReg,CourseWaving,CourseResult,CourseResultGPA,Level,Major,Student,Session,Semester,lodash,$window){
    var vm = this;
    vm.print = print;
    vm.getResults = getResults;
    vm.pass = 0;
    vm.pcso = 0;
    vm.probation = 0;
    vm.withdrawal = 0;
    vm.leave = 0;
    vm.sick = 0;
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
          for (var i = 0; i < vm.s.length; i++) {
            vm.student = vm.s[i];
            if(vm.student.status === '3'){
              vm.leave += 1;
            }
            else if(vm.student.status === '4'){
              vm.sick += 1;
            }
            else if(vm.student.status === '6'){
              vm.withdrawal += 1;
            }
            getWavings(vm.student);
          }
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
            var tnu = 0;
            var tcp = 0;
            var gpa = 0;
            var ctcp = 0;
            var ctnu = 0;
            var cgpa = 0;
            var tce = 0;
            var status = 1;
            var gp_status = 0;
            var dat = {};
            if (!vm.last) {
              for (var j = 0; j < result.length; j++) {
                tnu += Number(result[j].course.unit);
              }
              for (var k = 0; k < result.length; k++) {
                tcp += Number(result[k].gp) * Number(result[k].course.unit);
              }
              for (var y = 0; y < result.length; y++) {
                if (result[y].grade !== 'F') {
                  tce += Number(result[y].gp);
                }
              }
              gpa = parseFloat(tcp / tnu);
              if(tcp === 0 || tnu === 0) gpa = 0.0;
              ctcp = tcp;
              ctnu = tnu;
              cgpa = parseFloat(ctcp / ctnu);
              if(ctcp === 0 || ctnu === 0) cgpa = 0.0;
              if(fail.length>0|| cgpa<1.5){status=0}
              if(cgpa >= 4.00) {
                gp_status = 1;
              }
              if(cgpa >= 1.50 && cgpa <= 3.99) {
                gp_status = 2;
              }
              if(cgpa >= 1.00 && cgpa < 1.50) {
                gp_status = 3;
              }
              if(cgpa < 1.00) {
                gp_status = 4;
              }
              dat = {
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
                prev_cgpa: 0.00,
                prev_ctcp: 0.00,
                prev_ctnu: 0.00,
                prev_tce: 0,
                status: status,
                gp_status: gp_status
              };
              if (!lodash.find(vm.students, {info: {id: dat.info.id}})) {
                if(status === 1){
                  vm.pass += 1;
                }
                if(status === 0 && gp_status <= 2){
                  vm.pcso += 1;
                }
                if((status === 0 || 1) && gp_status === 3){
                  vm.probation += 1;
                }
                if((status === 0 || 1) && gp_status === 4){
                  vm.withdrawal += 1;
                }
                vm.total = vm.pass+vm.pcso+vm.probation+vm.withdrawal+vm.leave+vm.sick;
                vm.students.push(dat);
              }
            }
            else {
              for (var l = 0; l < result.length; l++) {
                tnu += Number(result[l].course.unit);
              }
              for (var m = 0; m < result.length; m++) {
                tcp += Number(result[m].gp) * Number(result[m].course.unit);
              }
              for (var z = 0; z < result.length; z++) {
                if (result[z].grade !== 'F') {
                  tce += Number(result[z].gp);
                }
              }
              gpa = parseFloat(tcp / tnu);
              if(tcp === 0 || tnu === 0) gpa = 0.0;
              tce += Number(vm.last.tce);
              ctcp = tcp + Number(vm.last.tcp);
              ctnu = tnu + Number(vm.last.tnu);
              cgpa = parseFloat(ctcp / ctnu);
              if(ctcp === 0 || ctnu === 0) cgpa = 0.0;
              if(fail.length>0 || cgpa<1.5){status=0}
              if(cgpa >=4.00) {
                gp_status = 1;
              }
              if(cgpa >= 1.50 && cgpa <= 3.99) {
                gp_status = 2;
              }
              if(cgpa >= 1.00 && cgpa < 1.50) {
                gp_status = 3;
              }
              if(cgpa < 1.00) {
                gp_status = 4;
              }
              dat = {
                info: student,
                result: result,
                resultFail: fail,
                outstandings: outstandings,
                tnu: tnu,
                ctnu: ctnu,
                tcp: tcp,
                tce: tce,
                ctcp: ctcp,
                gpa: gpa,
                cgpa: cgpa,
                prev_cgpa: vm.last.cgpa,
                prev_ctcp: vm.last.ctcp,
                prev_ctnu: vm.last.ctnu,
                prev_tce: vm.last.tce,
                status: status,
                gp_status: gp_status
              };
              if (!lodash.find(vm.students, {info: {id: dat.info.id}})) {
                if(status === 1){
                  vm.pass += 1;
                }
                if(status === 0 && gp_status <= 2){
                  vm.pcso += 1;
                }
                if((status === 0 || 1) && gp_status === 3){
                  vm.probation += 1;
                }
                if((status === 0 || 1) && gp_status === 4){
                  vm.withdrawal += 1;
                }
                vm.total = vm.pass+vm.pcso+vm.probation+vm.withdrawal+vm.leave+vm.sick;
                vm.students.push(dat);
              }
            }
          });
      }
    }
    function print(){
      $window.print();
    }
  });
