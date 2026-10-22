# SSS Mathematics — Comprehensive Study Notes
**Level:** Senior Secondary School (SSS) | **Exams:** WAEC, JAMB | **Curriculum:** NERDC

---

# TOPIC 1: Indices and Logarithms
**Topic ID:** SSS-MTH-001-01

## 1.1 Definition of Indices

**Index (plural: indices)** refers to the power or exponent to which a base number is raised. It tells you how many times the base is multiplied by itself.

**Standard form:** aⁿ
- **a** = base (the number being multiplied)
- **n** = index/exponent/power (how many times the base is multiplied)

**Example:** 2⁵ = 2 × 2 × 2 × 2 × 2 = 32
Here, 2 is the base and 5 is the index.

---

## 1.2 Laws of Indices

These rules apply when the **bases are the same**:

| Law | Rule | Example |
|-----|------|---------|
| **Multiplication** | aᵐ × aⁿ = aᵐ⁺ⁿ | 3² × 3⁴ = 3⁶ = 729 |
| **Division** | aᵐ ÷ aⁿ = aᵐ⁻ⁿ | 5⁶ ÷ 5² = 5⁴ = 625 |
| **Power of a power** | (aᵐ)ⁿ = aᵐⁿ | (2³)² = 2⁶ = 64 |
| **Zero index** | a⁰ = 1 | 7⁰ = 1; 100⁰ = 1 |
| **Negative index** | a⁻ⁿ = 1/aⁿ | 4⁻² = 1/4² = 1/16 |
| **Fractional index** | a^(1/n) = ⁿ√a | 8^(1/3) = ∛8 = 2 |
| **Fractional index (general)** | a^(m/n) = ⁿ√(aᵐ) | 27^(2/3) = ∛(27²) = ∛729 = 9 |
| **Power of a product** | (ab)ⁿ = aⁿbⁿ | (2×3)² = 4×9 = 36 |
| **Power of a quotient** | (a/b)ⁿ = aⁿ/bⁿ | (2/5)³ = 8/125 |

---

## 1.3 Definition of Logarithm

**Logarithm** is the inverse (reverse) operation of raising to a power.

If **aⁿ = x**, then **logₐ x = n**

Read as: "the logarithm of x to base a equals n."

**Examples:**
- 10² = 100 → log₁₀ 100 = 2
- 2³ = 8 → log₂ 8 = 3
- 5⁴ = 625 → log₅ 625 = 4

**Common logarithm (log):** base 10 — written as log x (base 10 assumed)
**Natural logarithm (ln):** base e (≈ 2.718) — used in advanced maths

---

## 1.4 Laws of Logarithms

| Law | Rule | Example |
|-----|------|---------|
| **Log of a product** | log(AB) = log A + log B | log(4×5) = log 4 + log 5 |
| **Log of a quotient** | log(A/B) = log A − log B | log(20/4) = log 20 − log 4 |
| **Log of a power** | log(Aⁿ) = n log A | log(8³) = 3 log 8 |
| **Log of 1** | log 1 = 0 (any base) | log 1 = 0 |
| **Log of the base** | logₐ a = 1 | log₁₀ 10 = 1 |
| **Change of base** | logₐ b = log b / log a | log₃ 9 = log 9 / log 3 = 2 |

---

## 1.5 Using Logarithm Tables

Common log tables give the logarithm of numbers from 1.000 to 9.999.

**Steps for multiplication using log tables:**
1. Find log of each number
2. Add the logarithms
3. Use antilog table to find the answer

**Steps for division using log tables:**
1. Find log of each number
2. Subtract the logarithms
3. Use antilog table to find the answer

---

## ✏️ Worked Examples

**Example 1:** Simplify (3²)³ × 3⁻⁴

**Solution:**
- (3²)³ = 3⁶ (power of a power)
- 3⁶ × 3⁻⁴ = 3⁶⁺⁽⁻⁴⁾ = 3² = **9**

---

**Example 2 (WAEC type):** Given that 2^(x+1) = 8^(x−2), find x.

**Solution:**
- 8 = 2³, so 8^(x−2) = 2^(3(x−2)) = 2^(3x−6)
- Setting exponents equal: x + 1 = 3x − 6
- x − 3x = −6 − 1 → −2x = −7 → **x = 3.5**

---

**Example 3 (JAMB type):** Evaluate log₂ 8 + log₂ 4

**Solution:**
- log₂ 8 = log₂ 2³ = 3
- log₂ 4 = log₂ 2² = 2
- 3 + 2 = **5**

---

**Example 4 (WAEC type):** If log 5 = 0.6990, find log 0.05

**Solution:**
- log 0.05 = log(5/100) = log 5 − log 100 = 0.6990 − 2 = **−1.3010**

---

## 🏆 Exam Focus

> **WAEC** tests simplification using laws of indices, solving equations involving indices, logarithm calculations using tables, and applying log laws. Expect 2–3 structured questions.

> **JAMB** focuses heavily on multiple-choice: identify which law applies, evaluate expressions directly, and solve index equations.

> **Common trap 1:** When multiplying powers, students add the powers but forget the bases must be the same. 2³ × 3² ≠ 6⁵!

> **Common trap 2:** a⁰ = 1 for ANY non-zero value of a. Students sometimes say 0⁰ = 1 — this is undefined.

> **Common trap 3:** log(A + B) ≠ log A + log B. The log of a SUM cannot be separated. Only log(A × B) = log A + log B.

---
---

# TOPIC 2: Number Bases
**Topic ID:** SSS-MTH-001-02

## 2.1 Definition and Concept

The **number base** (or radix) is the number of unique digits used in a counting system. The most common system is **base 10 (denary/decimal)** which uses digits 0–9.

**Why study number bases?** Computers operate in base 2 (binary). Understanding bases is essential for computer science and modern technology.

---

## 2.2 Types of Number Bases

| Base | Name | Digits used | Symbol |
|------|------|------------|--------|
| 2 | Binary | 0, 1 | (₂) |
| 8 | Octal | 0–7 | (₈) |
| 10 | Denary/Decimal | 0–9 | (₁₀) |
| 16 | Hexadecimal | 0–9, A–F | (₁₆) |

**Positional value:** In base n, each position from the right represents a power of n.

Example in base 10: 345 = 3×10² + 4×10¹ + 5×10⁰

---

## 2.3 Converting from Base n to Base 10

**Method:** Multiply each digit by the place value (power of the base) and add.

**Example:** Convert 1011₂ to base 10
- 1×2³ + 0×2² + 1×2¹ + 1×2⁰
- = 8 + 0 + 2 + 1
- = **11₁₀**

**Example:** Convert 234₅ to base 10
- 2×5² + 3×5¹ + 4×5⁰
- = 50 + 15 + 4
- = **69₁₀**

---

## 2.4 Converting from Base 10 to Base n

**Method:** Repeatedly divide by the base; collect remainders from bottom to top.

**Example:** Convert 25₁₀ to base 2
```
25 ÷ 2 = 12 remainder 1
12 ÷ 2 = 6  remainder 0
6  ÷ 2 = 3  remainder 0
3  ÷ 2 = 1  remainder 1
1  ÷ 2 = 0  remainder 1
```
Reading remainders **bottom to top:** **11001₂**

**Check:** 16 + 8 + 0 + 0 + 1 = 25 ✓

---

## 2.5 Addition and Subtraction in Other Bases

**Addition in base 2 (binary):**
- 0 + 0 = 0
- 0 + 1 = 1
- 1 + 1 = 10₂ (carry 1, write 0)
- 1 + 1 + 1 = 11₂ (carry 1, write 1)

**Example:** Add 1011₂ + 1101₂
```
  1011
+ 1101
------
 11000
```
**Answer: 11000₂**

**Verify:** 11 + 13 = 24₁₀ and 11000₂ = 24₁₀ ✓

---

## ✏️ Worked Examples

**Example 1 (WAEC type):** Evaluate 1101₂ × 11₂

**Solution:**
```
   1101
×    11
-------
   1101   (1101 × 1)
+ 11010   (1101 × 10, shifted left)
-------
 100111
```
**Answer: 100111₂**
Verify: 13 × 3 = 39₁₀ and 100111₂ = 32+4+2+1 = 39 ✓

---

**Example 2 (JAMB type):** Convert 110.11₂ to base 10.

**Solution:**
- 1×2² + 1×2¹ + 0×2⁰ + 1×2⁻¹ + 1×2⁻²
- = 4 + 2 + 0 + 0.5 + 0.25
- = **6.75₁₀**

---

## 🏆 Exam Focus

> **WAEC** tests: converting between bases, arithmetic in base 2, and occasionally fractions in other bases.

> **JAMB** commonly asks quick conversion MCQs — practise converting base 2 ↔ base 10 until it's instant.

> **Common trap:** When adding in base 2, students write "2" instead of carrying. In binary, 1+1 = 10 (NOT "2").

> **Shortcut:** To convert binary to base 8 (octal), group binary digits in sets of 3 from the right. To convert to base 16 (hex), group in sets of 4.

---
---

# TOPIC 3: Surds and Irrational Numbers
**Topic ID:** SSS-MTH-002-01

## 3.1 Definitions

**Rational number:** A number that can be expressed as a fraction p/q where p and q are integers and q ≠ 0. Examples: 1/2, 0.75, 3, −4.

**Irrational number:** A number that CANNOT be expressed as a simple fraction. Its decimal expansion is non-terminating and non-repeating. Examples: π, e, √2, √3.

**Surd:** An irrational root of a rational number that cannot be simplified to a rational number.
- √4 = 2 → NOT a surd (it simplifies to a rational number)
- √2, √3, √5, ∛7 → SURDS

---

## 3.2 Types of Surds

| Type | Description | Example |
|------|-------------|---------|
| **Simple surd** | Single surd term | √5 |
| **Compound surd** | Sum or difference of two surds | √3 + √5 |
| **Binomial surd** | Two-term expression with at least one surd | 3 + √2 |
| **Like surds** | Same radicand (under the root) | 3√5 and 7√5 |
| **Unlike surds** | Different radicands | √3 and √5 |

---

## 3.3 Operations with Surds

### Simplifying Surds:
Find the largest perfect square factor.
- √48 = √(16 × 3) = 4√3
- √72 = √(36 × 2) = 6√2
- √200 = √(100 × 2) = 10√2

### Adding and Subtracting Surds:
Only **like surds** can be added or subtracted (like terms in algebra).
- 5√3 + 2√3 = 7√3
- 4√5 − √5 = 3√5
- √12 + √27 = 2√3 + 3√3 = 5√3

### Multiplying Surds:
- √a × √b = √(ab)
- (3√2)(4√5) = 12√10
- (√3)² = 3

### The Conjugate and Rationalising the Denominator:
The **conjugate** of (a + √b) is (a − √b).
Multiplying a binomial surd by its conjugate eliminates the surd:
(a + √b)(a − √b) = a² − b

**Rationalising:** Removing a surd from the denominator.

**Case 1:** Denominator is a simple surd:
- 6/√3 = 6/√3 × √3/√3 = 6√3/3 = 2√3

**Case 2:** Denominator is a binomial surd:
- 4/(3 + √5) = 4(3 − √5)/[(3 + √5)(3 − √5)] = 4(3 − √5)/(9 − 5) = 4(3 − √5)/4 = 3 − √5

---

## ✏️ Worked Examples

**Example 1 (WAEC type):** Simplify (√5 + √3)²

**Solution:**
(√5 + √3)² = (√5)² + 2(√5)(√3) + (√3)²
= 5 + 2√15 + 3
= **8 + 2√15**

---

**Example 2 (WAEC type):** Rationalise 2/(√7 − √5)

**Solution:**
= 2/(√7 − √5) × (√7 + √5)/(√7 + √5)
= 2(√7 + √5)/(7 − 5)
= 2(√7 + √5)/2
= **√7 + √5**

---

**Example 3 (JAMB type):** Given that √3 ≈ 1.732, evaluate 6/√3

**Solution:**
6/√3 = 6/√3 × √3/√3 = 6√3/3 = 2√3 = 2 × 1.732 = **3.464**

---

## 🏆 Exam Focus

> **WAEC** tests simplification, operations, and especially rationalising the denominator — this is a guaranteed question.

> **JAMB** asks for simplified forms and numerical evaluations.

> **Common trap:** Adding unlike surds. √2 + √3 ≠ √5! They cannot be combined.

> **Common trap:** (√a + √b)² ≠ a + b. You must expand fully using (x+y)² = x² + 2xy + y².

---
---

# TOPIC 4: Polynomials and Rational Functions
**Topic ID:** SSS-MTH-002-02

## 4.1 Definition of a Polynomial

A **polynomial** is an algebraic expression consisting of variables raised to non-negative integer powers, with coefficients.

**General form:** aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀

**Degree** of a polynomial = the highest power of the variable.

| Degree | Name | Example |
|--------|------|---------|
| 0 | Constant | 7 |
| 1 | Linear | 3x − 5 |
| 2 | Quadratic | 2x² + x − 3 |
| 3 | Cubic | x³ − 4x² + 2 |
| 4 | Quartic | x⁴ + x |

---

## 4.2 Operations on Polynomials

**Addition/Subtraction:** Combine like terms.
(3x² + 2x − 5) + (x² − 4x + 3) = 4x² − 2x − 2

**Multiplication:** Every term in the first polynomial multiplies every term in the second.
(x + 2)(x − 3) = x² − 3x + 2x − 6 = x² − x − 6

**Long division:** Divide polynomials the same way as long division of numbers.

---

## 4.3 Remainder and Factor Theorems

### Remainder Theorem:
When a polynomial f(x) is divided by (x − a), the remainder is f(a).

**Example:** Find the remainder when f(x) = x³ − 3x² + 2 is divided by (x − 2).
f(2) = 8 − 12 + 2 = **−2** (the remainder)

### Factor Theorem:
(x − a) is a factor of f(x) if and only if f(a) = 0.

**Example:** Is (x − 1) a factor of f(x) = x³ − x² − x + 1?
f(1) = 1 − 1 − 1 + 1 = 0 → Yes, **(x − 1) is a factor**.

---

## 4.4 Rational Functions

A **rational function** is the ratio of two polynomials: R(x) = P(x)/Q(x), where Q(x) ≠ 0.

**Partial fractions:** Splitting a rational function into simpler fractions.

For example: 7x/(x² + x − 2) = A/(x + 2) + B/(x − 1)

Steps:
1. Factorise denominator: x² + x − 2 = (x + 2)(x − 1)
2. Write: 7x = A(x − 1) + B(x + 2)
3. Substitute x = 1: 7 = 3B → B = 7/3... *(continued using cover-up method)*

---

## ✏️ Worked Examples

**Example 1 (WAEC type):** Given f(x) = 2x³ + 3x² − 11x − 6. If (x + 3) is a factor, completely factorise f(x).

**Solution:**
f(−3) = 2(−27) + 3(9) − 11(−3) − 6 = −54 + 27 + 33 − 6 = 0 ✓ (x + 3) is a factor.

Divide f(x) by (x + 3) using long division → quotient: 2x² − 3x − 2
Factorise 2x² − 3x − 2 = (2x + 1)(x − 2)

**Full factorisation: f(x) = (x + 3)(2x + 1)(x − 2)**

---

**Example 2 (JAMB type):** Find the remainder when 3x³ − x² + 4 is divided by (x + 1).

**Solution:**
f(−1) = 3(−1)³ − (−1)² + 4 = −3 − 1 + 4 = **0**
Remainder = 0, meaning (x + 1) is actually a factor!

---

## 🏆 Exam Focus

> **WAEC** loves the Remainder and Factor theorems — always check if the problem asks for the remainder or whether a term is a factor (different questions, same tool).

> **JAMB** commonly tests evaluation using the Remainder Theorem with a single substitution.

> **Common trap:** When using (x − a), substitute x = +a. When the factor is (x + a), substitute x = −a. Many students substitute the wrong sign.

---
---

# TOPIC 5: Quadratic Equations
**Topic ID:** SSS-MTH-003-01

## 5.1 Definition

A **quadratic equation** is a polynomial equation of degree 2 in the form:

**ax² + bx + c = 0**, where a ≠ 0

- a = coefficient of x² (leading coefficient)
- b = coefficient of x
- c = constant term

**Examples:** 3x² + 5x − 2 = 0; x² − 9 = 0; x² + 4x + 4 = 0

---

## 5.2 Methods of Solving Quadratic Equations

### Method 1: Factorisation
Work backwards to find two brackets.

**Example:** Solve x² + 5x + 6 = 0
- Find two numbers that multiply to 6 and add to 5: **2 and 3**
- (x + 2)(x + 3) = 0
- x + 2 = 0 or x + 3 = 0
- **x = −2 or x = −3**

### Method 2: Completing the Square
Transform into the form (x + p)² = q.

**Steps for x² + bx + c = 0:**
1. Move constant to right: x² + bx = −c
2. Add (b/2)² to both sides
3. Write left side as a perfect square
4. Solve by taking square root

**Example:** Solve x² + 6x − 7 = 0
- x² + 6x = 7
- x² + 6x + 9 = 7 + 9 = 16
- (x + 3)² = 16
- x + 3 = ±4
- x = 1 or x = −7

### Method 3: Quadratic Formula
For ax² + bx + c = 0:

**x = [−b ± √(b² − 4ac)] / 2a**

**Example:** Solve 2x² − 7x + 3 = 0
- a = 2, b = −7, c = 3
- x = [7 ± √(49 − 24)] / 4 = [7 ± √25] / 4 = [7 ± 5] / 4
- x = 3 or x = 1/2

---

## 5.3 The Discriminant

**Discriminant (Δ) = b² − 4ac**

| Value | Meaning |
|-------|---------|
| Δ > 0 | Two distinct real roots |
| Δ = 0 | One repeated (equal) real root |
| Δ < 0 | No real roots (complex roots) |

---

## 5.4 Sum and Product of Roots

For ax² + bx + c = 0, if the roots are α and β:
- **Sum of roots:** α + β = −b/a
- **Product of roots:** αβ = c/a
- **Forming an equation from roots:** x² − (α + β)x + αβ = 0

---

## 5.5 Maximum and Minimum Values

For f(x) = ax² + bx + c:
- If a > 0: parabola opens upward → **minimum** value at x = −b/(2a)
- If a < 0: parabola opens downward → **maximum** value at x = −b/(2a)
- Minimum/Maximum value = c − b²/(4a)

---

## ✏️ Worked Examples

**Example 1 (WAEC type):** Solve 3x² − 10x + 8 = 0 by factorisation.

**Solution:**
Find two numbers that multiply to 3×8 = 24 and add to −10: **−4 and −6**
3x² − 4x − 6x + 8 = 0
x(3x − 4) − 2(3x − 4) = 0
(x − 2)(3x − 4) = 0
**x = 2 or x = 4/3**

---

**Example 2 (WAEC type):** Find the values of k for which x² + kx + 9 = 0 has equal roots.

**Solution:**
For equal roots: Δ = b² − 4ac = 0
k² − 4(1)(9) = 0
k² = 36
**k = ±6**

---

**Example 3 (JAMB type):** If α and β are roots of 2x² + 3x − 5 = 0, find α² + β².

**Solution:**
α + β = −3/2; αβ = −5/2
α² + β² = (α + β)² − 2αβ = (−3/2)² − 2(−5/2) = 9/4 + 5 = 9/4 + 20/4 = **29/4**

---

## 🏆 Exam Focus

> **WAEC** tests all three solution methods — know which to use: use factorisation when factors are obvious, quadratic formula when they're not, completing the square when asked specifically.

> **JAMB** frequently asks: "Find k such that the equation has equal roots" — this is always Δ = 0.

> **Common trap:** Forgetting ± when taking square roots. (x − 3)² = 16 gives x − 3 = 4 OR x − 3 = −4; both solutions must be found.

> **Tip:** Always verify roots by substituting back into the original equation.

---
---

# TOPIC 6: Simultaneous Equations
**Topic ID:** SSS-MTH-003-02

## 6.1 Definition

**Simultaneous equations** are two or more equations that are satisfied by the same set of values of the unknowns at the same time.

**Linear simultaneous equations:** Both equations are of degree 1.
**Linear-quadratic simultaneous equations:** One equation is linear, the other is quadratic.

---

## 6.2 Methods for Solving Linear Simultaneous Equations

### Method 1: Substitution
1. From one equation, express one variable in terms of the other.
2. Substitute into the second equation.
3. Solve for the one variable, then find the other.

### Method 2: Elimination
1. Multiply equations to make the coefficient of one variable equal in both.
2. Add or subtract the equations to eliminate that variable.
3. Solve for the remaining variable.

**Example:** Solve simultaneously: 3x + 2y = 12 and x − y = 1

**Substitution method:**
From equation 2: x = 1 + y
Sub into equation 1: 3(1 + y) + 2y = 12 → 3 + 3y + 2y = 12 → 5y = 9 → y = 9/5
x = 1 + 9/5 = 14/5

**Elimination method:**
Multiply equation 2 by 2: 2x − 2y = 2
Add to equation 1: 3x + 2y + 2x − 2y = 12 + 2 → 5x = 14 → x = 14/5
y = x − 1 = 14/5 − 5/5 = 9/5

---

## 6.3 Linear and Quadratic Simultaneous Equations

**Method:** Always use substitution.
1. Use the linear equation to express one variable.
2. Substitute into the quadratic.
3. Solve the resulting quadratic.
4. Find corresponding values of the other variable.

There can be **0, 1, or 2 solution pairs**.

---

## ✏️ Worked Examples

**Example 1 (WAEC type):** Solve y = 2x + 1 and y = x² − 2 simultaneously.

**Solution:**
Substitute linear into quadratic:
2x + 1 = x² − 2
x² − 2x − 3 = 0
(x − 3)(x + 1) = 0
x = 3 or x = −1

When x = 3: y = 2(3) + 1 = **7**
When x = −1: y = 2(−1) + 1 = **−1**

**Solutions: (3, 7) and (−1, −1)**

---

**Example 2 (JAMB type):** Solve 2x + y = 5 and 3x − 2y = 4 simultaneously.

**Solution:**
Multiply equation 1 by 2: 4x + 2y = 10
Add to equation 2: 4x + 2y + 3x − 2y = 10 + 4 → 7x = 14 → **x = 2**
y = 5 − 2(2) = **1**

---

## 🏆 Exam Focus

> **WAEC** tests both linear-linear and linear-quadratic pairs. Expect a structured question requiring full working.

> **JAMB** focuses on linear-linear elimination/substitution — quick clean answers.

> **Common trap:** In linear-quadratic, students substitute the quadratic expression into the linear equation (wrong direction). ALWAYS substitute the linear expression into the quadratic.

> **Tip:** When solving the resulting quadratic gives two x-values, you MUST find the corresponding y-values for each. WAEC requires both pairs.

---
---

# TOPIC 7: Plane Geometry — Circle Theorems
**Topic ID:** SSS-MTH-004-01

## 7.1 Circle Vocabulary (Review)

| Term | Definition |
|------|-----------|
| Centre | Fixed point equidistant from all points on the circle |
| Radius | Distance from centre to any point on the circle |
| Diameter | Longest chord; passes through centre = 2r |
| Chord | Line segment joining two points on the circle |
| Arc | Part of the circumference |
| Sector | Region bounded by two radii and an arc |
| Segment | Region between a chord and an arc |
| Tangent | Line touching the circle at exactly one point |
| Secant | Line cutting through the circle at two points |
| Inscribed angle | Angle with vertex ON the circle |
| Central angle | Angle with vertex at the CENTRE |

---

## 7.2 The Circle Theorems

| Theorem | Statement |
|---------|-----------|
| **1. Angle at the centre** | The angle subtended at the centre is twice the angle at the circumference, both standing on the same arc |
| **2. Angle in a semicircle** | The angle in a semicircle is 90° (angle subtended by diameter at circumference) |
| **3. Angles in the same segment** | Angles subtended by the same chord in the same segment are equal |
| **4. Opposite angles of a cyclic quadrilateral** | Opposite angles of a cyclic quadrilateral sum to 180° |
| **5. Tangent-radius theorem** | A tangent to a circle is perpendicular to the radius at the point of contact |
| **6. Two tangents from an external point** | Tangents drawn from an external point to a circle are equal in length |
| **7. Alternate segment theorem** | The angle between a tangent and a chord equals the inscribed angle in the alternate segment |
| **8. Chord bisector** | The perpendicular from the centre to a chord bisects the chord |

---

## ✏️ Worked Examples

**Example 1 (WAEC type):** In the diagram, O is the centre of a circle. Angle AOB = 130°. Find angle ACB where C is a point on the major arc.

**Solution:**
Angle ACB is subtended at the circumference by the minor arc AB.
Angle at centre = 130° (minor arc)
Angle ACB = 130°/2 = **65°** (angle at centre is twice angle at circumference)

---

**Example 2 (WAEC type):** ABCD is a cyclic quadrilateral. Angle A = 3x° and angle C = x + 20°. Find x.

**Solution:**
Opposite angles of cyclic quadrilateral sum to 180°:
3x + (x + 20) = 180
4x + 20 = 180
4x = 160
**x = 40°**
So ∠A = 120°, ∠C = 60°.

---

## 🏆 Exam Focus

> **WAEC** regularly tests circle theorems — expect 1–2 full questions. Always state the theorem used as your reason.

> **JAMB** tests identification of the correct theorem and finding angles numerically.

> **Common trap:** Applying "angle at centre is twice angle at circumference" in the wrong direction. The CENTRE angle = 2 × circumference angle, not the other way.

> Always state your reasons (e.g., "angles in the same segment are equal") — WAEC awards marks for reasons.

---
---

# TOPIC 8: Trigonometry
**Topic ID:** SSS-MTH-004-02

## 8.1 Basic Trigonometric Ratios

In a right-angled triangle, with angle θ:
- **sin θ = Opposite / Hypotenuse**
- **cos θ = Adjacent / Hypotenuse**
- **tan θ = Opposite / Adjacent**

**Mnemonic:** **SOH CAH TOA**

| Angle | sin | cos | tan |
|-------|-----|-----|-----|
| 0° | 0 | 1 | 0 |
| 30° | 1/2 | √3/2 | 1/√3 |
| 45° | 1/√2 | 1/√2 | 1 |
| 60° | √3/2 | 1/2 | √3 |
| 90° | 1 | 0 | undefined |

---

## 8.2 The Sine and Cosine Rules

### Sine Rule:
For any triangle with sides a, b, c opposite to angles A, B, C:

**a/sin A = b/sin B = c/sin C**

Use when: two angles and one side are known, or two sides and a non-included angle.

### Cosine Rule:
**a² = b² + c² − 2bc cos A**

(And similarly for b² and c²)

Use when: two sides and the included angle, or all three sides are known.

### Area of a Triangle:
**Area = ½ ab sin C**

---

## 8.3 Angles of Elevation and Depression

**Angle of elevation:** Angle measured upward from horizontal to a line of sight to an object above.
**Angle of depression:** Angle measured downward from horizontal to a line of sight to an object below.

---

## ✏️ Worked Examples

**Example 1 (WAEC type):** A ladder 10m long leans against a vertical wall. If the foot of the ladder is 6m from the base of the wall, find the angle the ladder makes with the ground.

**Solution:**
cos θ = adjacent/hypotenuse = 6/10 = 0.6
θ = cos⁻¹(0.6) = **53.13°** (or 53°8′)

---

**Example 2 (WAEC type):** In triangle PQR, p = 5cm, q = 7cm, and angle R = 60°. Find r.

**Solution:**
Using cosine rule: r² = p² + q² − 2pq cos R
r² = 25 + 49 − 2(5)(7) cos 60°
r² = 74 − 70(0.5) = 74 − 35 = 39
r = √39 = **6.24 cm**

---

## 🏆 Exam Focus

> **WAEC** tests SOH CAH TOA, sine rule, cosine rule, angles of elevation/depression, and area using ½ab sin C.

> **JAMB** focuses on exact values (30°, 45°, 60°) and identifying which rule to use.

> **Common trap:** Using the sine rule when you need the cosine rule. Rule of thumb: if you have two sides and the INCLUDED angle, use cosine rule.

> **Angles of elevation and depression:** These are always measured from the **horizontal**, not from the vertical.

---
---

# TOPIC 9: Statistics
**Topic ID:** SSS-MTH-005-01

## 9.1 Types of Data

| Type | Description | Example |
|------|-------------|---------|
| **Discrete data** | Can only take specific values (usually whole numbers) | Number of students |
| **Continuous data** | Can take any value within a range | Height, temperature |
| **Qualitative (categorical)** | Non-numerical | Colour, gender |
| **Quantitative** | Numerical | Age, mark |
| **Primary data** | Collected first-hand by the researcher | Questionnaire, experiment |
| **Secondary data** | Collected by someone else | Census data, published tables |

---

## 9.2 Measures of Central Tendency

### Mean:
**Arithmetic mean = Sum of all values / Number of values**
x̄ = Σx/n (ungrouped) or x̄ = Σfx/Σf (grouped/frequency data)

### Median:
The middle value when data is arranged in order.
- If n is odd: median = value at position (n+1)/2
- If n is even: median = average of values at positions n/2 and (n/2)+1

### Mode:
The value that appears most frequently.
A dataset can have no mode, one mode, or more than one mode.

---

## 9.3 Measures of Spread (Dispersion)

### Range:
Range = Maximum value − Minimum value

### Mean Deviation:
Mean Deviation = Σ|x − x̄| / n

### Variance:
σ² = Σ(x − x̄)² / n = Σx²/n − (x̄)²

### Standard Deviation:
σ = √variance = √[Σ(x − x̄)² / n]

---

## 9.4 Data Presentation

| Method | Best for |
|--------|---------|
| Bar chart | Discrete/categorical data comparisons |
| Histogram | Continuous data in class intervals |
| Frequency polygon | Comparing distributions |
| Pie chart | Showing proportions of a whole |
| Cumulative frequency curve (ogive) | Reading off median, quartiles, percentiles |

**Reading an ogive:**
- Median = value at cumulative frequency n/2
- Lower quartile Q1 = value at n/4
- Upper quartile Q3 = value at 3n/4
- Interquartile range (IQR) = Q3 − Q1

---

## ✏️ Worked Examples

**Example 1 (WAEC type):** The ages of 6 students are: 15, 17, 14, 16, 18, 14. Find the mean, median, mode, and range.

**Solution:**
Arranged: 14, 14, 15, 16, 17, 18
- Mean = (14+14+15+16+17+18)/6 = 94/6 = **15.67**
- Median = (15+16)/2 = **15.5** (average of 3rd and 4th values)
- Mode = **14** (appears twice)
- Range = 18 − 14 = **4**

---

**Example 2 (WAEC type):** Calculate the standard deviation of 3, 5, 7, 9, 11.

**Solution:**
Mean = 35/5 = 7
Deviations from mean: −4, −2, 0, 2, 4
Squared deviations: 16, 4, 0, 4, 16
Variance = (16+4+0+4+16)/5 = 40/5 = 8
Standard deviation = √8 = **2√2 ≈ 2.83**

---

## 🏆 Exam Focus

> **WAEC** tests mean/median/mode for both ungrouped and grouped data, standard deviation, and reading cumulative frequency graphs.

> **JAMB** tests quick mean calculations and identification of chart types.

> **Common trap:** For grouped data, use the CLASS MIDPOINT as x in Σfx/Σf, not the class boundaries.

> **Standard deviation vs variance:** Variance = σ². Standard deviation = σ (take the square root of variance). WAEC sometimes asks for either — read the question carefully.

---
---

# TOPIC 10: Probability
**Topic ID:** SSS-MTH-005-02

## 10.1 Definition and Basic Concepts

**Probability** is a measure of how likely an event is to occur, expressed as a number between 0 and 1.

- **P = 0:** Impossible event
- **P = 1:** Certain event
- **0 < P < 1:** All other events

**Probability of an event A:**
**P(A) = Number of favourable outcomes / Total number of possible outcomes**

**Sample space (S):** The set of all possible outcomes.
**Event:** A subset of the sample space.

---

## 10.2 Types of Events

| Type | Description | Example |
|------|-------------|---------|
| **Simple event** | Single outcome | Rolling a 4 on a die |
| **Compound event** | Combination of events | Rolling an even number |
| **Mutually exclusive** | Cannot occur simultaneously | Head and Tail on one flip |
| **Independent** | Occurrence of one doesn't affect the other | Flipping two separate coins |
| **Complementary** | P(A) + P(A') = 1 | P(not raining) = 1 − P(raining) |

---

## 10.3 Probability Rules

| Rule | Formula |
|------|---------|
| **Addition rule (mutually exclusive)** | P(A or B) = P(A) + P(B) |
| **Addition rule (not mutually exclusive)** | P(A or B) = P(A) + P(B) − P(A and B) |
| **Multiplication rule (independent)** | P(A and B) = P(A) × P(B) |
| **Conditional probability** | P(A\|B) = P(A and B) / P(B) |
| **Complementary** | P(A') = 1 − P(A) |

---

## 10.4 Tree Diagrams

Tree diagrams show all possible outcomes and their probabilities for multi-stage experiments. Multiply along branches; add across outcomes.

---

## ✏️ Worked Examples

**Example 1 (WAEC type):** A bag contains 4 red balls and 6 blue balls. Two balls are drawn without replacement. Find the probability that both balls are red.

**Solution:**
P(1st red) = 4/10 = 2/5
P(2nd red | 1st red) = 3/9 = 1/3
P(both red) = 2/5 × 1/3 = **2/15**

---

**Example 2 (JAMB type):** A fair die is rolled once. Find the probability of obtaining a prime number.

**Solution:**
Primes on a die: 2, 3, 5 → 3 favourable outcomes
P(prime) = 3/6 = **1/2**

---

**Example 3 (WAEC type):** P(A) = 0.4, P(B) = 0.5, P(A∩B) = 0.2. Find P(A∪B).

**Solution:**
P(A∪B) = P(A) + P(B) − P(A∩B) = 0.4 + 0.5 − 0.2 = **0.7**

---

## 🏆 Exam Focus

> **WAEC** tests probability of single and combined events, with and without replacement, and tree diagrams.

> **JAMB** tests quick probability calculations and identification of event types.

> **Common trap:** "Without replacement" changes the probability for the second draw because the total decreases. With replacement, total stays the same.

> **Exam tip:** Always check whether events are mutually exclusive before using the addition rule. If they can occur together, subtract P(A∩B).

---
---

# TOPIC 11: Differentiation and Its Applications
**Topic ID:** SSS-MTH-006-01

## 11.1 Concept of Differentiation

**Differentiation** is the process of finding the **derivative** of a function — the rate of change of one variable with respect to another.

The derivative of y with respect to x is written as:
**dy/dx** or **f'(x)**

**Physical meaning:**
- dy/dx = gradient (slope) of a curve at a point
- If y represents displacement, dy/dx = velocity
- If y represents velocity, dy/dx = acceleration

---

## 11.2 Rules of Differentiation

| Rule | Function | Derivative |
|------|----------|-----------|
| **Power rule** | xⁿ | nxⁿ⁻¹ |
| **Constant rule** | c | 0 |
| **Constant multiple** | cf(x) | c·f'(x) |
| **Sum rule** | f(x) + g(x) | f'(x) + g'(x) |
| **Product rule** | f(x)·g(x) | f'g + fg' |
| **Chain rule** | f(g(x)) | f'(g(x))·g'(x) |

**Examples:**
- d/dx(x⁵) = 5x⁴
- d/dx(3x² + 4x − 7) = 6x + 4
- d/dx(x³ + 5x) = 3x² + 5

---

## 11.3 Applications

### Gradient of a Curve:
Substitute the x-value of the point into dy/dx.

### Equation of Tangent and Normal:
- Tangent at point (x₁, y₁): gradient = dy/dx at x₁
- Normal is perpendicular to tangent: gradient of normal = −1/(dy/dx)

### Stationary Points (Turning Points):
At stationary points: **dy/dx = 0**

**Nature test:**
- If d²y/dx² > 0: minimum point
- If d²y/dx² < 0: maximum point

### Rate of Change Problems:
If V = f(t), then dV/dt = rate of change of V.

---

## ✏️ Worked Examples

**Example 1 (WAEC type):** Find the gradient of y = 2x³ − 3x² + x − 5 at the point where x = 2.

**Solution:**
dy/dx = 6x² − 6x + 1
At x = 2: dy/dx = 6(4) − 6(2) + 1 = 24 − 12 + 1 = **13**

---

**Example 2 (WAEC type):** Find the coordinates of the stationary points of y = x³ − 3x² + 2 and determine their nature.

**Solution:**
dy/dx = 3x² − 6x = 3x(x − 2) = 0
x = 0 or x = 2

At x = 0: y = 0 − 0 + 2 = 2 → point **(0, 2)**
At x = 2: y = 8 − 12 + 2 = −2 → point **(2, −2)**

d²y/dx² = 6x − 6
At x = 0: d²y/dx² = −6 < 0 → **maximum**
At x = 2: d²y/dx² = 6 > 0 → **minimum**

---

## 🏆 Exam Focus

> **WAEC** tests finding dy/dx, calculating gradients at specific points, finding and classifying stationary points, and simple rate of change problems.

> **JAMB** tests differentiation rules and gradient calculations.

> **Common trap:** Setting dy/dx = 0 to find stationary points but forgetting to find the y-coordinates and check their nature.

> Always use d²y/dx² (second derivative) to determine whether a stationary point is a maximum or minimum.

---
---

# TOPIC 12: Integration and Its Applications
**Topic ID:** SSS-MTH-006-02

## 12.1 Concept of Integration

**Integration** is the reverse process of differentiation — it is called **anti-differentiation**.

If dy/dx = f(x), then y = ∫f(x) dx

**Physical meaning:**
- Integration finds the area under a curve.
- If velocity = v(t), then ∫v dt = displacement.

---

## 12.2 Rules of Integration

| Rule | Integral | Result |
|------|---------|--------|
| **Power rule** | ∫xⁿ dx | xⁿ⁺¹/(n+1) + C, n ≠ −1 |
| **Constant** | ∫a dx | ax + C |
| **Sum rule** | ∫[f(x)+g(x)] dx | ∫f(x)dx + ∫g(x)dx |

C = constant of integration (always include in indefinite integrals!)

**Examples:**
- ∫x³ dx = x⁴/4 + C
- ∫(3x² + 2x − 5) dx = x³ + x² − 5x + C
- ∫6 dx = 6x + C

---

## 12.3 Definite Integrals and Area

**Definite integral:** ∫[a to b] f(x) dx = [F(x)]ₐᵇ = F(b) − F(a)

No constant of integration for definite integrals.

**Area under a curve:** Area = ∫[a to b] f(x) dx (if f(x) ≥ 0)

If f(x) < 0 in some interval, take the absolute value of that portion.

---

## ✏️ Worked Examples

**Example 1 (WAEC type):** Evaluate ∫(x² − 3x + 2) dx

**Solution:**
= x³/3 − 3x²/2 + 2x + **C**

---

**Example 2 (WAEC type):** Find the area enclosed between y = x² and the x-axis from x = 0 to x = 3.

**Solution:**
Area = ∫[0 to 3] x² dx = [x³/3]₀³ = 27/3 − 0 = **9 square units**

---

**Example 3 (WAEC type):** Given dy/dx = 3x² − 4 and y = 2 when x = 1, find y.

**Solution:**
y = ∫(3x² − 4) dx = x³ − 4x + C
Apply initial condition: 2 = 1 − 4 + C → C = 5
**y = x³ − 4x + 5**

---

## 🏆 Exam Focus

> **WAEC** tests indefinite integration, definite integrals, finding area under a curve, and finding a function given its derivative and an initial condition.

> **JAMB** tests integration rules and evaluating definite integrals numerically.

> **Common trap:** Forgetting the constant of integration C in indefinite integrals. WAEC deducts marks for this.

> **Area below x-axis:** The integral gives a negative value — always take the absolute value (or state the magnitude) when finding area.
