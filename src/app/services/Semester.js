angular.module('b')
    .factory('Semester', function ($resource,Host) {
        return $resource(Host.host+'/semester/:id/',{id:'@id'},{
            get:{
                method: 'get',
                url: Host.host+'/semester/1/'
            },
            changeSemester:{
                method: 'put'
            }
            });
    });
