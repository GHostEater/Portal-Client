/* eslint-disable angular/controller-name */
angular.module("b")
  .controller('AllocateCtrl',function(CourseAllocation,toastr,$uibModalInstance,lodash,CurrentUser,Lecturer,Hod,Course,Session,SystemLog){
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.lecturerSelect = 0;
    vm.selectLecturer = selectLecturer;
    vm.selectHod = selectHod;
    vm.deSelectLecturer = deSelectLecturer;
    vm.lecturers = Lecturer.query();
    vm.hods = Hod.query();
    vm.dept = vm.user.hod.dept;
    vm.session = Session.getCurrent();
    Course.query().$promise
      .then(function (data) {
        vm.courses = lodash.filter(data,{dept:{name:vm.user.hod.dept.name}});
      });
    if(vm.user.hod){
      vm.hod = vm.user.hod;
    }

    function selectLecturer(lecturer){
      vm.lecturer = lecturer;
      if(vm.user.type !== '1'){
        vm.lecturerSelect = 1;
      }
    }
    function selectHod(hod) {
      vm.hod = hod;
      vm.lecturerSelect = 1;
    }
    function deSelectLecturer(){
      delete vm.lecturer;
      if(vm.user.type === '1'){
        delete vm.hod;
      }
      vm.lecturerSelect = 0;
    }
    vm.ok = function(){
      if(vm.form.$valid) {
        var data = {
          course: vm.course.id,
          lecturer: vm.lecturer.id,
          allocated_by: vm.hod.lecturer.id,
          session: vm.session.id,
          position: vm.position,
          dept: vm.dept.id
        };
        CourseAllocation.save(data).$promise
          .then(function () {
            SystemLog.add("Allocated Course");
            toastr.success("Course Allocated");
            $uibModalInstance.close();
          })
          .catch(function () {
            toastr.error("Error");
          });
      }
    };
  });
