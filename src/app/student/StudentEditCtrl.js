/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 01-Mar-18.
 */
angular.module('b')
  .controller('StudentEditCtrl',function ($stateParams,lodash,CurrentUser,Country,StateLga,Student,User,Access,College,Major,Dept,ModeOfEntry,Level,Upload,Host,$timeout,toastr,$window) {
    Access.general();
    var vm = this;
    vm.change_pass = false;
    vm.change_sign = false;
    vm.submit = submit;
    vm.upload_file = upload_file;
    vm.uploaded = false;
    vm.u = CurrentUser.profile;
    function get_student() {
      User.get({id:$stateParams.id}).$promise
        .then(function (data) {
          vm.user = data;
          vm.user.password = '';
          Country.query().$promise
            .then(function (data) {
              vm.countries = data;
              vm.country = lodash.find(vm.countries,{name:vm.user.nationality});
            });
          StateLga.query().$promise
            .then(function (data) {
              vm.states = data;
              vm.state = lodash.find(vm.states,{state:vm.user.state_origin});
            });
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
        delete vm.user.sign;
        vm.user.nationality = vm.country.name;
        vm.user.state_origin = vm.state.state;
        if(vm.user.nationality !== 'Nigeria'){
          vm.user.state_origin = "";
          vm.user.lga = "";
          vm.user.town = "";
        }
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
            $window.history.back();
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
          img: Upload.dataUrltoBlob(vm.pass, vm.p.name),
          sign: vm.sign
        }
      });
      vm.img.upload.then(function (response) {
        $timeout(function () {
          vm.img.result = response.data;
          toastr.success("Files uploaded");
          toastr.success("Student Profile Edited");
          vm.uploaded = true;
          $window.location.back();
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
