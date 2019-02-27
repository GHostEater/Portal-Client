/* eslint-disable angular/controller-name,angular/definedundefined */
angular.module("b")
  .controller("CourseDetailsCtrl",function(CourseAllocation,$interval,$rootScope,CourseReg,CourseResult,CourseResultEditRequest,Student,Lecturer,Session,Semester,CurrentUser,lodash,toastr,$stateParams,$uibModal,SystemLog,$filter,Access){
    Access.notStudent();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.course = CourseAllocation.get({id:$stateParams.id});
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.getDetails = getDetails;
    vm.request = request;
    vm.uploadCA = uploadCA;
    vm.uploadExam = uploadExam;
    vm.request = request;
    vm.perm = {status: null};
    vm.upload_status = CourseResult.getUploadStatus();
    function getRequests() {
      CourseResultEditRequest.query().$promise
      .then(function (data) {
        vm.perm = lodash.find(data,{lecturer:{id:vm.user.lecturer.id},status:1});
        if(vm.perm){
          check_perm_status();
        }
      });
    }getRequests();
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
    function getDetails() {
      vm.lecturer = vm.course.lecturer;
      var data = {
        course: vm.course.course.id,
        session: vm.session.id
      };
      CourseReg.getRegAndRawResult(data).$promise
        .then(function (data) {
          vm.passPercentage = data.pass_percentage;
          vm.course_grades = data.course_grades;
          vm.students = data.students;
        });
    }

    function uploadCA(){
      var caArray = [];
      vm.notReg = [];
      for(var i = 0; i<(Number(vm.ca.data.length)-1); i++){
        vm.student = lodash.find(vm.students,{info:{user:{username:$filter('matricNo')(vm.ca.data[i][0])}}});

        if(!vm.student){
          vm.notReg.push($filter('matricNo')(vm.ca.data[i][0]));
          continue;
        }

        if(vm.ca.data[i][1] === "" || vm.ca.data[i][1] === undefined){
          vm.ca.data[i][1] = 0;
        }

        var data = {
          course: vm.course.course.id,
          student: vm.student.info.id,
          ca: vm.ca.data[i][1],
          dept: vm.student.info.major.dept.id,
          session: vm.session.id
        };
        caArray.push(data);
      }
      vm.uploaded = caArray.length;
      vm.req = {
        ca: caArray,
        lecturer: vm.lecturer.id,
        session: vm.session.id,
        course: vm.course.course.id
      };
      CourseResult.uploadCA(vm.req).$promise
        .then(function(data){
          SystemLog.add("Uploaded CA");
          toastr.success("CA Uploaded");
          vm.processed = data.processed;
          getDetails();
        });
    }
    function uploadExam(){
      var examArray = [];
      vm.notReg = [];
      for(var i = 0; i<(Number(vm.exam.data.length)-1); i++){
        vm.student = lodash.find(vm.students,{info:{user:{username:$filter('matricNo')(vm.exam.data[i][0])}}});

        if(!vm.student){
          vm.notReg.push($filter('matricNo')(vm.exam.data[i][0]));
          continue;
        }

        if(vm.exam.data[i][1] === "" || vm.exam.data[i][1] === undefined){
          vm.exam.data[i][1] = 0;
        }

        var data = {
          id: vm.student.result.id,
          exam: vm.exam.data[i][1]
        };
        examArray.push(data);
      }
      vm.uploaded = examArray.length;
      vm.req = {
        exam: examArray,
        lecturer: vm.lecturer.id,
        session: vm.session.id,
        course: vm.course.course.id
      };
      CourseResult.uploadExam(vm.req).$promise
        .then(function(data){
          SystemLog.add("Uploaded Exam");
          toastr.success("Exam Uploaded");
          vm.processed = data.processed;
          getDetails();
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
          getDetails();
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
          getDetails();
        });
    };
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
  });
