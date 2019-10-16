package com.pinyougou.page.service.impl;

import com.pinyougou.page.service.ItemPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.ObjectMessage;

@Component
public class PageDeleteListener implements MessageListener {

    @Autowired
    private ItemPageService ItemPageService;

    @Override
    public void onMessage(Message message) {

        ObjectMessage objectMessage = (ObjectMessage) message;
        try {
            Long[] ids = (Long[])objectMessage.getObject();
            for (Long id : ids) {
                ItemPageService.deleteHtml(id);
            }
        } catch (JMSException e) {
            e.printStackTrace();
        }

    }
}
