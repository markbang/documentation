---
title: "Sliding window"
description: "Sliding window algorithm using two pointers for subarray and substring problems, with a Python template, LeetCode examples, and O(n) analysis."
icon: "window-maximize"
---

[leetcode.3](https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/)

The sliding window technique is a common two-pointer pattern for array and string problems. By maintaining a window that moves across the sequence, many problems can be solved in `O(n)` time.

### Core idea

1. Use two pointers, `left` and `right`, to represent the window boundaries.
2. Move `right` to expand the window.
3. When the window satisfies a shrink condition, move `left` to contract it.
4. Update the answer while the window changes.

### Template code

```python
def sliding_window(s: str):
    left = 0
    window = {}  # 窗口内's 数据
    result = 0
    
    for right in range(len(s)):
        # 1. 将right位置's 元素加入窗口
        c = s[right]
        window[c] = window.get(c, 0) + 1
        
        # 2. 判断窗口是否需要收缩
        while 窗口需要收缩's 条件:
            # 3. 移出left位置's 元素
            d = s[left]
            left += 1
            window[d] -= 1
            
        # 4. 更新结果
        result = max(result, right - left + 1)
    
    return result
```

## Classic problems

### 1. [LeetCode 3. Longest substring without repeating characters](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

```python
# leetcode.3 滑动窗口+哈希表 
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        dic, res, i = {}, 0, -1
        for j in range(len(s)):
            if s[j] in dic:
                i = max(i, dic[s[j]])
            dic[s[j]] = j
            res = max(res, j-i)
        return res
```

### 2. [LeetCode 76. Minimum window substring](https://leetcode.cn/problems/minimum-window-substring/)

```python
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        from collections import Counter
        need = Counter(t)
        window = {}
        left = 0
        valid = 0
        start, length = 0, float('inf')
        
        for right in range(len(s)):
            c = s[right]
            if c in need:
                window[c] = window.get(c, 0) + 1
                if window[c] == need[c]:
                    valid += 1
            
            while valid == len(need):
                if right - left + 1 < length:
                    start = left
                    length = right - left + 1
                
                d = s[left]
                left += 1
                if d in need:
                    if window[d] == need[d]:
                        valid -= 1
                    window[d] -= 1
        
        return "" if length == float('inf') else s[start:start+length]
```

### 3. [LeetCode 438. Find all anagrams in a string](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)

```python
class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        from collections import Counter
        need = Counter(p)
        window = {}
        left = 0
        valid = 0
        result = []
        
        for right in range(len(s)):
            c = s[right]
            if c in need:
                window[c] = window.get(c, 0) + 1
                if window[c] == need[c]:
                    valid += 1
            
            while right - left + 1 >= len(p):
                if valid == len(need):
                    result.append(left)
                
                d = s[left]
                left += 1
                if d in need:
                    if window[d] == need[d]:
                        valid -= 1
                    window[d] -= 1
        
        return result
```

### 4. [LeetCode 209. Minimum size subarray sum](https://leetcode.cn/problems/minimum-size-subarray-sum/)

```python
class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        left = 0
        total = 0
        result = float('inf')
        
        for right in range(len(nums)):
            total += nums[right]
            
            while total >= target:
                result = min(result, right - left + 1)
                total -= nums[left]
                left += 1
        
        return 0 if result == float('inf') else result
```

### 5. [LeetCode 567. Permutation in string](https://leetcode.cn/problems/permutation-in-string/)

```python
class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        from collections import Counter
        need = Counter(s1)
        window = {}
        left = 0
        valid = 0
        
        for right in range(len(s2)):
            c = s2[right]
            if c in need:
                window[c] = window.get(c, 0) + 1
                if window[c] == need[c]:
                    valid += 1
            
            while right - left + 1 >= len(s1):
                if valid == len(need):
                    return True
                
                d = s2[left]
                left += 1
                if d in need:
                    if window[d] == need[d]:
                        valid -= 1
                    window[d] -= 1
        
        return False
```

## Typical use cases

- Finding the best value over a continuous subarray or substring
- String matching problems
- Fixed-length window problems
- Longest or shortest subarray satisfying a condition

## Time complexity

Although there are two loops, each element is visited at most twice—once by `right` and once by `left`—so the overall time complexity is `O(n)`.
