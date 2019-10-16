package com.pinyougou.page.service.impl;

import com.pinyougou.mapper.TbGoodsDescMapper;
import com.pinyougou.mapper.TbGoodsMapper;
import com.pinyougou.mapper.TbItemCatMapper;
import com.pinyougou.mapper.TbItemMapper;
import com.pinyougou.page.service.ItemPageService;
import com.pinyougou.pojo.*;
import freemarker.template.Configuration;
import freemarker.template.Template;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import java.io.*;
import java.util.HashMap;
import java.util.List;

@Service
public class ItemPageServiceImpl implements ItemPageService {

    @Autowired
    private FreeMarkerConfigurer freeMarkerConfigurer;
    @Value("${pageDir}")
    private String pageDir;

    @Autowired
    private TbGoodsMapper goodsMapper;
    @Autowired
    private TbGoodsDescMapper goodsDescMapper;
    @Autowired
    private TbItemMapper itemMapper;
    @Autowired
    private TbItemCatMapper itemCatMapper;

    @Override
    public boolean genItemHtml(Long goodsId) {
        try {
            Configuration configuration = freeMarkerConfigurer.getConfiguration();
            Template template = configuration.getTemplate("item.ftl");
            HashMap<String, Object> dataModel = new HashMap<>();

            //查询商品信息放入map中
            TbGoods goods = goodsMapper.selectByPrimaryKey(goodsId);
            dataModel.put("goods",goods);

            //查询商品详细信息放入map中
            TbGoodsDesc goodsDesc = goodsDescMapper.selectByPrimaryKey(goodsId);
            dataModel.put("goodsDesc",goodsDesc);

            //查询面包屑放入map中
           dataModel.put("category1",itemCatMapper.selectByPrimaryKey(goods.getCategory1Id()).getName());
           dataModel.put("category2",itemCatMapper.selectByPrimaryKey(goods.getCategory2Id()).getName());
           dataModel.put("category3",itemCatMapper.selectByPrimaryKey(goods.getCategory3Id()).getName());

           //查询sku列表放入map中
            TbItemExample example = new TbItemExample();
            example.createCriteria().andGoodsIdEqualTo(goodsId).andStatusEqualTo("1");
            example.setOrderByClause("is_default desc");
            List<TbItem> items = itemMapper.selectByExample(example);
            dataModel.put("itemList",items); //

            BufferedWriter out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(new File(pageDir + goodsId + ".html")), "utf-8"));
            template.process(dataModel,out);
            out.close();

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean deleteHtml(Long goodsId) {
        try {
           return new File(pageDir + goodsId + ".html").delete();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
