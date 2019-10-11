package com.pinyougou.search.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.*;
import org.springframework.data.solr.core.query.result.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service(timeout = 5000)
public class ItemSearchServiceImpl implements ItemSearchService {

    @Autowired
    private SolrTemplate solrTemplate;
    @Autowired
    private RedisTemplate redisTemplate;


    /**
     *
     * @param searchMap 查询条件
     * @return 返回查询结果
     */
    @Override
    public Map search(Map searchMap) {

        //高亮查询
        Map resultMap = searchHighlight(searchMap);

        //商品分类查询
        List<String> list = searchCategoryList(searchMap);
        resultMap.put("categoryList",list);

        if (!"".equals(searchMap.get("category"))){
            Map brandAndSpec = getBrandAndSpec((String) searchMap.get("category"));
            resultMap.putAll(brandAndSpec);
        }else {
            resultMap.putAll(getBrandAndSpec(list.get(0)));
        }

        return resultMap;
    }


    private Map searchHighlight(Map searchMap){

        HighlightQuery query = new SimpleHighlightQuery();
        HighlightOptions highlightOptions =new HighlightOptions();
        highlightOptions.addField("item_title");
        highlightOptions.setSimplePrefix("<em style='color:red'>");//前缀
        highlightOptions.setSimplePostfix("</em>");//后缀
        query.setHighlightOptions(highlightOptions);

        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));
        query.addCriteria(criteria);

        HighlightPage<TbItem> page = solrTemplate.queryForHighlightPage(query, TbItem.class);

        List<HighlightEntry<TbItem>> highlighted = page.getHighlighted();
        for (HighlightEntry<TbItem> entry : highlighted) {
            TbItem tbItem = entry.getEntity();

            if (entry.getHighlights().size()>0 && entry.getHighlights().get(0).getSnipplets().size()>0) {
                tbItem.setTitle(entry.getHighlights().get(0).getSnipplets().get(0));
            }

//            System.out.println(entry.getHighlights().get(0));
//            System.out.println(entry.getHighlights().get(0).getSnipplets().get(0));
        }

        // highlighted 高亮页集合
        // entry 每一个高亮对象 entry.getEntity 获取具体实体对象  entry.getHighlights() 获取高亮信息对象集合
        // entry.getHighlights().get(0) 这个对象包含 高亮的域 和高亮片的集合
        // entry.getHighlights().get(0).getSnipplets().get(0)具体的字段  "<em style='color:red'>华为</em> G620 精致黑 联通4G手机"
        HashMap<String, Object> map = new HashMap<>();

        map.put("rows",page.getContent());

        return map;
    }

    private List<String> searchCategoryList(Map searchMap){

        Query query = new SimpleQuery();
        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));
        query.addCriteria(criteria);

        GroupOptions groupOptions = new GroupOptions();
        groupOptions.addGroupByField("item_category");
        query.setGroupOptions(groupOptions);

        GroupPage<TbItem> page = solrTemplate.queryForGroupPage(query, TbItem.class);

        GroupResult<TbItem> groupResult = page.getGroupResult("item_category");

        List<GroupEntry<TbItem>> content = groupResult.getGroupEntries().getContent();

        List<String> list = new ArrayList<>();
        for (GroupEntry<TbItem> entry : content) {
            list.add(entry.getGroupValue());
        }

        return list;
    }

    private Map getBrandAndSpec(String categoryName){

        HashMap<String, Object> map = new HashMap<>();
        Long templateId = (Long) redisTemplate.boundHashOps("itemCatList").get(categoryName);
        //获取brandList信息
        List<TbBrand> brandList = (List) redisTemplate.boundHashOps("brandList").get(templateId);
        map.put("brandList",brandList);
        //获取specList信息
        List specList = (List) redisTemplate.boundHashOps("specList").get(templateId);
        map.put("specList",specList);
        return map;
    }

}
