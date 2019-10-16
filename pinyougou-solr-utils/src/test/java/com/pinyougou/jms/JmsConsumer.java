package com.pinyougou.jms;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.swing.*;
import java.io.IOException;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:spring/spring-jms-consumer.xml")
public class JmsConsumer {


    @Test
    public void jmsConsumer(){

        try {
            System.in.read();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
