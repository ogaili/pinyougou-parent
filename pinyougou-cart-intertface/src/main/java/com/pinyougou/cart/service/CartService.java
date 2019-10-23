package com.pinyougou.cart.service;

import com.pinyougou.pojogroup.Cart;

import java.util.List;

public interface CartService {

    public List<Cart> addGoodsToCartList(List<Cart> cartList, Long itemId, Integer num );

    List<Cart> merge(List<Cart> cartList_redis, List<Cart> cartList_cookie);

}
