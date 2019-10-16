app.controller('searchController',function ($scope,$location, searchService) {

    $scope.resultMap = {};
    //定义查询对象结构
    $scope.searchMap = {'keywords':'','category':'','brand':'' ,'price':'' ,'spec':{} , 'sort':'' , 'field':'' ,'pageNo':1 ,'pageSize':40};

    $scope.search =function (searchMap) {
        searchService.search(searchMap).success(
            function (response) {
                $scope.resultMap = response;
                $scope.buildPage()
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
        // alert(JSON.stringify($scope.resultMap.brandList))
      for (var i = 0;i<$scope.resultMap.brandList.length;i++){
          if ($scope.searchMap.keywords.indexOf($scope.resultMap.brandList[i].text) >= 0) {
              return true;
          }
      }
      return false;
    };

    //构建分页栏
    $scope.buildPage = function(){
        var pageNo =  $scope.searchMap.pageNo; //当前页
        var totalPages =  $scope.resultMap.totalPages; //总页数
        var page;
        $scope.pageLabel=[]; //分页栏
        $scope.firstDot=true;//前面有点
        $scope.lastDot=true;//后边有点


        if (totalPages <= 5){
            for (var i = 1;i<=totalPages;i++){
                $scope.pageLabel.push(i)
            }
            $scope.firstDot=false;//前面有点
            $scope.lastDot=false;//后边有点
            return;
        }

        //如果当前页小于等于3 显示 5个页码
        if (pageNo <= 3){
            page  = 1;
            $scope.firstDot=false;
        }else  if (pageNo >= totalPages-2){
            //如果当前页 >= 总页数-2 页码等于总页数-4
            page = totalPages -4;
            $scope.lastDot=false;
        }else {
            // 其他情况
            page = pageNo -2
        }

        for (var i = page ; i<=page+4;i++){
            $scope.pageLabel.push(i)
        }
    };

    //分页查询
    $scope.pageSearch = function(page){

        if (page <= 1 ){
            page = 1;
        }
        if (page >= $scope.resultMap.totalPages) {
            page = $scope.resultMap.totalPages
        }
        $scope.searchMap.pageNo = parseInt(page)
        $scope.search($scope.searchMap);
    }



    //主页跳转
    $scope.loadKeywords = function(){
        $scope.searchMap.keywords =  $location.search()['keywords'];
        $scope.search($scope.searchMap)
    };

    //点击增加查询条件 商品分类，删除其他条件
    $scope.initSearchMap=function () {
        $scope.searchMap.category = "";

        $scope.searchMap.brand = '';

        $scope.searchMap.spec = {};

        $scope.searchMap.price = '';

        $scope.searchMap.sort = '';

        $scope.searchMap.field = '';

        $scope.searchMap.pageNo = 1;
    };



    //测试方法
    $scope.sendSkuId  =function (goodsId,skuId) {
        window.open('http://localhost:9105/'+goodsId+'.html#?skuId='+skuId);
    }
});
