//商品详细页（控制层）
app.controller('itemController',function($scope,$location){
	//数量操作
	$scope.addNum=function(x){
		$scope.num=$scope.num+x;
		if($scope.num<1){
			$scope.num=1;
		}
	}


	$scope.specificationItems={};//记录用户选择的规格
	//用户选择规格
	$scope.selectSpecification=function(name,value){	
		$scope.specificationItems[name]=value;
		searchSku();
	}	
	//判断某规格选项是否被用户选中
	$scope.isSelected=function(name,value){
		if($scope.specificationItems[name]==value){
			return true;
		}else{
			return false;
		}		
	}	
	
	
	$scope.sku = {};//当前选中的sku
	
	//选择sku方法
	$scope.loadSku = function(){
		//点击页面根据穿的的skuId选择
		$scope.skuId =  $location.search()['skuId'];

		//遍历页面的spec列表 对比传递过来的skuId
		for(var i = 0;i<skuList.length;i++){
			if (skuList[i].id == $scope.skuId) {
				$scope.sku = skuList[i]
				$scope.specificationItems= JSON.parse(JSON.stringify($scope.sku.spec))
			}
		}

		/*//默认读取第一个
		$scope.sku = skuList[0];
		$scope.specificationItems= JSON.parse(JSON.stringify($scope.sku.spec))*/
	}
	
	equalsObject = function(map1,map2){
		for(var k in map1){
			if(map1[k] != map2[k]){
				return false;
			}
		}
		
		for(var k in map2){
			if(map2[k] != map1[k]){
				return false;
			}
		}
		return true;
	}
	
	
	searchSku = function(){
		
		for(var i = 0 ;i<skuList.length;i++){
			if(equalsObject($scope.specificationItems,skuList[i].spec)){
				$scope.sku = skuList[i];
				return;
			}
		}
		$scope.sku.title ='暂时无货'
		$scope.sku.price ='--- ---'
	}
	
		//添加商品到购物车
	$scope.addToCart=function(){
		alert('skuid:'+$scope.sku.id);				
	}


	
});