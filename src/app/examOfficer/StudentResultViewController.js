/**
 * Created by GHostEater on 6/12/2016.
 */
angular.module("b")
  .controller("StudentResultViewController",function(CourseResult,CourseResultGPA,CourseReg,CourseToMajor,CourseWaving,Student,lodash,toastr,$stateParams,Session,Semester,CurrentUser,SystemLog,$uibModal,Access){
    Access.general();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.results = [];
    vm.fails = [];
    vm.outstandings = [];
    vm.sessions = Session.query();
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    Student.get({user:$stateParams.userId}).$promise
      .then(function (data) {
        vm.student = data;
        getGP();
      });
    function getGP() {
      CourseResultGPA.student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.gps = lodash.sortBy(data,['session','semester']);
          angular.forEach(vm.gps,function (gp) {
            CourseResult.student({student: vm.student.id}).$promise
              .then(function (data) {
                vm.result = lodash.filter(data, {session: gp.session, course: {semester: vm.gp.semester}});
                vm.resultFail = lodash.filter(data, {grade: 'F'});
                sortResults();
              });
            function sortResults() {
              var dat = {
                result: vm.result,
                gp: gp
              };
              vm.results.push(dat);
            }
          });
        });
    }
    vm.editCa = function(result){
      var options = {
        templateUrl: 'app/lecturer/editCa.html',
        controller: "EditCaController",
        controllerAs: 'vm',
        size: 'sm',
        resolve:{
          result: function(){
            return result;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
          getGP();
        });
    };
    vm.editExam = function(result){
      var options = {
        templateUrl: 'app/lecturer/editExam.html',
        controller: "EditExamController",
        controllerAs: 'vm',
        size: 'sm',
        resolve:{
          result: function(){
            return result;
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
            vm.result = lodash.filter(data, {session:{id:gp.session.id}, course: {semester: gp.semester}});
            vm.resultFail = [];
            vm.stdResults = data;
            vm.stdResultsFail = lodash.filter(data, {grade: "F"});
            angular.forEach(vm.stdResultsFail,function (result) {
              if (!lodash.find(vm.stdResults, {course:{id:result.course.id}, status: 1}) && !lodash.find(vm.wavings, {course:{id:result.course.id}})) {
                vm.resultFail.push(result);
              }
            });
            computeGP(gp);
          });
      }
      function computeGP(gp) {
        var session = gp.session;
        if (vm.student.status === '1') {
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
          angular.forEach(vm.result,function (res) {
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
          if(vm.resultFail.length > 0 || vm.outstandings.length > 0){status=0;}
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
            info: vm.student,
            result: vm.result,
            resultFail: vm.resultFail,
            outstandings: vm.outstandings,
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
          var data = {
            student: vm.student.id,
            session: session.id,
            dept: vm.student.dept.id,
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
          CourseResultGPA.save(data).$promise
            .then(function () {
              SystemLog.add("Re-Processed Result");
              toastr.success("Result Processed");
            })
            .catch(function () {
              toastr.error("Error");
            });
        }
      }
    };
  });
