package com.pinyougou.pay.service;

import java.util.Map;

public interface WeiXinPayService {

    public Map createNative(String out_trade_no, String total_fee);

    /**
     * 查询支付状态
     * @param out_trade_no
     */
    public Map queryPayStatus(String out_trade_no);
}
