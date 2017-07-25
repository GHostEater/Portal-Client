/**
 * Created by GHostEater on 6/12/2016.
 */
angular.module("b")
  .controller("StudentResultViewController",function(CourseResult,CourseResultGPA,CourseReg,CourseToMajor,CourseWaving,Student,lodash,toastr,$stateParams,Session,Semester,CurrentUser,SystemLog,$uibModal){
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.results = [];
    vm.fails = [];
    vm.outstandings = [];
    vm.sessions = Session.query();
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    Student.get({userId:$stateParams.userId}).$promise
      .then(function (data) {
        vm.student = data;
        getGP();
      });
    function getGP() {
      CourseResultGPA.student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.gps = lodash.sortBy(data,['session','semester']);
          var z=0;
          for(var i=0; i<vm.gps.length; i++) {
            CourseResult.student({student: vm.student.id}).$promise
              .then(function (data) {
                vm.result = lodash.filter(data, {session: vm.gps[z].session, course: {semester: vm.gps[z].semester}});
                vm.resultFail = lodash.filter(data, {grade: 'F'});
                sortResults();
              });
            function sortResults() {
              var dat = {
                result: vm.result,
                gp: vm.gps[z]
              };
              vm.results.push(dat);
              z += 1;
            }
          }
          });
        }
    vm.editCa = function(id){
      var options = {
        templateUrl: 'app/lecturer/editCa.html',
        controller: "EditCaController",
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
          getGP();
        });
    };
    vm.editExam = function(id){
      var options = {
        templateUrl: 'app/lecturer/editExam.html',
        controller: "EditExamController",
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
          getGP();
        });
    };
    vm.processResult = function(gp) {
      CourseResultGPA.remove({id: gp.id}).$promise
        .then(function () {
          getStudentResults(gp);
        });
      function getStudentResults(gp) {
        CourseResult.student({student: vm.student.id}).$promise
          .then(function (data) {
            vm.result = lodash.filter(data, {session: gp.session, course: {semester: gp.semester}});
            vm.resultFail = [];
            vm.stdResults = data;
            vm.stdResultsFail = lodash.filter(data, {grade: "F"});
            angular.forEach(vm.stdResultsFail,function (result) {
              if (!lodash.find(vm.stdResults, {course: {code: result.course.code}, status: 1})
                && !lodash.find(vm.wavings, {course: {code: result.course.code}})) {
                vm.resultFail.push(result);
              }
            });
            computeGP(gp);
          });
      }
      function computeGP(gp) {
        var session = lodash.find(vm.sessions,{session:gp.session});
        if (vm.student.status === '1') {
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
          var gp_status = 1;
          var dat = {};
          if (!vm.last) {
            for (var j = 0; j < vm.result.length; j++) {
              tnu += Number(vm.result[j].course.unit);
            }
            for (var k = 0; k < vm.result.length; k++) {
              tcp += Number(vm.result[k].gp) * Number(vm.result[k].course.unit);
            }
            for (var y = 0; y < vm.result.length; y++) {
              if (vm.result[y].grade !== 'F') {
                tce += Number(vm.result[y].gp);
              }
            }
            gpa = tcp / tnu;
            ctcp = tcp;
            ctnu = tnu;
            cgpa = ctcp / ctnu;
            if (vm.resultFail.length > 0) {
              status = 0
            }
            if (cgpa >= 4.00) {
              gp_status = 1;
            }
            else if (cgpa >= 1.50 && cgpa <= 3.99) {
              gp_status = 2;
            }
            else if (cgpa >= 1.00 && cgpa < 1.50) {
              gp_status = 3;
            }
            else if (cgpa <= 1.00) {
              gp_status = 4;
            }
            dat = {
              info: vm.student,
              results: vm.result,
              resultFail: vm.resultFail,
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
            var d = {
              student: vm.student.id,
              session: session.id,
              dept: vm.student.deptId,
              semester: gp.semester,
              tcp: dat.tcp,
              tnu: dat.tnu,
              gpa: dat.gpa,
              ctcp: dat.ctcp,
              ctnu: dat.ctnu,
              cgpa: dat.cgpa,
              tce: dat.tce,
              prev_ctcp: dat.prev_ctcp,
              prev_ctnu: dat.prev_ctnu,
              prev_cgpa: dat.prev_cgpa,
              prev_tce: dat.prev_tce,
              status: dat.status,
              rel: 0
            };
            CourseResultGPA.save(d).$promise
              .then(function () {
                SystemLog.add("Re-Processed Result");
                toastr.success("Result Processed");
              })
              .catch(function () {
                toastr.error("Error");
              });
          }
          else {
            for (var l = 0; l < vm.result.length; l++) {
              tnu += Number(vm.result[l].course.unit);
            }
            for (var m = 0; m < vm.result.length; m++) {
              tcp += Number(vm.result[m].gp) * Number(vm.result[m].course.unit);
            }
            for (var z = 0; z < vm.result.length; z++) {
              if (vm.result[z].grade !== 'F') {
                tce += Number(vm.result[z].gp);
              }
            }
            gpa = tcp / tnu;
            tce += Number(vm.last.tce);
            ctcp = tcp + Number(vm.last.tcp);
            ctnu = tnu + Number(vm.last.tnu);
            cgpa = ctcp / ctnu;
            if (vm.resultFail.length > 0) {
              status = 0
            }
            if (cgpa >= 4.00) {
              gp_status = 1;
            }
            else if (cgpa >= 1.50 && cgpa <= 3.99) {
              gp_status = 2;
            }
            else if (cgpa >= 1.00 && cgpa < 1.50) {
              gp_status = 3;
            }
            else if (cgpa <= 1.00) {
              gp_status = 4;
            }
            dat = {
              info: vm.student,
              results: vm.result,
              resultFail: vm.resultFail,
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
            var d = {
              student: vm.student.id,
              session: vm.session.id,
              dept: vm.student.deptId,
              semester: vm.semester.semester,
              tcp: dat.tcp,
              tnu: dat.tnu,
              gpa: dat.gpa,
              ctcp: dat.ctcp,
              ctnu: dat.ctnu,
              cgpa: dat.cgpa,
              tce: dat.tce,
              prev_ctcp: dat.prev_ctcp,
              prev_ctnu: dat.prev_ctnu,
              prev_cgpa: dat.prev_cgpa,
              status: dat.gp_status,
              rel: 0
            };
            CourseResultGPA.save(d).$promise
              .then(function () {
                SystemLog.add("Re-Processed Result");
                toastr.success("Result Processed");
              })
              .catch(function () {
                toastr.error("Error");
              });
          }
        }
      }
    }
  });
