angular.module('b').run(runBlock).run(run);
  function runBlock(Host) {
    Host.host = Host.test();
  }
  function run($rootScope,Student,Session,Semester,CurrentUser,User) {
    $rootScope.user = CurrentUser.profile;
    $rootScope.flex = 'yes';
    $rootScope.date = new Date();
    $rootScope.session = Session.getCurrent();
    $rootScope.semester = Semester.get();
    Student.autoWithdraw();
    var u = User.get({id:'1'});
  }
