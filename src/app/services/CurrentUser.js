/**
 * Created by GHostEater on 19-Feb-16.
 */
angular.module("b")
  .factory("CurrentUser",function(localStorage){
    var USER_INFO = "portalUser";

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
        hod: '',
        levelAdviser: '',
        examOfficer: '',
        student:'',
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
        user.hod = localUser.hod;
        user.levelAdviser = localUser.levelAdviser;
        user.examOfficer = localUser.examOfficer;
        user.student = localUser.student;
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
      profile.hod = user.hod;
      profile.levelAdviser = user.levelAdviser;
      profile.examOfficer = user.examOfficer;
      profile.student = user.student;

      localStorage.add(USER_INFO,profile);
    }
    function logOut(){
      localStorage.remove(USER_INFO);
    }
    var profile = initialize();
    return{
      profile: profile,
      setUser: setUser,
      logOut: logOut
    }
  });
