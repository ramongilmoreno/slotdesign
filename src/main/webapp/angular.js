var slotdesignApplication = angular.module('slotdesignApplication', []);

slotdesignApplication.controller('slotdesignController',
    function ($scope) {
        $scope.slotdesign = slotdesign;
        setInterval(function() {
        if (rawEdit($('#inputField').val())) {
            $scope.$apply();
        }
    }, 200);
});
