package com.pinyougou.search.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;
import java.util.Arrays;
import java.util.List;

@Component
public class itemSearchListener implements MessageListener {

    @Autowired
    private ItemSearchService itemSearchService;


    @Override
    public void onMessage(Message message) {
        TextMessage textMessage = (TextMessage) message;
        try {
            String text = textMessage.getText();
            System.out.println(text);
            if (text.contains("delete")) {
                String[] s = text.replace("delete", "").replace("[", "").replace("]", "").split(",");
                Long[] ids = new Long[s.length];
                for (int i = 0; i < s.length; i++) {
                    ids[i] = Long.parseLong(s[i]);
                }
                itemSearchService.deleteByGoodsIds(ids);
            }else {
                List<TbItem> skuList = JSON.parseArray(text, TbItem.class);
                itemSearchService.importList(skuList);
            }


        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
