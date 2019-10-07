 //控制层 
app.controller('goodsController' ,function($scope,$controller,$location   ,goodsService,uploadService,
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
	var id = $location.search()['id'];
	$scope.findOne=function(){
		if (id == null){
			return;
		}
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;
				//查询出来后 给富文本赋值
				editor.html($scope.entity.goodsDesc.introduction);
				//给图片字符转转换成json对象
				$scope.entity.goodsDesc.itemImages = JSON.parse($scope.entity.goodsDesc.itemImages);
				//扩展属性转换成json对象
				$scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.entity.goodsDesc.customAttributeItems);
				//规格转换成json对象
				$scope.entity.goodsDesc.specificationItems = JSON.parse($scope.entity.goodsDesc.specificationItems);
				//sku转换json对象
				for (var i = 0;i< $scope.entity.items.length;i++){
					$scope.entity.items[i].spec = JSON.parse($scope.entity.items[i].spec)
				}
			}
		);				
	};

	//回显复选框勾选
	$scope.checkAttributeValue = function(text,option){
		var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems,'attributeName',text);
		if (object == null) {
			return false;
		}else {
			if (object.attributeValue.indexOf(option)>=0){
				return true;
			} else {
				return false;
			}
		}
	};
	
	//保存
	$scope.save=function(){
		$scope.entity.goodsDesc.introduction = editor.html();

		var object = null;
		if ($scope.entity.goods.id != null) {
			object = goodsService.update($scope.entity)
		}else{
			object = goodsService.add($scope.entity)
		}
		object.success(
			function(response){
				if(response.success){
					alert("保存成功");
					location.href = 'goods.html'
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

	//提交审核
	$scope.updateAuditStatus=function(status){
		//获取选中的复选框
		goodsService.updateAuditStatus( $scope.selectIds,status).success(
			function(response){
				if(response.success){
					alert(response.message);
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}else {
					alert(response.message);
					$scope.selectIds=[];
				}
			}
		);
	};

	//商品上下架
	$scope.updateIsMarketable=function(id,status){
		//获取选中的复选框
		goodsService.updateIsMarketable(id,status).success(
			function(response){
				if(response.success){
					alert(response.message);
					$scope.reloadList();//刷新列表
				}else {
					alert(response.message);
				}
			}
		);
	};


	$scope.searchEntity={};//定义搜索对象 

	$scope.statusList = ['未申请','已申请','通过审核','审核未通过','关闭'];

	$scope.ItemCatList=[];
	//查询所有分类
	$scope.findAllItemCatList = function(){
		itemCatService.findAll().success(
			function (response) {
				for (var i = 0;i<response.length;i++){
					$scope.ItemCatList[response[i].id] = response[i].name;
				}
			}
		)
	};


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

	$scope.entity={goods:{},goodsDesc:{itemImages:[]},items:[]};//定义页面实体结构
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

	$scope.$watch('entity.goods.category1Id',function (newValue,oldValue) {
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

	$scope.$watch("entity.goods.category2Id",function (newValue,oldValue) {
		if (newValue!=null) {
			$scope.entity.goods.typeTemplateId = null;
			itemCatService.findByParentId(newValue).success(
				function (response) {
					$scope.itemCat3List = response;
				}
			)
		}
	})

	$scope.$watch("entity.goods.category3Id",function (newValue,oldValue) {
		if (newValue!=null) {
			itemCatService.findOne(newValue).success(
				function (response) {
					$scope.entity.goods.typeTemplateId = response.typeId;
				}
			)
		}
	})

	$scope.specList = [];
	$scope.$watch("entity.goods.typeTemplateId",function (newValue,oldValue) {
		if (newValue!=null) {
			typeTemplateService.findOne(newValue).success(
				function (response) {
					$scope.brandList =JSON.parse(response.brandIds);
					if (id==null) {
						$scope.entity.goodsDesc.customAttributeItems = JSON.parse(response.customAttributeItems)
					}
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
