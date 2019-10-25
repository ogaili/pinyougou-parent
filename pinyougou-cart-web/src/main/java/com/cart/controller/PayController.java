package com.cart.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.order.service.OrderService;
import com.pinyougou.pay.service.WeiXinPayService;
import com.pinyougou.pojo.TbPayLog;
import entity.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pay")
public class PayController {

    @Autowired
    private RedisTemplate redisTemplate;

    @Reference
    private WeiXinPayService weiXinPayService;

    @Reference
    private OrderService orderService;

    @RequestMapping("/createNative")
    public Map createNative(){
        TbPayLog payLog = (TbPayLog) redisTemplate.boundHashOps("payLog").get(SecurityContextHolder.getContext().getAuthentication().getName());

//        Map map = weiXinPayService.createNative(payLog.getOutTradeNo(), payLog.getTotalFee() + "");
//        map.put("out_trade_no",payLog.getOutTradeNo());
//        map.put("total_fee",payLog.getTotalFee());

        if(payLog!=null){
            Map map = weiXinPayService.createNative(payLog.getOutTradeNo(), payLog.getTotalFee() + "");
            map.put("out_trade_no",payLog.getOutTradeNo());
            map.put("total_fee",payLog.getTotalFee());
            return map;
        }else{
            return new HashMap();
        }
    }



    /**
     * 查询支付状态
     * @param out_trade_no
     * @return
     */
    @RequestMapping("/queryPayStatus")
    public Result queryPayStatus(String out_trade_no){
        Result result=null;
        int x=0;
        while(true){
            //调用查询接口
            Map<String,String> map = weiXinPayService.queryPayStatus(out_trade_no);
            if(map==null){//出错
                result=new  Result(false, "支付出错");
                break;
            }
            if(map.get("trade_state").equals("SUCCESS")){//如果成功
                result=new  Result(true, "支付成功");

                //修改订单状态
                orderService.updateOrderStatus(out_trade_no, map.get("transaction_id"));
                break;
            }
            try {
                Thread.sleep(3000);//间隔三秒
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            //为了不让循环无休止地运行，我们定义一个循环变量，如果这个变量超过了这个值则退出循环，设置时间为5分钟
            x++;
            if(x>=100){
                result=new  Result(false, "二维码超时");
                break;
            }
        }
        return result;
    }


}
