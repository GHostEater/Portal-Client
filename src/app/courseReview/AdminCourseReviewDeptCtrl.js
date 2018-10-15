/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 07-Jun-18.
 */
angular.module('b')
  .controller('AdminCourseReviewDeptCtrl',function (College,Dept,Course,Session,Excel,CourseReview,SystemLog,$timeout,Access,Lecturer,Semester) {
    Access.admin();
    var vm = this;
    vm.colleges = College.query();
    vm.depts = Dept.query();
    vm.courses = Course.query();
    vm.session = Session.getCurrent();
    vm.sessions = Session.query();
    vm.semester = Semester.get();
    vm.lecturers = Lecturer.query();
    vm.getReviews = getReviews;
    vm.exportToExcel = exportToExcel;

    function getReviews() {
      CourseReview.dept({session:vm.session.id,semester:vm.semester.semester,dept:vm.dept.id}).$promise
        .then(function (data) {
          vm.reviews = data;
        });
    }
    function exportToExcel(tableId){
      vm.exportHref=Excel.tableToExcel(tableId,'Course Review Department');
      $timeout(function(){location.href=vm.exportHref;},100);
      SystemLog.add("Exported Course Review Department Table to Excel");
    }
  });
