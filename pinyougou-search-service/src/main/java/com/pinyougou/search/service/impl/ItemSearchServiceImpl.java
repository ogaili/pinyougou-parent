package com.pinyougou.search.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.Criteria;
import org.springframework.data.solr.core.query.SimpleQuery;
import org.springframework.data.solr.core.query.result.ScoredPage;

import javax.management.Query;
import java.util.HashMap;
import java.util.Map;

@Service(timeout = 5000)
public class ItemSearchServiceImpl implements ItemSearchService {

    @Autowired
    private SolrTemplate solrTemplate;


    /**
     *
     * @param searchMap 查询条件
     * @return 返回查询结果
     */
    @Override
    public Map search(Map searchMap) {
        HashMap<String, Object> resultMap = new HashMap<>();

        SimpleQuery query = new SimpleQuery("*:*");
        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));

        query.addCriteria(criteria);

        ScoredPage<TbItem> page = solrTemplate.queryForPage(query, TbItem.class);

        resultMap.put("rows",page.getContent());

        return resultMap;
    }
}
