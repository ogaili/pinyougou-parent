//购物车控制层
app.controller('cartController',function($scope,cartService){
	//查询购物车列表
	$scope.findCartList=function(){
		cartService.findCartList().success(
			function(response){
				$scope.cartList=response;
				$scope.totalValue= cartService.sum($scope.cartList);
			}
		);
	}
	
	//数量加减
	$scope.addGoodsToCartList=function(itemId,num){
		cartService.addGoodsToCartList(itemId,num).success(
			function(response){
				if(response.success){//如果成功
					$scope.findCartList();//刷新列表
				}else{
					alert(response.message);
				}				
			}		
		);		
	}


	/**
	 * 获取userName
	 */
	$scope.getUserName = function () {
		cartService.getUserName().success(
			function (response) {
				$scope.userName = JSON.parse(response);
			}
		)
	}

    $scope.address = {};
    /**
	 * 页面加载获取收件地址列表
	 */
	$scope.findAddressList = function () {
		cartService.findAddressList().success(
			function (response) {
				$scope.addressList=response;
                for (var i = 0; i <$scope.addressList.length ; i++) {
                    if ($scope.addressList[i].isDefault == '1'){
                        $scope.address = $scope.addressList[i];
                    }
                }
			}
		)
	}

    /**
     * 点击选择地址
     */
    $scope.selectAddress = function (address) {
        $scope.address = address;
    }

    /**
     * 点击地址显示选中效果
     */
    $scope.isSelectedAddress = function (address) {
        if ($scope.address == address) {
            return true
        }else{
            return  false
        }
    }

    /**
     * 支付方式
     */
    $scope.order={paymentType:'1'}; //默认微信支付

    //选择支付方式
    $scope.selectPayType=function(type){
        $scope.order.paymentType= type;
    }

    /**
     * 提交订单
     */
    $scope.addOrder = function () {
        $scope.order.payment = $scope.totalValue.totalMoney
        $scope.order.receiverAreaName = $scope.address.address
        $scope.order.receiverMobile = $scope.address.mobile
        $scope.order.receiver = $scope.address.contact
        $scope.order.receiver = $scope.address.contact
        $scope.order.sourceType = '2'

        cartService.addOrder($scope.order).success(
            function (response) {
                if (response.success){
                    if($scope.order.paymentType=='1'){//如果是微信支付，跳转到支付页面
                        location.href="pay.html";
                    }else{//如果货到付款，跳转到提示页面
                        location.href="paysuccess.html";
                    }
                } else {
                    alert(response.message)
                }
            }
        )
    }

});