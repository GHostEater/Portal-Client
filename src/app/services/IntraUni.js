angular.module("b")
  .factory("IntraUni", function ($resource,Host) {
    return $resource(Host.host+"/intra-uni/:id/",{id:'@id'},{
      patch:{
        method: 'patch'
      },
      save:{
        method: 'post',
        url: Host.host+"/intra-uni/new/"
      }
    });
  });
