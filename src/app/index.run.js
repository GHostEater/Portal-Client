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

    $rootScope.school_name = "Portal";
    $rootScope.school_long_name = "Portal University, World";
    $rootScope.school_med_name = "Portal University";
    $rootScope.school_short_name = "Portal";
    $rootScope.school_slogan = "The Best Portal System";
    $rootScope.school_reciept_name = "PRT-";
    $rootScope.school_site = "https://portal.com";
  }
