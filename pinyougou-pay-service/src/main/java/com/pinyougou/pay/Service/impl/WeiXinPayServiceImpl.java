package com.pinyougou.pay.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.github.wxpay.sdk.WXPayUtil;
import com.pinyougou.HttpClient;
import com.pinyougou.pay.service.WeiXinPayService;
import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.Map;

@Service
public class WeiXinPayServiceImpl implements WeiXinPayService {

    @Value("${appid}")
    private String appid;
    @Value("${partner}")
    private String partner;
    @Value("${partnerkey}")
    private String partnerkey;
    @Value("${notifyurl}")
    private String notifyurl;

    /**
     * 生成微信支付二维码地址
     * @param out_trade_no
     * @param total_fee
     * @return
     */
    @Override
    public Map createNative(String out_trade_no, String total_fee) {

        HashMap<String, String> map = new HashMap<>();
        //1.封装请求参数
        map.put("appid",appid);//公众账号ID
        map.put("mch_id",partner);//商户号
        map.put("nonce_str", WXPayUtil.generateNonceStr());//随机字符串
        map.put("body","品优购");//商品描述
        map.put("out_trade_no",out_trade_no);//商户订单号
        map.put("total_fee",total_fee);//标价金额
        map.put("spbill_create_ip","127.0.0.1");//终端IP
        map.put("notify_url","http://www.baidu.com");//通知地址
        map.put("trade_type","NATIVE");//交易类型

        try {
            //2.将map转换成XML
            String xmlParam = WXPayUtil.generateSignedXml(map, partnerkey);

            //3.将XML形式的参数发送至微信支付接口
            HttpClient httpClient = new HttpClient("https://api.mch.weixin.qq.com/pay/unifiedorder");
            httpClient.setHttps(true);
            httpClient.setXmlParam(xmlParam);
            httpClient.post();

            String content = httpClient.getContent();

            //3.返回支付接口返回的url
            HashMap<Object, Object> resultMap = new HashMap<>();
            resultMap.put("code_url",WXPayUtil.xmlToMap(content).get("code_url"));
            return resultMap;
        } catch (Exception e) {
            e.printStackTrace();
            return new HashMap<>();
        }
    }
}
