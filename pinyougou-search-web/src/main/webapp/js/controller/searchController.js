app.controller('searchController',function ($scope,$location, searchService) {


    //定义查询对象结构
    $scope.searchMap = {'keywords':'','category':'','brand':'' ,'price':'' ,'spec':{} , 'sort':'' , 'field':''};

    $scope.resultMap = {'brandList':[]}

    $scope.search =function (searchMap) {
        searchService.search(searchMap).success(
            function (response) {
                $scope.resultMap = response;
            }
        )
    };

    $scope.firstSearch = function(){
        $scope.initSearchMap();
        $scope.search($scope.searchMap)
    };

    //点击增加查询条件
    $scope.addSearchItem=function (key, value) {
        if ('category' == key || 'brand' == key || 'price' == key) {
            $scope.searchMap[key] = value;
        }else {
            $scope.searchMap.spec[key] = value;
        }

        $scope.search($scope.searchMap)
    };

    //点击删除查询条件
    $scope.deleteSearchItem=function (key) {
        if ('category' == key || 'brand' == key || 'price' == key) {
            $scope.searchMap[key] = '';
        }else {
            delete $scope.searchMap.spec[key]
        }

        $scope.search($scope.searchMap)
    };

    //添加排序
    $scope.searchSort = function (sort, field) {
        $scope.searchMap.sort = sort;
        $scope.searchMap.field = field;

        $scope.search($scope.searchMap)
    };

    //隐藏品牌列表
    $scope.keywordsIsBrand = function(){
      for (var i = 0;i<$scope.resultMap.brandList.length;i++){
          if ($scope.searchMap.keywords.indexOf($scope.resultMap.brandList[i].text) >= 0) {
              return true;
          }
      }
      return false;
    };

    //主页跳转
    $scope.loadKeywords = function(){
        $scope.searchMap.keywords =  $location.search()['keywords'];
        $scope.search($scope.searchMap)
    }

    //点击增加查询条件 商品分类，删除其他条件
    $scope.initSearchMap=function () {
        $scope.searchMap.category = "";

        $scope.searchMap.brand = '';

        $scope.searchMap.spec = {};

        $scope.searchMap.price = '';

        $scope.searchMap.sort = '';

        $scope.searchMap.field = '';

    };

});