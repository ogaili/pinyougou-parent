app.controller('searchController',function ($scope, searchService) {


    //定义查询对象结构
    $scope.searchMap = {'keywords':'','category':''};

    $scope.search =function (searchMap) {
        searchService.search(searchMap).success(
            function (response) {
                $scope.resultMap = response;
            }
        )
    }
});