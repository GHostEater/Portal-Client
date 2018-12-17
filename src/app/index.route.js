angular.module('b').config(routerConfig);

function routerConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login',{url:'/login/',templateUrl:'app/login/login.html'})
    .state('home',{url:'/home/',templateUrl:'app/home/home.html'})

    .state('pass_reset',{url:'/facil/privi/:rand/pass-reset/:id/:rand2/',templateUrl:'app/login/pass_reset.html'})

    .state('studentUpload',{url:'/student-upload/',templateUrl:'app/student/studentUpload.html'})
    .state('courseToMajor',{url:'/course-to-major/',templateUrl:'app/courseToMajor/courseToMajor.html'})
    .state('log',{url:'/system/logs/',templateUrl:'app/systemLog/logs.html'})
    .state('adminCourseReview',{url:'/admin/course-lecturer-evaluations/:course/:lecturer/:session/',templateUrl:'app/courseReview/adminCourseReview.html'})
    .state('adminCourseReviewDept',{url:'/admin/course-lecturer-evaluations/department',templateUrl:'app/courseReview/adminCourseReviewDept.html'})
    .state('result_release_status',{url:'/admin/result-release-status/',templateUrl:'app/admin/result_release_status.html'})
    .state('semester',{url:'/admin/semester/',templateUrl:'app/admin/semester.html'})
    .state('session',{url:'/admin/session/',templateUrl:'app/admin/session.html'})
    .state('id_card',{url:'/admin/id-card/',templateUrl:'app/admin/id_card.html'})

    .state('paymentToMajor',{url:'/payment-to-major/',templateUrl:'app/paymentToMajor/paymentToMajor.html'})

    .state('hostel',{url:'/hostel/',templateUrl:'app/studentAffairs/hostel.html'})
    .state('room',{url:'/room/',templateUrl:'app/studentAffairs/room.html'})
    .state('roomAllocation',{url:'/room-allocation/',templateUrl:'app/studentAffairs/roomAllocation.html'})

    .state('editRequest',{url:'/admin/result-edit-requests/',templateUrl:'app/academicAffairs/resultEditRequest.html'})
    .state('editLog',{url:'/admin/result-edit-logs/',templateUrl:'app/academicAffairs/resultEditLog.html'})
    .state('uploadLog',{url:'/admin/result-upload-logs/',templateUrl:'app/academicAffairs/resultUploadLog.html'})
    .state('lateRegRequest',{url:'/admin/late-reg-requests/',templateUrl:'app/academicAffairs/lateRegRequest.html'})
    .state('extra_unit_request',{url:'/admin/extra-unit-requests/',templateUrl:'app/academicAffairs/extra_unit_request.html'})
    .state('intra_transfer_request',{url:'/admin/intra-transfer-requests/',templateUrl:'app/academicAffairs/intra_transfer_request.html'})

    .state('studentList',{url:'/student-list/',templateUrl:'app/levelAdviser/studentList.html'})
    .state('studentTranscript',{url:'/lecturer/student-transcript/:userId/',templateUrl:'app/levelAdviser/transcript.html'})

    .state('results',{url:'/results/',templateUrl:'app/result/results.html'})
    .state('overviewSheet',{url:'/lecturer/overview-sheet/',templateUrl:'app/examOfficer/overviewSheet.html'})
    .state('broadSheet',{url:'/lecturer/broad-sheet/',templateUrl:'app/examOfficer/broadSheet.html'})
    .state('resultSheet',{url:'/lecturer/result-sheet/',templateUrl:'app/examOfficer/resultSheet.html'})
    .state('resComp',{url:'/lecturer/result-computation/',templateUrl:'app/examOfficer/resultComputation.html'})
    .state('studentResultView',{url:'/lecturer/student-result-view/:userId/',templateUrl:'app/examOfficer/studentResultView.html'})
    .state('gradList',{url:'/lecturer/graduating-list/',templateUrl:'app/examOfficer/graduatingList.html'})

    .state('courseAllocation',{url:'/course-allocation/',templateUrl:'app/courseAllocation/courseAllocation.html'})
    .state('lecturerCourses',{url:'/my-courses/',templateUrl:'app/lecturer/lecturerCourses.html'})
    .state('courseDetail',{url:'/my-courses/course-detail/:id/',templateUrl:'app/lecturer/courseDetails.html'})

    .state('reg_info',{url:'/',templateUrl:'app/courseReg/reg_info.html'})
    .state('reg_info_fresh',{url:'/registration-information/fresh-students/',templateUrl:'app/courseReg/reg_info_fresh.html'})
    .state('reg_info_returning',{url:'/registration-information/returning-students/',templateUrl:'app/courseReg/reg_info_returning.html'})
    .state('courseReg',{url:'/student/course-registration/',templateUrl:'app/courseReg/courseReg.html'})
    .state('courseSlip',{url:'/student/course-slip/',templateUrl:'app/courseReg/courseSlip.html'})
    .state('adminCourseSlip',{url:'/admin/course-slip/:userId/',templateUrl:'app/courseReg/adminCourseSlip.html'})

    .state('acceptance',{url:'/student/acceptance-form/',templateUrl:'app/student/acceptance_form.html'})

    .state('intra_transfer',{url:'/student/intra-university-transfer/',templateUrl:'app/student/intra_transfer.html'})

    .state('grad_status',{url:'/student/graduation-status/',templateUrl:'app/student/grad_status.html'})

    .state('studentResult',{url:'/student/result/',templateUrl:'app/student/result.html'})
    .state('courseReview',{url:'/student/course-lecturer-evaluations/',templateUrl:'app/courseReview/courseReview.html'})
    .state('student_setup',{url:'/student/personal-setup/:id',templateUrl:'app/student/student_edit.html'})
    .state('student_edit',{url:'/student-edit/:id',templateUrl:'app/student/student_edit.html'})
    .state('student_view',{url:'/student-view/:id',templateUrl:'app/student/student_view.html'})
    .state('admin_student_list',{url:'/admin/student-list/',templateUrl:'app/student/admin_student_list.html'})

    .state('level_advisers',{url:'/hod/level-advisers/',templateUrl:'app/hod/level_adviser.html'})
    .state('exam_officer',{url:'/hod/exam-officer/',templateUrl:'app/hod/exam_officer.html'})

    .state('student_payment',{url:'/student/payment/',templateUrl:'app/payment/student_payment.html'})
    .state('student_pay',{url:'/student/payment/pay/:payment/:amount/:level',templateUrl:'app/payment/student_pay.html'})
    .state('payment_reference',{url:'/student/payment/reference-slip/:id/',templateUrl:'app/payment/payment_reference.html'})
    .state('payment_receipt',{url:'/student/payment/receipt/:id/',templateUrl:'app/payment/receipt.html'})
    .state('payment_validation',{url:'/student/payment/validation/',templateUrl:'app/payment/payment_validation.html'})
    .state('payment_history',{url:'/student/payment/history/',templateUrl:'app/payment/payment_history.html'})
    .state('payment_info',{url:'/student/payment/information/',templateUrl:'app/payment/payment_info.html'})
    .state('tuition_fee_clearance',{url:'/student/payment/tuition-fee-clearance/',templateUrl:'app/student/tuition_fee_clearance.html'})

    .state('xpress_payment',{url:'/admin/payXpress-payments',templateUrl:'app/payment/admin_xpress_payment.html'})
    .state('payment_reports',{url:'/admin/payment-reports',templateUrl:'app/payment/admin_payment_reports.html'})
    .state('payment_reports_admission',{url:'/admin/admission-payment-reports',templateUrl:'app/payment/admin_payment_reports_admission.html'})
    .state('admin_student_payment',{url:'/admin/student/payment/:user/',templateUrl:'app/payment/admin_student_payment.html'})

  ;

  $urlRouterProvider.otherwise('/');
}
