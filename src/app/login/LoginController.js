/**
 * Created by GHostEater on 19-Feb-16.
 */
angular.module("b")
  .controller("LoginController",function(Auth,User,$state,$filter,CurrentUser,toastr,Random,Bursar,$rootScope,Student,Lecturer,Hod,LevelAdviser,ExamOfficer,CollegeOfficer,Dean,Session,Semester,SystemLog,StudentAffairs){
    var vm = this;
    $rootScope.flex = 'yes';
    vm.forgot_pass = false;
    vm.link_sent = 0;
    vm.user = CurrentUser.profile;
    vm.semester = Semester.get();
    vm.login = login;
    vm.forgot = forgot;
    if(CurrentUser.profile.loggedIn){
      $rootScope.flex = 'yes';
      $state.go('home');
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
              CollegeOfficer.get({user:vm.data.id}).$promise
                .then(function (data) {
                  vm.data.co = data;
                  setUser();
                });
            }
            else if(vm.data.type === '4'){
              StudentAffairs.get({user:vm.data.id}).$promise
                .then(function (data) {
                  vm.data.studentAffairs = data;
                  setUser();
                });
            }
            else if(vm.data.type === '2'){
              Bursar.get({user:vm.data.id}).$promise
                .then(function (data) {
                  vm.data.bursar = data;
                  setUser();
                });
            }
            else if(vm.data.type === '8'){
              Dean.get({user:vm.data.id}).$promise
                .then(function (data) {
                  vm.data.dean = data;
                  setUser();
                });
            }
            else if(vm.data.type === '6'){
              Lecturer.get({user:vm.data.id}).$promise
                .then(function(data){
                  vm.lecturer = data;
                  vm.data.lecturer = data;
                  getHod(data.id);
                });
            }
            else if(vm.data.type === '7'){
              Student.get({user:vm.data.id}).$promise
                .then(function (data) {
                  vm.data.student = data;
                  setUser();
                });
            }
            else{
              setUser();
            }
            function getHod(id){
              Hod.get({lecturer:id}).$promise
                .then(function(data){
                  vm.data.hod = data;
                })
                .finally(function () {
                  getLevelAdviser(vm.lecturer.id);
                });
            }
            function getLevelAdviser(id){
              LevelAdviser.get({lecturer:id}).$promise
                .then(function(data){
                  vm.data.levelAdviser = data;
                }).finally(function () {
                getExamOfficer(vm.lecturer.id);
              });
            }
            function getExamOfficer(id) {
              ExamOfficer.get({lecturer:id}).$promise
                .then(function(data){
                  vm.data.examOfficer = data;
                }).finally(function () {
                setUser();
              });
            }
            function setUser(){
              SystemLog.add("Login");
              CurrentUser.setUser(vm.data);
              $rootScope.user = CurrentUser.profile;
              toastr.success("Login Successful");
              $rootScope.flex = 'yes';
              $rootScope.session = Session.getCurrent();
              $rootScope.semester = Semester.get();
              $rootScope.$broadcast('paymentMade');
              $rootScope.$broadcast('login');
              $state.go('home');
            }
          });
      }
    }
    function forgot() {
      var rand = Random.string(13);
      var rand2 = Random.string(13);
      User.email({email:vm.email}).$promise
        .then(function (data) {
          var link = $state.href('pass_reset',{rand:rand,rand2:rand2,id:data.id});
          var request = {
            link: +$rootScope.school_portal_site+"/"+link,
            school_med_name: $rootScope.school_med_name,
            email: vm.email,
            sender_email: $rootScope.noreply_email
          };
          Auth.pass_reset(request).$promise
            .then(function (data) {
              if(data.user_exists === true){
                vm.link_sent = 1;
                toastr.success("Reset Link Has Been Sent To Your Email");
              }
              else{
                vm.link_sent = 2;
                toastr.error("No User With This Email Exists in the System, Try Again");
              }
            });
        })
        .catch(function () {
          vm.link_sent = 2;
          toastr.error("No User With This Email Exists in the System, Try Again");
        });
    }
  });
