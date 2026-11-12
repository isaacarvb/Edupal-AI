SS1 MATHEMATICS LESSON NOTES
FIRST TERM
WEEK 1: NUMBER BASE SYSTEMS
Concept: Understanding How Numbers Are Represented in Different Counting Systems

INTRODUCTION: BEYOND BASE 10

Welcome to SS1 Mathematics! Our first topic is the Number Base System - the fundamental framework that determines how we write, interpret, and calculate with numbers.
What is a Number Base?

A number base (or radix) is the number of unique digits, including zero, used to represent numbers in a positional numeral system.

BaseNameDigits UsedVisual Representation2Binary0, 1⚪ (On/Off)8Octal0 – 710Decimal0 – 9(Our fingers)16Hexadecimal0 – 9, A – F(Web colors)The "Reset" Concept: The base number tells us when counting "resets" to the next place value. For example:
Base 10: After 9 comes 10 (1 group of ten + 0 ones)
Base 2: After 1 comes 10 (1 group of two + 0 ones)
Base 5: After 4 comes 10 (1 group of five + 0 ones)

Real-World Connections

Diagram 1: Why Different Bases Exist

Human Counting (Base 10)	Computer Circuits (Base 2)
�	�
10 Fingers	�⚫ On/Off States
│	│
▼	▼
0-9 Digits	0-1 Bits
│	│
▼	▼
Place Values	Binary System

Practical Applications:

Base 10 (Decimal): Everyday counting, money, measurements
Base 2 (Binary): Computer processors, digital storage
Base 16 (Hexadecimal): Web design (#FF0000 = red), memory addresses
Base 60: Time (60 seconds = 1 minute), angles (60' = 1°)

Core Concept: Place Value Expansion

The General Formula: For any number (𝑎�. 𝑑�)� in base x:

(� × �2) + (� × �1) + (� × �0) + (� × �−1) + (� × �−2) + (� × �−3)

Visual Place Value Chart:

Base x Number: ( 2	4	3 . 1	2 )₅
┌───┬───┬───┬───┬───┬───┐ Place Values: │5² │5¹ │5⁰ │	│5⁻¹│5⁻²│
│25 │ 5 │ 1 │ . │0.2│0.04│
└───┴───┴───┴───┴───┴───┘

CONTENT

CONVERSION FROM OTHER BASES TO BASE 10

Method: Polynomial Expansion Step-by-Step Procedure:
Write the number and identify its base
Label each digit with its place value (powers of the base)
Multiply each digit by its place value
Sum all the products

Worked Example 1.1: Convert (243)₅ to Base 10 Visual Expansion:
(2	4	3)₅
↓	↓	↓ 2×5² + 4×5¹ + 3×5⁰
↓	↓	↓ 2×25 + 4×5 + 3×1
↓	↓	↓
50 + 20  + 3 = 73₁₀

Calculation Table:

DigitPlace ValuePowerValueCumulative2255²2 × 25 = 5050455¹4 × 5 = 2070315⁰3 × 1 = 373✅ Answer: (243)₅ = 73₁₀

Worked Example 1.2: Convert (11011)₂ to Base 10 Binary Place Value Chart:
11011₂↓↓↓↓↓2⁴2³2²2¹2⁰168421↓↓↓↓↓16+ 8+ 0+ 2+ 1 = 27₁₀
✅ Answer: (11011)₂ = 27₁₀

Worked Example 1.3: Convert (12.34)₅ to Base 10 Fractional Expansion:
Integer Part:	Fractional Part: (1	2)₅	(3	4)₅
↓	↓	↓	↓
1×5¹ + 2×5⁰	3×5⁻¹ + 4×5⁻²
↓	↓	↓	↓
1×5 + 2×1	3×0.2 + 4×0.04
↓	↓	↓	↓
5 + 2 = 7	0.6 + 0.16 = 0.76

✅ Answer: (12.34)₅ = 7.76₁₀

CONVERSION FROM BASE 10 TO OTHER BASES
Method 1: Repeated Division (for Integer Part)

Algorithm:
Divide the number by the target base
Record the remainder
Use the quotient for the next division
Repeat until quotient becomes 0
Read remainders from bottom to top

Diagram: The Division Ladder

Remainders
↑
← Last division
÷ 2
[1]
÷ 2
[0]
59 → ÷ 2
[1]
÷ 2
[1]
÷ 2
[1] ← First remainder

Worked Example 1.4: Convert 59₁₀ to Base 2 Division Process:
StepDivisionQuotientRemainderNote159 ÷ 2291(LSB) Least Significant Bit229 ÷ 2141314 ÷ 27047 ÷ 231StepDivisionQuotientRemainderNote53 ÷ 21161 ÷ 201(MSB) Most Significant Bit
Reading from bottom to top: 111011₂

✅ Answer: 59₁₀ = 111011₂

Verification: 1×32 + 1×16 + 1×8 + 0×4 + 1×2 + 1×1 = 59 ✓

Method 2: Repeated Multiplication (for Fractional Part)

Algorithm:

Multiply the fraction by the target base
Record the integer part of the result
Continue with the fractional part
Stop when fractional part becomes 0 or pattern repeats

Worked Example 1.5: Convert 0.375₁₀ to Base 2 Multiplication Process:
StepOperationIntegerFractionBinary Digit10.375 × 2 = 0.7500.75020.75 × 2 = 1.510.5130.5 × 2 = 1.010.01Reading from top to bottom: 0.011₂

✅ Answer: 0.375₁₀ = 0.011₂

Worked Example 1.6: Convert 26.8₁₀ to Base 5 Integer Part (26₁₀):
26 ÷ 5 = 5 remainder 1
5 ÷ 5 = 1 remainder 0
1 ÷ 5 = 0 remainder 1

↑ Read bottom to top: 101₅ Fractional Part (0.8₁₀):
0.8 × 5 = 4.0 → integer = 4, fraction = 0

→ 0.4₅

✅ Answer: 26.8₁₀ = 101.4₅

ARITHMETIC OPERATIONS IN DIFFERENT BASES

Golden Rule: All operations follow the same logic as base 10, but the "carry" and "borrow" values equal the base.

Addition in Different Bases

Key Concept: When sum ≥ base, carry over to next column

Worked Example 1.7: Add 243₅ + 134₅ Step-by-Step Solution:
2 4 3₅
+ 1 3 4₅
────────

Column-by-column calculation:
ColumnCalculationBase 5 ConversionWriteCarryUnits3 + 4 = 77 ÷ 5 = 1 remainder 221Fives4 + 3 + 1 = 88 ÷ 5 = 1 remainder 331Twenty-fives2 + 1 + 1 = 44 < 540✅ Answer: 432₅

Verification: 243₅ = 73₁₀, 134₅ = 44₁₀, 73 + 44 = 117₁₀ = 432₅ ✓

Subtraction in Different Bases

Key Concept: Borrowing gives you the BASE value, not 10

Worked Example 1.8: Subtract 412₈ - 153₈ Detailed Borrowing Process:
4 1 2₈	Step 1: 2 < 3, borrow from middle column
1 5 3₈	Middle column: 1 becomes 0, units get 8 (base value)
────────	Now: 2 + 8 = 10, 10 - 3 = 7

4 0 12₈	Step 2: 0 < 5, borrow from left column
1 5 3₈	Left column: 4 becomes 3, middle gets 8
────────	Now: 0 + 8 = 8, 8 - 5 = 3

3 8 12₈	Step 3: 3 - 1 = 2
-1 5 3₈
──────── 2 3 7₈
✅ Answer: 237₈

Multiplication in Different Bases

Key Concept: Use multiplication tables in the given base

Worked Example 1.9: Multiply 110₂ × 11₂ Long Multiplication:
1 1 0₂
×	1 1₂
────────
1 1 0	← 110 × 1
+ 1 1 0	← 110 × 10 (shifted left)
─────────
1 0 0 1 0₂

Step Verification:

In base 2: 1 × 110 = 110
In base 2: 10 × 110 = 1100 (equivalent to shifting left)
Addition: 110 + 1100 = 10010₂

✅ Answer: 10010₂

Decimal Check: 110₂ = 6₁₀, 11₂ = 3₁₀, 6 × 3 = 18₁₀ = 10010₂ ✓

APPLICATIONS IN COMPUTING AND DIGITAL SYSTEMS

Diagram: How Computers Use Different Bases

Raw Data:	01011010 10101101 11110000
Grouped (Hex):	5	A	A	D	F	0 Hexadecimal:	5A AD F0
Memory Address:	0x5AADF0

Practical Applications Table:
BasePrimary UseReal-World ExampleBinary (2)CPU operations, file storageComputer processors, RAMOctal (8)Unix permissions, legacy systemsLinux: chmod 755Hexadecimal (16)Memory addresses, color codesCSS: #FF5733 = RGB(255,87,51)
Color Code Example:

# FF 57 33₁₆
│ │ │
│ │ └─ Red component: 33₁₆ = 51₁₀
│ └─ Green component: 57₁₆ = 87₁₀
└─ Blue component: FF₁₆ = 255₁₀

REVISION QUESTIONS (WEEK 1)
Why do humans naturally use base 10, while computers use base 2?
Explain why the number (396)₇ is invalid.
Describe the difference between the repeated division and repeated multiplication methods.
How does borrowing work in base 8 compared to base 10?
Give three real-world applications of hexadecimal numbers.

ASSESSMENT (WEEK 1)

EVALUATION (IN-CLASS)
Convert (324)₅ to base 10.
Convert (101101)₂ to base 10.
Convert (127)₁₀ to base 8.
Convert (0.625)₁₀ to base 2. 5. Calculate (132)₄ + (211)₄.
ASSIGNMENT (TAKE-HOME)
1. Convert (2A9)₁₆ to base 10. (Hint: A = 10, B = 11, C = 12, D = 13, E = 14, F = 15)
Convert (158)₁₀ to base 5.
Convert (44.75)₁₀ to base 2. 4. Calculate (503)₆ - (245)₆.
Calculate (23)₅ × (14)₅ using long multiplication.
Challenge: A computer uses 8-bit binary. What is the largest number it can represent? What happens if you add 1 to this number?

Quick Reference: Base Conversion Cheat Sheet

To Decimal: Expand using place values From Decimal (Integer): Repeated division, read remainders upward From Decimal (Fraction): Repeated multiplication, read integers downward Between Binary/Hex: Group binary digits in 4s (2³ = 8, 2⁴ = 16)
Common Bases in Computing:

1 byte = 8 bits = 2 hexadecimal digits
1 kibibyte = 1024 bytes = 2¹⁰ bytes
RGB colors: 00 to FF for each component (0-255 in decimal)

Answers to Assessment

In-Class:

1.   89
2.   45
3.   177
4.   0.101
5.   1003

Take-Home:
1.   681
2.   1113
3. 101100.11
4.   214
5.   432
6. 255; overflow to 00000000 (0)

WEEK 2: MODULAR ARITHMETIC

Concept: The Mathematics of Cycles and Remainders

INTRODUCTION: THE CLOCK AS A MATHEMATICAL MODEL

Imagine a clock. If it's 9 o'clock now, and you add 5 hours, it becomes 2 o'clock, not 14 o'clock. This "wrapping around" behavior is the essence of Modular Arithmetic.
Core Idea: In Modular Arithmetic, we are only interested in the remainder after division by a fixed number called the modulus. The clock's modulus is 12.
Let's formalize our clock example:

Normal Arithmetic: 9 + 5 = 14
Modular Arithmetic (mod 12): 14 ÷ 12 = 1 remainder 2.

So, we write: 9 + 5 ≡ 2 (mod 12) This is read as: "9 plus 5 is congruent to 2, modulo 12."

⏰ Visual Foundation: The Clock & Number Line Analogy

Diagram 1: The Classic Clock

12
11	1
10	2
9	3
8	4
7

Each hour we move, we cycle around the clock face. After 12, we return to 1.

Diagram 2: The Circular Number Line (Mod 5)
0
4	1
3	2

This is a more general "clock" for a modulus of 5. The numbers 0, 1, 2, 3, 4 are equally spaced. If you start at 2 and add 4, you go (2→3→4→0→1), landing on 1. So, 2 + 4 ≡ 1 (mod 5).
Diagram 3: Linear Number Line Wrapping into a Circle

... -5,0,5,10 ... allmapto→0(mod5)... -4,1,6,11 ... allmapto→1(mod5)... -3,2,7,12 ... allmapto→2(mod5)... -2,3,8,13 ... allmapto→3(mod5)... -1,4,9,14 ... allmapto→4(mod5)
Note: Every number on the number line "wraps around" to one of the five residues {0, 1, 2, 3, 4} in a modulo 5 system. These groups are called congruence classes.

CONTENT
The Formal Concept of Congruence

Two numbers, a and b, are said to be congruent modulo m if their difference (a - b) is exactly divisible by the modulus m.
Mathematical Definition: a ≡ b (mod m) if and only if m | (a - b) (meaning "m divides (a - b)").

Example: Is 17 ≡ 5 (mod 6)? Check: 17 - 5 = 12. Is 12 divisible by 6? Yes (12 ÷ 6 = 2). ✅
Therefore, 17 ≡ 5 (mod 6).

Finding the Remainder (The Value Modulo m)

To find a (mod m):

Divide a by m.
The remainder (which must be between 0 and m-1) is your result.
Worked Illustrations

ExampleOperation & CalculationExplanation & Conclusion25 (mod 4)25 ÷ 4 = 6 with a remainder of 1✅ 25 = 6×4 + 1, so 25 ≡ 1 (mod 4)10 (mod 7)10 ÷ 7 = 1 with a remainder of 3✅ 10 = 1×7 + 3, so 10 ≡ 3 (mod 7)Handling Negative Numbers

For negative numbers, we want a positive remainder. We achieve this by repeatedly adding the modulus until we get a non-negative number less than m.
Example: Find -14 (mod 3) Think: "What number between 0 and 2 is equivalent to -14?" -14 +
3 = -11 -11 + 3 = -8 -8 + 3 = -5 -5 + 3 = -2 -2 + 3 = 1 ✅ Answer: -14 ≡ 1 (mod 3)

Quick Check: -14 ÷ 3 = -5 remainder 1.

OPERATIONS IN MODULAR ARITHMETIC

The power of modular arithmetic is that we can perform operations (+, -, ×) on the "smaller" remainders instead of the large original numbers.
Key Principle: You can reduce numbers using the modulus before or after performing operations. The result will be congruent.

OperationGeneral Rule
Efficient MethodAddition(a + b) mod mFind (a mod m) and (b mod m), add them, then take mod m.Subtraction(a - b) mod mFind (a mod m) and (b mod m), subtract, then take mod m. (If result is negative, add m).Multiplication(a × b) mod mFind (a mod m) and (b mod m), multiply them, then take mod m.Note: This works because of the distributive properties of modular arithmetic. For example, if a = mq₁ + r₁ and b = mq₂ + r₂, then a + b = m(q₁+q₂) + (r₁+r₂). The term with 'm' disappears when we take mod m, leaving only (r₁+r₂) mod m.

WORKED EXAMPLES (WITH DEEPER EXPLANATION)

Example 2.1: Evaluate 47 (mod 6)

Solution: 47 ÷ 6 = 7 remainder 5.
✅ Answer: 47 ≡ 5 (mod 6). This means on a "clock" of size 6, 47 o'clock is the same as 5 o'clock.
Example 2.2: Evaluate (38 + 29) (mod 3)

Method 1 — Add First: 38 + 29 = 67. 67 ÷ 3 = 22 remainder 1.
Method 2 — Mod First (More Efficient): 38 (mod 3) = 2 (since 38 ÷ 3 = 12 r2) 29 (mod 3) = 2 (since 29 ÷ 3 = 9 r2) (2 + 2) = 4. 4 (mod 3) = 1.
✅ Answer: 1 (mod 3). Both methods agree!

Example 2.3: Compute (15 × 22) (mod 7)

Method 1 — Multiply First: 15 × 22 = 330. 330 ÷ 7 = 47 remainder 1.
Method 2 — Mod First (Much Easier!): 15 (mod 7) = 1. 22 (mod 7) = 1. (1 × 1) = 1. 1 (mod 7) = 1.
✅ Answer: 1 (mod 7). This shows the power of simplification.

Example 2.4: Evaluate (25 - 12) (mod 8)

Solution using mod first: 25 (mod 8) = 1. 12 (mod 8) = 4. (1 - 4) = -3. Since the result is negative, we add the modulus: -3 + 8 = 5.
✅ Answer: 5 (mod 8).

Example 2.5: Evaluate (83 × 56 + 12) (mod 9)
Solution using mod first: 83 (mod 9): 83 ÷ 9 = 9 r2 → 2. 56 (mod 9): 56 ÷ 9 = 6 r2 → 2. 12 (mod 9): 12 ÷ 9 = 1 r3 → 3. Now compute: (2 × 2 + 3) = (4 + 3) = 7. 7 (mod 9) = 7.
✅ Answer: 7 (mod 9).

APPLICATIONS TO DAILY LIFE & COMPUTER SCIENCE
Days of the Week — A Mod 7 System

We assign: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6. Q: If today is Wednesday (3), what day is 90 days from now?
(3 + 90) mod 7 = 93 mod 7.
93 ÷ 7 = 13 remainder 2.
✅ Answer: 2 → Tuesday.
Clock Time — Mod 12 or Mod 24

Q: If it's 7:00 PM (19:00) now, what time will it be in 40 hours?

(19 + 40) mod 24 = 59 mod 24.
59 ÷ 24 = 2 remainder 11.
✅ Answer: 11:00 AM.
Cryptography & Computer Science
ISBN Check Digits: The last digit of a book's ISBN code is calculated using mod 11 to detect errors in typing or scanning.
Cyclic Redundancy Checks (CRCs): Used in networks and data storage (like on a CD) to detect accidental changes to raw data. It relies heavily on polynomial division modulo 2.
Ciphers: Simple ciphers like the Caesar cipher are just modular arithmetic on the alphabet (mod 26).

REVISION QUESTIONS (WEEK 2)
What is another name for modular arithmetic? (Hint: Think about what we are left with.)
Explain in your own words what a ≡ b (mod m) means.
Describe the process for finding the positive value of a negative number like -17 (mod 5).
In a modulo 7 system, what are the only possible results for any calculation?
Mention three real-life examples of modular arithmetic (beyond clocks and days).

ASSESSMENT (WEEK 2)
EVALUATION (IN-CLASS)
Evaluate 100 (mod 9).
Evaluate -20 (mod 6).
Calculate (45 + 52) (mod 5).
Calculate (14 × 10) (mod 4).
If a cycle repeats every 4 days and today is day 0, what day of the cycle will it be in 100 days?
ASSIGNMENT (TAKE-HOME)
Find the simplest positive value of x: a. x ≡ 55 (mod 8) b. x ≡ -30 (mod 7)
Calculate (48 - 19) (mod 3).
3. Evaluate (12 × 11 × 10) (mod 6).
A worker has a 3-day cycle: On, On, Off. If the first "On" day is Monday, what day will the 15th "On" day fall on? (Hint: The 1st "On" day is day 1. When is the next one?)
Challenge Problem: Find n (where n is between 0 and 4) if 4n ≡ 3 (mod 5). (Hint: Try n
= 0, 1, 2, 3, 4 and see which one works). This is the beginning of solving modular equations!

Answers to Assessment

In-Class:
1.   1
2.   4
3.   2
4.   0
5.   0

Take-Home:

1.  a) 7, b) 5
2.   2
3.   0
4. Friday 5. n = 2
WEEK 3: INDICES (POWERS AND EXPONENTS)

Concept: The Mathematics of Repeated Multiplication and Exponential Growth

INTRODUCTION: THE POWER OF REPETITION

Indices (also called exponents or powers) are mathematical shorthand for repeated multiplication. They help us express very large and very small numbers efficiently.
Basic Terminology:
2 × 2 × 2 × 2 × 2 = 2⁵
│	│	│
│	│	└─ Exponent (Power)
│	└──────── Base
└───────────────── Repeated Multiplication

Read as: "Two raised to the power of five" or "Two to the fifth power"

Real-World Exponential Growth

Diagram 1: Bacterial Growth (Doubling Every Hour)

Hour 0: ●	= 1 = 2⁰
Hour 1: ●●	= 2 = 2¹
Hour 2: ●●●●	= 4 = 2²
Hour 3: ●●●●●●●●	= 8 = 2³ Hour 4: ●●●●●●●●●●●●●●●●	= 16 = 2⁴

Diagram 2: Compound Interest Growth

Year 0: ₦1,000 = 1000 × 2⁰ Year 1: ₦2,000 = 1000 × 2¹ Year 2: ₦4,000 = 1000 × 2²
Year 3: ₦8,000 = 1000 × 2³
Exponential growth curve

CONTENT

STANDARD FORM (SCIENTIFIC NOTATION)

Standard form helps us write extremely large or extremely small numbers efficiently.

Format: � × 10� where 1 ≤ � < 10 and � is an integer

Visual Guide: Decimal Point Movement Large Numbers → Positive Exponents:
4,750,000 = 4.75 × 10⁶
│	│	│
│	│	└─ Decimal moved 6 places LEFT
│	└──────── Number between 1 and 10
└────────────────── Original number

Small Numbers → Negative Exponents:

0.00032 = 3.2 × 10⁻⁴
│	│	│
│	│	└─ Decimal moved 4 places RIGHT
│	└──────── Number between 1 and 10
└───────────────── Original number

Memory Aid:

· LEFT = POSITIVE exponent		RIGHT → = NEGATIVE exponent Large numbers (4,750,000)	Small numbers (0.00032)

THE SEVEN LAWS OF INDICES

Visual Summary: The Index Law Family

Addition Family (Multiplication)	Subtraction Family (Division) aᵐ × aⁿ = aᵐ⁺ⁿ		aᵐ ÷ aⁿ = aᵐ⁻ⁿ
↓	↓	↓	↓	↓	↓
Same base → ADD exponents	Same base → SUBTRACT exponents

Multiplication Family (Power of Power) (aᵐ)ⁿ = aᵐⁿ
↓	↓
Multiply the exponents

Special Cases Family:
a⁰ = 1 (Zero Power)	a⁻ⁿ = 1/aⁿ (Negative Power) a¹/ⁿ = ⁿ√a (Root Power)	aᵐ/ⁿ = (ⁿ√a)ᵐ (Combined Power)

Detailed Law Breakdown:

LawRuleExampleVisual Explanation1. Multiplication�ᵐ× �ⁿ
= �ᵐ⁺ⁿ�⁵ × �³
= �⁸�·�·�·�·� × �·�·� = �⁸2. Division�ᵐ÷ �ⁿ
= �ᵐ⁻ⁿ�⁹ ÷ �²
= �⁷Cancel 2 y's: �·�·�·�·�·�·�·�·� = �⁷
�·�3. Power of Power(�ᵐ)ⁿ= �ᵐⁿ(�³)⁴
= �¹²(�·�·�) × (�·�·�) × (�·�·�) × (�·�·�)
= �¹²4. Zero Power�⁰ = 17⁰ = 1Pattern: 7³ = 343,7² = 49,7¹ = 7,7⁰ = 15. Negative Power�⁻ⁿ= 1
�ⁿ3⁻² = 1
9Opposite of positive powerLawRuleExampleVisual Explanation6. Fractional Power�1/� = � �641/3 = 4"What number cubed equals 64?"7. Combined Fractional��/�
= (� �)�272/3 = 9Cube root of 27 = 3, then square = 9

Conceptual Understanding: Why does a⁰ = 1?
Pattern Observation:
3⁴ = 81
3³ = 27 (81 ÷ 3)
3² = 9	(27 ÷ 3)
3¹ = 3	(9 ÷ 3)
3⁰ = 1	(3 ÷ 3) ← Continuing the pattern!

Negative Exponents as Reciprocals:

2³ = 8	2⁻³ = 1/8
│	│
└→ Positive	└→ Reciprocal exponent		of positive

SOLVING EXPONENTIAL EQUATIONS Golden Rule: If �� = �� and � ≠ 0,1, then � = � Strategy 1: Make Bases the Same
Example: 8 = 2³, 27 = 3³, 16 = 4² = 2⁴ Common conversions:
4 = 2²	9 = 3²	25 = 5²
8 = 2³	27 = 3³	125 = 5³
16 = 2⁴	81 = 3⁴	625 = 5⁴
Strategy 2: Substitution for Quadratic Forms When you have �2� + �·�� + � = 0, let � = ��

DETAILED WORKED EXAMPLES

Example 3.1: Simplify
−3/4

Step-by-Step Solution:

Step 1: Handle negative exponent (flip fraction) (81/16)⁻³/⁴ = (16/81)³/⁴

Step 2: Apply fractional exponent (root then power)
= (⁴√(16/81))³

Step 3: Calculate fourth roots
⁴√16 = 2, ⁴√81 = 3
= (2/3)³

Step 4: Cube the fraction
= 8/27

Visual Process:

(81/16)⁻³/⁴ → [FLIP] → (16/81)³/⁴ → [ROOT] → (2/3)³ → [POWER] → 8/27
│	│	│	│	│	│
│	│	│	│	│	└─ Final Answer
│	│	│	│	└─ Apply exponent 3
│	│	│	└─ Take 4th root of numerator & denominator
│	│	└─ New base after flipping
│	└─ Negative exponent means reciprocal
└─ Original expression

✅ Answer: 8/27

Example 3.2: Simplify (�²�⁻¹)³
�⁴�⁵

Step-by-Step Solution:

Step 1: Apply power to numerator (x²y⁻¹)³ = x⁶y⁻³

Step 2: Write the full expression
= x⁶y⁻³ / (x⁴y⁵)

Step 3: Apply division law (subtract exponents) x⁶⁻⁴ y⁻³⁻⁵ = x² y⁻⁸

Step 4: Handle negative exponent
= x² / y⁸

Exponent Arithmetic:

Numerator exponents: x⁶y⁻³ Denominator exponents: x⁴y⁵ Result: x⁶⁻⁴ y⁻³⁻⁵ = x² y⁻⁸
✅ Answer: x²/y⁸

Example 3.3: Solve 5� = 125

Solution:

5ˣ = 125
5ˣ = 5³	← Express 125 as power of 5
x = 3	← Equate exponents (same base)

✅ Answer: x = 3

Example 3.4: Solve 9�−1 = 27�+2

Step-by-Step Solution:

Step 1: Express both sides with base 3 9ˣ⁻¹ = (3²)ˣ⁻¹ = 3²⁽ˣ⁻¹⁾
27ˣ⁺² = (3³)ˣ⁺² = 3³⁽ˣ⁺²⁾

Step 2: Equate the expressions 3²⁽ˣ⁻¹⁾ = 3³⁽ˣ⁺²⁾

Step 3: Equate exponents (same base) 2(x - 1) = 3(x + 2)

Step 4: Solve the linear equation 2x - 2 = 3x + 6
2x - 3x = 6 + 2
-x = 8
x = -8

Base Conversion Visualization:

9ˣ⁻¹ = 27ˣ⁺²
↓	↓
(3²)ˣ⁻¹ = (3³)ˣ⁺²
↓	↓
3²ˣ⁻² = 3³ˣ⁺⁶

✅ Answer: x = -8

Example 3.5: Solve 4� − 3(2�) − 4 = 0

Step-by-Step Solution:
Step 1: Recognize that 4ˣ = (2ˣ)² Let y = 2ˣ, then 4ˣ = y²

Step 2: Substitute y² - 3y - 4 = 0

Step 3: Factor the quadratic (y - 4)(y + 1) = 0

Step 4: Solve for y y = 4 or y = -1

Step 5: Back-substitute y = 2ˣ Case 1: 2ˣ = 4 → 2ˣ = 2² → x = 2
Case 2: 2ˣ = -1 → No solution (2ˣ > 0 for all real x)

Substitution Method Visualization:

Original: 4ˣ - 3(2ˣ) - 4 = 0
│	│
│	└─ This is y
└─ This is y²

Becomes: y² - 3y - 4 = 0 ← Much easier to solve!

✅ Answer: x = 2

REVISION QUESTIONS (WEEK 3)
Explain the conceptual difference between �−� and �1/� using examples.
Convert 0.000507 to standard form and explain each step.
Using the pattern method, show why any non-zero number raised to power 0 equals 1.
State the golden rule for solving exponential equations and explain why it works.
Compare and contrast:
o (�²)³ vs �² × �³
o Which gives �⁵ and which gives �⁶? Why?

ASSESSMENT (WEEK 3)

EVALUATION (IN-CLASS)
Write 5.67 × 10−4 as an ordinary number.
Simplify �³�²
�⁵�

3. Evaluate 1001/2 × 1000

Evaluate
−1/2

Solve for x: 4�+1 = 8

ASSIGNMENT (TAKE-HOME)

Simplify
× (�²�³)−1/2

Evaluate 5�×25�−1 as a power of 5
125
3. Solve for k: 162�−3 = 321−�
4. Solve for y: 32� − 10(3�) + 9 = 0
5. If 2� = 5, find 2�+2

6. BONUS: POWERS OF 2 VISUALIZATION

Table: The Exponential Growth of Powers of 2

PowerExpressionValueReal-World Equivalent2⁰11Single bacterium2¹22Two coinsPowerExpressionValueReal-World Equivalent2²2 × 24Four cardinal directions2³2 × 2 × 28Bits in a byte (almost)2⁴2 × 2 × 2 × 216Squares on chessboard (one side)2⁵...32Adult human teeth2⁶...64Squares on chessboard (total)2⁷...128ASCII character set size2⁸...256One byte (8 bits)2¹⁰...1,024One kilobyte (in computing)
Negative Powers (The Shrinking Pattern):

PowerExpressionValueExplanation2⁻¹1 ÷ 20.5Half2⁻²1 ÷ 40.25Quarter2⁻³1 ÷ 80.125EighthMemory Aid: The Exponent Rules Song

When multiplying, add the powers high, When dividing, subtract them by and by, A power of a power, multiply you'll see,
Anything to zero power is one, you'll agree! Negative power means flip it right, Fractional power is a root, that's the light!

Answers to Assessment

In-Class:

1. 0.000567
2. �³
�²
3.   10

4. 3
8

5. � = 1
2

Take-Home:

1. �1/2�5/2
2. 5−�−4
3. � = 11
7
4. � = 0 or � = 2
5. 20
WEEK 4: LOGARITHMS

Concept: The Inverse Operation of Exponentiation - Finding the Exponent

INTRODUCTION: THE MISSING PIECE IN EXPONENTIAL EQUATIONS
Last week, we studied indices (powers), where we raised a base to an exponent to get a number:

10³ = 1000
│	│	│
│	│	└─ Result
│	└────── Exponent
└────────── Base

This week, we study the inverse operation — logarithms. A logarithm answers the question:

"What power must I raise the base to, in order to get a given number?"

The Inverse Relationship: Logarithms vs. Exponents

Diagram 1: Inverse Operations Comparison

Addition ↔ Subtraction	Multiplication ↔ Division 5 + 3 = 8		5 × 3 = 15
8 - 3 = 5	15 ÷ 3 = 5

Exponentiation ↔Logarithm10³ = 1000log₁₀1000= 3│	│	│││││	│	└─Result││└─ Exponent│	└──────Exponent│	└───────Result└──────────Base└─────────────BaseReal-World Analogy: The Detective Story

CRIME SCENE: 10³ = 1000
We know: Base = 10, Result = 1000 MYSTERY: What was the exponent?

LOGARITHM DETECTIVE: "The exponent was 3!" log₁₀ 1000 = 3

CONTENT

FORMAL DEFINITION OF LOGARITHMS Mathematical Definition: If � = ��, then � = log�� Where:
� → base (must be positive and ≠ 1)
� → argument (the result in exponential form)
� → logarithm (the exponent we're looking for)

Memory Aid: "The logarithm is the power!"

Visual: Converting Between Forms

Exponential Form → Logarithmic Form aˣ = y	⟺	logₐ y = x
│ │ │	│ │ │
│ │ └─ result │ │ └─ exponent
│ └─── exponent │ └─── result
└───── base	└────── base

Examples 4.1: Converting Between Forms
Exponential FormLogarithmic FormVerbal Explanation10² = 100log10100 = 2"10 to what power gives 100? The answer is 2"3⁴ = 81log381 = 4"3 to what power gives 81? The answer is 4"5−1 = 1
5log	1 =− 1
5 5"5 to what power gives 1/5? The answer is -1"161/2 = 4log   4 = 1
16	2"16 to what power gives 4? The answer is 1/2"

Fundamental Logarithm Identities

Identity 1: log�� = 1

Why? Because a¹ = a Examples:
log₁₀ 10 = 1	(since 10¹ = 10)
log₅ 5 = 1	(since 5¹ = 5)
logₓ x = 1	(for any valid base x)

Identity 2: log�1 = 0

Why? Because a⁰ = 1 Examples:
log₁₀ 1 = 0	(since 10⁰ = 1)
log₇ 1 = 0	(since 7⁰ = 1)
logₓ 1 = 0	(for any valid base x)

Memory Aid: "Base to the power of the log equals the argument"

�log�� = �

CHARACTERISTIC AND MANTISSA

Diagram 2: Anatomy of a Logarithm
log₁₀ 5000 = 3.6990
│ ││││
│ │││└─ Last decimal digit
│ ││└── Thousandths
│ │└─── Hundredths
│ └──── Tenths
└─────── Characteristic (integer part) Mantissa (decimal part)

Understanding Characteristic from Standard Form:

NumberStandard FormCharacteristicReasoning50005.0 × 10³3Power of 10is +30.003453.45 × 10⁻³-3Power of 10is -3
Bar Notation for Negative Characteristics:

Instead of writing -3.5378, we write: 3̄.5378  Read as: "Bar three point five three seven eight"

Examples:

-2.8549=2̄.8549-1.2345=1̄.2345-0.9876=0̄.9876

GRAPHS: EXPONENTIAL vs. LOGARITHMIC FUNCTIONS
Graph 1: Exponential Function y = 10ˣ

y
│
100 │	•
│	/
│	/
10 │	•
│	/
│	/
1 •---/
│ /
│/
───┼───────┼─────── x
-1	0	1

Key Features of y = 10ˣ:

Passes through (0, 1) because 10⁰ = 1
Never touches the x-axis (horizontal asymptote at y = 0)
Rapid growth for positive x
Slow decay for negative x

Graph 2: Logarithmic Function y = log₁₀ x

y
│
1│	/•
│	/
│	/
0 •─/───────
│/	1	10
-1│
│
Key Features of y = log₁₀ x:

Passes through (1, 0) because log₁₀ 1 = 0
Never touches the y-axis (vertical asymptote at x = 0)
Slow growth for x > 1
Undefined for x ≤ 0

Graph 3: Inverse Relationship

y
│
│	y=10ˣ
│	•/
│	/ •
│	/	y=x
│	/ •
│ / /
│ •/	y=log₁₀x
│/
───┼───────┼─────── x
│

The graphs are mirror images across the line y = x!

USING LOGARITHM AND ANTILOGARITHM TABLES
Method 1: Finding Logarithms

Step-by-Step Procedure:

Convert number to standard form: � = � × 10�
Characteristic = �
Use log table with the digits of A to find mantissa
Combine: log� = �.mantissa

Worked Example 4.2: Find log₁₀ 43.82 Step 1: Standard Form
43.82 = 4.382 × 10¹ → Characteristic = 1

Step 2: Use Log Table

Look up 4.382 in log table:
Find row 43, column 8 → 0.6415
Find difference for 2 (last digit) → 0.0002
- Mantissa = 0.6415 + 0.0002 = 0.6417

Step 3: Combine

log₁₀ 43.82 = 1.6417

Visual Table Lookup:

Log Table Extract:
0	1	2	...	8	9
43 .6335 .6345 .6355 ... .6415 .6425
↑	↑
Row 43	Column 8 → 0.6415
Difference for 2 → +0.0002 Total mantissa = 0.6417

Worked Example 4.3: Find log₁₀ 0.0716 Step 1: Standard Form
0.0716 = 7.16 × 10⁻² → Characteristic = -2

Step 2: Use Log Table
Look up 7.16 in log table:
- Row 71, column 6 → 0.8549
Mantissa = 0.8549

Step 3: Combine with Bar Notation

log₁₀ 0.0716 = 2̄.8549

Method 2: Finding Antilogarithms

Step-by-Step Procedure:

Separate characteristic and mantissa
Use antilog table with mantissa to find the digits
Use characteristic to place decimal point

Worked Example 4.4: Find antilog(3.9042) Step 1: Separate
Characteristic = 3, Mantissa = 0.9042

Step 2: Use Antilog Table

Look up 0.9042 in antilog table:
Row 90, column 4 → 8017
Difference for 2 → +4 → 8021
Digits = 8021

Step 3: Place Decimal Point

Characteristic = 3 → Decimal after 3 digits from left 8021 → 802.1? Wait, characteristic 3 means: A × 10³ So: 8.021 × 10³ = 8021
✅ Answer: 8021

Worked Example 4.5: Find antilog(1̄.6609) Step 1: Separate
Characteristic = -1, Mantissa = 0.6609

Step 2: Use Antilog Table

Look up 0.6609:
Row 66, column 0 → 4571
Difference for 9 → +9 → 4580
- Digits = 4580 → 4.580

Step 3: Place Decimal Point

Characteristic = -1 → A × 10⁻¹ = 4.580 × 10⁻¹ = 0.4580

✅ Answer: 0.4580

Memory Aid: Table Usage Flowchart

Finding LOG:	Finding ANTILOG: Number → Standard Form	Logarithm → Separate
↓	↓
Characteristic (from power)	Use mantissa in antilog table
↓	↓
Use A in log table → Mantissa	Get digits
↓	↓
Combine → Final answer	Use characteristic → Place decimal

REVISION QUESTIONS (WEEK 4)
Explain why logarithms and exponents are considered inverse operations, using a real- world analogy.
If log�� = �, write this in exponential form and explain what each variable represents.
Why is log55 = 1 and log51 = 0? Use the definition of logarithms to explain.
Describe the difference between characteristic and mantissa. How do you find each?
Find the characteristics of:
o log105432
o log100.5432 Explain your reasoning.

ASSESSMENT (WEEK 4)

EVALUATION (IN-CLASS)
Write 25 = 32 in logarithmic form.

Write log3
=− 2 in exponential form.

Solve for x: log�49 = 2
Using log tables, find log102.87
Using antilog tables, find the antilog of 1.4502

ASSIGNMENT (TAKE-HOME)
Solve for x: log4� = 3
Solve for x: log327 = �
Using log tables, find:
o log10602.4
o log100.000199
Using antilog tables, find:
antilog(4.8872)
antilog(2̄.1119)
Consider the graph � = 10�:
What happens to y as x becomes a very large negative number (e.g., -100)?
Does y ever become zero? Explain why or why not.

REAL-WORLD APPLICATIONS OF LOGARITHMS

Application 1: Richter Scale (Earthquake Magnitude)

Richter Scale is logarithmic: Each whole number increase = 10× energy Magnitude 3 → 10³ joules
Magnitude 4 → 10⁴ joules (10 times more energy!)
Magnitude 5 → 10⁵ joules (100 times more than magnitude 3!)

Application 2: pH Scale (Acidity)

pH = -log₁₀[H⁺] where [H⁺] is hydrogen ion concentration pH 3 → [H⁺] = 10⁻³ = 0.001
pH 4 → [H⁺] = 10⁻⁴ = 0.0001 (10 times less acidic!)

Application 3: Sound Intensity (Decibels)

dB = 10·log₁₀(I/I₀) where I is sound intensity Whisper: 30 dB → 10³ times reference intensity Normal talk: 60 dB → 10⁶ times reference intensity

Memory Poem:

Logarithms find the power, that's their special dower, Inverse of exponents, their incredible power!
Characteristic tells us where the decimal points tower, Mantissa gives the digits, making numbers not sour!

Answers to Assessment

In-Class:
1. log232 = 5
2. 3−2 = 1
9
3. � = 7 (since 72 = 49)
Approximately 0.4579 (from tables)
Approximately 28.21 (from antilog tables)

Take-Home:

1. � = 64 (since 43 = 64)
2. � = 3 (since 33 = 27)
3. a) ~2.7799, b) 4̄. 2989
4. a) ~77000, b) ~0.0129
5. a) y approaches 0 but never reaches it, b) No, y never becomes zero (asymptotic behavior)
WEEK 6: EFFECTIVE USE OF LOGARITHM TABLES
Concept: Using Logarithms as a Human Calculator for Complex Operations

INTRODUCTION: THE PRE-CALCULATOR SUPERPOWER

Before digital calculators, scientists, engineers, and mathematicians used logarithm tables as their "human computers" to solve complex calculations efficiently.
Why Logarithms Transform Mathematics

Diagram 1: The Logarithmic Transformation Machine

Complex Operations → [LOGARITHM MACHINE] → Simple Operations
│	│	│
▼	▼	▼
Multiplication	→	Addition Division	→	Subtraction Exponentiation	→	Multiplication Root Extraction	→	Division

The Magic of Logarithmic Simplification:

OperationDirect Calculation
Using Logarithms
Efficiency GainMultiplication32.5 × 7.2 = ?log(32.5) + log(7.2)Addition vs. complex multiplicationDivision145.6 ÷ 8.3 = ?log(145.6) -
log(8.3)Subtraction vs. long divisionPower(2.8)⁵ = ?5 × log(2.8)Multiplication vs. repeated multiplication
OperationDirect Calculation
Using Logarithms
Efficiency GainRoot³√125 = ?(1/3) × log(125)Division vs. trial and error

Real-World Historical Context

Before Calculators (1600s-1970s):

Scientists: Used log tables for astronomical calculations
Engineers: Designed bridges and buildings using logarithmic slide rules
Accountants: Computed compound interest and amortization schedules

Visual: The Logarithmic Slide Rule

[SlideRuleDiagram]│	123	4567891│ ← C scale│	│││	│││││││││	123	4567891│ ← D scale
Align scales to multiply: position 2 above 3, read 6 below

CONTENT

THE FOUR LAWS OF LOGARITHMIC CALCULATIONS

Law 1: Multiplication Law

log�(� × �) = log�� + log��

Visual Proof:

If M = aˣ and N = aʸ, then:
M × N = aˣ × aʸ = aˣ⁺ʸ
Therefore: logₐ(M × N) = x + y = logₐ M + logₐ N
Law 2: Division Law

log�

= log�

� − log��

Visual Proof:

If M = aˣ and N = aʸ, then:
M/N = aˣ / aʸ = aˣ⁻ʸ
Therefore: logₐ(M/N) = x - y = logₐ M - logₐ N

Law 3: Power Law

log�(��) = � × log��

Visual Proof:

If M = aˣ, then:
Mᵖ = (aˣ)ᵖ = aᵖˣ
Therefore: logₐ(Mᵖ) = px = p × logₐ M

Law 4: Root Law

log�

(� �) = 1 × log �
�

Visual Proof:

If M = aˣ, then:
ⁿ√M = M¹/ⁿ = (aˣ)¹/ⁿ = aˣ/ⁿ
Therefore: logₐ(ⁿ√M) = x/n = (1/n) × logₐ M

Memory Aid: "MAD ROOT"

Multiplication → Addition
Division → Subtraction
ROOT → Division of log

STEP-BY-STEP PROCEDURE FOR LOGARITHMIC CALCULATIONS

Flowchart: The Logarithmic Calculation Process

Start with complex expression
↓
Break into components
↓
Create log table for each number
↓
Apply logarithmic laws
↓
Perform simple arithmetic on logs
↓
Use antilog table to convert back
↓ Final answer!

Step 1: Expression Analysis Identify all components and operations in your expression.

Step 2: Logarithm Table Setup Create a systematic working table:

NumberLogarithmNotes[Value 1][Lookup from table][Any special handling][Value 2][Lookup from table][Any special handling]Step 3: Law Application Apply the appropriate logarithmic laws based on operations.

Step 4: Final Computation Combine the logarithmic results and use antilog tables.

MASTERING BAR NOTATION (NEGATIVE CHARACTERISTICS)

Understanding Bar Notation:
1̄.3979 = -1 + 0.3979 = -0.6021
2̄.8543 = -2 + 0.8543 = -1.1457

Visual: The Bar Notation Number Line

-2	-1	0	1	2
│	│	│	│	│ 2̄.xxx 1̄.xxx  0.xxx  1.xxx  2.xxx

Operation Rules with Bar Logarithms:

Addition of Bar Logs:

2̄.3 + 1̄.5 = ?
= (-2 + 0.3) + (-1 + 0.5)
= -3 + 0.8
= 3̄.8

Subtraction of Bar Logs:

2̄.3 - 1̄.5 = ?
= (-2 + 0.3) - (-1 + 0.5)
= -2 + 0.3 + 1 - 0.5
= -1 - 0.2
= -1.2 = 2̄.8  (since -1.2 = -2 + 0.8)

Multiplication of Bar Logs:

2̄.7 × 3 = ?
= (-2 + 0.7) × 3
= -6 + 2.1
= -4 + 0.1 (since -6 + 2.1 = -3.9 = -4 + 0.1)
= 4̄.1

Division of Bar Logs:
3̄.4 ÷ 2 = ?
3̄.4 = -3 + 0.4 = -4 + 1.4  (borrow 1 from characteristic)
= ( -4 + 1.4 ) ÷ 2
= -2 + 0.7
= 2̄.7

Golden Rule: Never let the mantissa become negative! Always borrow from the characteristic to keep the mantissa positive.

DETAILED WORKED EXAMPLES

Example 6.1: Multiplication and Division

Evaluate: 38.4×8.6
15.2

Step-by-Step Solution:

Step 1: Logarithmic Transformation

log	= log(38.4) + log(8.6) − log(15.2)

Step 2: Table Lookup and Setup

NumberLogarithmCalculation38.41.5843From log table (384)8.60.9345From log table (860)15.21.1818From log table (152)Step 3: Apply Logarithmic Laws

Numerator: 1.5843 + 0.9345 = 2.5188
Complete: 2.5188 - 1.1818 = 1.3370

Step 4: Antilog Conversion
Final log = 1.3370
Characteristic = 1, Mantissa = 0.3370
From antilog table: 0.3370 → 2173 Result = 2.173 × 10¹ = 21.73

Verification: 38.4×8.6 = 330.24 = 21.73 ✓
15.2

✅ Answer: 21.73
15.2

Example 6.2: Powers and Roots

Evaluate:

Step-by-Step Solution:

Step 1: Logarithmic Transformation

log

1
= 3 × [2 × log(1.65) − log(29.4)]

Step 2: Table Lookup and Setup

NumberLogarithmCalculation1.650.2175From log table1.65²0.43502 × 0.217529.41.4683From log tableStep 3: Apply Logarithmic Laws

Numerator: 2 × log(1.65) = 0.4350
Difference: log(1.65²) - log(29.4) = 0.4350 - 1.4683

Step 4: Handle Negative Result
0.4350 - 1.4683 = -1.0333
Express with bar notation: 1̄.9667 (Since -1.0333 = -2 + 0.9667)

Step 5: Apply Cube Root

1̄.9667 ÷ 3 = ?
1̄.9667 = -1 + 0.9667 = -2 + 1.9667 (borrow 1)
Now divide: (-2 + 1.9667) ÷ 3 = -0.6667 + 0.6556 = 1̄.6556

Step 6: Antilog Conversion

Final log = 1̄.6556
Mantissa 0.6556 → 4525 (from antilog table) Characteristic -1 → 4.525 × 10⁻¹ = 0.4525
✅ Answer: 0.4525

Example 6.3: Real-World Application - Compound Interest

Problem: How many years will it take ₦50,000 to grow to ₦70,000 at 8% per year?

Compound Interest Formula:

� = �(1 + �)�

Where:

A = Final amount (₦70,000)
P = Principal (₦50,000)
r = Interest rate (8% = 0.08)
n = Number of years Step-by-Step Solution: Step 1: Set Up Equation
70,000 = 50,000(1.08)�

1.4 = (1.08)�

Step 2: Apply Logarithms

log(1.4) = � × log(1.08)

� = log(1.4)
log(1.08)

Step 3: Table Lookup

NumberLogarithm1.40.14611.080.0334
Step 4: Calculate

� = 0.1461 = 4.374
0.0334

Step 5: Interpret Result

✅ Answer: 4.4 years
� ≈ 4.37 years ≈ 4 years and 4.5 months

TROUBLESHOOTING AND COMMON PITFALLS

Pitfall 1: Negative Mantissa

Incorrect: 2̄. 3 − 1̄. 8 = 1̄. 5 (wrong!) Correct: 2̄. 3 − 1̄. 8 = 2̄. 5 (borrow to keep mantissa positive)
Pitfall 2: Decimal Point Placement

Rule: Characteristic determines decimal placement:
Positive characteristic: Decimal after (characteristic + 1) digits from left
Negative characteristic: Decimal before first non-zero digit

Pitfall 3: Bar Notation Arithmetic

Always convert: 2̄. 7 =− 2 + 0.7 =− 1.3 Never write: 2̄. 7 ≠− 2.7

REVISION QUESTIONS
How do logarithms transform multiplication into addition? Provide a mathematical proof.
Explain the process of handling division with bar notation logarithms.
Why must we never let the mantissa become negative during calculations?

Describe the step-by-step process for calculating	using logarithms.
How would you use logarithms to calculate compound interest for irregular time periods?

ASSESSMENT

EVALUATION (IN-CLASS)
State the logarithmic law for:
o (a) log(� × �)
o (b) log(��)
Set up the log table to calculate � = 5.2 × 9.8
Set up the log table to calculate � =
Calculate 2 × 3̄. 6100
Calculate 5̄. 2000 ÷ 4

ASSIGNMENT (TAKE-HOME)

Use 4-figure logarithm tables for all calculations.

1. Evaluate 403.2×0.056
10.8
Evaluate
Evaluate (1.34)5
Evaluate 3 29.8×(4.1)2 (set up a full Number/Logarithm table)
8.05
5. Find � if 1000 = 200(1.05)�

HISTORICAL PERSPECTIVE AND MODERN APPLICATIONS
The Invention of Logarithms
1614: John Napier publishes "Mirifici Logarithmorum Canonis Descriptio"
1620: Edmund Gunter creates the logarithmic scale
1632: William Oughtred invents the slide rule

Modern Applications
Computer Science: Logarithmic time complexity (O(log n))
Finance: Compound interest and annuities
Science: pH scale, Richter scale, decibel measurements
Engineering: Signal processing and control systems

Memory Poem:

When numbers multiply, and you want to cry, Use logs to add, and reach for the sky!
Division's a pain, but logs make it sane,
Just subtract them out, and knowledge you'll gain!

Powers and roots, once complex and deep, Become simple arithmetic, secrets to keep.
With tables in hand, you're a math wizard grand, The master of numbers throughout the land!

Answers to Assessment

In-Class:

1. (a) log(� × �) = log� + log�, (b) log(��) = � × log�
2.  log� = log5.2 + log9.8
3. log� = 1 × log5.2
2
4. 2 × 3̄. 6100 = 2̄. 2200
5.   5̄. 2000 ÷ 4 = 2̄. 8000

Take-Home:

Approximately 2.09
Approximately 6.75
Approximately 4.30
Approximately 2.45
Approximately 32.99 years
WEEK 8: SIMPLE EQUATIONS AND VARIATIONS
Concept: Mastering Algebraic Manipulation and Proportional Relationships

INTRODUCTION: THE LANGUAGE OF MATHEMATICS

Algebraic manipulation is the foundation of all advanced mathematics and scientific reasoning. This week, we unlock two powerful tools that appear throughout STEM fields.
Real-World Applications

Diagram 1: Formulas in Everyday Life

SCIENCE & ENGINEERING	FINANCE & ECONOMICS
↓	↓
F = ma (Physics)	A = P(1 + r)ⁿ (Compound Interest) v = u + at (Motion)	I = Prt (Simple Interest)
PV = nRT (Chemistry)	C = πd (Circumference)

GEOMETRY & MEASUREMENT	COMPUTER SCIENCE
↓	↓
A = πr² (Circle area)	y = mx + c (Linear algorithms)
V = ⅓πr²h (Cone volume)	d = √[(x₂-x₁)²+(y₂-y₁)²] (Distance)

The Power of Rearrangement: Being able to manipulate formulas means you can:

Calculate any variable when others are known
Solve real-world problems efficiently
Understand relationships between quantities
Prepare for advanced mathematics and sciences

CONTENT

CHANGE OF SUBJECT OF FORMULA

Definition: The subject of a formula is the variable that stands alone on one side of the equation (typically the left side).
Visual: Identifying the Subject

Original formula: A = πr²
│	│
│	└─ Expression containing other variables
└───── SUBJECT (stands alone)

Changing the subject means rearranging the formula to make a different variable the subject.

The Golden Rule: Balance Principle

Visual: The Equation as a Balance Scale

Left Side	=	Right Side
┌─────────┐	┌─────────┐
│ 3x + 2 │	│	14	│
└─────────┘	└─────────┘
║	║
║	║
Must remain balanced!

Operation: Subtract 2 from both sides
┌─────────┐	┌─────────┐
│	3x	│	│	12	│
└─────────┘	└─────────┘

Operation: Divide both sides by 3
┌─────────┐	┌─────────┐
│	x	│	│	4	│
└─────────┘	└─────────┘

Key Principle: Whatever operation you perform on one side, you MUST perform on the other side to maintain balance.

Reverse BODMAS Strategy

Diagram 2: The "Unwrapping" Analogy

Original: 2(x + 3) = 14
│ │	│	│
│ │	│	└─ Outer layer
│ │	└────── Middle layer
│ └────────── Inner layer
└──────────── Innermost layer

UNWRAPPING ORDER (Reverse BODMAS):
Remove outer layer (÷2): (x + 3) = 7
Remove middle layer (-3): x = 4
Innermost layer revealed: x = 4

Systematic Approach:

StepOperation to UndoExampleAction1Brackets2(x + 3) = 14Expand or factor2Orders (powers/roots)x² = 16Square root both sides3Division/Multiplication3x = 12Divide by 34Addition/Subtractionx + 5 = 9Subtract 55Subject isolatedx = 4Solution found
Operation Inverses Reference Table

OperationInverse OperationVisual Example+ a- ax + 5 = 8 → x = 8 - 5- a+ ax - 3 = 7 → x = 7 + 3× a÷ a4x = 20 → x = 20 ÷ 4÷ a× ax/2 = 6 → x = 6 × 2x²√xx² = 25 → x = √25√xx²√x = 3 → x = 3²¹/ₓReciprocal1/x = 2 → x = 1/2

DETAILED WORKED EXAMPLES
Example 8.1: Handling Brackets Make x the subject of: �(� + �) = � Step-by-Step Solution:
Step 1: Divide both sides by a (undo multiplication) a(x + b)	c
───────── = ─── a	a
x + b = c/a

Step 2: Subtract b from both sides (undo addition) x + b - b = c/a - b
x = c/a - b

Step 3: Common denominator (optional simplification) x = (c - ab)/a

Visual Process:
a(x + b) = c
↓ [÷a] x + b = c/a
↓ [-b] x = c/a - b

Answer: � = �−𝑎
�

Example 8.2: Dealing with Roots

Make L the subject of: � = 2�

Step-by-Step Solution:

Step 1: Divide by 2π (undo multiplication) T/(2π) = √(L/g)

Step 2: Square both sides (undo square root) [T/(2π)]² = L/g
T²/(4π²) = L/g

Step 3: Multiply by g (undo division) L = gT²/(4π²)

Visual Process:

T = 2π√(L/g)
↓ [÷2π]
T/(2π) = √(L/g)
↓ [²] T²/(4π²) = L/g
↓ [×g]
L = gT²/(4π²)
Answer: � = ��²
4�²

Real-World Connection: This is the formula for the period of a pendulum!

Example 8.3: Variable on Both Sides

Make x the subject of: � = �+1
�−2

Step-by-Step Solution:

Step 1: Multiply both sides by (x - 2) y(x - 2) = x + 1

Step 2: Expand the left side xy - 2y = x + 1

Step 3: Collect x terms on one side xy - x = 1 + 2y

Step 4: Factor out x x(y - 1) = 1 + 2y

Step 5: Divide by (y - 1) x = (1 + 2y)/(y - 1)

Visual Process:

x + 1 y = ─────
x - 2
↓ [×(x-2)]
y(x - 2) = x + 1
↓ [Expand]
xy - 2y = x + 1
↓ [Rearrange] xy - x = 1 + 2y
↓ [Factor]
x(y - 1) = 1 + 2y
↓ [÷(y-1)]
x = (1 + 2y)/(y - 1)

Answer: � = 1+2�
�−1

Example 8.4: Powers and Denominators

Make x the subject of: � = 3�²+1
2

Step-by-Step Solution:

Step 1: Multiply both sides by 2 2y = 3x² + 1

Step 2: Subtract 1 2y - 1 = 3x²

Step 3: Divide by 3 (2y - 1)/3 = x²

Step 4: Take square root (remember ±) x = ±√[(2y - 1)/3]

Important Note: When taking square roots, we include ± because both positive and negative values satisfy the equation.

✅ Answer: � =±
SUBSTITUTION INTO FORMULAS

Definition: Substitution means replacing variables with given numerical values to calculate a result.
Process:

Write the formula
Replace each variable with its given value
Follow BODMAS rules to compute
Include appropriate units

Example 8.5: Volume of a Cylinder

Given: � = ��²ℎ, find V when � = 22, r = 7, h = 5
7

Step-by-Step Solution:

V = πr²h
= (22/7) × (7)² × 5
= (22/7) × 49 × 5
= 22 × 7 × 5
= 22 × 35
= 770

Calculation Check:

(22/7) × 49 = 22 × 7 = 154
154 × 5 = 770

✅ Answer: V = 770

Example 8.6: Compound Interest

Given: � = �(1 + 𝑟), find A when P = 2000, r = 0.05, t = 3
Step-by-Step Solution:

A = P(1 + rt)
= 2000 × (1 + 0.05 × 3)
= 2000 × (1 + 0.15)
= 2000 × 1.15
= 2300

Financial Interpretation: ₦2,000 invested at 5% simple interest for 3 years grows to ₦2,300

✅ Answer: A = 2300

VARIATION: MATHEMATICAL RELATIONSHIPS Concept: Variation describes how one quantity changes in relation to another. Diagram 3: The Four Types of Variation
DIRECT VARIATION	INVERSE VARIATION
y	y
│	│
│	/	│	\
│ /	│	\
│ /	│	\
│/	│	\
└───── x	└─────── x
"More x → More y"	"More x → Less y"

JOINT VARIATION	COMBINED VARIATION
y varies with both	Mix of direct and
x and z together	inverse relationships

Variation Types Reference Table

Type
StatementSymbolic Form
Formula
Real-World ExampleDirect"y varies directly as x"y ∝ xy = kxDistance vs. Time (constant speed)Inverse"y varies inversely as x"y ∝ 1/xy = k/xPressure vs. Volume (Boyle's Law)Joint"y varies jointly as x and z"y ∝ xzy = kxzArea of rectangle (A = l × w)CombinedMixed direct and inversey ∝ x²/√zy = kx²/√zGravitational force

Solving Variation Problems: 5-Step Method

Step 1: Write the proportional statement Step 2: Convert to equation using constant k Step 3:
Use given data to find k Step 4: Write the complete formula Step 5: Solve for unknown values

DETAILED VARIATION EXAMPLES
Example 8.7: Direct Variation

Problem: y varies directly as the square of x. When x = 3, y = 18. Find y when x = 5.

Step-by-Step Solution:

Step 1: Write proportional statement y ∝ x²

Step 2: Convert to equation y = kx²

Step 3: Find k using given data
18 = k × (3)²
18 = 9k
k = 2

Step 4: Write complete formula y = 2x²

Step 5: Solve for unknown
When x = 5: y = 2 × (5)² = 2 × 25 = 50

Graphical Insight: This is a parabola opening upward

✅ Answer: y = 50

Example 8.8: Inverse Variation

Problem: R varies inversely as √V. When R = 10, V = 25, find V when R = 5.

Step-by-Step Solution:

Step 1: Write proportional statement R ∝ 1/√V

Step 2: Convert to equation R = k/√V

Step 3: Find k using given data
10 = k/√25
10 = k/5 k = 50

Step 4: Write complete formula R = 50/√V
Step 5: Solve for unknown 5 = 50/√V
√V = 50/5 = 10 V = 10² = 100

Real-World Connection: Electrical resistance vs. conductor diameter

✅ Answer: V = 100

Example 8.9: Joint Variation

Problem: y varies jointly as x and z. When x = 2, z = 3, y = 24, find y when x = 4, z = 6.

Step-by-Step Solution:

Step 1: Write proportional statement y ∝ xz

Step 2: Convert to equation y = kxz

Step 3: Find k using given data 24 = k × 2 × 3
24 = 6k
k = 4

Step 4: Write complete formula y = 4xz

Step 5: Solve for unknown
When x = 4, z = 6: y = 4 × 4 × 6 = 96

Observation: Both x and z doubled, so y quadrupled (2 × 2 = 4 times)

✅ Answer: y = 96

Example 8.10: Combined Variation

Problem: y varies directly as x² and inversely as √z. When x = 4, z = 9, y = 8, find y when x = 6, z = 16.
Step-by-Step Solution:

Step 1: Write proportional statement y ∝ x²/√z

Step 2: Convert to equation y = kx²/√z

Step 3: Find k using given data 8 = k × (4)² / √9
8 = k × 16 / 3
8 = 16k/3
k = 8 × 3/16 = 24/16 = 1.5

Step 4: Write complete formula y = 1.5x²/√z

Step 5: Solve for unknown
When x = 6, z = 16: y = 1.5 × (6)² / √16 y = 1.5 × 36 / 4 = 54 / 4 = 13.5
✅ Answer: y = 13.5

GRAPHICAL REPRESENTATION OF VARIATION

Diagram 4: Variation Graphs
DIRECT: y = kx	INVERSE: y = k/x
y	y
│	│
│	/	│	\
│	/	│	\
│	/	│	\
│ /	│	\
│ /	│	\
└────── x	└───────── x

DIRECT SQUARE: y = kx²	INVERSE SQUARE: y = k/x²
y	y
│	│
│	/	│\
│	/	│ \
│ /	│ \
│ /	│	\
│/	│	\
└────── x	└────── x

REAL-WORLD APPLICATIONS TABLE

SituationVariation TypeFormulaExplanationSpeedDirectd = stDouble time → Double distanceBoyle's LawInverseP ∝ 1/VHalf volume → Double pressureGravityInverse SquareF ∝ 1/r²Double distance → ¼ forceCircle AreaDirect SquareA ∝ r²Double radius → 4× areaLight IntensityInverse SquareI ∝ 1/d²Double distance → ¼ brightnessElectrical ResistanceInverseR ∝ 1/ADouble wire area → Half resistance
REVISION QUESTIONS
Define "subject of a formula" and explain why changing the subject is useful.
State the golden rule for equation manipulation and illustrate with an example.
Convert these statements to equations:
"y varies directly as the cube of x"
"P varies inversely as the square root of t"
"A varies jointly as b and h"
Explain the difference between direct and inverse variation using real-world examples.
If y doubles when x doubles, what type of variation is this? What if y halves when x doubles?

ASSESSMENT

EVALUATION (IN-CLASS)

Make C the subject of: � = 9 � + 32
5
Make r the subject of: � = �(1 + 𝑟)
If y ∝ x and y = 10 when x = 2, find y when x = 7
If y ∝ 1/x and y = 5 when x = 4, find y when x = 10
If P ∝ L² and L is doubled, what happens to P?

ASSIGNMENT (TAKE-HOME)
Make h the subject of: � = 2��(� + ℎ)

Make x the subject of: � =

3. If � = 1 ��²ℎ, find V when π = 22/7, r = 3, h = 7
3
F varies inversely as d². When d = 2 cm, F = 5 N. Find F when d = 5 cm
Z varies directly as x² and inversely as y. When x = 2, y = 3, Z = 8. Find Z when x = 3, y
= 2
EXTENSION (CHALLENGE PROBLEMS)

Make x the subject of: 1 + 1 = 1
�	�	�
If P varies directly as q and inversely as the square of r, find P when q = 8, r = 2, given P
= 12 when q = 6, r = 3

Make m the subject of: � =

COMMON PITFALLS AND TIPS

Pitfall 1: Forgetting to perform operations on both sides Tip: Always visualize the balance scale

Pitfall 2: Incorrect order of operations Tip: Use reverse BODMAS systematically

Pitfall 3: Mishandling square roots Tip: Remember ± when taking square roots

Pitfall 4: Confusing direct and inverse variation Tip: Direct = "same direction", Inverse = "opposite direction"
Memory Poem:

Equations are like scales, keep them balanced and true, What you do to one side, to the other side too!

Reverse BODMAS is the key, to set variables free, Unwrap like a present, and the answer you'll see!

Variation shows relationships, how things change and grow, Direct, inverse, joint, combined - their patterns you will know!

Answers to Assessment

In-Class:
1. � = 5 (� − 32)
9
2. � = �/�−1
�
3. y = 35
4. y = 2
5. P becomes 4 times larger

Take-Home:

1. ℎ = � − �
2��

2. � =  ��²
�+�²
3. V = 66
4. F = 0.8 N
5. Z = 18

Extension:

1. � = ��
�−�
2. P = 54
3. � = �
�²
WEEK 9: QUADRATIC EQUATIONS I

Concept: Mastering the Art of Solving Second-Degree Equations Through Factorization

INTRODUCTION: FROM LINEAR TO QUADRATIC

The Evolution of Equations

Linear Equations (Previous Knowledge):

Equation: 2x + 3 = 11 Solution: x = 4
Characteristic: Straight line graph, one solution

Quadratic Equations (New Frontier):

Equation: x² - 4x + 3 = 0 Solutions: x = 1 or x = 3
Characteristic: Curved parabola, up to two solutions

Visual Comparison: Linear vs. Quadratic

y││Quadratic: y = x² - 4x + 3│/	\│/	\│•	/	\	•│/	\│/	\│/	\└──┼───┼───┼───┼───┼── x
│	│	│	│	│ Linear: y = 2x + 3
──── straight line!

Formal Definition

A quadratic equation is an equation where the highest power of the variable is 2.

Standard Form:

��² + �� + � = 0

Where:

�, �, � are real numbers (constants)
� ≠ 0 (if � = 0, it becomes linear)

Examples:

�² − 5� + 6 = 0 → � = 1, � =− 5, � = 6
2�² + 3� − 4 = 0 → � = 2, � = 3, � =− 4
4�² − 9 = 0 → � = 4, � = 0, � =− 9

Real-World Applications

Diagram 1: Quadratic Equations in Daily Life

SPORTS & PROJECTILES	BUSINESS & ECONOMICS
↓	↓
Ball trajectory:	Profit maximization:
h = -5t² + 20t	P = -2x² + 100x - 500
╱┆╲
╱ ┆ ╲	│
╱	┆	╲	│
┆	└─ Maximum profit point

GEOMETRY & DESIGN	SCIENCE & ENGINEERING
↓	↓
Area calculations:	Bridge design:
A = x(x+3) = x² + 3x	Structural analysis
┌─────┐	/¯¯¯¯¯\
│	│	/	\
│	│	/	\
└─────┘	────────────

Key Insight: Quadratic equations model situations where change accelerates or decelerates, unlike linear equations that model constant change.

CONTENT

REVISION: THE CONCEPT OF FACTORIZATION

Definition: Factorization is the process of breaking down an expression into simpler parts (factors) that multiply together to give the original expression.
Visual: Factorization as Decomposition

Original: 30
↓ Factors: 2 × 3 × 5
│	│	│
│	│	└─ Prime factor
│	└───── Prime factor
└───────── Prime factor

Original: x² + 7x + 12
↓
Factors: (x + 3)(x + 4)
│	│
│	└─ Linear factor
└───────── Linear factor
Why Factorize?

Simplifies complex expressions
Helps solve equations
Reveals hidden patterns and relationships

FACTORIZATION OF QUADRATIC EXPRESSIONS
Case 1: Difference of Two Squares (� = 0)

Pattern Recognition:

�² − �² = (� − �)(� + �)

Visual Proof: Geometric Interpretation

Area = a²	Remove b²	Rearrange
┌───────┐	┌───┬───┐	┌───┬───┐

│	││	│	│││││	a² │→├───┘	│→│a│a││	││	b² ││-│+│└───────┘└───────┘│b│b│└───┴───┘
Total area: a² - b²	= (a-b)(a+b)

Examples:

Example 1.1: Factorize �² − 49

x² - 49 = x² - 7² = (x - 7)(x + 7)

Example 1.2: Factorize 4�² − 25

4y² - 25 = (2y)² - 5² = (2y - 5)(2y + 5)

Example 1.3: Factorize 9 − 16�²

9 - 16z² = 3² - (4z)² = (3 - 4z)(3 + 4z)

Case 2: Trinomials with � = 1

Form: �² + �� + �

Strategy: The Number Pair Method We need two numbers that:

Add to give � (the coefficient of x)
Multiply to give � (the constant term)

Visual: The Factor Diamond

Product: c
/ \
/	\
?	?
\	/
\ / Sum: b

Step-by-Step Process:

Example 2.1: Factorize �² + 7� + 12

Step 1: Identify b = 7, c = 12
Step 2: Find number pairs that multiply to 12: (1, 12), (2, 6), (3, 4)
Step 3: Check which pair adds to 7:

1+12 = 13 ✗2 +6= 8 ✗3 +4= 7 ✓Step 4: Write factors: (x + 3)(x + 4)

Example 2.2: Factorize �² − 5� − 14

Step 1: Identify b = -5, c = -14
Step 2: Find number pairs that multiply to -14:
(1, -14), (2, -7), (-1, 14), (-2, 7)
Step 3: Check which pair adds to -5: 1 + (-14) = -13 ✗
2 + (-7) = -5 ✓
Step 4: Write factors: (x + 2)(x - 7)

Memory Aid: "SUM and PRODUCT"

SUM tells you what to ADD
PRODUCT tells you what to MULTIPLY

Case 3: Trinomials with � ≠ 1

Form: ��² + �� + �

Method: Splitting the Middle Term Step-by-Step Algorithm:
Multiply � × �
Find two numbers that:
Add to �
Multiply to � × �
Split the middle term using these numbers
Factor by grouping

Visual: The AC Method Flowchart

ax² + bx + c
↓ [Multiply a×c]
Find numbers: m + n = b, m × n = a×c
↓ [Split] ax² + mx + nx + c
↓ [Group]
(ax² + mx) + (nx + c)
↓ [Factor groups]
x(ax + m) + k(nx + c) → Common factor!
↓
(px + q)(rx + s)

Example 3.1: Factorize 3�² + 10� − 8

Step 1: a × c = 3 × (-8) = -24
Step 2: Find numbers:
Need: sum = 10, product = -24
Numbers: -2 and 12 (because -2 + 12 = 10, -2 × 12 = -24) Step 3: Split: 3x² - 2x + 12x - 8
Step 4: Group: (3x² - 2x) + (12x - 8)
Step 5: Factor groups: x(3x - 2) + 4(3x - 2) Step 6: Common factor: (x + 4)(3x - 2)
Verification: Expand (� + 4)(3� − 2) = 3�² − 2� + 12� − 8 = 3�² + 10� − 8 ✓

SOLVING QUADRATIC EQUATIONS BY FACTORIZATION
The Zero Product Property

Fundamental Principle: If � × � = 0, then either � = 0 or � = 0 (or both)

Visual: The Zero Product Rule

M × N = 0
║
┌─────┴─────┐
│	│
M = 0	N = 0
│	│
Solve	Solve

Why This Works:
The only way a product can be zero is if at least one factor is zero
This transforms a quadratic equation into two simple linear equations

Solving Procedure

Step 1: Write in standard form: ��² + �� + � = 0 Step 2: Factorize the quadratic expression
Step 3: Set each factor equal to zero Step 4: Solve each linear equation

DETAILED WORKED EXAMPLES
Example 9.1: Simple Trinomial

Solve: �² − 8� + 15 = 0

Step-by-Step Solution:

Step 1: Already in standard form Step 2: Factorize:
Numbers that add to -8, multiply to 15: -3 and -5 (x - 3)(x - 5) = 0
Step 3: Set each factor to zero: x - 3 = 0 OR x - 5 = 0
Step 4: Solve:
x = 3 OR x = 5

Graphical Interpretation: The parabola � = �² − 8� + 15 crosses the x-axis at x = 3 and x = 5

✅ Answer: � = 3 or � = 5

Example 9.2: Equation Requiring Rearrangement

Solve: 6�² − 5� = 4

Step-by-Step Solution:
Step 1: Standard form: 6x² - 5x - 4 = 0 Step 2: Factorize using AC method:
a × c = 6 × (-4) = -24
Numbers: sum = -5, product = -24 → 3 and -8 Split: 6x² + 3x - 8x - 4 = 0
Group: (6x² + 3x) + (-8x - 4)
Factor groups: 3x(2x + 1) - 4(2x + 1) Common factor: (3x - 4)(2x + 1) = 0
Step 3: Set factors to zero:
3x - 4 = 0 OR 2x + 1 = 0
Step 4: Solve:
x = 4/3 OR x = -1/2

Check Solutions:

For � = 4: 6( 16 ) − 5( 4 ) = 96 − 20 = 32 − 20 = 12 = 4 ✓
3	9	3	9	3	3	3	3
For � =− 1: 6( 1 ) − 5( − 1 ) = 6 + 5 = 1.5 + 2.5 = 4 ✓
2	4	2	4	2

✅ Answer: � = 4 or � =− 1
3	2

Example 9.3: Difference of Squares

Solve: 4�² − 25 = 0

Step-by-Step Solution:

Step 1: Already in standard form
Step 2: Recognize difference of squares:
4x² - 25 = (2x)² - 5² = (2x - 5)(2x + 5) = 0
Step 3: Set factors to zero:
2x - 5 = 0 OR 2x + 5 = 0
Step 4: Solve:
x = 5/2 OR x = -5/2
✅ Answer: � = 5 or � =− 5
2	2

Example 9.4: Common Factor First

Solve: 3�² − 12� = 0

Step-by-Step Solution:

Step 1: Already in standard form Step 2: Factor out common factor:
3x(x - 4) = 0
Step 3: Set factors to zero: 3x = 0 OR x - 4 = 0
Step 4: Solve:
x = 0 OR x = 4

Important: Always look for common factors first—it simplifies the problem!

✅ Answer: � = 0 or � = 4

COMMON PITFALLS AND TIPS

Pitfall 1: Forgetting the Standard Form Tip: Always rearrange to ��² + �� + � = 0 before factoring
Pitfall 2: Incorrect Sign Handling Tip: Double-check that your numbers:

ADD to �
MULTIPLY to � × �

Pitfall 3: Not Checking Solutions Tip: Always verify by substituting back into the original equation
Pitfall 4: Overlooking Common Factors Tip: Always factor out the greatest common factor first
Pitfall 5: Assuming All Quadratics Factor Tip: Some quadratics don't factor nicely—we'll learn other methods later!

REVISION QUESTIONS
What distinguishes a quadratic equation from a linear equation? Provide examples of each.
Explain the Zero Product Property and why it's essential for solving quadratic equations.
Describe the geometric interpretation of the difference of two squares.
Walk through the "splitting the middle term" method step by step with an example.
Why can't �² + 9 = 0 be solved by factorization in real numbers? What does this tell us about its solutions?

ASSESSMENT

EVALUATION (IN-CLASS)
Factorize �² − 121
Factorize �² + 10� + 21
Factorize �² + 2� − 15
Solve for �: �² − 9� = 0 (Hint: common factor)
5. Solve for �: �² − 11� + 28 = 0

ASSIGNMENT (TAKE-HOME)
Factorize 5�² − 13� − 6
Solve for �: �(� + 3) = 10 (Hint: expand and rearrange)
3. Solve for �: 3�² + 19� = 14
Solve for �: 4�² − 25 = 0 (Hint: difference of two squares)
Word Problem: The product of two consecutive positive integers is 56.
Let the integers be � and � + 1
Write the quadratic equation
Solve by factorization to find the integers

REAL-WORLD PROBLEM SOLVING

Application: Consecutive Integer Problem

Problem: The product of two consecutive positive integers is 56. Find the integers.

Step-by-Step Solution:

Step 1: Define variables:
Let the integers be n and n+1 Step 2: Set up equation:
n(n + 1) = 56
Step 3: Expand and rearrange: n² + n = 56
n² + n - 56 = 0 Step 4: Factorize:
Numbers that add to 1, multiply to -56: -7 and 8 (n - 7)(n + 8) = 0
Step 5: Solve:
n - 7 = 0 → n = 7
n + 8 = 0 → n = -8
Step 6: Interpret:
We need positive integers, so n = 7 The integers are 7 and 8
Verification: 7 × 8 = 56 ✓

✅ Answer: The integers are 7 and 8

Memory Poem:
Quadratic equations, degree two, ax² + bx + c, that's the clue!
Factorize to solve with ease, Using methods such as these:

Difference of squares, a special case, Makes solving problems a real race!
Trinomials need number pairs, That satisfy both sums and shares!

Zero product property's the key, Set each factor to zero, you'll see! Solutions one, or sometimes two, Now quadratic skills belong to you!

Answers to Assessment

In-Class:

1. (� − 11)(� + 11)
2. (� + 3)(� + 7)
3. (� + 5)(� − 3)
4. � = 0 or � = 9
5. � = 4 or � = 7

Take-Home:

1. (5� + 2)(� − 3)
2. � = 2 or � =− 5
3. � = 2 or � =− 7
3

4. � = 5 or � =− 5
2	2
5. Integers are 7 and 8
WEEK 10: QUADRATIC EQUATIONS II

Concept: From Roots to Graphs - The Complete Picture of Quadratic Equations

INTRODUCTION: BEYOND FACTORIZATION

Building on Previous Knowledge

Last Week (Factorization):

Equation: x² - 5x + 6 = 0 Factorization: (x - 2)(x - 3) = 0 Solutions: x = 2 or x = 3

This Week (Advanced Concepts):

Forming equations from known solutions
Graphical interpretation of quadratics
Real-world applications in physics, business, and engineering

Visual: The Quadratic Equation Ecosystem

ROOTS (Solutions) ←→ EQUATION ←→ GRAPH (Parabola)
↓	↓	↓
x = 2,3	x² - 5x + 6 = 0	U-shaped curve
│	│	│
└────────────────────┴───────────────┘ All representations are connected!

Real-World Significance

Diagram 1: Quadratic Equations in Action
PHYSICS & ENGINEERING	BUSINESS & ECONOMICS
↓	↓
Projectile Motion:	Profit Optimization:
h = -5t² + 20t	P = -2x² + 100x - 500
╱┆╲
╱ ┆ ╲	│
╱	┆	╲	│
┆ Maximum height	└─ Maximum profit point

ARCHITECTURE & DESIGN	COMPUTER GRAPHICS
↓	↓
Bridge arches:	3D modeling:
y = ax² + bx + c	Parabolic surfaces
/¯¯¯¯¯\	/\
/	\	/ \
/	\	/	\
─────────────────	─────────────

Key Insight: Understanding the complete picture of quadratic equations unlocks their power to model and solve real-world problems.

CONTENT

FORMATION OF QUADRATIC EQUATIONS FROM GIVEN ROOTS
The Fundamental Connection

If we know the roots (solutions) α and β, we can reconstruct the equation. Visual: The Root-to-Equation Process
Roots: α and β
↓ [Reverse thinking] Factors: (x - α) and (x - β)
↓ [Multiply]
Equation: (x - α)(x - β) = 0
↓ [Expand]
x² - (α + β)x + αβ = 0

Mathematical Derivation:

Given: Roots are α and β Then: (x - α)(x - β) = 0 Expand: x² - βx - αx + αβ = 0
Simplify: x² - (α + β)x + αβ = 0

✅ Golden Formula:

�² − (Sum of roots)� + (Product of roots) = 0

Where:

Sum of roots = α + β
Product of roots = αβ

Memory Aid: "SP Equation"
Sum → Coefficient of x
Product → Constant term

DETAILED WORKED EXAMPLES
Example 10.1: Integer Roots

Find the quadratic equation whose roots are 4 and -3. Step-by-Step Solution:
Step 1: Identify roots α = 4, β = -3

Step 2: Calculate sum and product
Sum = α + β = 4 + (-3) = 1
Product = α × β = 4 × (-3) = -12

Step 3: Apply formula
x² - (Sum)x + (Product) = 0 x² - (1)x + (-12) = 0
x² - x - 12 = 0

Verification:

Solve x² - x - 12 = 0 Factorization: (x - 4)(x + 3) = 0 Roots: x = 4, x = -3 ✓
✅ Answer: �² − � − 12 = 0

Example 10.2: Fractional Roots

Find the quadratic equation whose roots are 1 and 3.
2	2

Step-by-Step Solution:

Step 1: Identify roots α = 1/2, β = 3/2

Step 2: Calculate sum and product Sum = 1/2 + 3/2 = 4/2 = 2
Product = (1/2) × (3/2) = 3/4

Step 3: Apply formula x² - (2)x + (3/4) = 0
x² - 2x + 3/4 = 0
Step 4: Clear fractions (multiply by 4) 4x² - 8x + 3 = 0

Verification:

Solve 4x² - 8x + 3 = 0 Factorization: (2x - 1)(2x - 3) = 0 Roots: x = 1/2, x = 3/2 ✓
✅ Answer: 4�² − 8� + 3 = 0

Example 10.3: Complex Roots

Find the quadratic equation whose roots are 2 +	and 2 −	3.

Step-by-Step Solution:

Step 1: Identify roots α = 2 + √3, β = 2 - √3

Step 2: Calculate sum and product Sum = (2 + √3) + (2 - √3) = 4
Product = (2 + √3)(2 - √3) = 4 - 3 = 1

Step 3: Apply formula x² - (4)x + (1) = 0
x² - 4x + 1 = 0

Mathematical Insight: When roots are conjugate pairs (a ± b√c), the sum and product are always rational!
✅ Answer: �² − 4� + 1 = 0

DRAWING QUADRATIC GRAPHS
Understanding the Parabola

Definition: A parabola is the U-shaped or n-shaped curve formed by graphing a quadratic equation.
Visual: Parabola Characteristics

y
││U-shaped (a >0)n-shaped(a < 0)│
│/¯¯¯¯¯\
/	\\
\/
/│/	\\/│	/	\	\/
│	/	\	/\
│	/	\	/ \
└──┼───────────────── x	─┼────── x
│	│
Minimum point	Maximum point
(Vertex)	(Vertex)

Key Features:

Vertex: The turning point (minimum or maximum)
Axis of Symmetry: Vertical line through the vertex
Roots: x-intercepts (where y = 0)
y-intercept: Where x = 0

Step-by-Step Graphing Procedure

Step 1: Create a Table of Values Choose x-values around the expected vertex

Step 2: Calculate Corresponding y-values Substitute each x into the equation
Step 3: Choose Appropriate Scales Ensure the graph fits nicely on your paper

Step 4: Plot Points Carefully Mark each (x, y) coordinate accurately

Step 5: Draw a Smooth Curve Connect points with a continuous, curved line

COMPREHENSIVE GRAPHING EXAMPLE
Example 10.4: Complete Graphing Process

Draw the graph of � = �² − 2� − 3 for −2 ≤ � ≤ 4

Step 1: Table of Values

xx²-2x-3y = x² - 2x - 3Point-244-35(-2, 5)-112-30(-1, 0)000-3-3(0, -3)11-2-3-4(1, -4)24-4-3-3(2, -3)39-6-30(3, 0)416-8-35(4, 5)Step 2: Plot Points and Draw Curve

y
│
5│•	•
│ 4│
│ 3│
│ 2│
│ 1│
│
0│	•	•

│-13-1││-2││-3│••│-4│•│└───┴───┴───┴───┴───┴── x
-2 -1	0	1	2	3	4

Step 3: Identify Key Features

Roots: x = -1 and x = 3 (where curve crosses x-axis)
Vertex: (1, -4) - minimum point
Axis of Symmetry: x = 1 (vertical line through vertex)
y-intercept: (0, -3)

EXTRACTING INFORMATION FROM GRAPHS
Three Types of Graphical Solutions

Finding Roots of the Original Equation

Equation: x² - 2x - 3 = 0
On graph: Find where y = 0 (x-intercepts) Solution: x = -1, x = 3

Finding Minimum/Maximum Values
For y = x² - 2x - 3:
Vertex at (1, -4) Minimum value: y = -4

Solving Related Equations

To solve: x² - 2x - 1 = 0 Rewrite: x² - 2x - 3 = 2
Find where original curve intersects y = 2 Approximate solutions: x ≈ -0.4, x ≈ 2.4

Visual: Graphical Solution Methods

Original: y = x² - 2x - 3

ROOTS:MINIMUM:RELATED EQ:Where curve hitsLowest pointShift horizontal linex-axis (y=0)(1, -4)to solve new equations•	••│/ \	/ \/ \│ y=2/	\	/	\/	\│─•─────┼─•─────x─┼─────┼─x─┼─────┼─ x││•	•

REAL-WORLD APPLICATIONS
Example 10.5: Garden Design Problem

A rectangular garden has a length 4 m longer than its width. If the area is 45 m², find the dimensions.
Step-by-Step Solution:
Step 1: Define variables Let width = w
Then length = w + 4

Step 2: Set up equation Area = length × width 45 = (w + 4) × w
45 = w² + 4w

Step 3: Rearrange to standard form w² + 4w - 45 = 0

Step 4: Solve by factorization
Find numbers that add to 4, multiply to -45: 9 and -5 (w + 9)(w - 5) = 0

Step 5: Interpret solutions w = -9 or w = 5
Width cannot be negative ⇒ w = 5 Length = w + 4 = 9
Verification: 5 × 9 = 45 m² ✓

Visual Representation:

Garden Layout:
┌─────────────┐
│	│ Width = 5 m
│	│
│	45 m²	│
│	│
│	│
└─────────────┘ Length = 9 m
✅ Answer: Width = 5 m, Length = 9 m

Example 10.6: Projectile Motion

A ball is thrown upward with initial velocity. Its height h (in meters) after t seconds is given by ℎ =− 5�² + 20�. Find:
Maximum height reached
Time when ball hits the ground Graphical Approach:
Step 1: Recognize this is a quadratic: h = -5t² + 20t Step 2: Graph shows inverted parabola (a = -5 < 0) Step 3: Maximum height at vertex
Step 4: Ground level when h = 0

Algebraic Solution:

For h = -5t² + 20t:
Vertex at t = -b/(2a) = -20/(2×-5) = 2 seconds Maximum height = -5(2)² + 20(2) = -20 + 40 = 20 meters

Time when h = 0:
-5t² + 20t = 0
-5t(t - 4) = 0
t = 0 (start) or t = 4 seconds

✅ Answer: Maximum height = 20 m at t = 2 s; Hits ground at t = 4 s

GRAPHICAL INTERPRETATION MASTERY

Different Cases of Quadratic Graphs

Diagram 2: The Six Possible Graph Scenarios

Case 1: Two distinct real roots	Case 2: One repeated root
•	•	•
/ \	/ \	/ \
/	\	/	\	/	\
─•─────┼─•───── x	─┼─•──┼─ x

Case 3: No realrootsCase 4: Maximum, tworoots/ \\	//	\\	//	\\ //	\\//	\/\─┼───────────┼─x─•──•─ x

Case 5: Maximum, one root	Case 6: Maximum, no roots
\	/	\	/
\	/	\	/
\ /	\  /
\/	\/
/\
─┼─── x	─┼─── x

Key Insights:

Discriminant (b² - 4ac) determines the number of roots
Positive discriminant: Two distinct roots
Zero discriminant: One repeated root
Negative discriminant: No real roots

REVISION QUESTIONS
Explain the relationship between the roots of a quadratic equation and its coefficients.
Describe the step-by-step process for drawing an accurate quadratic graph.
How can you use a quadratic graph to solve equations other than the original?
What real-world situations can be modeled by quadratic equations? Provide specific examples.
How does the sign of the coefficient 'a' affect the shape of a quadratic graph?

ASSESSMENT

EVALUATION (IN-CLASS)
Find the quadratic equation whose roots are 5 and 2.
Find the quadratic equation whose roots are 0 and -7.
Find the sum and product of roots of 2�² − 6� + 5 = 0.
From the graph of � = �² − 2� − 3, find the axis of symmetry.
What is the minimum value of y in � = �² − 2� − 3?

ASSIGNMENT (TAKE-HOME)

Find the quadratic equation whose roots are 2 and − 1.
3	2
Draw the graph of � = 8 − 2� − �² for −5 ≤ � ≤ 3.
From your graph in Q2, find:
The roots of 8 − 2� − �² = 0
The roots of 8 − 2� − �² = 5
The maximum value of y
The product of two consecutive odd integers is 63. Form a quadratic equation and solve for the integers. (Hint: Let them be n and n + 2)
EXTENSION (CHALLENGE PROBLEMS)
The sum of the roots of a quadratic equation is 5 and the product is -14. Find the equation.
A quadratic graph passes through points (1, 0), (3, 0), and (0, 6). Find its equation.
The height of a projectile is given by ℎ =− 4�² + 16�. Find:
Maximum height reached
Time when height is 12 meters

STUDY TIPS AND COMMON PITFALLS

Tip 1: Always Verify Roots

Substitute back into the original equation
Check if they satisfy the equation

Tip 2: Choose Appropriate x-values

Include points around the vertex
Ensure you capture the curve's shape

Tip 3: Handle Fractions Carefully

Multiply through to clear denominators
Keep work neat and organized

Tip 4: Interpret Real-World Context

Reject solutions that don't make sense (negative lengths, etc.)
Include appropriate units in final answers

Common Pitfalls:

Forgetting the negative sign in �² − (𝑠�)� + (���𝑠𝑟) = 0
Incorrectly plotting points from the table of values
Drawing straight lines between points instead of smooth curves
Misidentifying maximum vs. minimum points

Memory Poem:

From roots to graphs, the story's told, Of equations brave and stories bold.
Sum and product, a magical pair, Create new equations from thin air!

Parabolas curve, both up and down, In every city, in every town.
Maximum profit, projectile's flight, Quadratic equations shine so bright!

So draw your graphs with careful hand, Across the coordinate land.
Find the roots, the vertex too,
The power of quadratics belongs to you!

Answers to Assessment

In-Class:

1. �² − 7� + 10 = 0
2. �² + 7� = 0
3. Sum = 3, Product = 2.5 4. x = 1
5. y = -4

Take-Home:

1. 6�² − � − 2 = 0
2. Graph should show inverted parabola with vertex at (-1, 9) 3. a) x = -4, 2; b) x ≈ -3, 1; c) Maximum y = 9
4. Integers are 7 and 9, or -9 and -7

Extension:

1. �² − 5� − 14 = 0
2. � = 2�² − 8� + 6
3. a) Maximum height = 16 m; b) t = 1 s or 3 s

WEEK 11: LOGICAL REASONING I

Concept: The Foundation of Mathematical Thinking and Proof

INTRODUCTION: THE BEDROCK OF MATHEMATICS

Beyond Numbers and Formulas

Mathematics is fundamentally about structured thinking, precise reasoning, and logical proof. Every mathematical argument, theorem, or solution depends on logical principles to determine validity.
Visual: The Logic Pyramid

MATHEMATICAL PROOFS
/	\
/	\
/	\
LOGICAL REASONING ← We are here!
/	\
/	\
SIMPLE STATEMENTS → COMPOUND STATEMENTS

Why Logical Reasoning Matters:

Distinguishes between valid and invalid arguments
Forms the basis of mathematical proofs
Essential for computer programming and algorithms
Critical for legal reasoning and scientific method
Helps detect fallacies in everyday thinking

Real-World Applications

Diagram 1: Logic in Everyday Life

COMPUTER SCIENCE	LAW & PHILOSOPHY
↓	↓
Boolean algebra		Legal arguments If-else statements		Logical proofs Circuit design	Ethical reasoning

SCIENTIFIC METHOD	EVERYDAY DECISIONS
↓	↓
Hypothesis testing	"If it's raining, Experimental design	then I'll take an umbrella" Evidence evaluation	"If I study, I'll pass"

Key Insight: Logic is the operating system of rational thought, whether in mathematics, science, or daily decision-making.

CONTENT

SIMPLE STATEMENTS (PROPOSITIONS)
Definition and Characteristics

A simple statement (or proposition) is a declarative sentence that can be clearly classified as either True (T) or False (F) — but not both, and not neither.
Visual: Statement Classification

All Sentences
│
┌───────┴───────┐
│	│
DECLARATIVE	NON-DECLARATIVE
SENTENCES	SENTENCES
│	│
Can be T/F	Questions, Commands,
│	Exclamations, Opinions
│
SIMPLE STATEMENTS
(True or False)

Mathematical Notation: We use lowercase letters: p, q, r, s to represent statements

Examples of Simple Statements

SymbolStatementTruth ValueReasoningp"Lagos is a city in Nigeria."True (T)Verifiable geographical factq"The human head is made of wood."False (F)Anatomically incorrectr"2 + 5 = 7"True (T)Mathematical truths"10 < 3"False (F)Mathematical falsehood

What is NOT a Simple Statement?

Visual: The "Not Statements" Gallery

QUESTIONS:	COMMANDS:	OPINIONS:
"What is your name?" "Pass the salt."	"This food is delicious."
↓	↓	↓
Asks something	Tells to act	Subjective feeling
No truth value	No truth value	No objective truth

OPEN SENTENCES:	EXCLAMATIONS:
"x + 3 = 8"	"Wow, amazing!"
↓	↓
Depends on x	Emotional expression
Not T/F until	Not T/F x is known
Detailed Analysis:

TypeExampleWhy Not a StatementQuestion"What time is it?"Asks rather than declaresCommand"Close the door."Instructs actionOpinion"Mathematics is beautiful."Subjective, not objectively verifiableOpen Sentence"x > 5"Truth depends on variable valueExclamation"Great job!"Expresses emotion

Critical Thinking Exercise

Analyze These Sentences:

"The square root of 16 is 4." → Statement (True)
"Please solve this problem." → Not statement (Command)
"This sentence is false." → Paradox (Neither T nor F consistently)
"Water boils at 100°C at sea level." → Statement (True)
"That movie was boring." → Not statement (Opinion)

TRUE AND FALSE STATEMENTS
Characteristics of Valid Statements

True Statements Must Be:

Objectively verifiable
Factually correct
Context-independent False Statements Are:
Objectively disprovable
Factually incorrect
Still valid statements (because they have a truth value)

Visual: The Truth Spectrum

OBJECTIVELY VERIFIABLE
/	\
/	\
TRUE STATEMENTS	FALSE STATEMENTS
↓	↓
"2 + 2 = 4"	"2 + 2 = 5"
"Nigeria is in Africa"	"Elephants can fly" "The sun is a star"	"The moon is cheese"

More Examples

True Statements:

p: "Nigeria gained independence in 1960."
q: "The sum of angles in a triangle is 180°."
r: "Water freezes at 0°C at standard pressure."

False Statements:
s: "There are 8 days in a week."
t: "Humans can breathe underwater."
u: "5 × 6 = 31"

Important: A false statement is still a valid statement because it has a definite truth value (False).

NEGATION OF SIMPLE STATEMENTS
Concept and Symbolism

The negation of a statement expresses its logical opposite — it denies the original statement.

Symbol: ∼
Read as: "not"

The negation of p is written as ∼ p and read as "not p."

Visual: The Negation Machine

INPUT: pOUTPUT: ∼ p"It is raining"→"It is not raining""2 + 2 = 4"→"2 + 2 ≠ 4""x < 5"→"x ≥ 5"

Forming Correct Negations

Method 1: Add "It is not the case that..."

p: "Monday is the first day of the week."
∼ p: "It is not the case that Monday is the first day of the week."

Method 2: Insert "not" grammatically

p: "All cats are black."
∼ p: "Not all cats are black." or "Some cats are not black."

Method 3: Reverse mathematical relations

p: "x > 5" → ∼ p: "x ≤ 5"
q: "a = b" → ∼ q: "a ≠ b"

Truth Table for Negation

Visual: The Negation Switch

When p is ON (True)	When p is OFF (False)
○
ON	OFF
│	│
↓	↓
∼ p is OFF (False)	∼ p is ON (True)
●

Formal Truth Table:

p∼ pVerbal ExampleTFp: "It is raining" (True)∼ p: "It is not raining" (False)FTp: "2 + 2 = 5" (False)∼ p: "2 + 2 ≠ 5" (True)Key Rule: Negation always flips the truth value.

DETAILED WORKED EXAMPLES
Example 11.1: Identifying Statements

Which of the following are simple statements? For those that are, state their truth value.

"The year 2024 is a leap year."
"Solve the equation."
"Red is a beautiful colour."
d) "5 - 1 = 3"
e) "x > 10"

Step-by-Step Analysis:

"The year 2024 is a leap year."
DECLARATIVE, VERIFIABLE
STATEMENT, Truth Value: TRUE (2024 ÷ 4 = 506, no remainder)

"Solve the equation."
COMMAND, INSTRUCTS ACTION
NOT A STATEMENT

"Red is a beautiful colour."
OPINION, SUBJECTIVE
NOT A STATEMENT

d) "5 - 1 = 3"
DECLARATIVE, MATHEMATICALLY VERIFIABLE
STATEMENT, Truth Value: FALSE (5 - 1 = 4 ≠ 3)

e) "x > 10"
OPEN SENTENCE, DEPENDS ON x
NOT A STATEMENT (until x is specified)

✅ Answer: Only (a) and (d) are statements.

Example 11.2: Writing Negations

Write the negation of each statement:
p: "Monday is the first day of the week."
q: "A triangle does not have 4 sides."
c) r: "10 ≥ 7"

Solution:

p: "Monday is the first day of the week."
∼ p: "Monday is not the first day of the week."
OR: "It is not the case that Monday is the first day of the week."

q: "A triangle does not have 4 sides."
∼ q: "A triangle has 4 sides."
(Note: We remove the "not" rather than adding another one)

r: "10 ≥ 7" (10 is greater than or equal to 7)
∼ r: "10 < 7" (10 is less than 7) (Mathematical opposite of "≥" is "<")

Critical Thinking: The negation must completely reverse the meaning, not just add "not" carelessly.

Example 11.3: Truth Values of Negations

Let:

p: "A square has four equal sides." (True)
q: "2 is an odd number." (False) Find the truth values of: a) ∼ p b) ∼ q Solution:
p is True → ∼ p must be False
∼ p: "A square does not have four equal sides." → FALSE
q is False → ∼ q must be True
∼ q: "2 is not an odd number." → TRUE

Summary Table:

StatementTruth Value
NegationNegation Truth Valuep: A square has four equal sides.T∼ p: A square does not have four equal sides.Fq: 2 is an odd number.F∼ q: 2 is not an odd number.T

Practice Exercise: Tricky Negations

Original: "All cats are black."
Common Mistake: "No cats are black." (Wrong!)
Correct Negation: "Not all cats are black." or "Some cats are not black."

Why this is correct:

If "All cats are black" is False, it doesn't mean "No cats are black"
It only means "There exists at least one cat that is not black"

Visual Understanding:

"All cats are black"	Negation: "Not all cats are black"
●●●●●●●●●●●	●●●●○●●●●●●
(All black)	(Most black, but one isn't)

THE IMPORTANCE OF LOGICAL REASONING
Real-World Applications

Diagram 2: Logic Across Disciplines
MATHEMATICS	COMPUTER SCIENCE
↓	↓
Proofs and theorems	Boolean logic Valid arguments	If-then programming
Circuit design

LAW & PHILOSOPHY	EVERYDAY THINKING
↓	↓
Legal reasoning	Critical thinking Argument analysis	Detecting fallacies Ethical proofs	Decision making

SCIENCE	MEDICINE
↓	↓
Hypothesis testing	Diagnostic logic Experimental design	Symptom analysis Evidence evaluation	Treatment decisions

Common Logical Fallacies in Everyday Life

Ad Hominem: Attacking the person instead of the argument

"Your idea is wrong because you're young."

False Cause: Assuming causation from correlation

"I wore red and won, so red is lucky."

Hasty Generalization: Drawing conclusions from insufficient evidence

"I met one rude person from that city, so everyone there is rude."

Appeal to Emotion: Using emotions rather than logic

"You should agree with me because it will make me happy."

REVISION QUESTIONS
What two conditions must a sentence satisfy to be considered a "simple statement"?
Provide one example each of: a command, an opinion, and an open sentence.
Explain the symbol and meaning of negation in logic.
If statement p is False, what must be the truth value of ∼ p? Why?
Create a truth table for negation and explain what it demonstrates.

ASSESSMENT

EVALUATION (IN-CLASS)
Which of the following are simple statements? a) "Good morning!" b) "5 is a prime number." c) "He is very smart."
Write the negation of p: "The sun rises in the West."

What is the truth value of the negation you wrote in Q2?

Let q be "4 + 4 = 8." State the truth value of q and ∼ q.

Write the negation of r: "x < 5."

ASSIGNMENT (TAKE-HOME)
Write three true simple statements and three false simple statements from different categories (mathematics, geography, science).
Write the negation of each: a) p: "All birds can fly." b) q: "A rhombus is not a square." c) r: "12 is a multiple of 5." d) s: "A student is present."
State the truth value of each negation from Q2.

Let p be "x = 3" and q be "x² = 9."
If x = 3, what are the truth values of p and q?
If x = -3, what are the truth values of p and q?
Critical Thinking: Explain why "This statement is false" creates a logical paradox and cannot be a simple statement.
EXTENSION / ENRICHMENT

Visualization Activity:

Create "Logic Cards" with statements on one side and their truth values on the back
Practice identifying statements vs. non-statements in newspaper headlines

Group Discussion:

"Is mathematics discovered or invented?" - Analyze the arguments logically
"Can artificial intelligence truly think?" - Apply logical reasoning to this question

Real-World Investigation:

Find three examples of logical fallacies in advertisements
Analyze a political argument and identify any logical errors

COMMON PITFALLS AND TIPS

Pitfall 1: Confusing opinions with statements
Tip: Ask "Can this be objectively verified as true or false?"

Pitfall 2: Incorrect negation formation
Tip: Always check if the negation completely reverses the original meaning

Pitfall 3: Overlooking mathematical opposites
Tip: Remember: < → ≥, > → ≤, = → ≠

Pitfall 4: Treating open sentences as statements
Tip: Look for variables - if present, it's not a simple statement
Memory Poem:

Simple statements, true or false, That's the logic we must solve.
Declarative and clear they stand, With truth values close at hand.

Negation flips what is declared, The opposite is what is shared. If true becomes a falsehood new, If false becomes a statement true.

In math and life and computer's core, It's logic that we all adore.
So think with care and reason well, As logic's stories we now tell!

Answers to Assessment

In-Class:

a) Not statement (greeting), b) Statement (True), c) Not statement (opinion)
∼ p: "The sun does not rise in the West." or "It is not the case that the sun rises in the West."
True (since p is false)
q: True, ∼ q: False
5.  ∼ r: "x ≥ 5"

Take-Home:

Examples: True - "Paris is in France", "7 × 8 = 56", "Water is H₂O"; False - "Rome is in Asia", "9 - 4 = 6", "Fish breathe air"
a) "Not all birds can fly" or "Some birds cannot fly"; b) "A rhombus is a square"; c) "12 is not a multiple of 5"; d) "A student is not present"
a) True, b) False, c) True, d) Depends on context
When x=3: p=True, q=True; When x=-3: p=False, q=True
If it's true, then it says it's false (contradiction). If it's false, then it says it's true (contradiction). Therefore, it cannot have a consistent truth value.

WEEK 12: LOGICAL REASONING II

Concept: Building Complex Arguments from Simple Statements Using Logical Connectives

INTRODUCTION: FROM SIMPLE TO COMPOUND REASONING
Building on Week 11 Foundations

Last Week (Simple Statements):

p: "It is raining." (True/False)
q: "I will take an umbrella." (True/False) Individual statements with definite truth values

This Week (Compound Statements):

p → q: "If it is raining, then I will take an umbrella." A complex relationship connecting simple statements

Visual: The Logic Building Process

SIMPLE STATEMENTS → LOGICAL CONNECTIVES → COMPOUND STATEMENTS
p, q, r	∧, ∨, →, ↔	p∧q, p∨q, p→q
↓	↓	↓
"It is raining"	"AND, OR, IF"	"If it rains, I take umbrella"
"I take umbrella"	"It's raining AND I take umbrella"

Real-World Significance:

Computer programming: if-else conditions
Legal contracts: "If party A fails to deliver, then party B may terminate"
Scientific reasoning: "If hypothesis is true, then we expect these results"
Everyday decisions: "If it's weekend, then I'll sleep late"

The Power of Logical Connections

Diagram 1: Logic in Everyday Decision Making

WEATHER DECISIONS	ACADEMIC PLANNING
↓	↓
If raining → take umbrella	If exam → then study If sunny → go to park	If weekend → then relax

COMPUTER PROGRAMMING	MEDICAL DIAGNOSIS
↓	↓
If user_input = "yes"	If fever AND cough Then proceed	Then suspect infection
Else ask again	Else check other symptoms

Key Insight: Compound statements allow us to model complex real-world conditions and relationships.

CONTENT

COMPOUND STATEMENTS: THE BUILDING BLOCKS
Definition and Concept

A compound statement joins two or more simple statements using logical operators
(connectives).

Visual: Compound Statement Structure

Simple Statement 1
↓Logical Operator
↓Simple Statement 2
↓"It is raining""AND""I am cold"│││└───────────────────┴──────────────────┘
↓ Compound Statement:
"It is raining AND I am cold"

Mathematical Notation:

p, q, r represent simple statements
∧, ∨, →, ↔ represent logical operators
∼ represents negation

THE FOUR FUNDAMENTAL LOGICAL OPERATORS
CONJUNCTION ("AND") - The Demanding Operator

Symbol: ∧
Read as: "p and q"
Form: p ∧ q

Rule: True only when both p and q are True
Visual: The AND Gate

p ●─────┐
AND → p∧q q ●─────┘

TRUTH TABLE:
p	q	p∧q
●	●	(Both ON → ON)
○	○	(One OFF → OFF)
●	○	(One OFF → OFF)
○	○	(Both OFF → OFF)

Formal Truth Table:

pqp ∧ qExplanationTTTBoth true → Statement trueTFFOne false → Statement falseFTFOne false → Statement falseFFFBoth false → Statement falseReal-World Example:

p: "You have a ticket" (True) q: "The show is today" (True)
p∧q: "You have a ticket AND the show is today" → True

But if either is false, the whole statement becomes false.

Memory Aid: "AND demands perfection - both must be true!"

DISJUNCTION ("OR") - The Inclusive Operator

Symbol: ∨ Read as: "p or q" Form: p ∨ q
Rule: False only when both p and q are False
(This is INCLUSIVE OR - one, the other, or both)

Visual: The OR Gate

p ●─────┐
OR → p∨q q ●─────┘

TRUTH TABLE:
p	q	p∨q
●	●	(Both ON → ON)
○	●	(One ON → ON)
●	●	(One ON → ON)
○	○	(Both OFF → OFF)

Formal Truth Table:

pqp ∨ qExplanationTTTBoth true → Statement trueTFTOne true → Statement trueFTTOne true → Statement trueFFFBoth false → Statement falseReal-World Example:

p: "I will have tea" (True/False) q: "I will have coffee" (True/False)
p∨q: "I will have tea OR coffee" → True if I have either or both

Only false if I have neither tea nor coffee.

Important Note: This is inclusive OR (mathematical sense), not exclusive OR (either/or but not both).
Memory Aid: "OR is generous - just one true makes it true!"

CONDITIONAL ("IF... THEN...") - The Implication Operator

Symbol: →
Read as: "If p, then q" or "p implies q"
Form: p → q

Components:

p: Antecedent (condition)
q: Consequent (result)

Rule: False only when p is True and q is False

Visual: The IF-THEN Relationship

p (Condition) → [IF-THEN] → q (Result)
↓	↓
"It is raining"	"Ground is wet"

TRUTH TABLE:
p	q	p→q
●	●	(Rain + Wet → Promise kept)
○	○	(Rain + Dry → Promise broken)
●	●	(No rain + Wet → Promise not broken)
○	●	(No rain + Dry → Promise not broken)

Formal Truth Table:
pqp → qExplanationTTTCondition true, result true → Promise keptTFFCondition true, result false → Promise brokenFTTCondition false → Promise not applicableFFTCondition false → Promise not applicable
Real-World Example:

p: "It is raining" (Condition) q: "The ground is wet" (Result)
p→q: "If it is raining, then the ground is wet"

The ONLY time this is false: It's raining but ground is dry.

Counterintuitive but Important: When the condition (p) is false, the entire statement is considered true by convention.
Memory Aid: "IF-THEN only fails when the promise is broken!"

BICONDITIONAL ("IF AND ONLY IF") - The Equality Operator

Symbol: ↔
Read as: "p if and only if q" (abbreviated "iff")
Form: p ↔ q

Meaning: p and q must have the same truth value Equivalent to: (p → q) ∧ (q → p)
Visual: The IFF Relationship

p ●─────┐
IFF → p↔q q ●─────┘
TRUTH TABLE:
p	q	p↔q
●	●	(Both same → True)
○	○	(Different → False)
●	○	(Different → False)
○	●	(Both same → True)

Formal Truth Table:

pqp ↔ qExplanationTTTBoth true → EquivalentTFFDifferent values → Not equivalentFTFDifferent values → Not equivalentFFTBoth false → EquivalentReal-World Example:

p: "A figure is a square"
q: "A figure has four equal sides and four right angles"
p↔q: "A figure is a square IF AND ONLY IF it has four equal sides and four right angles"

Both describe exactly the same condition.

Memory Aid: "IFF requires perfect matching - both true or both false!"

COMPREHENSIVE WORKED EXAMPLES
Example 12.1: Translation Between English and Symbols

Given:

p: "The food is hot"
q: "The drink is cold"
Translate to Symbolic Form:

English StatementSymbolic FormStep-by-Step Breakdown"The food is hot and the drink is cold"p ∧ qSimple conjunction"The food is not hot or the drink is cold"∼ p ∨ qNegation + disjunction"If the food is hot, then the drink is not cold"p → (∼ q)Conditional with negationVisual Translation Process:

English: "If the food is hot, then the drink is not cold"
│	│	│	│	│
│	│	│	│	└─ "not cold" = ∼ q
│	│	│	└─ "then" indicates →
│	│	└─ "if" starts conditional
│	└─ "food is hot" = p
└─ Entire structure: p → (∼ q)

Example 12.2: Evaluating Truth Values

Given:

p: "Lagos is in Ghana" → False (Lagos is in Nigeria)
q: "2 × 3 = 6" → True

Evaluate: "If Lagos is in Ghana, then 2 × 3 = 6"

Step-by-Step Solution:

Step 1: Identify the form: p → q
Step 2: Substitute truth values: F → T
Step 3: Consult truth table for conditional: p	q	p→q
F	T	T
Step 4: Therefore, the statement is TRUE
Explanation: Even though the condition (p) is false, the conditional statement as a whole is considered true because there's no case where the condition is true but the result is false.
Counterintuitive Insight: In logic, a false premise can lead to a true conditional statement. This preserves the consistency of mathematical reasoning.

Example 12.3: Truth Table Construction

Construct truth table for: p ∧ ∼ q

Step-by-Step Construction:

Step 1: List all possible truth combinations for p and q Step 2: Add column for ∼ q (negation of q)
Step 3: Add column for p ∧ ∼ q (conjunction of p and ∼ q)

pq∼ qp ∧ ∼ qTTFFTFTTFTFFFFTF
Visual Table Construction:

Start:
p	qStep 2:
p	q
∼ qStep 3:
p	q
∼
q
p∧∼ qT	TT	TFT	TFFT	FT	FTT	FTTF	TF	TFF	TFFF	FF	FTF	FTF
Interpretation: The compound statement p ∧ ∼ q is true only when p is true AND q is false.

ADVANCED CONCEPTS
Logical Equivalences and Special Cases

Tautology: A statement that is always true regardless of truth values

Example: p ∨ ∼ p ("It is raining or it is not raining")
Truth table: Always T

Contradiction: A statement that is always false regardless of truth values

Example: p ∧ ∼ p ("It is raining and it is not raining")
Truth table: Always F

Visual: Tautology vs Contradiction

TAUTOLOGY (Always True)	CONTRADICTION (Always False) p	∼ p	p∨∼ p		p	∼ p	p∧∼ p
T	F	T	T	F	F
F	T	T	F	T	F
↑	↑
Always true!	Always false!

REAL-WORLD APPLICATIONS AND PATTERNS

Application 1: Computer Programming
IF (user_age >= 18) AND (has_id = True) THEN grant_access = True
ELSE
grant_access = False END IF
Application 2: Legal Reasoning
IF (contract_signed = True) AND (payment_made = True) THEN obligation_fulfilled = True
ELSE
obligation_fulfilled = False

Application 3: Scientific Hypothesis Testing
IF (hypothesis = True) THEN (predicted_result = True) Actual: (predicted_result = False)
CONCLUSION: Therefore, (hypothesis = False)

COMMON PITFALLS AND TIPS

Pitfall 1: Confusing inclusive vs exclusive OR Tip: Mathematical "OR" (∨) is inclusive - remember "one or both"
Pitfall 2: Misunderstanding conditional statements Tip: p → q is only false when p is true and q is false
Pitfall 3: Incorrect negation placement Tip: Use parentheses to group: p → ∼ q means "if p then not q"
Pitfall 4: Forgetting truth table patterns Tip: Create memory aids:

AND: T only with T,T
OR: F only with F,F
→: F only with T,F
↔: T only with same values

Study Strategy: Practice building truth tables systematically:

List all variable combinations
Compute inner operations first
Work outward through parentheses
Verify with real-world examples

REVISION QUESTIONS
What distinguishes a compound statement from a simple statement?
Explain the four logical operators with their symbols and truth conditions.
Why is p → q considered true when p is false?
How is the biconditional operator different from the conditional operator?
Provide real-world examples of each logical operator in action.
What are tautologies and contradictions? Give examples.
How do logical operators relate to computer programming?

ASSESSMENT

EVALUATION (IN-CLASS)
Let p = "It is sunny" and q = "It is hot." Write "It is not sunny and it is hot" in symbols.
Let p = T and q = T. What is the truth value of p → (∼ q)?
Let p = F and q = F. What is the truth value of p ↔ q?
Construct the truth table for p ∨ ∼ q.
Identify the antecedent in: "If x = 2, then x² = 4."

ASSIGNMENT (TAKE-HOME)
Let p = "You are in SS1" and q = "You study Maths." Translate into English: a) p ∧ q b) ∼ p ∨ q
q → p

Let p = "An elephant can fly" (F), q = "A square has 4 sides" (T). Find truth values of: a) p ∧ q b) p ∨ q c) p
→ q d) ∼ q → p

Construct truth table for (p ∨ q) → p.
Construct truth table for (p → q) ∧ (q → p) and verify it matches p ↔ q.

A statement that is always True is a Tautology (e.g., p ∨ ∼ p). A statement that is always False is a Contradiction (e.g., p ∧ ∼ p). Construct truth table for p ∧ ∼ p and state whether it's a tautology or contradiction.
EXTENSION (CHALLENGE PROBLEMS)
Create a truth table for (p → q) ∨ (q → p). What pattern do you notice?
Using truth tables, prove that ∼ (p ∧ q) is equivalent to (∼ p ∨ ∼ q).
Design a logical expression for a security system that grants access if:
The user has a valid ID AND knows the password, OR
The user has admin privileges AND the system is in maintenance mode

VISUAL SUMMARY AND MEMORY AIDS

Diagram 2: Logical Operators Quick Reference

CONJUNCTION (AND) ∧	DISJUNCTION (OR) ∨
T only with T,T	F only with F,F "Both must be true"	"At least one true"

CONDITIONAL (→)	BICONDITIONAL (↔)
F only with T,F	T only with same values "Promise broken"	"Perfect match"

Truth Table Patterns:

pqp∧qp∨qp→qp↔qTTTTTTTFFTFFFTFTTFFFFFTTMemory Poem:

Compound statements, logical might, Connect with AND, OR, day and night. IF-THEN promises we must keep,
IFF makes equivalence deep.

Truth tables show how values flow, With T and F in perfect row.
AND wants both to be so true, OR is happy with just a few.

IF-THEN fails with T and F, IFF matches, that's the test.
In math and code and thoughtful art, It's logic playing its smart part!

Answers to Assessment

In-Class:

∼ p ∧ q
F (since p is T, ∼ q is F, so T → F is F)
T (since both F, so same values)

pq∼ qp∨∼ qTTFTTFTTFTFFFFTT5."x = 2"
Take-Home:
a) "You are in SS1 and you study Maths" b) "You are not in SS1 or you study Maths" c) "If you study Maths, then you are in SS1"
a) F (F∧T = F) b) T (F∨T = T)
c) T (F→T = T) d) F (∼ q is F, so F→F = T? Wait: ∼ q means "A square does not have 4 sides" = F, so F→F = T)

pqp∨q(p∨q)→pTTTTTFTTFTTFFFFTpqp→qq→p	(p→q)∧(q→p)p↔qTTTT	TTTFFT	FFFTTF	FFFFTT	TTThey match!

5.
p	∼ p	p∧∼ p T	F	F
F	T	F
This is a CONTRADICTION (always false)

WEEK 13: REVISION, EXAMINATION & CLOSING
Concept: Mastering Mathematical Connections and Building Exam Confidence

INTRODUCTION: THE MATHEMATICAL JOURNEY REVIEW

From Foundation to Mastery

Visual: Our Mathematical Journey Map

TERM 1 ROADMAP:
WEEK 1: Number Bases	→ WEEK 2: Modular Arithmetic
↓	↓
WEEK 3: Indices	→ WEEK 4: Logarithms
↓	↓
WEEK 6: Log Calculations	→ WEEK 8: Variation
↓	↓
WEEK 9: Quadratics I	→ WEEK 10: Quadratics II
↓	↓
WEEKS 11-12: Logical Reasoning → WEEK 13: MASTERY!

Key Insight: Mathematics builds cumulatively - each topic connects to and reinforces the others. Understanding these connections is the key to true mastery.

COMPREHENSIVE REVISION STRATEGY

The Three-Level Revision Approach

Level 1: Conceptual Understanding (Know the "Why")

Definitions, principles, and relationships
Why formulas work the way they do

Level 2: Procedural Fluency (Know the "How")

Step-by-step methods and algorithms
Problem-solving techniques

Level 3: Application Mastery (Know the "When")
Real-world applications
Recognizing which tools to use when

TOPIC-BY-TOPIC REVISION GUIDE

WEEK 1 – NUMBER BASE SYSTEMS

Core Concept: Different ways of representing numbers

Visual: Base Conversion Relationships

Binary (Base 2) ←→ Decimal (Base 10) ←→ Other Bases 1101₂	=	13₁₀	=	15₈

Key Formulas:

To Decimal: Expand using place values
From Decimal: Repeated division/multiplication

✅ Self-Check Challenge:

Convert 1101₂ to Base 10 → 13₁₀
Express 75₁₀ in Base 5 → 300₅
3.  Add 243₅ + 132₅ → 430₅
4. Explain Base 8 → Uses digits 0-7, each place = power of 8 Common Pitfall: Forgetting that "10" in any base equals that base value

⏰ WEEK 2 – MODULAR ARITHMETIC

Core Concept: Mathematics of cycles and remainders

Visual: The Modular Clock
Mod 5 System:  0 → 1 → 2 → 3 → 4 → 0 → 1 ...
│	│
Equivalent	Equivalent

Key Insight: a ≡ b (mod m) means (a - b) is divisible by m

✅ Self-Check Challenge:

1.  17 (mod 5) → 2
Wednesday + 100 days → 100 mod 7 = 2 → Friday
Explain 7 ≡ 2 (mod 5) → 7-2=5, divisible by 5
4.  (8 + 15) mod 6 → 23 mod 6 = 5

Memory Aid: "Modular arithmetic = clock mathematics"

⚡	WEEK 3 – INDICES (EXPONENTS)

Core Concept: Efficient representation of repeated multiplication

Visual: The 7 Laws of Indices

Multiplication: aᵐ × aⁿ = aᵐ⁺ⁿ
Division: aᵐ ÷ aⁿ = aᵐ⁻ⁿ
Power of Power: (aᵐ)ⁿ = aᵐⁿ
Zero Power: a⁰ = 1
Negative: a⁻ⁿ = 1/aⁿ
Fractional: a¹/ⁿ = ⁿ√a
Combined: aᵐ/ⁿ = (ⁿ√a)ᵐ

✅ Self-Check Challenge:

1. 2³ × 2⁵ → 2⁸ = 256
2. (3²)⁴ → 3⁸ = 6561
3.   Solve 9ˣ = 27 → x = 1.5
4. 1/8 as power of 2 → 2⁻³
Pro Tip: When bases differ, convert to same base first

WEEK 4 – INTRODUCTION TO LOGARITHMS

Core Concept: The inverse of exponentiation

Visual: The Exponent-Logarithm Relationship

Exponential:	10³ = 1000 Logarithmic:	log₁₀1000 = 3
│	│
└─── INVERSE ──┘

Key Formulas:

logₐb = c means aᶜ = b
Characteristic = integer part from power of 10
Mantissa = decimal part from log tables

✅ Self-Check Challenge:

3⁴ = 81 in log form → log₃81 = 4
Characteristic of log₁₀(0.045) → 2̄ (from 4.5 × 10⁻²)
3. log₁₀(12.5) using tables → ≈ 1.0969
4. Three basic log laws → log(ab)=log a+log b, log(a/b)=log a-log b, log aᵇ=b log a

WEEK 6 – LOGARITHMIC CALCULATIONS

Core Concept: Using logs as a "human calculator"

Visual: The Logarithmic Transformation

Complex Operations→Simple OperationsMultiplication→AdditionDivision→SubtractionPowers→MultiplicationRoots→Division
✅ Self-Check Challenge:

1. 32 × 2.5 using logs → log32 + log2.5 ≈ 1.5051 + 0.3979 = 1.9030 → antilog ≈ 80
Cube root using logs → divide log by 3, then antilog
Explain log(ab) = log a + log b → because aᵐ × aⁿ = aᵐ⁺ⁿ

Real-World Connection: This is how calculations were done before calculators!

WEEK 8 – VARIATION

Core Concept: Mathematical relationships between changing quantities

Visual: Variation Types

Direct: y = kx	(both increase together) Inverse: y = k/x	(one increases, other decreases) Joint: y = kxz	(depends on multiple variables) Combined: y = kx²/z	(mix of direct and inverse)
✅ Self-Check Challenge:

y ∝ x², y=8 when x=2, find y when x=5 → y = 50
y ∝ 1/x², x doubles → y becomes ¼
Make k subject in y = k/x² → k = yx²

Memory Aid: "Direct = same direction, Inverse = opposite direction"

WEEK 9 – QUADRATICS I (FACTORIZATION)

Core Concept: Solving second-degree equations by factoring

Visual: The Zero Product Principle
If A × B = 0, then A=0 OR B=0
↓
(x - 2)(x - 3) = 0
↓
x = 2 OR x = 3

✅ Self-Check Challenge:

1.  Factorize 3x² - 7x + 2 → (3x - 1)(x - 2)
2.  Solve x² + 5x = 14 → x² + 5x - 14 = 0 → (x + 7)(x - 2) = 0 → x = -7, 2
3. Check solution → substitute back into original equation Pro Tip: Always check your factors by expanding back

WEEK 10 – QUADRATICS II (ROOTS & GRAPHS)

Core Concept: Complete understanding of quadratic behavior

Visual: From Roots to Graph

Roots: α and β
↓
Equation: x² - (α+β)x + αβ = 0
↓
Graph: Parabola with vertex, axis of symmetry

Key Formulas:

Sum of roots = -b/a
Product of roots = c/a
Vertex x-coordinate = -b/2a

✅ Self-Check Challenge:

Roots 2 and 3 → x² - 5x + 6 = 0
Quadratic formula → x = [-b ± √(b² - 4ac)]/(2a)
Graph of y = x² + 3x + 2 → U-shaped, roots at -1 and -2, vertex at (-1.5, -0.25)

WEEKS 11-12 – LOGICAL REASONING

Core Concept: Systematic thinking and argument analysis

Visual: Logical Operator Summary

Conjunction (AND ∧): T only with T,T Disjunction (OR ∨): F only with F,F Conditional (→): F only with T,F Biconditional (↔): T only with same values
✅ Self-Check Challenge:

Identify statements → only declarative sentences with truth values
Negation of "The sun rises in the east" → "The sun does not rise in the east"
p ∨ q is False when → both p and q are False
p → q is False when → p is True and q is False
Truth table for (p ∨ q) → p → shows it's not always true Critical Thinking: Logic helps detect fallacies in everyday arguments

4. EXAMINATION PREPARATION MASTERY

The 4-Pillar Success Strategy

Pillar 1: Conceptual Clarity

Before memorizing formulas, understand:
Why the formula works
When to apply it
What the variables represent
Pillar 2: Procedural Practice

Systematic problem-solving:
Understand the problem
Choose the right method
Execute carefully
Verify your answer

Pillar 3: Time Management

Exam strategy:
Scan entire paper first
Start with confident questions
Allocate time proportionally
Leave time for review

Pillar 4: Error Analysis

Learn from mistakes:
Keep an error log
Identify patterns in errors
Practice similar problems

Exam-Specific Tips

Multiple Choice Questions:

Eliminate obviously wrong answers first
Watch for "none of the above" and "all of the above"
Check units and dimensions

Show-Your-Work Problems:

Write steps clearly and logically
Include units where appropriate
Box your final answer
Even if stuck, show partial work for partial credit

Word Problems:

Underline key information
Define variables clearly
Write down what you're looking for
Check if answer makes sense in context

INTERCONNECTIONS REVIEW

How Topics Connect

Diagram: The Mathematical Web

Number Bases → Modular Arithmetic → Computer Science
↓	↓
Indices → Logarithms → Scientific Notation
↓	↓
Quadratic Equations → Graphs → Real-World Modeling
↓	↓
Logical Reasoning → Proofs → Critical Thinking

Key Connections:

Logarithms are the inverse of indices
Quadratic graphs visualize quadratic equations
Logical reasoning underpins mathematical proofs
Modular arithmetic relates to computer number systems

MINDset FOR SUCCESS

Building Mathematical Confidence

Growth Mindset Statements:

"Mistakes are learning opportunities"
"I can improve with practice"
"Challenge strengthens understanding"
"Every problem has a solution path"

Exam Mindset:

"I am prepared and capable"
"I will read questions carefully"
"I will manage my time wisely"
"I will check my work thoroughly"

CLOSING REFLECTION & LEGACY

Your Mathematical Journey

What You've Gained:

Analytical thinking skills that transfer to all subjects
Problem-solving strategies for academic and real-life challenges
Logical reasoning abilities for clear, critical thinking
Mathematical confidence that builds with each success

Visual: The Mathematical Mindset

From: "I can't do math"
↓
To: "I haven't figured it out yet"
↓
To: "I understand the pattern"
↓
To: "I can explain it to others"

Final Words of Wisdom

"Mathematics is not about speed; it's about depth of understanding. It's not about memorization; it's about pattern recognition.
It's not about getting the right answer; it's about the journey of reasoning that leads you there.

The skills you've developed this term—logical thinking, systematic problem-solving, attention to detail—will serve you far beyond the mathematics classroom. They are the foundation of scientific discovery, technological innovation, and informed citizenship.
As you prepare for your examination, remember that you are not just recalling facts—you are demonstrating your ability to think, to reason, and to solve problems. That is the true value of mathematics education."

FINAL PREPARATION CHECKLIST
✅ Last-Minute Review

The Night Before:

Review formula sheet and key definitions Get adequate sleep (7-8 hours)
Prepare materials: calculator, pencils, ruler

Exam Morning:

Eat a healthy breakfast Arrive early and relaxed
Review mental strategies

During Exam:

Read instructions carefully Manage time effectively Show all work clearly
Review answers if time permits

Final Encouragement: "You have worked diligently through this term. You have solved complex problems, mastered new concepts, and developed your reasoning abilities. Trust in your preparation, believe in your capabilities, and approach this examination with confidence. You are ready!"
Best wishes for your examination and continued mathematical journey!	✨

SS1 MATHEMATICS LESSON NOTES
SECOND TERM

WEEK 1: CONSTRUCTIONS I

INTRODUCTION
Welcome to the Second Term! We will begin with Geometric Constructions. This is a foundational skill in geometry that involves drawing accurate geometric figures using only two simple tools:
An unmarked straightedge (a ruler, used only for drawing straight lines).
A pair of compasses (used for drawing circles and arcs).
A protractor may be used only to check your work at the end, not to create the angle. The goal is to create perfect geometric shapes based on pure principles.
Why Pure Constructions?
Geometric constructions date back to ancient Greece, where mathematicians like Euclid established that perfect geometric figures could be created using only these two tools. This demonstrates the elegance and precision of mathematical reasoning.

CONTENT

BISECTION OF ANGLES
"To bisect" means to cut something into two equal halves.
Procedure: To Bisect any Angle ∠ABC
Step 1: Place the compass point at the vertex of the angle (�).
Step 2: Draw an arc that cuts both arms of the angle (at points � and �).
Step 3: Place the compass point at � and draw an arc in the middle of the angle.
Step 4: Without changing the compass radius, place the point at � and draw another arc to intersect the first arc (at point �).
Step 5: Use your straightedge to draw a line from the vertex � through the intersection point �. This line �� has now perfectly bisected ∠���. (∠��� = ∠���).

142
Illustration:
A
/
/
/ R (intersection)
/ / \
//	\
B		C P	Q

Detailed Diagram:
Step 1-2: Draw arc from B
A
/
/
/	P
/--
B	C
---		 Q

Step 3-4: Draw arcs from P and Q
A
/
/ * R (arcs intersect)
/ /\
/ P/   \Q B	C

Step 5: Draw line BR A
/|
/ |
/ |R
/	|
B	+	C

CONSTRUCTION OF ANGLES 60° AND 90°

Construction of 60° (The "Equilateral Triangle" Method) Step 1: Draw a straight line and mark a point � on it.
Step 2: Place your compass point on � and draw a wide arc (a semi-circle) that cuts the line at point �.

143
Step 3: Without changing the compass radius, move the compass point to �.
Step 4: Draw a new arc that intersects the first arc at a point �.
Step 5: Draw a straight line from � through �.
The angle ∠RPQ is exactly 60°. (This works because you have essentially drawn an equilateral triangle).
Illustration:
R
/|\
/ | \
/ |  \
/ 60°\   \ P	+	Q
Why This Works:
When you draw arcs of equal radius from � and �, the triangle ��� has three equal sides (�� = �� = ��), making it equilateral. All angles in an equilateral triangle are 60°.

Construction of 90° (The "Perpendicular" Method)
Step 1: Draw a straight line and mark a point � in the middle.
Step 2: Place your compass point on � and draw an arc that cuts the line on both sides of � (at points � and �).
Step 3: Increase the radius of your compasses.
Step 4: Place the point on � and draw a large arc above the line.
Step 5: Without changing the radius, place the point on � and draw another arc to intersect the one from Step 4 (at point �).
Step 6: Draw a straight line from � through �.
The angle ∠ZPY is exactly 90°. Illustration:
Z
|
|
|
X	P	Y
|
|
(mirror arc below)

144
Detailed Step-by-Step:
Step 2: Equal arcs from P
 	X	P	Y

Step 4-5: Large arcs from X and Y Z (intersection)
/|\
/ | \
/ |  \
X	P	Y
\ |  /
\ | /
\|/
W (lower intersection)

CONSTRUCTION OF 30° AND 45°
These angles are made by bisecting the angles we just built.
Construction of 30°:
First, construct a 60° angle.
Then, follow the steps for angle bisection (from section A) to bisect the 60° angle.
The result is two 30° angles.
Illustration:
R
/|
/ |
/ |30°
/ 30°\ P	Q
(60° divided into 30° + 30°)

Construction of 45°:
First, construct a 90° angle.
Then, follow the steps for angle bisection to bisect the 90° angle.
The result is two 45° angles.
Illustration:
Z
|
/|
/ |45°
/ 45°
P	Y

145

D. CONSTRUCTION OF TRIANGLES
To construct a unique triangle, you need at least three pieces of information:
SSS (Side-Side-Side) – All three sides known
SAS (Side-Angle-Side) – Two sides and the included angle
ASA (Angle-Side-Angle) – Two angles and the included side
RHS (Right angle-Hypotenuse-Side) – For right-angled triangles
General Steps for Triangle Construction:
Start with the base: Draw the longest or most convenient side first
Use the second piece of information: Construct an angle or measure another side
Complete the triangle: Find the third vertex using the remaining information

ROBUST WORKED EXAMPLES

Example 1.1: Construct an angle of 135°
Thought Process: 135° is not a base angle. But 135° = 90° + 45°. And 45° is half of 90°. So, we can construct 90° and then bisect the other 90° angle on the straight line.
Solution:
Draw a straight line �� and mark a point � on it.
Construct a 90° angle at �. Call the new line ��.
The angle ∠��� is 90°. The angle ∠��� is also 90°.
Bisect the angle ∠���. This will create a 45° angle. Call the bisector ��.
5. The total angle ∠��� is 90° + 45° = 135°.
Illustration:
Q
|
|90°
|
A---P---+---B
\ |
\ |45°
\| R

∠RPA = 90° + 45° = 135°
Alternative Visualization:

146
Q (perpendicular)
|
| 90°
|
|	Bisector creates 45°
|	/R
|	/
| / 45°
| /
A		P	B 135° | 45°

Example 1.2: Construct △ABC where AB = 6 cm, ∠CAB = 60°, and ∠CBA = 45°
Solution:
Draw a straight line and mark a point �.
Use your ruler to measure 6 cm from � and mark point �. You now have the base ��.
At point A: Construct a 60° angle. Draw a long line �� through this angle.
At point B: Construct a 90° angle (lightly). Then, bisect this 90° angle to create a 45°
angle. Draw a long line �� through this angle.
The point where line �� and line �� intersect is point �.
△ ��� is the required triangle.
Illustration:
C
/\
/ \
/	\
/ ?	\
/60° 45°\
A	B
6 cm

Step-by-Step Visual:
Step 2:
A	B (6 cm)

Step 3-4:
X (construction line)
/
/60°
A/	B
\ 45°\
Y (construction line)

147

Step 5:

C (intersection)
/\
/ \
/	\
/60° 45°\
A	B

REVISION QUESTIONS (WEEK 1)
What are the only two tools permitted in pure geometric construction?
What does "to bisect" mean?
How is a 60° angle related to an equilateral triangle?
How would you construct an angle of 15°? (Hint: 60° → 30° → 15°)
How would you construct an angle of 22.5°?

ASSESSMENT (WEEK 1)

EVALUATION (IN-CLASS)
Describe the steps to bisect a given line segment ��.
Describe the steps to construct a 90° angle at a point � on a line.
What is the first step in constructing a 30° angle?
If you construct a 60° angle and a 90° angle that share a common vertex and arm, what is the value of the angle between them?
What two base angles are added to get 105°? (60° + 45°)

ASSIGNMENT (TAKE-HOME)
Using only a ruler and compasses:
Construct a 90° angle. Bisect it to create a 45° angle.
Construct a 60° angle. Bisect it to create a 30° angle.
Construct △ ��� such that �� = 7 cm, �� = 8 cm, and �� = 6 cm. (This is SSS construction).
3.	Construct △ ��� such that �� = 8 cm, ∠��� = 30°, and ∠��� = 60°.
a. Measure the length of ��.
b. What is the value of ∠���? (It should be 90°).

148
WEEK 2: CONSTRUCTIONS II

INTRODUCTION
This week, we build on our construction skills. We learn how to copy an angle, which is a vital skill for constructing quadrilaterals. We will also be introduced to Locus, which is a fundamental concept in geometry that answers the question, "Where are all the points that follow this rule?"
Historical Context:
The concept of locus problems dates back to ancient Greek mathematicians who sought to understand the paths traced by moving points under specific conditions. This concept is fundamental in modern applications like GPS tracking, robotics, and computer graphics.

CONTENT

A. CONSTRUCTION OF EQUAL ANGLES (COPYING AN ANGLE)
Sometimes you are given a random angle and asked to copy it, not just construct a 60° or 90° angle.
Procedure: To Copy ∠ABC to a new point P
Step 1: Draw a line ��. This will be the base of your new angle.
Step 2 (At the original angle): Place your compass point at � and draw an arc that cuts both arms of ∠��� (at � and �).
Step 3 (At the new angle): Without changing the radius, place your compass point at � and draw the same arc, cutting line �� at a point �.
Step 4 (Measure the "opening"): Go back to the original angle. Set your compass radius to be the exact distance between � and �.
Step 5 (Mark the "opening"): Go to your new angle. Place the compass point on �. Draw an arc that intersects the arc from Step 3 at a point �.
Step 6: Draw a straight line from � through �.
∠YPQ is now an exact copy of ∠ABC. Illustration:
Original Angle:	New Angle: A		Y
/	/
/	/

149
/ M		/
B-----N--C	P	X--Q
Detailed Step-by-Step:
Step 2: Arc from B A
/
/ M (arc cuts here)
/
B	N C

Step 3: Same arc from P P	X Q

Step 4-5: Measure MN, mark from X Y (intersection)
/
/
/
P	X Q Result: ∠YPQ = ∠ABC

B. CONSTRUCTION OF QUADRILATERALS
A quadrilateral (like a parallelogram or kite) is not rigid. To construct one, you usually need 5 pieces of information. The method is to break the shape into two triangles.
Example: Construct a Parallelogram ABCD with AB = 6 cm, BC = 4 cm, and ∠ABC = 60° Steps:
Draw the line �� = 6 cm.
At point �, construct a 60° angle.
Measure 4 cm along this new line and mark point �.
Now you have two options to find �:
Method 1 (Compass):
Set compass to 4 cm. Draw an arc from �.
Set compass to 6 cm. Draw an arc from �.
The intersection is �.
Method 2 (Parallel lines):
Copy the 60° angle from � to � (using alternate interior angles rule for parallel lines).
Join � to � and � to �.

150
Illustration:
D	C
/	/
/	/ 4cm
/60°		/ A	B
6cm

Construction Process:
Step 1-3:
C
/
/ 4cm
/60°
A		B 6cm

Step 4 (Method 1 - Compass Arcs): D (intersection of arcs)
/|\
/ | \
/ 4cm\6cm A |	C
| /
| /4cm
|/ B

Final:
D	C
|\	/|
| \	/ |
| \ / |
|60°\/60°| A	B	|
6cm

Properties of a Parallelogram (for verification):
Opposite sides are equal and parallel
Opposite angles are equal
Adjacent angles are supplementary (add to 180°)
Diagonals bisect each other

151
C. LOCUS OF POINTS
Definition: A locus (plural: loci) is the set of all points that satisfy a given geometric rule or condition. It is the "path" a point traces as it moves according to that rule.
THE FOUR FUNDAMENTAL LOCI:

Locus of points at a fixed distance from a single point Rule: "Find all points � that are 3 cm away from point �." Locus: A circle with center � and radius 3 cm. Illustration:
• • •
•	•
X	• (All points 3cm from X)
•	•
•   •   • Circle, radius 3cm

Real-World Example: The coverage area of a cell phone tower.

Locus of points equidistant from two fixed points
Rule: "Find all points � that are the same distance from � as they are from �."
Locus: The perpendicular bisector of the line segment ��.
Illustration:
|
| P
|
|
A---+---B
|
|
| Q
|
(Perpendicular bisector) All points on this line are equidistant from A and B

Real-World Example: The boundary line between two countries or properties where every point is equally distant from two capital cities or landmarks.

152
Locus of points at a fixed distance from a single line Rule: "Find all points � that are 2 cm away from a line ��."
Locus: A pair of parallel lines, one on each side of ��, both 2 cm away.
Illustration:
 	 (2cm above)

═════════════════ Line AB

 	 (2cm below)
Real-World Example: The boundaries of a road or railway track of fixed width.

Locus of points equidistant from two intersecting lines
Rule: "Find all points � that are the same distance from line �� as they are from line ��."
Locus: The angle bisector of the angle ∠���. (There are actually two, one for the interior angle and one for the exterior).
Illustration:
B
/
/ |
/ | Bisector (locus)
/	|
A	+	C
\	|
\ |
\ |
\
D
(Both interior and exterior bisectors)

Real-World Example: The path followed by a ball that bounces off two walls at equal angles.

3. ROBUST WORKED EXAMPLES

Example 2.1: Constructing a Locus
Draw a line segment XY = 7 cm. Construct the locus of all points P such that P is equidistant from X and Y.

153
Solution:
Draw the line �� = 7 cm.
The rule "equidistant from two points" is Locus #2. The locus is the perpendicular bisector.
Place your compass at �. Set the radius to be more than half of �� (e.g., 5 cm). Draw a large arc above and below the line.
Without changing the radius, place the compass at �. Draw another large arc to intersect the first one at two points (call them � and �).
Draw a straight line connecting � and �. This line is the required locus. Any point on this line is exactly the same distance from X and Y. Illustration:
M
/|\
/ | \
/ |  \
X---+---Y (7cm)
\ |  /
\ | /
\|/ N

Line MN is the perpendicular bisector and the required locus

Example 2.2: Locus Application
A goat is tied to a post P with a rope 4 meters long. It is also tied to another post Q with a rope 3 meters long. P and Q are 5 meters apart. Construct and shade the region where the goat can graze.
Solution: (Scale: 1m = 1cm)
Draw the line �� = 5 cm.
Locus 1: The goat must be within 4m of �. This is Locus #1. Construct a circle with center � and radius 4 cm. Shade the inside of this circle.
Locus 2: The goat must be within 3m of �. This is Locus #1 again. Construct a circle with center � and radius 3 cm. Shade the inside of this circle.
Final Answer: The goat can only graze where both conditions are true. The required region is the intersection (overlap) of the two shaded circles.
Illustration:

/	 	-----|--

154
/P/|\|||Q||4m||3m|||||\||/\	|	|	/
|<-- 5m -->|

Shaded region = Overlap (lens shape) where goat can reach both posts

Cross-Section View:
Circle from P (4m):	Circle from Q (3m):

/	\	/	\
| P |	| Q  |
\	/	\	/
4m radius	3m radius

Combined (goat's grazing area):

/	\	/	\
| P	X	Q |
\	/	\	/
^^^ Overlap region

REVISION QUESTIONS (WEEK 2)
What is a "locus"?
What is the locus of a point equidistant from two points � and �?
What is the locus of a point equidistant from two intersecting lines �� and ��?
Describe the locus of the tip of the minute hand of a clock.
What are the key steps to "copy" an angle?

ASSESSMENT (WEEK 2)

EVALUATION (IN-CLASS)
Describe, in words, the locus of a point � that moves so that its distance from a fixed point � is always 5 cm.
Describe the locus of points equidistant from two parallel lines �1 and �2 that are 6 cm apart.
What two tools are used to construct the perpendicular bisector of a line?

155
When constructing a quadrilateral, how many pieces of information do you generally need?
What is the first step in finding the locus of points equidistant from two intersecting lines?

ASSIGNMENT (TAKE-HOME)
Using only a ruler and compasses:
Draw an angle ∠��� = 75° (by constructing 60° + 15°). Construct a separate line �� and copy the 75° angle to point �.
Construct a rhombus ��𝑄 with side lengths of 5 cm and one angle ∠��� = 60°.
Draw a line �� = 6 cm.
a. Construct �1, the locus of all points 4 cm away from the line ��.
b. Construct �2, the locus of all points equidistant from � and �.
c. Mark the points � and � where �1 and �2 intersect.
Draw two intersecting lines �� and �� forming an angle of 45°.
a. Construct �1, the locus of points equidistant from �� and ��.
b. Construct �2, the locus of points 3 cm from the point �.
c. Mark the point � that satisfies both conditions.

WEEK 3: PROOFS OF THEOREMS I

INTRODUCTION
In geometry, we have axioms (or postulates), which are statements we accept as true without proof (e.g., "the shortest distance between two points is a straight line"). A Theorem is a statement that is not obvious, but which we can prove to be true by using logic and axioms.
This week, we will learn to write a formal deductive proof for two of the most important theorems in all of geometry.
Structure of a Proof:
Given: What information are you starting with?
To Prove: What are you trying to show?
Construction (if needed): A line or shape you add to the diagram to help.
Proof: The step-by-step logical argument, with a reason for every statement.
Conclusion: A final statement, often "Q.E.D." (quod erat demonstrandum, Latin for "what was to be shown").

156
CONTENT

THEOREM 1: THE SUM OF ANGLES IN A TRIANGLE IS 180°
Given: A triangle ���.
To Prove: ∠� + ∠� + ∠� = 180°.
Construction: Draw a line �� through the vertex �, such that �� is parallel to the base ��.
Illustration:
X	A	Y (parallel to BC)
/\
/ \
/	\
/	\
B	C

Proof:

StatementReason∠��� = ∠��� (Let's call this
∠�)Alternate interior angles are equal (�� ∥ ��)∠��� = ∠��� (Let's call this
∠�)Alternate interior angles are equal (�� ∥ ��)∠��� + ∠��� + ∠��� = 180°Angles on a straight line (line ��) add up to 180°.Substitute (1) and (2) into (3):∠� + ∠��� + ∠� = 180°Substitution∴ ∠� + ∠� + ∠� = 180°Q.E.D.Visual Proof Diagram:
Step-by-Step Visualization:

Draw triangle ABC:
A
/\
/ \
/	\
B	C

Add parallel line XY through A: X	A	Y
/\
/ \

157
/	\
B	C

Mark alternate angles: X	[∠B]_A_[∠C]	Y
/\
∠B/ \∠C
/	\
B ∠A C

On line XY: ∠B + ∠A + ∠C = 180°

THEOREM 2: THE EXTERIOR ANGLE OF A TRIANGLE
The exterior angle is the angle formed by extending one of the sides.
Theorem: The exterior angle of a triangle is equal to the sum of the two opposite interior angles.
Given: A triangle ���, with the side �� extended to a point �.
To Prove: The exterior angle ∠��� = ∠��� + ∠���. (or ∠ext = ∠� + ∠�)
Illustration:

Proof:
A
/\
/ \
/	\
B	C	D
<--->
Exterior ∠

StatementReason∠��� + ∠��� + ∠��� = 180°Sum of angles in △ ��� is 180° (Theorem 1).∠��� + ∠��� = 180°Angles on a straight line (line ��) add up to 180°.Set (1) equal to (2):∠��� + ∠��� + ∠���
= ∠��� + ∠���Both sides equal 180°.Subtract ∠��� from both sides:∠��� + ∠��� = ∠���Q.E.D.
Visual Proof Diagram:

158
Annotated Diagram:

A
/|\
a / | \ c
/ | \
B		+	C	D b | ext
|
Interior angles: a, b, c
a + b + c = 180° (Theorem 1) On line BCD: c + ext = 180°
Therefore: a + b + c = c + ext Simplify: a + b = ext

3. ROBUST WORKED EXAMPLES (APPLICATIONS)

Example 3.1: Find the value of x in the diagram
Triangle with angles:
/\
/ \
/2x \
/		\ 3x	40°

Solution:
Reason: Sum of angles in a triangle is 180°.
2� + 3� + 40° = 180°
5� + 40° = 180°
5� = 180° − 40°
5� = 140°
� = 140°/5
Answer: � = 28°
Verification:
First angle: 2(28°) = 56°
Second angle: 3(28°) = 84°
Third angle: 40°

159
Sum: 56° + 84° + 40° = 180° ✓

Example 3.2: Find the value of y in the diagram
Triangle with exterior angle:
A
/\ 50°/ \70°
/	\
B	C
y° -->

Solution:
Reason: Exterior angle = sum of opposite interior angles.
� = 50° + 70°
Answer: � = 120°
Alternative method:
Find the third interior angle �: � = 180° − 50° − 70° = 60°
Then find � on the straight line: � = 180° − 60° = 120° ✓

Example 3.3: Multi-Step Problem
In triangle PQR, ∠P = 2x, ∠Q = 3x, and the exterior angle at R is 140°. Find the value of x and all interior angles.
Solution:
Step 1: Use the exterior angle theorem. Exterior angle at � = ∠� + ∠�

Step 2: Find the interior angles.
∠� = 2(28°) = 56°
∠� = 3(28°) = 84°
140° = 2� + 3�
140° = 5�
� = 28°
∠� = 180° − 140° = 40° (supplementary to exterior angle)
Verification: 56° + 84° + 40° = 180° ✓

160
REVISION QUESTIONS (WEEK 3)
What is the difference between an axiom and a theorem?
What does "Q.E.D." stand for?
In the proof of Theorem 1, what construction line did we draw?
What geometric rule did we use to relate the angles in the triangle to the angles on the straight line in Theorem 1?
What two theorems (or axioms) can be used to prove the Exterior Angle Theorem?

ASSESSMENT (WEEK 3)

EVALUATION (IN-CLASS)
State the theorem about the sum of angles in a triangle.
State the theorem about the exterior angle of a triangle.
One angle in a triangle is 90°. The other two are � and 2�. Find �.
The exterior angle of a triangle is 110°. One of the opposite interior angles is 40°. What is the other?
Can a triangle have angles 50°, 60°, and 80°? Why or why not?

ASSIGNMENT (TAKE-HOME)
Find the value of � and � in the diagram below:
(Diagram showing triangle with angles marked as algebraic expressions)

Find the value of �, �, and � in the diagram below:
(Diagram showing intersecting lines and triangles)

The angles of a triangle are in the ratio 2: 3: 4. Find the size of each angle. (Let the angles be 2�, 3�, 4�).
Write out the full proof that the sum of angles in a triangle is 180°. (Given, To Prove, Construction, Proof).

WEEK 4: PROOFS OF THEOREMS II (RIDERS)

INTRODUCTION
A rider is a problem in geometry that requires you to be a "detective." You must use a chain of logical deductions, based on the theorems you know, to find a missing angle or prove a relationship. This week is about applying all the foundational theorems to solve complex problems.
Think of riders as:

161
Geometric puzzles
Logic challenges
Step-by-step detective work
Applications of all your "theorem tools"

CONTENT (THE THEOREM "TOOLBOX")
To solve riders, you must know these rules by heart.

ANGLES ON A STRAIGHT LINE:
Add up to 180°.
a°	b°
 	|	|
a + b = 180°

ANGLES AT A POINT:
Add up to 360°.
a°
|
d° | b°
| c°

a + b + c + d = 360°

VERTICALLY OPPOSITE ANGLES:
Are equal.
a°\ /b°
\/
/\
c°/ \d° a = c, b = d

PARALLEL LINE THEOREMS (Given �1 ∥ �2):
1. Alternate Interior Angles: Are equal. (Z-angle)

162
L1	/
/
/ a°
L2 _/
b°

a = b (Z-pattern)

Corresponding Angles: Are equal. (F-angle)
L1	|
a°|
|      L2	|
b°|

a = b (F-pattern)

Co-interior (Allied) Angles: Add up to 180°. (C-angle)
L1	|
a°\
\      L2	\
b°

a + b = 180° (C-pattern)

TRIANGLE THEOREMS:
Angles add to 180°.
Exterior angle = sum of two opposite interior angles.
Isosceles Triangle: Base angles (angles opposite equal sides) are equal.
Isosceles Triangle:
A
/|\
/ | \
a / a| \
/	|	\ B		|		C
|
Equal sides → Equal base angles

CONGRUENT TRIANGLES:
Two triangles are identical in shape and size if one of these 4 conditions is met:
SSS (Side-Side-Side)

163
SAS (Side-Angle-Side): The angle must be between the two sides.
ASA (Angle-Side-Angle): The side must be between the two angles.
RHS (Right-angle-Hypotenuse-Side)
Visual Guide:
SSS:	SAS:	ASA:	RHS:
/\	/\	/\	|\
/ \	a / \ b	a°/ \b°	| \
/	\	/ θ_\	/	\	| \
All 3 sides	2 sides + angle 2 angles + side Right angle + H + S

PROPERTIES OF PARALLELOGRAMS:
D	C
|\	/|
| \	/ |
| \ / |
|	\/	| A	/\	B
Opposite sides are equal and parallel
Opposite angles are equal
Diagonals bisect each other
Adjacent angles are supplementary (add to 180°)

POLYGONS:
Sum of interior angles = (� − 2) × 180° (where � is the number of sides).
Sum of exterior angles = 360° (always!)
Visual Explanation:
Triangle (n=3):	Square (n=4):
Sum = (3-2)×180=180°	Sum = (4-2)×180=360°

/\
/ \	|	|
/	\	|	|

INTERCEPT THEOREM:
If three or more parallel lines cut two transversals (lines � and �), then they divide the transversals in the same ratio.

164
Simple case: If the parallel lines cut off equal intercepts on line �, they will also cut off equal intercepts on line �.

Line ALine B|
    | 	|
    | 	|∥|    | 	    | 	|∥|    | 	    | 	||
Equal spacing → Equal spacing

3. ROBUST WORKED EXAMPLES (RIDERS)

Example 4.1: Parallel Lines and Triangles
In the diagram, PQ ∥ RS. Find the value of ∠QRT.
P	Q
\40°	/
\	/70°
\ /
\/ R
/ \
/	\
S	T

Thought Process: We need to find ∠���. This angle is inside △ ���. We know one angle (∠��� = 70°). If we can find ∠���, we can solve the problem.
Solution:
Step 1: ∠��� = ∠��� = 40°
Reason: Alternate Interior Angles (�� ∥ 𝑄).
Step 2: Now consider △ ���.
∠��� + ∠��� + ∠��� = 180°
Reason: Sum of angles in a triangle.
Step 3: 40° + 70° + ∠��� = 180°
110° + ∠��� = 180°

165
∠��� = 180° − 110° = 70°
Answer: 70°

Example 4.2: Polygon Angles
A regular polygon has 9 sides (a nonagon). Find:
a) The sum of its interior angles.
b) The size of one interior angle.
c) The size of one exterior angle.
Solution:
Sum of interior angles = (� − 2) × 180°
= (9 − 2) × 180°
= 7 × 180° = 𝟏𝟐°
One interior angle (since it's regular):

Angle =

One exterior angle (Method 1):
Sum =
�
1260° = 𝟏�°
9

Exterior Angle =
360° =
�
360° = ��°
9
(Check: Interior + Exterior = 140° + 40° = 180°. Correct.) Visual Representation:
Regular Nonagon (9 sides):

/	\
/	\
|	140° | Each interior angle
\	/
\	/

Exterior angles: 40° each
Sum of all exterior: 9 × 40° = 360° ✓

Example 4.3: Deductive Proof with Parallelograms
Given: Parallelogram ����. The diagonal �� bisects ∠���.

166
To Prove: ���� is a rhombus (i.e., all four sides are equal).
Illustration:
D	C
|\	/|
| \	/ |
| \AC/ |
|	\/	|
|	/\x |
| / \ |
| /x	\ |
|/	\|
A	B
Proof:

StatementReason∠��� = ∠��� (call this �)Given (AC bisects ∠���)�� ∥ ��Property of parallelogram∴ ∠��� = ∠��� = �Alternate Interior Angles∴ ∠��� = ∠��� = �Both are equal to �Consider △ ���:Since ∠��� = ∠���, △ ��� is an isosceles triangle.Base angles are equal.∴ Side �� = Side ��Sides opposite equal angles are equal.But �� = �� and �� = ��Properties of a parallelogram.∴ �� = �� = �� = ��Substitution∴ ���� is a rhombus.Q.E.D.
REVISION QUESTIONS (WEEK 4)
List the three main parallel line angle theorems.
What are the four conditions for proving triangles are congruent?
What is the formula for the sum of the interior angles of an �-sided polygon?
What is the sum of all the exterior angles of any polygon?
What is the difference between a parallelogram and a rhombus?

ASSESSMENT (WEEK 4)

167
EVALUATION (IN-CLASS)
Find the value of �.
(Diagram with parallel lines and angles marked with expressions involving x)
Find the interior angle of a regular 5-sided polygon (a pentagon).
State the "SAS" condition for congruence. Why is the "A" in the middle?
In parallelogram ����, ∠� = 100°. What is ∠�?
What does the Intercept Theorem state?

ASSIGNMENT (TAKE-HOME)
A polygon has an interior angle sum of 900°. How many sides does it have?
The exterior angle of a regular polygon is 30°. How many sides does it have?
In the diagram below, �� is a straight line. Find the values of �, �, and �.
(Diagram showing intersecting lines with angles marked)

Proof: Given an isosceles triangle ��� with �� = ��. � is the midpoint of ��.  Prove that the triangles △ ��� and △ ��� are congruent. (Which condition do you use?)

WEEK 5: MIDTERM EXAMINATION
This week is for your midterm examination, which will cover all content from Weeks 1-4 (Constructions, Theorems, Proofs, and Riders).
Examination Coverage:
✓ Geometric constructions (angles, triangles, quadrilaterals)
✓ Locus problems
✓ Angle theorems and proofs
✓ Rider problems
✓ Polygon properties
Preparation Tips:
Review all worked examples from Weeks 1-4
Practice construction techniques with compass and straightedge
Memorize key theorems and their proofs
Work through past assessment questions
Ensure you can clearly explain your reasoning in proofs

168
WEEK 6: TRIGONOMETRIC RATIOS

INTRODUCTION
This week, we begin the study of Trigonometry. The word comes from the Greek trigonon ("triangle") and metron ("measure"). It is the branch of mathematics that studies the relationship between the side lengths and angles of triangles.
We will start with the right-angled triangle, which is the foundation of all trigonometry.
Historical Note:
Trigonometry has ancient origins, developed by Greek, Indian, and Islamic mathematicians for astronomy, navigation, and architecture. Today, it's essential in engineering, physics, computer graphics, and GPS technology.

CONTENT

A. THE RIGHT-ANGLED TRIANGLE
A right-angled triangle has one angle that is exactly 90°.
The sides have special names relative to a chosen angle � (theta).
|\
| \ Hypotenuse (HYP)
| \ (longest side)
Opposite|	\
(OPP) |	\
|    \
|θ \ Adjacent (ADJ)

The Three Sides:
Hypotenuse (HYP): The longest side, always opposite the 90° angle.
Opposite (OPP): The side directly opposite the angle �.
Adjacent (ADJ): The side next to the angle � (that is not the hypotenuse).
Important Note: If we change the angle � to the other acute angle, the Opposite and Adjacent sides will swap!
Example:
For angle A:	For angle C: C		C

169
|\
HYP |
\ OPP|\
OPP|
\ HYP|\|\|\|\|A	\|A	\ADJADJ

B. THE THREE TRIGONOMETRIC RATIOS
We define the three basic ratios as follows. The mnemonic SOH CAH TOA is essential to remember them.

SINE (sin)

SOH ⟹ sin� =   Opposite
Hypotenuse

|\
| \ H
O |  \
|	\
|θ		\ A

sin θ = O/H

COSINE (cos)

CAH ⟹ cos� =   Adjacent
Hypotenuse

|\
| \ H
O |  \
|	\
|θ		\ A

cos θ = A/H

TANGENT (tan)

TOA ⟹ tan� = Opposite
Adjacent

170
|\
| \
O |  \
|	\
|θ		\ A

tan θ = O/A

Complete SOH CAH TOA Visual:
┌─────────────────────────────────┐
│	SOH CAH TOA MEMORY AID	│
├─────────────────────────────────┤
│││SOH→Sin=Opp/Hyp││CAH→Cos=Adj/Hyp││TOA→Tan=Opp/Adj│││└─────────────────────────────────┘

C. SOLVING PROBLEMS
We can use these ratios to find missing sides or angles. Finding a missing SIDE: You need 1 angle and 1 side. Steps:
Label the sides (OPP, ADJ, HYP) relative to the given angle.
Choose the correct ratio (SOH, CAH, or TOA) that uses the side you have and the side you want.
Write the equation, substitute values, and solve.

Finding a missing ANGLE: You need 2 sides.
Steps:
Label the sides relative to the unknown angle �.
Choose the correct ratio that uses the two sides you have.
Write the equation.
Use the "inverse" function on your calculator (sin−1, cos−1, or tan−1) to find the angle.

Decision Tree for Choosing Ratios:

171
What do you have?
|
├─ Have: H and O → Want: angle → Use sin⁻¹
├─ Have: H and A → Want: angle → Use cos⁻¹
├─ Have: O and A → Want: angle → Use tan⁻¹
|
├─ Have: angle & H → Want: O → Use sin
├─ Have: angle & H → Want: A → Use cos
├─ Have: angle & O → Want: A → Use tan
└─ Have: angle & A → Want: O → Use tan

ROBUST WORKED EXAMPLES

Example 6.1: Finding Ratios
In △PQR, ∠Q=90°, PQ=5 cm, QR=12 cm. Find PR, sin P, cos P, and tan R. Diagram:
P
|\
5 | \ PR
| \ (?)
|	\
|	\ Q 12 R

Solution:
Part 1: Find PR (Hypotenuse)
Use Pythagoras.

�� =

= 13 cm.
��2 = ��2 + ��2 = 52 + 122 = 25 + 144 = 169

Part 2: Find ratios for ∠P
From �'s perspective:
Opp = 12 (side QR)
Adj = 5 (side PQ)
Hyp = 13 (side PR)

sin� = Opp = 12

Hyp	13

172
cos� = Adj = 5

Hyp	13
Part 3: Find tan R
From �'s perspective:
Opp = 5 (side PQ)
Adj = 12 (side QR)
Hyp = 13 (side PR)
tan� = Opp = 5

Adj	12

Example 6.2: Finding a Missing Side
Find the value of x in the diagram.
|\
15 | \ x
| \
|35°\
|	\

Solution:
Step 1: Label
Relative to 35°:
� is Adjacent
15 is Hypotenuse Step 2: Choose
We have A and H. Use CAH (Cosine).
Step 3: Equation
cos(35°) = Adj = �

Hyp	15
Step 4: Solve

Calculator: cos(35°) ≈ 0.8192

Answer: � ≈ 12.29 cm
� = 15 × cos(35°)

� = 15 × 0.8192 = 12.288

173

Example 6.3: Finding a Missing Angle
Find the angle θ in the diagram.
|\
10 | \
| \
|θ \ 8

Solution:
Step 1: Label
Relative to �:
10 is Opposite
8 is Adjacent Step 2: Choose
We have O and A. Use TOA (Tangent).
Step 3: Equation
tan(�) = Opp = 10 = 1.25

Adj	8
Step 4: Solve
� = tan−1(1.25)
Calculator: � ≈ 51.34°
Answer: � ≈ 51.3°

REVISION QUESTIONS (WEEK 6)
What does the mnemonic "SOH CAH TOA" stand for?
If sin� = 0.5, what does this tell you about the relationship between the opposite side and the hypotenuse?
If tan� = 1, what does this tell you about the opposite and adjacent sides?
What is the "inverse" function used for? (e.g., sin−1).
In △ ���, ∠� = 90°. What is the "adjacent" side relative to ∠�? What is the "adjacent" side relative to ∠�?

174
ASSESSMENT (WEEK 6)

EVALUATION (IN-CLASS)
Draw a right-angled triangle and label the Hypotenuse, Opposite, and Adjacent sides relative to an angle �.
State the three trigonometric ratios in terms of Opp, Adj, and Hyp.

If cos� = 4
sin� and tan�? (Hint: Draw the triangle. Use Pythagoras to find the 3rd side).

In △ ���, ∠� = 90°, ∠� = 50°, and �� = 7 cm. Which ratio would you use to find the length of
��?
What button(s) would you press on a calculator to solve tan� = 2.5?

ASSIGNMENT (TAKE-HOME)
1.	In △ ���, ∠� = 90°.
a. If �� = 10 cm and ∠� = 40°, find the length of ��.
b. If �� = 12 cm and �� = 5 cm, find the size of ∠�.
A 12-meter ladder leans against a wall, making an angle of 70° with the ground. How high up the wall does the ladder reach?
A rectangle is 15 cm long and 8 cm wide. Find the angle that the diagonal makes with the 15 cm side.

If sin� = 3 and � is an acute angle, find (cos�)2 + (sin�)2 without finding �.

WEEK 7: MIDTERM BREAK
This week is for your midterm break. Suggested Activities:
Review all topics covered so far
Practice construction techniques
Work on trig problems
Rest and recharge!

WEEK 8: TRIGONOMETRIC RATIOS OF SPECIAL ANGLES

175
INTRODUCTION
While our calculators can find the ratios for any angle, there are three "special" angles
(30°, 45°, 60°) whose ratios are so common that we are expected to know them by heart. These ratios are exact (they use surds like	2) and allow us to solve problems without a calculator.
Why These Angles Are Special:
These angles appear frequently in:
Regular polygons (equilateral triangles, squares)
Engineering and architecture
Physics problems
Computer graphics and game design

CONTENT

DERIVATION OF RATIOS FOR 45°
Step 1: Draw an isosceles right-angled triangle. Let the two equal sides be 1 unit.
Step 2: By Pythagoras, the hypotenuse ℎ is: ℎ2 = 12 + 12 = 2 ⟹ ℎ =	2.
Step 3: The angles are 45°, 45°, 90°.
Step 4: Use SOH CAH TOA for 45°:

sin45° = Opp =	=	2
Hyp	2
cos45° = Adj = 1 =	2
Hyp	2
tan45° = Opp	1

Adj = 1 = 1
Illustration:
45-45-90 Triangle:
|\
| \
1 | \ √2
|	\
|45°_\ 1

All measurements:

176
Equal legs: 1, 1
Hypotenuse: √2
- Angles: 45°, 45°, 90°

DERIVATION OF RATIOS FOR 30° AND 60°
Step 1: Draw an equilateral triangle with all sides 2 units. All angles are 60°.
Step 2: Bisect the triangle vertically. This creates two 30-60-90 right-angled triangles.
Step 3: The sides of this new triangle are:
Hypotenuse = 2
Base = 1
Step 4: By Pythagoras, the height ℎ is: 22 = 12 + ℎ2 ⟹ 4 = 1 + ℎ2 ⟹ ℎ2 = 3 ⟹ ℎ =	3.
Step 5: Use SOH CAH TOA:
For 60°: Opp =	3,Adj = 1,Hyp = 2

For 30°: Opp = 1,Adj =	3,Hyp = 2
sin60° =	3
2
cos60° = 1
2
tan60° =	3 =
1

sin30° = 1
2
cos30° =	3
2

Illustration:

tan30° =	=		3 3

Equilateral Triangle (side = 2):
/\
/ \
/	\
/	\
/		\ 2	2	2

177

Bisected to create 30-60-90:
*
/|
/ |
2 / | √3
/	|
/30° |
/_60°_| 1

30-60-90 Triangle:
Short leg (opp 30°): 1
Long leg (opp 60°): √3
Hypotenuse: 2
- Angles: 30°, 60°, 90°

SUMMARY TABLE (MEMORIZE THIS)
Angle (θ)sin θcos θtan θ30°1

23

21 or
3
3
345°1 or
2
2
21 or
2
2
2160°3

21

23Memory Aid Pattern:

30°45°60°sin:1/2√2/2√3/2(increasing)cos:√3/2√2/21/2(decreasing - mirror of sin)tan:1/√31√3(increasing)
Notice: sin
30°
= cos 60°
= 1/2sin60°= cos 30°= √3/2

ROBUST WORKED EXAMPLES

Example 8.1: Evaluating Expressions
Without using a calculator, find the exact value of sin60°cos30° + tan45°.

178
Solution:
Step 1: Substitute the values from the table:

+ (1)

Step 2: Simplify:

+ 1

+ 1

Answer: 1 3 or 7 or 1.75
4	4

Example 8.2: Solving Equations
Find x (an acute angle) if 2sin� =	3. Solution:
Step 1: Isolate the trig ratio: sin� = 3
2

Step 2: Ask: "Which special angle has a sine of 3?"
2
Step 3: Look at the table: sin60° = 3.
2
Answer: � = 60°

Example 8.3: Application in Geometry
An equilateral triangle has sides of length 10 cm. Find its exact perpendicular height. Diagram:
A
/|\
/ | \h
/ |  \
/	|	\ B		|		C 5	5
(10 cm base)

179
Solution:
Step 1: Draw the triangle and bisect it. You get a 30-60-90 triangle. The Hypotenuse = 10 cm. The Base = 5 cm. The Height = ℎ.
Step 2: We can use Pythagoras (as in the derivation) OR trigonometry.
Using Trig: We need to find ℎ, which is Opposite the 60° angle. We have the Hypotenuse (10). Use SOH.
sin60° = Opp = ℎ

Step 3: We know sin60° = 3.
2
Hyp	10

3 = ℎ

2	10
2ℎ = 10
ℎ = 5	cm

Answer: The exact height is 5	cm (or approximately 8.66 cm).

REVISION QUESTIONS (WEEK 8)
How do you derive the ratios for 45°? (What triangle do you use?)
How do you derive the ratios for 30° and 60°? (What triangle do you use?)
What is the value of sin30°? What is cos60°? What do you notice?
What is the value of tan45°? Why does this make sense?
What does "exact value" mean in this context?

ASSESSMENT (WEEK 8)

EVALUATION (IN-CLASS)
Do not use a calculator for this section.
What is the exact value of tan30°?
What is the exact value of cos45°?
Evaluate: sin45° × cos45°.
Evaluate: tan60° ÷ sin60°. (Hint: 1/cos60°)
Solve for �: tan� = 1.

180
ASSIGNMENT (TAKE-HOME)
Do not use a calculator for this section. Show all your steps.
1.	Evaluate: 2sin30°cos30°.
tan60°−tan30° 1+tan60°tan30°
A square ���� has a diagonal �� of length 10 cm. Find the exact length of its side ��. (Hint: The diagonal splits the square into two 45-45-90 triangles).
Solve for � (acute): 4cos2� = 3. (Hint: Isolate cos�).

WEEK 9: APPLICATION OF TRIGONOMETRIC RATIOS

INTRODUCTION
This week, we apply our SOH CAH TOA knowledge to solve real-world problems. This involves two new, crucial concepts: Angle of Elevation and Angle of Depression. We will also expand our understanding of trig ratios beyond 90° to cover all four quadrants (0° to 360°).
Real-World Applications:
Trigonometry is used in:
Aviation and navigation
Architecture and construction
Surveying and mapping
Physics and engineering
Computer graphics and animation

CONTENT

ANGLES OF ELEVATION AND DEPRESSION
Angle of Elevation: The angle between the horizontal line of sight and the line of sight UP to an object.
Angle of Depression: The angle between the horizontal line of sight and the line of sight
DOWN to an object.
Illustration:

181
Angle of Elevation (looking up):
* Object
/|
/ |
/ |
/ θ↗|
Observer | Horizontal

Angle of Depression (looking down):
Observer
\θ↘	| Horizontal
\	|
\	|
\	|
\	|
* Object

Key Fact: Due to parallel lines (the two horizontals) and a transversal, the Angle of Elevation from the ground to an object is always equal to the Angle of Depression from the object back to the ground. They are alternate interior angles.
Detailed Diagram:
Tower
|
|	Horizontal at top
|\
| \ Angle of depression (θ)
| \
|	\
|	\
|	\	Ground (horizontal)
\
Angle of elevation (θ)

θ (elevation) = θ (depression) [Alternate angles, parallel horizontals]

SINE, COSINE, TANGENT OF ANGLES 0° TO 360°
We use the Cartesian (x, y) plane to define angles, split into four quadrants.
y-axis
|
II	|	I (90-180°)|(0-90°)
-x, +y	| +x, +y
 	|	x-axis
-x, -y	| +x, -y

182
III	|	IV
(180-270°)|(270-360°)
|

Quadrant I (0°-90°): � is +, � is +. (Acute angles) Quadrant II (90°-180°): � is -, � is +. (Obtuse angles) Quadrant III (180°-270°): � is -, � is -. (Reflex angles) Quadrant IV (270°- 360°): � is +, � is -. (Reflex angles)

ASTC Rule:
We use the mnemonic "All Students Take Cash" (or ASTC) to remember which ratios are positive in which quadrant, starting from Quadrant I.
y
|
S	|	A (Sin+) | (All+)
 		|		x T	|		C (Tan+) | (Cos+)
|

A - Quadrant I (0°-90°): All ratios (sin, cos, tan) are positive.
S - Quadrant II (90°-180°): Only Sine is positive. (cos and tan are negative).
T - Quadrant III (180°-270°): Only Tangent is positive. (sin and cos are negative).
C - Quadrant IV (270°-360°): Only Cosine is positive. (sin and tan are negative).

Finding Equivalent Angles:
We always relate the angle back to the acute angle it makes with the horizontal x-axis.
Quadrant II (e.g., 150°): 150° = 180° − 30°. Use 30° as the reference.
sin150° =+ sin30° = 1
2
cos150° =− cos30° =− 3
2
Quadrant III (e.g., 225°): 225° = 180° + 45°. Use 45° as the reference.

sin225° =− sin45° =− 2
2
tan225° =+ tan45° = 1
Quadrant IV (e.g., 300°): 300° = 360° − 60°. Use 60° as the reference.
cos300° =+ cos60° = 1
2
tan300° =− tan60° =−

183
Visual Guide:
Reference Angle Formulas:

Quadrant II (90-180°): Reference = 180° - angle Example: 150° → ref = 30°

Quadrant III (180-270°): Reference = angle - 180° Example: 225° → ref = 45°

Quadrant IV (270-360°): Reference = 360° - angle Example: 300° → ref = 60°

3. ROBUST WORKED EXAMPLES

Example 9.1: Angle of Elevation
A man stands 100 meters from the base of a tall building. He measures the angle of elevation to the top of the building as 60°. What is the height of the building?
Diagram:

Top of building
*
/|
/ |
/ | h (height)
/	|
/60° | Observer_|	Base
100m

Solution:
Step 1: Draw the triangle. The man is at one corner. The building is the Opposite side. The ground is the Adjacent side.
Step 2: Identify known values:
Angle � = 60°
Adj = 100 m
Opp = ℎ (height)
Step 3: We have O and A. Use TOA (Tangent).

184
tan60° = Opp = ℎ

Step 4: We know tan60° =	3.
Adj

= ℎ 100
100
ℎ = 100	meters

Answer: The exact height is 100	m (or approx. 173.2 m).

Example 9.2: Angle of Depression
From the top of a cliff 80 meters high, the angle of depression to a boat at sea is 30°. How far is the boat from the base of the cliff?
Diagram:
Top of cliff
\30°	|
\	| 80m
\	|
\	|
\	|
\	|

Solution:
*Boat | d
Base
Step 1: Draw the diagram. The cliff is vertical. The horizontal "line of sight" from the top is parallel to the sea.
Step 2: The angle down from the horizontal is 30°.
The angle of elevation from the boat up to the cliff top is also 30° (alternate angles).
Step 3: Now we have a right-angled triangle with the boat.
Angle � = 30°
Opp = 80 m (height of cliff)
Adj = � (distance)
Step 4: We have O and A. Use TOA (Tangent).
tan30° = Opp = 80

Adj	�

185
Step 5: We know tan30° = 1 .
3

= 80
�
1 × � = 80 ×

� = 80	m

Answer: The boat is 80	m away (or approx. 138.6 m).

Example 9.3: ASTC
Without a calculator, find the exact value of sin120° and cos240°. Solution:
Part 1: sin120°
Step 1: 120° is in Quadrant II (ASTC). Sine is Positive. Step 2: Reference angle = 180° − 120° = 60°.
Step 3: sin120° =+ sin60° = 3.
2

Part 2: cos240°
Step 1: 240° is in Quadrant III (ASTC). Cosine is Negative. Step 2: Reference angle = 240° − 180° = 60°.
Step 3: cos240° =− cos60° =− 1.
2
Visualization:
120° location:	240° location: y		y
|	|
120°*|	|
/|	|
II | I	III	*240°
 	|	x	 	|	x
|	|
Sine positive	Cosine negative
(ASTC: S)	(ASTC: T)

186
REVISION QUESTIONS (WEEK 9)
What is the difference between an angle of elevation and an angle of depression?
If the angle of depression from a tower to a car is 40°, what is the angle of elevation from the car to the tower?
What does the mnemonic "ASTC" stand for?
In which two quadrants is the sine ratio positive?
In which two quadrants is the tangent ratio negative?
What is the "reference angle" for 315°?

ASSESSMENT (WEEK 9)

EVALUATION (IN-CLASS)
A vertical pole is 10m high. What is the angle of elevation to the top of the pole from a point 10m away on the ground? (Use special angles).
From a window, the angle of depression to an object on the ground is 45°. The object is 20m from the base of the house. How high is the window?
Is cos100° positive or negative?
Is tan200° positive or negative?
What is the reference angle for 130°?

ASSIGNMENT (TAKE-HOME)
The shadow of a mast is 30m long. If the angle of elevation of the sun is 30°, find the exact height of the mast.
From the top of a lighthouse 120m high, the angle of depression of two boats � and � (in a straight line on the same side of the lighthouse) are 30° and 60° respectively.
a. Find the distance of boat � from the base of the lighthouse.
b. Find the distance of boat � from the base of the lighthouse.
c. Find the distance between the two boats.
Without using a calculator, find the exact value of:
a. tan315°
b. sin210°
c. cos135°
If sin� = 3 and � is in Quadrant II, find cos� and tan�. (Hint: Draw a triangle, find the adjacent side (it will be 4). Then apply the ASTC rule for Quadrant II).

187

WEEK 10: TRIGONOMETRIC RATIOS & GRAPHS

INTRODUCTION
This week, we visualize the trigonometric ratios as functions. We will see how
sin(�), cos(�), and tan(�) behave as the angle � changes from 0° to 360°. The unit circle is the key to understanding this.
Why Study Trig Graphs?
Trigonometric graphs model:
Sound waves and music
Light waves and colors
Ocean tides and weather patterns
Electrical currents and signals
Cyclical phenomena in nature

CONTENT

A. TRIGONOMETRIC RATIOS WITH RESPECT TO THE UNIT CIRCLE
The Unit Circle is a circle with its center at the origin (0, 0) and a radius � = 1. Let �(�, �) be any point on the circle, forming an angle � with the positive x-axis. Illustration:
y-axis
|
| P(x,y)
|/|
/θ|
/_|	x-axis
O
(Unit circle, r=1)

For point P on the circle:
x-coordinate = cos θ
y-coordinate = sin θ
radius = 1

By SOH CAH TOA, we have:

188
cos� = Adj	�	�

Hyp = � = 1 ⟹ � = 𝐜𝐨
sin� = Opp	�	�

Hyp = � = 1 ⟹ � = 𝐬𝐨
tan� = Opp = �

Adj	�
This gives us a new, powerful definition:
Cosine is the x-coordinate, and Sine is the y-coordinate of a point on the unit circle.

Key Points on the Unit Circle: At 0°: The point is (1,0).
cos0° = � = 1
sin0° = � = 0
tan0° = � = 0 = 0
�	1
At 90°: The point is (0,1).
cos90° = � = 0
sin90° = � = 1
tan90° = � = 1 = Undefined
�	0
At 180°: The point is ( − 1,0).
cos180° = � =− 1
sin180° = � = 0
tan180° = � = 0 = 0
�	−1
At 270°: The point is (0, − 1).
cos270° = � = 0
sin270° = � =− 1
tan270° = � = −1 = Undefined
�	0
Complete Unit Circle:

90° (0,1)
|
|
180° (-1,0) | (1,0) 0°/360°
|

189
|
270° (0,-1)

Key angles marked: 0°: (1,0)
30°: (√3/2, 1/2)
45°: (√2/2, √2/2)
60°: (1/2, √3/2)
90°: (0,1)
etc.

GRAPH OF SINE (� = 𝑠��)
This graph plots the height (y-coordinate) of the point � as it moves around the unit circle.
Table of Values:

�0°90°180°270°360°sin�010-10Graph:
y
1|
|	/	\
|	/	\
| /	\
0°|	|	x
|90° 180° 270° 360°
-1|	\	/

Shape: Smooth wave Starts at: 0
Peak at 90°: 1
Returns to 0 at 180°
Trough at 270°: -1
Back to 0 at 360°

Properties:
Period: It repeats every 360°.
Amplitude: The maximum height from the center is 1.
Range: -1 ≤ sin x ≤ 1

GRAPH OF COSINE (� = ����)
This graph plots the horizontal position (x-coordinate) of the point �.

190
Table of Values:

�0°90°180°270°360°cos�10-101Graph:
y
1|
|	\
|	\
|	\
0°|	\ |	x
|90° 180° 270°\360°
-1|	\	/

Shape: Smooth wave (shifted sine) Starts at: 1
Zero at 90°: 0
Minimum at 180°: -1
Zero at 270°: 0
Back to 1 at 360°

Properties:
Period: 360°.
Amplitude: 1.
Range: -1 ≤ cos x ≤ 1
Note: It's the same shape as the sine wave, just shifted by 90°.

GRAPH OF TANGENT (� = ����)
This graph plots the ratio �.
�
Behavior:
At 0°, tan0° = 0.
As � → 90°, � → 1 and � → 0. tan� → 1 →+ ∞.
0
At 90°, it is undefined. This creates a vertical asymptote.
At 180°, tan180° = 0.
At 270°, it is undefined again (another asymptote).
Graph:
y
|/|/||/ |/ |

191
| / | / |
| /	| /	|
    |/	|/	|	x 0°|90° 180° 270° 360°
|	|	| Asymptotes at 90°, 270°

Shape: Repeating "S" curves Asymptotes where undefined Period: 180° (not 360°!)

Properties:
Period: It repeats every 180°.
Amplitude: Undefined (it goes to infinity).
Range: All real numbers (-∞ to +∞)
Asymptotes: At 90°, 270° (where cos x = 0)

ROBUST WORKED EXAMPLES

Example 10.1: Reading the Sine Graph
Using the graph of � = sin�, find the values of � (between 0° and 360°) for which sin� = 0.5. Solution:
Step 1: Draw the graph of � = sin�.
Step 2: Draw the horizontal line � = 0.5. Step 3: Find where the line cuts the curve. It cuts at two points.
Step 4: From our knowledge of special angles, the first one is � = 𝟐°.
Step 5: The second one is in Quadrant II. The graph is symmetrical. The second root is 180° − 30° = 𝟏�°.
Answer: � = 30°, 150°.
Visual:
y
1|
|	/	\
0.5|	*	*
| /	|	\	 0°|30° 150°

192
|	x
0° 90° 180° 270° 360°

Example 10.2: Reading the Cosine Graph
Using the graph of � = cos�, find the values of � for which cos� =− 0.5. Solution:
Step 1: Draw the graph of � = cos�.
Step 2: Draw the horizontal line � =− 0.5.
Step 3: It cuts the curve at two points, both in the "negative" zones (Quadrants II and III).
Step 4: First, find the reference angle (where cos� =+ 0.5). From special angles, this is � = 60°.
Step 5: The Quadrant II solution is 180° − 60° = 𝟏�°. Step 6: The Quadrant III solution is 180° + 60° = ���°. Answer: � = 120°, 240°.
Visual:
y
1|
|	\
0|	\	/
|	|\ /|
-0.5|	*-|-*
|	120°|240°
|	|	|	x
0° 90° 180° 270° 360°

REVISION QUESTIONS (WEEK 10)
On the unit circle, which coordinate (� or �) represents sine? Which represents cosine?
Why is tan90° undefined?
What are the "amplitude" and "period" of a wave graph?
What is the period of � = sin�? What is the period of � = tan�?
What is the maximum value of � = cos�? What is the minimum value?

ASSESSMENT (WEEK 10)

193
EVALUATION (IN-CLASS)
What are the � and � coordinates of the point on the unit circle at 180°?
What is the exact value of sin270°?
What is the exact value of cos0°?
Looking at the graph of � = sin�, where is the graph at its minimum?
What is an "asymptote"? Which of the three trig graphs has one?

ASSIGNMENT (TAKE-HOME)
Draw a table of values for � = cos� using the angles
0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°, and 360°.
Use your table from Q1 to plot an accurate graph of � = cos� on graph paper. (Use a scale of 2cm = 45° on the x-axis and 4cm = 1 unit on the y-axis).
From your graph, find the approximate values of � for which cos� = 0.8.
What is the main difference between the graph of � = sin� and � = cos�?

WEEK 11: REVISION

INTRODUCTION
This week is for a comprehensive review of all topics from the term. We will consolidate our knowledge of constructions, theorems, and trigonometry in preparation for the final examination.
Revision Strategy:
Review all worked examples
Practice key skills repeatedly
Make summary notes
Attempt past questions
Identify weak areas for extra practice

TOPIC SUMMARIES

Weeks 1-2 (Constructions & Loci):

194
Skills:
Bisection of lines/angles
Construction of 30°, 45°, 60°, 90°
Copying an angle
Constructing triangles/quads
Loci: The 4 fundamental loci:
Fixed distance from a point → Circle
Equidistant from two points → Perpendicular bisector
Fixed distance from a line → Parallel lines
Equidistant from two lines → Angle bisector
Key: Use only compasses and a straightedge.

Weeks 3-4 (Theorems & Riders):
Proofs: Know the formal proofs for:
"Angles in △ = 180°"
"Exterior Angle = Sum of Opp. Interior"
Toolbox: You must know all the rules:
Parallel lines (Alt, Corr, Co-int)
Polygons: (� − 2) × 180°
Congruence (SSS, SAS, ASA, RHS)
Parallelogram properties
Riders: Use the toolbox to solve problems step-by-step, giving a reason for each step.

Weeks 6-10 (Trigonometry):
SOH CAH TOA:
sin = �
�
cos = �
�
tan = �
�
Used to find sides and angles.
Special Angles: Know the table for 30°, 45°, 60° by heart.

195
Anglesincostan30°1/2√3/21/√345°√2/2√2/2160°√3/21/2√3
Applications:
Angles of Elevation (looking up)
Angles of Depression (looking down)
ASTC: The 4 quadrants:
Quadrant I: All positive
Quadrant II: Sin positive
Quadrant III: Tan positive
Quadrant IV: Cos positive
Graphs: Know the shapes of:
� = sin� (wave, period 360°)
� = cos� (wave, period 360°)
� = tan� (repeating curve, period 180°, asymptotes)

COMPREHENSIVE REVISION ASSIGNMENT (WEEK 11)
(This serves as the final assignment, covering all topics)

SECTION A: CONSTRUCTION
Question 1:
Using a ruler and compasses only, construct a triangle ��� with �� = 8 cm, ∠� = 60°, and
∠� = 45°.
Construct the locus �1 of points equidistant from � and �.
Construct the locus �2 of points equidistant from �� and ��.
Let the loci intersect at �. Measure the length of ��.
Guidance:
Start by drawing the base AB = 8 cm
At point A, construct 60° angle
At point B, construct 45° angle
Mark intersection point as C

196
For L₁: Construct perpendicular bisector of AB
For L₂: Construct angle bisector of ∠BAC
Mark point P where L₁ and L₂ meet
Expected Solution Structure:
Construction Steps:
Draw AB = 8cm

A	B
8cm

Construct 60° at A and 45° at B C
/\ 60°/ \45°
/	\
A	B

Add loci L₁ and L₂ C
/|\
/ | \
/ | \
/	P	\
/ / | \ \ A | | \_B L₁ L₂

SECTION B: THEOREMS & RIDERS
Question 2:
a. Find the value of � in the diagram below. (State your reasons).
Diagram:
A
/\
2x/ \3x
/	\
B	C 40°

Solution:

StepStatementReason12� + 3� + 40°
= 180°Sum of angles in a triangle

197
StepStatementReason25� + 40° = 180°Simplification35� = 140°Subtract 40° from both sides4� = 28°Divide both sides by 5
Verification:
Angle A = 2(28°) = 56°
Angle B = 3(28°) = 84°
Angle C = 40°
Sum = 56° + 84° + 40° = 180° ✓

Question 2b:
A regular polygon has 10 sides. Find:
(i) its exterior angle
(ii) its interior angle
Solution:
Exterior angle:

Formula: Exterior angle = 360°
�

Interior angle:

= 360° = 36°
10
Method 1 (Using sum of interior angles):
Sum of interior angles = (� − 2) × 180° = (10 − 2) × 180° = 8 × 180° = 1440°
One interior angle = 1440° = 144°
10
Method 2 (Using supplementary angles):
Interior angle = 180° − Exterior angle = 180° − 36° = 144°
Visual:
Regular Decagon (10 sides):

/	\
/	\
|	|
| 144° | Each interior angle

198
|	|
\	/
\	/

Each exterior: 36°
Sum of exterior: 10 × 36° = 360° ✓

Question 2c: PROOF
Prove that in a parallelogram, opposite angles are equal. Given: Parallelogram ����.
To Prove: ∠� = ∠� and ∠� = ∠�.
Diagram:
D	C
|\	/|
| \	/ |
| \ / |
|	\/	|
|	/\	|
| / \ |
| /	\ |
|/	\|
A	B
Proof:

StatementReason�� ∥ ��Property of parallelogram∠� + ∠� = 180°Co-interior angles (AD is transversal)�� ∥ ��Property of parallelogram∠� + ∠� = 180°Co-interior angles (DC is transversal)From statements (2) and (4):∠� + ∠� = ∠� + ∠�Both equal 180°Subtract ∠� from both sides:∴ ∠� = ∠�Similarly, ∠� = ∠�Using the same methodQ.E.D.

199
SECTION C: TRIGONOMETRY
Question 3:

a. Without a calculator, find the exact value of: sin30°×tan60°.
cos45°
Solution:
Step 1: Substitute values from the special angles table:

sin30° × tan60°

1 ×	3

Step 2: Simplify the numerator:
cos45°	= 2
2

   3
= 2
2
Step 3: Divide fractions (multiply by reciprocal):
=	3 × 2
2
Step 4: Cancel the 2s:

=

Step 5: Rationalize the denominator:
=	×	=	×	=	6
2	2

Answer: 6
2

Question 3b:
From the top of a building 50m high, the angle of depression to a car on the ground is 60°. Find the exact distance of the car from the base of the building.
Diagram:
Top of building
\60°	|
\	| 50m

200
\	|
\	|
\	|
\	|
*Car |	Base d

Solution:
Step 1: Identify the problem type: Angle of depression problem.
Step 2: The angle of elevation from the car to the building top is also 60° (alternate angles).
Step 3: Set up the right triangle:
Height (Opposite) = 50m
Distance (Adjacent) = d
Angle = 60°
Step 4: Choose the correct ratio: We have O and want A, so use TOA.
tan60° = Opposite = 50

Step 5: Substitute tan60° =	3:

Step 6: Solve for d:
Adjacent	�

= 50
�

� =

Step 7: Rationalize:

� =	×

= 50 3
3

Answer: The car is 50 3 meters from the base (or approximately 28.87m).
3

Question 3c:
Given that cos� =− 0.5 and 0° < � < 180°, find �.
Solution:
Step 1: Recognize that cos� =− 0.5 means we need a negative cosine value.
Step 2: Recall from special angles that cos60° = 0.5 (positive).

201
Step 3: Since cosine is negative, � must be in Quadrant II (where 90° < θ < 180°).
Step 4: Using ASTC and the reference angle:
Reference angle = 60°
For Quadrant II: � = 180° − 60° = 120°
Verification using special angles: cos120° =− cos60° =− 1 =− 0.5 ✓
2
Answer: � = 120°
Visual on Unit Circle:
y
| 120°*|
/θ| II / | I
 	/ |	x
-0.5

Question 3d:
What is the period of the graph � = cos�?
Answer:
The period of � = cos� is 360° (or 2π radians).
This means the graph completes one full cycle and repeats itself every 360°.
Visual Explanation:
y = cos x

\

0°|	|	|	|	|	x
|	360° 720° 1080°
-1|

One complete cycle = 360° Pattern repeats identically

ADDITIONAL PRACTICE PROBLEMS

202
Problem Set A: Mixed Constructions
Question 4:
Construct a rectangle ��𝑄 with �� = 8 cm and �� = 5 cm.
a. Construct the locus of points 3cm from point �. b. Construct the locus of points equidistant from �� and ��. c. Mark the point(s) that satisfy both conditions.
Expected Answer:
Locus (a): Circle with center Q, radius 3cm
Locus (b): Angle bisector of ∠PQR (which is 45° since it's a rectangle)
Intersection points: Two points where the 45° line cuts the circle

Problem Set B: Advanced Riders
Question 5:
In the diagram, �� ∥ 𝑄, ∠��� = 50°, and ∠�𝑄 = 130°. Find ∠�𝑄.
P	Q
\50°	/
\	/
\ /
\/T
/\
/ \
S	R

Solution Guide:
Use alternate angles: ∠��� = ∠��� = 50° (since PQ ∥ RS)
In triangle PTS, find angles
Apply angle sum property

Problem Set C: Advanced Trigonometry
Question 6:
A ladder 10m long leans against a vertical wall. The foot of the ladder is 6m from the wall.
a. Calculate the angle the ladder makes with the ground (to 1 d.p.). b. How high up the wall does the ladder reach? c. If the ladder slips so that its foot is now 8m from the wall, by how much has the top of the ladder descended?
Diagram:
Wall
|\

203
| \ 10m ladder
| \
h |	\
|	\
|θ		\ 6m

Solution:
Part (a):
We have:
Hypotenuse = 10m
Adjacent = 6m
Use CAH: cos� = 6
10
= 0.6

� = cos−1(0.6) = 53.1°
Part (b):
Use Pythagoras: ℎ2 + 62 = 102

ℎ = 8m
Part (c):
New position: foot is 8m from wall New height: ℎ2 + 82 = 102

ℎ2 = 6m
Descent = 8 − 6 = 2m

ℎ2 = 100 − 36 = 64

ℎ2 = 100 − 64 = 36
Answer: The ladder has descended by 2m.

EXAMINATION PREPARATION CHECKLIST

Construction Skills ✓
Can bisect any angle using compass only Can construct 30°, 45°, 60°, 90° angles

204
Can copy an angle accurately
Can construct triangles given SSS, SAS, ASA Can construct perpendicular bisectors Understand all 4 fundamental loci
Can solve locus intersection problems

Theorem Knowledge ✓
Can prove: Sum of angles in triangle = 180° Can prove: Exterior angle theorem
Know all parallel line angle rules (Alt, Corr, Co-int) Know polygon angle formulas: (� − 2) × 180° Understand all 4 congruence conditions
Know parallelogram properties
Can write formal proofs with reasons

Trigonometry Mastery ✓
Have memorized SOH CAH TOA
Know special angles table (30°, 45°, 60°) by heart Can identify Opposite, Adjacent, Hypotenuse
Can find missing sides using trig ratios
Can find missing angles using inverse functions Understand angles of elevation and depression Know ASTC rule for all four quadrants
Can find reference angles
Understand trig graphs (sine, cosine, tangent) Know periods and amplitudes

205
FINAL REVISION TIPS

The Night Before the Exam:
DO:
✓ Review your summary notes
✓ Practice drawing quick sketches of triangles
✓ Recite special angles table 5 times
✓ Check you have: compass, ruler, calculator, pencil, eraser
✓ Get a good night's sleep (at least 7-8 hours)
DON'T:
✗ Try to learn completely new topics
✗ Stay up too late cramming
✗ Panic if you don't remember everything
✗ Forget to prepare your examination materials

During the Exam:
Time Management:
Read all questions first (5 minutes)
Answer easy questions first
Allocate time per question based on marks
Leave 10 minutes for review
Construction Questions:
Draw lightly first, darken final answer
Show all construction arcs
Label all points clearly
Don't erase construction marks
Proof Questions:
Always start with "Given" and "To Prove"
Give a reason for EVERY statement
Draw clear diagrams
Write neatly in two-column format
Trigonometry Questions:
Draw a diagram for EVERY problem

206
Label O, A, H on your diagram
Show all working steps
Include units in final answers
Check if answer asks for exact or approximate value

COMMON MISTAKES TO AVOID

Construction Errors:
❌ Wrong: Erasing construction arcs ✓ Right: Leave all arcs visible as proof of method
❌ Wrong: Using protractor for angle construction ✓ Right: Use only compass and straightedge
❌ Wrong: Not labeling points ✓ Right: Clearly label all vertices and intersection points

Proof Errors:
❌ Wrong: "Angle A = 60° because it looks like 60°" ✓ Right: "Angle A = 60° because it's an equilateral triangle and all angles in an equilateral triangle are equal"
❌ Wrong: Missing the "Given" and "To Prove" sections ✓ Right: Always start with proper proof structure
❌ Wrong: Statements without reasons ✓ Right: Every statement must have a geometric reason

Trigonometry Errors:
❌ Wrong: Confusing Opposite and Adjacent ✓ Right: Always label from the perspective of the given angle
Wrong: sin30° = 30 ✓ Right: sin30° = 0.5 (or 1 for exact)
2
❌ Wrong: Using degrees when answer needs exact values ✓ Right: Use special angles and surds for exact values
❌ Wrong: Forgetting to use inverse functions for finding angles ✓ Right: Use sin−1, cos−1, tan−1 when finding angles
❌ Wrong: Angle of depression = angle in the triangle ✓ Right: Angle of depression = alternate angle to angle of elevation

207
8. QUICK REFERENCE FORMULAS

Special Angles Table (MEMORIZE!):
┌────────┬────────┬────────┬────────┐
│ Angle │ sin	│ cos	│ tan	│
├────────┼────────┼────────┼────────┤
│30°│1/2│√3/2│1/√3││45°│√2/2│√2/2│1││60°│√3/2│1/2│√3│└────────┴────────┴────────┴────────┘

Polygon Formulas:
Sum of Interior Angles: Sum = (� − 2) × 180°
Each Interior Angle (Regular Polygon): Interior = (�−2)×180°
�

Each Exterior Angle (Regular Polygon): Exterior = 360°
�
Sum of ALL Exterior Angles: Always 360°

Trigonometric Ratios:
SOH CAH TOA

sin θ = Opp/Hyp cos θ = Adj/Hyp tan θ = Opp/Adj

ASTC Rule (Quadrants):

II|IS|A                    |
T|CIII|IVI (All): All ratios positive
II (Sin): Only sine positive
III (Tan): Only tangent positive
IV (Cos): Only cosine positive

208
Pythagoras Theorem:

(where c is the hypotenuse)

�2 + �2 = �2

PRACTICE UNDER EXAM CONDITIONS
Mock Exam (90 minutes):
SECTION A: CONSTRUCTIONS (20 marks)
Construct a triangle ABC where AB = 7cm, ∠A = 45°, ∠B = 60°. [5 marks]
Draw a line XY = 10cm. Construct the locus of points that are:
a. 4cm from line XY [3 marks]
b. Equidistant from X and Y [3 marks]
c. Mark and label the points where these loci intersect [2 marks]
SECTION B: THEOREMS (25 marks)
Prove that the sum of angles in a triangle is 180°. [8 marks]
Find x if the angles of a triangle are (2x + 10)°, (3x - 5)°, and (x + 25)°. [5 marks]
A regular polygon has an exterior angle of 40°. How many sides does it have? [4 marks]
In parallelogram PQRS, ∠P = 65°. Find ∠Q, ∠R, and ∠S. [8 marks]
SECTION C: TRIGONOMETRY (35 marks)
Without a calculator, evaluate: sin45°cos45° + tan60°sin30° [6 marks]
A flagpole casts a shadow 15m long when the angle of elevation of the sun is 60°. Find the exact height of the flagpole. [7 marks]
9.	Find θ (0° < θ < 360°) if:

sin� =− 3 [4 marks]
2
cos� = 1 [4 marks]
2
In triangle PQR, ∠R = 90°, PQ = 13cm, PR = 5cm.
a. Find QR [3 marks]
b. Find ∠P (to 1 d.p.) [4 marks]
c. Find ∠Q [2 marks]

209
11.	Sketch the graph of y = sin x for 0° ≤ x ≤ 360°, showing clearly the maximum, minimum, and x-intercepts.
[5 marks]

ANSWER KEY FOR MOCK EXAM
Section A:
(Construction - check with teacher) 2a. Two parallel lines, 4cm on either side 2b. Perpendicular bisector at 5cm mark 2c. Four intersection points total
Section B: 3. (Full proof required - see Week 3) 4. x = 30° 5. n = 9 sides (nonagon) 6. ∠Q =
115°, ∠R = 65°, ∠S = 115°

Section C: 7. 1 + 3 = 1+ 3 8. 15
meters 9a. θ = 240°, 300° 9b. θ = 60°, 300° 10a. QR =
2	2	2
12cm 10b. ∠P ≈ 67.4° 10c. ∠Q = 22.6° 11. (Graph with correct wave pattern)

FINAL ENCOURAGEMENT
Remember:
"Success in Mathematics is not about being brilliant—it's about being persistent, practicing regularly, and understanding the fundamental principles."
Your preparation journey:
✓ You've learned geometric constructions
✓ You've mastered theorem proofs
✓ You've conquered trigonometry
✓ You've practiced numerous problems
You are ready!
Good luck with your examination!

END OF LESSON NOTES

Summary of Second Term Topics:

WeekTopicKey Skills1Constructions IAngle bisection, 60°, 90°, 30°, 45°2Constructions IICopying angles, quadrilaterals, locus

210
WeekTopicKey Skills3Proofs of Theorems ITriangle angle sum, exterior angle4Proofs of Theorems IIRiders, parallel lines, polygons5Midterm ExaminationAssessment6Trigonometric RatiosSOH CAH TOA, finding sides and angles7Midterm BreakRest and review8Special Angles30°, 45°, 60° exact values9ApplicationsElevation, depression, ASTC, quadrants10Trigonometric GraphsUnit circle, sine, cosine, tangent graphs11RevisionComprehensive review and practice

SS1 MATHEMATICS LESSON NOTES
THIRD TERM

WEEK 1: MENSURATION I

INTRODUCTION
Welcome to the Third Term! We will begin this term with Mensuration, which is the branch of mathematics that deals with the measurement of length, area, and volume of geometric shapes.
This week, we focus on the circle. A circle is a 2D shape where all points on the edge (the circumference) are the same distance from a central point.
Historical Context:
The study of circles dates back to ancient civilizations. The Babylonians approximated π as 3.125, while the Egyptians used 3.16. The Greek mathematician Archimedes (287-212 BC) calculated π to remarkable accuracy and developed formulas for circular measurements that we still use today.

Key Formulas (Revision):
CIRCLE FUNDAMENTALS:

Circumference

/	\
|	•Center	|

211
|	Radius	|
\	/

Diameter (d) = 2r

Radius (�): The distance from the center to any point on the circumference.
Diameter (�): The distance across the circle through the center (� = 2�).
Circumference (�): The total distance around the circle. � = 2��.
Area (�): The space enclosed by the circle. � = ��2.
We will use the approximation � ≈ 22 or � ≈ 3.142.
7
Quick Reference:
┌─────────────────────────────────┐
│	CIRCLE FORMULAS SUMMARY	│
├─────────────────────────────────┤
│ Diameter:	d = 2r	│
│ Circumference: C = 2πr = πd	│
│ Area:	A = πr²	│
└─────────────────────────────────┘

CONTENT

A. LENGTH OF ARCS OF CIRCLES
Definitions:
Arc: An arc is any portion of the circumference of a circle.
Sector: A sector is a "slice" of a circle bounded by two radii and the arc between them. It looks like a slice of pizza.
Visual Representation:
Parts of a Circle:

Arc

/	\
|	•	| ← Center
\ |  /
\ | / ← Radius
\|/
+
Sector (shaded region) Pizza Slice Analogy:

212

/ ↑ \
/	|	\ Arc (crust)
| θ  •	|
\	|	/ Radii (cuts)
\ | / Base

Detailed Arc Illustration:
Complete Circle:	Sector with Arc:

/	\	/	 	\
|	•	|	|   /	|
|	|	| /θ •	|
\	/	|\	|

Circumference = 2πr	Arc length = portion
of circumference

Concept: The length of an arc is a fraction of the total circumference. The size of this fraction is determined by the angle � (theta) that the arc subtends (forms) at the center of the circle.
The fraction is �
360°
(since a full circle is 360°).
Formula:

�
Length of Arc = 360° × Circumference

Visual Derivation:
Angle Proportion:
�
Length of Arc = 360°

× 2��

360° → Full circumference (2πr) 180° → Half circumference (πr)
90° → Quarter circumference (πr/2) θ°	→ (θ/360) × 2πr

213
Example with 60°:

/ 60° \
|	•	|
\	/

Arc = (60/360) × 2πr
= (1/6) × 2πr

B. SECTORS AND SEGMENTS OF A CIRCLE
Key Definitions:
Chord: A chord is a straight line segment whose endpoints both lie on the circle. (The diameter is the longest possible chord).
Segment: A segment is the region of a circle bounded by a chord and its arc. It's the "crust" part of the pizza slice.
Minor Segment: The smaller region.
Major Segment: The larger region.
Comprehensive Diagram:
SECTOR vs SEGMENT:

Sector (Pizza Slice):	Segment (Crust): Arc		Arc

/\/ ‾‾‾ \|
\
\•
| /
| /||	|
Chord\|/	Minor segment
Radii	(shaded)

Major vs Minor Segments:

/ ‾‾‾‾‾ \  ← Minor segment
|	|
|	•	| ← Chord
\	/	← Major segment
‾‾‾‾‾‾‾

Detailed Component Breakdown:
Complete Circle Analysis:

Arc Length

214

|/
Sector\
||
|
|
|

/•
/	\
/	\

\|
|
|
|Center

Radii\/
Chord\
||
||	|/Segment
(between chord
and arc)/

Perimeter of a Sector:
This is the total distance around the sector. It is the Arc Length plus the two radii. Formula:
Perimeter of Sector =	× 2�� + 2�

Visual Explanation:
Perimeter Components:

Arc
=		� 360°

× 2�� + 2�

/	\ ← Arc length
|	•	|
\ | / ← Radius 1
\ | /	← Radius 2
\|/

Perimeter = Arc + r + r
= Arc + 2r

ROBUST WORKED EXAMPLES

Example 1.1: Find Arc Length
A circle has a radius of 21 cm. Find the length of an arc that subtends an angle of 60° at the center. (Take � = 22).
7

215
Diagram:
Arc (?)

/	60°	\
|	•	| r = 21 cm
\ 		 	/
|

Solution:
Given:
� = 60°
� = 21 cm
� = 22 7

Step 1: Write the formula Arc Length = �
360°

× 2��
Step 2: Substitute values Arc Length = 60
360
× 2 × 22 × 21
7
Step 3: Simplify the fraction 60 = 1
360	6
Step 4: Calculate Arc Length = 1 × 2 × 22 × 21
6

Answer: The arc length is 22 cm. Visual Verification:
Full circle circumference:
7
= 1 × 2 × 22 × 21
6 × 7
= 924 = 22cm 42
C = 2πr = 2 × (22/7) × 21 = 132 cm

60° is 1/6 of 360°
So arc = 132/6 = 22 cm ✓

Example 1.2: Find the Angle
An arc of length 11 cm is on a circle of radius 7 cm. What angle does the arc subtend at the center?
Diagram:

216
Arc = 11 cm

/	θ?	\
|	•	| r = 7 cm
\ 		 	/
Solution:
Given:
Arc Length = 11 cm
� = 7 cm
� = ?
� = 22 7

Step 1: Write the formula Arc Length = �
360

× 2��
Step 2: Substitute known values 11 = �
360
× 2 × 22 × 7
7
Step 3: Simplify 11 = �
360
× 2 × 22

11 = �
360

× 44
Step 4: Rearrange to find � � = 11×360
44

Answer: The angle is 90°. Visual Verification:
Quarter circle check: 90° = 1/4 of circle
Arc = 1/4 × Circumference
= 1/4 × 2π(7)
= 1/4 × 44
= 11 cm ✓

� = 3960 = 90°
44

Example 1.3: Find Perimeter of a Sector
A sector of a circle has a radius of 14 cm and an angle of 120°. Find the perimeter of the sector.
Diagram:

217
Perimeter = Arc + 2 radii

Arc

/ 120° \
|	•	| r = 14 cm
\	| /
\ | / ← radius
\_|/ ← radius

Total distance around the sector boundary

Solution:
The perimeter is the arc length plus two radii.
Part 1: Arc Length
120
Arc = 360 × 2 ×
22 × 14
7
1
= 3 × 2 ×
1
22 × 14
7
= 3 × 2 × 22 × 2
1	88

Part 2: Two Radii
= 3 × 88 = 3 ≈ 29.33cm

Part 3: Total Perimeter
2� = 2 × 14 = 28cm

Perimeter = 29.33 + 28 = 57.33cm

Or exactly:
88 + 28 =
3
88 + 84 =
3
172
3 cm
Answer: The perimeter of the sector is 57.33 cm (or 172 cm exactly).
3
Visual Breakdown:
Components:
┌─────────────────────────┐
│ Arc length:	88/3 cm │
│ Radius 1:	14 cm	│
│ Radius 2:	14 cm	│
├─────────────────────────┤

218
│ TOTAL:	172/3 cm │
└─────────────────────────┘

REVISION QUESTIONS (WEEK 1)
What is the formula for the circumference of a circle?
What is the difference between an arc and a chord?
What is the difference between a sector and a segment?
What two components make up the perimeter of a sector?
How many degrees are in a full circle?

ASSESSMENT (WEEK 1)

EVALUATION (IN-CLASS)
Define a "sector" of a circle.
Define a "segment" of a circle.
Write down the formula for the length of an arc.
A circle has a radius of 10 cm. What is the length of an arc that subtends 90°? (Leave �
in your answer).
A sector has a radius of 5 cm and an arc length of 10 cm. What is the perimeter of this sector?

ASSIGNMENT (TAKE-HOME)
Find the length of an arc of a circle with a radius of 28 cm, if the angle at the center is 45°. (Take � = 22

The perimeter of a sector of a circle of radius 7 cm is 25 cm.
a. Find the length of the arc of the sector.
b. Find the angle � subtended by the arc at the center.
A bicycle wheel has a radius of 35 cm. If the wheel turns 100 times, what distance has the bicycle covered? (Hint: Find the circumference first).
The minute hand of a clock is 10 cm long. How far does the tip of the hand move in 20 minutes? (Hint:
20minutes = 20 of a full circle ⟹ � = 1 × 360° = 120°).
60	3

219

WEEK 2: MENSURATION II

INTRODUCTION
Last week, we defined sectors and segments and found their lengths. This week, we will calculate their Area (the space they cover). We will also discover the direct and beautiful relationship between a flat sector and the curved surface area of a 3D cone.
Practical Applications:
Understanding sector and segment areas is essential in:
Architecture (designing arches and domes)
Engineering (calculating material needs)
Agriculture (irrigation coverage)
Manufacturing (cutting materials efficiently)

CONTENT

A. AREA OF SECTORS
Concept: Just like arc length, the area of a sector is a fraction of the total area of the circle. The fraction is again � .
360°
Formula:

�
Area of Sector = 360° × Total Area

Visual Explanation:
Area Proportion:
�
Area of Sector = 360°

× ��2

Full Circle:	Sector (60°):

/	\	/ 60° \
|	•	|	|	•	|
\	/	\	/

Area = πr²	Area = (60/360) × πr²
= (1/6) × πr²

220

360° → Full area (πr²) 180° → Half area (πr²/2) 90° → Quarter area (πr²/4) θ°	→ (θ/360) × πr²

Sector Area Visualization:
Dividing the Pizza:

Full Pizza	Quarter Slice
(360°, πr²)	(90°, πr²/4)

/||||||\	/ ‾‾‾ \
//||||||\|	|	•	|
///||•|||\\	\	/
\\\|||||///
\\||||//	Shaded area
‾‾‾‾‾	= 1/4 of total

B. AREA OF SEGMENTS
Concept: A segment is the "crust" of the pizza. To find its area, we take the full slice (the Sector) and subtract the triangular part.
Area of Segment = Area of Sector − Area of Triangle
Visual Breakdown:
Segment = Sector - Triangle

Sector:	Triangle:	Segment:

/ θ \/	\/ ‾ \| • |
\	/-	| • |
\	/=|	|
Full slice	Middle part	Crust part

Detailed Illustration:
Finding Segment Area:

Arc

/ ‾‾‾ \ ← Sector area
|	•	|
| \ | / | ← Triangle to subtract
| \|/ |

221
Chord

Segment (shaded)
= Sector - Triangle

Area of the Triangle:
The triangle inside the sector is formed by two radii (�) and the angle � between them. We use the trigonometric formula for the area of a triangle:
1
Area = 2 𝑎sin�
In our case:
� = � (one radius)
� = � (other radius)
� = � (angle between them)
Area of Triangle = 1 × � × � × sin� = 1 �2sin�

Final Formula:
2

Area of Segment =

× ��2 −
2

�2sin�

Component Diagram:
Segment Area Components:

┌─────────────────────────────────┐
│ SECTOR AREA:	│
│ (θ/360) × πr²	│
├─────────────────────────────────┤
│ MINUS	│
├─────────────────────────────────┤
│ TRIANGLE AREA:	│
│ (1/2)r²sin θ	│
├─────────────────────────────────┤
│ EQUALS	│
├─────────────────────────────────┤
│ SEGMENT AREA	│
└─────────────────────────────────┘

C. RELATIONSHIP BETWEEN SECTOR AND CONE
This is a critical concept in 3D mensuration. A cone is formed by folding a sector of a circle.

222
The Magic Transformation:
When you fold a sector into a cone:
The Radius (�) of the Sector becomes the Slant Height (�) of the Cone.
The Arc Length of the Sector becomes the Base Circumference of the Cone (which is
2��, where � is the cone's new base radius).
The Area of the Sector becomes the Curved Surface Area (CSA) of the Cone. Visual Transformation:
FLAT SECTOR → FOLDED CONE

Before (Flat):	After (3D): Arc		Apex
/\
/θ\/\||FOLD/\\|	/→/\\|r//	R	\\_|/

r (sector radius)	l (slant height)
Arc length	→	2πR (base circumference) Sector area	→	CSA of cone

Detailed Mapping:
SECTOR PROPERTIES	→	CONE PROPERTIES

┌───────────────────┐	┌────────────────────┐
│ Radius: r	│ → │ Slant height: l	│
├───────────────────┤	├────────────────────┤
│ Arc length:	│	│ Base circumference:│
│ (θ/360)×2πr	│ → │ 2πR	│
├───────────────────┤	├────────────────────┤
│ Sector area:	│	│ Curved surface:	│
│ (θ/360)×πr²	│ → │ πRl	│
└───────────────────┘	└────────────────────┘

Deriving the Cone Formula (CSA):

Step 1: Start with sector area Area of Sector = �
360°

2
sector
Step 2: Replace �

sector
with � (slant height): CSA = �
360°
× ��2
Step 3: From arc length relationship: �
360°
× 2�� = 2��

223
Step 4: Divide both sides by 2��:   �    = �
360°	�
Step 5: Substitute back into CSA formula: CSA =	× ��2

CSA = � × � × �

Derivation Flowchart:
Sector area	Arc = Circumference
(θ/360)×πl²	(θ/360)×2πl = 2πR
↓	↓
Replace ratio	Simplify
θ/360 = R/l	θ/360 = R/l
↓	↓
Substitute back
↓
CSA = (R/l)×πl² = πRl ✓

3. ROBUST WORKED EXAMPLES

Example 2.1: Area of a Sector
Find the area of a sector of a circle with radius 10 cm and a central angle of 135°. (Take
� = 3.142).
Diagram:
Sector

/ 135° \
|	•	| r = 10 cm
\	/

Shaded area = ?

Solution:
Given:
� = 135°
� = 10 cm
� = 3.142
Step 1: Write formula Area = �
360°

× ��2

224
Step 2: Substitute values Area = 135 × 3.142 × (10)2
360

Step 3: Simplify fraction 135 = 3 = 0.375
360	8
Step 4: Calculate Area = 0.375 × 3.142 × 100
= 0.375 × 314.2
= 117.825cm2
Answer: 117.825 cm² or 117.83 cm² (to 2 d.p.)
Visual Check:
135° is between 90° (1/4) and 180° (1/2) Full circle area = π(10)² = 314.2 cm² 135/360 = 3/8 = 0.375
0.375 × 314.2 = 117.825 cm² ✓

Example 2.2: Area of a Segment
A chord subtends an angle of 90° at the center of a circle of radius 14 cm. Find the area of the minor segment. (Take � = 22).
7
Diagram:
Minor Segment (shaded):

/ ‾ \
| • | r = 14 cm
|\ | /| θ = 90°
|_\|/_| Chord

Area = Sector - Triangle

Solution:
Area of Segment = Area of Sector − Area of Triangle

Part 1: Area of Sector Given: � = 90°, � = 14 cm

225

Area

sector
= 90
360
× 22 × (14)2
7
1
= 4 ×
1
= 4 ×
1
22 × 196
7
22 × 196

7
22 × 28
= 4 ×	1
1	2

= 4 × 616 = 154cm

Part 2: Area of Triangle Given: � = 90°, � = 14 cm

Area

triangle

1 2
= 2 � sin�

Note: sin90° = 1
= 1 × (14)2 × sin(90°)
2
1
= 2 × 196 × 1 = 98cm2

Part 3: Area of Segment

Areasegment = 154 − 98 = 56cm2

Answer: The area of the segment is 56 cm². Visual Verification:
Sector (quarter circle):

/ | \
| • | = 154 cm²
\_|_/

Triangle (inscribed):

/	\
| • | = 98 cm²
\	/

226

Segment (difference):

/ ‾ \
|	| = 56 cm²

Example 2.3: Sector to Cone
A sector of a circle of radius 15 cm has an angle of 216°. It is folded to form a cone. Find:
a) The base radius of the cone (�).
b) The vertical height of the cone (ℎ).
Diagram:
BEFORE (Flat Sector):
Arc

/ 216° \
|	•	| r = 15 cm
\		/
|

AFTER (Cone):
/\
/ \
/	\ l = 15 cm
/ h	\
/	R	\
Solution:
Given:
Sector radius �� = 15 cm (becomes cone slant height � = 15 cm)
Sector angle � = 216°

a) Find Base Radius (�):
Relationship: Arc Length of Sector = Base Circumference of Cone

Substitute values:
� 360°

× 2���

= 2��
216 × 2�(15) = 2��
360

227
Divide both sides by 2�:

Simplify:

Answer: The base radius is 9 cm.

216 × 15 = �
360

3 × 15 = �
5
� = 9cm

b) Find Vertical Height (ℎ):
The cone has � = 9 cm and � = 15 cm. ℎ is the vertical height. This forms a right-angled triangle (Pythagoras):
�2 = �2 + ℎ2
Substitute:

152 = 92 + ℎ2
225 = 81 + ℎ2
ℎ2 = 225 − 81 = 144

ℎ =
Answer: The vertical height is 12 cm. Pythagorean Triangle:
Cone Cross-Section:
* Apex
/|\
/ |h\
l / |  \
15/	|12 \
/	|	\
/		•	\ R = 9

Verify: 15² = 9² + 12²
225 = 81 + 144
225 = 225 ✓
= 12cm

228
REVISION QUESTIONS (WEEK 2)
What is the formula for the area of a circle?
What is the formula for the area of a sector?
What two components do you subtract to find the area of a segment?
What is the trigonometric formula for the area of a triangle, given two sides and the angle between them?
When a sector is folded into a cone, what does the arc length of the sector become?
What does the radius of the sector become?

ASSESSMENT (WEEK 2)

EVALUATION (IN-CLASS)
Write down the formula for the area of a segment.
A sector has a radius of � and an angle of 60°. What fraction of the circle's total area is it?
Write down the formula for the curved surface area (CSA) of a cone in terms of its base radius � and slant height �.
Find the area of a sector of radius 21 cm with an angle of 60°. (Use � = 22).
7
A sector with radius � and angle � is folded into a cone of base radius �. Write the formula that connects �, �,and�.

ASSIGNMENT (TAKE-HOME)
The arc of a circle of radius 10 cm subtends an angle of 72° at the center. Find:
a. The length of the arc.
b. The area of the sector.
c. The perimeter of the sector.
Find the area of the minor segment of a circle of radius 8 cm if the chord subtends an angle of 60° at the center. (Leave your answer in terms of � and	3).
A cone is formed from a sector of a circle of radius 25 cm with an angle of 144°.
a. Find the base radius of the cone.
b. Find the vertical height of the cone.
c. Find the curved surface area of the cone. (Hint: It's the area of the sector).

229

WEEK 3: SURFACE AREA OF SOLIDS

INTRODUCTION
This week, we move fully into 3D geometry. The Surface Area (SA) of a solid is the total area of all its "faces." It is the area of the "net" of the shape. Imagine you unfold a box to lay it flat; the surface area is the total area of that flat paper. It is measured in square units (cm², m²).
Real-World Applications:
Surface area calculations are essential for:
Painting: How much paint to buy for walls
Packaging: How much material to wrap a product
Manufacturing: Metal sheet requirements
Construction: Roofing and siding estimates

CONTENT

CUBE AND CUBOID
CUBE:
A 3D shape with 6 identical square faces.
Visual Representation:
Cube (3D):	Net (Unfolded):

/|	/|	|	|
/_| / |	_|	|_
| | | |	| |	| |
| |  |_|	|  |	| |
|/	|/	|	|
‾‾‾‾‾	‾‾‾‾‾

All sides = l	6 squares, each l²

Formula:
Let the side length be �.
Area of one face = � × � = �2
Total Surface Area (TSA) = 6 × �2 = �𝟏

230
Visual Formula Derivation:
Cube has 6 faces:

Top: l² Bottom: l² Front: l²
Back:	l²
Left:	l²
Right: l²
───────────── Total: 6l²

CUBOID (Rectangular Prism):
A 3D shape with 6 rectangular faces (3 pairs).
Visual Representation:
Cuboid (3D):

/|	/|
/_|	/ |h
| |	| |
| |	|_|
|/ w |/
‾‾‾‾‾‾‾ l

Dimensions: length (l), width (w), height (h)

Net Diagram:
Unfolded Cuboid Net:

| Top |
| l×w |
 	|	|
|Left |Front|Right|
| w×h | l×h | w×h |
|	|	|	|
|Bottom|
| l×w |
|	|
|Back |
| l×h |
|	|

Formula:

231
Let the dimensions be length (�), width (�), and height (ℎ).
Area of Top/Bottom faces = 2 × (� × �)
Area of Front/Back faces = 2 × (� × ℎ)
Area of Left/Right faces = 2 × (� × ℎ)
TSA = 2�� + 2�ℎ + 2�ℎ = �(𝐥 + 𝐥 + ��)
Visual Breakdown:
┌─────────────────────────────┐
│ CUBOID SURFACE AREA	│
├─────────────────────────────┤
│ Top & Bottom:	2lw	│
│ Front & Back:	2lh	│
│ Left & Right:	2wh	│
├─────────────────────────────┤
│ TOTAL TSA:	2(lw+lh+wh)	│
└─────────────────────────────┘

CYLINDER AND CONE
CYLINDER (Closed):
A solid with two circular ends and one curved side.
Visual Representation:
Cylinder (3D):	Unrolled curved surface:

/	\ 	|
|| |
|_||h
||
||
|h\	/|	|r2πr (width)
Components:
2 circular ends (top & bottom)
1 curved rectangular side

Detailed Component Diagram:
Cylinder Parts:

Top Circle	Curved Surface	Bottom Circle
 	(when unrolled) 	/	\ 	/	\| πr² ||	|h| πr² |\	/|	2πr	|\	/

232

Area = πr²	Area = 2πrh	Area = πr²

Formulas:
Area of Top Circle = ��2
Area of Bottom Circle = ��2
Curved Surface Area (CSA) = The area of the side. If you unroll it, it's a rectangle with height ℎ and width equal to the circumference (2��).
CSA = 2��ℎ
Total Surface Area (TSA) = 2(��2) + 2��ℎ = ���(� + �)
Visual Formula:
TSA = 2πr² + 2πrh
= 2πr(r + h)

┌────────────────────┐
│ TSA Components:	│
├────────────────────┤
│ 2 circles: 2πr²	│
│ Curved side: 2πrh │
│ TOTAL: 2πr(r+h)	│
└────────────────────┘

CONE (Closed):
A solid with one circular base and one curved side.
Visual Representation:
Cone (3D):	Cross-section:
/\
/ \	/|\
/	\l	/h| \
/ h	\	/ | \
/	\	/	|	\ R		R

Slant height (l), vertical height (h), base radius (R)

Net Diagram:
Cone Unfolded:

Sector	Circular Base (curved surface)

233

/ \ l	/	/	\
/	\	/	| πR² |
/ θ \ /	\	/
/ CSA \/

CSA = πRl	Base = πR²

Formulas:
Area of Base = ��2
Curved Surface Area (CSA) = ��� (where � is the slant height)
Total Surface Area (TSA) = ��2 + ��� = ��(� + �)
CRITICAL Triangle Relationship:
The slant height �, vertical height ℎ, and base radius � form a right-angled triangle:
�2 = ℎ2 + �2
Pythagorean Triangle in Cone:
Apex
*
/|\
/ |h\
l / | \
/	|	\
/	|	\
R

Right triangle inside cone: l² = h² + R²

Example:
If R = 3, h = 4
Then l = √(9+16) = √25 = 5

PRISM
Definition: A prism is a solid with a uniform cross-section. This means it has the same shape (e.g., a triangle, a trapezoid) running all the way through it. A cylinder is a circular prism.

234
Visual Examples:
Triangular Prism:	Rectangular Prism:
/\
/ \	/	/|
/	\L	/	/ |
/	\	|	| /
/	\	|	|/

Same triangle	Same rectangle
throughout	throughout

Total Surface Area (TSA):
TSA = 2(Base Area) + (Base Perimeter × Length) TSA = 2�base + �base × �
Component Breakdown:
Prism TSA Components:

┌──────────────────────────────────┐
│ 2 identical end faces:	│
│	2 × (Area of cross-section)	│
├──────────────────────────────────┤
│ Rectangular sides:	│
│	(Perimeter) × (Length)	│
├──────────────────────────────────┤
│ TOTAL TSA	│
└──────────────────────────────────┘

D. PYRAMID
Definition: A solid with a polygon base (e.g., square, triangle) and triangular faces that meet at a single point (the apex).
Visual Representation:
Square-based Pyramid:

* Apex
/|\\
/ | \\
/ |  \\
/	|h \\
/	|	\\ Base

Components:

235
1 square base
4 triangular faces

Detailed Diagram:
Pyramid Parts:

/\	Triangular face
/ \	(slant height = s)
/	\

 		Square base
|	|	(side = l)
|	|

Slant height (s) ≠ Vertical height (h)

Total Surface Area (TSA):
TSA = Area of Base + Area of all Triangular Faces For a square-based pyramid:
TSA = �2 + 4 ×

= �2 + 2��
where � is the slant height of the triangular face.
Visual Formula:
Square Pyramid TSA: Base:	l²
× � × �
4 Triangles: 4 × (½ × base × slant height)
= 4 × (½ × l × s)
= 2ls Total = l² + 2ls

ROBUST WORKED EXAMPLES

Example 3.1: Cuboid
Find the total surface area of a cuboid with length 8 cm, width 5 cm, and height 4 cm. Diagram:

236

/|	/|
/_|	/ |
| | 5	| |4
| |	|_|
|/	8	|/
‾‾‾‾‾‾‾‾‾

l = 8 cm, w = 5 cm, h = 4 cm

Solution:
Given: � = 8, � = 5, ℎ = 4
Formula: TSA = 2(�� + �ℎ + �ℎ)
Substitute: TSA = 2((8 × 5) + (8 × 4) + (5 × 4))
= 2(40 + 32 + 20)
= 2(92) = 184cm2
Answer: 184 cm² Visual Breakdown:
┌─────────────────────────┐
│ Face Areas:	│
├─────────────────────────┤
│ Top/Bottom: 8×5 = 40	│
│ (2 faces):	2×40 = 80 │
├─────────────────────────┤
│ Front/Back: 8×4 = 32	│
│ (2 faces):	2×32 = 64 │
├─────────────────────────┤
│ Left/Right: 5×4 = 20	│
│ (2 faces):	2×20 = 40 │
├─────────────────────────┤
│ TOTAL:	80+64+40	│
│	= 184 cm² │
└─────────────────────────┘

Example 3.2: Cylinder
A closed metal tin is a cylinder of radius 7 cm and height 10 cm. Find the total surface area of the tin. (Take � = 22).
7
Diagram:

237

/	\
| | |  |10 cm
| |_| |
\	/
7 cm

r = 7 cm, h = 10 cm

Solution:

Given: � = 7, ℎ = 10, � = 22
7
Formula: TSA = 2��(� + ℎ)
Substitute: TSA = 2 × 22 × 7 × (7 + 10)
7

Answer: 748 cm²
Step-by-Step Calculation:
TSA = 2πr(r + h)
= 2 × (22/7) × 7 × (17)
= 2 × 22 × 17
= 44 × 17
= 748 cm²
= 2 × 22 × (17)
= 44 × 17 = 748cm2

Verification:
2 circles: 2×π×7² = 2×22×7 = 308 cm² Curved: 2×π×7×10 = 2×22×10 = 440 cm² Total: 308 + 440 = 748 cm² ✓

Example 3.3: Cone (Advanced)
Find the total surface area of a cone with a base radius of 5 cm and a vertical height of 12 cm. (Leave � in your answer).

Diagram:

238
Cone with given h:

*
/|\
/ |h\ l /12| \
/	|	\
/	|	\
5 cm

Need to find l first!

Solution:
Given: � = 5, ℎ = 12. We need the slant height �.
Step 1: Find slant height using Pythagoras:
�2 = ℎ2 + �2
�2 = 122 + 52 = 144 + 25 = 169

� =	= 13cm
Step 2: Find TSA:
TSA = ��(� + �)
= � × 5 × (5 + 13)
= � × 5 × 18
= 90�cm2 Answer: 90π cm² (or approximately 282.74 cm²) Pythagorean Triangle:
Right triangle in cone:
*
/| 13/ |12
/ |
/		| 5

Verify: 13² = 12² + 5²
169 = 144 + 25
169 = 169 ✓

Famous 5-12-13 Pythagorean triple!

239

REVISION QUESTIONS (WEEK 3)
What is the "net" of a solid?
What is the formula for the SA of a cube?
What are the three components of the surface area of a closed cylinder?
What is the difference between vertical height (ℎ) and slant height (�) in a cone?
What formula connects �, ℎ,and� in a cone?

ASSESSMENT (WEEK 3)

EVALUATION (IN-CLASS)
Write the formula for the total surface area of a cuboid.
Write the formula for the curved surface area (CSA) of a cylinder.
Write the formula for the total surface area (TSA) of a cone.
A cube has a side length of 5 cm. What is its total surface area?
A cone has � = 3, ℎ = 4. What is its slant height �?

ASSIGNMENT (TAKE-HOME)
A room (cuboid) has a length of 10 m, a width of 8 m, and a height of 3 m. Find the total area of the four walls and the ceiling. (Note: Do not include the floor).
A cylinder has a radius of 5 cm. Its curvedsurfaceareais 100�cm2.
a. Find the height (ℎ) of the cylinder.
b. Find the total surface area of the cylinder.
A square-based pyramid has a base side of 10 cm and aslantheight(the height of the triangular face) of 12 cm.             Find the total surface area of the pyramid.
A cone has a slant height of 10 cm and a base radius of 6 cm.
a. Find its vertical height (ℎ).
b. Find its total surface area (in terms of �).

240

WEEK 4: VOLUME OF SOLIDS

INTRODUCTION
This week, we move from surface area (a 2D measure) to Volume (a 3D measure). The Volume of a solid is the amount of 3D space it occupies. It is the "capacity" of the object—how much water, sand, or air it can hold. It is measured in cubic units (cm³, m³).
Real-World Applications:
Volume calculations are essential for:
Construction: Concrete needed for foundations
Medicine: Drug dosages and IV fluids
Cooking: Recipe measurements
Shipping: Container capacity
Agriculture: Grain storage silos
Engineering: Fuel tank capacity
Understanding Volume:
Area (2D):	Volume (3D):

|	|	/|	/|
|	|	/_| / |
| | | |
Square units (cm²)	| | |_|
Covers surface	|/	|/
‾‾‾‾‾
Cubic units (cm³) Fills space

CONTENT
There are two main families of solids: Prisms and Pyramids.

A. PRISMS (AND CYLINDERS)
Definition: A Prism is a solid with a uniform (identical) cross-section from one end to the other. If you slice it anywhere along its length, the new face is identical to the base.
Visual Concept:

241
Prism has constant cross-section:

╔═══╗ ╔═══╗ ╔═══╗ ╔═══╗
║	║ ║	║ ║	║  ║	║
╚═══╝ ╚═══╝ ╚═══╝ ╚═══╝ Same shape throughout → PRISM
╔═══╗╔═══╗╔══╗╔═╗║	║║	║║ ║║ ║╚═══╝╚═══╝╚══╝╚═╝
Different shapes → NOT a prism

General Formula:

� = �base × ℎ

Visual Formula:Volume = BaseArea × HeightBaseMultiply byVolume 	height 	|	|
|	|↓
×	h
=/	/|
/	|/Area AA × h (cubic units)

SPECIFIC PRISM FORMULAS:
1. CUBE:
Base is a square (�2). Height is �.
� = �2 × � = ��

242
Diagram:
Cube:

/|	/|
/_| / |
| | | | l
| |  |_|
|/	|/
‾‾‾‾‾ l l

V = l × l × l = l³

Example: l = 3 cm V = 3³ = 27 cm³

CUBOID:
Base is a rectangle (� × �). Height is ℎ.
� = (� × �) × ℎ = 𝐥�
Diagram:
Cuboid:

/	/|
/	/ |h
|	w | /
|		|/ l

V = l × w × h

Example: l=4, w=3, h=2 V = 4 × 3 × 2 = 24 cm³

CYLINDER:
Base is a circle (��2). Height is ℎ.
� = (��2) × ℎ = �𝟏�

243
Diagram:
Cylinder:

/	\
| | | |h
| |_| |
\		/ r

V = πr² × h

Think: Stack of circles
●
●
} h height
●
●
Each circle: πr² Total: πr² × h

TRIANGULAR PRISM:

Base is a triangle (Area = 1 ��). Length is �.
2

� =	�� × �

Diagram:
Triangular Prism:
/\
/ \H
/		\ b

↓ Extend length L

/\	/\
/ \	/ \
/		\	/	\ b		L

V = (½bH) × L

Example: b=6, H=4, L=10 V = (½×6×4) × 10
= 12 × 10 = 120 cm³

244

B. PYRAMIDS (AND CONES)
Definition: A Pyramid is a solid with a polygon base that rises to a single point (the apex).
Visual Concept:
Pyramid vs Prism:

PRISM:	PYRAMID:
╔═══╗	*
║	║	/|\
║	║	/ | \
║	║	/ | \
╚═══╝	/	|	\

Constant	Tapers to cross-section	single point

General Formula:
The volume of any pyramid is exactly one-third the volume of the prism with the same base and height.

Why One-Third?
Visual Proof (Informal):
1
� = 3 �base × ℎ

Take a cube:	Divide into 3 pyramids:

/|	/|	/|\ /|
/_| / |	/_|X_/|
| | | |	|\|/|\|
| |  |_|	|_X_|_|
|/	|/	|/|\|/
‾‾‾‾‾	‾‾‾‾‾

Cube = 3 pyramids
∴ 1 pyramid = 1/3 cube

245
SPECIFIC PYRAMID FORMULAS:
SQUARE-BASED PYRAMID:
Base is a square (�2). Height is ℎ.
� = 1 × �2 × ℎ = � 𝟏�

3	�
Diagram:
Square Pyramid:
*
/|\
/ | \h
/ |  \
/	|	\ l

V = (1/3) × l² × h

Example: l=6, h=9 V = (1/3) × 36 × 9
= 108 cm³

CONE:
Base is a circle (��2). Height is ℎ.
1	2	�	�

Diagram:
Cone:
� = 3 × (��
) × ℎ = � �� �
*
/|\
/ | \h
/ |  \
/	|	\ r

V = (1/3) × πr² × h

Cone vs Cylinder: Same base & height: Cylinder: πr²h Cone: (1/3)πr²h

Cone = 1/3 Cylinder

246
IMPORTANT NOTE:
The height ℎ must be the vertical height, not the slant height.

Correct height:
*
/|
/ |hWrong
*
/
l /height:

· Slant height/ |/(DON'T use!)/	|	\/	\
Use vertical ↑	Not slant ↗

VOLUME FORMULA SUMMARY:
┌────────────────────────────────────┐
│	VOLUME FORMULAS CHART	│
├────────────────────────────────────┤
│ PRISMS (Full height):	│
│ • Cube:	V = l³	│
│ • Cuboid:	V = lwh	│
│ • Cylinder: V = πr²h	│
│ • Prism:	V = (Base Area) × h	│
├────────────────────────────────────┤
│ PYRAMIDS (1/3 rule):	│
│ • Pyramid:	V = (1/3)(Base)h	│
│ • Cone:	V = (1/3)πr²h	│
│ • Any:	V = (1/3)(Area)h	│
└────────────────────────────────────┘

ROBUST WORKED EXAMPLES

Example 4.1: Cylinder
A cylindrical oil drum has a radius of 0.7 m and a height of 1.5 m. How many litres of oil can it hold? (Take � = 22 and 1m3 = 1000L).
7
Diagram:
Oil Drum (Cylinder):

/	\
| |	| |
| |	| |1.5 m
| |	| |
| |	| |

247
\	/
0.7 m

Find volume, then convert to litres

Solution:

Given: � = 0.7 m, ℎ = 1.5 m, � = 22
7
Step 1: Find volume in m³

Note: 0.7 = 7 , so 0.72 = 49

= 0.49

� = ��2ℎ
= 22 × (0.7)2 × 1.5
7
= 22 × 0.49 × 1.5
7
10	100
= 22 × 49

× 1.5
7	100
= 22 × 7
100

× 1.5

Step 2: Convert to litres

Answer: It can hold 2310 litres. Visual Calculation:
V = πr²h
= (22/7) × (0.7)² × 1.5
= 22 × 0.07 × 1.5
= 1.54 × 1.5 = 2.31m3

2.31m3 × 1000L/m3 = 2310L

Break down:
(22/7) × (7/10)² × (3/2)
= (22/7) × (49/100) × (3/2)
= 22 × 7 × 3 / (7 × 100 × 2)
= 22 × 3 / 200
= 66/200 × 7.7
= 2.31 m³
= 2310 L

248
Example 4.2: Cone (Working Backwards)

A cone has a volume of 110cm3 and a height of 21 cm. Find its base radius. (Take � = 22).
7
Diagram:
Cone with known V and h:
*
/|\
/ | \21 cm
/ |  \
/	|	\
r=?

Given: V = 110 cm³ Find: r

Solution:

Given: � = 110 cm³, ℎ = 21 cm, � = ?, � = 22
7
Step 1: Write formula � = 1 ��2ℎ
3

Step 2: Substitute known values 110 = 1 × 22 × �2 × 21
3	7
Step 3: Simplify right side 110 = 1 × 22 × 21 × �2
3

Step 4: Solve for �2 �2 = 110 = 5
22
7
110 = 22 × 21 × �2
3 × 7
110 = 22 × 21 × �2
21
110 = 22 × �2
Step 5: Find � � =	5cm Answer: The radius is Verification:
Check: V = (1/3)πr²h

cm (or approximately 2.24 cm).
= (1/3) × (22/7) × 5 × 21
= (1/3) × 22 × 5 × 3
= 22 × 5
= 110 cm³ ✓

249
Example 4.3: Pyramid (Advanced)
A pyramid has a square base of side 10 cm. Its slant height (the height of a triangular face) is 13 cm. Find the volume of the pyramid.
Diagram:
Finding vertical height:

Side view:	3D view:
*	*
/|\	/|\
/ |h\	13/ | \
/ | \13	/ |h \
/ 5|	\	/	|	\
↑	5
Half	(half of base
of base	= 10/2 = 5)

Need h to find volume!

Solution:
Given: Base side = 10 cm, Slant height of face = 13 cm
Step 1: Find the vertical height (ℎ)
We need the vertical height (ℎ), not the slant height (�� = 13). Imagine a right-angled triangle inside the pyramid, formed by:
The vertical height ℎ (from apex to center of base)
The "apothem" of the base (from center to midpoint of a side) = 10 = 5 cm
2
The slant height �� (13 cm), which is the hypotenuse
Step 2: Use Pythagoras �2 = ℎ2 + (apothem)2
132 = ℎ2 + 52
169 = ℎ2 + 25
ℎ2 = 169 − 25 = 144

ℎ =
Step 3: Calculate volume � = 1 × Base Area × ℎ
3
= 12cm
1
= 3 × (10 × 10) × 12

250

Answer: The volume is 400 cm³. Visual Triangle:
Right triangle in pyramid:
*
/| 13/ |12
/ |
/	| 5

5-12-13 Pythagorean triple!
(Related to 3-4-5)

Verify: 13² = 12² + 5²
169 = 144 + 25
169 = 169 ✓
1
= 3 × 100 × 12
= 1200 = 400cm3 3

REVISION QUESTIONS (WEEK 4)
What is the general formula for the volume of any prism?
What is the general formula for the volume of any pyramid?
What is the relationship between the volume of a cone and a cylinder if they have the same base radius and vertical height?
To find the volume of a cone, do you need the slant height or the vertical height?
How many cm³ are in 1 litre? (1000 cm³ = 1 L).

ASSESSMENT (WEEK 4)

EVALUATION (IN-CLASS)
Write the formula for the volume of a cuboid.
Write the formula for the volume of a cylinder.
Write the formula for the volume of a cone.
A cube has a side of 4 cm. What is its volume?
A cone and a cylinder have the same radius and height. If the cylinder's volume is 30 m³, what is the cone's volume?

251
ASSIGNMENT (TAKE-HOME)
A triangular prism has a base that is a right-angled triangle with sides 5 cm and 12 cm. The length of the prism is 20 cm. Find the volume of the prism. (Hint: Find the area of the triangular base first).

Find the volume of a cone with radius 7 cm and slant height 25 cm. (Take � = 22
A cylindrical container is 20 cm deep. If it holds 3.08 litres of water, calculate the radius of the container. (Hint: 1L = 1000cm3. � = 3080cm3).
A square-based pyramid has a base side of 18 cm and a vertical height of 12 cm. Find its volume.

252

WEEK 5: MIDTERM EXAMINATION
This week is for your midterm examination, which will cover all content from Weeks 1-4 (Arcs, Sectors, Segments, Surface Area, and Volume of all basic solids).
Examination Coverage:
┌────────────────────────────────────┐
│	MIDTERM EXAM TOPICS	│
├────────────────────────────────────┤
│ Week 1: Arc lengths, sectors	│
│ Week 2: Areas, cone-sector link	│
│ Week 3: Surface areas of solids	│
│ Week 4: Volumes of solids	│
└────────────────────────────────────┘

Preparation Checklist:
Review all formulas
Practice arc and sector calculations Master the sector-to-cone transformation
Know surface area formulas (cube, cuboid, cylinder, cone, prism, pyramid) Know volume formulas (all prisms and pyramids)
Practice mixed problems
Understand when to use vertical vs. slant height
Key Formulas to Memorize:
CIRCLES:
Arc: (θ/360) × 2πr
Sector area: (θ/360) × πr²
Segment: Sector - Triangle

SURFACE AREAS:
Cube: 6l²
Cuboid: 2(lw+lh+wh)
Cylinder: 2πr(r+h)
Cone: πR(R+l)

VOLUMES:
Cube: l³
Cuboid: lwh
Cylinder: πr²h
Cone: (1/3)πr²h

253
Prism: (Base Area) × h
Pyramid: (1/3)(Base Area) × h

254

WEEK 6: AREA AND VOLUME OF FRUSTUM

INTRODUCTION
This week, we study a special composite shape called a Frustum (plural: frusta). A frustum is the part of a cone or pyramid that is left when you "cut off" the top with a slice parallel to the base.
Real-World Examples:
Frustums in everyday life:

Bucket	Wine glass	Trumpet

\		/		\	/	/	\ Vase		Trash can

/\/\||||||||\	/\	/
The method for solving frustum problems is "Large Cone - Small Cone" or "Large Pyramid - Small Pyramid".
Visual Concept:
Creating a Frustum:

Original Cone:	Cut off top:	Frustum remains:
*	*
/|\/|\/\/
/|
|\
\
CUT/ | \
/	|	\
//\
\/|\→Small cone/	\/	|	\

Large cone	=	Small cone	+	Frustum

CONTENT

255
A. FINDING THE "MISSING" HEIGHT
To find the volume or area, you must first find the height of the original cone/pyramid. We use
Similar Triangles. Key Variables:
� = radius of the large base (bottom)
� = radius of the small top
� = height of the original large cone
ℎ� = height of the removed small cone
ℎ� = height of the frustum itself
Relationship: � = ℎ� + ℎ�
Visual Diagram:
Complete Setup:

* ← Apex of original cone
/|\
/ | \h_s (small cone height)
/ | \
/	|	\ ← Cut line
|	|	|
|	|	|h_f (frustum height)
|	|	|
|	|	|
←─r─→	← Small radius (top)
←───R───→ ← Large radius (bottom) H = h_s + h_f (total height)

Similar Triangles Ratio:

small radius = small height
large radius	large height
� = ℎ�

�	�
Since � = ℎ� + ℎ�, we can write:
� =	ℎ�

Solving for heights:
�	ℎ� + ℎ�

256
From � = ℎ�:
�	�
ℎ = � ⋅ �
�
Or: � = �⋅ℎ�
�
Visual Similar Triangles:
Similar Triangles Principle:

Small triangle:	Large triangle:
*	*
/|\	/|\
/ | \h_s	/ | \H
/ | \	/  | \
/	|	\	/	|	\ r				R

Ratio: r/R = h_s/H
(Corresponding sides proportional)

B. VOLUME OF A FRUSTUM
Formula:
Volume = Volume of Large Cone − Volume of Small Cone
�	1   �2	1	2

frustum = 3 �
� − 3 �� ℎ�
1	�2	2

This also works for pyramids:

�
= 3 �(	� − � ℎ�)

1	1

Visual Subtraction:
Volume Calculation:
frustum = 3 �Base� − 3 �topℎ�

Large Cone
*Small Cone
*Frustum/|\/|\/	\/ | \H/ | \h_s/	\h_f/|\-/|\=/\/	|	\	/	|	\	/	\

257
RrR
V_large (1/3)πR²H
-		V_small (1/3)πr²h_s
=
V_frustum Large - Small

C. SURFACE AREA OF A FRUSTUM
The total surface area is the sum of:
Area of the top circle
Area of the bottom circle
Curved surface area (CSA)
Curved Surface Area (CSA) of Frustum:
CSA = CSA of Large Cone − CSA of Small Cone CSA = ��� − ����
where � and �� are the slant heights of the large and small cones.
Total Surface Area (TSA):

Component Diagram:
TSA Components:
TSA = ��2 + ��2 + (��� − ����)
= ��2 + ��2 + �(�� − ���)

/ Top: πr² \
/	\
/	Curved:	\
| π(RL - rl_s) |
\	/
\	/ Bottom: πR²

Total = πr² + πR² + π(RL-rl_s)

D. COMPOUND SHAPES
Definition: These are shapes made by joining two or more simple solids.
Rules:
Total Volume: Find the volume of each part and ADD them.

258
Total Surface Area: Find the surface area of each part and ADD them, but be careful to
SUBTRACT any surfaces that are hidden by the join.
Examples:
Common Compound Shapes:

Hemisphere on Cylinder:

/	\
|	|
|	|
|	|

Cone on Cylinder:
/\
/ \
|	|
|	|
|	|

Pyramid on Cube:
*
/|\
/ | \
|	|
| |  |
|	| Surface Area Caution: Hidden Surfaces:
/\	When joined:
/\Don't count|	|the base of cone|	|
|	|←OR top of cylinder
(they're hidden!)
Only count exposed surfaces!

3. ROBUST WORKED EXAMPLES

Example 6.1: Volume of a Cone Frustum
A bucket is 28 cm high. Its top and bottom radii are 15 cm and 10 cm respectively. Find the volume of the bucket. (Take � = 22).
7

259
Diagram:
Bucket (Frustum):
* ← Original apex
/|\
/ | \h_s
/ 10 \ ← Top (r = 10)
|	|
|	|28 cm (h_f)
|	|
| 15  | ← Bottom (R = 15)

Given: h_f=28, R=15, r=10 Find: Volume

Solution:
Step 1: Given Information
ℎ� = 28 cm (frustum height)
� = 15 cm (bottom radius)
� = 10 cm (top radius)
� = 22 7

Step 2: Find Heights (� and ℎ�)
Let ℎ� be the height of the small cone.
� = ℎ� + 28 (total height)
Using similar triangles: � = ℎ�
�	�
10 =	ℎ�

15	ℎ� + 28
2 =	ℎ�

3	ℎ� + 28
Cross-multiply: 2(ℎ� + 28) = 3ℎ�

Therefore: � = 56 + 28 = 84cm
2ℎ� + 56 = 3ℎ�
56 = 3ℎ� − 2ℎ� ℎ� = 56cm

260
Step 3: Calculate Large Cone Volume

�Large

= 1 ��2�
3
1
= 3 ×
1
22 × (15)2
7
22

× 84
= 3 × 7 × 225 × 84

Since 84 = 12 × 7:
= 22 × 225 × 84
3 × 7
= 22 × 225 × 12
7
= 22 × 225 × 12
7

= 22 × 225 × 84
21
= 22 × 225 × 4 = 19,800cm3

Step 4: Calculate Small Cone Volume
�	= 1 ��2ℎ
Small	3	�
1	22	2

= 3 × 7 × (10) × 56
1	22
= 3 × 7 × 100 × 56
= 22 × 100 × 56
21
= 22 × 100 × 8
3
= 17,600 ≈ 5,866.67cm3 3

Step 5: Find Frustum Volume

�frustum = �Large − �Small

261
= 19,800 − 5,866.67
= 13,933.33cm3
Answer: 13,933.33 cm³ or 41,800 cm³ exactly.
3
Visual Summary:
┌────────────────────────────┐
│ VOLUME CALCULATION:	│
├────────────────────────────┤
│ Large cone: 19,800 cm³	│
│ Small cone: 5,867 cm³	│
│ ─────────────────────	│
│ Frustum:	13,933 cm³	│
└────────────────────────────┘

Example 6.2: Compound Shape (Volume)
A shape is formed by a hemisphere of radius 7 cm placed on top of a cylinder of radius 7 cm and height 10 cm. Find the total volume.
Diagram:
Compound Shape:

/	\ ← Hemisphere (r=7)
|	|
|	|
|	| ← Cylinder (r=7, h=10)
|	|
|	|

Total Volume = V_hemisphere + V_cylinder

Solution:

Formula for sphere: � = 4 ��3
3

Formula for hemisphere: � = 2 ��3
3

Part 1: Volume of Cylinder

�Cylinder = ��2ℎ
= 22 × (7)2 × 10
7

262
= 22 × 49 × 10
7
= 22 × 7 × 10
= 1,540cm3

Part 2: Volume of Hemisphere

�Hemisphere

= 2 ��3
3
2	22	3

= 3 ×
2
= 3 ×
7 × (7)
22 × 343
7
= 2 × 22 × 343
3 × 7
= 2 × 22 × 49
3
= 2,156 ≈ 718.67cm3 3

Part 3: Total Volume

�Total = 1,540 + 718.67
= 2,258.67cm3
Answer: 2,258.67 cm³ (or 2,259 cm³ to nearest cm³)
Calculation Breakdown:
┌─────────────────────────────┐
│ VOLUME COMPONENTS:	│
├─────────────────────────────┤
│ Cylinder:	1,540.00 cm³	│
│ Hemisphere:	718.67 cm³	│
│ ─────────────────────	│
│ TOTAL:	2,258.67 cm³	│
└─────────────────────────────┘

263
REVISION QUESTIONS (WEEK 6)
What is a frustum?
What is the key mathematical principle used to find the "missing" height of the original cone/pyramid?
Write the formula for the volume of a cone frustum using �Large and �Small.
Write the formula for the TSA of a cone frustum.
When finding the Total Surface Area of a compound shape (e.g., cone on a cylinder), what must you be careful not to include?

ASSESSMENT (WEEK 6)

EVALUATION (IN-CLASS)
Draw a frustum of a cone and label �, �, ℎ�, �,andℎ�.
Write the similar triangle ratio for the heights and radii of a cone frustum.
How do you find the volume of a compound shape?
A hemisphere is placed on a cube. How do you find the total volume?
A small cone is cut from a large cone. How do you find the volume of the remaining part?

ASSIGNMENT (TAKE-HOME)
A frustum of a cone has a top radius of 5 cm, a bottom radius of 10 cm, and a vertical height of 12 cm.
a. Find the height of the small cone that was cut off.
b. Find the volume of the frustum.
A frustum is cut from a square-based pyramid. The large base has sides 15 cm, the small base has sides 5 cm. The frustum height is 6 cm.
a. Find the height of the original pyramid.
b. Find the volume of the frustum.
A solid object is made of a cylinder of height 10 cm and radius 3 cm, with a hemisphere of radius 3 cm on top. Find:
a. The total volume of the object.
b. The total surface area of the object. (Hint: It's the CSA of the cylinder + Area of the base circle + CSA of the hemisphere).

264
WEEK 7: MIDTERM BREAK
This week is for your midterm break. Suggested Activities:
Review mensuration formulas
Practice frustum problems
Work on compound shapes
Prepare for statistics topics

265

WEEK 8: STATISTICS I

INTRODUCTION
This week, we begin our study of Statistics. Statistics is the science of collecting, organizing, analyzing, and interpreting data to make informed decisions. It's how we find patterns in the world, from polling to medicine to finance.
Why Study Statistics?
Statistics is everywhere in modern life:
Social media analytics
Medical research and drug trials
Election polls and predictions
Business decisions and market research
Climate change data
Educational assessments
Economic indicators
The Statistical Process:
┌─────────────────────────────────┐
│	THE STATISTICS CYCLE	│
├─────────────────────────────────┤
│
│1.COLLECT data
↓│
││2.ORGANIZE data (tables)││↓││3.PRESENT data (graphs)││↓││4.ANALYZE data (calculations)││↓││5.INTERPRET results││↓││6.MAKE DECISIONS│└─────────────────────────────────┘

CONTENT

A. COLLECTION OF MEANINGFUL DATA
Key Definitions:

266
Data: A set of facts, figures, or information (e.g., test scores, heights, colors). Meaningful Data: The data must be relevant to the problem you are studying. Population: The entire group you are interested in (e.g., all SS1 students in Nigeria).
Sample: A small, representative subgroup of the population, used when the population is too large to study.
Visual Explanation:
POPULATION vs SAMPLE:

Population (ALL):	Sample (SOME):
┌─────────────────┐	┌──────────┐
│ ● ● ● ● ● ● ● ● │	│ ● ●	● │
│ ● ● ● ● ● ● ● ● │	│	● ● │
│ ● ● ● ● ● ● ● ● │ →	│	● │
│ ● ● ● ● ● ● ● ● │	│ ●	● │
│ ● ● ● ● ● ● ● ● │	└──────────┘
└─────────────────┘	Selected subset All 5 million	500 people
SS1 students	(representative)

SOURCES OF DATA
PRIMARY DATA
Information you collect yourself, firsthand.
Methods:
Questionnaires: Written surveys
Interviews: Face-to-face questions
Experiments: Controlled tests
Observation: Watching and recording
Advantages (Pros):
✓ Specific to your research question
✓ Accurate and up-to-date
✓ You control the quality
✓ Original and reliable
Disadvantages (Cons):
✗ Time-consuming
✗ Expensive

267
✗ Requires expertise
✗ May need large sample
Example:
Primary Data Collection:
┌────────────────────────────┐
│ Student conducts survey:	│
│ "How many hours do you	│
│ study per day?"	│
│	│
│ Goes to 100 classmates	│
│ Records their answers	│
│ → PRIMARY DATA	│
└────────────────────────────┘

SECONDARY DATA
Information that someone else has already collected.
Methods:
Textbooks and journals
Government reports (e.g., National Bureau of Statistics)
Company records
Websites and databases
Newspapers and magazines
Advantages (Pros):
✓ Cheap or free
✓ Quick to obtain
✓ Large datasets available
✓ Historical data accessible
Disadvantages (Cons):
✗ May be outdated
✗ May not fit your exact needs
✗ Potential bias
✗ Unknown collection methods

268

Example:
Secondary Data Use:
┌────────────────────────────┐
│ Student reads report from: │
│ "National Bureau of	│
│ Statistics Nigeria"	│
│	│
│ Uses published data on	│
│ school enrollment rates	│
│ → SECONDARY DATA	│
└────────────────────────────┘

COMPARISON TABLE:
┌────────────┬──────────────┬──────────────┐
│ Aspect	│ Primary Data │ Secondary	│
├────────────┼──────────────┼──────────────┤
│ Source	│ You collect │ Already	│
│	│ it yourself │ collected	│
├────────────┼──────────────┼──────────────┤
│ Cost	│ Expensive	│ Cheap/Free	│
├────────────┼──────────────┼──────────────┤
│ Time	│ Slow	│ Quick	│
├────────────┼──────────────┼──────────────┤
│ Relevance │ Very high	│ May vary	│
├────────────┼──────────────┼──────────────┤
│ Control	│ Full control │ No control	│
└────────────┴──────────────┴──────────────┘

TYPES OF DATA
QUALITATIVE (CATEGORICAL) DATA
Data that describes a quality or category. It is non-numerical. Characteristics:
Describes attributes
Cannot be measured numerically
Can be named or labeled
Used for classification
Examples:
Favorite food (Rice, Beans, Yam)

269
Gender (Male, Female)
Color of car (Red, Blue, Black)
State of origin (Lagos, Kano, Rivers)
Marital status (Single, Married)
Blood type (A, B, AB, O)
Visual:
Qualitative Data Examples:

Food preferences:
Pizza | Jollof | Suya | Amala

Clothing sizes:
Small | Medium | Large | XL

Colors:
Red | Green | Blue | Yellow

QUANTITATIVE (NUMERICAL) DATA
Data that consists of numbers.
A. DISCRETE DATA
Can be counted. Has finite, distinct values (often integers).
Characteristics:
Countable items
Whole numbers (usually)
Gaps between values
Cannot have fractions/decimals in context
Examples:
Number of students in a class (25, 30, 35...)
Shoe size (38, 39, 40, 41...)
Number of goals scored (0, 1, 2, 3...)
Number of children (0, 1, 2, 3...)
Age in years (15, 16, 17...)
Number of cars in a parking lot
Visual:
Discrete Data (Countable):

270
Students: ● ● ● ● ● = 5 students
(can't have 5.3 students!)

Cars:		= 3 cars (not 3.7 cars)

Goals: ⚽ ⚽ = 2 goals
(not 2.5 goals)

B. CONTINUOUS DATA
Can be measured. Can take any value within a range.
Characteristics:
Measured quantities
Can have decimals/fractions
Infinite possible values
Depends on precision of measurement
Examples:
Height (1.72m, 1.721m, 1.7215m...)
Temperature (36.5°C, 36.52°C...)
Time (10.5 seconds, 10.53s...)
Weight (65.3kg, 65.34kg...)
Distance (100.5m, 100.52m...)
Speed (80.7 km/h...)
Visual:
Continuous Data (Measured):

Height: |----•----| 1.72m
Could be 1.721m or 1.7215m (depends on measurement tool)

Time: ├──────•──────┤ 10.5s Could be 10.53s or 10.534s

Weight: [====•====] 65.3kg
Could be 65.34kg or 65.345kg

271
DATA TYPES FLOWCHART:
DATA
|
┌───────┴───────┐
││QUALITATIVEQUANTITATIVE(Categories)(Numbers)||│┌─────┴─────┐│││FavoriteDISCRETECONTINUOUSfood,(Count)(Measure)gender,||colorStudents,Height,goals,weight,carstime

B. TABULATION AND PRESENTATION (UNGROUPED DATA)
Raw Data: Data that has just been collected and is in no particular order.
Example: Scores of 20 students:
5, 7, 8, 6, 7, 5, 9, 8, 7, 7,
9, 5, 6, 8, 7, 10, 6, 8, 7, 5

This is messy and hard to understand!

Tabulation: The process of organizing raw data into a Frequency Distribution Table. Key Terms:
Tally: A quick way of counting using strokes
o | = 1
o || = 2
o ||| = 3
o |||| = 4
o |||| = 5 (crossed)
Frequency (�): The total count for each item

272

Visual Tally System:
Counting with Tallies:

1: |
2: ||
3: |||
4: ||||
5: |||| (crossed diagonally) 6: |||| |
7: |||| ||
8: |||| |||
9: |||| ||||
10: |||| ||||

3. ROBUST WORKED EXAMPLE

Example 8.1: Creating a Frequency Table
The raw data below represents the shoe sizes of 20 students. Organize this data into a frequency distribution table.
Raw Data:
7, 8, 9, 7, 8, 10, 6, 8, 9, 7,
8, 8, 7, 6, 8, 9, 7, 8, 10, 8

Solution:
Step 1: Identify the smallest and largest values
Smallest = 6
Largest = 10
Step 2: Create table structure with columns:
"Shoe Size (x)"
"Tally"
"Frequency (f)"
Step 3: Go through the raw data one by one, making a tally mark for each value
Step 4: Count the tallies to get frequency
Final Frequency Distribution Table:

273
Shoe Size (x)TallyFrequency (f)678910Total∑f = 20
Visual Process:
Raw Data (messy): 7,8,9,7,8,10,6,8,9,7,8,8,7,6,8,9,7,8,10,8
↓ ORGANIZE ↓
Frequency Table (clear):

Size | Frequency
 	|
6|██ (2)7|█████ (5)8|████████ (8) ← Most common9|███ (3)10|██ (2)Interpretation:
This table is much clearer than raw data ✓ We can immediately see that:
Size 8 is most popular (8 students)
Sizes 6 and 10 are least common (2 each)
Total students = 20 (∑f = 20)

Benefits of Frequency Tables:
┌────────────────────────────────┐
│ WHY USE FREQUENCY TABLES?	│
├────────────────────────────────┤
│ ✓ Easy to read and understand │
│ ✓ Shows patterns clearly	│
│ ✓ Identifies most/least common │
│ ✓ Compact representation	│
│ ✓ Ready for graphing	│
│ ✓ Easy to calculate statistics │
└────────────────────────────────┘

274
REVISION QUESTIONS (WEEK 8)
Define Statistics.
What is the difference between Primary and Secondary data?
What is the difference between Qualitative and Quantitative data?
Give an example of Discrete data and Continuous data.
What is the purpose of a Tally column in a frequency table?

ASSESSMENT (WEEK 8)

EVALUATION (IN-CLASS)
A researcher gets data from the National Bureau of Statistics. Is this primary or secondary data?
A student counts the number of cars passing the school gate. Is this primary or secondary data?
Classify the following as qualitative, discrete, or continuous:
a. The brands of phones in the class.
b. The number of siblings each student has.
c. The time it takes to run 100m.
What is "raw data"?
What does ∑� mean?

ASSIGNMENT (TAKE-HOME)
Ask 20 friends or family members for their favorite color from this list: Red, Blue, Green, Black, Other.
a. What type of data is this (qualitative, discrete, continuous)?
b. Is this primary or secondary data?
c. Present your findings in a frequency distribution table (with Tally and Frequency).
The following are the marks (out of 10) of 30 students in a Mathematics quiz:

5,8,6,7,7,10, 9, 4, 5, 6,7,8,9,7,6,5, 8, 7, 7, 9,4,6,8,7,6,7, 8, 9, 5, 7a. What is the range of the scores?
b. Construct a frequency distribution table for this data.
c. What is the modal score (the score with the highest frequency)?

275

WEEK 9: STATISTICS II

INTRODUCTION
Last week, we organized raw data into simple frequency tables. But what if our data is continuous or very spread out (e.g., heights of 100 people)? We need to group the data into class intervals. We will also learn how to represent this data visually using Bar Charts and Histograms.
Why Group Data?
Ungrouped (100 different heights): 150, 151, 152, 153, 154, 155, 156...
❌ Too many individual values!
❌ Hard to see patterns!

Grouped (into ranges): 150-154: 15 people
155-159: 25 people
160-164: 35 people
165-169: 20 people
170-174: 5 people
Much clearer!
Easy to see pattern!

CONTENT

A. FREQUENCY DISTRIBUTION (GROUPED DATA)
Key Terms:
Class Interval:
We group the data into "bins" or ranges.
Examples:
10-19, 20-29, 30-39 (ages)
0-4, 5-9, 10-14 (scores)
150-159, 160-169 (heights in cm)
Visual:

276
Class Intervals:

10-19 [===]
20-29	[===]
30-39	[===]
40-49	[===]

Each bracket = one class interval

Class Boundaries:
To avoid gaps (e.g., where does 19.5 go?), we create "true" boundaries. Rule: Subtract 0.5 from the lower limit and add 0.5 to the upper limit. Examples:
10-19 becomes 9.5-19.5
20-29 becomes 19.5-29.5
30-39 becomes 29.5-39.5 Visual Explanation:
Class Intervals with Boundaries:
Stated:	10-19	20-29	30-39
[====]	[====]	[====]

True	9.5─────19.5─────29.5─────39.5 Boundaries:		└────┘	└────┘	└────┘
No gaps - continuous!

Where does 19.5 belong?
Between 10-19 and 20-29
Boundaries solve this!

Class Width (Size):
The size of the interval.
Formula: Class Width = Upper Boundary − Lower Boundary
Example:
Class 10-19 has boundaries 9.5-19.5
Width = 19.5 - 9.5 = 10

277
Class Midpoint (Mark):
The middle value of the interval.
Formula: Midpoint = Lower Limit+Upper Limit
2
Example:
Class 10-19: Midpoint = 10+19 = 14.5
2
Class 20-29: Midpoint = 20+29 = 24.5
2
Visual:
Class Midpoint:

10────────────19
↓
14.5 (middle)

20────────────29
↓
24.5 (middle)

COMPREHENSIVE EXAMPLE:
Grouping the 30 test scores from Week 8 assignment.
Raw Data:

5,8,6,7,7,10, 9, 4, 5, 6,7,8,9,7,6,5, 8, 7, 7, 9,4,6,8,7,6,7, 8, 9, 5, 7Step 1: Find range
Minimum = 4
Maximum = 10
Range = 10 - 4 = 6
Step 2: Choose class intervals: 4-5, 6-7, 8-9, 10-11
Grouped Frequency Table:

Class IntervalTallyFrequency (f)4-56-78-9

278
Class IntervalTallyFrequency (f)10-11Total30
With Additional Columns:

ClassTallyfBoundariesMidpoint4-56-78-910-1119.5-11.5∑30
B. GRAPHS
Graphs are visual representations of data.

LINEAR GRAPH
A simple graph using lines to connect points. Used for: Showing trends over time Examples:
Temperature changes during the day
Company profit over 5 years
Student enrollment by year
Stock prices over time
Visual Example:
Temperature Throughout Day:

°C
30|	╱‾‾╲
|	╱	╲ 25|	╱		╲
| ╱	╲
20|╱	╲
└───────────────────── 6am 12pm 6pm 12am

Line shows continuous change

279

BAR CHART
Used for: Qualitative or Discrete data
Key Features:
Has gaps between the bars
X-axis lists the categories or discrete values
Y-axis represents the frequency
Bars can be vertical or horizontal
All bars same width
Visual Structure:
Bar Chart (Discrete Data):

Frequency
↑
10│	████
│	████
8│████ ████
│████ ████ ████ 6│████ ████ ████
│████ ████ ████ ████ 4│████ ████ ████ ████
│████ ████ ████ ████ 2│████ ████ ████ ████
└─────────────────────→ 5	7	8	9
Shoe Sizes

Notice the GAPS between bars! (Shows discrete categories)

Example:
Favorite Subjects:

Students
↑
20│	████████
│	████████
15│	████ ████████
│	████ ████████ 10│████ ████ ████████ ████
│████ ████ ████████ ████ 5│████ ████ ████████ ████
└─────────────────────────→

280
Math Eng Science Arts Gaps show different categories

HISTOGRAM
Used for: Continuous, grouped data Key Features:
Bars must touch (no gaps)
X-axis marked with Class Boundaries
Y-axis represents frequency
Area of bar = frequency (usually)
Shows continuous data distribution
Visual Structure:
Histogram (Continuous Data):

Frequency
↑ 20│
│	████████████
15│	████████████
│	████████████████████ 10│████████████████████████
│████████████████████████████ 5│████████████████████████████
└────────────────────────────→ 149.5 154.5 159.5 164.5
Height (cm)

NO GAPS - bars touch! (Shows continuous data)

Bar Chart vs Histogram:
┌─────────────┬──────────┬───────────┐
│ Feature	│ Bar Chart│ Histogram │
├─────────────┼──────────┼───────────┤
│ Data Type	│ Discrete │Continuous │
│	│Qualitative│ Grouped │
├─────────────┼──────────┼───────────┤
│ Gaps	│ YES	│ NO	│
│	│ (spaces) │ (touching)│
├─────────────┼──────────┼───────────┤
│ X-axis	│Categories│Class	│

281
│	│or values │Boundaries │
├─────────────┼──────────┼───────────┤
│ Bars can be │ YES	│ Usually	│
│ rearranged? │	│ NO	│
└─────────────┴──────────┴───────────┘

3. ROBUST WORKED EXAMPLE

Example 9.1: Histogram
The table below shows the heights of 50 SS1 students. Represent this data on a histogram.

Height (cm)150-154155-159160-164165-169170-174Frequency (f)61218104

Solution:

Step 1: Find Class Boundaries
We must close the gaps between intervals.

ClassBoundaries150-154149.5-154.5155-159154.5-159.5160-164159.5-164.5165-169164.5-169.5170-174169.5-174.5

Step 2: Set Up Axes
Y-axis: Frequency (0 to 18, or slightly higher)
X-axis: Height (cm), marked with boundaries

Step 3: Draw Bars
Each bar starts at lower boundary and ends at upper boundary, with height equal to frequency.
Histogram Diagram:

282
Histogram of Student Heights Frequency

6│████████████████████████████
│████████████████████████████ 4│████████████████████████████████
│████████████████████████████████ 2│████████████████████████████████
└────────────────────────────────→
149.5	154.5	159.5	164.5	169.5	174.5
Height (cm) - Boundaries

Key features:
Bars touch (continuous data)
Boundaries on x-axis
Tallest bar at 160-164 (modal class)
Distribution roughly bell-shaped
Step-by-Step Drawing:
1. First bar (149.5 to 154.5):
Height = 6

6│████
└────
149.5 154.5

2. Second bar (154.5 to 159.5):
Height = 12

12│	████
6│████████
└────────
149.5 154.5 159.5

283

Continue for all classes...

Interpretation:
From the histogram we can see:
Most students (18) are 160-164 cm
Few students (4) are 170-174 cm
Distribution is roughly normal
Mean height likely around 160 cm

REVISION QUESTIONS (WEEK 9)
Why do we use "grouped" frequency tables?
What is the main physical difference between a bar chart and a histogram?
What type of data is a bar chart used for?
What type of data is a histogram used for?
What is plotted on the horizontal (x) axis of a histogram?

ASSESSMENT (WEEK 9)

EVALUATION (IN-CLASS)
For the class interval 20-29, what is the:
a) class midpoint
b) class boundary
What does a gap between bars on a chart signify?
What is a linear graph most suitable for showing?
If you have data for "Number of children per family", would you use a bar chart or a histogram? Explain.
If you have data for "Height of students", would you use a bar chart or a histogram? Explain.

ASSIGNMENT (TAKE-HOME)
1.	The following are the ages of 30 people at a party:

25,30,18,45,42,28,19,20,22,33,35,40,38,29,27,22,25,30,31,26,41,37,26,28,30,33,39,21,19,44o a. Create a grouped frequency distribution table for this data. Use class intervals: 15-19, 20-24, 25-29, 30-34, 35-39, 40-44, 45-49.

284
o b. Draw a Histogram to represent this data. (Remember to use class boundaries!)

285

WEEK 10: STATISTICS III

INTRODUCTION
This week, we learn the final two methods of data presentation: Pie Charts (for showing proportions) and Frequency Polygons (for showing the shape of a distribution).
Visual Overview:
Statistical Graphs Summary:

BAR CHARTHISTOGRAMPIE CHARTFREQUENCY(discrete)(continuous)(proportions)POLYGON
||||
████
o ◑ ◒ ◓(distribution)
/\||||████o ◑◒◓◓/\||||████o ◑◑◒◓/\────────────◯────────

CONTENT

PIE CHARTS
Definition: A circular chart divided into sectors, where each sector represents a proportion of the whole.
Use: Best for showing:
Market share
Percentage breakdown
Parts of a whole
Budget allocation
Survey results (proportions)
Concept:
The whole circle (360°) represents the total frequency (or 100%).
Formula:

286
Visual Concept:
Pie Chart Structure:

360° total

/	|	\
|	A	|	B	|
|	|	|
\	|	/
\		|	/ C
Each slice (sector) = proportion of whole If Total = 100 students
Sector A = 40 students
Angle A = (40/100) × 360° = 144°

Example 10.1: Pie Chart
In an SS1 class of 80 students, 30 are in the Arts stream, 40 are in Science, and 10 are in Commercial. Represent this on a pie chart.
Solution:
Step 1: Find Total Frequency
Total = 30 + 40 + 10 = 80 students

Step 2: Calculate the angle for each sector

Arts: Angle = 30 × 360° = 3 × 360° = 3 × 45° = 135°
80	8
Science: Angle = 40 × 360° = 1 × 360° = 180°
80	2
Commercial: Angle = 10 × 360° = 1 × 360° = 45°
80	8

Step 3: Verification
Check that angles add to 360°: 135° + 180° + 45° = 360° ✓

Step 4: Draw the Pie Chart

287
Complete Pie Chart:

Commercial 45°

/	|	\
/	A	|	S	\
| 135°	| 180°	|
| Arts |Science |
\	|	/
\	|	/

Legend:
Arts: 30 students (135°) - Light shade Science: 40 students (180°) - Medium shade Commercial: 10 students (45°) - Dark shade

Drawing Steps:
Step 1: Draw circle
○

Step 2: Draw radius
|
○

Step 3: Measure 180° (Science)
─────

Step 4: Measure 135° (Arts)
╱ ●

Step 5: Remaining 45° (Commercial) Complete!

Calculation Table:

StreamFrequencyCalculationAngleArts30(30/80)×360°135°Science40(40/80)×360°180°Commercial10(10/80)×360°45°Total80360°
FREQUENCY POLYGONS
Definition: A line graph formed by joining the midpoints of the tops of the bars of a histogram.
Use:

288
Shows the shape of the distribution more clearly
Good for comparing two datasets on the same graph
Emphasizes trends and patterns
Simpler visual than histogram
Plotting:
X-axis: Class Midpoints (Marks)
Y-axis: Frequency
"Grounding" the Polygon:
To make it a closed shape ("polygon"), we always add an "imaginary" class with 0 frequency at the beginning and at the end.
Visual Concept:
From Histogram to Frequency Polygon:

Histogram:	Mark midpoints:	Connect points:
████	●	●
████	╱│╲	╱ ╲
████	● │ ●	●	●
████	╱ │ ╲	╱	╲
──────	●───●───●	──●───────●── Ground points

ROBUST WORKED EXAMPLE

Example 10.2: Frequency Polygon
Use the student height data from Week 9 to draw a frequency polygon.

Height (cm)150-154155-159160-164165-169170-174Frequency (f)61218104Solution:
Step 1: Find Class Midpoints

ClassCalculationMidpoint150-154(150+154)/2152155-159(155+159)/2157160-164(160+164)/2162165-169(165+169)/2167

289
ClassCalculationMidpoint170-174(170+174)/2172

Step 2: Add "Grounding" Points
Before first class (145-149):
Midpoint = 147
Frequency = 0 After last class (175-179):
Midpoint = 177
Frequency = 0

Step 3: Create Plotting Table

Midpoint (x)
Frequency (f)1470 (ground)152615712162181671017241770 (ground)

290

Step 4: Plot and Connect
Frequency Polygon

Frequency
↑ 20│
│
18│	●
│	╱ ╲
16│	╱	╲
│	╱	╲
14│	╱	╲
│	╱	╲
12│	●	╲
│	╱	╲
10│	╱	●
│ ╱	╲
8│ ╱	╲
│╱	╲
6●	●
╱	╲
4│	╲
│	╲
2│	●
│	╲
0●─────────────────────────────●→
147 152 157 162 167 172 177
Height (cm) - Midpoints

Key features:
Starts and ends at ground (0)
Connects midpoints
Shows distribution shape
Peak at 162 cm (modal class) Comparison: Histogram vs Frequency Polygon Same data, different views:
HISTOGRAM:	FREQUENCY POLYGON:
████	●
████	╱ ╲
████	●	●	●
████	╱│╲	╱	╲
──────	──●─●──	──●───────●──

291
Bars show	Line shows
amounts	trend/shape

REVISION QUESTIONS (WEEK 10)
What is the main purpose of a pie chart?
What is the formula for calculating the angle of a sector in a pie chart?
What is plotted on the x-axis of a frequency polygon?
What is plotted on the x-axis of a histogram?
Why must a frequency polygon be "grounded" at 0 frequency?

ASSESSMENT (WEEK 10)

EVALUATION (IN-CLASS)
If a sector on a pie chart represents 20 people out of a total of 80, what is the angle of that sector?
What is the main advantage of a frequency polygon over a histogram?
How can you draw a frequency polygonusinga histogram?
A pie chart is used to show a student's budget. "Food" takes up 120°. What percentageof the budget is food?
For the class interval 30-39, what is the class midpoint?

ASSIGNMENT (TAKE-HOME)
A family spends its monthly income as follows:
o Food: ₦30,000
o Rent: ₦20,000
School Fees: ₦15,000
Transport: ₦10,000
Savings: ₦15,000
a. What is the total monthly income? b. Calculate the angle for eachitem. c. Draw a neat, labeled Pie Chart to represent this data.
Use the data from the Week 9 Assignment (ages of 30 people at a party): a. Create a table showing the Class Midpoints and Frequencies. b. Draw a Frequency Polygon to represent this data. (Remember to ground it!)

292

WEEK 11: REVISION

INTRODUCTION
This final week is dedicated to revising the two major themes of this term: Mensuration and Statistics. The examination will test your ability to recall formulas, apply them accurately, and present data clearly.
Term Overview:
┌────────────────────────────────────┐
│	THIRD TERM TOPICS SUMMARY	│
├────────────────────────────────────┤
│ MENSURATION (Weeks 1-6):	│
│ • Arcs, sectors, segments	│
│ • Sector-cone relationship	│
│ • Surface areas	│
│ • Volumes	│
│ • Frustums & compound shapes	│
├────────────────────────────────────┤
│ STATISTICS (Weeks 8-10):	│
│ • Data collection & types	│
│ • Frequency tables	│
│ • Bar charts & histograms	│
│ • Pie charts & frequency polygons │
└────────────────────────────────────┘

MENSURATION REVISION (FORMULA SHEET)

CIRCLES:
┌─────────────────────────────────────┐
│ CIRCLE FORMULAS	│
├─────────────────────────────────────┤
│ Circumference: C = 2πr	│
│ Area: A = πr²	│
│ Arc Length: L = (θ/360) × 2πr	│
│ Sector Area: A = (θ/360) × πr²	│
│ Segment: Sector - ½r²sinθ	│
│ Sector Perimeter: Arc + 2r	│
└─────────────────────────────────────┘

Visual Reminder:

293
Arc

/ θ	\
|	•	| r
\	/

Arc = (θ/360) × 2πr Sector = (θ/360) × πr²

CONE FROM SECTOR:
Sector → Cone Transformation:
┌──────────────┬──────────────┐
│ Sector	│ Cone	│
├──────────────┼──────────────┤
│ r (radius)	│ l (slant)	│
│ Arc length	│ 2πR (base)	│
│ Sector area │ CSA = πRl	│
└──────────────┴──────────────┘ Key formula: (θ/360) × 2πr = 2πR

SURFACE AREAS:
┌─────────────────────────────────────┐
│ SURFACE AREA FORMULAS	│
├─────────────────────────────────────┤
│ Cube:	SA = 6l²	│
│ Cuboid:	SA = 2(lw + lh + wh)	│
│ Cylinder: CSA = 2πrh	│
│	TSA = 2πr(r + h)	│
│ Cone:	CSA = πRl	│
│	TSA = πR(R + l)	│
│	l² = h² + R²	│
│ Prism:	2(Base) + (Perimeter×L)	│
│ Pyramid: Base + Triangular faces	│
└─────────────────────────────────────┘

VOLUMES:
┌─────────────────────────────────────┐
│ VOLUME FORMULAS	│
├─────────────────────────────────────┤
│ PRISMS (Full):	│
│ • Cube:	V = l³	│
│ • Cuboid:	V = lwh	│
│ • Cylinder: V = πr²h	│

294
│ • Prism:	V = (Base Area) × h	│
├─────────────────────────────────────┤
│ PYRAMIDS (1/3 rule):	│
│ • Pyramid:	V = ⅓(Base Area) × h	│
│ • Cone:	V = ⅓πr²h	│
└─────────────────────────────────────┘

FRUSTUM:
Frustum Strategy:
┌──────────────────────────────┐
│ 1. Use similar triangles:	│
│	r/R = h_s/H	│
│ 2. V = V_large - V_small	│
│ 3. SA = Top + Bottom + CSA	│
└──────────────────────────────┘

Visual:
*
/|\ h_s
/_|_\
| | | h_f
|_|_| r	R

3. STATISTICS REVISION (PROCESS SHEET)

DATA TYPES:
DATA
|
┌─────┴─────┐
││QUALITATIVEQUANTITATIVE||Categories┌───┴───┐Food,││color,DISCRETECONTINUOUSgenderCountMeasureStudents,Height,goalsweight

DATA SOURCES:
┌──────────┬────────────┬────────────┐
│ Aspect	│ Primary	│ Secondary │

295
├──────────┼────────────┼────────────┤
│Source│You│Others││Cost│High│Low││Time│Slow│Quick││Control│Full│None│└──────────┴────────────┴────────────┘

GRAPHS SUMMARY:
┌────────────┬──────────┬───────────┐
│ Graph	│ Data	│ Features │
├────────────┼──────────┼───────────┤
│ Bar Chart │ Discrete │ Gaps	│
│	│Qualitative│Categories │
├────────────┼──────────┼───────────┤
│ Histogram │Continuous│ No gaps	│
│	│ Grouped │Boundaries │
├────────────┼──────────┼───────────┤
│ Pie Chart │Any	│Proportions│
│	│	│ 360° total│
├────────────┼──────────┼───────────┤
│ Frequency │Continuous│ Midpoints │
│ Polygon	│ Grouped │ Grounded │
└────────────┴──────────┴───────────┘

Pie Chart Formula: Angle = Frequency × 360°
Total

COMPREHENSIVE REVISION ASSIGNMENT (WEEK 11)

SECTION A: MENSURATION
Question 1: A sector of a circle with radius 21 cm has an angle of 150°.
a. Find the length of the arc.
b. Find the area of the sector.
c. Find the area of the minor segment. (sin150° = sin30° = 0.5)
Question 2: A solid cylinder has a height of 10 cm and a base radius of 7 cm. Find:
a. Its total surface area.
b. Its volume.
Question 3: A cone is made by folding a sector of a circle with a 120° angle and a radius of 18 cm. Find:
a. The base radius (�) of the cone.

296
b. The vertical height (ℎ) of the cone.
c. The volume of the cone.

SECTION B: STATISTICS
Question 4: The scores of 40 students in a test are given in the table below.

Score (%)21-3031-4041-5051-6061-7071-80Frequency35111083a. Draw a Histogram for this data.
b. Draw a Frequency Polygon on the same graph (or a new one).
c. Calculate the angles needed to represent this data on a Pie Chart. (Do not draw)

FINAL EXAMINATION TIPS

Mensuration Tips:
Always identify what's given and what's needed
Draw clear diagrams
Label all measurements
Check if you need slant or vertical height
Use Pythagoras for height conversions
Remember: Cone volume = ⅓ Cylinder volume
Show all working steps

Statistics Tips:
Identify data type first (qualitative/quantitative)
Choose correct graph for data type
Use boundaries for histograms
Use midpoints for frequency polygons
Always check pie chart angles = 360°
Label all axes and provide titles
Show calculations clearly

297
