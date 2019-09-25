app.service("brandService",function ($http) {
    this.findAll = function () {
        return $http.get("../brand/findAll.do");
    }
    this.search = function (searchEntity,pageNum,pageSize) {
        return $http.post("../brand/findPage.do?pageNum="+pageNum+"&pageSize="+pageSize,searchEntity);
    }
    this.findOne =function (id) {
        return $http.get("../brand/findOne.do?id="+id);
    }
    this.add = function (entity) {
        return $http.post("../brand/save.do",entity)
    }
    this.update = function (entity) {
        return $http.post("../brand/update.do",entity)
    }
    this.delete = function (ids) {
        return $http.get("../brand/delete.do?ids="+ids)
    }

    $scope.selectOptionList = function () {
        return $http.get("../brand/selectOptionList.do")
    }
})