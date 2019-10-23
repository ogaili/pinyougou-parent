package com.cart.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pay.service.WeiXinPayService;
import com.pinyougou.pojo.TbPayLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/pay")
public class PayController {

    @Autowired
    private RedisTemplate redisTemplate;

    @Reference
    private WeiXinPayService weiXinPayService;

    @RequestMapping("/createNative")
    public Map createNative(){
        TbPayLog payLog = (TbPayLog) redisTemplate.boundHashOps("payLog").get(SecurityContextHolder.getContext().getAuthentication().getName());

        Map map = weiXinPayService.createNative(payLog.getOutTradeNo(), payLog.getTotalFee() + "");
        map.put("out_trade_no",payLog.getOutTradeNo());
        map.put("total_fee",payLog.getTotalFee());

        return map;

    }
}
