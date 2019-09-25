app.controller("brandController",function ($scope,brandService,$controller) {//定义控制器

    $controller("baseController",{$scope:$scope})

    $scope.findAll = function(){//查询所有不分页
        brandService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        )
    }


    $scope.search = function(pageNum,pageSize){
        //发送ajax 传递分页参数
        brandService.search($scope.searchEntity,pageNum,pageSize).success(
            //返回值json数据
            function (response) {
                $scope.list = response.rows;//把分页结果放入变量展示
                $scope.paginationConf.totalItems = response.total;//将总条数赋值给分页插件
            }
        )
    }

    //修改之前的回显方法
    $scope.findOne = function(id){
        brandService.findOne(id).success(
            function (response) {
                $scope.entity = response
            }
        )
    }

    //保存方法，判断有id就调用后台修改方法，没有id就调用保存方法
    $scope.save = function () {
        var object = null;
        if ($scope.entity.id != null) {
            object = brandService.update($scope.entity)
        }else{
            object = brandService.add($scope.entity)
        }
        object.success(
            function (response) {
                if (response.result){
                    $scope.reloadList();
                } else {
                    alert(response.msg);
                }
            }
        )
    }

    //点击删除调用的删除方法
    $scope.delete = function () {
        brandService.delete($scope.selectIds).success(
            function () {
                $scope.reloadList();
            }
        )
    }
})