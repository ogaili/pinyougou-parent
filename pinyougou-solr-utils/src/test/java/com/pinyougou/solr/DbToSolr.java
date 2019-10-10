package com.pinyougou.solr;

import com.alibaba.fastjson.JSON;
import com.pinyougou.mapper.TbItemMapper;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.pojo.TbItemExample;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;
import java.util.Map;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath*:spring/applicationContext*.xml")
public class DbToSolr {

    @Autowired
    private TbItemMapper itemMapper;

    @Autowired
    private SolrTemplate solrTemplate;

    @Test
    public void dbToSolr(){

        TbItemExample example = new TbItemExample();
        example.createCriteria().andStatusEqualTo("1");
        List<TbItem> tbItems = itemMapper.selectByExample(example);

        for (TbItem tbItem : tbItems) {
            tbItem.setSpecMap(JSON.parseObject(tbItem.getSpec(), Map.class));
            System.out.println(tbItem.getTitle()+"   "+tbItem.getSpecMap());
        }

        solrTemplate.saveBeans(tbItems);
        solrTemplate.commit();


    }


}
