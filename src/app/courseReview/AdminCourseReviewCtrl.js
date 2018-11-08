/* eslint-disable angular/controller-name */
/**
 * Created by GHostEater on 11-Dec-17.
 */
angular.module('b')
  .controller('AdminCourseReviewCtrl',function (College,Dept,Course,Session,Excel,CourseReview,SystemLog,$timeout,Access,Lecturer,$stateParams) {
    Access.admin();
    var vm = this;
    vm.colleges = College.query();
    vm.depts = Dept.query();
    vm.courses = Course.query();
    vm.session = Session.getCurrent();
    vm.sessions = Session.query();
    vm.lecturers = Lecturer.query();
    vm.getReviews = getReviews;
    vm.exportToExcel = exportToExcel;

    if($stateParams.course){
      Course.get({id:$stateParams.course}).$promise
        .then(function (data) {
          vm.course = data;
          Lecturer.get({user:$stateParams.lecturer}).$promise
            .then(function (data) {
              vm.lecturer = data;
              Session.get({id:$stateParams.session}).$promise
                .then(function (data) {
                  vm.session = data;
                  getReviews();
                });
            });
        });
    }

    function getReviews() {
      CourseReview.course({course:vm.course.id,session:vm.session.id,lecturer:vm.lecturer.id}).$promise
        .then(function (data) {
          vm.reviews = data.reviews;
          vm.avg_scores = data.avg_scores;
          vm.total = data.total;
          vm.total_percentage = data.total_percentage;
        });
    }
    function exportToExcel(tableId){
      vm.exportHref=Excel.tableToExcel(tableId,'Course Review');
      $timeout(function(){location.href=vm.exportHref;},100);
      SystemLog.add("Exported Course Review Table to Excel");
    }
  });
