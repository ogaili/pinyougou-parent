app.controller("baseController",function ($scope) {

    $scope.paginationConf = {//前端分页插件
        currentPage: 1,//当前页
        totalItems: 10,//总页数
        itemsPerPage: 10,//每页显示条数
        perPageOptions: [5, 10, 20],//选择每页显示条数
        onChange: function () {
            $scope.reloadList();//重新加载
        }
    };

    //要定义为空json对象不然后端报接受参数异常 400
    $scope.searchEntity = {};
    $scope.reloadList = function () {
        $scope.search($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage)
    }

//定义删除复选框id数组
//定义数组写法
    $scope.selectIds = [];
    $scope.updateSelectIds = function ($event, id) {
        if ($event.target.checked) {
            //如果勾选 添加数组中
            $scope.selectIds.push(id);
        } else {
            //如果取消勾选 则从数组中删除
            var idx = $scope.selectIds.indexOf(id);
            $scope.selectIds.splice(idx, 1);
        }
    }

    //字符串转json格式
    $scope.jsonToString = function (jsonString) {
        var  value = "";
        var json	= JSON.parse(jsonString);
        for (var i = 0;i<json.length;i++){
            if (i>0){
                value += "，"
            }
            value += json[i].text
        }
        return value;
    }

})