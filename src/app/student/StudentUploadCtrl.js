/* eslint-disable angular/controller-name */
angular.module('b')
  .controller('StudentUploadCtrl', function (Student,toastr,SystemLog,$filter) {
    var vm = this;
    vm.uploadStudents = uploadStudents;
    function uploadStudents() {
      for(var i=0; i<vm.students.data.length-1; i++){
        var data = {
          username: $filter('matricNo')(vm.students.data[i][0]),
          last_name: vm.students.data[i][1],
          first_name: vm.students.data[i][2]+' '+vm.students.data[i][3],
          date_birth: vm.students.data[i][4],
          email: vm.students.data[i][5],
          sex: vm.students.data[i][6],
          major: vm.students.data[i][7],
          level: vm.students.data[i][8],
          mode_of_entry: vm.students.data[i][9]
        };
        Student.upload(data)
          .$promise.then(function(){
          SystemLog.add("Uploaded Student");
          toastr.success("Student Uploaded");
        });
      }
    }
  });
