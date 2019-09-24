package com.pinyougou.service;

import com.pinyougou.pojo.TbBrand;
import entity.PageResult;

import java.util.List;

public interface BrandService {
    List<TbBrand> findAll();

    PageResult findPage(TbBrand brand,int pageNum, int pageSize);

    void save(TbBrand brand);

    void update(TbBrand brand);

    TbBrand findOne(Long id);

    void delete(Long id);
}
