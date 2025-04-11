"""Longest Substring Without Repeating Characters
Problem:
Given a string s , find the length of the longest substring without repeating characters.
Example 1:

Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Example 2:

Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Example 3:

Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring."""

"""
Understand:
Input: String
Output: Length of longest string
Constraint: Longest String should not having any repeating characters
Edge Cases: empty -- return 0
            length:1 -- return 1

Plan: 
Sliding Window
Pointers + Sets to heck for non repeating characters

1. Two pointers: left, right
left = 0
right = 0

Input: s = "pwwkew"
1.store p in a set -> right = 0 , left = 0
2.store w in a set -> right = 1, left = 0
3.since w is already present - wont store it -> right = 2, left
    remove p from the set  -> string[left]
    increment left
4.left = 1, right =3
  store k in the set  --> right = 3
  store e in the set  --> right = 4
  return (right - left) --> 

// psuedu code:
left = 0
right = 0
max_length = 0
substring_set = set()

for right in range(len(str)):
    if str[right] in substring_set:
        remove element at left index in substring_set
        increment left
    else:
        stor in substring_set  

    max_length = max(max_length, right - left + 1)  
   
    

 



"""

def longestString(st):
    left_ptr = 0
    max_length = 0
    sub_set = set()

    for right_ptr in range(len(st)):
        if st[right_ptr] in sub_set:
            sub_set.remove(st[left_ptr])
            left_ptr+=1
        else:
            sub_set.add(st[right_ptr])

        max_length = max(max_length, right_ptr - left_ptr + 1)
    return max_length

print(longestString("abcabcbb"))
print(longestString("bbbbb"))
print(longestString("pwwkew"))