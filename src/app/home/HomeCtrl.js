angular.module('b')
  .controller('HomeCtrl', function (CurrentUser,Session) {
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.session = Session.getCurrent();
    vm.sessionActions = function () {
      Session.actions().$promise
        .then(function () {
          vm.session = Session.getCurrent();
        });
    };
  });
