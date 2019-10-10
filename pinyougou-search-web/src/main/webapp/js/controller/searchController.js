app.controller('searchController',function ($scope, searchService) {

    $scope.search =function (searchMap) {
        searchService.search(searchMap).success(
            function (response) {
                $scope.resultMap = response;
            }
        )
    }
});