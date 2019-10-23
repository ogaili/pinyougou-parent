package com.cart.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.pinyougou.CookieUtil;
import com.pinyougou.cart.service.CartService;
import com.pinyougou.order.service.OrderService;
import com.pinyougou.pojo.TbOrder;
import com.pinyougou.pojogroup.Cart;
import entity.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
@RestController
@RequestMapping("/cart")
public class CartController {


    @Reference
    private CartService cartService;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private HttpServletResponse response;

    @Autowired
    private RedisTemplate redisTemplate;

    @Reference
    private OrderService orderService;

    /**
     * 获取用户id
     */
    @RequestMapping("/getUserName")
    public String getUserName(){
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    /**
     * 购物车列表
     *
     * @param
     * @return
     */
    @RequestMapping("/findCartList")
    public List<Cart> findCartList() {
        String cartListString = CookieUtil.getCookieValue(request, "cartList", "UTF-8");
        if (cartListString == null || cartListString.equals("") ||cartListString.equals("null")) {
            cartListString = "[]";
        }
        List<Cart> cartList_cookie = JSON.parseArray(cartListString, Cart.class);

        if ("anonymousUser".equals(getUserName())){
            //进这里表示游客登陆，那么直接返回cookie信息
            System.out.println("从cookie查询");
            return cartList_cookie;
        }else {
            //否则取出redis的值
            List<Cart> cartList_redis = (List<Cart>) redisTemplate.boundHashOps("cartList").get(getUserName());
            if (cartList_redis!=null&&cartList_redis.size()>0){
                //进入表示redis中有东西 ，那么需要合并cookie
                System.out.println("从redis查询并合并");
                cartList_cookie = cartService.merge(cartList_cookie,cartList_redis);
                //清除cookie中的数据
                CookieUtil.deleteCookie(request, response, "cartList");
                //将数据redis存入
                redisTemplate.boundHashOps("cartList").put(getUserName(),cartList_redis);
            }
            //没有则直接返回
            return cartList_cookie;
        }

    }

    /**
     * 添加商品到购物车
     *
     * @param
     * @param
     * @param itemId
     * @param num
     * @return
     */
    @RequestMapping("/addGoodsToCartList")
    @CrossOrigin(origins="http://localhost:9105",allowCredentials="true")
    public Result addGoodsToCartList(Long itemId, Integer num) {
        try {
            List<Cart> cartList = findCartList();//获取购物车列表
            cartList = cartService.addGoodsToCartList(cartList, itemId, num);
            if ("anonymousUser".equals(getUserName())){
                //进这里表示游客登陆，那么购物车信息存入cookie
                System.out.println("保存到cookie");
                CookieUtil.setCookie(request, response, "cartList", JSON.toJSONString(cartList), 3600 * 24, "UTF-8");
            }else {
                //否则存入redis
                System.out.println("保存到redis");
                redisTemplate.boundHashOps("cartList").put(getUserName(),cartList);
            }

            return new Result(true, "添加成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "添加失败");
        }
    }

    /**
     * 提交订单
     */
    @RequestMapping("/addOrder")
    public Result addOrder(@RequestBody TbOrder order){
        try {
            order.setUserId(getUserName());
            orderService.add(order);
            return new Result(true, "提交成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "提交失败");
        }
    }
}

