---
title: "Python learning notes"
description: "Miscellaneous Python notes and code snippets covering pd.DataFrame creation, Pandas tips, common error troubleshooting, and useful patterns."
icon: "note-sticky"
---

# Python notes

## 1. `pd.DataFrame`

This is the standard Pandas format for creating a `DataFrame`. Remember the capitalization: `DataFrame`. Each column in a `DataFrame` is a `Series`.

## 2. Reading text-based data files

`pandas.read_table()` is the more general API for reading text files.

The main difference is that its default `sep` is `"/t"`, meaning tab-separated data.

## `pd.read_csv()`

```python
pd.read_csv(
	filepath or buffer:要读入's File path
	sep='，'：列分隔符
	header='infer'：指定数据中's 第几行作为变量名
	names = None:自定义变量名列表
	index_col = None：将会被用作索引's 列名，多列时只能使用序号列表<br>	usecols = None：指定只读入某些列，使用索引列表或者Name列表均可。
			[0，1，3]，[”名次”，”学校Name”，”所在地区”]
	encoding = None:读入文件's 编码方式
			utf-8/GBK，中文数据文件最好设定为utf-8
	na_values：指定将被读入为缺失值's 数值列表，默认下列数据被读入为缺失值：
			' '，'#N/A', '#N/A N/A', '#NA', '-1.#IND',
			'-1.#QNAN', '-NaN', '-nan', '1.#IND', '1.#QNAN', 
			‘N/A',  'NA', 'NULL', 'NaN', 'n/a', 'nan', 'null'
)：读取csv格式文件，但也可通用于文本文件读取
```

4. ![image-20230924212132039](https://bangwu.oss-cn-shanghai.aliyuncs.com/img/image-20230924212132039.png)

## `describe` command

This command outputs common summary statistics for central tendency and dispersion in one go.

Percentile output is one of its most useful features.

```python
df.describe(
    percentiles:需要输出's 百分位数，列表格式提供，如[.25, .5, .75]
    include = "None" :要求纳入分析's 变量类型白名单
    	None (default) :只纳入数值变量列
    	A list0-like of dtypes :列表格式提供希望纳入's 类型
    	"all": 全部纳入
    exclude: 要求剔除分析's 变量类型黑名单，选项同上
)
```

## Univariate frequency statistics

```python
Series.value_counts(
	normalize = False: 是否返回构成比例而不是原始频数
	sort = True:是否按照频数排序（否则按照原始顺序排列）
	ascending = False:是否升序排列
	bins: yes数值变量直接进行分段。可看作是判断pd.cut's 简易用法
	dropna = True: 结果中是否包括NaN
)
```

## Crosstab

```python
pd.crosstab(
	行列设定
		index / columns: 行变量/列变量，多个时以list形式提供
		rownames / colnames = None: 交叉表's 行列Name
	单元格设定
		Values: 在单元格中需要汇总's 变量列，需要进一步指定aggfunc
		aggfunc: 相应's 汇总函数
	行列百分比计算
		normalize = False: {"all","index", "columns"}, or {0,1}
		"all" / True: 总计百分比
		"index" / 0:分行计算百分比
		"columns" / 1: 分列计算百分比
		当margins = True时，也同时计算边际汇总's 百分比
	汇总设定
		margins = False : 是否加入行列汇总
		margins_name = "All": 汇总行/列's Name
		dropna = True: 
		
	)
```
