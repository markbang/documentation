---
title: "MySQL"
description: "MySQL learning notes covering CREATE/INSERT/UPDATE/DELETE statements, single and multi-table queries, index optimization, and user permissions."
icon: "database"
---
# First introduction to database

## What is a database

> **Database: DB (DataBase)**

**Concept**: Data warehouse, `软件`, installed on the operating system

**Function**: Store data, manage data

------

## Database classification

**Relational database: SQL** (Structured Query Language)

- MySQL, Oracle, Sql Server, DB2, SQLlite
- Store data through relationships between tables and between rows and columns
- Establish relationships between tables through foreign key associations

**Non-relational database: NoSQL** (Not Only SQL)

- Redis, MongoDB
- Refers to data stored in the database in the form of **objects**, and the relationship between objects is determined by the properties of each object itself

------

## Related concepts

> **DBMS (Database Management System)**

- Database management software**, scientific and effective management, maintenance and acquisition of our data
- **MySQL** is a database management system

![image-20200718152213413](https://img-blog.csdnimg.cn/img_convert/6ca15d7eee443107638939952d09ed79.png)

------

## MySQL and its installation

- [MySQL latest version 8.0.21 installation and configuration tutorial~](https://bareth.blog.csdn.net/article/details/107369405)

## Basic commands

> All statements must end with a semicolon;

```sql
show databases;	-- 查看当前所有的数据库
use 数据库名;	-- 打开指定的数据库
show tables;	-- 查看所有的表
describe/desc 表名;	-- 显示表的信息
create database 数据库名;	-- 创建一个数据库
exit	-- 退出连接
```

```sql
--		-- 单行注释
#		-- 单行注释
/*...*/		-- 多行注释
```

#Operation database

##Operation database

```sql
-- 创建数据库
CREATE DATABASE [IF NOT EXISTS] 数据库名;    CREATE SCHEMA

-- 删除数据库
DROP DATABASE [if EXISTS] 数据库名;    DROP SCHEMA

-- 使用数据库
-- 如果表名或者字段名是特殊字符，则需要带``
use 数据库名;

-- 查看数据库
SHOW DATABASES;
```

## Database column type

> **Value**

| `数据类型` | `描述` | `大小` |
| :--------: | :----------------------------------: | :-----: |
| tinyint | very small data | 1 byte |
| smallint | smaller data | 2 bytes |
| mediumint | medium size data | 3 bytes |
| int | standard integer | 4 bytes |
| bigint | Larger data | 8 bytes |
| float | floating point number | 4 bytes |
| double | floating point number | 8 bytes |
| decimal | Floating point number in string form, generally used for financial calculations | |

> string

| `数据类型` | `描述` | `大小` |
| :--------: | :----------------: | :-----: |
| char | String fixed size | 0~255 |
| varchar | variable string | 0~65535 |
| tinytext | tiny text | 2^8-1 |
| text | text string | 2^16-1 |

> Time and date

| `数据类型` | `描述` | `格式` |
| :--------: | :----------------------------------: | :------------------: |
| date | date format | YYYY-MM-DD |
| time | time format | HH: mm: ss |
| datetime | The most commonly used time format | YYYY-MM-DD HH: mm: ss |
| timestamp | Timestamp, number of milliseconds from 1970.1.1 to now | |
| year | Year representation | |

> null

- no value, unknown
- Do not use NULL values for calculations

## Database field attributes

> **UnSigned**

- unsigned
- Declared that the column cannot be negative

> ZEROFILL

- 0 padded
- Fill the missing digits with 0, such as int(3), 5 is 005

> **Auto_InCrement**

- Usually understood as auto-increment, it automatically defaults to +1 based on the previous record.
- Usually used to design a unique primary key, which must be an integer type
- Definable starting value and step size
  - Current table setting step size (AUTO_INCREMENT=100): only affects the current table
  - SET @@auto_increment_increment=5 ; affects all tables using auto-increment (global)

> **NULL and NOT NULL**

- The default is NULL, that is, no value is inserted into the column
- If set to NOT NULL, the column must have a value

> **DEFAULT**

- default
- used to set default values
- For example, the gender field defaults to "male", otherwise it is "female"; if the value of this column is not specified, the default value is the value of "male"

**Extension**: Every table must have the following five fields:

| Name | Description |
| :--------: | :------: |
| id | primary key |
| version | optimistic locking |
| is_delete | Pseudo delete |
| gmt_create | Creation time |
| gmt_update | modification time |

## Create database table

```sql
CREATE TABLE IF NOT EXISTS `student`(
	`id` INT(4)	NOT NULL AUTO_INCREMENT COMMENT '学号',
	`name` VARCHAR(30) NOT NULL DEFAULT '匿名' COMMENT '姓名',
	`pwd` VARCHAR(20) NOT NULL DEFAULT '123456' COMMENT '密码',
	`sex` VARCHAR(2) NOT NULL DEFAULT '女' COMMENT '性别',
	`birthday` DATETIME DEFAULT NULL COMMENT '出生日期',
	`address` VARCHAR(100) DEFAULT NULL COMMENT '家庭住址',
	`email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
	PRIMARY KEY (`id`)
)ENGINE=INNODB DEFAULT CHARSET=utf8
```

`注意点`：

- Try to use `` brackets in table names and fields.
- AUTO_INCREMENT represents automatic increment
- Add commas after all statements, except the last one.
- Strings are enclosed in single quotes
- The declaration of the primary key is generally placed at the end for easy viewing.
- If the character set encoding is not set, MySQL's default character set encoding Latin1 will be used. Chinese is not supported and can be modified in my.ini.

> Format:

```sql
CREATE TABLE IF NOT EXISTS `student`(
	'字段名' 列类型 [属性] [索引] [注释],
    '字段名' 列类型 [属性] [索引] [注释],
    ......
    '字段名' 列类型 [属性] [索引] [注释]
)[表的类型][字符集设置][注释]
```

`常用命令`

```sql
SHOW CREATE DATABASE 数据库名;-- 查看创建数据库的语句
SHOW CREATE TABLE 表名;-- 查看表的定义语句
DESC 表名;-- 显示表的具体结构
```

## Database storage engine

**INNODB**

- Used by default, has high security, supports transaction processing, and multi-table and multi-user operations

**MYISAM**

- Used in earlier years, saving space and faster

| | MYISAM | INNODB |
| -------------- | ------ | ------------- |
| **Transaction support** | Not supported | Supported |
| **Data Row Locking** | Not supported | Supported |
| **Foreign key constraints** | Not supported | Supported |
| **Full text index** | Supported | Not supported |
| **Table space size** | Smaller | Larger, about 2 times |

> **Physical space location where the database file exists**:

- MySQL data tables are stored on disk as files
  -Including table files, data files, and database option files
  - Location: `Mysql安装目录\data\` (the directory name corresponds to the database name, and the file name in this directory corresponds to the data table)

![](https://img-blog.csdnimg.cn/img_convert/1946b76c983e11c85ab1b71a89158eb0.png)

**MySQL differs in file engine:**

- `INNODB`Database file types include **.frm**, **.ibd** and **ibdata1** files in the upper-level directory
- MYISAM storage engine, database file types include
  - **.frm**: table structure definition file
  - **.MYD**: data file
  - **.MYI**: index file

## Modify database

> **Modify**

```sql
-- 修改表名
-- ALTER TABLE 旧表名 RENAME AS 新表名
ALTER TABLE teacher RENAME AS teachers;

-- 增加表的字段
-- ALTER TABLE 表名 ADD 字段名 列属性
ALTER TABLE teachers ADD age INT(11);

-- 修改表的字段(重命名，修改约束)
-- ALTER TABLE 表名 MODIFY 字段名 [列属性];
ALTER TABLE teachers MODIFY age VARCHAR(11);-- 修改约束
-- ALTER TABLE 表名 CHANGE 旧名字 新名字 [列属性];
ALTER TABLE teachers CHANGE age age1 INT(1);-- 字段重命名

-- 删除表的字段
-- ALTER TABLE 表名 DROP 字段名
ALTER TABLE teachers DROP age1;
```

> **DELETE**

**Syntax**: DROP TABLE [IF EXISTS] table name

- IF EXISTS is optional to determine whether the data table exists
- If you delete a non-existent data table, an error will be thrown.

```sql
-- 删除表(如果存在再删除)
DROP TABLE IF EXISTS teachers;
```

**All creation and deletion should be judged as much as possible to avoid errors~**

#MySQLData Management

## Foreign keys

> **Foreign Key Concept**

If a common key is the primary key in one relationship, then the common key is called a foreign key in another relationship. It can be seen that the foreign key represents the interconnection between the relationships between two people. The table with the foreign key of another relationship as the primary key is called ``主表``，具有此外键的表被称为主表的``从表``.

In actual operation, the value of one table is put into the second table to represent the association, and the value used is the primary key value of the first table (including the composite primary key value if necessary). At this point, the attribute in the second table that holds these values ​​is called the foreign key (`foreign key`).

**Foreign key function**:

Maintain data ``一致性``，`integrity`，主要目的是控制存储在外键表中的数据，`constraint`. To associate two tables, the foreign key can only refer to the values ​​of columns in the table or use null values.

------

Target: The gradeid field of the student table (student) is to reference the gradeid field of the grade table (grade).

> **Create foreign key**

**Method 1: Add constraints when creating the table**

```sql
/*
	1. 定义外键key
	2. 给外键添加约束（执行引用）references 引用
*/
CREATE TABLE IF NOT EXISTS `student`(
	`id` INT(4) NOT NULL AUTO_INCREMENT COMMENT '学号',
	`name` VARCHAR(30) NOT NULL DEFAULT '匿名' COMMENT '姓名',
	`pwd` VARCHAR(20) NOT NULL DEFAULT '123456' COMMENT '密码',
	`sex` VARCHAR(2)	NOT NULL DEFAULT '女' COMMENT '性别',
	`birthday` DATETIME DEFAULT NULL COMMENT '出生日期',
	`address` VARCHAR(100) DEFAULT NULL COMMENT '家庭住址',
	`email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
	`gradeid` INT(10) NOT NULL COMMENT '学生的年级',
	PRIMARY KEY (`id`),
	KEY `FK_gradeid` (`gradeid`),
	CONSTRAINT `FK_gradeid` FOREIGN KEY (`gradeid`) REFERENCES `grade`(`gradeid`)
)ENGINE=INNODB DEFAULT CHARSET=utf8

-- 创建年级表
CREATE TABLE `grade`(
	`gradeid` INT(10) NOT NULL COMMENT '年级id',
	`gradename` VARCHAR(50) NOT NULL COMMENT '年纪名称',
	PRIMARY KEY (`gradeid`)
)ENGINE=INNODB DEFAULT CHARSET=utf8
```

When deleting a table with a foreign key relationship, you must first delete the table that refers to someone else (slave table), and then delete the referenced table (master table)

------

**Method 2: After successfully creating the table, add foreign key constraints**

```sql
/*
	1. 定义外键key
	2. 给外键添加约束（执行引用）references 引用
*/
CREATE TABLE IF NOT EXISTS `student`(
	`id` INT(4) NOT NULL AUTO_INCREMENT COMMENT '学号',
	`name` VARCHAR(30) NOT NULL DEFAULT '匿名' COMMENT '姓名',
	`pwd` VARCHAR(20) NOT NULL DEFAULT '123456' COMMENT '密码',
	`sex` VARCHAR(2)	NOT NULL DEFAULT '女' COMMENT '性别',
	`birthday` DATETIME DEFAULT NULL COMMENT '出生日期',
	`address` VARCHAR(100) DEFAULT NULL COMMENT '家庭住址',
	`email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
	`gradeid` INT(10) NOT NULL COMMENT '学生的年级',
	PRIMARY KEY (`id`)
)ENGINE=INNODB DEFAULT CHARSET=utf8

-- 创建表的时候没有外键关系
ALTER TABLE `student`
ADD CONSTRAINT `FK_gradeid` FOREIGN KEY(`gradeid`) REFERENCES `grade`(`gradeid`);

-- 创建年级表
CREATE TABLE `grade`(
	`gradeid` INT(10) NOT NULL COMMENT '年级id',
	`gradename` VARCHAR(50) NOT NULL COMMENT '年纪名称',
	PRIMARY KEY (`gradeid`)
)ENGINE=INNODB DEFAULT CHARSET=utf8
```

The above operations are all physical foreign keys, database-level foreign keys, and are not recommended! Avoid trouble caused by too many databases!

`最佳实践`

- The database is a simple table, only used to store data, only rows (data) and columns (attributes)
- We want to use data from multiple tables, use foreign keys, and implement it with programs

------

## DML language

`数据库的意义`：Data storage, data management

> `Data Manipulation Luaguge`: Database operation language

### 1. Add [insert](https://so.csdn.net/so/search?q=insert&spm=1001.2101.3001.7020)

```sql
-- 普通用法
INSERT INTO `student`(`name`) VALUES ('zsr');

-- 插入多条数据
INSERT INTO `student`(`name`,`pwd`,`sex`) VALUES ('zsr','200024','男'),('gcc','000421','女');

-- 省略字段
INSERT INTO `student` VALUES (5,'Bareth','123456','男','2000-02-04','武汉','1412@qq.com',1); 
12345678
```

**grammar:**

```sql
INSERT INTO 表名([字段1,字段2..])VALUES('值1','值2'..),[('值1','值2'..)..];
```

**Notice**:

1. Use commas to separate fields.
2. Fields can be omitted, but the values must be complete and one-to-one correspondence
3. Multiple pieces of data can be inserted at the same time. The values after VALUES need to be separated by commas.

------

### 2. Modify update

```sql
-- 修改学员名字,指定条件
UPDATE `student` SET `name`='zsr204' WHERE id=1;

-- 不指定条件的情况,会改动所有表
UPDATE `student` SET `name`='zsr204';

-- 修改多个属性
UPDATE `student` SET `name`='zsr',`address`='湖北' WHERE id=1;

-- 通过多个条件定位数据
UPDATE `student` SET `name`='zsr204' WHERE `name`='zsr' AND `pwd`='200024';
1234567891011
```

**grammar**:

```sql
UPDATE 表名 SET 字段1=值1,[字段2=值2...] WHERE 条件[];
```

**About WHERE conditional statements**:

| Operator | Meaning |
|------------|--------|
| `=` | equal to |
| `<>` or `!=` | Not equal to |
| `>` | Greater than |
| `<` | Less than |
| `<=` | Less than or equal to |
| `>=` | Greater than or equal to |
| `BETWEEN…AND…` | Closed interval |
| `AND` | and |
| `OR` | or |

------

### 3. Delete delete

```sql
-- 删除数据(避免这样写,会全部删除)
DELETE FROM `student`;

-- 删除指定数据
DELETE FROM `student` WHERE id=1;
```

**grammar**:

```sql
DELETE FROM 表名 [WHERE 条件]
```

Regarding the problem of deleting `DELETE` and restarting the database:

- INNODB auto-increment columns will start from 1 (stored in memory and lost when power is turned off)
- MYISAM continues from the previous sub-increment (stored in memory and will not be lost)

> TRUNCATE

**Function**: Completely clear a database table, the structure and index constraints of the table will not change!

**The difference between DELETE and TRUNCATE:**

- DELETE can delete conditionally (where clause), while TRUNCATE can only delete the entire table
- TRUNCATE resets the auto-increment column and the counter will return to zero, while DELETE will not affect the auto-increment
- DELETE is a data manipulation language (DML - Data Manipulation Language). During the operation, the original data will be placed in the rollback segment and can be rolled back; while TRUNCATE is a data definition language (DDL - Data Definition Language). It will not be stored during the operation and cannot be rolled back.
  ![image-20210418210712785](https://img-blog.csdnimg.cn/img_convert/b4b2c1e383fc8bd2f0b1e4a4eddc080f.png)

```sql
CREATE TABLE `test`(
	`id` INT(4) NOT NULL AUTO_INCREMENT,
	`coll` VARCHAR(20) NOT NULL,
	PRIMARY KEY (`id`)
)ENGINE=INNODB DEFAULT CHARSET=utf8;

INSERT INTO `test`(`coll`) VALUES('1'),('2'),('3');

-- 不会影响自增
DELETE FROM `test`;

-- 会影响自增
TRUNCATE TABLE `test`;
```

------

# DQL query data

> `Data QueryLanguage`: Data query language

```sql
SELECT [ALL | DISTINCT]
{* | table.* | [table.field1[as alias1][,table.field2[as alias2]][,...]]}
FROM table_name [as table_alias]
  [left | right | inner join table_name2]  -- 联合查询
  [WHERE ...]  -- 指定结果需满足的条件
  [GROUP BY ...]  -- 指定结果按照哪几个字段来分组
  [HAVING]  -- 过滤分组的记录必须满足的次要条件
  [ORDER BY ...]  -- 指定查询记录按一个或多个条件排序
  [LIMIT {[offset,]row_count | row_countOFFSET offset}]; -- 指定查询的记录从哪条至哪条
```

- Query database data, such as SELECT statements
- Simple single table query or complex query and nested query of multiple tables
- It is the core and most important statement in the database language
- Most frequently used statements

`前提配置`：

```sql
-- 创建学校数据库
CREATE DATABASE IF NOT EXISTS `school`;

-- 用school数据库
USE `school`;

-- 创建年级表grade表
CREATE TABLE `grade`(
	`GradeID` INT(11) NOT NULL AUTO_INCREMENT COMMENT '年级编号',
	`GradeName` VARCHAR(50) NOT NULL COMMENT '年纪名称',
	PRIMARY KEY	(`GradeID`)
)ENGINE=INNODB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- 给grade表插入数据
INSERT INTO `grade`(`GradeID`,`GradeName`) 
VALUES (1,'大一'),(2,'大二'),(3,'大三'),(4,'大四');

-- 创建成绩result表
CREATE TABLE `result`(
	`StudentNo` INT(4) NOT NULL COMMENT '学号',
	`SubjectNo` INT(4) NOT NULL COMMENT '考试编号',
	`ExamDate` DATETIME NOT NULL COMMENT '考试日期',
	`StudentResult` INT(4) NOT NULL COMMENT '考试成绩',
	KEY `SubjectNo` (`SubjectNo`)
)ENGINE=INNODB DEFAULT CHARSET=utf8;

-- 给result表插入数据
INSERT INTO `result`(`StudentNo`,`SubjectNo`,`ExamDate`,`StudentResult`) 
VALUES (1000,1,'2019-10-21 16:00:00',97),(1001,1,'2019-10-21 16:00:00',96),
(1000,2,'2019-10-21 16:00:00',87),(1001,3,'2019-10-21 16:00:00',98);

-- 创建学生表student
CREATE TABLE `student`(	
	`StudentNo` INT(4) NOT NULL COMMENT '学号',
	`LoginPwd` VARCHAR(20) DEFAULT NULL,
	`StudentName` VARCHAR(20) DEFAULT NULL COMMENT '学生姓名',
	`Sex` TINYINT(1) DEFAULT NULL COMMENT '性别,取值0或1',
	`GradeID` INT(11) DEFAULT NULL COMMENT '年级编号',
	`Phone` VARCHAR(50) NOT NULL COMMENT '联系电话,允许为空,即可选输入',
	`Adress` VARCHAR(255) NOT NULL COMMENT '地址,允许为空,即可选输入',
	`BornDate` DATETIME DEFAULT NULL COMMENT '出生时间',
	`Email` VARCHAR(50) NOT NULL COMMENT '邮箱账号,允许为空,即可选输入',
	`IdentityCard` VARCHAR(18) DEFAULT NULL COMMENT '身份证号',
	PRIMARY KEY (`StudentNo`),
	UNIQUE KEY `IdentityCard` (`IdentityCard`),
	KEY `Email` (`Email`)
)ENGINE=MYISAM DEFAULT CHARSET=utf8;

-- 给学生表插入数据
INSERT INTO `student`(`StudentNo`,`LoginPwd`,`StudentName`,`Sex`,`GradeID`,`Phone`,`Adress`,`BornDate`,`Email`,`IdentityCard`) 
VALUES (1000,'1241','dsaf',1,2,'24357','unknow','2000-09-16 00:00:00','1231@qq.com','809809'),
(1001,'1321','dfdj',0,2,'89900','unknow','2000-10-16 00:00:00','5971@qq.com','908697');

-- 创建科目表
CREATE TABLE `subject`(
	`SubjectNo` INT(11) NOT NULL AUTO_INCREMENT COMMENT '课程编号',
	`SubjectName` VARCHAR(50) DEFAULT NULL COMMENT '课程名称',
	`ClassHour` INT(4) DEFAULT NULL COMMENT '学时',
	`GradeID` INT(4) DEFAULT NULL COMMENT '年级编号',
	PRIMARY KEY (`SubjectNo`)
)ENGINE=INNODB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- 给科目表subject插入数据
INSERT INTO `subject`(`SubjectNo`,`SubjectName`,`ClassHour`,`GradeID`) 
VALUES(1,'高数','96',2),(2,'大物','112',2),(3,'程序设计',64,3);

SELECT 字段 FROM 表;
```

## **Basic Query**

`语法`：

```sql
SELECT 查询列表 FROM 表名;
```

- The query list can be: (one or more) fields in the table, constants, variables, expressions, functions
- The query result is a virtual table

```sql
-- 查询全部学生
SELECT * FROM student;

-- 查询指定的字段
SELECT `LoginPwd`,`StudentName` FROM student;

-- 别名 AS(可以给字段起别名,也可以给表起别名)
SELECT `StudentNo` AS 学号,`StudentName` AS 学生姓名 FROM student AS 学生表;

-- 函数 CONCAT(str1,str2,...)
SELECT CONCAT('姓名',`StudentName`) AS 新名字 FROM student;

-- 查询系统版本(函数)
SELECT VERSION();

-- 用来计算(计算表达式)
SELECT 100*53-90 AS 计算结果;

-- 查询自增步长(变量)
SELECT @@auto_increment_increment;

-- 查询有哪写同学参加了考试,重复数据要去重
SELECT DISTINCT `StudentNo` FROM result;
```

## Query conditions

> where conditional statement: retrieve the value of `符合条件` in the data

**grammar**:

```sql
select 查询列表 from 表名 where 筛选条件;
```

```sql
-- 查询考试成绩在95~100之间的
SELECT `StudentNo`,`StudentResult` FROM result
WHERE `StudentResult`>=95 AND `StudentResult`<=100;
-- &&
SELECT `StudentNo`,`StudentResult` FROM result
WHERE `StudentResult`>=95 && `StudentResult`<=100;
-- BETWEEN AND
SELECT `StudentNo`,`StudentResult` FROM result
WHERE `StudentResult`BETWEEN 95 AND 100;

-- 查询除了1000号以外的学生
SELECT `StudentNo`,`StudentResult` FROM result
WHERE `StudentNo`!=1000;
-- NOT
SELECT `StudentNo`,`StudentResult` FROM result
WHERE NOT `StudentNo`=1000;

-- 查询名字含d的同学
SELECT `StudentNo`,`StudentName` FROM student
WHERE `StudentName` LIKE '%d%';

-- 查询名字倒数第二个为d的同学
SELECT `StudentNo`,`StudentName` FROM student
WHERE `StudentName` LIKE '%d_';

-- 查询1000,1001学员
SELECT `StudentNo`,`StudentName` FROM student
WHERE `StudentNo` IN (1000,1001);
```

## Group query

`语法`：

```sql
select 分组函数，分组后的字段
from 表
【where 筛选条件】
group by 分组的字段
【having 分组后的筛选】
【order by 排序列表】
```

`区别`：

| | table filtered using keywords | location |
| ---------- | ---------- | ---------- | --------------- |
| Filter before grouping | where | original table | before group by |
| Filtering after grouping | having | results after grouping | behind group by |

```sql
-- 查询不同科目的平均分、最高分、最低分且平均分大于90
-- 核心：根据不同的课程进行分组
SELECT SubjectName,AVG(StudentResult),MAX(`StudentResult`),MIN(`StudentResult`)
FROM result r
INNER JOIN `subject` s
on r.SubjectNo=s.SubjectNo
GROUP BY r.SubjectNo
HAVING AVG(StudentResult)>90;
```

## Connection query

![image-20200718231304641](https://img-blog.csdnimg.cn/img_convert/6354aff6ecaee8ec2f2f7ec065304889.png)

```sql
-- 查询学员所属的年级（学号，学生姓名，年级名称）
SELECT `StudentNo`,`StudentName`,`GradeName`
FROM student s
INNER JOIN grade g
ON s.GradeID=g.GradeID;

-- 查询科目所属的年级
SELECT `SubjectName`,`GradeName`
FROM `subject` s
INNER JOIN `grade` g
ON s.GradeID=g.GradeID;

-- 查询列参加程序设计考试的同学信息（学号，姓名，科目名，分数）
SELECT s.`StudentNo`,`StudentName`,`SubjectName`,`StudentResult`
FROM student s
INNER JOIN result r
on s.StudentNo=r.StudentNo
INNER JOIN `subject` sub
on r.SubjectNo=sub.SubjectNo
where SubjectName='课程设计';
```

> **Self link**

Your own table and your own table link, core: **One table can be split into two identical tables**

```sql
-- 创建一个表
CREATE TABLE `course` (
`courseid` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '课程id',
`pid` INT(10) NOT NULL COMMENT '父课程id',
`courseName` VARCHAR(50) NOT NULL COMMENT '课程名',
PRIMARY KEY (`courseid`)
) ENGINE=INNODB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8

-- 插入数据
INSERT INTO `course` (`courseid`, `pid`, `courseName`)
VALUES('2','1','信息技术'),
('3','1','软件开发'),
('4','3','数据库'),
('5','1','美术设计'),
('6','3','web开发'),
('7','5','ps技术'),
('8','2','办公信息');
```

Split the table:

| pid (parent course id) | courseid (course id) | courseName (course name) |
| --------------- | ------------------ | ------------------ |
| 1 | 2 | Information Technology |
| 1 | 3 | Software Development |
| 1 | 5 | Art Design |

| pid (parent course id) | courseid (course id) | courseName (course name) |
| --------------- | ------------------ | ------------------ |
| 2 | 8 | Office Information |
| 3 | 4 | Database |
| 3 | 6 | web development |
| 5 | 7 | ps technology |

**Operation**: Query the subclass relationship corresponding to the parent class

| Parent class | Subclass |
| ---------- | ------------------- |
| Information Technology 2 | Office Information 4 |
| Software development 3 | Database 4, web development 6 |
| Art Design 5 | PS Technology 7 |

```sql
SELECT a.`courseid` AS '父课程',b.`courseid` AS '子课程'
FROM course AS a,course AS b
WHERE a.`courseid`=b.`pid`;
```

![image-20200719105147906](https://img-blog.csdnimg.cn/img_convert/149c6d4bfdaea45e0a66af888e3f304c.png)

## Sorting and paging

> **Sort**

`语法`：

```sql
select 查询列表
from 表
where 筛选条件
order by 排序列表 asc/desc
```

- The position of order by is generally placed at the end of the query statement (except for the limit statement)

| asc: | Ascending order, if not written, the default ascending order |
| ---------- | ----------------------- |
| **desc:** | **descending** |

```sql
SELECT `StudentNo`,`StudentName`,`GradeName`
FROM student s
INNER JOIN grade g
ON s.GradeID=g.GradeID
ORDER BY `StudentNo` DESC;
```

> **Page**

`语法`：

```sql
select 查询列表
from 表
limit offset,pagesize;
```

- offset represents the starting entry index, starting from 0 by default
- size represents the number of items displayed
- offset=(n-1)*pagesize

```sql
-- 第一页 limit 0 5
-- 第二页 limit 5,5
-- 第三页 limit 10,5
-- 第n页  limit (n-1)*pagesize,pagesize
-- pagesize:当前页面大小
-- (n-1)*pagesize:起始值
-- n:当前页面
-- 数据总数/页面大小=总页面数
-- limit n 表示从0到n的页面
```

## Subquery

A subquery statement is nested in the ``本质``在`where` clause

```sql
-- 查询‘课程设计’的所有考试结果（学号，科目编号，成绩）降序排列

-- 方式一:使用连接查询
SELECT `StudentNo`,r.`SubjectNo`,`StudentResult`
FROM result r
INNER JOIN `subject` s
on r.StudentNo=s.SubjectNo
WHERE SubjectName='课程设计'
ORDER BY StudentResult DESC;
-- 方式二:使用子查询（由里到外）
SELECT StudentNo,SubjectNo,StudentResult
from result
WHERE SubjectNo=(
	SELECT SubjectNo FROM `subject`
	WHERE SubjectName='课程设计'
)
```

## MySQL function

### Commonly used functions

```sql
-- 数学运算
SELECT ABS(-8); -- 绝对值
SELECT CEIL(5.1); -- 向上取整
SELECT CEILING(5.1); -- 向上取整
SELECT RAND(); -- 返回0~1之间的一个随机数
SELECT SIGN(-10); -- 返回一个数的符号;0返回0;正数返回1;负数返回-1

-- 字符串函数
SELECT CHAR_LENGTH('我喜欢你'); -- 字符串长度
SELECT CONCAT('我','喜欢','你'); -- 拼接字符串
SELECT INSERT('我喜欢',1,1,'超级') -- INSERT(str,pos,len,newstr) 从str的pos位置开始替换为长度为len的newstr
SELECT UPPER('zsr'); -- 转大写
SELECT LOWER('ZSR'); -- 转小写
SELECT INSTR('zsrs','s'); -- 返回第一次出现字串索引的位置
SELECT REPLACE('加油就能胜利','加油','坚持'); -- 替换出现的指定字符串
SELECT SUBSTR('坚持就是胜利',3,6); -- 返回指定的字符串(源字符串,截取位置,截取长度)
SELECT REVERSE('rsz'); -- 反转字符串

-- 时间日期函数
SELECT CURRENT_DATE(); -- 获取当前日期
SELECT CURDATE(); -- 获取当前日期
SELECT now(); -- 获取当前时间
SELECT LOCALTIME(); -- 本地时间
SELECT SYSDATE(); -- 系统时间

SELECT YEAR(NOW());
SELECT MONTH(NOW());
SELECT DAY(NOW());
SELECT HOUR(NOW());
SELECT MINUTE(NOW());
SELECT SECOND(NOW());

-- 系统信息
SELECT SYSTEM_USER();
SELECT USER();
SELECT VERSION();
```

### Aggregation function

| function | description |
| ----- | -------- |
| max | maximum value |
| min | minimum value |
| sum | and |
| avg | average |
| count | Count the number |

```sql
SELECT COUNT(StudentName) FROM student; 
SELECT COUNT(*) FROM student;
SELECT COUNT(1) FROM student;

SELECT SUM(`StudentResult`) FROM result;
SELECT AVG(`StudentResult`) FROM result;
SELECT MAX(`StudentResult`) FROM result;
SELECT MIN(`StudentResult`) FROM result;
```

# Database level MD5 encryption

> **MD5 Message-Digest Algorithm** (MD5 Message-Digest Algorithm)

- MD5 is improved from MD4, MD3, and MD2, mainly to enhance algorithm complexity and irreversibility
- The principle of MD5 cracking website, there is a dictionary behind it, the value after MD5 encryption, the value before encryption

```sql
CREATE TABLE `testMD5`(
	`id` INT(4) NOT NULL,
	`name` VARCHAR(20) NOT NULL,
	`pwd` VARCHAR(50) NOT NULL,
	PRIMARY KEY(`id`)
)ENGINE=INNODB DEFAULT CHARSET =utf8;

-- 明文密码
INSERT INTO `testMD5` VALUES(1,'zsr','200024'),
(2,'gcc','000421'),(3,'bareth','123456');

-- 加密
UPDATE `testMD5` SET `pwd`=MD5(pwd) WHE RE id=1;
UPDATE `testMD5` SET `pwd`=MD5(pwd); -- 加密全部的密码

-- 插入的时候加密
INSERT INTO `testMD5` VALUES(4,'barry',MD5('654321'));

-- 如何校验:将用户传递进来的密码，进行MD5加密，然后对比加密后的值
SELECT * FROM `testMD5` WHERE `name`='barry' AND `pwd`=MD5('654321');
```

# Transaction

> **Either both succeed or both fail**

```sql
SQL执行：A转账给B
SQL执行：B收到A的钱
```

Put a set of SQL in a batch to execute

- For example, bank transfer: the event will only end if A transfer is successful and B is successfully received. If one party is unsuccessful, the transaction is unsuccessful.

## Transaction Principle: ACID

Reference link: https://blog.csdn.net/dengjili/article/details/82468576

| Name | Description |
|-------------------------|------------------------------------------------------------------|
| **Atomicity** | Atomicity means that a transaction is an indivisible unit of work, and operations in a transaction either all occur or none occur. |
| **Consistency** | The integrity of data before and after a transaction must be consistent.                           |
| **Isolation** | The isolation of transactions means that when multiple users access the database concurrently, the transactions opened by the database for each user cannot be interfered by the operation data of other transactions, and multiple concurrent transactions must be isolated from each other. |
| **Durability** | Once a transaction is committed, it is irreversible and is persisted to the database. Even if the database fails, it should not have any impact |

------

## Problems caused by transaction concurrency

> Some problems caused by isolation:

| Name | Description |
| -------------- | --------------------------------------------------------------- |
| **Dirty Read** | Refers to one transaction reading uncommitted data from another transaction.                   |
| **Non-repeatable read** | Read a certain row of data in the table within a transaction, and the results of multiple reads will be different.         |
| **Virtual reading (phantom reading)** | refers to reading data inserted by another transaction within a transaction, resulting in inconsistent reading. |

------

## Isolation level

> In database operations, in order to effectively ensure the correctness of concurrently read data, the proposed **Transaction Isolation Level**

- **Read Uncommitted**: One transaction reads uncommitted data from other transactions; under this isolation level, the query will not be locked, and the consistency is the worst, causing `脏读`, `不可重复读`, and `幻读` problems.

- **Read Committed**: A transaction can only read data that has been submitted by other transactions; this isolation level avoids the `脏读` problem, but the `不可重复读` and `幻读` problems still exist;

The read-commit transaction isolation level is the default transaction isolation level of most popular databases, such as Oracle, but is not the default isolation level of MySQL.

- **Repeatable Read**: During the execution process, a transaction can read newly inserted data that has been submitted by other transactions, but it cannot read the modifications to the data by other transactions, which means that the results of reading the same record multiple times are the same; this level avoids the problems of `脏读` and `不可重复度`, but it still cannot avoid the problem of `幻读`

Repeatable read is the default isolation level of MySQL

- **Serialization**: Transactions are executed serially. Transactions can only be executed one after another, and updates made to data by other transactions cannot be seen at all during the execution process. The disadvantage is poor concurrency and the strictest transaction isolation, which is fully in line with ACID principles, but has a greater impact on performance.

| **Transaction Isolation Level** | **Dirty Read** | **Non-Repeatable Read** | **Phantom Read** |
| ---------------------------- | -------- | --------------- | -------- |
| read-uncommitted | yes | yes | yes |
| read-committed | no | yes | yes |
| repeatable-read | no | no | yes |
| Serializable | No | No | No |

## The process of executing transactions

1️⃣ **Turn off automatic submission**

```sql
SET autocommit=0; 
```

2️⃣ **Transaction starts**

```sql
START TRANSACTION -- 标记一个事务的开始，从这个之后的sql都在同一个事务内
```

3️⃣ **Submit if successful, rollback if failed**

```sql
-- 提交：持久化（成功）
COMMIT
12
-- 回滚：回到原来的样子（失败）
ROLLBACK
```

4️⃣ **Transaction ends**

```sql
SET autocommit=1; -- 开启自动提交
```

5️⃣ **Other operations**

```sql
SAVEPOINT 保存点名; -- 设置一个事务的保存点
ROLLBACK TO SAVEPOINT 保存点名; -- 回滚到保存点
RELEASE SAVEPOINT 保存点名; -- 撤销保存点
```

# index

Recommended reading: [Data structure and algorithm principles behind MySQL index](http://blog.codinglabs.org/articles/theory-of-mysql-index.html)

> Index (`Index`) is a **data structure** that helps MySQL obtain data efficiently.

- Improve query speed
- Ensure data uniqueness
- Can speed up the connection between tables and achieve referential integrity between tables
- When using grouping and sorting clauses for data retrieval, the time of grouping and sorting can be significantly reduced
- Full text search fields for search optimization

------

## Index classification

```sql
-- 创建学生表student
CREATE TABLE `student`(	
	`StudentNo` INT(4) NOT NULL COMMENT '学号',
	`LoginPwd` VARCHAR(20) DEFAULT NULL,
	`StudentName` VARCHAR(20) DEFAULT NULL COMMENT '学生姓名',
	`Sex` TINYINT(1) DEFAULT NULL COMMENT '性别,取值0或1',
	`GradeID` INT(11) DEFAULT NULL COMMENT '年级编号',
	`Phone` VARCHAR(50) NOT NULL COMMENT '联系电话,允许为空,即可选输入',
	`Adress` VARCHAR(255) NOT NULL COMMENT '地址,允许为空,即可选输入',
	`BornDate` DATETIME DEFAULT NULL COMMENT '出生时间',
	`Email` VARCHAR(50) NOT NULL COMMENT '邮箱账号,允许为空,即可选输入',
	`IdentityCard` VARCHAR(18) DEFAULT NULL COMMENT '身份证号',
	PRIMARY KEY (`StudentNo`),
	UNIQUE KEY `IdentityCard` (`IdentityCard`),
	KEY `Email` (`Email`)
)ENGINE=MYISAM DEFAULT CHARSET=utf8;
```

### Primary key index (PRIMARY KEY)

Unique identification, primary key cannot be repeated, only one column is used as the primary key

- The most common index type, null values are not allowed
- Ensure the uniqueness of data records
- Determine where specific data records are located in the database

```sql
-- 创建表的时候指定主键索引
CREATE TABLE tableName(
  ......
  PRIMARY INDEX (columeName)
)

-- 修改表结构添加主键索引
ALTER TABLE tableName ADD PRIMARY INDEX (columnName)
```

------

### Ordinary index (KEY / INDEX)

Default, quickly locate specific data

- Both index and key keywords can set regular indexes
- Fields that should be added to the search criteria
- It is not advisable to add too many regular indexes, which will affect the insertion, deletion and modification operations of data.

```sql
-- 直接创建普通索引
CREATE INDEX indexName ON tableName (columnName)

-- 创建表的时候指定普通索引
CREATE TABLE tableName(
  ......
  INDEX [indexName] (columeName)
)

-- 修改表结构添加普通索引
ALTER TABLE tableName ADD INDEX indexName(columnName)
```

------

###Unique index (UNIQUE KEY)

It is similar to the previous ordinary index, except that the value of the index column must be unique, but null values ​​are allowed.

The difference from primary key index: there can only be one primary key index, and there can be multiple unique indexes.

```sql
-- 直接创建唯一索引
CREATE UNIQUE INDEX indexName ON tableName(columnName)

-- 创建表的时候指定唯一索引
CREATE TABLE tableName(  
	......
	UNIQUE INDEX [indexName] (columeName)  
);  

-- 修改表结构添加唯一索引
ALTER TABLE tableName ADD UNIQUE INDEX [indexName] (columnName)
```

------

### Full text index (FULLText)

Quickly locate specific data (Baidu search is full-text index)

- Available under specific database engines: MyISAM
- Can only be used for CHAR, VARCHAR, and TEXT data column types
- Suitable for large data sets

```sql
-- 增加一个全文索引
ALTER TABLE `student` ADD FULLTEXT INDEX `StudentName`(`StudentName`);

-- EXPLAIN 分析sql执行的情况
EXPLAIN SELECT * FROM student; -- 非全文索引
EXPLAIN SELECT * FROM student WHERE MATCH(StudentName) AGAINST('d'); -- 全文索引
```

## Usage of index

### Index creation

- Add indexes to fields when creating tables

```sql
CREATE TABLE 表名 (
    字段名1 数据类型 [完整性约束条件…],
    字段名2 数据类型 [完整性约束条件…],
    [UNIQUE|FULLTEXT|SPATIAL] INDEX|KEY [索引名] (字段名[(长度)] [ASC |DESC])
);
```

- After creation, add index

```sql
-- 方法一：CREATE在已存在的表上创建索引
       CREATE [UNIQUE|FULLTEXT|SPATIAL] INDEX 索引名
       ON 表名 (字段名[(长度)] [ASC |DESC]) ;

-- 方法二：ALTER TABLE在已存在的表上创建索引
       ALTER TABLE 表名 ADD [UNIQUE|FULLTEXT|SPATIAL] 
       INDEX 索引名 (字段名[(长度)] [ASC |DESC]) ;
```

### Index deletion

```sql
-- 删除索引
	DROP INDEX 索引名 ON 表名;
-- 删除主键索引
	ALTER TABLE 表名 DROP PRIMARY KEY;
```

### Display index information

```sql
SHOW INDEX FROM 表名;
```

### explain analysis of sql execution

```sql
-- 增加一个全文索引
ALTER TABLE `student` ADD FULLTEXT INDEX `StudentName`(`StudentName`);

-- EXPLAIN 分析sql执行的情况
EXPLAIN SELECT * FROM student; -- 非全文索引
EXPLAIN SELECT * FROM student WHERE MATCH(StudentName) AGAINST('d'); -- 全文索引
```

------

## Test index

**Create table app_user:**

```sql
CREATE TABLE `app_user` (
    `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(50) DEFAULT '' COMMENT '用户昵称',
    `email` varchar(50) NOT NULL COMMENT '用户邮箱',
    `phone` varchar(20) DEFAULT '' COMMENT '手机号',
    `gender` tinyint(4) unsigned DEFAULT '0' COMMENT '性别（0:男；1：女）',
    `password` varchar(100) NOT NULL COMMENT '密码',
    `age` tinyint(4) DEFAULT '0' COMMENT '年龄',
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATECURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='app用户表'
```

**Batch insert data: 100w**

```sql
-- 1418错解决方案(创建函数前执行此语句)
set global log_bin_trust_function_creators=true;

-- 插入100万条数据
DELIMITER $$	-- 写函数之前要写的标志
CREATE FUNCTION mock_data()	-- 创建mock_data()函数
RETURNS INT
BEGIN
	DECLARE num INT DEFAULT 1000000;
	DECLARE i INT DEFAULT 0;
	WHILE i < num DO
  		INSERT INTO app_user(`name`, `email`, `phone`, `gender`, `password`, `age`)
   		VALUES(CONCAT('用户', i), '24736743@qq.com', CONCAT('18', FLOOR(RAND()*(999999999-100000000)+100000000)),FLOOR(RAND()*2),UUID(), FLOOR(RAND()*100));
  		SET i = i + 1;
	END WHILE;
	RETURN i;
END;

-- 执行函数
SELECT mock_data();
```

![image-20210327101253258](https://img-blog.csdnimg.cn/img_convert/df271eca3feb9ab506aaed611ef6f087.png)
![image-20210327101316627](https://img-blog.csdnimg.cn/img_convert/2d3b3bfa01475754f69c4386a214a73a.png)

**Test query speed**

```sql
-- 查询用户名为'用户9999'性能分析
EXPLAIN SELECT * FROM app_user where name='用户99999'
```

![image-20210327101912627](https://img-blog.csdnimg.cn/img_convert/70f2c32ec8c3bbdf6ea0c922108f8d8c.png)

**Test after adding index**

```sql
-- 给name列创建常规索引
CREATE INDEX id_app_user_name ON app_user(`name`)
-- 再测试
EXPLAIN SELECT * FROM app_user where name='用户99999'
```

![image-20210327102830560](https://img-blog.csdnimg.cn/img_convert/cd50fa7b12a659d31ffc32e0ef15e20f.png)
Comparing the two results, the speed has been greatly improved.

------

## Indexing principles

- The more indexes, the better. Tables with small data volumes do not need to be indexed.
- Do not add indexes to frequently changing data
- Indexes are generally added to columns that are frequently queried

------

# explain keyword

**Suggested Reading**:

- [MySQL optimization - understand the explain](https://blog.csdn.net/jiadajing267/article/details/81269067)
- [MySQL Advanced Explain Execution Plan Detailed Explanation](https://blog.csdn.net/wuseyukui/article/details/71512793?dist_request_id=&depth_1-)

------

# Permission management and backup

## User management

**Method 1: Visual management**
![image-20210327123000095](https://img-blog.csdnimg.cn/img_convert/26c44c01a054ac4476a6cb2eafb768ff.png)

------

**Method 2: SQL command operation**

> User information is stored in the `user` table in the `mysql` database. The essence of user management is to add, delete, modify and check this table.
>
> ![image-20210327123240942](https://img-blog.csdnimg.cn/img_convert/134b75187269c5e003fd98902cfc959e.png)

```sql
-- 创建用户
CREATE USER zsr IDENTIFIED BY '123456'

-- 删除用户
DROP USER zsr

-- 修改当前用户密码
SET PASSWORD = PASSWORD('200024')

-- 修改指定用户密码
SET PASSWORD FOR zsr = PASSWORD('200024')

-- 重命名
RENAME USER zsr to zsr2

-- 用户授权(授予全部权限,除了给其他用户授权)
GRANT ALL	PRIVILEGES on *.* TO zsr2

-- 查询权限
SHOW GRANTS FOR zsr
-- 查看root用户权限
SHOW GRANTS FOR root@localhost

-- 撤销权限
REVOKE ALL PRIVILEGES ON *.* FROM zsr
```

------

## Database backup

Ensure that important data is not lost and data is escaped

> **Method 1**: Directly copy the physical file, and the MySQL data table is stored on the disk as a file

-Including table files, data files, and database option files

- Location: `Mysql安装目录\data\` (the directory name corresponds to the database name, and the file name in this directory corresponds to the data table)

  ![image-20210327125528006](https://img-blog.csdnimg.cn/img_convert/7e7cc8befc1537b12c9f7dfd10279114.png)

> **Method 2**: Visual management

Navicat opens the database to be backed up, and then click New Backup
![image-20210327125911151](https://img-blog.csdnimg.cn/img_convert/e4240bd95dec14b565b1d86cb1c5c915.png)
Click Object Selection. Here you can customize the table to be selected for backup.
![image-20210327130024058](https://img-blog.csdnimg.cn/img_convert/3e6c95e2806746c38d0e8627682f6163.png)
After selecting, click Backup to start the backup
![image-20210327130134693](https://img-blog.csdnimg.cn/img_convert/8f920ac3f3ad125e54e4f3f10328cbee.png)
![image-20210327130213947](https://img-blog.csdnimg.cn/img_convert/eeaeff9e0dd440f6dc4df763f5804845.png)
Wait for the backup to complete, close it, and then you can see the backed up files
![image-20210327130245251](https://img-blog.csdnimg.cn/img_convert/056debcb95166ac3195a993db6a9b63b.png)

> **Method Three**: Visual Management

Select the table to be exported and right-click to dump the SQL file
![image-20210327131239931](https://img-blog.csdnimg.cn/img_convert/da7feae09141b97f48ef3133a7385baa.png)
Then you can get the `.sql` file
![image-20210327131430300](https://img-blog.csdnimg.cn/img_convert/4d4c9b1c3da14f4fccaf7e4ad0b5c6f5.png)

> **Method 4**: Command `mysqldump` to export

```shell
# mysqldump -h主机 -u用户名 -p密码 数据库 [表1 表2 表3] >物理磁盘位置/文件名

# 导出school数据库的cource grade student表到D:/school.sql
mysqldump -hlocalhost -uroot -p200024 school course grade student >D:/school.sql
```

![image-20210327132011402](https://img-blog.csdnimg.cn/img_convert/5443e1fbd169e2c1e387cb4da76d0b8e.png)
Then you can see the exported `sql` file
![image-20210327132043857](https://img-blog.csdnimg.cn/img_convert/4f8735b65d95ecd8db7fcdb3da763e4f.png)
Then you can log in to mysql from the command line, switch to the specified database, and import using the `source` command
![image-20210327132439737](https://img-blog.csdnimg.cn/img_convert/17b6a505af032cce78c98488f1baa215.png)

------

#Three major paradigms

> **Normalization Theory**: Transform the relationship model and eliminate inappropriate data dependencies by decomposing the relationship model to solve the problems of insertion anomalies, deletion anomalies, update anomalies and data redundancy.
>
> In order to establish a database with less redundancy and reasonable structure, certain standardization theories must be followed when designing the database. In relational databases this kind of rule is called `范式`

[Popular understanding of the three paradigms](https://www.cnblogs.com/wsg25/p/9615100.html)

- If all attributes of a relational schema R are indivisible data items, then R belongs to `第一范式`
- If the relational schema R belongs to the first normal form and each non-primary attribute is completely functionally dependent on the code, then R belongs to `第二范式`
- If the relational schema R belongs to the second normal form, and all non-primary attributes in R are directly dependent on the code, then R belongs to `第三范式`

![image-20210325220605636](https://gitee.com/zhong_siru/images/raw/master//img/image-20210325220605636.png)

**Normative Questions**:

> The paradigm of the database is to standardize the design of the database, but in practice, issues such as performance, cost, and user experience are often more important than standardization;
>
> Therefore, sometimes a redundant field is deliberately added to some tables to turn multi-table queries into single-table queries. Sometimes some calculated columns are added to change the amount of data from large to small (when the amount of data is large, count(*) is very time-consuming, you can directly add a column, +1 for each additional row, just check the column); Alibaba has also proposed that the tables for related queries should not exceed three tables at most.
>
> These are examples of giving up certain norms for performance and cost.

------

# Database driver and JDBC

> The program we write will interact with the database through **database driver**
>
>
>
> Then different databases have different drivers, which is not convenient for our programs to operate various databases; therefore, in order to simplify the operation of different databases, SUN provides a Java specification for operating databases`JDBC`; the specifications of different databases are completed by the corresponding database manufacturers. For developers, they only need to master the operation of the JDBC interface.

## The first JDBC program

1️⃣ **Create a new empty project**

![image-20210327153130998](https://img-blog.csdnimg.cn/img_convert/2a6f4995962d7719b5f341ac0d2bfabe.png)

2️⃣ **Import mysql-connector-java**

Create a new `lib` directory under the project directory and put it in the jar package
![image-20210327153240818](https://gitee.com/zhong_siru/images/raw/master//img/image-20210327153240818.png)
![image-20210327153343389](https://img-blog.csdnimg.cn/img_convert/44dc09d9bf971bd3dc0c72cfe8aab10d.png)
![image-20210327153457419](https://img-blog.csdnimg.cn/img_convert/8b6b89c5197b0356215aa9aed1cbd964.png)

3️⃣ **Write code & test**

Create a new `JDBCDemo` in the `src` directory to operate the database

```java
import java.sql.*;

public class JDBCDemo {
    public static void main(String[] args) throws ClassNotFoundException, SQLException {
        //1.加载驱动
        Class.forName("com.mysql.cj.jdbc.Driver");
        //2.连接信息url,用户信息
        String url = "jdbc:mysql://localhost:3306/school?useUnicode=true&characterEncoding=utf8&useSSL=true&serverTimezone=UTC";
        String username = "root";
        String password = "200024";
        //3.连接,获得数据库对象connection
        Connection connection = DriverManager.getConnection(url, username, password);
        //4.获取执行sql的对象
        Statement statement = connection.createStatement();
        //5.执行sql
        String sql = "select * from app_user where id<10";
        ResultSet resultSet = statement.executeQuery(sql);
        while (resultSet.next()) {
            System.out.println("id:" + resultSet.getObject("id") + "phone:" + resultSet.getObject("phone"));
        }
        //6.释放连接
        resultSet.close();
        statement.close();
        connection.close();
    }
}
```

![image-20210327155209907](https://img-blog.csdnimg.cn/img_convert/30ae5d967e49cdbf74b4677938952fc1.png)

------

## JDBC Object

### DriverManager

> **DriverManager**: driver management

```java
//1.加载驱动
Class.forName("com.mysql.cj.jdbc.Driver");
```

Essentially execute `DriverManager.registerDriver(new com.mysql.cj.jdbc.Driver());`

![image-20210327161110925]()

```java
//3.连接,获得数据库对象connection
Connection connection = DriverManager.getConnection(url, username, password);
```

`connection` represents the database, so you can set up automatic transaction submission, transaction rollback, etc.

![image-20210327161507445](https://img-blog.csdnimg.cn/img_convert/3e5b382f0710809439ab5f7cee170872.png)

------

### Statement

> **Statement**: The object that executes sql, used to send SQL statements to the database. If you want to complete the addition, deletion, modification and query of the database, you only need to send the addition, deletion, modification and query statement to the database through this object.

```java
statement.executeQuery();//查询操作,返回结果
statement.execute();//执行sql
statement.executeUpdate();//用于增删改,返回受影响的行数
```

![image-20210327162622201](https://img-blog.csdnimg.cn/img_convert/aa5a397f6e2e376c7e16dbba106e88b6.png)
![image-20210327162705203](https://img-blog.csdnimg.cn/img_convert/c4587e04579f25dc58864ccfed3184f4.png)

------

### ResultSet

> **ResultSet**: The result set of the query, which encapsulates the results of all queries

![image-20210327162307420](https://img-blog.csdnimg.cn/img_convert/ac1a33619a7021011df6025a57f18ec3.png)

------

## 3. Encapsulate jdbc tool class

### Write database configuration file

Create a new `db.properties` in the `src` directory to store database configuration information
![image-20210327165924876](https://img-blog.csdnimg.cn/img_convert/aa2ecaf2738632a4b75d2c70e417f8c1.png)

```properties
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/school?useUnicode=true&characterEncoding=utf8&useSSL=true&serverTimezone=UTC
username=root
password=200024
```

------

### Writing tool classes

Then create `JDBCUtils.java` in the `src` directory as a tool class

```java
import java.io.InputStream;
import java.sql.*;
import java.util.Properties;

public class JDBCUtils {
    private static String driver = null;
    private static String url = null;
    private static String username = null;
    private static String password = null;

    static {
        try {
            InputStream inputStream = JDBCDemo.class.getClassLoader().getResourceAsStream("db.properties");
            Properties properties = new Properties();
            properties.load(inputStream);
            driver = properties.getProperty("driver");
            url = properties.getProperty("url");
            username = properties.getProperty("username");
            password = properties.getProperty("password");
            //加载驱动
            Class.forName(driver);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //获取连接
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }

    //释放连接资源
    public static void release(Connection connection, Statement statement, ResultSet resultSet) {
        if (resultSet != null) {
            try {
                resultSet.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if (statement != null) {
            try {
                statement.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
    }
}
```

------

### test

Modify`JDBCDemo`

```java
import java.sql.*;

public class JDBCDemo {
    public static void main(String[] args) throws SQLException {
        //获得数据库对象connection
        Connection connection = JDBCUtils.getConnection();
        //获取sql执行对象statement
        Statement statement = connection.createStatement();
        //执行sql
        String sql = "select * from app_user where id<10";
        ResultSet resultSet = statement.executeQuery(sql);
        while (resultSet.next()) {
            System.out.println("id:" + resultSet.getObject("id") + "phone:" + resultSet.getObject("phone"));
        }
        //释放连接
        JDBCUtils.release(connection, statement, resultSet);
    }
}
```

![image-20210327171418601](https://img-blog.csdnimg.cn/img_convert/d22fdb27412e8514d878f28053d4f820.png)

------

## SQL injection problem

> SQL injection happens when a [web application](https://baike.baidu.com/item/web应用程序/2498090) does not properly validate or filter user input. An attacker can append extra [SQL statements](https://baike.baidu.com/item/SQL语句/5714895) to a predefined query, tricking the [database server](https://baike.baidu.com/item/数据库服务器/613818) into executing unauthorized queries and exposing data.

**SQL injection case**: Pass in the user name in the main function and search for user information with the specified name

```java
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class SQLInjection {
    public static void main(String[] args) throws SQLException {
        searchName("' or '1=1");
    }

    //查找指定名字用户信息
    public static void searchName(String username) throws SQLException {
        //获得数据库对象connection
        Connection connection = JDBCUtils.getConnection();
        //获取sql执行对象statement
        Statement statement = connection.createStatement();
        //执行sql
        String sql = "select * from app_user where name='" + username + "'";
        ResultSet resultSet = statement.executeQuery(sql);
        while (resultSet.next()) {
            System.out.println("id:" + resultSet.getObject("id") + "phone:" + resultSet.getObject("phone"));
        }
        //释放连接
        JDBCUtils.release(connection, statement, resultSet);
    }
}
```

**Result**: All data in the database were queried
![image-20210327173159454](https://img-blog.csdnimg.cn/img_convert/fa46b5cd881946e10066ced5b621f8b7.png)
Here, an illegal string is passed in instead of a user name, but all the data is obtained. Why?

Splicing the entire sql statement is `select * from app_user where name=' ' or '1==1'`, of which `1==1` is always true, so the sql statement is equivalent to all the data in the query table; this is sql injection, mainly a problem caused by string splicing, which is very dangerous! !

------

## PreparedStatement object

> `PreparedStatement` is a subclass of `Statement`. Compared with it, it can prevent SQL injection and is more efficient.

Also test the sql injection case

```java
import java.sql.*;

public class SQLInjection {
    public static void main(String[] args) throws SQLException {
        searchName("' 'or '1=1'");
    }

    //登录
    public static void searchName(String username) throws SQLException {
        //获得数据库对象connection
        Connection connection = JDBCUtils.getConnection();
        //获取sql执行对象preparedStatement(预编译sql,先写不执行,参数用?表示)
        PreparedStatement preparedStatement = connection.prepareStatement("select * from app_user where name=?");
        //手动传参
        preparedStatement.setString(1, username);
        //执行sql
        ResultSet resultSet = preparedStatement.executeQuery();
        while (resultSet.next()) {
            System.out.println("id:" + resultSet.getObject("id") + "phone:" + resultSet.getObject("phone"));
        }
        //释放连接
        JDBCUtils.release(connection, preparedStatement, resultSet);
    }
}
```

![image-20210327180032468](https://img-blog.csdnimg.cn/img_convert/1a164b75b1a4e030974f32f4ed8cec42.png)
According to the results, the PreparedStatement object perfectly avoids sql injection problems

------

## Transaction case

First create the account table

```sql
CREATE TABLE account(
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(40),
	money FLOAT
);

INSERT INTO account(name,money) VALUES('A',1000);
INSERT INTO account(name,money) VALUES('B',1000);
INSERT INTO account(name,money) VALUES('C',1000);
```

![image-20210414235806762](https://img-blog.csdnimg.cn/img_convert/fb7a765f6b6d077503fb3ac8fe2971c7.png)
Then write Java code

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;

public class TestTransaction {
    public static void main(String[] args) throws SQLException {
        //获得数据库对象connection
        Connection connection = JDBCUtils.getConnection();
        //关闭数据库自动提交,即开启事务
        connection.setAutoCommit(false);
        String sql1 = "update account set money = money+100 where name = 'A' ";
        String sql2 = "update account set money = money-100 where name = 'B' ";
        //获取sql执行对象preparedStatement
        PreparedStatement preparedStatement = connection.prepareStatement(sql1);
        preparedStatement.executeUpdate();
        preparedStatement = connection.prepareStatement(sql2);
        preparedStatement.executeUpdate();
        //业务完毕,提交事务
        connection.commit();
        //释放资源
        JDBCUtils.release(connection, preparedStatement, null);
    }
}
```

Running results:
![image-20210414235836300](https://img-blog.csdnimg.cn/img_convert/61f641ba421658f8bcb574751954b9d4.png)
If you add `int x = 1 / 0` between two updates;

An error will be reported, the transaction execution will fail, and neither statement will be executed successfully.
![image-20210327212324221](https://img-blog.csdnimg.cn/img_convert/0db32304bfc44277ce777d5b68aedccd.png)

![image-20230618214249123](https://bangwu.oss-cn-shanghai.aliyuncs.com/img/202306182142257.png)
