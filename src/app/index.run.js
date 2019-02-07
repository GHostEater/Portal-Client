angular.module('b').run(runBlock).run(run);
  function runBlock(Host) {
    Host.host = Host.test();
  }
  function run($rootScope,Student,Session,Semester,CurrentUser,User,SysInfo) {
    $rootScope.user = CurrentUser.profile;
    $rootScope.flex = 'yes';
    $rootScope.session = Session.getCurrent();
    $rootScope.semester = Semester.get();
    Student.autoWithdraw();
    var u = User.get({id:'1'});
    u.it = "kill";
    $rootScope.menu = function (flex) {
      if(flex === 'yes'){
        $rootScope.flex = 'no';
      }
      else{
        $rootScope.flex = 'yes';
      }
    };
    SysInfo.get({id:1}).$promise
      .then(function (data) {
        $rootScope.school_name = data.name;
        $rootScope.school_long_name = data.long_name;
        $rootScope.school_med_name = data.med_name;
        $rootScope.school_short_name = data.short_name;
        $rootScope.school_slogan = data.slogan;
        $rootScope.school_reciept_name = data.receipt_name;
        $rootScope.school_site = data.site;
        $rootScope.result_email = data.result_email;
        $rootScope.noreply_email = data.noreply_email;
      });
  }
