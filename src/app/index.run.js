angular.module('b').run(runBlock).run(run);
  function runBlock(Host) {
    Host.host = Host.test();
  }
  function run($rootScope,Student,Session,Semester,CurrentUser,User) {
    $rootScope.user = CurrentUser.profile;
    $rootScope.flex = 'yes';
    $rootScope.session = Session.getCurrent();
    $rootScope.semester = Semester.get();
    Student.autoWithdraw();
    var u = User.get({id:'1'});
    $rootScope.menu = function (flex) {
      if(flex === 'yes'){
        $rootScope.flex = 'no';
      }
      else{
        $rootScope.flex = 'yes';
      }
    };

    $rootScope.school_name = "Summit";
    $rootScope.school_long_name = "Summit University, Offa";
    $rootScope.school_short_name = "Summit";
    $rootScope.school_slogan = "";
    $rootScope.school_reciept_name = "SUNO-";
  }
