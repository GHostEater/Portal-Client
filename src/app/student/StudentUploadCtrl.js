/* eslint-disable angular/controller-name */
angular.module('b')
  .controller('StudentUploadCtrl', function (Student,toastr,SystemLog,$filter) {
    var vm = this;
    vm.uploadStudents = uploadStudents;
    function uploadStudents() {
      var students = [];
      for(var i=0; i<vm.students.data.length-1; i++){
        var data = {
          username: $filter('matricNo')(vm.students.data[i][0]),
          last_name: vm.students.data[i][1],
          first_name: vm.students.data[i][2]+' '+vm.students.data[i][3],
          date_birth: vm.students.data[i][4],
          email: vm.students.data[i][5],
          parent_email: vm.students.data[i][6],
          sex: vm.students.data[i][7],
          major: vm.students.data[i][8],
          level: vm.students.data[i][9],
          mode_of_entry: vm.students.data[i][10]
        };
        students.push(data);
      }
      vm.uploaded = students.length;
      Student.upload(students).$promise
        .then(function(data){
          vm.processed = data.processed;
          SystemLog.add("Uploaded Students");
          toastr.success("Students Uploaded");
        });
    }
  });
