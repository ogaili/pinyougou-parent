app.controller('searchController',function ($scope, searchService) {


    //定义查询对象结构
    $scope.searchMap = {'keywords':'','category':'','brand':'','spec':{}};

    $scope.search =function (searchMap) {
        searchService.search(searchMap).success(
            function (response) {
                $scope.resultMap = response;
            }
        )
    }

    //点击增加查询条件
    $scope.addSearchItem=function (key, value) {
        if ('category' == key || 'brand' == key) {
            $scope.searchMap[key] = value;
        }else {
            $scope.searchMap.spec[key] = value;
        }

        $scope.search($scope.searchMap)
    }
    //点击删除查询条件
    $scope.deleteSearchItem=function (key) {
        if ('category' == key || 'brand' == key) {
            $scope.searchMap[key] = '';
        }else {
            delete $scope.searchMap.spec[key]
        }

        $scope.search($scope.searchMap)
    }

    //点击增加查询条件 商品分类，删除其他条件
    $scope.addSearchCategory=function (value) {
        $scope.searchMap.category = value;

        $scope.searchMap.brand = '';

        $scope.searchMap.spec = {};
        $scope.search($scope.searchMap)
    }
});