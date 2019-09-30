 //控制层 
app.controller('goodsController' ,function($scope,$controller   ,goodsService,uploadService,
										   itemCatService,typeTemplateService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}
	
	//保存
	$scope.add=function(){
		$scope.entity.goodsDesc.introduction = editor.html();
		goodsService.add( $scope.entity ).success(
			function(response){
				if(response.success){
					alert("添加成功");
					$scope.entity={};
					location.reload()
					editor.html("");
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}

	/**
	 * 上传图片
	 */
	$scope.uploadFile=function(){
		uploadService.uploadFile().success(function(response) {
			if(response.success){//如果上传成功，取出url
				$scope.image_entity.url=response.message;//设置文件地址
			}else{
				alert(response.message);
			}
		}).error(function() {
			alert("上传发生错误");
		});
	};

	$scope.entity={goods:{},goodsDesc:{itemImages:[]}};//定义页面实体结构
	//添加图片列表
	$scope.add_image_entity=function(){
		$scope.entity.goodsDesc.itemImages.push($scope.image_entity);
	}

	//移除图片
	$scope.remove_image_entity=function(index){
		$scope.entity.goodsDesc.itemImages.splice(index,1);
	}

	$scope.selectItemCat1List = function () {
		itemCatService.findByParentId(0).success(
			function (response) {
				$scope.itemCat1List = response;
			}
		)
	}

	$scope.$watch("entity.goods.cateGory1Id",function (newValue,oldValue) {
		if (newValue!=null) {
			$scope.itemCat3List = null;
			$scope.entity.goods.typeTemplateId = null;
			itemCatService.findByParentId(newValue).success(
				function (response) {
					$scope.itemCat2List = response;
				}
			)
		}
	})

	$scope.$watch("entity.goods.cateGory2Id",function (newValue,oldValue) {
		if (newValue!=null) {
			$scope.entity.goods.typeTemplateId = null;
			itemCatService.findByParentId(newValue).success(
				function (response) {
					$scope.itemCat3List = response;
				}
			)
		}
	})

	$scope.$watch("entity.goods.cateGory3Id",function (newValue,oldValue) {
		if (newValue!=null) {
			itemCatService.findOne(newValue).success(
				function (response) {
					$scope.entity.goods.typeTemplateId = response.typeId;
				}
			)
		}
	})


	$scope.$watch("entity.goods.typeTemplateId",function (newValue,oldValue) {
		if (newValue!=null) {

			typeTemplateService.findOne(newValue).success(
				function (response) {

					$scope.brandList =JSON.parse(response.brandIds);
					$scope.entity.goodsDesc.customAttributeItems = JSON.parse(response.customAttributeItems)
				}
			)
			typeTemplateService.findSpecList(newValue).success(
				function (response) {
					$scope.specList = response;
				}
			)
		}
	})

	//记录规格勾选数组
	$scope.entity.goodsDesc.specificationItems = []

	$scope.createSpecificationItems = function ($event,text,optionName) {

		var list = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems,'attributeName', text);

		if (list != null) {
			//表示不是第一次点击还有其他值
			if ($event.target.checked) {
				list.attributeValue.push(optionName)
			}else {
				//取消勾选
				list.attributeValue.splice(list.attributeValue.indexOf(optionName),1)

				if (list.attributeValue.length == 0){
					//如果全部取消了 就吧specificationItems中的这一整条记录移除
					$scope.entity.goodsDesc.specificationItems.splice($scope.entity.goodsDesc.specificationItems.indexOf(list),1)
				}
			}
		}else {
			//第一次点击 没有其他值
			if ($event.target.checked) {
					$scope.entity.goodsDesc.specificationItems.push({attributeName:text,attributeValue:[optionName]})
			}
		}

	}
 //查询specificationItems集合中有没有text
	$scope.searchObjectByKey = function (list,key,text) {
		for (var i = 0;i<list.length;i++){
			if (list[i][key]==text) {
				return list[i];
			}
		}
		return null;
	}


	//增加sku 商品列表
	$scope.createItems = function () {
		//初始化sku 商品列表
		$scope.entity.items=[ {spec:{} ,price:0,num:99999,status:'0',isDefault:'0' } ];
		//根据这个集合来创建 sku 商品
		 var Items = $scope.entity.goodsDesc.specificationItems;

		for(var i = 0;i<Items.length;i++){
			$scope.entity.items = $scope.addColumn($scope.entity.items,Items[i].attributeName,Items[i].attributeValue)
		}
	}


	$scope.addColumn = function (list,attributeName,attributeValue) {
		var newList=[] ;
		for(var i = 0; i<list.length; i++){

			for (var j = 0;j<attributeValue.length;j++){
				var oldRow = list[i];

				var newRow = JSON.parse(JSON.stringify(oldRow));

				newRow.spec[attributeName] = attributeValue[j];

				newList.push(newRow)
			}
		}
		return newList;
	}


	//清空数组
	$scope.cleanList = function () {
		$scope.entity.goodsDesc.specificationItems = [];
		$scope.entity.itemList=[ {spec:{} ,price:0,num:99999,status:'0',isDefault:'0' } ]
	}

});	
