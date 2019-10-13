package com.pinyougou.search.service;

import com.pinyougou.pojo.TbItem;

import java.util.List;
import java.util.Map;

public interface ItemSearchService {

    Map search(Map searchMap);

    void importList(List<TbItem> skuList);

    void deleteByGoodsIds(Long[] ids);
}
