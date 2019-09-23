package com.pinyougou.sellergoods.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.mapper.TbBrandMapper;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.service.DemoService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class DemoServiceImpl implements DemoService {

    @Autowired
    private TbBrandMapper brandMapper;

    @Override
    public List<TbBrand> getName() {
        return brandMapper.selectByExample(null);
    }
}
