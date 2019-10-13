//控制层
app.controller('contentController' ,function($scope,contentService){

    //定义广告数据结构
    $scope.contentList=[];
    //查询广告分类 根据id
    $scope.findByCategoryId =function (categoryId) {
        contentService.findByCategoryId(categoryId).success(
            function (response) {
                $scope.contentList[categoryId]=response;
            }
        )
    }

    //点击搜索跳转search.html页面
    $scope.search = function () {
        location.href = 'http://localhost:9104/search.html#?keywords='+$scope.keywords
    }

});