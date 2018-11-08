/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 01-Mar-18.
 */
angular.module('b')
  .controller('StudentEditCtrl',function ($stateParams,CurrentUser,Student,User,Access,College,Major,Dept,ModeOfEntry,Level,Upload,Host,$timeout,toastr,$state) {
    Access.general();
    var vm = this;
    vm.change_pass = false;
    vm.submit = submit;
    vm.upload_file = upload_file;
    vm.uploaded = false;
    vm.u = CurrentUser.profile;
    function get_student() {
      User.get({id:$stateParams.id}).$promise
        .then(function (data) {
          vm.user = data;
          vm.user.password = '';
        });
      Student.get({user:$stateParams.id}).$promise
        .then(function (data) {
          vm.student = data;
        });
    }get_student();
    vm.colleges = College.query();
    vm.depts = Dept.query();
    vm.majors = Major.query();
    vm.mode_of_entrys = ModeOfEntry.query();
    vm.levels = Level.query();

    function submit() {
      if(vm.form.$valid){
        if (vm.form.password.$pristine || vm.user.password === ''){
        delete vm.user.password;
      }
        delete vm.user.img;
        User.patch(vm.user).$promise
          .then(function (data) {
            vm.user = data;
            save_student();
          })
          .catch(function () {
            toastr.error("Unable to Edit User");
            get_student();
          });
      }
      else{
        toastr.error("Errors in form");
      }
    }
    function save_student() {
      vm.student.user = vm.user.id;
      vm.student.major = vm.student.major.id;
      vm.student.mode_of_entry = vm.student.mode_of_entry.id;
      vm.student.level = vm.student.level.id;
      if(vm.u.type === '7'){
        vm.student.edit = true;
      }
      Student.patch(vm.student).$promise
        .then(function (data) {
          vm.student = data;
          if(vm.change_pass === true){
            upload_file();
          }
          else{
            toastr.success("Student Profile Edited");
            vm.uploaded = true;
            $state.go("home");
          }
        })
        .catch(function () {
          toastr.error("Unable to Edit Student");
          get_student();
        });
    }
    function upload_file(){
      vm.img = {};
      vm.img.upload = Upload.upload({
        url: Host.host+'/user/'+vm.user.id+'/',
        method: 'patch',
        data: {
          img: Upload.dataUrltoBlob(vm.pass, vm.p.name)
        }
      });
      vm.img.upload.then(function (response) {
        $timeout(function () {
          vm.img.result = response.data;
          toastr.success("Files uploaded");
          toastr.success("Student Profile Edited");
          vm.uploaded = true;
          $state.go("home");
        });
        },
        function (response) {
        if(response.status > 0)
          vm.errorMsg = response.status + ': ' + response.data;
        },
        function (evt) {
        vm.img.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }
  });
