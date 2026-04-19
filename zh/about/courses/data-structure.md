---
title: "数据结构与算法"
description: "数据结构与算法课程复习笔记，根据老师给出的考试重点整理，涵盖算法定义与时间空间复杂度分析、线性表顺序与链式存储操作、栈与队列经典应用场景、二叉树先序中序后序遍历方法、图的 BFS/DFS 搜索算法、冒泡快排归并等排序算法比较以及递归分治策略与代码题注释规范要求。"
icon: "sitemap"
---

<details>
    <summary>写在前面</summary>
数据结构与算法课程重点均由老师给出
<p>相关课件</p>👉<a href="https://alist.bangwu.top/%E9%98%BF%E9%87%8C%E4%BA%91-%E6%A3%92%E6%97%A0/%E8%AF%BE%E4%BB%B6/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95">地址</a>
</details>
# 数据结构与算法考试相关-2024

----------------------------------------

考试题型
一. 选择题（10分，5题，每题2分）
二. 填空题（15分，5题，每题3分）
三. 简答题（15分，3题，每题5分，要求尽量详细，逻辑清晰，层次分明）
四. 代码题（关键处请写注释；如果需要用所学的数据结构，可以不用定义，直接import使用；请注意代码规范）（60分，6题，每题10分）

* 出题思路：从以下重点中出相应的题目，然后再随机选择上述题型和数目，再做微调。

----------------------------------------

考试重点

## 第1章 绪论

1. 算法的定义    P8

   算法是具有有限步骤的过程，依照这个过程便能解决问题。因此算法就是解决方案。

2. 何谓编程    P13
   编程是指通过编程语言将算法编码以使其能被计算机执行的过程。

3. 编程语言的解释    P14-P15
   编程语言必须提供一种标记方式：用于表达数据和过程，为此，编程语言提供了众多的数据类型和控制语句。![bangwu_20240620164507](https://cdn.bangwu.top/img/bangwu_20240620164507.webp)

4. 数据抽象的定义    P20
   抽象数据类型（简称ADT）从逻辑上描述了如何看待数据及其对应运算而无须考虑具体实现，这意味着我们仅需要关心数据代表了什么。抽象数据类型的实现就是`数据结构`

## 第2章 Python基础

1. Python语言的基本情况    P5
   [Python](https://python.org)是龟叔于20世纪90年代开发的高级计算机语言，截至2024/06/20，python最新的一个大版本是3.12

2. Python解释器    P7
   Python解释器可以接收并执行收到的python命令，然后返回结果。IDE

3. Python的注释    P12

   ```python
   # 这段话被注释了
   这段没有被注释
   ```

4. Python的标识符和保留字    P17-P18
   标识符通常被称为`变量`，python中字母是大小写敏感的。**不能以数字开头**。![bangwu_20240620174921](https://cdn.bangwu.top/img/bangwu_20240620174921.webp)

5. Python的赋值语句    P21-P24
   赋值语句就是`=`，例如：

   ```python
   a = 1
   a += 1 # 是在已存在的对象名a 进行运算，并将新结果重新分配给a
   # 动态/可变 对象
   b = [1, 2, 3]
   c = b
   c[1] = 1
   print(b) # [1, 1, 3]
   ```

6. Python中可变的类和不可变的类    P33-P51
   这部分应该熟了，可以参考👉https://www.cnblogs.com/poloyy/p/15073168.html

7. Python的运算符    P54-P64

   ```python
   # 除了正常的加减乘除和逻辑非、与、或之外，值得注意的是相等运算符
   # is表示同一实体， ==是等价的意思
   a = [1, 2, 3]
   b = a[:]
   a == b # True
   a is b # False
   # 序列运算符
   [5, 6, 9] < [5, 7] # True, 因为所有序列规定的比较操作都是基于字典顺序，即元素一个接一个地比较
   ```

8. Python的输入和输出    P99-P105

   ```python
   print('hello', 1) # hello 1\n
   print('a', 'b', 'c', sep=';', end='@') # a;b;c@
   input()
   fp = open('sample.txt')
   ```

9. 迭代器和可迭代对象    P121
   可迭代对象：https://docs.pythontab.com/interpy/Generators/Iterable/

   ```python
   class Iterator:
       
       def __init__(self, squence):
           self._seq = squence
           self._index = -1
           
       def __next__(self):
           self._index += 1
           if self._index < len(self._seq):
               return self._seq[self._index]
           else:
               raise StopIteration()
           
       def __iter__(self):
           return self
       
       
   if __name__ == '__main__':
       a = Iterator([1, 2, 3, 4, 5])
       print(next(a), next(a))
       n = 2
       for i in a:
           print(i, end=' ')
           n += 1
   ```

   迭代器：https://docs.pythontab.com/interpy/Generators/Iterator/

   ```python
   # 任意对象，只要定义了__next__方法，它就是一个迭代器。
   class Iterator:
   
       def __next__(self):
           return self
       
   if __name__ == '__main__':
       print(Iterator()) # <__main__.Iterator object at 0x2753730>
   ```

10. 迭代器和生成器    P125
    生成器：https://docs.pythontab.com/interpy/Generators/Generators/

    ```python
    def generator_function():
        for i in range(10):
            yield i
    
    for item in generator_function():
        print(item, end='->')
    
    # Output: 0->1->2->3->4->5->6->7->8->9->
    ```

11. 一行写条件表达式    P129

    ```python
    love = 'Male' if male_age ==18 else None
    ```

12. 语法解析    P132

    ```python
    # 列表解析
    [ k∗k for k in range (1, n +1)]
    # 集合解析
    { k∗k for k in range (1, n +1)}
    # 生成器解析
    ( k∗k for k in range (1, n +1))
    # 字典解析
    { k: k∗k for k in range (1, n +1)}
    ```

13. 打包和解包    P134-P135

    ```python
    data = 1,2,3,4
    data
    # (1, 2, 3, 4)
    # return x, y 等价于 return (x, y)
    ```

    如果在大的上下文中给出了一系列逗号分隔的表达式，它们将被视为一个单独的元组，即使没有提供封闭的圆括号。这个过程就是`自动打包`。

    ```python
    a, b, c, d = range(7, 11)
    print(a ,b, c, d) # 7 8 9 10
    ```

    Python 允许单个标识符的一系列元素赋值给序列中的各个元素。右边的表达式可以是任何迭代类型，只要**左边的变量数等于右边选代的元素数**。这个过程就是`自动解包`。

14. 作用域和命名空间    P137-P140
    如果不太熟悉可以参考👉https://www.runoob.com/python3/python3-namespace-scope.html

## 第3章 面向对象编程

1. 面向对象的设计目标    P6
   面向对象设计目标有三个：

   - `健壮性`：能够处理未定义的异常输入
   - `适应性`：可移植的
   - `可重用性`：同样的代码可以用在不同系统的各种应用中

2. 面向对象的设计原则    P11

   - 模块化：把程序设计为一个个小方块，各方块相互独立
   - 抽象化：就是抽象
   - 封装：软件系统的不同组件不应显示其各自实现的内部细节。这点类似于黑盒子。

3. 抽象数据类型    P14
   ADT(Abstract Data Types)是数据结构的数学模型，它规定了**数据存储的类型**、**支持的操作**和**操作参数的类型**。

4. 封装的概念    P17
   同上述⬆️

5. 软件开发的三个主要阶段    P25
   设计->实现->测试和调试

6. UML图的内容    P31
   包含类名、实例变量、方法。

7. 编程风格（不会有专门的题，但编程题要符合该风格）    P35
   这个真喷不了，可以参考🤣：https://itniuma.com/article/2023.06/1.html

8. 如何做测试    P42
   类似之前的黑盒测试，`方法覆盖`和`语句覆盖`，python中可以参考：https://www.youtube.com/watch?v=5Md_3ZeuYPc

9. 如何做调试    P43
   最简单的print()或者用IDE中提供的Debugger可以更好地进行跟栈。

10. 运算符重载    P55，P58-P59
    Python中允许同一运算符根据上下文具有不同的含义，例：

    ```python
    1 + 1 # 加法
    'hello' + 'world' # 拼接运算符
    [1, 2] + [3, 4] # 合并两个列表
    ```

    但是对于上述的加法，应用于python内置类还行，自己定义的类是不能直接这样相加的。但可以通过定义来实现类的运算：

    ```python
    class Point:
        
        def __init__(self, x=0, y=0):
            self.x = x
            self.y = y
        # change add
        def __add__(self, other):
            return "Point(x:%d, y:%d)" % (self.x + other.x, self.y + other.y)
        # change print
        def __str__(self):
            return "Point(x:%s, y:%s)" % (self.x, self.y)
    ```

    ![bangwu_20240620190209](https://cdn.bangwu.top/img/bangwu_20240620190209.webp)

    ![bangwu_20240620190230](https://cdn.bangwu.top/img/bangwu_20240620190230.webp)

11. 继承的概念    P67
    在面向对象的编程中，模块化和层次化组织的机制称为继承。

    继承允许基于一个现有的类作为起点定义新的类。父类（又称为超类或基类）、子类。

    子类可以提供新的方法覆盖父类现有的方法，也可以提供全新的扩展方法

12. 抽象基类的概念    P77

    在经典的面向对象的术语中，如一个类的唯一目的是作为继承的基类，那么这个类就是一个抽象基类。例如鹦鹉和海鸥可以抽象出一个带有翅膀、会飞翔、有尖嘴....的一个动物，但没有具体的一个现实实例是这样的。

13. 类、对象、子类的命名空间    P80

    每个已定义的类都有一个单独的类命名空间。这个命名空间用于管理一个类的所有实例所共享的成员或没有引用任何特定实例的成员。

    ![bangwu_20240620191130](https://cdn.bangwu.top/img/bangwu_20240620191130.webp)

14. 判断深拷贝和浅拷贝    P82-P84
    参考👉：https://www.runoob.com/w3cnote/python-understanding-dict-copy-shallow-or-deep.html

## 第4章 算法分析

1. 什么是数据结构和算法    P9
   `数据结构`是组织和访问数据的一种系统化方式。

   `算法`是在有限的时间里一步步执行某些任务的过程。

2. 算法分析的维度    P9
   时间复杂度和空间复杂度

3. 影响算法运行时间的因素    P12
   除了算法本身，影响运行时间的其他因素：

   - 输入数据的大小
   - 硬件环境和软件环境
   - 程序是编译执行还是解释执行

4. 实验分析的挑战    P17
   很难直接比较两个算法的实验运行时间、实验只有在有限的一组测试输入下才能完成。

5. 如何分析算法效率    P19-P22
   计算原子操作、随着输入函数的变化进行测量操作、**最坏情况输入的研究**

6. 大O记法    P26-P27
   *O*(n)，相信你一定知道。

7. 8种函数    P29-P45

   常见时间复杂度从低到高排列有 𝑂(1)、𝑂(log⁡𝑛)、𝑂(𝑛)、𝑂(𝑛log⁡𝑛)、𝑂(𝑛2)、𝑂(2n) 和 𝑂(𝑛!) 等。

8. 列表的性能（不用区分n和k）    P47
   ![bangwu_20240620193018](https://cdn.bangwu.top/img/bangwu_20240620193018.webp)

9. 字典的性能    P49
   ![bangwu_20240620193052](https://cdn.bangwu.top/img/bangwu_20240620193052.webp)

10. 异序词检测问题的代码    P51-P58
    问题：如果一个字符串只是重排了另一个字符串的字符，那么这个字符串就是另一
    个的异序词，比如 heart 与 earth，以及 python 与 typhon。简化问题：两个字符串的长度相同，并且都由26个英文字母的小写组成。

    ```python
    words = ('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z')
    def solution(st1, st2): # O(n*log(n))
        if len(st1) == len(st2):
            for i in range(len(st1)):
                if st1[i] not in words or st2[i] not in words:
                    return False
            li1 = list(st1).sort()
            li2 = list(st2).sort()
            return li1 == li2
        else:
            return False
    
    def solution2(st1, st2): # O(n^2)
        if len(st1) == len(st2):
            for i in range(len(st1)):
                if st1[i] not in words or st2[i] not in words:
                    return False
            li2 = list(st2)
            for m in range(len(st1)):
                index = li2.index(st1[m])
                li2[index] = ''
            return ''.join(li2) == ''
        else:
            return False
        
    def solution3(st1, st2): # O(n)
        dic1 = {}
        dic2 = {}
        if len(st1) == len(st2):
            for i in range(len(st1)):
                dic1[st1[i]] = dic1.get(st1[i], 0) + 1
                dic2[st2[i]] = dic2.get(st2[i], 0) + 1
            return dic1 == dic2
        else:
            return False
    
    ```

## 第5章 递归

1. 递归的定义和三原则    P4
   `递归`定义：

   - 通过一个函数在执行过程中一次或多次调用其本身
   - 或者通过一种数据结构在其中表示依赖于相同类型的结构更小的实例

   递归三原则：

   - 递归算法必须有基本情况（即停止递归的条件——可直接解决的问题）
   - 递归算法必须改变其状态并向基本情况靠近；
   - 递归算法必须递归地调用自己

2. 计算一列数之和的递归解法    P9

   ```python
   def list_sum(num_list):
       if len(num_list) == 1:
           return num_list[0]
       else:
           return num_list[0] + list_sum(num_list[1:])
   ```

3. 阶乘的递归解法    P14

   ```python
   def factorial(n):
       if n == 0:
           return 1
       else:
           return n * factorial(n-1)
   ```

4. 将整数转换成任意进制字符串的递归解法    P20

   ```python
   def to_str(n, base):
       covert_string = '0123456789ABCDEF'
       if n < base:
           return covert_string[n]
       else:
           return to_str(n // base, base) + covert_string[n % base]
   ```

5. 二分查找    P25

   ```python
   def binary_search(data, target, low, high):
       if low > high:
           return False
       else:
           mid = (low + high) // 2
           if target == data[mid]:
               return True
           elif target < data[mid]:
               return binary_search(data, target, low, mid - 1)
           else:
               return binary_search(data, target, mid + 1, high)
   ```

6. 汉诺塔问题    P37-P42

   ```python
   def hannouta(n, A, B, C):
       if n == 1:
           print(A, '移到', C)
       else:
           hannuota(n-1, A, C, B)
           hannuota(1, A, B, C)
           hannuota(n-1, B, A, C)
   ```

## 第6章 基本数据结构

1. Python中的序列类型    P6
   `list`, `tuple`, `string`

2. 计算机中内存的存储和检索    P8
   计算机主存由`位`信息组成，这些`位`通常被归类成更大的单元，这些单元则取决于精准的系统架构。一个典型的单元就是一个字节，相当于8位。存储器(RAM)的任一单个字节被存储或检索的运行时间为*O*(1)。每个字节都被指定了连续的存储地址。

3. 理解列表和元组存放的是引用    P14-18

   ```python
   x = (1, 2, [3, 4])
   y = x
   y[2][0] = 10
   print(x)  # 输出 (1, 2, [10, 4])
   ```

   这段内容可以和深拷贝、浅拷贝一块理解。

4. 动态数组的实现    P27

   ```python
   import ctypes
   
   class DynamicArray:
       
       def __init__(self):
           self._n = 0
           self._capacity = 1
           self._A = self._make_array(self._capacity)
           
       def __len__(self):
           return self._n
       
       def __getitem__(self, k):
           if not 0 <= k < self._n:
               raise IndexError('invalid index')
           return self._A[k]
       
       def append(self, obj):
           if self._n == self._capacity:
               self._resize(2 * self._capacity)
           self._A[self._n] = obj
           self._n += 1
           
       def _make_array(self, c):
           return (c * ctypes.py_object)()
       
       def _resize(self, c):
           B = self._make_array(c)
           for k in range(self._n):
               B[k] = self._A[k]
           self._A = B
           self._capacity = c
           
       def remove(self, value):
           for k in range(self._n):
               if self._A[k] == value:
                   for j in range(k, self._n - 1):
                       self._A[j] = self._A[j + 1]
                   self._A[self._n - 1] = None
                   self._n -= 1
           raise ValueError('value not found')
       
       def insert(self, k, value):
           if self._n == self._capacity:
               self._resize(2 * self._capacity)
           for j in range(self._n, k, -1):
               self._A[j] = self._A[j - 1]
           self._A[k] = value
           self._n += 1
           
   if __name__ == '__main__':
       A = DynamicArray()
       A.append(1)
       print(A._capacity)
       A.append(2)
       A.append(3)
       print(A._capacity)
   ```

5. 二维数组的构建    P43-P46

   ```python
   # data = ([0] * c) * r 会得出[0,0,0,0]不是二维的
   # data = [[0] * c] * r 会构建出指向同一个[0]*c
   data = [[0] * c for j in range(r)]
   ```

6. 栈的定义    P50
   栈（stack）是一种遵循先入后出逻辑的线性数据结构。

7. 栈的抽象数据类型    P55-P56
   ![栈的先入后出规则](https://cdn.bangwu.top/img/stack_operations.png)

   | 方法   | 描述                   | 时间复杂度 |
   | ------ | ---------------------- | ---------- |
   | push() | 元素入栈（添加至栈顶） | *O*(1)     |
   | pop()  | 栈顶元素出栈           | *O*(1)     |
   | peek() | 访问栈顶元素           | *O*(1)     |

8. 栈的实现    P61

   ```python
   class ArrayStack:
       
       def __init__(self):
           self._stack = []
           
       def __len__(self):
           return len(self._stack)
       
       def __str__(self) -> str:
           return str(self._stack)
       
       def is_empty(self):
           return len(self) == 0
       
       def push(self, e):
           self._stack.append(e)
           
       def top(self):
           if self.is_empty():
               raise ValueError('Stack is empty')
           return self._stack[-1]
       
       def pop(self):
           if self.is_empty():
               raise ValueError('Stack is empty')
           return self._stack.pop()
   ```

9. 括号匹配的代码实现    P69

   ```python
   def is_matched(expr):
       lefty = '([{'
       righty = ')]}'
       S = ArrayStack()
       for c in expr:
           if c in lefty:
               S.push(c)
           elif c in righty:
               if S.is_empty():
                   return False
               if righty.index(c) != lefty.index(S.pop()):
                   return False
       return S.is_empty()
   ```

10. 标记语言的标签匹配的代码实现    P72

    ```python
    def is_matched_html(raw: str):
        S = ArrayStack()
        j = raw.find('<')
        while j != -1:
            k = raw.find('>', j+1)
            if k == -1:
                return False
            tag = raw[j+1:k]
            if not tag.startswith('/'):
                S.push(tag)
            else:
                if S.is_empty():
                    return False
                if tag[1:] != S.pop():
                    return False
            j = raw.find('<', k+1)
        return S.is_empty()
    ```

11. 十进制转换成任意进制数的代码实现    P75

    ```python
    def base_converter(dec_number, base):
        digits = "0123456789ABCDEF"
        rem_stack = ArrayStack()
        
        while dec_number > 0:
            rem = dec_number % base
            rem_stack.push(rem)
            dec_number = dec_number // base
            
        new_string = ""
        while not rem_stack.is_empty():
            new_string = new_string + digits[rem_stack.pop()]
            
        return new_string
    ```

12. 实现python的运算：先从中序转后序，再计算后序    P87，P93

    ```python
    # 这段大概率是不会出的
    from array_stack import ArrayStack
    import string
    
    def infix_to_post_fix(infix_expr):
        prec = {}
        prec["*"] = 3
        prec["/"] = 3
        prec["+"] = 2
        prec["-"] = 2
        prec["("] = 1
    
        op_stack = ArrayStack()
        post_fix_list = []
    
        token_list = infix_expr.split()
    
        for token in token_list:
            if token in string.ascii_uppercase:
                post_fix_list.append(token)
            elif token == "(":
                op_stack.push(token)
            elif token == ")":
                top_token = op_stack.pop()
                while top_token != "(":
                    post_fix_list.append(top_token)
                    top_token = op_stack.pop()
            else:
                while (not op_stack.is_empty()) and \
                    (prec[op_stack.top()] >= prec[token]):
                    post_fix_list.append(op_stack.pop())
                op_stack.push(token)
    
        while not op_stack.is_empty():
            post_fix_list.append(op_stack.pop())
    
        return " ".join(post_fix_list)
    
    
    if __name__ == "__main__":
        # infix_expr = "( A + B ) * ( C + D )"
        # infix_expr = "( A + B ) * C"
        infix_expr = "A + B * C"
        print(infix_to_post_fix(infix_expr))
    ```

13. 队列的定义    P95，P97

    队列（queue）是一种遵循先入先出规则的线性数据结构。顾名思义，队列模拟了排队现象，即新来的人不断加入队列尾部，而位于队列头部的人逐个离开。

14. 队列的抽象数据类型    P98
    ![队列的先入先出规则](https://cdn.bangwu.top/img/queue_operations.png)

    | 方法   | 描述                         | 时间复杂度 |
    | ------ | ---------------------------- | ---------- |
    | push() | 元素入队，即将元素添加至队尾 | *O*(1)     |
    | pop()  | 队首元素出队                 | *O*(1)     |
    | peek() | 访问队首元素                 | *O*(1)     |

15. 队列的实现    P101

    ```python
    class ArrayQueue:
        """FIFO Queue implementation using a Python list as underlying storage."""
    
        def __init__(self):
            """Create an empty queue."""
            self._data = []
    
        def __len__(self):
            """Return the number of elements in the queue."""
            return len(self._data)
    
        def is_empty(self):
            """Return True if the queue is empty."""
            return len(self._data) == 0
    
        def enqueue(self, e):
            """Add element e to the back of the queue."""
            self._data.append(e)  # new item stored at end of list
    
        def first(self):
            """Return (but do not remove) the element at the front of the queue.
    
            Raise Empty exception if the queue is empty.
            """
            if self.is_empty():
                raise Empty('Queue is empty')
            return self._data[0]  # the last item in the list
    
        def dequeue(self):
            """Remove and return the first element of the queue (i.e., FIFO).
    
            Raise Empty exception if the queue is empty.
            """
            if self.is_empty():
                raise Empty('Queue is empty')
            return self._data.pop(0)  # remove last item from list
    ```

16. 传土豆的代码实现    P105

    ```python
    def hot_potato(name_list, num):
        sim_queue = ArrayQueue()
        for name in name_list:
            sim_queue.enqueue(name)
    
        while len(sim_queue) > 1:
            for i in range(num):
                sim_queue.enqueue(sim_queue.dequeue())
            sim_queue.dequeue()
            print(sim_queue._data)
    
        return sim_queue.dequeue()
    
    
    if __name__ == "__main__":
        name_list = ['Bill', 'David', 'Susan', 'Jane', 'Kent', 'Bard']
        num = 6
        win = hot_potato(name_list, num)
        print(win)
    ```

17. 双端队列的定义    P107

    在队列中，我们仅能删除头部元素或在尾部添加元素。双向队列（double-ended queue）提供了更高的灵活性，允许在头部和尾部执行元素的添加或删除操作。

18. 双端队列的抽象数据类型    P108
    ![双向队列的操作](https://cdn.bangwu.top/img/deque_operations.png)

    | 方法名         | 描述             | 时间复杂度 |
    | -------------- | ---------------- | ---------- |
    | `push_first()` | 将元素添加至队首 | O(1)       |
    | `push_last()`  | 将元素添加至队尾 | O(1)       |
    | `pop_first()`  | 删除队首元素     | O(1)       |
    | `pop_last()`   | 删除队尾元素     | O(1)       |
    | `peek_first()` | 访问队首元素     | O(1)       |
    | `peek_last()`  | 访问队尾元素     | O(1)       |

19. 双端队列的实现    P110

    ```python
    class Deque:
        def __init__(self):
            self._data = []
    
        def __len__(self):
            return len(self._data)
    
        def is_empty(self):
            return len(self._data) == 0
    
        def add_first(self, e):
            self._data.insert(0, e)
    
        def add_last(self, e):
            self._data.append(e)
    
        def delete_first(self):
            if self.is_empty():
                raise Empty('Deque is empty')
            return self._data.pop(0)
    
        def delete_last(self):
            if self.is_empty():
                raise Empty('Deque is empty')
            return self._data.pop()
    
        def first(self):
            if self.is_empty():
                raise Empty('Deque is empty')
            return self._data[0]
    
        def last(self):
            if self.is_empty():
                raise Empty('Deque is empty')
            return self._data[-1]
    ```

20. 回文检测器的实现    P113

    ```python
    # 回文是指从前往后读和从后往前读是一样的。例如radar, toot
    def palchecker(a_string):
        print(a_string)
        char_deque = Deque()
    
        for ch in a_string:
            char_deque.add_last(ch)
    
        still_equal = True
    
        while len(char_deque) > 1 and still_equal:
            print(char_deque.first(), char_deque.last())
            first = char_deque.delete_first()
            last = char_deque.delete_last()
            if first != last:
                still_equal = False
    
        return still_equal
    
    
    if __name__ == "__main__":
        # a_string1 = 'lsdkjfskf'
        a_string1 = '上海自来水来自海上'
        print(palchecker(a_string1))
        a_string2 = 'TENET'
        print(palchecker(a_string2))
    ```

21. 列表的缺点    P115

    - 一个动态数组的长度可能超过实际存储数组元素所需的长度
    - 在实时系统中对操作的摊销边界是不可接受的
    - **在一个数组内部执行插入和删除操作的代价太高**

    <details>
        理解Python列表类的这三个缺点可以帮助我们更好地选择和使用数据结构。下面是对每个缺点的详细解释：

    1. **一个动态数组的长度可能超过实际存储数组元素所需的长度**

       动态数组（如Python中的列表）为了提高插入操作的效率，通常会预留一些额外的空间。这意味着数组的实际长度可能比当前存储的元素数量要大。这种做法可以减少频繁的内存分配和数据拷贝操作，但也会导致内存浪费。例如，如果你有一个包含10个元素的列表，底层数组可能已经分配了20个或更多的空间，以便为未来的插入操作预留空间。这种内存预分配机制虽然提高了性能，但在内存紧张的环境下可能会成为问题。

    2. **在实时系统中对操作的摊销边界是不可接受的**

       摊销分析（Amortized Analysis）是计算数据结构操作时间的一种方法，它将一系列操作的总成本平均分摊到每个操作上。对于动态数组来说，插入操作的摊销时间复杂度是 \(O(1)\)，但在最坏情况下（当数组需要扩展时），单次插入的时间复杂度可以达到 \(O(n)\)。在实时系统中，要求每个操作必须在严格的时间界限内完成，因此最坏情况的操作时间不可预测和不可接受。这意味着在实时系统中使用动态数组可能导致性能问题，因为你无法保证每个操作在规定时间内完成。

    3. **在一个数组内部执行插入和删除操作的代价太高**

       动态数组在内部执行插入和删除操作时，需要移动数组中的元素。例如，要在数组的开头插入一个新元素，所有现有元素都必须向后移动一个位置，这样的操作的时间复杂度是 \(O(n)\)。同样地，在数组中间删除一个元素也需要将后续的元素前移，这同样是 \(O(n)\) 的操作。对于频繁插入和删除的场景，这种操作代价太高，导致性能瓶颈。如果你的应用需要频繁在列表中间插入或删除元素，使用链表（Linked List）或双端队列（Deque）等数据结构可能会更高效。

    总结：

    - 动态数组的内存预留机制虽然提升了插入操作的效率，但会导致内存浪费。
    - 摊销时间在实时系统中不可接受，因为你无法预知最坏情况下的操作时间。
    - 插入和删除操作的高代价使得动态数组在频繁修改的场景中表现不佳。

    理解这些缺点有助于在选择数据结构时做出更明智的决定，根据具体应用场景选择最适合的数据结构以提高程序的性能和效率。
    </details>

22. 链表的定义    P116-P118
    链表（linked list）是一种线性数据结构，其中的每个元素都是一个节点对象，各个节点通过“引用”相连接。引用记录了下一个节点的内存地址，通过它可以从当前节点访问到下一个节点。

23. 链表的抽象数据类型    P119-120
    ![链表定义与存储方式](https://cdn.bangwu.top/img/linkedlist_definition.png)

    |          | 数组（List）                   | 链表           |
    | -------- | ------------------------------ | -------------- |
    | 存储方式 | 连续内存空间                   | 分散内存空间   |
    | 容量扩展 | 长度不可变                     | 可灵活扩展     |
    | 内存效率 | 元素占用内存少，但可能浪费空间 | 元素占用内存多 |
    | 访问元素 | O(1)                           | O(n)           |
    | 添加元素 | O(n)                           | O(1)           |
    | 删除元素 | O(n)                           | O(1)           |

24. 链表的实现    P121-P139

    ```python
    # 首先构建Node类
    class Node:
        def __init__(self, initdata):
            self.data = initdata
            self.next = None
    
        def get_data(self):
            return self.data
    
        def get_next(self):
            return self.next
    
        def set_data(self, new_data):
            self.data = new_data
    
        def set_next(self, new_next):
            self.next = new_next       
    # 构建链表
    class UnordredList:
        def __init__(self):
            self.head = None
    
        def is_empty(self):
            return self.head == None
    
        def add(self, item):
            temp = Node(item)
            temp.set_next(self.head)
            self.head = temp
            
        def length(self):
            count = 0
            current = self.head
            while current != None:
                count += 1
                current = current.get_next()
            return count
        
        def search(self, item):
            current = self.head
            while current != None:
                if current.get_data() == item:
                    return True
                else:
                    current = current.get_next()
            return False
    
        def remove(self, item):
            current = self.head
            previous = None
            found = False
            while not found:
                if current.get_data() == item:
                    found = True
                else:
                    previous = current
                    current = current.get_next()
            if previous == None:
                self.head = current.get_next()
            else:
                previous.set_next(current.get_next())
    
        def append(self, item):
            current = self.head
            while current.get_next() != None:
                current = current.get_next()
            current.set_next(Node(item))
    
        def insert(self, pos, item):
            current = self.head
            previous = None
            count = 0
            while count != pos:
                count += 1
                previous = current
                current = current.get_next()
            insert_item = Node(item)
            insert_item.set_next(current)
            previous.set_next(insert_item)
    
        def index(self, item):
            current = self.head
            count = 0
            while current.get_data() != item:
                if current.get_next() == None:
                    return "Not Found"
                else:
                    count +=1
                    current = current.get_next()
            return count
    
        def pop (self, pos=None):
            if pos == None:
                current = self.head
                previous = None
                while current.get_next() != None:
                    previous = current
                    current = current.get_next()
                previous.set_next(None)
                return current.get_data()
            else:
                current = self.head
                previous = None
                count = 0
                while count != pos:
                    count += 1
                    previous = current
                    current = current.get_next()
                previous.set_next(current.get_next())
                return current.get_data()
    ```

25. 具备解决新问题的能力（对已有问题的简单扩展）
    ![](https://cdn.bangwu.top/assets/sticker/gifs/amongus_bingo.gif)

## 第7章 搜索和排序

搜索是一场未知的冒险，我们或许需要走遍神秘空间的每个角落，又或许可以快速锁定目标。

1. 无序的顺序搜索的实现和分析    P9-P10

   ```python
   # 无序列表的顺序搜索
   def sequential_search(a_list, item):
       pos = 0
       found = False
       while pos < len(a_list) and not found:
           if a_list[pos] == item:
               found = True
           else:
               pos += 1
       return found
   # 最暴力的方法，最坏的情况是O(n)
   ```

2. 有序的顺序搜索的实现和分析    P12-P13

   ```python
   # 有序列表的顺序搜索
   def ordered_sequential_search(a_list, item):
       pos = 0
       found = False
       stop = False
       while pos < len(a_list) and not found and not stop:
           if a_list[pos] == item:
               found = True
           else:
               if a_list[pos] > item:
                   stop = True
               else:
                   pos += 1
       return found
   # 最坏的情况仍是O(n)但不存在目标元素是可以减少执行次数，因为stop的存在
   ```

3. 三种二分搜索的实现和分析    P16-P21

   ```python
   # 循环实现
   def binary_search(a_list, item):
       first = 0
       last = len(a_list) - 1
       found = False
       while first <= last and not found:
           mid_point = (first + last) // 2
           if a_list[mid_point] == item:
               found = True
           else:
               if item < a_list[mid_point]:
                   last = mid_point - 1
               else:
                   first = mid_point + 1
       return found
   # 递归实现1
   def binary_search_r(a_list, item):
       if len(a_list) == 0:
           return False
       else:
           mid_point = len(a_list) // 2
           if a_list[mid_point] == item:
               return True
           else:
               if item < a_list[mid_point]:
                   return binary_search_r(a_list[:mid_point], item)
               else:
                   return binary_search_r(a_list[mid_point+1:], item)
   # 递归实现2
   def binary_search(data, target, low, high):
       if low > high:
           return False    # interval is empty; no match
       else:
           mid = (low + high) // 2
           if target == data[mid]:    # found a match
               return True
           elif target < data[mid]:
               return binary_search(data, target, low, mid-1)
           else:
               return binary_search(data, target, mid+1, high)
   ```

   对于上述的两种递归，第二种更好因为第二种是对原始`data`进行索引，没有创建新的列表。时间复杂度都是*O*(log*n*)

4. 散列表的定义和目标    P24-P32
   哈希表（hash table），又称散列表，它通过建立键 `key` 与值 `value` 之间的映射，实现高效的元素查询。具体而言，我们向哈希表中输入一个键 `key` ，则可以在 𝑂(1) 时间内获取对应的值 `value` 。这样就解决了列表搜索只能循环查找的问题。

   哈希冲突：从本质上看，哈希函数的作用是将所有 `key` 构成的输入空间映射到数组所有索引构成的输出空间，而输入空间往往远大于输出空间。因此，**理论上一定存在“多个输入对应相同输出”的情况**。例如：

   ```python
   12836 % 100 = 36
   20336 % 100 = 36
   ```

   ![哈希冲突示例](https://cdn.bangwu.top/img/hash_collision.png)

   **可以通过扩容哈希表容量来减少冲突。**

5. 常用的散列函数    P32-P37

   ```python
   def hash(a_string, table_size):
       sum = 0
       for pos in range(len(a_string)):
           sum += ord(a_string[pos])
   
       return sum % table_size
   
   def hash_pro(a_string, table_size):
       sum = 0
       for pos in range(len(a_string)):
           sum += ord(a_string[pos]) * (pos + 1)
   
       return sum % table_size
   # 以上两个函数是用来key和index的，比如hash('cat', 100)返回12
   ```

6. 再散列的方法    P39-P49
   `再散列`泛指在发生冲突后寻找另一个槽的过程。这里引入一个解决哈希冲突的一个方法：`开放定址法`    可参考👉https://www.cnblogs.com/east7/p/12594894.html

   还有一种方法是`链接法`就是允许哈希表同一个位置存在多个元素，也就是位置上存储的是元素集合。![bangwu_20240621164449](https://cdn.bangwu.top/img/bangwu_20240621164449.webp)

   但是这种方法也是有缺陷的：

   - 由于每个槽都有一个元素集合，因此需要再搜索一次，才能得知目标元素是否存在

7. HashTable    P55-P56

   ```python
   # slots用于存储key, data用来存储value
   class HashTable:
       def __init__(self):
           self.size = 11
           self.slots = [None] * self.size
           self.data = [None] * self.size
   
       def put(self, key, data):
           hash_value = self.hash_function(key, len(self.slots))
   
           if self.slots[hash_value] == None:
               self.slots[hash_value] = key
               self.data[hash_value] = data
           else:
               if self.slots[hash_value] == key:
                   self.data[hash_value] = data  # replace the old data
               else:
                   next_slot = self.rehash(hash_value, len(self.slots))
                   while self.slots[next_slot] != None and self.slots[next_slot] != key:
                       next_slot = self.rehash(next_slot, len(self.slots))
                   if self.slots[next_slot] == None:
                       self.slots[next_slot] = key
                       self.data[next_slot] = data
                   else:
                       self.data[next_slot] = data # replace the old data
   
       def hash_function(self, key, size):
           return key % size
   
       def rehash(self, old_hash, size):
           return (old_hash + 1) % size
   
       def get(self, key):
           start_slot = self.hash_function(key, len(self.slots))
           data = None
           stop = False
           found = False
           position = start_slot
           while self.slots[position] != None and not found and not stop:
               if self.slots[position] == key:
                   found = True
                   data = self.data[position]
               else:
                   position = self.rehash(position, len(self.slots))
                   if position == start_slot:
                       stop = True
           return data
   
       def __getitem__(self, key): # 允许对象通过索引访问其元素
           return self.get(key)
   
       def __setitem__(self, key, data): # 允许对象通过索引设置其元素的值
           self.put(key, data)
   ```

8. 分析散列搜索算法    P58
   引入一个定义：`载荷因子`，表示哈希表的占用率，`已被占用槽数`/`总槽数`

   ![bangwu_20240621165659](https://cdn.bangwu.top/img/bangwu_20240621165659.webp)

9. 排序过程    P61
   首先，排序算法要能比较大小；其次，当元素的排列顺序不正确时，需要交换它们的位置。

10. 冒泡排序的实现和分析    P65-P66
    `冒泡排序`（bubble sort）通过连续地比较与交换相邻元素实现排序。这个过程就像气泡从底部升到顶部一样，因此得名冒泡排序。

    1. 首先，对 𝑛 个元素执行“冒泡”，**将数组的最大元素交换至正确位置**。

    2. 接下来，对剩余 𝑛−1 个元素执行“冒泡”，**将第二大元素交换至正确位置**。

    3. 以此类推，经过 𝑛−1 轮“冒泡”后，**前 𝑛−1 大的元素都被交换至正确位置**。

    4. 仅剩的一个元素必定是最小元素，无须排序，因此数组排序完成。

       ![冒泡排序流程](https://cdn.bangwu.top/img/bubble_sort_overview.png)

       ![img](https://cdn.bangwu.top/img/849589-20171015223238449-2146169197.gif)

    ```python
    # 时间复杂度O(n2)，总共比较了n(n-1)/2次 也就是1+2+3+...+n-1
    # 通常被认为是效率最低的排序算法
    def bubble_sort(a_list):
        for pass_num in range(len(a_list) - 1, 0, -1):
            for i in range(pass_num):
                if a_list[i] > a_list[i + 1]:
                    a_list[i], a_list[i + 1] = a_list[i + 1], a_list[i]
    ```

11. 选择排序的实现和分析    P69-P70
    `选择排序`（selection sort）的工作原理非常简单：开启一个循环，每轮从未排序区间选择最小的元素，将其放到已排序区间的末尾。

    1. 设数组的长度为n，初始状态下，所有元素未排序，即未排序（索引）区间为 [0,𝑛−1] 。

    2. 选取区间 [0,𝑛−1] 中的最小元素，将其与索引 0 处的元素交换。完成后，数组前 1 个元素已排序。

    3. 选取区间 [1,𝑛−1] 中的最小元素，将其与索引 1 处的元素交换。完成后，数组前 2 个元素已排序。

    4. 以此类推。经过 𝑛−1 轮选择与交换后，数组前 𝑛−1 个元素已排序。

    5. 仅剩的一个元素必定是最大元素，无须排序，因此数组排序完成。

       ![img](https://cdn.bangwu.top/img/7789414-95f142a9696c4cf8.png.webp)

       ![img](https://cdn.bangwu.top/img/7789414-5893f3ff1b915c38.gif.webp)

       说明：此动图为优化后的选择排序，每趟只交换一次

    ```python
    # 时间复杂度O(n2)
    # 相比于冒泡排序，降低了交换次数
    def selection_sort(a_list):
        for fill_slot in range(len(a_list)-1, 0, -1):
            position_of_max = 0
            for location in range(1, fill_slot + 1):
                if a_list[location] > a_list[position_of_max]:
                    position_of_max = location
    
            a_list[fill_slot], a_list[position_of_max] = a_list[position_of_max], a_list[fill_slot]
    ```

    

12. 插入排序的实现和分析    P73-P74

    `插入排序`（insertion sort）是一种简单的排序算法，它的工作原理与手动整理一副牌的过程非常相似。

    具体来说，我们在未排序区间选择一个基准元素，将该元素与其左侧已排序区间的元素逐一比较大小，并将该元素插入到正确的位置。

    1. 初始状态下，数组的第 1 个元素已完成排序。

    2. 选取数组的第 2 个元素作为 `base` ，将其插入到正确位置后，**数组的前 2 个元素已排序**。

    3. 选取第 3 个元素作为 `base` ，将其插入到正确位置后，**数组的前 3 个元素已排序**。

    4. 以此类推，在最后一轮中，选取最后一个元素作为 `base` ，将其插入到正确位置后，**所有元素均已排序**。

       ![bangwu_20240621172011](https://cdn.bangwu.top/img/bangwu_20240621172011.webp)

       ![img](https://cdn.bangwu.top/img/849589-20171015225645277-1151100000.gif)

    ```python
    # 时间复杂度依然是O(n2)，在基准测试中，插入排序算法的性能很不错
    # 最好的情况下（列表已经是有序的），每轮秩序比较一次
    # 移动操作和交换操作有一个重要的不同点。总体来说，交换操作的处理时间大约是移动操作的 3 倍，因为后者只需进行一次赋值
    def insertion_sort(a_list):
        for index in range(1, len(a_list)):
            current_value = a_list[index]
            position = index
            while position > 0 and a_list[position-1] > current_value:
                a_list[position] = a_list[position-1]
                position = position - 1
            a_list[position] = current_value
    ```

13. 搜索和排序时间复杂度的总结    P91
    ![bangwu_20240621172317](https://cdn.bangwu.top/img/bangwu_20240621172317.webp)

## 8.总结

没有总结

![](https://cdn.bangwu.top/assets/sticker/gifs/amongus_jump.gif)

