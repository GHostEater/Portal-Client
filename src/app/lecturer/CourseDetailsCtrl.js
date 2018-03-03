/* eslint-disable angular/controller-name */
angular.module("b")
  .controller("CourseDetailsCtrl",function(CourseAllocation,CourseReg,CourseResult,CourseResultEditRequest,Student,Lecturer,Session,Semester,CurrentUser,lodash,toastr,$stateParams,$uibModal,SystemLog,$filter,Access){
    Access.lecturer();
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.lecturer = vm.user.lecturer;
    vm.course = CourseAllocation.get({id:$stateParams.id});
    vm.session = Session.getCurrent();
    vm.semester = Semester.get();
    vm.getDetails = getDetails;
    vm.request = request;
    vm.uploadCA = uploadCA;
    vm.uploadExam = uploadExam;
    vm.request = request;
    function getRequests() {
      CourseResultEditRequest.query().$promise
      .then(function (data) {
        vm.perm = lodash.find(data,{lecturer:vm.lecturer,status:1});
      });
    }getRequests();

    function getDetails() {
      vm.students = [];
      var data = {
        course: vm.course.course.id,
        session: vm.session.id
      };
      CourseResult.course(data).$promise
        .then(function (data) {
          vm.results = data;
          vm.pass = lodash.filter(vm.results,{status:'1'});
          vm.passPercentage = (Number(vm.pass.length)/Number(vm.results.length))*100;
          vm.a = lodash.filter(vm.results,{grade:'A'}).length;
          vm.b = lodash.filter(vm.results,{grade:'B'}).length;
          vm.c = lodash.filter(vm.results,{grade:'C'}).length;
          vm.d = lodash.filter(vm.results,{grade:'D'}).length;
          vm.f = lodash.filter(vm.results,{grade:'F'}).length;
          getCourseReg();
        });
    }
    function getCourseReg() {
      CourseReg.course({course:vm.course.course.id,session:vm.session.id}).$promise
        .then(function (data) {
          for(var i=0; i<data.length; i++){
            Student.get({user:data[i].student.user.id}).$promise
            .then(function(data){
                vm.students.push({
                  info: data,
                  result: lodash.find(vm.results,{student:{id:data.id}})
                });
              });
          }
        });
    }

    function uploadCA(){
      vm.notReg = [];
      for(var i = 0; i<(Number(vm.ca.data.length)-1); i++){
        var username = $filter('matricNo')(vm.ca.data[i][0]);
        if(!lodash.find(vm.students,{info:{user:{username:username}}})){
          vm.notReg.push(vm.ca.data[i][0]);
        }
        else{
          vm.student = lodash.find(vm.students,{info:{user:{username:username}}});
          var ca;
          if(Number(vm.ca.data[i][1]) >= Number(vm.course.course.ca)){
            ca = vm.course.course.ca;
          }
          else{
            ca = vm.ca.data[i][1];
          }
          var data = {
            course: vm.course.course.id,
            student: vm.student.info.id,
            ca: ca,
            dept: vm.student.info.dept.id,
            session: vm.session.id
          };
          CourseResult.uploadCA(data).$promise
            .then(function(){
              SystemLog.add("Uploaded CA");
              toastr.success("CA Uploaded");
            });
        }
      }
    }
    function uploadExam(){
      vm.notReg = [];
      for(var i = 0; i<(Number(vm.exam.data.length)-1); i++){
        var username = $filter('matricNo')(vm.exam.data[i][0]);
        if(!lodash.find(vm.students,{info:{user:{username:username}}})){
          vm.notReg.push(vm.exam.data[i][0]);
        }
        else {
          vm.student = lodash.find(vm.students, {info: {user: {username: username}}});

          var grade = '';
          var gp = '';
          var status = '';
          var exam = vm.exam.data[i][1];
          if (Number(exam) >= Number(vm.course.course.exam)) {
            exam = vm.course.course.exam;
          }
          var final = Number(vm.student.result.ca) + Number(exam);
          final = Math.round(final);
          if (final >= 100) {
            final = 100;
          }
          if (final >= 70 && final <= 100) {
            grade = 'A';
            gp = 4;
          }
          else if (final >= 60 && final <= 69) {
            grade = 'B';
            gp = 3;
          }
          else if (final >= 50 && final <= 59) {
            grade = 'C';
            gp = 2;
          }
          else if (final >= 45 && final < 50) {
            grade = 'D';
            gp = 1;
          }
          else if (final <= 44) {
            grade = 'F';
            gp = 0;
          }
          if (grade === 'F') {
            status = 0;
          }
          else {
            status = 1;
          }

          var data = {
            id: vm.student.result.id,
            exam: vm.exam.data[i][1],
            final: final,
            grade: grade,
            gp: gp,
            status: status
          };
          CourseResult.uploadExam(data).$promise
            .then(function () {
              SystemLog.add("Uploaded Exam");
              toastr.success("Exam Uploaded");
            });
        }
      }
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
