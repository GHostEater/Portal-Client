angular.module('b').config(routerConfig);

function routerConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login',{url:'/',templateUrl:'app/login/login.html'})
    .state('home',{url:'/home/',templateUrl:'app/home/home.html'})

    .state('studentUpload',{url:'/student-upload/',templateUrl:'app/student/studentUpload.html'})
    .state('courseToMajor',{url:'/course-to-major/',templateUrl:'app/courseToMajor/courseToMajor.html'})
    .state('log',{url:'/system/logs/',templateUrl:'app/systemLog/logs.html'})
    .state('adminCourseReview',{url:'/admin/course-lecturer-evaluations/',templateUrl:'app/courseReview/adminCourseReview.html'})

    .state('paymentToMajor',{url:'/payment-to-major/',templateUrl:'app/paymentToMajor/paymentToMajor.html'})

    .state('hostel',{url:'/hostel/',templateUrl:'app/studentAffairs/hostel.html'})
    .state('room',{url:'/room/',templateUrl:'app/studentAffairs/room.html'})
    .state('roomAllocation',{url:'/room-allocation/',templateUrl:'app/studentAffairs/roomAllocation.html'})

    .state('adminCourseAllocation',{url:'/admin/course-allocation/',templateUrl:'app/academicAffairs/adminCourseAllocation.html'})
    .state('adminOverviewSheet',{url:'/admin/overview-sheet/',templateUrl:'app/academicAffairs/adminOverviewSheet.html'})
    .state('adminBroadSheet',{url:'/admin/broad-sheet/',templateUrl:'app/academicAffairs/adminBroadSheet.html'})
    .state('editRequest',{url:'/admin/result-edit-requests/',templateUrl:'app/academicAffairs/resultEditRequest.html'})
    .state('editLog',{url:'/admin/result-edit-logs/',templateUrl:'app/academicAffairs/resultEditLog.html'})
    .state('lateRegRequest',{url:'/admin/late-reg-requests/',templateUrl:'app/academicAffairs/lateRegRequest.html'})

    .state('studentList',{url:'/student-list/',templateUrl:'app/levelAdviser/studentList.html'})
    .state('lvlCourseSlip',{url:'/lecturer/student/course-slip/:userId/',templateUrl:'app/levelAdviser/lvlCourseSlip.html'})
    .state('studentTranscript',{url:'/lecturer/student-transcript/:userId/',templateUrl:'app/levelAdviser/transcript.html'})

    .state('overviewSheet',{url:'/lecturer/overview-sheet/',templateUrl:'app/examOfficer/overviewSheet.html'})
    .state('broadSheet',{url:'/lecturer/broad-sheet/',templateUrl:'app/examOfficer/broadSheet.html'})
    .state('resComp',{url:'/lecturer/result-computation/',templateUrl:'app/examOfficer/resultComputation.html'})
    .state('studentResultView',{url:'/lecturer/student-result-view/:userId/',templateUrl:'app/examOfficer/studentResultView.html'})
    .state('gradList',{url:'/lecturer/graduating-list/',templateUrl:'app/examOfficer/graduatingList.html'})

    .state('courseAllocation',{url:'/course-allocation/',templateUrl:'app/courseAllocation/courseAllocation.html'})
    .state('lecturerCourses',{url:'/my-courses/',templateUrl:'app/lecturer/lecturerCourses.html'})
    .state('courseDetail',{url:'/my-courses/course-detail/:id/',templateUrl:'app/lecturer/courseDetails.html'})

    .state('courseReg',{url:'/student/course-registration/',templateUrl:'app/courseReg/courseReg.html'})
    .state('courseSlip',{url:'/student/course-slip/',templateUrl:'app/courseReg/courseSlip.html'})
    .state('studentResult',{url:'/student/result/',templateUrl:'app/student/result.html'})
    .state('courseReview',{url:'/student/course-lecturer-evaluations/',templateUrl:'app/courseReview/courseReview.html'})
    .state('student_edit',{url:'/student-edit/:id',templateUrl:'app/student/student_edit.html'})
    .state('student_view',{url:'/student-view/:id',templateUrl:'app/student/student_view.html'})
    .state('admin_student_list',{url:'/admin/student-list/',templateUrl:'app/student/admin_student_list.html'})

    .state('level_advisers',{url:'/hod/level-advisers/',templateUrl:'app/hod/level_adviser.html'})
    .state('exam_officer',{url:'/hod/exam-officer/',templateUrl:'app/hod/exam_officer.html'})
  ;

  $urlRouterProvider.otherwise('/');
}
