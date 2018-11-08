/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 18-Mar-18.
 */
angular.module('b')
  .controller('SessionCtrl',function (Access,Session,toastr,$uibModal,SystemLog) {
    Access.admin();
    var vm = this;
    function getSession() {
      vm.sessions = Session.query();
      vm.session = Session.getCurrent();
    }getSession();
    vm.set_current = set_current;
    vm.set_admission = set_admission;
    vm.add = add;
    vm.edit = edit;

    function set_current(session) {
      Session.setCurrent({id:session.id}).$promise
        .then(function () {
          toastr.success("Successfully Set Session as Current");
          getSession();
          SystemLog.add("Set "+session.session+" as Current Session");
        });
    }
    function set_admission(session) {
      Session.setAdmission({id:session.id}).$promise
        .then(function () {
          toastr.success("Successfully Set Session as Admission");
          getSession();
          SystemLog.add("Set "+session.session+" as Admission Session");
        });
    }
    function add(){
      var options = {
        templateUrl: 'app/admin/session_add.html',
        controller: "SessionAddCtrl",
        controllerAs: 'vm',
        size: 'md'
      };
      $uibModal.open(options).result
        .then(function(){
          getSession();
        });
    }
    function edit(session){
      var options = {
        templateUrl: 'app/admin/session_edit.html',
        controller: "SessionEditCtrl",
        controllerAs: 'vm',
        size: 'sm',
        resolve:{
          session: function(){
            return session;
          }
        }
      };
      $uibModal.open(options).result
        .then(function(){
          getSession();
        });
    }
  });
