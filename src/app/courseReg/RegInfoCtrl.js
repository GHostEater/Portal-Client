/* eslint-disable angular/controller-name */
/**
 * Created by P-FLEX MONEY on 04-Dec-18.
 */
angular.module('b')
  .controller('RegInfoCtrl', function (CurrentUser,$state,Session) {
    var vm = this;
    if (CurrentUser.profile.id){
      $state.go('home');
    }
    vm.session = Session.getCurrent();
  });
