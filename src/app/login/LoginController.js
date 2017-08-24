/**
 * Created by GHostEater on 19-Feb-16.
 */
angular.module("b")
  .controller("LoginController",function(Auth,$location,$filter,CurrentUser,toastr,$rootScope,Student,Lecturer,Hod,LevelAdviser,ExamOfficer,CollegeOfficer,Dean,Semester,SystemLog){
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.semester = Semester.get();
    vm.login = login;
    if(CurrentUser.profile.loggedIn){
      $location.url('/home/');
    }
    function login(username,password){
      var user = $filter('matricNo')(username);
      vm.error = false;
      Auth.login({username:user,password:password}).$promise
        .then(function(data){
          vm.data = data;
          getToken();
        })
        .catch(function(){
          toastr.error("Incorrect Username/Password");
        });
      function getToken() {
        Auth.getToken({username:user,password:password}).$promise
          .then(function (data) {
            vm.data.token = data.token;

            if(vm.data.type === '5'){
              CollegeOfficer.get({userId:vm.data.id}).$promise
                .then(function (data) {
                  vm.data.co = data;
                  setUser();
                });
            }
            else if(vm.data.type === '8'){
              Dean.get({userId:vm.data.id}).$promise
                .then(function (data) {
                  vm.data.dean = data;
                  setUser();
                });
            }
            else if(vm.data.type === '6'){
              Lecturer.get({userId:vm.data.id}).$promise
                .then(function(data){
                  vm.lecturer = data;
                  getHod(data.id);
                });
              function getHod(id){
                Hod.get({lecturerId:id}).$promise
                  .then(function(data){
                    vm.data.hod = data;
                    setUser();
                  })
                  .finally(function () {
                    getLevelAdviser(vm.lecturer.id);
                  });
              }
              function getLevelAdviser(id){
                LevelAdviser.get({lecturerId:id}).$promise
                  .then(function(data){
                    vm.data.levelAdviser = data;
                    setUser();
                  }).finally(function () {
                    getExamOfficer(vm.lecturer.id);
                  });
              }
              function getExamOfficer(id) {
                ExamOfficer.get({lecturerId:id}).$promise
                  .then(function(data){
                    vm.data.examOfficer = data;
                    setUser();
                  }).finally(function () {
                  setUser();
                });
              }
            }
            else if(vm.data.type === '7'){
              Student.get({userId:vm.data.id}).$promise
                .then(function (data) {
                  vm.data.student = data;
                  setUser();
                })
            }
            else{
              setUser();
            }
            function setUser(){
              SystemLog.add("Login");
              CurrentUser.setUser(vm.data);
              $rootScope.user = CurrentUser.profile;
              toastr.success("Login Successful");
              $location.url('/home/');
            }
          });
      }
    }
  });
