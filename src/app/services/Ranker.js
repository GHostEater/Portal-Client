/**
 * Created by GHostEater on 15-May-17.
 */
angular.module('b')
  .factory("Ranker", function (CurrentUser) {
    function get(){
      var rank = CurrentUser.profile.type;
      if(rank === '1'){
        return "Admin";
      }
      else if(rank === '2'){
        return "Academic Affairs";
      }
      else if(rank === '3'){
        return "Bursar";
      }
      else if(rank === '4'){
        return "Student Affairs";
      }
      else if(rank === '5'){
        return "College Officer";
      }
      else if(rank === '6'){
        if(CurrentUser.profile.hod){
          return "Head of Department";
        }
        else if(CurrentUser.profile.levelAdviser){
          return "Level Adviser";
        }
        else if(CurrentUser.profile.examOfficer){
          return "Exam Officer";
        }
        else{
          return "Lecturer";
        }
      }
      else if(rank === '7'){
        return "Student";
      }
    }
    return{
      get: get
    }
  });
