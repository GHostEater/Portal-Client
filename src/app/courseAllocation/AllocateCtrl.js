/* eslint-disable angular/controller-name */
angular.module("b")
  .controller('AllocateCtrl',function(CourseAllocation,toastr,$uibModalInstance,lodash,CurrentUser,Lecturer,Course,Session,SystemLog){
    var vm = this;
    vm.user = CurrentUser.profile;
    vm.lecturerSelect = 0;
    vm.selectLecturer = selectLecturer;
    vm.deSelectLecturer = deSelectLecturer;
    vm.lecturers = Lecturer.query();
    vm.dept = vm.user.hod.dept;
    Course.query().$promise
      .then(function (data) {
        vm.courses = lodash.filter(data,{dept:{name:vm.user.hod.dept.name}});
      });
    vm.session = Session.getCurrent();

    function selectLecturer(id){
      vm.lecturer = lodash.find(vm.lecturers,{id:id});
      vm.lecturerSelect = 1;
    }
    function deSelectLecturer(){
      delete vm.lecturer;
      vm.lecturerSelect = 0;
    }
    vm.ok = function(){
      if(vm.form.$valid) {
        var data = {
          course: vm.course.id,
          lecturer: vm.lecturer.id,
          allocated_by: vm.user.hod.lecturer.id,
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
