---
title: "Bit manipulation"
description: "Bitwise operations guide covering AND/OR/XOR, common tricks like checking powers of two, and LeetCode examples using low-level binary manipulation."
icon: "microchip"
---

# Bit manipulation

Bitwise operations work directly on binary bits. They are efficient and commonly used for algorithm optimization.

## Basic bit operators

| Operators | Name | Description | Example |
| --------- | ---- | ----------- | ------- |
| `&` | Bitwise AND | The result is `1` only when both bits are `1` | `5 & 3 = 1` (101 & 011 = 001) |
| `|` | Bitwise OR | The result is `1` when either bit is `1` | `5 | 3 = 7` (101 | 011 = 111) |
| `^` | Bitwise XOR | The result is `1` when the bits are different | `5 ^ 3 = 6` (101 ^ 011 = 110) |
| `~` | Bitwise NOT | Flip `0` to `1` and `1` to `0` | `~5 = -6` |
| `<<` | Left shift | Shift left by `n` bits, equivalent to multiplying by `2^n` | `5 << 1 = 10` |
| `>>` | Right shift | Shift right by `n` bits, roughly equivalent to dividing by `2^n` | `5 >> 1 = 2` |

## Common tricks

### 1. Check odd or even
### 2. Swap two numbers without a temporary variable
### 3. Check whether the k-th bit is `1`
### 4. Set the k-th bit to `1`
### 5. Set the k-th bit to `0`
### 6. Flip the k-th bit
### 7. Extract the lowest `1` bit
### 8. Remove the lowest `1` bit
### 9. Check whether a number is a power of two
### 10. Count the number of `1` bits in binary

## Classic problems

### [LeetCode 136. Single Number](https://leetcode.cn/problems/single-number/)

**Problem:** every number in the array appears twice except one. Find the one that appears only once.

**Idea:** use the XOR properties `a ^ a = 0` and `a ^ 0 = a`.

```python
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        ans = 0
        for num in nums:
            ans ^= num
        return ans
```

### [LeetCode 191. Number of 1 Bits](https://leetcode.cn/problems/number-of-1-bits/)

```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            n &= n - 1
            count += 1
        return count
```

### [LeetCode 231. Power of Two](https://leetcode.cn/problems/power-of-two/)

```python
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        return n > 0 and (n & (n - 1)) == 0
```

### [LeetCode 338. Counting Bits](https://leetcode.cn/problems/counting-bits/)

```python
class Solution:
    def countBits(self, n: int) -> List[int]:
        dp = [0] * (n + 1)
        for i in range(1, n + 1):
            dp[i] = dp[i >> 1] + (i & 1)
        return dp
```

## Typical use cases

- **State compression**: represent multiple boolean states with one integer
- **Set operations**: implement intersection, union, and complement through bit masks
- **Permission systems**: store different permissions as bits
- **Performance optimization**: use fast bitwise operations to replace some multiply/divide cases
