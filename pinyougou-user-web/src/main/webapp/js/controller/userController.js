 //控制层 
app.controller('userController' ,function($scope,$controller   ,userService){	
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		userService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		userService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		userService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	};

	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=userService.update( $scope.entity ); //修改  
		}else{
			serviceObject=userService.add( $scope.entity ,$scope.smsCode );//增加
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					alert(response.message)
		        	// 跳转到首页
					location.href = 'http://www.baidu.com'
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		userService.dele( $scope.selectIds ).success(
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
		userService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}

    $scope.smsCode = '';
	$scope.sendCode = function (phone) {
		userService.sendCode(phone).success(
			function (response) {
				alert(response.message)
			}
		)
	}

	//校验用户名
    var userName = /^.{3,6}$/;
	$scope.checkUsername = function (username) {
        $scope.flagUserName = '';
        if (userName.test(username)) {
            userService.findByUserName(username).success(
                function (response) {
                    if (response) {
                        $scope.flagUserName = "1";
                    } else {
                        $scope.flagUserName = "0";
                    }
                }
            )
        }
	}



	//校验密码
    var password = /^.{3,6}$/;
    $scope.checkPassword = function (pass1, pass2) {
        $scope.flagPassword = '';
        if (password.test(pass1)) {
            if (pass1 == pass2) {
                $scope.flagPassword = '1';
            } else {
                $scope.flagPassword = '0';
            }
        }
    }



    var phone = /^1[3456789]\d{9}$/;
	//校验手机号
    $scope.checkPhone = function (p) {

        if (phone.test(p)){
            if ( $scope.flagUserName == '1' &&$scope.flagPassword == '1') {
                $scope.sendCode(p)
                $scope.flagPhone = '1';
            }else {
                alert("请输入正确的账号密码")
            }
        } else {
            alert("请输入正确的手机号")
        }
    }

    //判断表单是否完整
    $scope.checkTable =function () {
        if ($scope.flagUserName == '1' &&$scope.flagPassword == '1' && $scope.flagPhone == '1' && ($scope.smsCode != null && $scope.smsCode != '' )) {
            return true;
        }
    }
});	
