package com.pinyougou.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.BrandService;
import entity.PageResult;
import entity.Result;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/brand")
public class BrandController {

    @Reference
    private BrandService brandService;

    @RequestMapping("/findAll.do")
    public List<TbBrand> findAll(){
        return brandService.findAll();
    }


    @RequestMapping("/findPage.do")
    public PageResult findPage(int pageNum, int pageSize,@RequestBody TbBrand brand){
        return brandService.findPage(brand,pageNum,pageSize);
    }

    @RequestMapping("/save.do")
    public Result save(@RequestBody TbBrand brand){
        try {
            brandService.save(brand);
            return new Result(true,"保存成功");
        } catch (Exception e) {
            return new Result(false,"保存失败");
        }
    }

    @RequestMapping("/update.do")
    public Result update(@RequestBody TbBrand brand){
        try {
            brandService.update(brand);
            return new Result(true,"保存成功");
        } catch (Exception e) {
            return new Result(false,"保存失败");
        }
    }


    @RequestMapping("/findOne.do")
    public TbBrand findOne(Long id){
        return brandService.findOne(id);
    }

    @RequestMapping("/delete.do")
    public void delete(Long[] ids){
        for (Long id : ids) {
            brandService.delete(id);
        }
    }

    @RequestMapping("/selectOptionList")
    public List<Map> selectOptionList(){
        return brandService.selectOptionList();
    }
}
