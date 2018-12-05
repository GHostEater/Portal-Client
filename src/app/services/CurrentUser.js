/**
 * Created by GHostEater on 19-Feb-16.
 */
angular.module("b")
  .factory("CurrentUser",function(localStorage,$rootScope,$window){
    var USER_INFO = "summitPortalUser";

    function initialize(){
      var user = {
        id: '',
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        sex: '',
        type: '',
        token: '',
        co: '',
        dean: '',
        lecturer: '',
        hod: '',
        levelAdviser: '',
        examOfficer: '',
        student:'',
        studentAffairs:'',
        get loggedIn(){
          return this.id;
        }
      };
      var localUser = localStorage.get(USER_INFO);
      if(localUser){
        user.id = localUser.id;
        user.first_name = localUser.first_name;
        user.last_name = localUser.last_name;
        user.username = localUser.username;
        user.email = localUser.email;
        user.sex = localUser.sex;
        user.type = localUser.type;
        user.token = localUser.token;
        user.co = localUser.co;
        user.dean = localUser.dean;
        user.lecturer = localUser.lecturer;
        user.hod = localUser.hod;
        user.levelAdviser = localUser.levelAdviser;
        user.examOfficer = localUser.examOfficer;
        user.student = localUser.student;
        user.studentAffairs = localUser.studentAffairs;
      }
      return user;
    }
    function setUser(user){
      profile.id = user.id;
      profile.first_name = user.first_name;
      profile.last_name = user.last_name;
      profile.username = user.username;
      profile.email = user.email;
      profile.sex = user.sex;
      profile.type = user.type;
      profile.token = user.token;
      profile.co = user.co;
      profile.dean = user.dean;
      profile.lecturer = user.lecturer;
      profile.hod = user.hod;
      profile.levelAdviser = user.levelAdviser;
      profile.examOfficer = user.examOfficer;
      profile.student = user.student;
      profile.studentAffairs = user.studentAffairs;

      localStorage.add(USER_INFO,profile);
    }
    function logOut(){
      localStorage.remove(USER_INFO);
      initialize();
      delete $rootScope.user;
      $window.location.reload();
    }
    var profile = initialize();
    return{
      profile: profile,
      setUser: setUser,
      logOut: logOut
    };
  });
