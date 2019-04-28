/**
 * Created by GHostEater on 6/12/2016.
 */
angular.module("b")
  .controller("StudentResultViewController",function(CourseResultEditRequest,$interval,CourseResult,CourseResultGPA,CourseReg,CourseToMajor,CourseWaving,Student,lodash,toastr,$stateParams,Session,Semester,CurrentUser,SystemLog,$uibModal,Access){
    Access.general();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.results = [];
    vm.fails = [];
    vm.outstandings = [];
    vm.sessions = Session.query();
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.request = request;
    vm.processResult = processResult;
    vm.perm = {status: null};
    if(vm.user.type === '6'){
      getRequests();
    }
    function getRequests() {
      CourseResultEditRequest.query().$promise
      .then(function (data) {
        vm.perm = lodash.find(data,{lecturer:{id:vm.user.lecturer.id}});
        if(vm.perm.status === 1){
          check_perm_status();
        }
      });
    }
    function check_perm_status() {
      function check_status_validity() {
        vm.date = Date.now();
        vm.end_date = new Date(vm.perm.end_date);
        if(vm.end_date <= vm.date){
          CourseResultEditRequest.delete({id:vm.perm.id}).$promise
            .then(function () {
              getRequests();
            });
        }
      }
      $interval(check_status_validity(),1000);
    }
    Student.get({user:$stateParams.userId}).$promise
      .then(function (data) {
        vm.student = data;
        getGP();
      });
    function getGP() {
      vm.results = [];
      vm.fails = [];
      CourseResultGPA.student({student:vm.student.id}).$promise
        .then(function (data) {
          vm.gps = lodash.sortBy(data,['session','semester']);
          angular.forEach(vm.gps,function (gp) {
            CourseResult.student({student: vm.student.id}).$promise
              .then(function (data) {
                vm.result = lodash.filter(data, {session: gp.session, course: {semester: gp.semester}});
                vm.resultFail = lodash.filter(data, {grade: 'E'});
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
    function request(id){
      var options = {
        templateUrl: 'app/lecturer/requestEdit.html',
        controller: "RequestEditCtrl",
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
          getRequests();
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
    function processResult(gp) {
      CourseResult.student({student: vm.student.id}).$promise
        .then(function (data) {
          vm.result = lodash.filter(data, {session:{id:gp.session.id}, course: {semester: gp.semester}});
          vm.resultFail = [];
          vm.stdResults = data;
          vm.stdResultsFail = lodash.filter(data, {grade: "E"});
          angular.forEach(vm.stdResultsFail,function (result) {
            if (!lodash.find(vm.stdResults, {course:{id:result.course.id}, status: 1}) && !lodash.find(vm.wavings, {course:{id:result.course.id}})) {
              vm.resultFail.push(result);
            }
          });
          computeGP(gp);
        });
      function computeGP(gp) {
        var session = gp.session;
        if (vm.student.status === '1') {
          vm.key = lodash.findIndex(vm.gps,{session:{id:gp.session.id},semester:gp.semester});
          vm.key -= 1;
          vm.last = vm.gps[vm.key];
          var tnu = 0;
          var tcp = 0;
          var tce = 0;
          var status = 1;
          angular.forEach(vm.result,function (res) {
            tnu += Number(res.course.unit);
            tcp += Number(res.gp) * Number(res.course.unit);
            if (res.grade !== 'E') {
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
          var data = {
            id: gp.id,
            student: vm.student.id,
            session: session.id,
            dept: vm.student.major.dept.id,
            semester: gp.semester,
            tcp: tcp,
            tnu: tnu,
            gpa: gpa,
            ctcp: ctcp,
            ctnu: ctnu,
            cgpa: cgpa,
            tce: tce,
            prev_ctcp: vm.last.ctcp,
            prev_ctnu: vm.last.ctnu,
            prev_cgpa: vm.last.cgpa,
            prev_tce: vm.last.tce,
            status: status,
            rel: 0
          };
          CourseResultGPA.patch(data).$promise
            .then(function () {
              SystemLog.add("Re-Processed Result");
              toastr.success("Result Processed");
              getGP();
            })
            .catch(function () {
              toastr.error("Error");
            });
        }
      }
    }
  });
