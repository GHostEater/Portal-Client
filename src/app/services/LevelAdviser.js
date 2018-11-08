angular.module('b')
  .factory('LevelAdviser',function ($resource,Host) {
    return $resource(Host.host+'/level-adviser/:lecturer/',{lecturer:'@lecturer'},{
      patch:{
        method: 'patch',
        url: Host.host+'/level-adviser/update/:lecturer/'
      },
      save:{
        method: 'post',
        url: Host.host+'/level-adviser/new/'
      }
    });
  });
