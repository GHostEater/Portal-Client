/**
 * Created by GHostEater on 29-Jul-16.
 */
angular.module("b")
    .directive("loader", function () {
        return function ($scope, element) {
            $scope.$on("loader_show", function () {
                return element.show();
            });
            return $scope.$on("loader_hide", function () {
                return element.hide();
            });
        };
    }
);
