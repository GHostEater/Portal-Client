/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 11-Dec-17.
 */
angular.module('b')
  .controller('AdminCourseReviewCtrl',function (College,Dept,Course,Session,Excel,CourseReview,SystemLog,$timeout,Access) {
    Access.admin();
    var vm = this;
    vm.colleges = College.query();
    vm.depts = Dept.query();
    vm.courses = Course.query();
    vm.session = Session.getCurrent();
    vm.sessions = Session.query();
    vm.getReviews = getReviews;
    vm.exportToExcel = exportToExcel;

    function getReviews() {
      vm.reviews = CourseReview.course({course:vm.course.id,session:vm.session.id});
    }
    function exportToExcel(tableId){
      vm.exportHref=Excel.tableToExcel(tableId,'Course Review');
      $timeout(function(){location.href=vm.exportHref;},100);
      SystemLog.add("Exported Course Review Table to Excel");
    }
  });
