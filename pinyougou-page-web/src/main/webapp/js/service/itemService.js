//服务层
app.service('itemService',function ($http) {

    this.addToCart = function (skuId,num) {
        return $http.get('http://localhost:9107/cart/addGoodsToCartList.do?itemId='+skuId+'&num='+num,{'withCredentials':true});
    }

});