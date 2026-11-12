SS3 MATHEMATICS LESSON NOTES
FIRST TERM
WEEK 1: REVIEW OF LOGARITHMS
CONTENT
Definition and Basic Concepts
A logarithm is the inverse operation of exponentiation. If aˣ = y, then log_a(y) = x
Where:
a = base of the logarithm (a > 0, a ≠ 1)
x = the logarithm (the power/exponent)
y = the number (y > 0)
Read as: "log to base a of y equals x"
Relationship:
Exponential form: aˣ = y
Logarithmic form: log_a(y) = x
Examples:
2³ = 8 can be written as log₂(8) = 3
10² = 100 can be written as log₁₀(100) = 2
5² = 25 can be written as log₅(25) = 2
3⁴ = 81 can be written as log₃(81) = 4

Laws of Logarithms
Law 1: Product Law (Multiplication) log_a(m × n) = log_a(m) + log_a(n)
The logarithm of a product equals the sum of the logarithms.
Example 1: log₂(8 × 4) = log₂(8) + log₂(4) = 3 + 2 = 5
Verify: 8 × 4 = 32, and 2⁵ = 32 ✓

Example 2: log₁₀(100 × 1000) = log₁₀(100) + log₁₀(1000) = 2 + 3 = 5
Verify: 100 × 1000 = 100,000 = 10⁵ ✓
Law 2: Quotient Law (Division) log_a(m ÷ n) = log_a(m) - log_a(n)
The logarithm of a quotient equals the difference of the logarithms.
Example 1: log₂(16 ÷ 4) = log₂(16) - log₂(4) = 4 - 2 = 2
Verify: 16 ÷ 4 = 4, and 2² = 4 ✓
Example 2: log₅(125 ÷ 25) = log₅(125) - log₅(25) = 3 - 2 = 1
Verify: 125 ÷ 25 = 5, and 5¹ = 5 ✓

Law 3: Power Law log_a(mⁿ) = n × log_a(m)
The logarithm of a number raised to a power equals the power times the logarithm of the number.
Example 1: log₂(8³) = 3 × log₂(8) = 3 × 3 = 9 Verify: 8³ = 512, and 2⁹ = 512 ✓
Example 2: log₁₀(100²) = 2 × log₁₀(100) = 2 × 2 = 4
Verify: 100² = 10,000 = 10⁴ ✓

Law 4: Logarithm of 1 log_a(1) = 0 for any base a Because a⁰ = 1 for any a ≠ 0
Examples:
log₂(1) = 0
log₁₀(1) = 0
log₅(1) = 0

Law 5: Logarithm of the Base log_a(a) = 1 for any base a Because a¹ = a
Examples:
log₂(2) = 1
log₁₀(10) = 1
log₅(5) = 1

Law 6: Change of Base Formula log_a(m) = log_b(m) ÷ log_b(a)
This allows us to convert logarithms from one base to another.
Example: Convert log₂(8) to base 10:
log₂(8) = log₁₀(8) ÷ log₁₀(2) = 0.9031 ÷ 0.3010 = 3 ✓

Solving Logarithmic Equations
Type 1: Simple Logarithmic Equations Example 1: Solve: log₂(x) = 5
Solution: Convert to exponential form: x = 2⁵ x = 32
Example 2: Solve: log₁₀(x) = 3 Solution: x = 10³ x = 1000 Example 3: Solve: log₅(x) = -2 Solution: x = 5⁻² x = 1/25 x = 0.04

Type 2: Logarithmic Equations Using Laws Example 4: Solve: log₂(x) + log₂(x - 3) = 2
Solution: Step 1: Apply product law log₂[x(x - 3)] = 2
Step 2: Convert to exponential form x(x - 3) = 2² x² - 3x = 4 Step 3: Rearrange x² - 3x - 4 = 0
Step 4: Factorize (x - 4)(x + 1) = 0 x = 4 or x = -1
Step 5: Check validity (logarithm requires positive numbers) For x = 4: log₂(4) + log₂(1) = 2 + 0
= 2 ✓ For x = -1: Invalid (cannot take log of negative number)
Answer: x = 4

Example 5: Solve: log₃(x + 2) - log₃(x - 1) = 1
Solution: Step 1: Apply quotient law log₃[(x + 2)/(x - 1)] = 1
Step 2: Convert to exponential form (x + 2)/(x - 1) = 3¹ (x + 2)/(x - 1) = 3 Step 3: Cross multiply x + 2 = 3(x - 1) x + 2 = 3x - 3
Step 4: Solve 2 + 3 = 3x - x 5 = 2x x = 5/2 = 2.5
Step 5: Verify log₃(2.5 + 2) - log₃(2.5 - 1) = log₃(4.5) - log₃(1.5) = log₃(3) = 1 ✓
Answer: x = 2.5

Example 6: Solve: 2log₅(x) = log₅(9)
Solution: Step 1: Apply power law (reverse) log₅(x²) = log₅(9) Step 2: Since bases and logs are equal x² = 9
Step 3: Solve x = ±3
Step 4: Check validity Only x = 3 is valid (x must be positive)
Answer: x = 3

Type 3: Exponential Equations Requiring Logarithms Example 7: Solve: 2ˣ = 10
Solution: Step 1: Take log of both sides log₁₀(2ˣ) = log₁₀(10) Step 2: Apply power law x × log₁₀(2) = 1
Step 3: Solve x = 1 ÷ log₁₀(2) x = 1 ÷ 0.3010 x = 3.322
Answer: x ≈ 3.32
Example 8: Solve: 3²ˣ⁺¹ = 27
Solution: Method 1: Using indices 3²ˣ⁺¹ = 3³ 2x + 1 = 3 2x = 2 x = 1
Method 2: Using logarithms log₃(3²ˣ⁺¹) = log₃(27) (2x + 1)log₃(3) = log₃(27) 2x + 1 = 3 x = 1
Answer: x = 1

Application of Logarithms to Complex Calculations
Logarithms simplify complex calculations involving multiplication, division, powers, and roots.
Example 9: Multiplication using logarithms Calculate: 47.5 × 32.8
Solution: Let y = 47.5 × 32.8
Step 1: Take log of both sides log₁₀(y) = log₁₀(47.5 × 32.8) Step 2: Apply product law log₁₀(y) = log₁₀(47.5) + log₁₀(32.8) Step 3: Use log tables log₁₀(47.5) = 1.6767 log₁₀(32.8) = 1.5159 Step 4: Add log₁₀(y) = 1.6767 + 1.5159 = 3.1926
Step 5: Find antilog y = antilog(3.1926) y = 1558
Answer: 1558

Example 10: Division using logarithms Calculate: 875 ÷ 23.4
Solution: Let y = 875 ÷ 23.4
Step 1: Take log log₁₀(y) = log₁₀(875) - log₁₀(23.4)
Step 2: Use log tables log₁₀(875) = 2.9420 log₁₀(23.4) = 1.3692 Step 3: Subtract log₁₀(y) = 2.9420 - 1.3692 = 1.5728
Step 4: Find antilog y = antilog(1.5728) y = 37.4
Answer: 37.4

Example 11: Power using logarithms Calculate: (4.8)⁴
Solution: Let y = (4.8)⁴
Step 1: Take log log₁₀(y) = log₁₀(4.8⁴)
Step 2: Apply power law log₁₀(y) = 4 × log₁₀(4.8) Step 3: Use log table log₁₀(4.8) = 0.6812
Step 4: Multiply log₁₀(y) = 4 × 0.6812 = 2.7248 Step 5: Find antilog y = antilog(2.7248) y = 530.8 Answer: 530.8

Example 12: Root using logarithms Calculate: ⁴√625
Solution: Let y = ⁴√625 = 625^(1/4)
Step 1: Take log log₁₀(y) = log₁₀(625^(1/4))
Step 2: Apply power law log₁₀(y) = (1/4) × log₁₀(625) Step 3: Use log table log₁₀(625) = 2.7959
Step 4: Multiply log₁₀(y) = (1/4) × 2.7959 = 0.6990 Step 5: Find antilog y = antilog(0.6990) y = 5 Answer: 5
Example 13: Combined operations Calculate: (67.2 × 8.5) ÷ √38.4
Solution: Let y = (67.2 × 8.5) ÷ √38.4
Step 1: Take log log₁₀(y) = log₁₀(67.2) + log₁₀(8.5) - log₁₀(38.4^(1/2)) log₁₀(y) = log₁₀(67.2) + log₁₀(8.5) - (1/2)log₁₀(38.4)
Step 2: Use log tables log₁₀(67.2) = 1.8274 log₁₀(8.5) = 0.9294 log₁₀(38.4) = 1.5843
Step 3: Calculate log₁₀(y) = 1.8274 + 0.9294 - (0.5 × 1.5843) log₁₀(y) = 2.7568 - 0.7922 log₁₀(y)
= 1.9646
Step 4: Find antilog y = antilog(1.9646) y = 92.2
Answer: 92.2

Common Logarithm (Base 10) and Natural Logarithm (Base e)
Common Logarithm (log or log₁₀):
Base 10
Used in scientific calculations
Available on calculators as "log" button
Natural Logarithm (ln or log_e):
Base e (e ≈ 2.71828...)
Used in calculus, growth/decay problems
Available on calculators as "ln" button Relationship: ln(x) = log_e(x) log(x) = log₁₀(x) Conversion: ln(x) = 2.3026 × log₁₀(x)

EVALUATION
1.	Express in logarithmic form: (a) 5³ = 125 (b) 10⁴	= 10,000 (c) 2⁻  ³ = 1/8
2.	Evaluate without using tables: (a) log₅  (25) (b) log₃  (81) (c) log₂  (1/16)
3.	Simplify: log₁  ₀  (1000) - log₁  ₀  (10) + log₁  ₀  (100)
4.	Solve: (a) log₂ (x) = 4 (b) log₅ (x) = -1 (c) log₁ ₀ (x) = 2.5
5.	Given that log₁  ₀  (2) = 0.3010 and log₁  ₀  (3) = 0.4771, find log₁  ₀  (6)
Solve: log₃ (x) + log₃ (x + 6) = 3
Simplify: 2log₂  (4) + 3log₂  (2) - log₂  (8)
8.	Solve: log₁ ₀ (x + 3) - log₁ ₀ (x - 2) = 1
9.	Use logarithms to evaluate: 45.6	78.2
10.   Solve: 5ˣ = 20 (Use log₁  ₀  (2) = 0.3010, log₁  ₀  (5) = 0.6990)

ASSIGNMENT
Simplification Problems: a) Simplify: log₅  (125) + log₅  (25) - log₅  (5) b) Simplify: 3log₂  (8) - 2log₂  (4) + log₂  (16) c) Express as a single logarithm: 2log₁  ₀  (x) + log₁  ₀  (y) - 3log₁  ₀  (z)
Equation Solving: a) Solve: log₃  (2x - 1) = 2 b) Solve: log₂  (x) + log₂  (x - 7) = 3 c) Solve: 2log₅  (x) - log₅  (x - 4) = log₅ (4) d) Solve: 3ˣ⁺ ² = 81
Application Problems: a) Given log₁  ₀  (2) = 0.3010, log₁  ₀  (3) = 0.4771, and log₁  ₀  (7) = 0.8451, evaluate: i) log₁  ₀  (14) ii) log₁  ₀  (21) iii) log₁  ₀  (4.5)
b) Use logarithms to calculate: i) 87.3	42.6 ii) 456 ÷ 12.8 iii) (3.6)³ iv) ³√216
Word Problem: The population of a city grows exponentially according to the formula P = P₀	2^(t/10), where P₀	is the initial population and t is time in years. a) If the initial population is 50,000, how long will it take for the population to reach 200,000? b) Use logarithms to solve your equation.

WEEK 2: LOGIC
CONTENT
Introduction to Logic
Logic is the science of reasoning. It deals with methods of distinguishing correct reasoning from incorrect reasoning. In mathematics, logic provides a systematic way to determine the validity of statements and arguments.
Statement: A statement (or proposition) is a declarative sentence that is either true or false, but not both.
Examples of Statements:
"Lagos is in Nigeria" (True)
"5 + 3 = 7" (False)
"All rectangles have four sides" (True)
Examples of Non-Statements:
"Go to school!" (Command - not true or false)
"What is your name?" (Question - not true or false)
"x + 5 = 10" (Neither true nor false until x is specified)

Simple and Compound Statements
Simple Statement: A statement that contains only one idea and cannot be broken down into simpler statements.
Examples:
p: "It is raining"
q: "I am hungry"
r: "2 is an even number"
Compound Statement: A statement formed by combining two or more simple statements using logical connectives.
Examples:
"It is raining and I am hungry"
"2 is even or 2 is odd"
"If you study hard, then you will pass"

Logical Operations and Their Symbols
Negation (NOT) - Symbol: ~, ¬, or '
The negation of a statement is the opposite of the statement.
Symbol: ~p (read as "not p")
Example:
p: "It is raining"
~p: "It is not raining"
Truth Value:
If p is true, then ~p is false
If p is false, then ~p is true
Truth Table for Negation:
| p | ~p  |
|	|	|
| T | F	|
| F | T	|

Conjunction (AND) - Symbol: ∧
A conjunction connects two statements with "and." It is true only when both statements are true.
Symbol: p ∧ q (read as "p and q")
Example:
p: "It is sunny"
q: "It is warm"
p ∧ q: "It is sunny and it is warm"
Truth Table for Conjunction:
| p | q | p ∧ q |
|	|	|	|
|T|T|T||T|F|F||F|T|F||F|F|F|Key Point: Both must be true for conjunction to be true.
Disjunction (OR) - Symbol: ∨
A disjunction connects two statements with "or." It is true when at least one statement is true.
Symbol: p ∨ q (read as "p or q")
Example:
p: "I will study Mathematics"
q: "I will study English"
p ∨ q: "I will study Mathematics or English"
Truth Table for Disjunction:
| p | q | p ∨ q |
|	|	|	|
|T|T|T||T|F|T||F|T|T||F|F|F|Key Point: At least one must be true for disjunction to be true.
Conditional (If...Then) - Symbol: →
A conditional statement expresses "if p, then q." Symbol: p → q (read as "if p, then q" or "p implies q") Parts:
p = hypothesis (antecedent)
q = conclusion (consequent)
Example:
p: "It rains"
q: "The ground is wet"
p → q: "If it rains, then the ground is wet"
Truth Table for Conditional:
| p | q | p → q |
|	|	|	|
|T|T|T||T|F|F||F|T|T||F|F|T|Key Point: The conditional is false only when the hypothesis is true but the conclusion is false.
Understanding the Conditional:
If the hypothesis is false, the conditional is automatically true (vacuous truth)
A false hypothesis doesn't tell us anything about the conclusion
Biconditional (If and Only If) - Symbol: ↔
A biconditional states that p and q are equivalent; both must have the same truth value.
Symbol: p ↔ q (read as "p if and only if q")
Example:
p: "A number is divisible by 2"
q: "A number is even"
p ↔ q: "A number is divisible by 2 if and only if it is even"
Truth Table for Biconditional:
| p | q | p ↔ q |
|	|	|	|
|T|T|T||T|F|F||F|T|F||F|F|T|Key Point: True when both statements have the same truth value (both true or both false).

Constructing Truth Tables Example 1: Truth table for ~(p ∧ q) Step-by-step:
| p | q | p ∧ q | ~(p ∧ q) |
|	|	|	|	|
|T|T|T|F||T|F|F|T||F|T|F|T||F|F|F|T|Explanation:
List all possible combinations of p and q
Calculate p ∧ q
Negate the result
Example 2: Truth table for (p ∨ q) ∧ ~p
| p | q | p ∨ q | ~p | (p ∨ q) ∧ ~p |
|	|	|	|	|	|
|T|T|T|F|F||T|F|T|F|F||F|T|T|T|T||F|F|F|T|F|Explanation:
Calculate p ∨ q
Calculate ~p
Find conjunction of results

Example 3: Truth table for (p → q) ∧ (q → p)
| p | q | p → q | q → p | (p → q) ∧ (q → p) |
|	|	|	|	|	|
|T|T|T|T|T||T|F|F|T|F||F|T|T|F|F||F|F|T|T|T|Note: This is equivalent to p ↔ q (biconditional)

Example 4: Complex statement - (p ∧ q) → r
| p | q | r | p ∧ q | (p ∧ q) → r |
|	|	|	|	|	|
|T|T|T|T|T||T|T|F|T|F||T|F|T|F|T||T|F|F|F|T||F|T|T|F|T||F|T|F|F|T||F|F|T|F|T||F|F|F|F|T|

Conditional Statements and Their Variations
For a conditional statement p → q, there are three related statements:
Converse: q → p
Switch hypothesis and conclusion
Example: "If the ground is wet, then it rained"
Inverse: ~p → ~q
Negate both hypothesis and conclusion
Example: "If it doesn't rain, then the ground is not wet"
Contrapositive: ~q → ~p
Switch AND negate both parts
Example: "If the ground is not wet, then it didn't rain"
Important Relationship:
A conditional and its contrapositive are logically equivalent (always have same truth value)
Converse and inverse are logically equivalent to each other, but not to the original
Example 5: Proving equivalence
Show that p → q is equivalent to ~q → ~p (contrapositive)
| p | q | p → q | ~q | ~p | ~q → ~p |
|	|	|	|	|	|	|
|T|T|T|F|F|T||T|F|F|T|F|F||F|T|T|F|T|T||F|F|T|T|T|T|Since columns for p → q and ~q → ~p are identical, they are equivalent.

Logical Equivalence
Two statements are logically equivalent if they have identical truth tables.
Symbol: ≡
Common Equivalences:
De Morgan's Laws:
1. ~(p ∧ q) ≡ ~p ∨ ~q
2. ~(p ∨ q) ≡ ~p ∧ ~q
Example 6: Verify De Morgan's First Law
| p | q | p ∧ q | ~(p ∧ q) | ~p | ~q | ~p ∨ ~q |
|	|	|	|	|	|	|	|
|T|T|T|F|F|F|F||T|F|F|T|F|T|T||F|T|F|T|T|F|T||F|F|F|T|T|T|T|Columns for ~(p ∧ q) and ~p ∨ ~q are identical. ✓
Other Important Equivalences:
p → q ≡ ~p ∨ q
p ↔ q ≡ (p → q) ∧ (q → p)
p ∧ T ≡ p (Identity)
p ∨ F ≡ p (Identity)
p ∧ p ≡ p (Idempotent)
p ∨ p ≡ p (Idempotent)

Tautology, Contradiction, and Contingency
Tautology: A statement that is always true, regardless of truth values of components.
Example: p ∨ ~p
| p | ~p | p ∨ ~p |
|	|	|	|
| T |F|T|| F |T|T|Contradiction: A statement that is always false.
Example: p ∧ ~p
| p | ~p | p ∧ ~p |
|	|	|	|
| T |F|F|| F |T|F|Contingency: A statement that can be either true or false depending on circumstances.
Example: p ∧ q (neither tautology nor contradiction)

Arguments and Validity
An argument consists of:
Premises: Statements assumed to be true
Conclusion: Statement that follows from premises
An argument is valid if the conclusion must be true whenever all premises are true.
Example 7: Test validity Argument:
Premise 1: p → q
Premise 2: p
Conclusion: q

Truth Table:
| p | q | p → q | Premises True? | Conclusion |
|	|	|	|	|	|
|T|T|T|Yes|T||T|F|F|No|-||F|T|T|No|-||F|F|T|No|-|When both premises are true (row 1), conclusion is also true. This argument is VALID (Modus Ponens)

Example 8: Invalid argument Argument:
Premise 1: p → q
Premise 2: q
Conclusion: p
| p | q | p → q | Premises True? | Conclusion |
|	|	|	|	|	|
|T|T|T|Yes|T||T|F|F|No|-||F|T|T|Yes|F||F|F|T|No|-|In row 3, both premises are true but conclusion is false. This argument is INVALID (Fallacy of affirming the consequent)

Indirect Proof (Proof by Contradiction)
Indirect proof assumes the opposite of what you want to prove, then shows this leads to a contradiction.
Steps:
Assume the negation of the statement to be proved
Show this assumption leads to a contradiction
Conclude the original statement must be true
Example 9:
Prove: √2 is irrational
Proof: Step 1: Assume the opposite: √2 is rational Then √2 = a/b where a and b are integers with no common factors (lowest terms)
Step 2: Show this leads to contradiction
√2 = a/b
2 = a²/b²
2b² = a²
Therefore a² is even, so a is even
Let a = 2k (where k is an integer)
Then 2b² = (2k)² = 4k²
b² = 2k²
Therefore b² is even, so b is even
But if both a and b are even, they have a common factor (2)
This contradicts our assumption that a/b is in lowest terms
Step 3: Conclusion Since assuming √2 is rational leads to a contradiction, √2 must be irrational.
✓
Example 10: Simple indirect proof Prove: If n² is even, then n is even.
Proof: Step 1: Assume the opposite: n² is even but n is odd If n is odd, then n = 2k + 1 for some integer k
Step 2: Find contradiction n² = (2k + 1)² n² = 4k² + 4k + 1 n² = 2(2k² + 2k) + 1 This shows n² is odd (form 2m + 1) But we assumed n² is even - contradiction! Step 3: Conclusion Therefore, if n² is even, then n must be even. ✓

Application: Using Logic in Problem Solving
Example 11:
Three students - Ade, Bola, and Chidi - are suspected of breaking a window. They make the following statements:
Ade says: "Bola did it"
Bola says: "Chidi did it"
Chidi says: "Bola is lying"
If only one person is telling the truth, who broke the window?
Solution:
Let's test each possibility:
Case 1: Ade broke the window
Ade's statement (Bola did it) - FALSE
Bola's statement (Chidi did it) - FALSE
Chidi's statement (Bola is lying) - TRUE ✓
Only Chidi tells the truth. This works!
Case 2: Bola broke the window
Ade's statement - TRUE
Bola's statement - FALSE
Chidi's statement - TRUE
Two people tell truth - doesn't match condition.
Case 3: Chidi broke the window
Ade's statement - FALSE
Bola's statement - TRUE
Chidi's statement - FALSE
Only Bola tells truth, but Bola is the accused - contradiction.
Answer: Ade broke the window

EVALUATION
Identify which of the following are statements: a) "Close the door" b) "7 + 5 = 12" c) "Is Lagos a city?" d) "All prime numbers are odd"
Write the negation of each statement: a) p: "It is raining" b) q: "5 is greater than 3" c) r: "Some students passed the exam"
Construct a truth table for: p ∧ ~q
Construct a truth table for: (p ∨ q) → r
For the conditional "If you study hard, then you will pass the exam": a) Write the converse b) Write the inverse
c) Write the contrapositive
Use a truth table to prove that p → q is equivalent to ~p ∨ q
Determine whether the following is a tautology, contradiction, or contingency: (p → q) ∨ (q → p)
Test the validity of this argument:
If it rains, the ground is wet
The ground is wet
Therefore, it rained
Use De Morgan's Law to simplify: ~(p ∨ ~q)
Construct a truth table for: (p ∧ q) ↔ (p ∨ q)

ASSIGNMENT
Truth Tables: a) Construct truth tables for: i) ~p → q ii) (p → q) ∧ (~q → ~p) iii) (p ∨ q) ∧ (~p ∧ ~q)
b) Determine which of the above are tautologies, contradictions, or contingencies.
Logical Equivalence: Prove using truth tables that: a) ~(p ∨ q) ≡ ~p ∧ ~q (De Morgan's Law) b) p → q
≡ ~q → ~p c) (p → q) ≡ (~p ∨ q)
Argument Validity: Test the validity of these arguments:
Premise 1: p ∨ q Premise 2: ~p Conclusion: q
Premise 1: p → q Premise 2: q → r Conclusion: p → r
Premise 1: p → q Premise 2: ~q Conclusion: ~p
Word Problem: Four friends - Amina, Bayo, Cynthia, and David - are discussing who will go to the market. They state:
Amina: "If Bayo goes, then I will go"
Bayo: "Either Cynthia or David will go"
Cynthia: "If I go, then Amina will not go"
David: "Bayo and I will both go"
If all statements are true and exactly two people go to the market, who are they?
Indirect Proof: Use indirect proof to show that: If n² is divisible by 3, then n is divisible by 3.

WEEK 3: APPLICATION OF SURDS TO TRIGONOMETRY
CONTENT
Review of Surds
A surd is an irrational root (cannot be simplified to a rational number).
Examples of Surds:
√2, √3, √5, √7
∛ 2, ∛ 3
2√3, 5√2
Examples of Non-Surds:
√4 = 2 (rational)
√9 = 3 (rational)
√16 = 4 (rational)
Basic Surd Rules:
1.	√a	√b = √(ab) Example: √2	√3 = √6
2.	√a ÷ √b = √(a/b) Example: √8 ÷ √2 = √4 = 2
3.	√(a²b) = a√b Example: √(4	3) = √12 = 2√3
4.	(√a)² = a Example: (√5)² = 5
Simplifying Surds:
Example 1: Simplify √18 √18 = √(9 × 2) = √9 × √2 = 3√2 Example 2: Simplify √50 √50 = √(25 × 2) = 5√2 Example 3: Simplify √75 √75 = √(25 × 3) = 5√3
Example 4: Simplify 2√12 + 3√3 2√12 + 3√3 = 2√(4 × 3) + 3√3 = 2 × 2√3 + 3√3 = 4√3 + 3√3 = 7√3
Rationalizing the Denominator:
Example 5: Rationalize 1/√2 1/√2 = (1/√2) × (√2/√2) = √2/2
Example 6: Rationalize 3/√5 3/√5 = (3/√5) × (√5/√5) = 3√5/5
Example 7: Rationalize 1/(2 + √3) Multiply by conjugate: 1/(2 + √3) × (2 - √3)/(2 - √3) = (2 -
√3)/(4 - 3) = 2 - √3
Exact Trigonometric Ratios Using Surds
For specific angles (30°, 45°, 60°), we can find exact values using surds rather than decimals.
Trigonometric Ratios for 45°
Consider a right-angled isosceles triangle with equal sides of length 1: Using Pythagoras: hypotenuse² = 1² + 1² = 2 Therefore: hypotenuse = √2
|\
| \
1 | \ √2
|	\
|	\
|		\ 1
45° 45°

Exact Values for 45°:
sin 45° = opposite/hypotenuse = 1/√2 = √2/2
cos 45° = adjacent/hypotenuse = 1/√2 = √2/2
tan 45° = opposite/adjacent = 1/1 = 1
Trigonometric Ratios for 30° and 60°
Consider an equilateral triangle with sides of length 2, divided in half:
/\
/ \
2/	\2
/ h	\
/	\
1 1
60° 30° 30° 60°

Using Pythagoras: h² + 1² = 2² h² = 4 - 1 = 3 h = √3
Exact Values for 30°:
sin 30° = opposite/hypotenuse = 1/2
cos 30° = adjacent/hypotenuse = √3/2
tan 30° = opposite/adjacent = 1/√3 = √3/3
Exact Values for 60°:
sin 60° = opposite/hypotenuse = √3/2
cos 60° = adjacent/hypotenuse = 1/2
tan 60° = opposite/adjacent = √3/1 = √3
Summary Table:
| Angle | sin	| cos	| tan	|
|	|	|	|	|
|30°|1/2|√3/2|√3/3||45°|√2/2|√2/2|1||60°|√3/2|1/2|√3|Memory Aid (CAST Rule): Remember: "All Students Take Calculus"
All (0°-90°): All ratios positive
Sine (90°-180°): Only sine positive
Tangent (180°-270°): Only tangent positive
Cosine (270°-360°): Only cosine positive

Worked Examples on Trigonometric Surds
Example 8: Evaluate sin² 45° + cos² 45°
Solution: sin² 45° = (√2/2)² = 2/4 = 1/2 cos² 45° = (√2/2)² = 2/4 = 1/2 sin² 45° + cos² 45° = 1/2 + 1/2 = 1 ✓
(This verifies the identity sin²θ + cos²θ = 1)

Example 9: Simplify: tan 60° - tan 30°
Solution: tan 60° = √3 tan 30° = √3/3
tan 60° - tan 30° = √3 - √3/3 = (3√3)/3 - √3/3 = (3√3 - √3)/3 = 2√3/3

Example 10: Evaluate: sin 30° cos 60° + cos 30° sin 60°
Solution: sin 30° = 1/2, cos 60° = 1/2 cos 30° = √3/2, sin 60° = √3/2
= (1/2)(1/2) + (√3/2)(√3/2) = 1/4 + 3/4 = 4/4 = 1
(This is sin(30° + 60°) = sin 90° = 1) ✓

Example 11: If sin θ = √3/2 and θ is acute, find: a) cos θ b) tan θ
Solution: a) Using sin²θ + cos²θ = 1: (√3/2)² + cos²θ = 1 3/4 + cos²θ = 1 cos²θ = 1/4 cos θ = 1/2 (positive since acute)
b) tan θ = sin θ / cos θ = (√3/2) ÷ (1/2) = √3/2 × 2/1 = √3 (This confirms θ = 60°)

Example 12: Simplify: (sin 60° - cos 60°)²
Solution: sin 60° = √3/2, cos 60° = 1/2
(√3/2 - 1/2)² = [(√3 - 1)/2]² = (√3 - 1)²/4 = (3 - 2√3 + 1)/4 = (4 - 2√3)/4 = (2 - √3)/2

Example 13: Solve for x: 2cos x = √3, where 0° ≤ x ≤ 90°
Solution: 2cos x = √3 cos x = √3/2 From our table, cos 30° = √3/2 Answer: x = 30°

Example 14: Evaluate: sin²30° + sin²45° + sin²60°
Solution: sin 30° = 1/2, sin 45° = √2/2, sin 60° = √3/2
sin²30° = (1/2)² = 1/4 sin²45° = (√2/2)² = 2/4 = 1/2 sin²60° = (√3/2)² = 3/4 Sum = 1/4 + 1/2 + 3/4 = 1/4 + 2/4 + 3/4 = 6/4 = 3/2

Example 15: Find the exact value of tan 45° + 2sin 30° - cos 60°
Solution: tan 45° = 1 sin 30° = 1/2 cos 60° = 1/2
= 1 + 2(1/2) - 1/2 = 1 + 1 - 1/2 = 2 - 1/2 = 3/2

Graphs of Sine and Cosine Functions (0° to 360°)
Graph of y = sin x Key Points:
Period: 360° (pattern repeats every 360°)
Amplitude: 1 (max height from center)
Range: -1 ≤ y ≤ 1
Passes through origin: sin 0° = 0
Special Values:

x:0°30°45°	60°90°180°270°360°y:

Shape:00.50.71 0.8710-10Starts at 0° with value 0
Increases to maximum 1 at 90°
Decreases back to 0 at 180°
Continues to minimum -1 at 270°
Returns to 0 at 360°

Sketch:
1 |
|	/	\
0 |	/	\
|	\ /
-1 |	\/
|
0° 90° 180° 270° 360°

Graph of y = cos x Key Points:
Period: 360°
Amplitude: 1
Range: -1 ≤ y ≤ 1
Starts at maximum: cos 0° = 1
Special Values:

x:0°30°60°90°180°270°360°y:

Shape:10.870.50-101Starts at 0° with value 1 (maximum)
Decreases to 0 at 90°
Continues to minimum -1 at 180°
Increases to 0 at 270°
Returns to maximum 1 at 360°
Sketch:
1 |
|	\	/
0 |	\	/
|	\ /
-1 |	\/
|
0° 90° 180° 270° 360°

Relationship: cos x = sin(x + 90°) The cosine graph is the sine graph shifted 90° to the left.

Properties of Sine and Cosine Graphs Symmetry:
sin x is odd function: sin(-x) = -sin(x)
cos x is even function: cos(-x) = cos(x)
Periodicity:
sin(x + 360°) = sin x
cos(x + 360°) = cos x
Intersections:
Sine and cosine graphs intersect at x = 45°, 225°

Using Graphs to Solve Trigonometric Equations
Example 16: Use a graph to solve sin x = 0.5 for 0° ≤ x ≤ 360°
Solution: Draw y = sin x and y = 0.5 on the same axes.
From the graph and knowledge: sin 30° = 0.5 (first quadrant) sin 150° = 0.5 (second quadrant - supplementary angle)
Answer: x = 30° or x = 150° Verification:
sin 30° = 1/2 = 0.5 ✓
sin 150° = sin(180° - 30°) = sin 30° = 0.5 ✓

Example 17: Solve cos x = 0.5 for 0° ≤ x ≤ 360°
Solution: From the table: cos 60° = 0.5 Using the cosine graph:
cos x = 0.5 in first quadrant: x = 60°
cos x = 0.5 in fourth quadrant: x = 360° - 60° = 300°
Answer: x = 60° or x = 300°
Example 18: Solve sin x = cos x for 0° ≤ x ≤ 360°
Solution: This occurs where sine and cosine graphs intersect. sin x = cos x sin x / cos x = 1 tan x = 1
tan 45° = 1, so x = 45° (first quadrant) tan 225° = 1, so x = 225° (third quadrant)
Answer: x = 45° or x = 225°

Example 19: Solve graphically: sin x = √3/2 for 0° ≤ x ≤ 360°
Solution: √3/2 ≈ 0.866 From table: sin 60° = √3/2 Solutions:
First quadrant: x = 60°
Second quadrant: x = 180° - 60° = 120°
Answer: x = 60° or x = 120°

Solving Linear Equations Using Graphs Example 20: Solve graphically: 2x + 3 = 0 Solution: Step 1: Rearrange to y-form: y = 2x + 3
Step 2: Find two points: When x = 0: y = 3 → (0, 3) When x = -2: y = -1 → (-2, -1) Step 3: Plot line and find where y = 0
The line crosses x-axis at x = -1.5
Answer: x = -1.5
Verification: 2(-1.5) + 3 = -3 + 3 = 0 ✓

Example 21: Solve simultaneously using graphs: y = 2x + 1 y = -x + 4
Solution: Line 1: y = 2x + 1 When x = 0: y = 1 → (0, 1) When x = 1: y = 3 → (1, 3)
Line 2: y = -x + 4 When x = 0: y = 4 → (0, 4) When x = 4: y = 0 → (4, 0) Plot both lines. They intersect at (1, 3).
Answer: x = 1, y = 3
Verification: Line 1: y = 2(1) + 1 = 3 ✓ Line 2: y = -(1) + 4 = 3 ✓

Example 22: Solve graphically: sin x = 0.5x for 0° ≤ x ≤ 180°
Solution: Draw y = sin x and y = 0.5x on same axes. The graphs intersect at two points:
x = 0° (both equal 0)
x ≈ 30° (approximate from graph)
Note: For exact solution, numerical methods would be needed.

EVALUATION
1.	Simplify: (a) √32 (b) √45 (c) 3√8 + 2√2
2.	Rationalize: (a) 1/√3 (b) 2/√5 (c) 1/(1 + √2)
Evaluate exactly: sin²30° + cos²30°
Find the exact value of: tan 60°	cos 30°
Simplify: (sin 45° + cos 45°)²
Solve for x (0° ≤ x ≤ 90°): 2sin x = 1
Evaluate: sin 30° cos 60° - cos 30° sin 60°
Sketch the graph of y = sin x for 0° ≤ x ≤ 360°
Use a graph to solve: cos x = 0 for 0° ≤ x ≤ 360°
If tan θ = √3 and θ is acute, find sin θ and cos θ.

ASSIGNMENT
Simplification: a) Simplify completely: √48 + √75 - √12 b) Rationalize and simplify: 3/(√5 - √2) c) Simplify: (√3 + √2)(√3 - √2)
Exact Trigonometric Values: a) Evaluate: sin²45° + cos²60° - tan²30° b) Find the exact value of: (sin 30° + cos 60°)/(tan 45°) c) Simplify: 2sin 60° cos 30° - sin 90°
Equations: a) Solve for θ (0° ≤ θ ≤ 360°): sin θ = √2/2 b) Solve: 2cos θ - 1 = 0 for 0° ≤ θ ≤ 360° c) Find all values of x (0° ≤ x ≤ 360°) for which: tan x = 1/√3
Graphical Solutions: a) Draw the graph of y = cos x for 0° ≤ x ≤ 360°, taking 1 cm = 30° on x-axis and 2 cm = 1 unit on y-axis. b) Use your graph to solve: cos x = 0.5 c) Use your graph to find approximate solutions to: cos x
= 0.7
Challenge Problem: Prove that: (sin 60° - sin 30°)/(cos 30° - cos 60°) = √3

WEEK 4: MATRICES AND DETERMINANTS
CONTENT
Definition of a Matrix
A matrix is a rectangular array of numbers arranged in rows and columns, enclosed in brackets.
General Form:

⎡a₁₁a₁₂a₁₃ ⎤A = ⎢a₂₁a₂₂a₂₃ ⎥⎣a₃₁a₃₂a₃₃ ⎦Where:
aᵢⱼ represents the element in the ith row and jth column
Rows run horizontally
Columns run vertically
Example:

⎡23-1 ⎤M = ⎢504 ⎥⎣1-26 ⎦Element a₁₂ = 3 (row 1, column 2)
Element a₂₃ = 4 (row 2, column 3)
Element a₃₁ = 1 (row 3, column 1)

Order of a Matrix
The order (or dimension) of a matrix is given as m × n (read as "m by n"), where:
m = number of rows
n = number of columns
Example 1:

A = ⎡23 ⎤⎢51 ⎥⎣4-2 ⎦Order: 3 × 2 (3 rows, 2 columns)
Example 2:

B = ⎡1035 ⎤⎣2-146 ⎦Order: 2 × 4 (2 rows, 4 columns)
Example 3:

C = ⎡4 ⎤⎢7 ⎥⎣2 ⎦Order: 3 × 1 (column matrix)
Example 4:
D = [ 3	5	-2	1 ]

Order: 1 × 4 (row matrix)

Types of Matrices
Row Matrix A matrix with only one row. Example:
R = [ 5	3	-1	8 ]	Order: 1 × 4

Column Matrix A matrix with only one column. Example:
C = ⎡	2 ⎤
⎢	5 ⎥	Order: 3 × 1
⎣	7 ⎦

Square Matrix A matrix where number of rows = number of columns (m = n).
Example:

S = ⎡123 ⎤⎢456 ⎥Order: 3 × 3⎣789 ⎦

Diagonal Matrix A square matrix where all elements are zero except possibly those on the main diagonal.
Example:
D = ⎡300 ⎤⎢050 ⎥⎣002 ⎦

Identity Matrix (Unit Matrix) A diagonal matrix where all diagonal elements are 1. Denoted by I.
Examples:

I₂ = ⎡10 ⎤I₃ = ⎡100 ⎤⎣01 ⎦⎢010 ⎥⎣001 ⎦Property: For any matrix A, A × I = I × A = A

Zero Matrix (Null Matrix) A matrix where all elements are zero. Denoted by O or 0. Example:
O = ⎡00 ⎤⎢00 ⎥⎣00 ⎦

Scalar Matrix A diagonal matrix where all diagonal elements are equal.
Example:

S = ⎡400 ⎤⎢040 ⎥⎣004 ⎦

Upper Triangular Matrix A square matrix where all elements below the main diagonal are zero.
Example:

U = ⎡235 ⎤⎢046 ⎥⎣001 ⎦

Lower Triangular Matrix A square matrix where all elements above the main diagonal are zero.
Example:
L = ⎡300 ⎤⎢520 ⎥⎣146 ⎦

Matrix Operations
Equality of Matrices
Two matrices are equal if:
They have the same order
Corresponding elements are equal
Example 5: If

⎡x2 ⎤= ⎡32 ⎤⎣4y ⎦⎣45 ⎦Then x = 3 and y = 5

Addition of Matrices
Matrices can only be added if they have the same order. Add corresponding elements.
Example 6:

⎡23 ⎤⎡14 ⎤⎡2+13+4 ⎤⎡37⎤⎣51 ⎦+ ⎣23 ⎦= ⎣5+21+3 ⎦= ⎣74⎦

Example 7:

⎡3-12 ⎤⎡231 ⎤⎡523 ⎤⎢405 ⎥+⎢1-24 ⎥= ⎢5-29 ⎥⎣12-3 ⎦⎣312 ⎦⎣43-1 ⎦

Properties of Addition:
Commutative: A + B = B + A
Associative: (A + B) + C = A + (B + C)
Identity: A + O = A (O is zero matrix)

Subtraction of Matrices
Subtract corresponding elements (matrices must have same order).
Example 8:

⎡53 ⎤⎡21 ⎤⎡5-23-1 ⎤⎡32⎤⎣46 ⎦- ⎣34 ⎦= ⎣4-36-4 ⎦= ⎣12⎦

Example 9:

⎡72 ⎤⎡	3-1⎤⎡43 ⎤⎢5-3 ⎥	- ⎢	25⎥= ⎢3-8 ⎥⎣14 ⎦	⎣	40⎦⎣-34 ⎦

Scalar Multiplication
Multiply every element of the matrix by the scalar (constant).
Example 10:

⎡23 ⎤⎡69 ⎤3 × ⎣14 ⎦= 3 × ⎣312 ⎦Example 11:

⎡4-2 ⎤⎡-84 ⎤-2 ×⎢30 ⎥	=⎢-60 ⎥⎣15 ⎦⎣-2-10 ⎦

Matrix Multiplication
Two matrices A (order m × n) and B (order p × q) can be multiplied if n = p (number of columns in A = number of rows in B).
The resulting matrix has order m × q.
Rule: Element in row i, column j of AB = (row i of A) · (column j of B)
Example 12: Simple 2×2 multiplication

⎡23 ⎤⎡14 ⎤⎣51 ⎦× ⎣23 ⎦
Solution:Element(1,1)=(2×1)+(3×2)=2+6=8Element(1,2)=(2×4)+(3×3)=8+9=17Element(2,1)=(5×1)+(1×2)=5+2=7Element(2,2)=(5×4)+(1×3)=20 + 3 = 23Answer:
⎡817 ⎤⎣723 ⎦

Example 13:

⎡12 ⎤⎡3 ⎤⎣45 ⎦× ⎣1 ⎦Solution: Order check: (2×2) × (2×1) = (2×1) ✓

⎡(1×3)+(2×1) ⎤⎡5 ⎤⎣(4×3)+(5×1) ⎦= ⎣17 ⎦

Example 14:

⎡213 ⎤⎡12 ⎤⎣402 ⎦× ⎢31 ⎥⎣24 ⎦Solution: Order: (2×3) × (3×2) = (2×2) ✓

16 ⎦
Important: Matrix multiplication is NOT commutative: AB ≠ BA (in general)

Example 15: Verify that AB ≠ BA

A = ⎡12 ⎤B = ⎡31 ⎤⎣34 ⎦⎣25 ⎦AB:

⎡(1×3)+(2×2)(1×1)+(2×5)⎤⎡711 ⎤⎣(3×3)+(4×2)(3×1)+(4×5)⎦= ⎣1723 ⎦BA:

⎡(3×1)+(1×3)(3×2)+(1×4)⎤⎡610 ⎤⎣(2×1)+(5×3)(2×2)+(5×4)⎦= ⎣1724 ⎦Clearly AB ≠ BA
Properties of Matrix Multiplication:
Associative: (AB)C = A(BC)
Distributive: A(B + C) = AB + AC
Identity: AI = IA = A
NOT Commutative: AB ≠ BA (generally)

Transpose of a Matrix
The transpose of a matrix A, denoted Aᵀ or A', is obtained by interchanging rows and columns.
Rule: If A = [aᵢⱼ], then Aᵀ = [aⱼᵢ]
Example 16:
⎡	1	2	3 ⎤
A = ⎣	4	5	6 ⎦
⎡	1	4 ⎤
Aᵀ = ⎢	2	5 ⎥
⎣	3	6 ⎦
Example 17:

⎡23 ⎤B = ⎢14 ⎥⎣56 ⎦⎡215 ⎤Bᵀ = ⎣346 ⎦Example 18:⎡123 ⎤C = ⎢456 ⎥⎣789 ⎦⎡
1
47 ⎤Cᵀ = ⎢258 ⎥⎣369 ⎦

Properties of Transpose:
1. (Aᵀ)ᵀ = A
2.  (A + B)ᵀ = Aᵀ + Bᵀ
(kA)ᵀ = kAᵀ (k is scalar)
(AB)ᵀ = BᵀAᵀ (note the reversal) Symmetric Matrix: A matrix where A = Aᵀ Example:
⎡235 ⎤A = ⎢346 ⎥(Symmetric)⎣567 ⎦

Determinants
The determinant is a scalar value calculated from a square matrix. Denoted det(A) or |A|.
Determinant of 2×2 Matrix

⎡ab ⎤A = ⎣cd ⎦
det(A) =
|A| = ad - bcExample 19:⎡32 ⎤A = ⎣14 ⎦
|A| =
(3×4) - (2×1) = 12
-
2 = 10Example 20:

⎡5-2 ⎤B = ⎣31 ⎦
|B| =
(5×1) - (-2×3) = 5
+
6 = 11Example 21:

⎡26 ⎤C = ⎣13 ⎦
|C| =
(2×3) - (6×1) = 6 - 6 = 0(This matrix is singular - has no inverse)

Determinant of 3×3 Matrix
For a 3×3 matrix, use the rule of Sarrus or expansion by cofactors. Method 1: Rule of Sarrus
⎡abc ⎤A = ⎢def ⎥⎣ghi ⎦
Copy first two columns to the right:

abc|abdef|deghi|ghPositive diagonals: aei + bfg + cdh Negative diagonals: ceg + afh + bdi
|A| = (aei + bfg + cdh) - (ceg + afh + bdi)

Example 22:

⎡213 ⎤A = ⎢045 ⎥⎣121 ⎦Solution: Positive: (2×4×1) + (1×5×1) + (3×0×2) = 8 + 5 + 0 = 13 Negative: (3×4×1) + (2×5×2)
+ (1×0×1) = 12 + 20 + 0 = 32
|A| = 13 - 32 = -19
Method 2: Expansion by First Row (Cofactor Method)
⎡	a	b	c ⎤
A = ⎢	d	e	f ⎥
⎣	g	h	i ⎦

|A| = a|e f| - b|d f| + c|d e|
|h i|	|g i|	|g h|

|A| = a(ei - fh) - b(di - fg) + c(dh - eg)

Example 23:

⎡123 ⎤A = ⎢456 ⎥⎣789 ⎦Solution:|A| = 1|56|- 2|46| +3|4 5||89||79||7 8|
= 1[(5×9)-(6×8)] - 2[(4×9)-(6×7)] + 3[(4×8)-(5×7)]
= 1[45-48] - 2[36-42] + 3[32-35]
= 1(-3) - 2(-6) + 3(-3)
= -3 + 12 - 9
= 0

(Rows are dependent - matrix is singular)

Example 24:

⎡2-13 ⎤B = ⎢124 ⎥⎣301 ⎦Solution:|B| = 2|24| -(-1)|1 4| + 3|1 2||01||3 1|	|3 0|
=2[(2×1)-(4×0)] + 1[(1×1)-(4×3)]+ 3[(1×0)-(2×3)]=2(2-0)+ 1(1-12) + 3(0-6)=2(2) +1(-11) + 3(-6)=4 - 11- 18=-25Properties of Determinants:
If any row or column is all zeros, |A| = 0
If two rows (or columns) are identical, |A| = 0
3. |Aᵀ| = |A|
4. |AB| = |A| × |B|
|kA| = kⁿ|A| (n = order of matrix)
Interchanging two rows changes sign: |A| → -|A|

Inverse of a Matrix
The inverse of a square matrix A (if it exists) is denoted A⁻¹, such that: A × A⁻¹ = A⁻¹ × A = I Conditions for Inverse to Exist:
Matrix must be square
|A| ≠ 0 (non-singular)
A. Inverse of 2×2 Matrix

⎡ab ⎤A = ⎣cd ⎦1⎡d -b ⎤A⁻¹ =─── × ⎣-ca ⎦|A|Steps:
Calculate |A| = ad - bc
If |A| = 0, inverse doesn't exist
Swap diagonal elements (a↔d)
Change signs of off-diagonal elements (-b, -c)
Divide by |A|
Example 25:

⎡23 ⎤A = ⎣14 ⎦Solution: Step 1: |A| = (2×4) - (3×1) = 8 - 3 = 5

Step 2: Swap and change signs:
⎡	4 -3 ⎤
⎣	-1	2 ⎦

Step 3: Divide by |A|:

1 ⎡4-3⎤⎡4/5-3/5⎤A⁻¹ = ─ ×⎣
5-12⎦= ⎣-1/52/5⎦Verification:

⎡23 ⎤⎡4/5-3/5 ⎤⎡10 ⎤⎣14 ⎦× ⎣-1/52/5 ⎦= ⎣01 ⎦✓

Example 26:

⎡52 ⎤B = ⎣31 ⎦Solution: |B| = (5×1) - (2×3) = 5 - 6 = -1

1	⎡1-2 ⎤⎡-12⎤B⁻¹ = ─── ⎣
-1-35 ⎦= ⎣3-5⎦

Example 27: Matrix with no inverse
⎡24 ⎤C = ⎣12 ⎦
|C| = (2×2) - (4×1) = 4 - 4 = 0
No inverse exists (singular matrix)

Solving Simultaneous Equations Using Matrices
Method: If we have equations in matrix form AX = B, then X = A⁻¹B Example 28: Solve:
2x + y = 5 x + 3y = 8

Solution:
Step 1: Matrix form

⎡21 ⎤⎡x ⎤⎡5 ⎤⎣13 ⎦⎣y ⎦= ⎣8 ⎦Step 2: Find A⁻¹ |A| = (2×3) - (1×1) = 6 - 1 = 5
A⁻¹ = (1/5) ⎡	3 -1 ⎤	= ⎡	3/5 -1/5 ⎤
⎣	-1	2 ⎦	⎣	-1/5	2/5 ⎦

Step 3: X = A⁻¹B

⎡x ⎤⎡3/5-1/5⎤⎡5 ⎤⎣y ⎦= ⎣-1/52/5⎦⎣8 ⎦
x
= (3/5)(5) + (-1/5)(8)
= 15/5 - 8/5 = 7/5y= (-1/5)(5) + (2/5)(8)= -5/5 + 16/5 = 11/5Verification: 2(7/5) + (11/5) = 14/5 + 11/5 = 25/5 = 5 ✓ (7/5) + 3(11/5) = 7/5 + 33/5 = 40/5 = 8
✓
Answer: x = 7/5 = 1.4, y = 11/5 = 2.2 Example 29: Solve using matrices:
3x + 2y = 7
x + y = 3 Solution: Matrix form:
|A| = (3×1) - (2×1) = 3 - 2 = 1

A⁻¹ = (1/1)⎡1-2 ⎤= ⎡1-2 ⎤⎣-13 ⎦⎣-13 ⎦⎡x ⎤⎡
1-2 ⎤⎡7 ⎤⎡(1)(7) + (-2)(3) ⎤⎡7-6 ⎤⎡1 ⎤⎣y ⎦= ⎣-13 ⎦⎣3 ⎦= ⎣(-1)(7) + (3)(3) ⎦= ⎣-7+9 ⎦=⎣2⎦Verification: 3(1) + 2(2) = 3 + 4 = 7 ✓ 1 + 2 = 3 ✓
Answer: x = 1, y = 2

EVALUATION
State the order of the following matrices: a) A = ⎡	1 2 3 ⎤	⎣	4 5 6 ⎦
b) B = ⎡	2 ⎤	⎢	5 ⎥	⎣	7 ⎦
2.	Given A = ⎡	2 3 ⎤	and B = ⎡	1 4 ⎤ , find: ⎣	1 5 ⎦	⎣	2 3 ⎦	a) A + B b) A - B c) 2A
3.	Find AB if A = ⎡	1 2 ⎤	and B = ⎡	3 1 ⎤	⎣	3 4 ⎦	⎣	2 5 ⎦
Find the transpose of A = ⎡	2 1 3 ⎤	⎣	4 5 6 ⎦
Calculate the determinant: |2 3| |1 4|
Find the determinant: |1 2 3| |0 4 5| |1 2 1|
Find the inverse of A = ⎡	3 1 ⎤	⎣	2 1 ⎦
Find the inverse of B = ⎡	1 2 ⎤	⎣	3 4 ⎦
Solve using matrices: 2x + y = 7 x + y = 4
Identify the type of matrix: ⎡	1 0 0 ⎤	⎢	0 1 0 ⎥	⎣	0 0 1 ⎦

ASSIGNMENT
1.	Matrix Operations: Given A = ⎡	2 -1 ⎤   , B = ⎡	3 2 ⎤   , and C = ⎡	1 0 ⎤	⎢	3 4 ⎥	⎢	1 5 ⎥	⎢	2 3 ⎥	⎣
0 2 ⎦	⎣	4 1 ⎦	⎣	1 2 ⎦
Calculate: a) 2A - 3B b) AB c) (A + B)ᵀ d) BC
Determinants: a) Find |A| if A = ⎡	4 2 ⎤	⎣	-3 1 ⎦
b) Calculate: |2 1 3| |1 0 2| |4 2 1|
c) Find the value of k if |k 2| = 0 |3 6|
Matrix Inverses: a) Find the inverse of M = ⎡	5 3 ⎤	⎣	2 1 ⎦
b) Verify that M	M⁻ ¹ = I
c) Find N⁻ ¹ if N = ⎡	4 1 ⎤	⎣	3 1 ⎦
Solving Systems: Use matrices to solve: a) 3x + 2y = 11 2x + y = 7 b) x + 3y = 5 2x + y = 4
c) 4x - y = 10 x + 2y = 5
Application Problem: A company produces two products A and B. The production requirements are given in the matrix:

⎡23 ⎤(hours of labor)P =	⎣12 ⎦(units of material)Where columns represent products A and B.
If the company produces 10 units of A and 15 units of B, write a matrix equation to find total labor hours and materials needed. b) Calculate the totals. c) If labor costs ₦500 per hour and material costs ₦200 per unit, find the total cost using matrix multiplication.

WEEK 6: LINEAR AND QUADRATIC EQUATIONS
CONTENT
Review: Linear Equations
A linear equation has the form y = mx + c where:
m = slope (gradient)
c = y-intercept
Graph is a straight line Example 1: y = 2x + 3
Slope m = 2
y-intercept c = 3

Review: Quadratic Equations
A quadratic equation has the form y = ax² + bx + c where a ≠ 0:
a, b, c are constants
a determines if parabola opens up (a > 0) or down (a < 0)
Graph is a parabola Example 2: y = x² - 4x + 3
a = 1 (opens upward)
b = -4
c = 3

Solving Simultaneous Linear and Quadratic Equations Algebraically
Method: Substitution
Example 3: Solve simultaneously:
y = x + 2 ... (1) [linear]
y = x² - 4 ... (2) [quadratic]

Solution:
Step 1: Substitute equation (1) into equation (2)
x + 2 = x² - 4

Step 2: Rearrange to standard form
x² - x - 6 = 0

Step 3: Factorize
(x - 3)(x + 2) = 0
x = 3 or x = -2

Step 4: Find corresponding y-values using equation (1)
When x = 3: y = 3 + 2 = 5
When x = -2: y = -2 + 2 = 0

Solutions: (3, 5) and (-2, 0)
Verification: For (3, 5):
Linear: y = 3 + 2 = 5 ✓
Quadratic: y = 9 - 4 = 5 ✓
For (-2, 0):
Linear: y = -2 + 2 = 0 ✓
Quadratic: y = 4 - 4 = 0 ✓

Example 4: Solve:
y = 2x - 1 ... (1)
y = x² + x - 5 ... (2)

Solution:
Substitute (1) into (2):
2x - 1 = x² + x - 5
0 = x² + x - 2x - 5 + 1 x² - x - 4 = 0

Using quadratic formula (doesn't factorize nicely):
x = [1 ± √(1 + 16)] / 2 x = [1 ± √17] / 2
x = (1 + √17)/2 or x = (1 - √17)/2 x ≈ 2.56 or x ≈ -1.56
Find y-values:
When x ≈ 2.56: y = 2(2.56) - 1 ≈ 4.12
When x ≈ -1.56: y = 2(-1.56) - 1 ≈ -4.12

Solutions: (2.56, 4.12) and (-1.56, -4.12) (approximate)

Example 5: Solve:
x + y = 5  ... (1)
x² + y² = 13 ... (2)

Solution:
From (1): y = 5 - x Substitute into (2):
x² + (5 - x)² = 13
x² + 25 - 10x + x² = 13 2x² - 10x + 25 = 13
2x² - 10x + 12 = 0
x² - 5x + 6 = 0 (x - 2)(x - 3) = 0
x = 2 or x = 3

When x = 2: y = 5 - 2 = 3 When x = 3: y = 5 - 3 = 2
Solutions: (2, 3) and (3, 2)

Example 6: Solve:
y = x - 1  ... (1)
y = x² - 5x + 5 ... (2)

Solution:
Substitute:
x - 1 = x² - 5x + 5
0 = x² - 5x - x + 5 + 1 x² - 6x + 6 = 0

Using quadratic formula:
x = [6 ± √(36 - 24)] / 2 x = [6 ± √12] / 2
x = [6 ± 2√3] / 2
x = 3 ± √3
x = 3 + √3 or x = 3 - √3 x ≈ 4.73 or x ≈ 1.27

Find y-values:
When x ≈ 4.73: y ≈ 3.73 When x ≈ 1.27: y ≈ 0.27

Solutions: (4.73, 3.73) and (1.27, 0.27) (approximate)
Solving Graphically
Steps:
Draw both graphs on the same axes
Identify points of intersection
Read coordinates from graph
Example 7: Solve graphically:
y = x + 1 y = x² - 2x

Solution:
For y = x + 1 (straight line):

x: -2-1012y: -10123For y = x² - 2x (parabola):

x: -2-101234y:	830-1038Plot both curves. They intersect at approximately:
(-1, 0)
(3, 4)

Example 8: Interpret number of solutions from graphs
Case 1: Line intersects parabola at two points → Two solutions
Case 2: Line is tangent to parabola (touches at one point) → One solution (repeated root)
Case 3: Line doesn't touch parabola → No real solutions

Word Problems
Example 9: The sum of two numbers is 10, and their product is 21. Find the numbers.
Solution:
Let the numbers be x and y.
x + y = 10  ... (1)
xy = 21	... (2)

From (1): y = 10 - x
Substitute into (2):
x(10 - x) = 21
10x - x² = 21
x² - 10x + 21 = 0 (x - 3)(x - 7) = 0
x = 3 or x = 7

When x = 3: y = 7 When x = 7: y = 3
The numbers are 3 and 7

Example 10: A rectangular field has length 5m more than its width. If the area is 84 m², find the dimensions.
Solution:
Let width = x meters Then length = (x + 5) meters Area equation:
x(x + 5) = 84
x² + 5x = 84
x² + 5x - 84 = 0 (x + 12)(x - 7) = 0
x = -12 or x = 7

Since width must be positive: x = 7 m Length = 7 + 5 = 12 m
Dimensions: 7 m × 12 m
Verification: 7 × 12 = 84 ✓

Example 11 (Capital Market Application):
An investor buys shares at ₦x each. The number of shares bought is (100 - x). If the total investment is ₦2,400, find: a) The equation relating x and the number of shares b) The price per share c) The number of shares bought
Solution:
Price per share × Number of shares = Total investment
x(100 - x) = 2400

Solve for x:
100x - x² = 2400
x² - 100x + 2400 = 0 (x - 40)(x - 60) = 0
x = 40 or x = 60

If x = 40: Number of shares = 100 - 40 = 60 shares If x = 60: Number of shares = 100 - 60 = 40 shares
Two possible scenarios:
₦40 per share, 60 shares, or
₦60 per share, 40 shares
Example 12: A trader bought x items for ₦(x² + 2x) and sold them for ₦(3x² - 4x). If the profit was ₦140, find the number of items.
Solution:
Profit = Selling Price - Cost Price
(3x² - 4x) - (x² + 2x) = 140 3x² - 4x - x² - 2x = 140
2x² - 6x = 140
2x² - 6x - 140 = 0 x² - 3x - 70 = 0 (x - 10)(x + 7) = 0
x = 10 or x = -7

Since number of items must be positive: x = 10 items
Verification: Cost = 10² + 2(10) = 100 + 20 = ₦120 Selling Price = 3(10²) - 4(10) = 300 - 40 =
₦260 Profit = 260 - 120 = ₦140 ✓

Interpreting Quadratic Graphs
Key Features:
Vertex (Turning Point)
Maximum (if parabola opens down)
Minimum (if parabola opens up)
Found using x = -b/(2a)
Axis of Symmetry
Vertical line through vertex
Equation: x = -b/(2a)
Y-intercept
Where graph crosses y-axis
Point: (0, c)
X-intercepts (Roots)
Where graph crosses x-axis
Found by solving ax² + bx + c = 0
Example 13: For y = x² - 4x + 3, find: a) Vertex b) Axis of symmetry c) Y-intercept d) X- intercepts
Solution:
Vertex:
x = -b/(2a) = -(-4)/(2×1) = 4/2 = 2
y = (2)² - 4(2) + 3 = 4 - 8 + 3 = -1
Vertex: (2, -1)

Axis of symmetry: x = 2
Y-intercept: Put x = 0
y = 0 - 0 + 3 = 3
Y-intercept: (0, 3)

X-intercepts: Put y = 0
x² - 4x + 3 = 0 (x - 1)(x - 3) = 0
x = 1 or x = 3
intercepts: (1, 0) and (3, 0)

EVALUATION
Solve simultaneously: y = x + 3 y = x² + x - 2
Solve algebraically: y = 2x - 1 y = x² - 3
Solve: x + y = 6 xy = 8
The sum of two numbers is 12 and their product is 35. Find the numbers.
A rectangular garden has length 3m more than its width. If the area is 40 m², find the dimensions.
For the equation y = x² - 6x + 5, find: a) The vertex b) The axis of symmetry c) The y-intercept d) The x- intercepts
Solve: y = x - 2 y = x² - 4x + 2
How many solutions does the system have if the discriminant of the resulting quadratic is negative?
An investor buys shares at ₦x each. The number bought is (80 - 2x). If total investment is ₦800, find the price per share.
Sketch the graphs of y = 2x and y = x² - 4 on the same axes. Estimate the solutions graphically.

ASSIGNMENT
Algebraic Solutions: Solve the following systems: a) y = x + 1 y = x² - 3x + 2 b) y = 3x - 2 y = 2x² - x - 1
c) x - y = 2 x² + y² = 10
d) y = 2x y = x² - 8
Word Problems: a) The difference between two numbers is 4 and their product is 45. Find the numbers.
A rectangular playground has perimeter 36 m and area 80 m². Find its dimensions.
The sum of a number and its reciprocal is 2.9. Find the number.
A ball is thrown upward. Its height h (in meters) after t seconds is given by: h = 20t - 5t² i) When does the ball hit the ground? ii) What is the maximum height reached?
Capital Market Application: A stockbroker bought x shares at ₦(200 - 2x) each. a) Write an expression for the total cost b) If the total cost was ₦9,600, form an equation and solve for x c) Find the price per share d) How many shares were bought?
Graphical Solution: a) On the same axes, draw the graphs of: y = x + 2 (for -3 ≤ x ≤ 5) y = x² - 4x (for -1 ≤ x
≤ 5) Use 2 cm = 1 unit on both axes
From your graph, find the solutions to: x + 2 = x² - 4x
Verify your graphical solutions algebraically
Analysis: For the quadratic function y = -x² + 6x - 5: a) Find the vertex and state whether it's a maximum or minimum b) Find the y-intercept c) Find the x-intercepts d) Sketch the graph e) State the range of values of x for which y is positive

WEEK 8: SURFACE AREA AND VOLUME OF SPHERES AND HEMISPHERES
CONTENT
Introduction to Spheres
A sphere is a perfectly round three-dimensional solid object where every point on its surface is equidistant from its center.

Key Terms:
Radius (r): Distance from center to any point on the surface
Diameter (d): Distance across the sphere through the center (d = 2r)
Center: The fixed point equidistant from all surface points
Examples in Real Life:
Football, basketball, tennis ball
Globe, planets, moon
Oranges, watermelons
Balloons (when inflated spherically)
Marbles, beads

Surface Area of a Sphere
The surface area is the total area covering the outside of the sphere.
Formula: Surface Area of Sphere = 4πr²
Where:
r = radius
π = 22/7 or 3.142
Derivation Concept: The surface area of a sphere is exactly 4 times the area of a circle with the same radius.
Area of circle = πr²
Surface area of sphere = 4πr²
Example 1: Find the surface area of a sphere with radius 7 cm.
Solution:
Surface Area = 4πr²
= 4 × (22/7) × 7²
= 4 × (22/7) × 49
= 4 × 22 × 7
= 616 cm²

Answer: 616 cm²

Example 2: A spherical balloon has radius 14 cm. Find its surface area.
Solution:
Surface Area = 4πr²
= 4 × (22/7) × 14²
= 4 × (22/7) × 196
= 4 × 22 × 28
= 2,464 cm²

Answer: 2,464 cm²
Example 3: The surface area of a sphere is 1,386 cm². Calculate its radius. (Use π = 22/7)
Solution:
4πr² = 1,386
4 × (22/7) × r² = 1,386 (88/7) × r² = 1,386
r² = 1,386 × (7/88) r² = 1,386 ÷ 88 × 7
r² = 15.75 × 7
r² = 110.25 r = √110.25
r = 10.5 cm

Answer: r = 10.5 cm

Example 4: A sphere has diameter 21 cm. Find its surface area.
Solution: First find radius:
r = d/2 = 21/2 = 10.5 cm

Surface Area = 4πr²
= 4 × (22/7) × (10.5)²
= 4 × (22/7) × 110.25
= 4 × 22 × 15.75
= 1,386 cm²

Answer: 1,386 cm²

Volume of a Sphere

The volume is the amount of space occupied by the sphere.
Formula: Volume of Sphere = (4/3)πr³
Example 5: Find the volume of a sphere with radius 3 cm. (Use π = 22/7)
Solution:
Volume = (4/3)πr³
= (4/3) × (22/7) × 3³
= (4/3) × (22/7) × 27
= (4 × 22 × 27)/(3 × 7)
= 2,376/21
= 113.14 cm³

Answer: 113.14 cm³

Example 6: A spherical water tank has radius 1.5 m. Calculate its volume in: a) Cubic meters b) Liters (1 m³ = 1,000 liters)
Solution: a)
Volume = (4/3)πr³
= (4/3) × 3.142 × (1.5)³
= (4/3) × 3.142 × 3.375
= 4.189 × 3.375
= 14.14 m³

b)
Volume in liters = 14.14 × 1,000
= 14,140 liters

Answer: a) 14.14 m³ b) 14,140 liters

Example 7: The volume of a sphere is 4,851 cm³. Find its radius. (Use π = 22/7)
Solution:
(4/3)πr³ = 4,851
(4/3) × (22/7) × r³ = 4,851 (88/21) × r³ = 4,851
r³ = 4,851 × (21/88) r³ = 4,851 × 21 ÷ 88
r³ = 101,871 ÷ 88
r³ = 1,157.625 r = ³√1,157.625
r ≈ 10.5 cm

Answer: r = 10.5 cm
Example 8: A sphere has diameter 42 cm. Calculate: a) Its surface area b) Its volume
Solution:
r = 42/2 = 21 cm

Surface Area = 4πr²
= 4 × (22/7) × 21²
= 4 × (22/7) × 441
= 4 × 22 × 63
= 5,544 cm²

Volume = (4/3)πr³
= (4/3) × (22/7) × 21³
= (4/3) × (22/7) × 9,261
= (4 × 22 × 9,261)/(3 × 7)
= 814,968/21
= 38,808 cm³

Answer: a) 5,544 cm² b) 38,808 cm³

Hemispheres

A hemisphere is exactly half of a sphere, divided by a plane passing through its center.
Types of Hemispheres:
Solid Hemisphere: The complete half-sphere
Hollow Hemisphere: Like a bowl (has thickness)
Parts of a Hemisphere:
Curved surface: The spherical part
Flat surface (base): Circular base
Radius: Same as the sphere's radius

Curved Surface Area of a Hemisphere
The curved surface area is half the surface area of a sphere.

Formula: Curved Surface Area of Hemisphere = 2πr²
Example 9: Find the curved surface area of a hemisphere with radius 7 cm.
Solution:
Curved Surface Area = 2πr²
= 2 × (22/7) × 7²
= 2 × (22/7) × 49
= 2 × 22 × 7
= 308 cm²

Answer: 308 cm²

Example 10: A hemispherical dome has diameter 28 m. Find its curved surface area.
Solution:
r = 28/2 = 14 m

Curved Surface Area = 2πr²
= 2 × (22/7) × 14²
= 2 × (22/7) × 196
= 2 × 22 × 28
= 1,232 m²

Answer: 1,232 m²

Total Surface Area of a Solid Hemisphere
Total surface area includes both the curved surface and the circular base.

Formula: Total Surface Area = Curved Surface Area + Area of Base Total Surface Area = 2πr² + πr² Total Surface Area = 3πr²
Example 11: Find the total surface area of a solid hemisphere with radius 10.5 cm.
Solution:
Total Surface Area = 3πr²
= 3 × (22/7) × (10.5)²
= 3 × (22/7) × 110.25
= 3 × 22 × 15.75
= 1,039.5 cm²

Answer: 1,039.5 cm²

Example 12: A hemispherical bowl has radius 21 cm. Calculate: a) Curved surface area b) Total surface area
Solution: a)
Curved Surface Area = 2πr²
= 2 × (22/7) × 21²
= 2 × (22/7) × 441
= 2 × 22 × 63
= 2,772 cm²

b)
Total Surface Area = 3πr²
= 3 × (22/7) × 21²
= 3 × (22/7) × 441
= 3 × 22 × 63
= 4,158 cm²

Answer: a) 2,772 cm² b) 4,158 cm²

Volume of a Hemisphere
The volume of a hemisphere is half the volume of a sphere.

Formula: Volume of Hemisphere = (2/3)πr³
Example 13: Find the volume of a hemisphere with radius 6 cm.
Solution:
Volume = (2/3)πr³
= (2/3) × (22/7) × 6³
= (2/3) × (22/7) × 216
= (2 × 22 × 216)/(3 × 7)
= 9,504/21
= 452.57 cm³

Answer: 452.57 cm³

Example 14: A hemispherical tank has diameter 14 m. Find its capacity in liters.
Solution:
r = 14/2 = 7 m

Volume = (2/3)πr³
= (2/3) × (22/7) × 7³
= (2/3) × (22/7) × 343
= (2 × 22 × 343)/(3 × 7)
= 15,092/21
= 718.67 m³

Capacity in liters = 718.67 × 1,000
= 718,670 liters

Answer: 718,670 liters

Hollow Spheres and Hemispheres
Hollow Sphere: A sphere with an empty interior (like a football).
Given:
External radius = R
Internal radius = r
Thickness = R - r
Surface Area of Hollow Sphere:
External surface = 4πR²
Internal surface = 4πr²
Total surface area = 4πR² + 4πr² = 4π(R² + r²)
Volume of Material in Hollow Sphere: Volume = Volume of outer sphere - Volume of inner sphere Volume = (4/3)πR³ - (4/3)πr³ Volume = (4/3)π(R³ - r³)

Example 15: A hollow sphere has external radius 10 cm and internal radius 7 cm. Find: a) Volume of material b) Total surface area
Solution: a)
Volume = (4/3)π(R³ - r³)
= (4/3) × (22/7) × (10³ - 7³)
= (4/3) × (22/7) × (1,000 - 343)
= (4/3) × (22/7) × 657
= (4 × 22 × 657)/(3 × 7)
= 57,816/21
= 2,753.14 cm³

b)
Total Surface Area = 4π(R² + r²)
= 4 × (22/7) × (10² + 7²)
= 4 × (22/7) × (100 + 49)
= 4 × (22/7) × 149
= 4 × 22 × 21.29
= 1,873.36 cm²

Answer: a) 2,753.14 cm³ b) 1,873.36 cm²

Example 16: A hollow hemispherical bowl has external diameter 16 cm and thickness 2 cm. Find the volume of material used.
Solution:
External radius R = 16/2 = 8 cm Thickness = 2 cm
Internal radius r = 8 - 2 = 6 cm Volume = (2/3)π(R³ - r³)
= (2/3) × (22/7) × (8³ - 6³)
= (2/3) × (22/7) × (512 - 216)
= (2/3) × (22/7) × 296
= (2 × 22 × 296)/(3 × 7)
= 13,024/21
= 620.19 cm³

Answer: 620.19 cm³

Combined Solids Involving Spheres and Hemispheres
Example 17: A toy consists of a hemisphere surmounted by a cone. The radius of the base is 7 cm and the total height is 20 cm. Find the total surface area. (Ignore the base)
Solution:
Hemisphere radius = 7 cm Height of cone = 20 - 7 = 13 cm Radius of cone = 7 cm

For cone, find slant height l:
l = √(h² + r²) l = √(13² + 7²) l = √(169 + 49)
l = √218
l = 14.76 cm

Curved surface area of hemisphere = 2πr²
= 2 × (22/7) × 7²
= 2 × 22 × 7
= 308 cm²

Curved surface area of cone = πrl
= (22/7) × 7 × 14.76
= 22 × 14.76
= 324.72 cm²

Total surface area = 308 + 324.72
= 632.72 cm²

Answer: 632.72 cm²
Example 18: A solid consists of a cylinder with hemispheres at both ends. The radius is 3.5 cm and the length of the cylindrical part is 10 cm. Find: a) Total surface area b) Volume
Solution:
r = 3.5 cm h = 10 cm

Surface area of cylinder = 2πrh (curved surface only)
= 2 × (22/7) × 3.5 × 10
= 2 × 22 × 0.5 × 10
= 220 cm²

Surface area of two hemispheres = 2 × 2πr²
= 4πr²
= 4 × (22/7) × (3.5)²
= 4 × (22/7) × 12.25
= 4 × 22 × 1.75
= 154 cm²

Total surface area = 220 + 154 = 374 cm²

Volume of cylinder = πr²h
= (22/7) × (3.5)² × 10
= (22/7) × 12.25 × 10
= 22 × 1.75 × 10
= 385 cm³

Volume of two hemispheres = 2 × (2/3)πr³
= (4/3)πr³ (volume of one sphere)
= (4/3) × (22/7) × (3.5)³
= (4/3) × (22/7) × 42.875
= (4 × 22 × 42.875)/(3 × 7)
= 3,773/21
= 179.67 cm³

Total volume = 385 + 179.67 = 564.67 cm³

Answer: a) 374 cm² b) 564.67 cm³

Word Problems
Example 19: A spherical water tank has internal diameter 4.2 m. How many liters of water can it hold when full? (1 m³ = 1,000 liters)
Solution:
r = 4.2/2 = 2.1 m

Volume = (4/3)πr³
= (4/3) × (22/7) × (2.1)³
= (4/3) × (22/7) × 9.261
= (4 × 22 × 9.261)/(3 × 7)
= 814.968/21
= 38.808 m³

Capacity = 38.808 × 1,000
= 38,808 liters

Answer: 38,808 liters

Example 20: How many lead balls of radius 1 cm can be made from a sphere of radius 8 cm?
Solution:
Volume of large sphere = (4/3)πR³
= (4/3)π(8)³
= (4/3)π × 512

Volume of one small ball = (4/3)πr³
= (4/3)π(1)³
= (4/3)π

Number of balls = Volume of large sphere / Volume of one ball
= [(4/3)π × 512] / [(4/3)π]
= 512

Answer: 512 balls

Example 21: A hemispherical bowl of internal radius 9 cm contains water. This water is to be poured into cylindrical bottles of diameter 3 cm and height 4 cm. How many bottles are needed?
Solution:
Volume of hemisphere = (2/3)πr³
= (2/3) × (22/7) × 9³
= (2/3) × (22/7) × 729
= (2 × 22 × 729)/(3 × 7)
= 32,076/21
= 1,527.43 cm³

Volume of one bottle = πr²h r = 3/2 = 1.5 cm
= (22/7) × (1.5)² × 4
= (22/7) × 2.25 × 4
= (22/7) × 9
= 198/7
= 28.29 cm³

Number of bottles = 1,527.43 / 28.29
= 54 bottles (approximately)

Answer: 54 bottles

Example 22: A metallic sphere of radius 10.5 cm is melted and recast into small cones of radius
3.5 cm and height 3 cm. How many cones are formed?
Solution:
Volume of sphere = (4/3)πr³
= (4/3) × (22/7) × (10.5)³
= (4/3) × (22/7) × 1,157.625
= (4 × 22 × 1,157.625)/(3 × 7)
= 101,871/21
= 4,851 cm³

Volume of one cone = (1/3)πr²h
= (1/3) × (22/7) × (3.5)² × 3
= (1/3) × (22/7) × 12.25 × 3
= (1/3) × (22/7) × 36.75
= (22 × 36.75)/(3 × 7)
= 808.5/21
= 38.5 cm³

Number of cones = 4,851 / 38.5
= 126 cones

Answer: 126 cones

Practical Applications
In Architecture:
Dome structures (mosques, churches, capitol buildings)
Planetariums
Geodesic domes
In Sports:
Calculating material for footballs, basketballs
Stadium dome coverage
In Manufacturing:
Ball bearings
Storage tanks
Capsules and tablets
In Nature:
Planet sizes and volumes
Soap bubbles
Fruit calculations (oranges, coconuts)

EVALUATION
Find the surface area of a sphere with radius 14 cm.
Calculate the volume of a sphere with diameter 12 cm. (Use π = 3.142)
A sphere has surface area 616 cm². Find its radius. (Use π = 22/7)
Find the curved surface area of a hemisphere with radius 10.5 cm.
Calculate the total surface area of a solid hemisphere with radius 7 cm.
Find the volume of a hemisphere with diameter 18 cm.
A hollow sphere has external radius 12 cm and internal radius 9 cm. Find the volume of material.
How many small balls of radius 2 cm can be made from a sphere of radius 6 cm?
A hemispherical bowl has internal diameter 21 cm. Find its capacity in cm³.
A spherical water tank has radius 3.5 m. How many liters of water can it hold?

ASSIGNMENT
Basic Calculations: a) Find the surface area and volume of a sphere with radius 21 cm. b) A sphere has volume 38,808 cm³. Find its radius. (Use π = 22/7) c) Calculate the curved and total surface area of a hemisphere with radius 14 cm. d) Find the volume of a hemisphere with radius 10.5 cm.
Hollow Solids: a) A hollow sphere has external diameter 20 cm and thickness 3 cm. Find: i) The volume of material used ii) The total surface area
b) A hemispherical bowl has internal radius 12 cm and thickness 1 cm. Calculate the volume of material.
Word Problems: a) A spherical balloon is inflated so that its radius increases from 7 cm to 14 cm. How many times does: i) Its surface area increase? ii) Its volume increase?
A solid metal sphere of radius 10 cm is melted and recast into smaller spheres of radius 2 cm. How many small spheres are formed?
A hemispherical tank of internal radius 1.4 m is full of water. The water is emptied into a cylindrical tank of diameter 2.8 m. Find the height of water in the cylinder.
A solid consisting of a cylinder with hemispherical ends has total length 20 cm and radius 3.5 cm. If the length of the cylindrical part is 13 cm, find: i) Total surface area ii) Volume
Practical Application: A company manufactures hemispherical bowls of radius 7 cm. The bowls are made of metal of thickness 0.5 cm. a) Find the external and internal radii b) Calculate the volume of metal in one bowl
c) If metal costs ₦50 per cm³, find the cost of material for one bowl d) If the company adds 40% profit, what is the selling price?
Challenge Problem: A solid toy is in the form of a hemisphere surmounted by a right circular cone. The height of the cone is 4 cm and the diameter of the base is 8 cm. a) Draw a diagram of the solid b) Find the volume of the toy c) Find the total surface area of the toy d) If the toy is to be painted, and 1 ml of paint covers 10 cm², how much paint is needed?

WEEK 9: LONGITUDE AND LATITUDE I
CONTENT
Introduction to Earth's Coordinate System

The Earth is approximately spherical (actually an oblate spheroid - slightly flattened at the poles). To locate positions on Earth, we use a coordinate system based on latitude and longitude.
Key Facts:
Earth's radius ≈ 6,400 km (or 6,370 km - varies slightly)
One complete rotation = 360°
One rotation takes 24 hours
Circumference at equator ≈ 40,000 km

Important Terms and Definitions
North and South Poles North Pole:
The northernmost point on Earth
Latitude 90°N
All longitude lines converge here
South Pole:
The southernmost point on Earth
Latitude 90°S
All longitude lines converge here
Equator
The equator is an imaginary line running around the middle of the Earth, halfway between the North and South Poles.
Properties:
Latitude 0°
Divides Earth into Northern and Southern Hemispheres
Length ≈ 40,000 km
All points on equator are equidistant from both poles
Perpendicular to Earth's axis
Meridian (Line of Longitude)
A meridian is a great circle passing through both poles.
Properties:
Runs from North Pole to South Pole
All meridians are equal in length (approximately 40,000 km)
Measured in degrees East or West of the Prime Meridian
Also called "lines of longitude"
Prime Meridian (Greenwich Meridian):
Longitude 0°
Passes through Greenwich, London, England
Divides Earth into Eastern and Western Hemispheres
Reference line for all longitude measurements
Latitude (Parallel)
Latitude lines are circles parallel to the equator.
Properties:
Run East-West
Range from 0° (equator) to 90°N (North Pole) and 90°S (South Pole)
All points on the same latitude are the same distance from the equator
Circles get smaller as you move toward the poles
Also called "parallels of latitude"
Great Circle
A great circle is any circle on the sphere's surface whose center coincides with the center of the Earth.
Properties:
Largest possible circle on a sphere
Divides sphere into two equal hemispheres
All meridians are great circles
Only the equator is a great circle among parallels of latitude
Shortest distance between two points on Earth follows a great circle
Small Circle
Any circle on Earth's surface that is not a great circle.
Properties:
Center does not coincide with Earth's center
All parallels of latitude (except equator) are small circles
Radius less than Earth's radius

Understanding Latitude
Notation:
Northern Hemisphere: Marked as N or + (e.g., 30°N)
Southern Hemisphere: Marked as S or - (e.g., 30°S)
Important Latitudes:
Arctic Circle: 66.5°N
Tropic of Cancer: 23.5°N
Equator: 0°
Tropic of Capricorn: 23.5°S
Antarctic Circle: 66.5°S
Example 1: Lagos, Nigeria is at approximately 6.5°N. What does this mean?
Answer: Lagos is 6.5 degrees north of the equator, in the Northern Hemisphere.
Understanding Longitude

Notation:
Eastern Hemisphere: Marked as E or + (e.g., 40°E)
Western Hemisphere: Marked as W or - (e.g., 40°W)
Ranges from 0° to 180°E and 0° to 180°W
International Date Line:
Approximately follows 180° longitude
Where date changes
Located in the Pacific Ocean
Example 2: Abuja, Nigeria is at approximately 7.5°E. What does this mean?
Answer: Abuja is 7.5 degrees east of the Prime Meridian, in the Eastern Hemisphere.

Coordinates of a Location
A location on Earth is specified by two coordinates: latitude and longitude.
Format: (Latitude, Longitude)
Examples:
Lagos, Nigeria: (6.5°N, 3.4°E)
London, UK: (51.5°N, 0°) - on Prime Meridian
New York, USA: (40.7°N, 74.0°W)
Sydney, Australia: (33.9°S, 151.2°E)
Radius of a Parallel of Latitude
The radius of a parallel of latitude decreases as you move away from the equator toward the poles.

Formula: r = R cos θ
Where:
r = radius of the parallel of latitude
R = radius of Earth (≈ 6,400 km)
θ = angle of latitude
Important Notes:
At equator (θ = 0°): r = R cos 0° = R (maximum radius)
At poles (θ = 90°): r = R cos 90° = 0 (point)
Radius decreases as latitude increases

Example 3: Find the radius of the parallel of latitude 60°N if Earth's radius is 6,400 km.
Solution:
r = R cos θ
r = 6,400 × cos 60°
r = 6,400 × 0.5
r = 3,200 km

Answer: 3,200 km

Example 4: Calculate the radius of the circle of latitude 45°S. (R = 6,400 km)
Solution:
r = R cos θ
r = 6,400 × cos 45° r = 6,400 × (√2/2) r = 6,400 × 0.7071 r = 4,525.44 km

Answer: 4,525.44 km

Example 5: The radius of a parallel of latitude is 3,200 km. Find the latitude if Earth's radius is 6,400 km.
Solution:
r = R cos θ
3,200 = 6,400 cos θ
cos θ = 3,200/6,400 cos θ = 0.5
θ = cos⁻¹(0.5) θ = 60°

Answer: 60°N or 60°S

Length (Circumference) of a Parallel of Latitude

The circumference of a parallel of latitude can be calculated once we know its radius.
Formula: Length = 2πr = 2πR cos θ
Where:
R = Earth's radius
θ = latitude angle
r = radius of that latitude
Example 6: Find the length of the parallel of latitude 60°N. (R = 6,400 km, π = 22/7)
Solution:
First find radius:
r = R cos 60° = 6,400 × 0.5 = 3,200 km

Length = 2πr
= 2 × (22/7) × 3,200
= 2 × 22 × 457.14
= 20,114.29 km

Answer: 20,114.29 km

Example 7: What is the circumference of Earth at latitude 30°S?
Solution:
r = R cos 30°
r = 6,400 × (√3/2) r = 6,400 × 0.866 r = 5,542.4 km

Circumference = 2πr
= 2 × 3.142 × 5,542.4
= 34,805.83 km

Answer: 34,805.83 km

Angular Distance Between Two Points
On the Same Meridian (Same Longitude): The angular distance is simply the difference in latitudes.
Example 8: Find the angular distance between points A(30°N, 15°E) and B(10°S, 15°E).
Solution: Both points are on the same meridian (15°E).
Angular distance = 30° + 10° = 40° (Add when on opposite sides of equator)

Answer: 40°

Example 9: Find the angular distance between C(50°N, 20°W) and D(20°N, 20°W).
Solution: Both on same meridian (20°W).
Angular distance = 50° - 20° = 30° (Subtract when on same side of equator)

Answer: 30°
On the Same Parallel (Same Latitude): The angular distance depends on the difference in longitudes.

Example 10: Two points P and Q are on latitude 60°N. P is on longitude 30°E and Q is on longitude 50°E. Find the angular distance between them along the parallel of latitude.
Solution:
Difference in longitude = 50° - 30° = 20°

Note: This is the angle at Earth's center measured along the parallel.

Answer: 20°
However, when calculating distances along a parallel (not a great circle), we need to account for the smaller radius.

Distance Calculations Along Meridians
Since all meridians are great circles with the same length, distance calculations are straightforward.
Formula: Distance = (θ/360°) × 2πR
Or more simply: Distance = (θ/360°) × 40,000 km
Where θ is the angular distance in degrees.
Approximation: 1° along a meridian ≈ 111 km (since 40,000 ÷ 360 ≈ 111)
Example 11: Find the distance between two points on the same meridian if their latitudes are 40°N and 10°N. (Use R = 6,400 km)
Solution:
Angular distance = 40° - 10° = 30°

Distance = (θ/360°) × 2πR
= (30/360) × 2 × (22/7) × 6,400
= (1/12) × 2 × (22/7) × 6,400
= (2 × 22 × 6,400)/(12 × 7)
= 281,600/84
= 3,352.38 km

Alternative method:
Distance = 30° × 111 km/degree
= 3,330 km (approximate)

Answer: 3,352.38 km (or approximately 3,330 km)

Example 12: Two towns A and B are on longitude 45°E. A is on latitude 60°N and B is on latitude 30°S. Find the distance between them in kilometers.
Solution:
Angular distance = 60° + 30° = 90°
(Add because on opposite sides of equator)

Distance = (90/360) × 2πR
= (1/4) × 2 × (22/7) × 6,400
= (1/4) × 40,914.29
= 10,228.57 km

Answer: 10,228.57 km

Arc Length Along a Parallel of Latitude

For distances along a parallel of latitude (not along a meridian), we use the radius of that particular latitude.
Formula: Distance = (θ/360°) × 2πr
Where:
θ = difference in longitude
r = R cos(latitude)
Example 13: Two points P and Q are both on latitude 60°N. P is on longitude 20°E and Q is on longitude 80°E. Find the distance between them measured along the parallel of latitude.
Solution:
Latitude = 60°N
Difference in longitude = 80° - 20° = 60°

First find radius of latitude 60°N:
r = R cos 60° r = 6,400 × 0.5
r = 3,200 km

Distance along parallel = (θ/360°) × 2πr
= (60/360) × 2 × (22/7) × 3,200
= (1/6) × 2 × (22/7) × 3,200
= (2 × 22 × 3,200)/(6 × 7)
= 140,800/42
= 3,352.38 km

Answer: 3,352.38 km

Example 14: Two ships A and B are on latitude 45°S. A is on longitude 30°W and B is on longitude 45°W. Find the distance between them along the latitude circle.
Solution:
Difference in longitude = 45° - 30° = 15°

r = R cos 45°
r = 6,400 × 0.7071 r = 4,525.44 km

Distance = (15/360) × 2 × π × 4,525.44
= (15/360) × 2 × 3.142 × 4,525.44
= 0.04167 × 28,418.06
= 1,184.08 km

Answer: 1,184.08 km

Relationship: Distance Along Parallel vs. Along Meridian
For the same angular distance: Distance along parallel = (Distance along meridian) × cos(latitude)
Example 15: The distance between two points on the same meridian is 4,000 km. If they were
on the same parallel at latitude 60°N, what would be the distance for the same angular difference?
Solution:
Distance along parallel = Distance along meridian × cos(latitude)
= 4,000 × cos 60°
= 4,000 × 0.5
= 2,000 km

Answer: 2,000 km

Finding Positions Given Distances
Example 16: A point P is at latitude 40°N, longitude 10°E. Another point Q is 3,330 km due north of P along the same meridian. Find the coordinates of Q.
Solution:
Distance along meridian = 3,330 km Angular distance = 3,330/111 ≈ 30°
Since Q is north of P:
Latitude of Q = 40° + 30° = 70°N Longitude of Q = 10°E (same meridian)

Answer: Q(70°N, 10°E)
Example 17: Two places X and Y are on latitude 60°N. The distance between them along the parallel is 2,000 km. If X is on longitude 20°E, find the longitude of Y (to the east of X).
Solution:
r = R cos 60° = 6,400 × 0.5 = 3,200 km

Circumference of parallel = 2πr
= 2 × 3.142 × 3,200
= 20,108.8 km

Distance corresponds to angle:
θ = (Distance/Circumference) × 360° θ = (2,000/20,108.8) × 360°
θ = 0.0995 × 360°
θ = 35.8°

Longitude of Y = 20° + 35.8° = 55.8°E

Answer: 55.8°E

Practical Applications
Navigation:
Ships and aircraft use latitude and longitude for navigation
GPS systems use these coordinates
Plotting routes and calculating distances
Geography:
Mapping locations
Climate zones (based on latitude)
Time zones (based on longitude)
Communication:
Satellite positioning
Weather forecasting
Emergency location services

EVALUATION
Define the following terms: a) Equator b) Meridian c) Great circle d) Parallel of latitude
What are the coordinates of the North Pole?
Calculate the radius of latitude 30°N if Earth's radius is 6,400 km.
Find the circumference of the parallel of latitude 45°S. (R = 6,400 km)
Two points are on the same meridian at latitudes 50°N and 20°N. Find the angular distance between them.
Find the distance between points A(60°N, 30°E) and B(20°N, 30°E) in kilometers.
Two towns P and Q are on latitude 60°N. P is at 40°E and Q is at 70°E. Find the distance between them along the parallel.
The radius of a parallel of latitude is 4,800 km. Find the latitude. (R = 6,400 km)
What is the approximate distance represented by 1° along a meridian?
Differentiate between a great circle and a small circle.

ASSIGNMENT
Basic Concepts: a) Explain why all meridians are great circles but only the equator is a great circle among parallels. b) Draw a diagram showing the equator, Prime Meridian, and a point at (30°N, 40°E). c) State the coordinates of Lagos (approximately 6.5°N, 3.4°E) and explain what each coordinate means.
Radius and Circumference Calculations: a) Find the radius of the following parallels of latitude: (R = 6,400 km)
0° (Equator) ii) 30°N iii) 60°S iv) 90°N
Calculate the circumference of latitude 50°N.
At what latitude is the radius of the parallel exactly half of Earth's radius?
Distance Problems: a) Find the distance between: i) (30°N, 20°E) and (50°N, 20°E) ii) (40°N, 15°W) and (10°S, 15°W)
Two cities A and B are on the same meridian. A is at 55°N and the distance between them is 5,550 km. Find the possible latitudes of B.
Two points X and Y are on latitude 60°N at longitudes 10°W and 35°E respectively. Calculate: i) The difference in longitude ii) The distance between them along the parallel
Application Problems: a) A ship sails from point P(20°N, 40°E) due north for 4,440 km. Find its new position.
An aircraft flies from A(60°N, 30°W) to B(60°N, 20°E) along the parallel of latitude. Calculate the distance covered.
Two weather stations are 3,200 km apart on the same parallel of latitude at 45°S. If one station is at longitude 120°E, find the longitude of the other station.
Challenge Problem: Three towns A, B, and C are located as follows:
A is at (0°, 30°E)
B is at (60°N, 30°E)
C is at (60°N, 60°E)
Calculate: a) The distance from A to B b) The distance from B to C c) If you travel from A to C, which route is shorter: A→B→C or directly from A to C along a great circle? (Hint: For the direct route, you'll need to consider great circle distance, which is more complex)

WEEK 10: LONGITUDE AND LATITUDE II
CONTENT
Distance Between Two Points on Earth
We've learned how to calculate distances when points are on:
The same meridian (same longitude)
The same parallel (same latitude) Now we'll look at more complex situations. Summary of Methods:
Case 1: Same Meridian (Same Longitude)
Distance = (Difference in latitude/360°) × 2πR Distance ≈ (Difference in latitude) × 111 km
Case 2: Same Parallel (Same Latitude)
r = R cos(latitude)
Distance = (Difference in longitude/360°) × 2πr

Case 3: Different Meridian and Latitude (Great Circle Distance) Uses more complex formulas (spherical trigonometry) - typically covered in advanced courses.

Detailed Examples of Distance Calculations
Example 1: Calculate the distance between Cape Town (34°S, 18°E) and Nairobi (1°S, 37°E) if both cities were on the same meridian. (R = 6,400 km)
Solution: Note: For this problem, we're asked to calculate as if they were on the same meridian, even though they're not in reality.
Difference in latitude = 34° - 1° = 33°

Distance = (33/360) × 2πR
= (33/360) × 2 × (22/7) × 6,400
= (33/360) × 40,228.57
= 0.0917 × 40,228.57
= 3,688 km

Answer: 3,688 km
Example 2: Two places P and Q are on latitude 50°N. P is at longitude 80°W and Q is at longitude 30°E. Find the distance between them: a) Along the parallel of latitude b) If they were on the equator with the same longitude difference
Solution:
Along parallel at 50°N:
Difference in longitude = 80° + 30° = 110° (Add when one is West and other is East)

r = R cos 50°
r = 6,400 × 0.643 r = 4,115.2 km

Distance = (110/360) × 2πr
= (110/360) × 2 × 3.142 × 4,115.2
= 0.3056 × 25,876.9
= 7,908 km

Along equator (if same longitude difference):
R_equator = 6,400 km (no cosine factor)

Distance = (110/360) × 2π × 6,400
= 0.3056 × 40,212.8
= 12,289 km

Answer: a) 7,908 km b) 12,289 km

Example 3: Town A is at (35°N, 40°E) and town B is at (35°N, 70°W). Find the shorter distance between them along the parallel of latitude.
Solution:
Both are at 35°N but one is East and one is West.

Longitude difference (going east/west):
Option 1: 40° + 70° = 110° (going westward from A)
Option 2: 360° - 110° = 250° (going eastward from A) Shorter route = 110°
r = R cos 35°
r = 6,400 × 0.819 r = 5,241.6 km

Distance = (110/360) × 2πr
= (110/360) × 2 × 3.142 × 5,241.6
= 0.3056 × 32,917.89
= 10,060 km

Answer: 10,060 km
Introduction to Time Calculations The Earth rotates 360° in 24 hours. Key Relationships:
360° = 24 hours
15° = 1 hour (since 360 ÷ 24 = 15)
1° = 4 minutes (since 60 ÷ 15 = 4)
1' (1 minute of arc) = 4 seconds of time Direction of Rotation: Earth rotates from West to East Consequences:
Places to the East experience sunrise/noon/sunset earlier
Places to the West experience these events later
When it's noon at one location, places to the east have already passed noon (afternoon), while places to the west haven't reached noon yet (morning)

Time Difference Between Two Places
Formula: Time difference = (Difference in longitude) × 4 minutes Or: Time difference = (Difference in longitude) ÷ 15 hours Important Rule:
If place B is East of place A, time at B is ahead (later)
If place B is West of place A, time at B is behind (earlier)
Example 4: Find the time difference between two places on longitudes 45°E and 75°E.
Solution:
Difference in longitude = 75° - 45° = 30°

Time difference = 30° × 4 minutes
= 120 minutes
= 2 hours

Answer: 2 hours (75°E is 2 hours ahead of 45°E)

Example 5: If it is 2:00 PM at longitude 30°E, what is the time at longitude 60°E?
Solution:
Difference = 60° - 30° = 30°
Time difference = 30° × 4 = 120 minutes = 2 hours Since 60°E is east of 30°E, it is ahead.
Time at 60°E = 2:00 PM + 2 hours = 4:00 PM

Answer: 4:00 PM

Example 6: When it is 9:00 AM Monday at 15°W, what is the time and day at 45°E?
Solution:
Difference = 15° + 45° = 60°
(Add when one is West and other is East)

Time difference = 60° × 4 = 240 minutes = 4 hours 45°E is east of 15°W, so time is ahead.
Time at 45°E = 9:00 AM + 4 hours = 1:00 PM Monday

Answer: 1:00 PM Monday

Example 7: If it is 6:30 PM Tuesday at longitude 120°E, find the time and day at longitude 30°W.
Solution:
Difference = 120° + 30° = 150°

Time difference = 150° × 4 = 600 minutes = 10 hours 30°W is west of 120°E, so time is behind.
Time at 30°W = 6:30 PM - 10 hours = 8:30 AM Tuesday

Answer: 8:30 AM Tuesday

Greenwich Mean Time (GMT)
Greenwich Mean Time (GMT) or Universal Time Coordinated (UTC) is the time at the Prime Meridian (0° longitude) in Greenwich, London.
Purpose:
International time standard
Reference for all time zones
Used in aviation, shipping, and international communication
Time Zones: The world is divided into time zones, each generally 15° of longitude wide.

Example 8: If GMT is 10:00 AM, what is the local time at: a) 30°E b) 75°W
Solution:
At 30°E:
Time difference = 30° × 4 = 120 minutes = 2 hours 30°E is ahead of GMT.
Local time = 10:00 AM + 2 hours = 12:00 noon

At 75°W:
Time difference = 75° × 4 = 300 minutes = 5 hours 75°W is behind GMT.
Local time = 10:00 AM - 5 hours = 5:00 AM

Answer: a) 12:00 noon b) 5:00 AM

Example 9: A plane leaves London (0°) at 8:00 AM GMT and flies to Lagos (15°E). If the flight takes 6 hours, at what local time does it arrive in Lagos?
Solution:
Arrival time in GMT = 8:00 AM + 6 hours = 2:00 PM GMT

Time difference between Lagos and London:
15° × 4 = 60 minutes = 1 hour Lagos is ahead of GMT by 1 hour.
Local arrival time in Lagos = 2:00 PM + 1 hour = 3:00 PM

Answer: 3:00 PM

International Date Line
The International Date Line is an imaginary line approximately along longitude 180°, where the date changes.
Properties:
Located in the Pacific Ocean
Deviates to avoid land masses
When crossing from West to East, you subtract one day
When crossing from East to West, you add one day
Example 10: A ship crosses the International Date Line from east to west on Monday at 3:00 PM. What is the day and time immediately after crossing?
Solution:
Crossing from east to west: Add one day

Day and time after crossing: Tuesday, 3:00 PM

Answer: Tuesday, 3:00 PM

Nautical Miles
A nautical mile is a unit of distance used in navigation.
Definition:
1 nautical mile = distance corresponding to 1 minute of arc (1') along a great circle
1 nautical mile ≈ 1.852 km
1° = 60 nautical miles (since 1° = 60')
Relationship: Along a meridian:
Distance in nautical miles = Angular distance in minutes
Example 11: Two ships are on the same meridian at latitudes 35°N and 37°30'N. Find the distance between them in: a) Nautical miles b) Kilometers
Solution:
Angular distance = 37°30' - 35°00' = 2°30'
Convert to minutes: 2°30' = (2 × 60) + 30 = 150'

Distance = 150 nautical miles

Distance in km = 150 × 1.852
= 277.8 km

Answer: a) 150 nautical miles b) 277.8 km

Example 12: How many nautical miles is 1° 15' 30"?
Solution:
Convert to minutes:
1° = 60'
15' = 15'
30" = 30/60 = 0.5'

Total = 60 + 15 + 0.5 = 75.5'

Distance = 75.5 nautical miles

Answer: 75.5 nautical miles

Speed Calculations
Knots: Speed in nautical miles per hour.
1 knot = 1 nautical mile per hour
Example 13: A ship travels 240 nautical miles in 6 hours. Find its speed in: a) Knots b) Kilometers per hour
Solution:
Speed = Distance/Time
= 240/6
= 40 knots

Speed in km/h = 40 × 1.852
= 74.08 km/h

Answer: a) 40 knots b) 74.08 km/h

Example 14: An aircraft flies from P(40°N, 20°E) to Q(40°N, 50°E) at a speed of 500 km/h. How long does the journey take?
Solution:
Difference in longitude = 50° - 20° = 30°

r = R cos 40°
r = 6,400 × 0.766 r = 4,902.4 km

Distance = (30/360) × 2πr
= (30/360) × 2 × 3.142 × 4,902.4
= 0.0833 × 30,796.5
= 2,566 km

Time = Distance/Speed
= 2,566/500
= 5.13 hours
= 5 hours 8 minutes

Answer: 5 hours 8 minutes

Combined Problems
Example 15: A ship leaves port A(60°N, 40°W) and sails due south to port B on the equator. It then sails due east along the equator to port C at longitude 20°E. Calculate: a) Distance from A to B b) Distance from B to C c) Total distance
Solution:
From A to B (along meridian from 60°N to 0°):
Angular distance = 60°

Distance = 60° × 111 km
= 6,660 km

From B to C (along equator):
B is at (0°, 40°W) C is at (0°, 20°E)
Difference = 40° + 20° = 60° Distance = (60/360) × 2πR
= (60/360) × 40,212.8
= 6,702 km

Total distance:
Total = 6,660 + 6,702 = 13,362 km

Answer: a) 6,660 km b) 6,702 km c) 13,362 km

Example 16: An aircraft leaves Lagos (6°30'N, 3°30'E) at 6:00 AM local time on Monday and flies for 5 hours to London (51°30'N, 0°). Calculate: a) The time difference between Lagos and London b) The arrival time in London (local time) c) The GMT at departure
Solution:
Longitude difference = 3°30' - 0° = 3°30'
Convert to minutes: 3.5° × 4 = 14 minutes Lagos is ahead of London by 14 minutes.
Arrival time:
Departure (Lagos time): 6:00 AM Monday Flight time: 5 hours
Arrival (Lagos time): 11:00 AM Monday

London is 14 minutes behind Lagos.
Arrival (London time) = 11:00 AM - 14 minutes
= 10:46 AM Monday

GMT at departure:
Lagos time: 6:00 AM
GMT = 6:00 AM - 14 minutes = 5:46 AM

Answer: a) 14 minutes b) 10:46 AM Monday c) 5:46 AM GMT

Practical Applications
Aviation:
Flight planning and scheduling
Time zone calculations for arrivals
Fuel calculations based on distances
Shipping:
Navigation using nautical miles
Route planning
Arrival time predictions
Communication:
Scheduling international meetings
Broadcasting times
Satellite communication
Tourism:
Understanding jet lag
Planning itineraries across time zones
Hotel bookings and check-in times

EVALUATION
Find the time difference between places at 45°E and 90°E.
If it is 3:00 PM at 60°W, what is the time at 30°E?
When GMT is 12:00 noon, what is the local time at 75°E?
Two ships are on the same meridian at latitudes 30°15'N and 28°45'N. Find the distance between them in nautical miles.
Convert 120 nautical miles to kilometers.
A plane flies from A(20°N, 40°E) to B(20°N, 70°E) at 600 km/h. How long does the journey take?
What is the time at 150°W when it is 6:00 PM Monday at 30°E?
Find the distance along the equator between longitudes 20°W and 50°E in kilometers.
A ship travels at 25 knots for 8 hours. How far does it travel in kilometers?
If you cross the International Date Line from west to east on Friday at 2:00 PM, what is the day and time after crossing?

ASSIGNMENT
Time Calculations: a) Find the time difference between the following pairs of longitudes: i) 15°E and 45°E ii) 30°W and 60°E iii) 120°E and 150°W
b) If it is 8:30 AM Wednesday at 75°W, find the time and day at: i) 45°E ii) 165°W iii) 0° (GMT)
Distance Problems: a) Calculate the distance in both kilometers and nautical miles between: i) (25°30'N, 10°E) and (32°45'N, 10°E) ii) Points on the equator at 40°W and 20°E
b) Two places X and Y are on latitude 45°N. X is at 30°W and Y is at 15°E. Find: i) The distance between them along the parallel ii) The time difference iii) If it's noon at X, what time is it at Y?
Speed and Time: a) A ship sails from P(0°, 20°W) due east along the equator at 30 knots. How long will it take to reach Q(0°, 40°E)?
b) An aircraft leaves city A(30°N, 45°E) at 10:00 AM local time and arrives at city B(30°N, 90°E) at 2:00 PM local time. Calculate: i) The time difference between the cities ii) The actual flight time iii) The distance covered iv) The average speed of the aircraft
GMT Problems: a) A conference call is scheduled for 3:00 PM GMT. What is the local time for participants in: i) Lagos (15°E) ii) New York (75°W) iii) Tokyo (135°E)
b) A football match starts at 8:00 PM in London (0°). At what local time can fans watch it live in: i) Abuja (7.5°E) ii) Los Angeles (120°W)
Complex Navigation Problem: A ship leaves port X at (60°N, 30°W) at 6:00 AM local time on Monday. It sails:
First leg: Due south to the equator (takes 2 days at 15 knots)
Second leg: Due east along the equator for 4,000 km (at 20 knots)
Third leg: Due north to latitude 45°N
Calculate: a) The position after the first leg b) Time taken for the second leg c) The position after the second leg d) Distance for the third leg e) Final position f) The day and local time of arrival at the final destination g) The total journey time

WEEK 11: BINARY OPERATIONS
CONTENT
Definition of Binary Operation
A binary operation is a rule that combines any two elements from a set to produce another element (usually from the same set).
Notation: Usually denoted by symbols like *, ∗ , ⊕, ⊗ , #, △, etc.
General Form: If * is a binary operation on set S, then for any a, b ∈ S: a * b = result Examples of Common Binary Operations:
Addition (+): a + b
Subtraction (−): a − b
Multiplication (×): a × b
Division (÷): a ÷ b (not defined for b = 0)
Example 1: Define a binary operation * on the set of integers by: a * b = a + 2b
Evaluate: a) 3 * 4 b) 5 * 2
Solution:
a) 3 * 4 = 3 + 2(4) = 3 + 8 = 11

b) 5 * 2 = 5 + 2(2) = 5 + 4 = 9

Answer: a) 11 b) 9
Example 2: If a ⊕ b = 2a − b, find: a) 6 ⊕ 3 b) (4 ⊕ 2) ⊕ 5
Solution:
a) 6 ⊕ 3 = 2(6) − 3 = 12 − 3 = 9

b) First find 4 ⊕ 2:
4 ⊕ 2 = 2(4) − 2 = 8 − 2 = 6

Then find 6 ⊕ 5:
6 ⊕ 5 = 2(6) − 5 = 12 − 5 = 7
Answer: a) 9 b) 7

Properties of Binary Operations
Closure Property
A set S is closed under operation * if: For all a, b ∈ S, then a * b ∈ S
Example 3: Check if the set of natural numbers N = {1, 2, 3, ...} is closed under: a) Addition b) Subtraction
Solution:
Addition:
For any natural numbers a and b, a + b is also a natural number. Example: 3 + 5 = 8 ∈ N
Closed under addition

Subtraction:
5 − 8 = −3 ∉	N (not a natural number)
✗ Not closed under subtraction

Example 4: Is the operation a * b = a² + b² closed on the set {0, 1, 2}?
Solution: Check all possible combinations:
0 * 0 = 0² + 0² = 0 ✓
0 * 1 = 0² + 1² = 1 ✓
0 * 2 = 0² + 2² = 4 ✗ (4 is not in the set)
Since 0 * 2 = 4 ∉ {0, 1, 2}, not closed.

Commutative Property
An operation * is commutative if: a * b = b * a for all a, b in the set
Example 5: Check if the operation a * b = a + 2b is commutative.
Solution:
Test with a = 3, b = 4:

a * b = 3 + 2(4) = 11
b * a = 4 + 2(3) = 10

Since 11 ≠ 10, not commutative.

Example 6: Is multiplication commutative on real numbers?
Solution:
For any real numbers a and b: a × b = b × a

Example: 3 × 5 = 15 and 5 × 3 = 15 Yes, multiplication is commutative.

Associative Property
An operation * is associative if: (a * b) * c = a * (b * c) for all a, b, c in the set
Example 7: Check if a * b = a + b + 1 is associative.
Solution:
Test with a = 2, b = 3, c = 4:

(a * b) * c:
First: 2 * 3 = 2 + 3 + 1 = 6
Then: 6 * 4 = 6 + 4 + 1 = 11

a * (b * c):
First: 3 * 4 = 3 + 4 + 1 = 8
Then: 2 * 8 = 2 + 8 + 1 = 11

Since both equal 11, this suggests it's associative.

To prove it's associative generally:
(a * b) * c = (a + b + 1) * c
= (a + b + 1) + c + 1
= a + b + c + 2

a * (b * c) = a * (b + c + 1)
= a + (b + c + 1) + 1
= a + b + c + 2

They're equal, so it's associative. ✓

Example 8: Is subtraction associative?
Solution:
Test with a = 10, b = 5, c = 2:

(10 − 5) − 2 = 5 − 2 = 3
10 − (5 − 2) = 10 − 3 = 7

Since 3 ≠ 7, subtraction is not associative.

Distributive Property
Operation * distributes over operation ⊕ if: a * (b ⊕ c) = (a * b) ⊕ (a * c) Example 9: Does multiplication distribute over addition?
Solution:
For any numbers a, b, c:

a × (b + c) = ab + ac

Example: 3 × (4 + 5) = 3 × 9 = 27
(3 × 4) + (3 × 5) = 12 + 15 = 27 ✓

Yes, multiplication distributes over addition.

Identity Element
An element e is an identity element for operation * if: a * e = e * a = a for all a in the set
Example 10: Find the identity element for: a) Addition on real numbers b) Multiplication on real numbers
Solution:
For addition: a + e = a Therefore e = 0

Identity element for addition is 0.

For multiplication: a × e = a Therefore e = 1

Identity element for multiplication is 1.

Example 11: Find the identity element for a * b = a + b − 3.
Solution:
We need: a * e = a

a + e − 3 = a e − 3 = 0
e = 3

Check: a * 3 = a + 3 − 3 = a ✓
3 * a = 3 + a − 3 = a ✓

Identity element is 3.

Inverse Element
For an element a, its inverse (denoted a⁻¹) satisfies: a * a⁻¹ = a⁻¹ * a = e (where e is the identity element)
Example 12: Find the inverse of 5 under: a) Addition (identity = 0) b) Multiplication (identity = 1)
Solution:
Under addition: 5 + x = 0
x = −5

Inverse of 5 is −5.

Under multiplication: 5 × x = 1
x = 1/5

Inverse of 5 is 1/5.

Example 13: For the operation a * b = a + b + 2, identity element is −2. Find the inverse of 5.
Solution:
We need: 5 * x = −2

5 + x + 2 = −2
x + 7 = −2
x = −9

Check: 5 * (−9) = 5 + (−9) + 2 = −2 ✓

Inverse of 5 is −9.
Creating Operation Tables
An operation table shows the results of applying a binary operation to all pairs of elements in a finite set.
Example 14: Construct the operation table for a * b = (a + b) mod 4 on the set {0, 1, 2, 3}.
Solution:
* | 0	1	2	3
 	|
0 | 0	1	2	3
1 | 1	2	3	0
2 | 2	3	0	1
3 | 3	0	1	2

Observations:
Closure: All results are in {0, 1, 2, 3} ✓
Identity: 0 is the identity element (first row and column) ✓
Every element has an inverse ✓
Commutative: Table is symmetric about main diagonal ✓

Example 15: For the set {1, 2, 3, 4} with operation a * b = LCM(a, b), construct the table.
Solution:
* | 1	2	3	4
 	|
1 | 1	2	3	4
2 | 2	2	6	4
3 | 3	6	3 12
4 | 4	4 12	4

Observations:
Not closed (6 and 12 are not in the set) ✗
Identity: 1 is the identity ✓
Commutative: symmetric ✓

Solving Equations with Binary Operations Example 16: If a * b = 2a + b, solve for x in: x * 5 = 17 Solution:
x * 5 = 17
2x + 5 = 17
2x = 12
x = 6
Answer: x = 6
Example 17: Given a ⊕ b = a² − b, solve: a) x ⊕ 3 = 13 b) 2 ⊕ y = −2
Solution:
a) x ⊕ 3 = 13 x² − 3 = 13 x² = 16
x = ±4

b) 2 ⊕ y = −2 2² − y = −2 4 − y = −2 y = 6

Answer: a) x = ±4 b) y = 6

Example 18: If p * q = p + q + pq, find x such that x * 2 = 10.
Solution:
x * 2 = 10
x + 2 + 2x = 10 3x + 2 = 10
3x = 8
x = 8/3

Answer: x = 8/3 or 2⅔

Composite Operations
Example 19: If a * b = a + b and a ⊕ b = a − b, find: a) (3 * 4) ⊕ 2 b) 5 * (6 ⊕ 2)
Solution:
First find 3 * 4: 3 * 4 = 3 + 4 = 7

Then: 7 ⊕ 2 = 7 − 2 = 5

First find 6 ⊕ 2: 6 ⊕ 2 = 6 − 2 = 4

Then: 5 * 4 = 5 + 4 = 9

Answer: a) 5 b) 9
Example 20: Define a * b = 2a − b and a # b = ab. Evaluate: (4 * 3) # (2 * 1)
Solution:
First find 4 * 3:
4 * 3 = 2(4) − 3

Then find 2 * 1:=8−3= 52 * 1 = 2(2) − 1=4−1= 3Finally: 5 # 3 =5×3=15Answer: 15

Real-Life Applications
Computer Science:
Boolean operations (AND, OR, XOR)
Set operations (union, intersection)
Database queries
Cryptography:
Modular arithmetic
Encryption algorithms
Digital Electronics:
Logic gates
Binary arithmetic
Example 21: In digital logic, the XOR (exclusive OR) operation is defined by:
a XOR b | 0	1
 	|
0| 011| 10Properties:
Commutative: a XOR b = b XOR a ✓
Associative: (a XOR b) XOR c = a XOR (b XOR c) ✓
Identity: 0 (since a XOR 0 = a) ✓
Every element is its own inverse: a XOR a = 0 ✓
Proving Properties Algebraically
Example 22: Prove that the operation a * b = a + b − 1 is commutative.
Proof:
We need to show: a * b = b * a LHS: a * b = a + b − 1
RHS: b * a = b + a − 1
= a + b − 1 (by commutativity of addition) Since LHS = RHS, the operation is commutative. ✓

Example 23: Prove that a * b = √(ab) is associative on positive real numbers.
Proof:
We need: (a * b) * c = a * (b * c)

LHS: (a * b) * c = (√(ab)) * c
= √(√(ab) × c)
= √(c√(ab))
= (abc)^(1/4) × c^(1/4)
= (ab)^(1/4) × c^(1/2) Actually, let me recalculate:
LHS: (√(ab)) * c = √(√(ab) × c)

Let's use a different approach:
(a * b) * c = √(ab) * c = √(√(ab) · c) = (abc)^(1/4) · c^(1/4) = (abc²)^(1/4)

RHS: a * (b * c) = a * √(bc) = √(a · √(bc)) = (a²bc)^(1/4) These are not equal in general, so NOT associative. ✗

EVALUATION
1.	If a * b = a + 2b − 1, find: a) 3 * 4 b) 5 * 2
Given p ⊕ q = p² + q, evaluate (2 ⊕ 3) ⊕ 1.
Check if the operation a * b = ab − a − b is commutative.
Find the identity element for a * b = a + b + 3.
If a * b = 2a − b and the identity element is 0, find the inverse of 4.
Solve for x: x * 3 = 11, where a * b = 2a + b.
Is the set {0, 1, 2} closed under a * b = a + b?
Check if a * b = a + b − ab is associative using a = 1, b = 2, c = 3.
Construct an operation table for a * b = max(a, b) on {1, 2, 3}.
If a # b = ab + a + b, find x such that 2 # x = 14.

ASSIGNMENT
Basic Operations: a) Define a * b = 3a − 2b. Evaluate: i) 4 * 5 ii) (6 * 2) * 3 iii) 6 * (2 * 3)
b) If p ⊕ q = p² − q², find: i) 5 ⊕ 3 ii) (4 ⊕ 2) ⊕ 1
Properties: a) For each operation, check if it is commutative and associative: i) a * b = a + b + ab ii) a * b = |a −
b| iii) a * b = a²b
b) Prove algebraically that a * b = 2a + 2b − 3 is commutative.
Identity and Inverse: a) Find the identity element for: i) a * b = a + b − 5 ii) a * b = 3a + 3b iii) a * b = ab/2
b) For a * b = a + b + 2 with identity −2, find the inverse of: i) 3 ii) −5 iii) 0
Equation Solving: Solve for x: a) x * 4 = 20, where a * b = 2a + b b) 3 * x = 7, where a * b = a² − b c) x * x = 15, where a * b = a + b + ab d) (x * 2) * 3 = 16, where a * b = ab − 1
Operation Tables: a) Construct the operation table for a * b = (a	b) mod 5 on {0, 1, 2, 3, 4}. b) From your table, identify: i) Is it closed? ii) What is the identity element? iii) Which elements have inverses? iv) Is it commutative?
Application Problem: In a computer system, a binary operation ⊕ (XOR) is defined on {0, 1}:

0 ⊕0=00 ⊕1=11 ⊕0=11 ⊕1=0Construct the complete operation table b) Verify that it's commutative c) Verify that it's associative by testing all cases d) Find the identity element e) Find the inverse of each element f) Evaluate: (1 ⊕ 0) ⊕ (1 ⊕ 1)

WEEK 12: ARITHMETIC OF FINANCE
CONTENT
Simple Interest
Simple interest is interest calculated only on the principal amount.
Formula: I = (PRT)/100
or
I = PRT (when R is expressed as a decimal) Where:
I = Interest
P = Principal (initial amount)
R = Rate per annum (% per year)
T = Time (in years)
Amount: A = P + I
or
A = P(1 + RT/100)

Example 1: Find the simple interest on ₦50,000 for 3 years at 8% per annum.
Solution:
P = ₦50,000 R = 8%
T = 3 years

I = PRT/100
I = (50,000 × 8 × 3)/100 I = 1,200,000/100
I = ₦12,000

Answer: ₦12,000

Example 2: A man borrows ₦80,000 at 5% simple interest per annum. How much will he repay after 4 years?
Solution:
P = ₦80,000 R = 5%
T = 4 years

I = (80,000 × 5 × 4)/100 I = 1,600,000/100
I = ₦16,000

Amount = P + I
= 80,000 + 16,000
= ₦96,000

Answer: ₦96,000

Example 3: At what rate will ₦2,500 amount to ₦3,000 in 4 years at simple interest?
Solution:
P = ₦2,500 A = ₦3,000
I = 3,000 − 2,500 = ₦500
T = 4 years

I=PRT/100500=(2,500 × R × 4)/100500=10,000R/100500=100RR =5%
Answer: 5% per annum

Example 4: How long will it take ₦5,000 to earn ₦1,500 as simple interest at 6% per annum?
Solution:
P = ₦5,000 I = ₦1,500 R = 6%

I=PRT/1001,500=(5,000 × 6 × T)/1001,500=30,000T/1001,500=300TT = 5years
Answer: 5 years
Compound Interest
Compound interest is interest calculated on the principal plus accumulated interest from previous periods.
Formula: A = P(1 + r)ⁿ
Where:
A = Final amount
P = Principal
r = Rate per period (as a decimal: R/100)
n = Number of compounding periods
Compound Interest: CI = A − P = P[(1 + r)ⁿ − 1]

Example 5: Find the compound interest on ₦10,000 for 3 years at 10% per annum compounded annually.
Solution:
P = ₦10,000
R = 10% = 0.10
n = 3 years

A = P(1 + r)ⁿ
A = 10,000(1 + 0.10)³ A = 10,000(1.10)³
A = 10,000(1.331) A = ₦13,310

CI = A − P
CI = 13,310 − 10,000 CI = ₦3,310

Answer: ₦3,310

Example 6: A sum of ₦50,000 is invested at 8% per annum compound interest for 2 years. Find:
a) The amount after 2 years b) The compound interest
Solution:
P = ₦50,000 r = 8% = 0.08
n = 2 years

a) A = 50,000(1.08)² A = 50,000(1.1664)
A = ₦58,320

b) CI = 58,320 − 50,000 CI = ₦8,320

Answer: a) ₦58,320 b) ₦8,320

Comparison: Simple vs. Compound Interest
Example 7: Compare simple and compound interest on ₦100,000 at 10% for 3 years.
Solution:
Simple Interest:
I = (100,000 × 10 × 3)/100 = ₦30,000
Amount = ₦130,000

Compound Interest:
A = 100,000(1.10)³ = 100,000(1.331) = ₦133,100 CI = 133,100 − 100,000 = ₦33,100

Difference = 33,100 − 30,000 = ₦3,100

Compound interest is ₦3,100 more.

Compound Interest with Different Compounding Periods
Interest can be compounded:
Annually: Once per year (n = number of years)
Semi-annually: Twice per year (n = 2 × number of years, r = annual rate ÷ 2)
Quarterly: Four times per year (n = 4 × number of years, r = annual rate ÷ 4)
Monthly: Twelve times per year (n = 12 × number of years, r = annual rate ÷ 12)
Modified Formula: A = P(1 + r/k)^(kt)
Where:
k = number of times compounded per year
t = time in years

Example 8: Find the amount when ₦20,000 is invested at 12% per annum for 2 years compounded: a) Annually b) Semi-annually c) Quarterly
Solution:
a) Annually:
A = 20,000(1 + 0.12)² A = 20,000(1.12)²
A = 20,000(1.2544) A = ₦25,088

b) Semi-annually:Rate per period = 12%÷2=6%Number of periods = 2×2=4
A=20,000(1 + 0.06)⁴A=20,000(1.06)⁴A=20,000(1.2625)A=₦25,250

c) Quarterly:Rate per period = 12%÷4=3%Number of periods = 4×2=8
A=20,000(1 + 0.03)⁸A=20,000(1.03)⁸A=20,000(1.2668)A=₦25,336
Note: More frequent compounding results in higher returns.

Example 9: A bank offers 10% per annum compounded monthly. How much will ₦100,000 grow to in 18 months?
Solution:
P = ₦100,000
Annual rate = 10%
Monthly rate = 10% ÷ 12 = 0.8333% = 0.008333
n = 18 months

A = 100,000(1 + 0.008333)^18 A = 100,000(1.008333)^18
A = 100,000(1.1608) A = ₦116,080

Answer: ₦116,080
Annuities
An annuity is a series of equal payments made at regular intervals.
Types:
Ordinary Annuity: Payments at end of each period
Annuity Due: Payments at beginning of each period Future Value of Ordinary Annuity: FV = P × [(1 + r)ⁿ − 1]/r Where:
FV = Future value
P = Payment per period
r = Interest rate per period
n = Number of periods

Example 10: A person deposits ₦5,000 at the end of each year for 5 years in an account earning 8% per annum. Find the total amount at the end of 5 years.
Solution:
P = ₦5,000
r = 8% = 0.08
n = 5 years

FV = 5,000 × [(1.08)⁵ − 1]/0.08 FV = 5,000 × [(1.4693 − 1)/0.08] FV = 5,000 × [0.4693/0.08]
FV = 5,000 × 5.8666 FV = ₦29,333

Answer: ₦29,333

Present Value of Annuity: PV = P × [1 − (1 + r)^(−n)]/r
Example 11: What is the present value of receiving ₦10,000 annually for 4 years if the interest rate is 6%?
Solution:
P = ₦10,000 r = 6% = 0.06
n = 4 years

PV = 10,000 × [1 − (1.06)^(−4)]/0.06 PV = 10,000 × [1 − 0.7921]/0.06
PV = 10,000 × [0.2079/0.06] PV = 10,000 × 3.465
PV = ₦34,650

Answer: ₦34,650

Depreciation
Depreciation is the decrease in value of an asset over time.
Methods:
Straight-Line Method Equal depreciation each year.
Annual Depreciation = (Cost − Salvage Value)/Useful Life
Example 12: A machine costs ₦500,000 with a salvage value of ₦50,000 after 10 years. Find the annual depreciation.
Solution:
Annual Depreciation = (500,000 − 50,000)/10
= 450,000/10
= ₦45,000 per year

Answer: ₦45,000 per year

Reducing Balance Method (Declining Balance) Depreciation is a constant percentage of the book value.
Formula: V = P(1 − r)ⁿ
Where:
V = Value after n years
P = Original cost
r = Depreciation rate (as decimal)
n = Number of years

Example 13: A car worth ₦2,000,000 depreciates at 15% per annum. Find its value after 3 years.
Solution:
P = ₦2,000,000 r = 15% = 0.15
n = 3 years

V = 2,000,000(1 − 0.15)³
V = 2,000,000(0.85)³ V = 2,000,000(0.6141) V = ₦1,228,200

Answer: ₦1,228,200

Example 14: A laptop depreciates from ₦150,000 to ₦76,545 in 3 years. Find the annual rate of depreciation.
Solution:
P = ₦150,000 V = ₦76,545
n = 3 years

76,545 = 150,000(1 − r)³ (1 − r)³ = 76,545/150,000 (1 − r)³ = 0.5103
(1 − r) = ³√0.5103 (1 − r) = 0.7993
r = 1 − 0.7993
r = 0.2007
r = 20.07%

Answer: Approximately 20% per annum

Amortization
Amortization is the process of paying off a debt through regular payments over time. Each payment covers both interest and part of the principal.
Formula for Payment Amount: PMT = P × [r(1 + r)ⁿ]/[(1 + r)ⁿ − 1]
Where:
PMT = Payment per period
P = Loan amount (principal)
r = Interest rate per period
n = Total number of payments
Example 15: A loan of ₦500,000 is to be repaid over 5 years at 10% per annum with monthly payments. Find the monthly payment.
Solution:
P = ₦500,000
Annual rate = 10%
Monthly rate r = 10%/12 = 0.008333
n = 5 × 12 = 60 months

PMT = 500,000 × [0.008333(1.008333)^60]/[(1.008333)^60 − 1] PMT = 500,000 × [0.008333 × 1.6453]/[1.6453 − 1]
PMT = 500,000 × [0.0137]/[0.6453] PMT = 500,000 × 0.02124
PMT = ₦10,620

Answer: ₦10,620 per month
Amortization Schedule: Shows how each payment is split between interest and principal.

Example 16: Create the first 3 months of an amortization schedule for a ₦100,000 loan at 12% annual interest (1% monthly) to be repaid in 12 months.
Solution:
First, find monthly payment:
P = 100,000
r = 0.01
n = 12

PMT = 100,000 × [0.01(1.01)^12]/[(1.01)^12 − 1] PMT = 100,000 × [0.01 × 1.1268]/[0.1268]
PMT = 100,000 × 0.0889 PMT = ₦8,890

Amortization Schedule:

MonthBeginning BalancePaymentInterest (1%)PrincipalEnding Balance1100,0008,8901,0007,89092,110292,1108,8909217,96984,141384,1418,8908418,04976,092Calculations:
Interest = Beginning Balance × rate
Principal = Payment − Interest
Ending Balance = Beginning Balance – Principal

Real-Life Financial Problems
Example 17: Savings Plan Amina wants to save ₦2,000,000 for her university education in 5 years. If a bank offers 9% per annum compounded annually, how much should she deposit now?
Solution:
A = ₦2,000,000 r = 9% = 0.09
n = 5 years

A = P(1 + r)ⁿ 2,000,000 = P(1.09)⁵
2,000,000 = P(1.5386) P = 2,000,000/1.5386 P = ₦1,299,869
Answer: ₦1,299,869

Example 18: Investment Comparison Which is better:
Option A: ₦100,000 at 12% simple interest for 3 years
Option B: ₦100,000 at 10% compound interest for 3 years
Solution:
Option A (Simple Interest):
I = (100,000 × 12 × 3)/100 = ₦36,000 Amount = 100,000 + 36,000 = ₦136,000

Option B (Compound Interest):
A = 100,000(1.10)³ A = 100,000(1.331) A = ₦133,100

Comparison: Option A yields ₦136,000 Option B yields ₦133,100
Answer: Option A is better by ₦2,900

Example 19: Mortgage Calculation A couple takes a mortgage of ₦10,000,000 at 8% annual interest for 20 years. Calculate: a) Monthly payment b) Total amount paid c) Total interest paid
Solution:
Monthly payment:
P = ₦10,000,000
r = 8%/12 = 0.006667
n = 20 × 12 = 240 months

PMT = 10,000,000 × [0.006667(1.006667)^240]/[(1.006667)^240 − 1] PMT = 10,000,000 × [0.006667 × 4.9268]/[3.9268]
PMT = 10,000,000 × 0.008364 PMT = ₦83,640
Total amount paid:
Total = 83,640 × 240 = ₦20,073,600

Total interest:
Interest = 20,073,600 − 10,000,000 = ₦10,073,600

Answer: a) ₦83,640/month b) ₦20,073,600 c) ₦10,073,600

Example 20: Retirement Savings Bola deposits ₦20,000 at the end of each month for 25 years in a retirement account earning 7% per annum compounded monthly. How much will she have at retirement?
Solution:
P = ₦20,000
r = 7%/12 = 0.005833
n = 25 × 12 = 300 months

FV = 20,000 × [(1.005833)^300 − 1]/0.005833 FV = 20,000 × [(5.8086 − 1)/0.005833]
FV = 20,000 × [4.8086/0.005833] FV = 20,000 × 824.56
FV = ₦16,491,200

Answer: ₦16,491,200

Inflation and Real Value
Real Interest Rate accounts for inflation: Real rate ≈ Nominal rate − Inflation rate
Example 21: If an investment yields 12% per annum but inflation is 8%, what is the real return?
Solution:
Real return = 12% − 8% = 4%

Answer: 4% (real terms)
Example 22: An item costs ₦50,000 today. If inflation is 7% per year, what will it cost in 3 years?
Solution:
Future cost = 50,000(1.07)³
= 50,000(1.2250)
= ₦61,250

Answer: ₦61,250

Investment Analysis
Return on Investment (ROI): ROI = (Gain − Cost)/Cost × 100%
Example 23: An investor buys shares for ₦200,000 and sells them for ₦250,000. Find the ROI.
Solution:
ROI = (250,000 − 200,000)/200,000 × 100%
= 50,000/200,000 × 100%
= 25%

Answer: 25%
Example 24: Break-even Analysis A business invests ₦5,000,000 in equipment. The equipment generates ₦800,000 profit annually. How long to break even if money could earn 10% elsewhere?
Solution:
This requires considering opportunity cost:
Annual profit needed = Investment × opportunity rate
= 5,000,000 × 0.10
= ₦500,000

Actual profit = ₦800,000
Net benefit = 800,000 − 500,000 = ₦300,000 per year

Time to recover investment:
5,000,000/300,000 = 16.67 years

Or simpler (without opportunity cost):
5,000,000/800,000 = 6.25 years

Answer: 6.25 years (simple) or 16.67 years (with opportunity cost)

Nigerian Financial Context
Example 25: Treasury Bills Nigerian Treasury Bills (T-Bills) are short-term government securities. A 91-day T-Bill with face value ₦1,000,000 is issued at a discount rate of 15% per annum. Calculate: a) Purchase price b) Interest earned
Solution:
Purchase price:
Discount for 91 days = (1,000,000 × 15 × 91)/(100 × 365)
= 1,365,000/36,500
= ₦37,397

Purchase price = 1,000,000 − 37,397
= ₦962,603

Interest earned:
Interest = ₦37,397

Answer: a) ₦962,603 b) ₦37,397

Example 26: Fixed Deposit A bank offers 12% per annum on a fixed deposit with quarterly compounding. If ₦500,000 is deposited for 2 years: a) Find the maturity value b) Calculate effective annual rate
Solution:
Maturity value:
P = 500,000
r = 12%/4 = 3% per quarter n = 2 × 4 = 8 quarters

A = 500,000(1.03)⁸ A = 500,000(1.2668)
A = ₦633,400

Effective annual rate:
Effective rate = (1 + 0.03)⁴ − 1
= 1.1255 − 1
= 0.1255 = 12.55%

Answer: a) ₦633,400 b) 12.55%

Practical Tips for Financial Planning
Rule of 72: To estimate doubling time: Years to double ≈ 72/interest rate Example 27: At 9% interest, how long to double an investment?
Solution:
Time ≈ 72/9 = 8 years

Verification:
(1.09)⁸ = 1.9926 ≈ 2 ✓
Power of Compounding:
Example 28: Compare ₦10,000 invested at 10% for:
10 years
20 years
30 years
Solution:
10 years: 10,000(1.10)^10 = ₦25,937
20 years: 10,000(1.10)^20 = ₦67,275
30 years: 10,000(1.10)^30 = ₦174,494

Starting early makes a huge difference!

EVALUATION
Find the simple interest on ₦25,000 for 4 years at 6% per annum.
Calculate the compound interest on ₦40,000 for 3 years at 8% per annum.
Which gives more interest: ₦100,000 at 10% simple interest for 3 years, or ₦100,000 at 8% compound interest for 3 years?
A car worth ₦3,000,000 depreciates at 20% per annum. Find its value after 2 years.
Find the annual depreciation of a machine costing ₦800,000 with salvage value ₦80,000 after 10 years (straight-line method).
How much should be deposited now at 12% compound interest to have ₦500,000 in 4 years?
Find the monthly payment on a loan of ₦200,000 at 18% per annum for 2 years.
A person deposits ₦5,000 monthly for 3 years at 9% per annum. Find the total amount.
An investment of ₦150,000 grows to ₦180,000 in 2 years. Find the annual compound interest rate.
Using the Rule of 72, estimate how long it takes money to double at 8% interest.

ASSIGNMENT
Simple and Compound Interest: a) Calculate the simple interest on ₦75,000 for 5 years at 7.5% per annum.
Find the compound interest on ₦60,000 for 2 years at 10% per annum compounded: i) Annually ii) Semi- annually iii) Quarterly
A sum of money doubles itself in 8 years at simple interest. Find the rate of interest.
At what compound interest rate will ₦50,000 amount to ₦66,550 in 3 years?
Depreciation: a) A laptop costs ₦200,000 and depreciates at 25% per annum. Find: i) Value after 3 years ii)
Total depreciation after 3 years
A machine depreciates from ₦500,000 to ₦320,000 in 2 years. Calculate: i) The annual rate of depreciation ii) Its value after 5 years
Using straight-line depreciation, a vehicle costing ₦5,000,000 has salvage value ₦500,000 after 8 years. Find: i) Annual depreciation ii) Book value after 5 years
Annuities and Savings: a) Tunde saves ₦10,000 at the end of each month for 4 years at 12% per annum compounded monthly. Calculate the total amount saved.
A woman wants to accumulate ₦5,000,000 in 10 years for her child's education. If she can invest at 11% per annum, how much should she deposit: i) As a lump sum now? ii) Monthly for 10 years?
What is the present value of receiving ₦50,000 annually for 6 years at 8% discount rate?
Loan and Mortgage: a) A car loan of ₦2,500,000 is taken at 15% per annum for 5 years. i) Calculate the monthly payment ii) Find total amount repaid iii) Calculate total interest paid
Create an amortization schedule for the first 4 months of a ₦500,000 loan at 18% per annum (1.5% monthly) for 2 years.
A mortgage of ₦8,000,000 at 9% for 15 years requires what monthly payment?
Investment Analysis: a) Compare these two investment options for ₦1,000,000:
Option A: 13% simple interest for 4 years
Option B: 11% compound interest for 4 years (annually) Which is better and by how much?
b) A business investment of ₦3,000,000 generates these annual profits: Year 1: ₦400,000 Year 2: ₦600,000 Year 3: ₦800,000 Year 4: ₦900,000
Calculate: i) Total profit over 4 years ii) Average annual ROI iii) Is this better than investing at 12% compound interest?
Real-World Applications: a) A Treasury Bill with 182-day maturity and face value ₦5,000,000 is offered at 14% discount rate. Calculate: i) Purchase price ii) Interest earned iii) Effective yield
Inflation is running at 10% per year. If your salary is ₦500,000 per year: i) What will you need to earn in 3 years to maintain the same purchasing power? ii) If you get 8% annual raises, what is your real income change?
You invest ₦250,000 in a business. After 3 years, you sell your stake for ₦400,000. Calculate: i) Total return ii) Annual compound return rate iii) If you had invested at 15% compound interest instead, would you have earned more or less?
Challenge Problem: Chioma has ₦2,000,000 to invest. She has three options:
Option 1: Fixed deposit at 12% per annum for 5 years (compound interest, annual)
Option 2: Buy equipment for ₦2,000,000 that generates ₦600,000 annual profit but depreciates at 15% per year
Option 3: Invest ₦500,000 in each of 4 different businesses:
Business A: 20% return per year for 5 years
Business B: Loses 10% first year, then 25% return for next 4 years
Business C: 15% return compounded quarterly
Business D: Simple interest at 18% per year
Calculate the final value for each option after 5 years and recommend the best investment strategy.
SS3 MATHEMATICS LESSON NOTES
SECOND TERM
WEEK 1: REVIEW OF FIRST TERM WORK & FINANCIAL MATHEMATICS
CONTENT
Introduction to Advanced Financial Concepts
Building on first term's work on simple interest, compound interest, and depreciation, we now explore more sophisticated financial instruments used in the real world.
Bonds and Debentures
Bonds
A bond is a debt security where the investor lends money to an entity (government or corporation) for a defined period at a fixed interest rate.
Key Terms:
Face Value (Par Value): The amount the bond will be worth at maturity
Coupon Rate: The annual interest rate paid on the bond
Maturity Date: When the principal is repaid
Current Yield: Annual interest ÷ Current market price
Example 1: A government bond has face value ₦100,000, coupon rate 12% per annum, and matures in 5 years. Calculate: a) Annual interest payment b) Total interest over the life of the bond
Solution:
Annual interest = Face value × Coupon rate
= 100,000 × 12%
= 100,000 × 0.12
= ₦12,000 per year

Total interest = Annual interest × Number of years
= 12,000 × 5
= ₦60,000

Answer: a) ₦12,000 per year b) ₦60,000
Example 2: A bond with face value ₦50,000 and 10% coupon rate is selling at ₦45,000. Find the current yield.
Solution:
Annual interest = 50,000 × 10% = ₦5,000

Current yield = (Annual interest / Market price) × 100%
= (5,000 / 45,000) × 100%
= 11.11%

Answer: 11.11%

Debentures
A debenture is an unsecured debt instrument backed only by the creditworthiness of the issuer, not by physical assets.
Characteristics:
No collateral required
Fixed interest rate
Priority over shareholders in case of liquidation
Lower interest rates than secured bonds (generally)
Example 3: A company issues debentures worth ₦5,000,000 at 8% per annum for 10 years. Calculate: a) Annual interest payment b) Total repayment at maturity
Solution:
Annual interest = 5,000,000 × 8%
= ₦400,000

Total repayment = Principal + Total interest
= 5,000,000 + (400,000 × 10)
= 5,000,000 + 4,000,000
= ₦9,000,000

Answer: a) ₦400,000 b) ₦9,000,000

Shares and Dividends
Shares represent ownership in a company.
Types of Shares:
Ordinary Shares (Common Stock)
Voting rights
Dividends not guaranteed
Last to be paid in liquidation
Higher potential returns
Preference Shares (Preferred Stock)
Fixed dividend rate
Priority over ordinary shares
Usually no voting rights
Lower risk, lower returns
Key Terms:
Nominal Value (Par Value): Face value of share
Market Value: Current trading price
Dividend: Portion of profits paid to shareholders
Dividend Yield: (Dividend per share / Market price) × 100%

Example 4: An investor buys 500 shares at ₦40 per share. The company declares a dividend of
₦3 per share. Calculate: a) Total investment b) Total dividend received c) Dividend yield
Solution:
Total investment = 500 × 40 = ₦20,000

Total dividend = 500 × 3 = ₦1,500

Dividend yield = (3 / 40) × 100%
= 7.5%

Answer: a) ₦20,000 b) ₦1,500 c) 7.5%

Example 5: A company with 1,000,000 shares of ₦10 nominal value declares 15% dividend. If you own 2,000 shares, how much dividend do you receive?
Solution:
Dividend per share = Nominal value × Dividend rate
= 10 × 15%
= ₦1.50

Total dividend = 2,000 × 1.50
= ₦3,000

Answer: ₦3,000

Example 6: Shares with nominal value ₦50 are quoted at ₦65. The company pays 20% dividend. Find: a) Dividend per share b) Rate of return on investment
Dividend per share = 50 × 20%
= ₦10

Rate of return = (Dividend / Market price) × 100%
= (10 / 65) × 100%
= 15.38%

Answer: a) ₦10 b) 15.38%

Income Tax
Income tax is a percentage of income paid to the government.
Nigerian Tax System:
Personal Income Tax:
Tax-free allowance (first portion not taxed)
Progressive tax rates (higher income = higher rate)
Tax Relief: Various allowances reduce taxable income:
Consolidated Relief Allowance
Dependent allowances
Life insurance relief
National Housing Fund relief
Basic Formula:
Gross Income
- Allowable deductions
= Taxable Income
× Tax rate
= Tax payable

Example 7: A worker earns ₦3,600,000 per year. The first ₦300,000 is tax-free, and tax is charged at:
7% on next ₦300,000
11% on next ₦500,000
15% on next ₦500,000
19% on next ₦1,600,000
21% on remainder Calculate the total tax payable.
Taxable income = 3,600,000 - 300,000 = ₦3,300,000

Tax calculation:
On first 300,000: 300,000 × 7% = ₦21,000
On next 500,000:	500,000 × 11% = ₦55,000
On next 500,000:	500,000 × 15% = ₦75,000
On next 1,600,000: 1,600,000 × 19% = ₦304,000
On remaining 400,000: 400,000 × 21% = ₦84,000

Total tax = 21,000 + 55,000 + 75,000 + 304,000 + 84,000
= ₦539,000

Answer: ₦539,000

Example 8: An employee's annual gross salary is ₦2,400,000. After a consolidated relief of 20%
+ ₦200,000, tax is charged at:
7% on first ₦300,000
11% on next ₦300,000
15% on next ₦500,000
19% on remainder
Calculate: a) Taxable income b) Tax payable
Solution:
a) Gross salary = ₦2,400,000

Relief = 20% of 2,400,000 + 200,000
= 480,000 + 200,000
= ₦680,000

Taxable income = 2,400,000 - 680,000
= ₦1,720,000

b) Tax on first 300,000: 300,000 × 7% = ₦21,000 Tax on next 300,000: 300,000 × 11% = ₦33,000
Tax on next 500,000: 500,000 × 15% = ₦75,000
Tax on remaining 620,000: 620,000 × 19% = ₦117,800

Total tax = 21,000 + 33,000 + 75,000 + 117,800
= ₦246,800

Answer: a) ₦1,720,000 b) ₦246,800
Value Added Tax (VAT)
VAT is a consumption tax added to the price of goods and services.
In Nigeria:
Current VAT rate: 7.5% (as of 2020)
Added to final selling price
Collected by sellers, remitted to government
Formula:
VAT = Price × VAT rate
Final Price = Original Price + VAT

or
Final Price = Original Price × (1 + VAT rate)

Example 9: A laptop costs ₦250,000 before VAT. If VAT is 7.5%, find: a) VAT amount b) Total price
Solution:
a) VAT = 250,000 × 7.5%
= 250,000 × 0.075
= ₦18,750

b) Total price = 250,000 + 18,750
= ₦268,750

Alternative: Total = 250,000 × 1.075 = ₦268,750

Answer: a) ₦18,750 b) ₦268,750

Example 10: A restaurant bill including 7.5% VAT is ₦21,500. Find the cost before VAT.
Solution:
Let original cost = x

x + 0.075x = 21,500 1.075x = 21,500
x = 21,500 / 1.075 x = ₦20,000

VAT = 21,500 - 20,000 = ₦1,500
Answer: ₦20,000 (VAT = ₦1,500)

Example 11: A business sells goods worth ₦5,000,000 in a month. How much VAT should be remitted to the government at 7.5%?
Solution:
VAT = 5,000,000 × 7.5%
= ₦375,000

Answer: ₦375,000

Combined Financial Problems
Example 12: An investor purchases 1,000 shares at ₦45 each. The company pays 18% dividend on ₦50 nominal value. He also pays 10% tax on dividends. Calculate: a) Total investment b) Gross dividend c) Tax on dividend d) Net dividend received
Solution:
Total investment = 1,000 × 45 = ₦45,000

Dividend per share = 50 × 18% = ₦9 Gross dividend = 1,000 × 9 = ₦9,000

Tax on dividend = 9,000 × 10% = ₦900

d) Net dividend = 9,000 - 900 = ₦8,100

Answer: a) ₦45,000 b) ₦9,000 c) ₦900 d) ₦8,100

Example 13: A trader buys goods for ₦500,000 and wants to make 25% profit. If VAT is 7.5%, find: a) Selling price before VAT b) VAT amount c) Final price to customer
Solution:
a) Cost = ₦500,000
Profit = 500,000 × 25% = ₦125,000
Selling price = 500,000 + 125,000 = ₦625,000 b) VAT = 625,000 × 7.5% = ₦46,875
c) Final price = 625,000 + 46,875 = ₦671,875

Answer: a) ₦625,000 b) ₦46,875 c) ₦671,875
Using Logarithm Tables for Financial Calculations
Logarithm tables can simplify complex financial calculations.
Example 14: Find the compound amount on ₦48,500 at 8% per annum for 5 years using logarithms.
Solution:
A = P(1 + r)ⁿ
A = 48,500(1.08)⁵

Taking log:
log A = log 48,500 + 5 log 1.08

Using log tables:
log 48,500 = log(4.85 × 10⁴) = log 4.85 + 4
= 0.6857 + 4 = 4.6857

log 1.08 = 0.0334

Therefore:
logA =4.6857 + 5(0.0334)=4.6857 + 0.1670=4.8527
A =
antilog(4.8527)=7.122 × 10⁴=₦71,220
Answer: ₦71,220

Example 15: A sum amounts to ₦15,000 in 3 years at compound interest. Find the principal if the rate is 10% per annum (use logarithms).
Solution:
A = P(1.10)³ 15,000 = P(1.10)³

P = 15,000 / (1.10)³

Taking log:
log P = log 15,000 - 3 log 1.10

log 15,000 = log(1.5 × 10⁴) = 0.1761 + 4 = 4.1761
log 1.10 = 0.0414

log P = 4.1761 - 3(0.0414)
= 4.1761 - 0.1242
= 4.0519

P = antilog(4.0519)
= 1.127 × 10⁴
= ₦11,270

Answer: ₦11,270

Practical Financial Planning
Example 16: A young professional earning ₦200,000 monthly wants to:
Save 20% for investments
Pay rent of ₦600,000 annually
Set aside 10% for emergencies
Budget the remainder Calculate monthly allocations. Solution:
Monthly income = ₦200,000
Annual income = 200,000 × 12 = ₦2,400,000 Savings (20%): 200,000 × 0.20 = ₦40,000/month
Rent (monthly equivalent): 600,000 ÷ 12 = ₦50,000/month Emergency fund (10%): 200,000 × 0.10 = ₦20,000/month
Remainder = 200,000 - 40,000 - 50,000 - 20,000
= ₦90,000/month for other expenses

Budget Summary:
Savings: ₦40,000 (20%)
Rent: ₦50,000 (25%)
Emergency: ₦20,000 (10%)
Living expenses: ₦90,000 (45%)

EVALUATION
A bond with face value ₦80,000 pays 9% annual interest. Find the annual interest payment.
An investor buys 800 shares at ₦35 each. If the company pays 12% dividend on ₦40 nominal value, calculate the total dividend received.
Calculate the VAT on goods worth ₦150,000 at 7.5% VAT rate.
A worker earns ₦1,800,000 annually. After ₦300,000 tax-free allowance, tax is 10% on the first ₦500,000 and 15% on the remainder. Find the tax payable.
A shop sells an item for ₦53,750 including 7.5% VAT. Find the price before VAT.
Shares with ₦25 nominal value pay 16% dividend. If purchased at ₦30, find the rate of return.
Use logarithms to find the amount when ₦25,000 is invested at 12% compound interest for 4 years.
A company issues debentures worth ₦2,000,000 at 7% for 8 years. Calculate the total interest payable.
Calculate the current yield on a ₦100,000 bond with 10% coupon rate selling at ₦95,000.
An investor owns 500 preference shares paying 8% dividend on ₦50 nominal value. Calculate the annual dividend.

ASSIGNMENT
Bonds and Debentures: a) A government bond with face value ₦250,000 and coupon rate 11% matures in 7 years. Calculate: i) Annual interest payment ii) Total interest over bond life iii) Total amount received at maturity
b) A corporate bond with face value ₦100,000 and 9% coupon is selling at ₦92,000. Find: i) Current yield ii) If you buy 5 bonds, what annual interest do you receive?
Shares and Dividends: a) An investor buys 2,500 shares at ₦48 per share. The company declares 20% dividend on ₦40 nominal value. i) Find total investment ii) Calculate dividend per share iii) Find total dividend received
iv) Calculate rate of return on investment
b) A company has 5,000,000 shares of ₦10 nominal value. It declares 15% dividend. If you own 0.5% of the company, how much dividend do you receive?
Income Tax: a) Calculate tax on annual income of ₦4,200,000 with the following structure:
First ₦300,000: Tax-free
o Next ₦300,000: 7%
o Next ₦500,000: 11%
o Next ₦500,000: 15%
o Next ₦1,600,000: 19%
Remainder: 21%
b) An employee earns ₦350,000 monthly. Annual consolidated relief is 20% + ₦200,000. Calculate: i) Annual gross income ii) Total relief iii) Taxable income iv) Tax payable using rates from (a)
VAT Calculations: a) Find VAT and total price for: i) Laptop: ₦180,000 (VAT 7.5%) ii) Restaurant meal:
₦12,500 (VAT 7.5%) iii) Car: ₦3,500,000 (VAT 7.5%)
b) A shop's total sales including VAT are ₦5,375,000 for a month. Calculate: i) Sales before VAT ii) VAT amount to remit to government
Combined Problems: a) An investor's portfolio:
1,000 shares (₦50 nominal, bought at ₦60, 18% dividend)
₦500,000 in bonds (10% coupon rate)
All dividends and interest subject to 10% tax
Calculate: i) Total investment in shares ii) Gross annual dividend from shares iii) Annual interest from bonds iv)
Total gross income v) Tax on investment income vi) Net annual income
A business scenario:
Buys goods for ₦800,000
Wants 30% gross profit
Must add 7.5% VAT
Pays 10% tax on profits
Calculate: i) Selling price before VAT ii) VAT amount iii) Final customer price iv) Net profit after tax
Using Logarithms: a) Use logarithm tables to calculate: i) ₦75,500 at 9% compound interest for 6 years ii)
Principal that amounts to ₦50,000 in 4 years at 12% compound interest
b) A bond's value grows from ₦80,000 to ₦120,000 in 5 years. Find the annual compound growth rate using logarithms.
Financial Planning: Create a complete monthly budget for someone earning ₦300,000 per month:
15% income tax
25% for rent and utilities
20% for savings and investments
5% for insurance
10% for transportation
Remainder for food and miscellaneous
Show all calculations and create a pie chart showing the budget allocation.

WEEK 2: COORDINATE GEOMETRY OF A STRAIGHT LINE
CONTENT
The Cartesian Plane
The Cartesian plane (or coordinate plane) is a two-dimensional surface formed by two perpendicular number lines.
Components:
x-axis: Horizontal number line
y-axis: Vertical number line
Origin (O): Point where axes intersect (0, 0)
Coordinates: Ordered pair (x, y)
Diagram 1: The Cartesian Plane
y-axis
|
Q2 | Q1
|
 	+
|
Q3 | Q4
|
axis

Quadrants:
Quadrant I (Q1): x > 0, y > 0 (both positive)
Quadrant II (Q2): x < 0, y > 0 (x negative, y positive)
Quadrant III (Q3): x < 0, y < 0 (both negative)
Quadrant IV (Q4): x > 0, y < 0 (x positive, y negative)
Example 1: Plot the following points and state their quadrants: A(3, 4), B(-2, 5), C(-3, -2), D(4, - 3), E(0, 3), F(2, 0)
Solution:

y
|
B	|	A
•	|	•
|
────────┼──────── x C |	D
• |	•
|

A(3, 4): Quadrant I
B(-2, 5): Quadrant II
C(-3, -2): Quadrant III
D(4, -3): Quadrant IV
E(0, 3): On y-axis (not in any quadrant)
F(2, 0): On x-axis (not in any quadrant)

Distance Between Two Points
The distance between points P(x₁, y₁) and Q(x₂, y₂) is found using the distance formula: Distance Formula: d = √[(x₂ − x₁)² + (y₂ − y₁)²]
Derivation: Using Pythagoras' theorem on the right triangle formed:
Diagram 2: Distance Between Points
Q(x₂,y₂)
•
|\
| \ d
| \
•───• P	R
(x₁,y₁) (x₂,y₁)

Horizontal distance: |x₂ − x₁| Vertical distance: |y₂ − y₁| Hypotenuse: d
By Pythagoras: d² = (x₂ − x₁)² + (y₂ − y₁)²

Example 2: Find the distance between A(2, 3) and B(5, 7).
Solution:
Using d = √[(x₂ − x₁)² + (y₂ − y₁)²]

x₁ = 2, y₁ = 3
x₂ = 5, y₂ = 7

d = √[(5 − 2)² + (7 − 3)²]
= √[3² + 4²]
= √[9 + 16]
= √25
= 5 units

Answer: 5 units

Example 3: Find the distance between P(-3, 4) and Q(2, -8).
Solution:
d = √[(2 − (−3))² + (−8 − 4)²]
= √[(2 + 3)² + (−12)²]
= √[5² + 144]
= √[25 + 144]
= √169
= 13 units

Answer: 13 units

Example 4: The distance between points A(x, 3) and B(5, 7) is 5 units. Find the possible values of x.
Solution:
d = √[(5 − x)² + (7 − 3)²] = 5

√[(5 − x)² + 16] = 5

Square both sides:
(5 − x)² + 16 = 25
(5 − x)² = 9
5 − x = ±3

If 5 − x = 3:
x = 2

If 5 − x = −3:
x = 8

Answer: x = 2 or x = 8

Midpoint of a Line Segment
The midpoint M of the line joining P(x₁, y₁) and Q(x₂, y₂) is:
Midpoint Formula: M = ((x₁ + x₂)/2, (y₁ + y₂)/2) Diagram 3: Midpoint
P•─────────•M─────────•Q (x₁,y₁)	(x₂,y₂)

M is exactly halfway between P and Q
Example 5: Find the midpoint of the line joining A(4, 6) and B(10, 14).
Solution:
M = ((4 + 10)/2, (6 + 14)/2)
= (14/2, 20/2)
= (7, 10)

Answer: (7, 10)

Example 6: The midpoint of the line joining P(2, y) and Q(8, 12) is M(5, 9). Find y.
Solution:
Midpoint formula: ((2 + 8)/2, (y + 12)/2) = (5, 9)

For x-coordinate:
(2 + 8)/2 = 5
10/2 = 5 ✓ (checks out)

For y-coordinate:
(y + 12)/2 = 9 y + 12 = 18
y = 6

Answer: y = 6

Example 7: A line segment has endpoints A(-3, 5) and B(7, -1). Find: a) The midpoint M b) The distance |AB| c) The distance |AM|
Solution:
a) M = ((−3 + 7)/2, (5 + (−1))/2)
= (4/2, 4/2)
= (2, 2)

b) |AB| = √[(7 − (−3))² + (−1 − 5)²]
= √[10² + (−6)²]
= √[100 + 36]
= √136
= 2√34 units

c) |AM| = √[(2 − (−3))² + (2 − 5)²]
= √[5² + (−3)²]
= √[25 + 9]
= √34 units

Note: |AM| = |MB| = (1/2)|AB| ✓
Answer: a) (2, 2) b) 2√34 units c) √34 units

Gradient (Slope) of a Line
The gradient (or slope) measures the steepness of a line. Gradient Formula: m = (y₂ − y₁)/(x₂ − x₁) = rise/run Diagram 4: Gradient
Q(x₂,y₂)
/•
/ |
/ | rise = y₂ − y₁
/	|
────┘ P(x₁,y₁)
run = x₂ − x₁

Types of Gradients:
Positive gradient (m > 0): Line slopes upward (/) from left to right
Negative gradient (m < 0): Line slopes downward () from left to right
Zero gradient (m = 0): Horizontal line (—)
Undefined gradient: Vertical line (|)

Example 8: Find the gradient of the line passing through A(2, 3) and B(6, 11).
Solution:
m = (11 − 3)/(6 − 2)
= 8/4
= 2

Answer: m = 2 (line slopes upward)
Example 9: Calculate the gradient of the line through P(-4, 7) and Q(2, -5).
Solution:
m = (−5 − 7)/(2 − (−4))
= −12/(2 + 4)
= −12/6
= −2

Answer: m = −2 (line slopes downward)

Example 10: Find the gradient of the line joining points (3, k) and (7, 9) if the gradient is 2.
Solution:
m = (9 − k)/(7 − 3) = 2

(9 − k)/4 = 2
9 − k = 8
k = 1

Answer: k = 1

Special Cases of Gradients
Parallel Lines Lines are parallel if they have the same gradient. If lines with gradients m₁ and m₂ are parallel: m₁ = m₂
Example 11: Show that the line through A(1, 2) and B(4, 8) is parallel to the line through C(-2, 1) and D(1, 7).
Solution:
Gradient of AB:
m₁ = (8 − 2)/(4 − 1) = 6/3 = 2

Gradient of CD:
m₂ = (7 − 1)/(1 − (−2)) = 6/3 = 2

Since m₁ = m₂ = 2, the lines are parallel.

Perpendicular Lines Lines are perpendicular if the product of their gradients is −1.
If lines with gradients m₁ and m₂ are perpendicular: m₁ × m₂ = −1
or
m₂ = −1/m₁ (negative reciprocal)

Example 12: Show that the line through P(2, 3) and Q(6, 5) is perpendicular to the line through R(1, 4) and S(3, 0).
Solution:
Gradient of PQ:
m₁ = (5 − 3)/(6 − 2) = 2/4 = 1/2

Gradient of RS:
m₂ = (0 − 4)/(3 − 1) = −4/2 = −2

Check: m₁ × m₂ = (1/2) × (−2) = −1 ✓

The lines are perpendicular.

Example 13: A line passes through A(3, 5) and B(7, k). Another line perpendicular to AB passes through C(2, 3) and D(6, 7). Find k.
Solution:
Gradient of CD:
m₂ = (7 − 3)/(6 − 2) = 4/4 = 1

Since AB ⊥ CD:
m₁ × m₂ = −1 m₁ × 1 = −1
m₁ = −1

For line AB:
(k − 5)/(7 − 3) = −1 (k − 5)/4 = −1
k − 5 = −4
k = 1

Answer: k = 1

Equation of a Straight Line
Slope-Intercept Form: y = mx + c
Where:
m = gradient
c = y-intercept (where line crosses y-axis)
Diagram 5: y = mx + c
y
|
| /
c •─/────
|/
────┼────── x
|

Example 14: Find the equation of a line with gradient 3 passing through (2, 5).
Solution:
Using y = mx + c:
m = 3, point (2, 5)

Substitute to find c:
5 = 3(2) + c
5 = 6 + c
c = −1

Equation: y = 3x − 1

Answer: y = 3x – 1

Two-Point Form: If line passes through (x₁, y₁) and (x₂, y₂):
(y − y₁)/(x − x₁) = (y₂ − y₁)/(x₂ − x₁)
Or simply find m, then use point-slope form.

Example 15: Find the equation of the line passing through A(1, 3) and B(4, 9).
Solution:
First find gradient:
m = (9 − 3)/(4 − 1) = 6/3 = 2

Using y = mx + c with point (1, 3):
3 = 2(1) + c
c = 1

Equation: y = 2x + 1
Verification with point (4, 9): y = 2(4) + 1 = 9 ✓
Answer: y = 2x + 1

Point-Slope Form: y − y₁ = m(x − x₁)
Where (x₁, y₁) is a known point and m is the gradient.

Example 16: Write the equation of a line with gradient −3 passing through (2, 5).
Solution:
Using y − y₁ = m(x − x₁):
y − 5 = −3(x − 2) y − 5 = −3x + 6
y = −3x + 11

Answer: y = −3x + 11

General Form: ax + by + c = 0
Where a, b, c are constants.

Intercepts
x-intercept: Where line crosses x-axis (y = 0) y-intercept: Where line crosses y-axis (x = 0)
Example 17: Find the x and y intercepts of the line 3x + 4y = 12.
Solution:
y-intercept (x = 0):
3(0) + 4y = 12
4y = 12
y = 3
y-intercept: (0, 3)

x-intercept (y = 0):
3x + 4(0) = 12
3x = 12
x = 4
x-intercept: (4, 0)

Answer: x-intercept (4, 0), y-intercept (0, 3)

Diagram 6: Graphing using intercepts
y
3 •
|\
| \
| \
────┼───•─── x 0	4

Example 18: A line has equation 2x − 5y = 10. Find: a) Gradient b) y-intercept c) x-intercept
Solution:
First rearrange to y = mx + c form:
−5y = −2x + 10 y = (2/5)x − 2

Gradient m = 2/5

y-intercept c = −2 (point (0, −2))

For x-intercept, put y = 0: 2x − 5(0) = 10
2x = 10
x = 5
x-intercept: (5, 0)

Answer: a) 2/5 b) (0, −2) c) (5, 0)

Angle of Inclination
The angle of inclination (θ) is the angle a line makes with the positive x-axis.
Relationship: m = tan θ Diagram 7: Angle of Inclination
/
/ θ
────•────── x-axis

Example 19: Find the gradient of a line inclined at 45° to the x-axis.
Solution:
m = tan 45° = 1

Answer: m = 1

Example 20: A line has gradient √3. Find its angle of inclination.
Solution:
m = tan θ = √3 θ = tan⁻¹(√3) θ = 60°

Answer: 60°

Applications of Coordinate Geometry
Example 21: Collinearity Three points A(1, 2), B(3, 6), and C(5, 10) are collinear if they lie on the same straight line.
Check:
Gradient AB = (6 − 2)/(3 − 1) = 4/2 = 2 Gradient BC = (10 − 6)/(5 − 3) = 4/2 = 2

Since gradients are equal, points are collinear.

Example 22: Finding the fourth vertex Three vertices of a parallelogram are A(1, 2), B(4, 3), and C(6, 6). Find the fourth vertex D.
Solution: In a parallelogram, diagonals bisect each other. Midpoint of AC = Midpoint of BD
Midpoint of AC = ((1 + 6)/2, (2 + 6)/2) = (3.5, 4)

Let D = (x,
Midpoint ofy)
BD =
((4 + x)/2, (3 +
y)/2)
Setting equal: (4 + x)/2 = 3.5

→

4 + x = 7

→

x = 3(3 + y)/2 = 4→3 + y = 8→y = 5D = (3, 5)Answer: D(3, 5)

Example 23: Real-life application A road is being constructed between two towns. Town A is at coordinates (2, 5) km and Town B is at (10, 17) km on a map. Each unit represents 1 km.
Calculate: a) Distance between towns b) Gradient of the road c) If a rest stop is at the midpoint, find its coordinates
Solution:
a) Distance = √[(10 − 2)² + (17 − 5)²]
= √[64 + 144]
= √208
= 4√13
≈ 14.42 km
b) Gradient = (17 − 5)/(10 − 2)
= 12/8
= 3/2 = 1.5

c) Midpoint = ((2 + 10)/2, (5 + 17)/2)
= (6, 11)

Answer: a) 14.42 km b) 1.5 c) (6, 11)

EVALUATION
Plot the points A(3, 2), B(-2, 4), C(-3, -1), D(2, -3) and state their quadrants.
Find the distance between P(4, 7) and Q(10, 15).
Determine the midpoint of the line joining A(-4, 3) and B(6, -5).
Calculate the gradient of the line passing through (2, 5) and (8, 17).
Show that the points A(1, 2), B(3, 4), and C(7, 8) are collinear.
Find the equation of a line with gradient 4 passing through (1, 5).
Determine if the lines through A(1, 3), B(4, 5) and C(2, 1), D(8, -5) are parallel or perpendicular.
Find the x and y intercepts of 5x − 3y = 15.
A line passes through (2, 7) and has gradient −3. Write its equation.
The points P(3, k), Q(7, 10) lie on a line with gradient 2. Find k.

ASSIGNMENT
Distance and Midpoint: a) Calculate the distance between: i) A(5, 8) and B(9, 11) ii) P(-3, 4) and Q(5, -2) iii) M(-6, - 8) and N(2, 7)
Find the midpoint of: i) The line joining (7, 9) and (15, 21) ii) AB where A(-5, 3) and B(7, -9)
The distance between A(x, 5) and B(7, 9) is 5 units. Find possible values of x.
Gradient: a) Find the gradient of the line through: i) (3, 7) and (9, 19) ii) (-4, 5) and (2, -7) iii) (a, 3a) and (2a, 7a)
Show that AB is parallel to CD if: A(2, 3), B(6, 7), C(-1, 2), D(3, 6)
Prove that PQ is perpendicular to RS if: P(1, 4), Q(5, 6), R(3, 2), S(1, 6)
Equations of Lines: a) Find the equation of the line: i) With gradient 5 passing through (2, 3) ii) Through points (1, 4) and (3, 10) iii) With gradient −2 and y-intercept 5
b) Write in the form y = mx + c: i) 3x + 4y = 12 ii) 2x − 5y + 10 = 0 iii) x − y = 7
Intercepts: For each line, find x and y intercepts: a) y = 3x − 6 b) 2x + 3y = 12 c) 5x − 4y = 20 d) y = −2x + 8
Applied Problems: a) Three vertices of a rectangle are A(2, 1), B(6, 1), and C(6, 4). Find: i) The fourth vertex D ii)
The length of diagonal AC iii) The midpoint of diagonal BD
A treasure map shows treasure at T(8, 11). You start at S(2, 3). i) How far is the treasure? ii) If you walk to the midpoint first, what are its coordinates? iii) How much further to the treasure from the midpoint?
Towns X, Y, Z are at coordinates (0, 0), (12, 5), (4, 9). i) Which two towns are closest? ii) If a hospital is built at the centroid (average of coordinates), find its location. iii) Find the equation of the road from X to Y.
Proof Problems: a) Prove that the triangle with vertices A(1, 2), B(4, 6), C(7, 2) is isosceles.
Show that PQRS with P(1, 2), Q(5, 3), R(6, 7), S(2, 6) is a parallelogram by proving opposite sides are parallel.
Prove that the points A(0, 0), B(4, 3), C(8, 6) are collinear.

WEEK 3: CONSTRUCTION I - LOCUS
CONTENT
Introduction to Locus
A locus (plural: loci) is the set of all points that satisfy a given condition or rule.
Definition: The locus of a point is the path traced by a point moving according to a given geometrical condition.
Examples:
Locus of points equidistant from a fixed point is a circle
Locus of points equidistant from two fixed points is the perpendicular bisector of the line joining them
Locus of points equidistant from two intersecting lines is the angle bisector

Locus of Points Equidistant from a Fixed Point
Condition: All points at a constant distance from a fixed point O. Result: A circle with center O and radius equal to the constant distance. Diagram 8: Circle as Locus
•
•	•
O	•
•	•
•

All points on circle are equal distance (radius) from O

Construction Example 1: Construct the locus of points 4 cm from point P.
Steps:
Mark point P
Set compass to 4 cm
Place compass point on P
Draw a complete circle
Diagram 9:

/	\
|	P	| ← 4 cm radius
\	/
All points on this circle are exactly 4 cm from P

Locus of Points Equidistant from Two Fixed Points
Condition: All points equally distant from two fixed points A and B.
Result: The perpendicular bisector of line AB.
Diagram 10: Perpendicular Bisector
|
| ← perpendicular bisector
|
A •─┼─• B M

Every point on the perpendicular bisector is equidistant from A and B

Construction Example 2: Construct the locus of points equidistant from points A and B that are 6 cm apart.
Steps:
Draw line AB = 6 cm
Set compass to more than half of AB (e.g., 4 cm)
With center A, draw arcs above and below AB
With center B (same radius), draw arcs to intersect previous arcs
Join intersection points - this is the perpendicular bisector
Diagram 11: Construction Steps
•P
/|\
/ | \
/ | \
A •───┼───• B
\ M /
\ | /
\|/
•Q

Arcs from A and B intersect at P and Q
Line PQ is perpendicular bisector
M is midpoint of AB

Proof that points on perpendicular bisector are equidistant: Take any point X on the perpendicular bisector.
Triangle AXM ≅ Triangle BXM (SAS)
Therefore: AX = BX ✓

Locus of Points Equidistant from Two Intersecting Lines
Condition: All points equally distant from two intersecting lines.
Result: The angle bisectors (two of them - one for each pair of opposite angles).
Diagram 12: Angle Bisector
\ | /
\ | /
\|/ ← angle bisector
─────┼─────
/|\
/ | \
/ | \

Points on angle bisector are equidistant from both lines

Construction Example 3: Construct the angle bisector of ∠ABC.
Steps:
Draw angle ABC
With center B, draw an arc cutting both arms at P and Q
With centers P and Q (same radius), draw arcs intersecting at R
Join BR - this is the angle bisector
Diagram 13: Angle Bisector Construction
R
/|\
/ | \
/ |  \
P	|	Q
\ B  /
\ | /
\|/ A───•───C

BR bisects ∠ABC
Property: Every point on the angle bisector is equidistant from the two arms of the angle.
Locus of Points Equidistant from a Fixed Line
Condition: All points at a constant distance from a line l.
Result: Two parallel lines, one on each side of l, at the given distance.
Diagram 14: Parallel Lines
──────────────── ← 2 cm from l

════════════════ ← line l (given)
──────────────── ← 2 cm from l Both dashed lines are loci

Construction Example 4: Construct the locus of points 3 cm from a given line AB.
Steps:
Draw line AB
At several points on AB, construct perpendiculars
Mark points 3 cm from AB along each perpendicular
Join these points to form two parallel lines

Intersection of Loci
When two loci are constructed, their intersection points satisfy both conditions. Example 24: Find the locus of points that are:
5 cm from point A
3 cm from point B Where A and B are 6 cm apart.
Solution:
Locus 1: Circle center A, radius 5 cm
Locus 2: Circle center B, radius 3 cm
Intersection: Two points where circles meet
Diagram 15: Intersecting Loci
Circle (A, 5cm)

/	\
|	A	|\ \ Circle (B, 3cm)
|	| •X─•───
\	/ | B	|
••Y	|
\	/

Points X and Y satisfy both conditions

Example 25: A goat is tied to a corner of a square shed (side 4m) with a 6m rope. Describe the locus of positions the goat can reach.
Solution: The locus consists of:
A three-quarter circle of radius 6m centered at the corner
Two quarter circles of radius 2m at the two adjacent corners
Diagram 16:
Shed (4m × 4m)
┌─────┐
|	|
|	| ←2m arc 6m │ •──┘
arc └──────

The goat can graze in the shaded region

Circumscribed, Inscribed, and Escribed Circles
Circumscribed Circle (Circumcircle)
A circle that passes through all vertices of a polygon.
For a Triangle:
Center: Circumcenter (intersection of perpendicular bisectors of sides)
Passes through all three vertices
Diagram 17: Circumcircle
B
/•\
/ | \
/ O \ ← circumcircle
/	|	\
•────┼────• A	|	C

O is circumcenter
All vertices lie on circle

Construction Example 5: Construct the circumcircle of triangle ABC.
Steps:
Draw triangle ABC
Construct perpendicular bisector of AB
Construct perpendicular bisector of BC
Mark intersection point O (circumcenter)
With center O and radius OA, draw circle through A, B, C
Properties:
Circumcenter is equidistant from all vertices
For acute triangle: O is inside
For right triangle: O is on hypotenuse midpoint
For obtuse triangle: O is outside

Inscribed Circle (Incircle)
A circle that touches all sides of a polygon internally.
For a Triangle:
Center: Incenter (intersection of angle bisectors)
Tangent to all three sides
Diagram 18: Incircle
B
/.\
/.│.\
/ • \ ← incircle
/ I/ \ \ touches all sides
•────────• A	C

I is incenter
Circle touches all sides

Construction Example 6: Construct the incircle of triangle ABC.
Steps:
Draw triangle ABC
Construct angle bisector of ∠A
Construct angle bisector of ∠B
Mark intersection point I (incenter)
From I, draw perpendicular to any side (say AB) meeting at P
With center I and radius IP, draw circle
Properties:
Incenter is equidistant from all sides
Always lies inside the triangle
Angle bisectors always meet at one point

Escribed Circle (Excircle)
A circle that touches one side externally and the extensions of the other two sides.
For a Triangle:
Three escribed circles possible (one for each side)
Center: Excenter (intersection of one internal and two external angle bisectors)
Diagram 19: Escribed Circle
B
/|\
/ | \
/ |  \
/	|	\
•────────• A	C
\	|	/
\ •E / ← escribed circle
\_|_/	(opposite to B)
|

Circle touches AC and extensions of AB and BC

Construction is more complex and typically covered in advanced geometry.

Practical Construction Problems
Example 26: Two towns A and B are 8 cm apart on a map. A mobile phone tower is to be built such that it is:
Equidistant from A and B
6 cm from A
Find possible locations for the tower using locus.
Solution:
Condition 1: Equidistant from A and B
Perpendicular bisector of AB Condition 2: 6 cm from A
Circle center A, radius 6 cm

Solution: Intersection of these two loci

Construction:
Mark A and B, 8 cm apart
Construct perpendicular bisector of AB
Draw circle center A, radius 6 cm
Mark intersection points - these are possible locations
Diagram 20:
T₁
/|
/ |
/ |
A •─────┼─────• B
\ |
\ |
\|
T₂

T₁ and T₂ are possible tower locations

Example 27: A garden is in the shape of a rectangle ABCD where AB = 10m, BC = 6m. A sprinkler is to be placed so that it waters points:
Not more than 5m from corner A
Not less than 4m from side BC
Shade the region where the sprinkler can be placed.
Solution:
Condition 1: Not more than 5m from A
Inside circle center A, radius 5m

Condition 2: Not less than 4m from BC
Above a line parallel to BC, 4m from BC Solution: Region satisfying both conditions
Diagram 21:
B ──────────── C
│	│
│	shaded	│
│	region	│
│	(4m from BC)
│ ╱─────╲	│
│/	A	\	│6m
└────────────── D 10m

Shaded region shows where sprinkler can be placed

EVALUATION
Define the term "locus" in geometry.
Describe the locus of points 5 cm from a fixed point O.
What is the locus of points equidistant from two fixed points A and B?
Construct the perpendicular bisector of a line segment PQ = 8 cm.
What is the locus of points equidistant from two intersecting lines?
Construct the angle bisector of an angle of 70°.
Distinguish between a circumcircle and an incircle of a triangle.
Where is the circumcenter of: a) An acute triangle? b) A right triangle? c) An obtuse triangle?
Two points A and B are 6 cm apart. Construct the locus of points that are 4 cm from A and 5 cm from B.
Describe the locus of points that are 2 cm from a line segment AB.

ASSIGNMENT
Basic Locus Constructions: a) Using ruler and compass, construct: i) The locus of points 4.5 cm from point P ii) The locus of points equidistant from points A and B that are 7 cm apart iii) The locus of points 3 cm from a line segment of length 8 cm
b) Construct an angle of 60° and then construct its bisector. Verify that points on the bisector are equidistant from the two arms.
Intersection of Loci: a) Mark two points X and Y that are 8 cm apart. Construct the locus of points that are:
5 cm from X
6 cm from Y Mark the intersection points clearly.
Draw a line segment AB = 10 cm. Find and mark all points that are:
6 cm from A
3 cm from line AB
Two points P and Q are 9 cm apart. Find the locus of points that are:
Equidistant from P and Q
5 cm from P Mark the two possible locations.
Triangle Centers: a) Draw a triangle ABC with AB = 8 cm, BC = 7 cm, AC = 6 cm. i) Construct the circumcircle and mark the circumcenter ii) Measure the circumradius iii) Verify that all vertices lie on the circle
b) For the same triangle ABC: i) Construct the incircle and mark the incenter ii) Measure the inradius iii) Verify that the circle touches all three sides
Applied Locus Problems: a) A rectangular field ABCD has AB = 12m, BC = 8m. A scarecrow is to be placed such that it is:
At least 5m from corner A
Equidistant from sides AB and AD Using scale 1 cm = 2m, construct the locus and shade the possible region.
Two radio stations A and B are 100 km apart. Station A has a range of 70 km and station B has a range of 60 km. i) Using scale 1 cm = 20 km, show the coverage area of each station ii) Shade the region covered by both stations iii) Find the locus of points equidistant from both stations iv) Mark points that are equidistant from both stations and exactly at the limit of both ranges
A goat is tethered to the corner of a rectangular shed measuring 5m 3m with a 7m rope. Using scale 1 cm = 1m: i) Draw the shed ii) Construct the locus of points the goat can reach iii) Calculate the area the goat can graze (use π = 3.14)
Challenge Problems: a) Two towns A and B are 12 km apart. A police station is to be built such that:
It is closer to A than to B
It is not more than 8 km from A
It is at least 5 km from the road AB Using scale 1 cm = 2 km, construct and shade the region where the police station can be built.
b) Triangle ABC has AB = 7 cm, BC = 8 cm, CA = 9 cm. i) Construct the triangle ii) Construct all three perpendicular bisectors and mark the circumcenter O iii) Construct all three angle bisectors and mark the incenter I iv) Measure the distance OI v) Draw both the circumcircle and incircle on the same diagram
Proof and Reasoning: a) Explain with a diagram why the perpendicular bisector of a line segment is the locus of points equidistant from the endpoints.
Prove that the angle bisector is the locus of points equidistant from the two arms of the angle.
In triangle ABC, if the perpendicular bisectors of AB and BC meet at point O, prove that O is equidistant from all three vertices.

WEEK 4: DIFFERENTIATION OF ALGEBRAIC FUNCTIONS I
CONTENT
Introduction to Calculus
Calculus is the mathematics of change. It has two main branches:
Differential Calculus: Rates of change (differentiation)
Integral Calculus: Accumulation (integration)
Differentiation answers the question: "How fast is something changing?"
Real-life examples:
Speed: rate of change of distance with respect to time
Acceleration: rate of change of velocity with respect to time
Population growth rate
Rate of cooling of hot water
Marginal cost in economics

Concept of a Limit
A limit describes the value a function approaches as the input approaches some value.
Notation: lim[x→a] f(x) = L
Read as: "The limit of f(x) as x approaches a is L" Example 28: Evaluate lim[x→2] (x² + 3x) Solution:
Simply substitute x = 2:
= (2)² + 3(2)
= 4 + 6
= 10

Answer: 10
Example 29: Evaluate lim[x→3] (x² − 9)/(x − 3)
Solution:
Direct substitution gives 0/0 (indeterminate)

Factor numerator:
(x² − 9)/(x − 3) = (x + 3)(x − 3)/(x − 3)
= x + 3 (for x ≠ 3)
Now take limit:
lim[x→3] (x + 3) = 3 + 3 = 6

Answer: 6
Example 30: Evaluate lim[h→0] [(2 + h)² − 4]/h
Solution:
Expand numerator:
(2 + h)² − 4 = 4 + 4h + h² − 4 = 4h + h²

Therefore:
[4h + h²]/h = [h(4 + h)]/h = 4 + h (for h ≠ 0)

lim[h→0] (4 + h) = 4

Answer: 4
This type of limit is the foundation of differentiation!

The Concept of a Derivative
The derivative of a function at a point gives the rate of change or slope of the tangent at that point.
Geometric Interpretation:
Diagram 22: Slope of Secant vs. Tangent
y
|	• Q(x+h, f(x+h))
|	/|
|	/ |
| / |
| /	|
|/	| P(x, f(x))
•
    |	x

As Q moves closer to P (h→0), secant PQ approaches tangent at P
Slope of secant PQ:
m_secant = [f(x + h) − f(x)]/h

Slope of tangent at P (derivative):
m_tangent = lim[h→0] [f(x + h) − f(x)]/h
This is the first derivative of f(x), denoted f'(x) or dy/dx.

First Principle of Differentiation (Definition) First Principle (Derivative from First Principles): f'(x) = lim[h→0] [f(x + h) − f(x)]/h
Alternative Notation:
f'(x): "f prime of x"
dy/dx: "dy by dx" or "derivative of y with respect to x"
d/dx[f(x)]: "derivative of f(x) with respect to x"
Example 31: Find the derivative of f(x) = x² from first principles.
Solution:
f'(x) = lim[h→0] [f(x + h) − f(x)]/h

f(x) = x²
f(x + h) = (x + h)²
= x² + 2xh + h²

Therefore:
f'(x) = lim[h→0] [(x² + 2xh + h²) − x²]/h
= lim[h→0] [2xh + h²]/h
= lim[h→0] [h(2x + h)]/h
= lim[h→0] (2x + h)
= 2x

Answer: f'(x) = 2x
Interpretation: If f(x) = x², then f'(x) = 2x
At x = 3, slope = 2(3) = 6
At x = 5, slope = 2(5) = 10
Example 32: Differentiate f(x) = x³ from first principles.
Solution:
f(x + h) = (x + h)³
= x³ + 3x²h + 3xh² + h³

f'(x) = lim[h→0] [(x³ + 3x²h + 3xh² + h³) − x³]/h
= lim[h→0] [3x²h + 3xh² + h³]/h
= lim[h→0] [h(3x² + 3xh + h²)]/h
= lim[h→0] (3x² + 3xh + h²)
= 3x²
Answer: f'(x) = 3x²
Example 33: Find f'(x) if f(x) = 2x + 5 using first principles.
Solution:
f(x + h) = 2(x + h) + 5
= 2x + 2h + 5

f'(x) = lim[h→0] [(2x + 2h + 5) − (2x + 5)]/h
= lim[h→0] [2h]/h
= lim[h→0] 2
= 2

Answer: f'(x) = 2 (constant slope - straight line) Example 34: Differentiate f(x) = 1/x from first principles. Solution:
f(x + h) = 1/(x + h)

f'(x) = lim[h→0] [1/(x + h) − 1/x]/h
= lim[h→0] [x − (x + h)]/[h·x(x + h)]
= lim[h→0] [−h]/[h·x(x + h)]
= lim[h→0] [−1]/[x(x + h)]
= −1/x²

Answer: f'(x) = −1/x²

Standard Derivatives (Derived Functions)
From first principles, we can derive standard formulas:
Power Rule: If f(x) = xⁿ, then f'(x) = nxⁿ⁻¹ Table of Standard Derivatives:
Function f(x)Derivative f'(x)c (constant)0x1x²2xx³3x²xⁿnxⁿ⁻¹1/x = x⁻¹−1/x² = −x⁻²√x = x(1/2)1/(2√x) = (1/2)x⁻(1/2)1/x² = x⁻²−2/x³ = −2x⁻³Rules of Differentiation:
Constant Multiple Rule: d/dx[cf(x)] = c·f'(x)
Sum Rule: d/dx[f(x) + g(x)] = f'(x) + g'(x)
Difference Rule: d/dx[f(x) − g(x)] = f'(x) − g'(x)

Example 35: Differentiate y = 5x⁴
Solution:
Using power rule with constant multiple: dy/dx = 5 × 4x³
= 20x³

Answer: dy/dx = 20x³

Example 36: Find f'(x) if f(x) = 3x² + 4x − 7
Solution:
Differentiate term by term: d/dx[3x²] = 3 × 2x = 6x d/dx[4x] = 4 × 1 = 4
d/dx[−7] = 0

Therefore:
f'(x) = 6x + 4

Answer: f'(x) = 6x + 4

Example 37: Differentiate y = 2x⁵ − 3x³ + 7x² − 5x + 9
Solution:
dy/dx = 2(5x⁴) − 3(3x²) + 7(2x) − 5(1) + 0
= 10x⁴ − 9x² + 14x − 5

Answer: dy/dx = 10x⁴ − 9x² + 14x – 5

Example 38: Find dy/dx if y = (x + 2)(x − 3)
Solution:
Method 1: Expand first
y = x² − 3x + 2x − 6
= x² − x − 6 dy/dx = 2x – 1

Method 2: Product rule (covered later)
Answer: dy/dx = 2x − 1
Example 39: Differentiate y = (3x² + 5)/x
Solution:
First simplify by dividing:
y = 3x²/x + 5/x
= 3x + 5x⁻¹

dy/dx = 3(1) + 5(−1)x⁻²
= 3 − 5/x²

Answer: dy/dx = 3 − 5/x²

Example 40: Find f'(x) if f(x) = 2√x + 3/√x
Solution:
Rewrite using powers:
f(x) = 2x^(1/2) + 3x^(−1/2)

f'(x) = 2(1/2)x^(−1/2) + 3(−1/2)x^(−3/2)
= x^(−1/2) − (3/2)x^(−3/2)
= 1/√x − 3/(2x√x)
= 1/√x − 3/(2x^(3/2))

Answer: f'(x) = 1/√x − 3/(2x√x)

Interpretation of Derivatives
Physical Interpretation:
Distance-Time: If s(t) = distance, then s'(t) = velocity
Velocity-Time: If v(t) = velocity, then v'(t) = acceleration
Geometric Interpretation:
f'(a) = slope of tangent to curve y = f(x) at x = a
f'(a) = instantaneous rate of change at x = a
Example 41: A particle moves along a line according to s(t) = t³ − 6t² + 9t, where s is in meters and t is in seconds. Find: a) Velocity at any time t b) Velocity at t = 2 seconds c) When is the particle at rest?
Solution:
Velocity v(t) = ds/dt v(t) = 3t² − 12t + 9

At t = 2:
v(2) = 3(2)² − 12(2) + 9
= 12 − 24 + 9
= −3 m/s

(Negative means moving backward)

Particle at rest when v = 0: 3t² − 12t + 9 = 0
t² − 4t + 3 = 0 (t − 1)(t − 3) = 0
t = 1 or t = 3 seconds

Answer: a) v(t) = 3t² − 12t + 9 b) −3 m/s c) t = 1s and t = 3s

Example 42: The displacement of a body is given by s = 2t² + 3t − 5 where s is in cm and t in seconds. Find: a) Initial velocity b) Velocity after 4 seconds c) Acceleration (rate of change of velocity)
Solution:
a) Velocity v = ds/dt = 4t + 3
At t = 0: v(0) = 4(0) + 3 = 3 cm/s

b) At t = 4: v(4) = 4(4) + 3 = 19 cm/s

c) Acceleration a = dv/dt = d/dt[4t + 3] = 4 cm/s²

Answer: a) 3 cm/s b) 19 cm/s c) 4 cm/s²

Finding Equations of Tangents and Normals
Tangent: Line that touches a curve at exactly one point (locally).
Normal: Line perpendicular to the tangent at the point of contact.

Steps to find tangent equation at point (x₁, y₁):
Find dy/dx (general derivative)
Substitute x = x₁ to find slope m at that point
Use point-slope form: y − y₁ = m(x − x₁)
For normal:
Slope of normal = −1/(slope of tangent) = −1/m
Use same point-slope form with new slope
Example 43: Find the equation of the tangent to y = x² at the point (3, 9).
Solution:
dy/dx = 2x

At x = 3:
m = 2(3) = 6

Equation of tangent:
y − 9 = 6(x − 3) y − 9 = 6x − 18
y = 6x − 9

Answer: y = 6x – 9

Example 44: Find equations of both tangent and normal to y = x³ − 3x at x = 2.
Solution:
First find y-coordinate:
y = (2)³ − 3(2) = 8 − 6 = 2
Point is (2, 2)

Find slope:
dy/dx = 3x² − 3
At x = 2: m = 3(4) − 3 = 9

**Tangent:**
y − 2 = 9(x − 2) y = 9x − 16

Normal:
Slope of normal = −1/9

y − 2 = (−1/9)(x − 2) 9y − 18 = −x + 2
9y = −x + 20 x + 9y = 20
Answer: Tangent: y = 9x − 16; Normal: x + 9y = 20

EVALUATION
Evaluate: lim[x→5] (x² + 2x)
Evaluate: lim[h→0] [(x + h)² − x²]/h
Differentiate y = x⁴	from first principles. 4.	Find f'(x) if f(x) = 3x² + 5x − 2.
Differentiate: y = 4x³ − 7x² + 2x − 9
If f(x) = x⁵, find f'(2).
Find dy/dx if y = (2x² + 3)/x.
A particle's position is s(t) = t² + 4t. Find its velocity at t = 3.
Find the slope of the tangent to y = x³ at x = 1.
Differentiate y = 3√x + 2/x.

ASSIGNMENT
1.	Limits: Evaluate: a) lim[x→4] (x² − 16)/(x − 4) b) lim[h→0] [(3 + h)² − 9]/h c) lim[x→2] (x³ − 8)/(x − 2) d) lim[h→0] [(1 + h)³ − 1]/h
First Principles: Differentiate from first principles: a) f(x) = 3x + 2 b) f(x) = x² + 4x c) f(x) = 2x³ d) f(x) = 1/(x + 1)
Standard Differentiation: Find dy/dx for: a) y = 5x⁴	− 3x² + 7 b) y = 2x³ + 4x² − 6x + 1 c) y = x⁵ − 2x⁴	+ 3x³ − x d) y = (x + 1)(x² − 3) e) y = (3x³ − 4x)/x² f) y = 4√x − 3/√x + 2x
Applications - Motion: a) A particle moves according to s = t³ − 9t² + 15t where s is in meters and t in seconds. i) Find velocity as a function of time ii) Find velocity at t = 2 iii) When is the particle at rest? iv) Find acceleration
b) The height of a ball thrown upward is h = 20t − 5t² meters after t seconds. i) Find the initial velocity ii) When does the ball reach maximum height? iii) What is the maximum height?
Tangents and Normals: a) Find the equation of the tangent to y = x² + 2x at (1, 3).
Find equations of tangent and normal to y = x³ − 3x² at x = 2.
At what point on the curve y = x² is the tangent parallel to the line y = 4x − 1?
Find the points on y = x³ where the tangent is horizontal.
Challenge Problems: a) If f(x) = ax² + bx + c and f'(1) = 8, f'(2) = 14, f(0) = 5, find a, b, and c.
The curve y = x³ + px + q passes through (1, 6) and has slope 5 at that point. Find p and q.
Prove from first principles that if f(x) = xⁿ , then f'(x) = nxⁿ ⁻ ¹ for n = 4.

WEEK 6: DIFFERENTIATION OF ALGEBRAIC FUNCTIONS II
CONTENT
Review of Basic Differentiation
From Week 4, recall:
Power Rule: d/dx(xⁿ) = nxⁿ⁻¹
Constant Multiple: d/dx(cf(x)) = c·f'(x)
Sum/Difference: d/dx(f ± g) = f' ± g'
Now we extend to more advanced techniques and applications.

Product Rule
When differentiating a product of two functions, we cannot simply multiply their derivatives. We need the Product Rule.
Product Rule: If y = u·v where u and v are functions of x, then: dy/dx = u(dv/dx) + v(du/dx)
Or in short notation: d/dx(uv) = u·v' + v·u'
Memory aid: "First times derivative of second, plus second times derivative of first"
Example 1: Differentiate y = (3x² + 2)(4x³ − 5)
Solution:
Method 1: Using Product Rule

Let u=3x² + 2→du/dx = 6xLet v=4x³ − 5→dv/dx = 12x²
dy/dx
=
=
=
=
u(dv/dx) + v(du/dx)
(3x² + 2)(12x²) + (4x³ − 5)(6x)
36x⁴ + 24x² + 24x⁴ − 30x
60x⁴ + 24x² − 30xMethod 2: Expand first, then differentiate
y = 12x⁵ − 15x² + 8x³ − 10 dy/dx = 60x⁴ + 24x² − 30x
Both methods give the same answer ✓ Answer: dy/dx = 60x⁴ + 24x² − 30x Example 2: Find dy/dx if y = x²(x + 1)⁴ Solution:
Here we must use the product rule (expanding would be tedious).

u = x² → u' = 2x
v = (x + 1)⁴ → v' = 4(x + 1)³ (chain rule - covered next)

dy/dx = x²·4(x + 1)³ + (x + 1)⁴·2x
= 4x²(x + 1)³ + 2x(x + 1)⁴
= 2x(x + 1)³[2x + (x + 1)]
= 2x(x + 1)³(3x + 1)

Answer: dy/dx = 2x(x + 1)³(3x + 1)
Example 3: Differentiate y = (2x + 3)(x² − 5x + 1)
Solution:
u = 2x + 3 → u' = 2
v = x² − 5x + 1 → v' = 2x − 5

dy/dx = (2x + 3)(2x − 5) + (x² − 5x + 1)(2)
= 4x² − 10x + 6x − 15 + 2x² − 10x + 2
= 6x² − 14x − 13

Answer: dy/dx = 6x² − 14x – 13

Quotient Rule
When differentiating a quotient (fraction), we use the Quotient Rule. Quotient Rule: If y = u/v, then: dy/dx = [v(du/dx) − u(dv/dx)]/v² Or in short: d/dx(u/v) = (v·u' − u·v')/v²
Memory aid: "Bottom times derivative of top, minus top times derivative of bottom, all over bottom squared"
Example 4: Differentiate y = (3x + 2)/(x − 1)
Solution:
u = 3x + 2 → u' = 3 v = x − 1 → v' = 1

dy/dx = [(x − 1)(3) − (3x + 2)(1)]/(x − 1)²
= [3x − 3 − 3x − 2]/(x − 1)²
= −5/(x − 1)²

Answer: dy/dx = −5/(x − 1)²
Example 5: Find f'(x) if f(x) = x²/(x + 3)
Solution:
u = x² → u' = 2x v = x + 3 → v' = 1

f'(x) = [(x + 3)(2x) − x²(1)]/(x + 3)²
= [2x² + 6x − x²]/(x + 3)²
= [x² + 6x]/(x + 3)²
= x(x + 6)/(x + 3)²

Answer: f'(x) = x(x + 6)/(x + 3)²
Example 6: Differentiate y = (x² + 1)/(x² − 1)
Solution:

u = x² + 1→u' = 2xv = x² − 1→v' = 2x
dy/dx =
=
=
[(x² − 1)(2x) − (x² + 1)(2x)]/(x² [2x³ − 2x − 2x³ − 2x]/(x² − 1)²
−4x/(x² − 1)²
- 1)²Answer: dy/dx = −4x/(x² − 1)²

Chain Rule (Function of a Function)
When a function is composed of one function inside another, we use the Chain Rule. Chain Rule: If y = f(u) where u = g(x), then: dy/dx = (dy/du) × (du/dx)
Or: d/dx[f(g(x))] = f'(g(x))·g'(x)
In words: Differentiate the outer function (keeping the inner function unchanged), then multiply by the derivative of the inner function.
Example 7: Differentiate y = (3x + 2)⁵
Solution:
Let u = 3x + 2 → du/dx = 3 Then y = u⁵ → dy/du = 5u⁴

dy/dx = (dy/du) × (du/dx)
= 5u⁴ × 3
= 15u⁴
= 15(3x + 2)⁴

Answer: dy/dx = 15(3x + 2)⁴
Example 8: Find dy/dx if y = (x² − 3x + 1)⁸
Solution:
Outer function: ( )⁸ → derivative: 8( )⁷
Inner function: x² − 3x + 1 → derivative: 2x − 3

dy/dx = 8(x² − 3x + 1)⁷ × (2x − 3)
= 8(2x − 3)(x² − 3x + 1)⁷

Answer: dy/dx = 8(2x − 3)(x² − 3x + 1)⁷ Example 9: Differentiate y = √(4x² + 1) Solution:
Rewrite: y = (4x² + 1)^(1/2)

Outer function: ( )^(1/2) → (1/2)( )^(−1/2)
Inner function: 4x² + 1 → 8x

dy/dx = (1/2)(4x² + 1)^(−1/2) × 8x
= 4x/(4x² + 1)^(1/2)
= 4x/√(4x² + 1)

Answer: dy/dx = 4x/√(4x² + 1)
Example 10: Find f'(x) if f(x) = 1/(2x − 3)²
Solution:
Rewrite: f(x) = (2x − 3)^(−2)

Outer: ( )^(−2) → −2( )^(−3)
Inner: 2x − 3 → 2

f'(x) = −2(2x − 3)^(−3) × 2
= −4(2x − 3)^(−3)
= −4/(2x − 3)³

Answer: f'(x) = −4/(2x − 3)³

Combined Rules
Often we need to combine product, quotient, and chain rules.
Example 11: Differentiate y = x²(3x − 1)⁴
Solution:
Use Product Rule with Chain Rule: u = x² →  u' = 2x
v = (3x − 1)⁴ → v' = 4(3x − 1)³ × 3 = 12(3x − 1)³

dy/dx = x² × 12(3x − 1)³ + (3x − 1)⁴ × 2x
= 12x²(3x − 1)³ + 2x(3x − 1)⁴
= 2x(3x − 1)³[6x + (3x − 1)]
= 2x(3x − 1)³(9x − 1)

Answer: dy/dx = 2x(3x − 1)³(9x − 1) Example 12: Find dy/dx if y = (x + 1)³/(x − 1)² Solution:
Use Quotient Rule with Chain Rule:

u = (x + 1)³ → u' = 3(x + 1)² v = (x − 1)² → v' = 2(x − 1)

dy/dx = [(x − 1)² × 3(x + 1)² − (x + 1)³ × 2(x − 1)]/(x − 1)⁴
= [(x − 1)[3(x + 1)²(x − 1) − 2(x + 1)³]]/(x − 1)⁴
= [3(x + 1)²(x − 1) − 2(x + 1)³]/(x − 1)³
= [(x + 1)²[3(x − 1) − 2(x + 1)]]/(x − 1)³
= [(x + 1)²(3x − 3 − 2x − 2)]/(x − 1)³
= [(x + 1)²(x − 5)]/(x − 1)³

Answer: dy/dx = (x + 1)²(x − 5)/(x − 1)³

Applications: Rates of Change
Rate of change problems involve finding how one quantity changes with respect to another.
Example 13: The radius of a circle is increasing at 2 cm/s. Find the rate at which the area is increasing when r = 5 cm.
Solution:
Given: dr/dt = 2 cm/s Find: dA/dt when r = 5
Area: A = πr² dA/dr = 2πr Using chain rule:
dA/dt = (dA/dr) × (dr/dt)
= 2πr × 2
= 4πr

When r = 5:
dA/dt = 4π(5) = 20π ≈ 62.83 cm²/s
Answer: 20π cm²/s or approximately 62.83 cm²/s
Example 14: A spherical balloon is being inflated. Its radius is increasing at 3 cm/s. Find the rate of increase of: a) Surface area when r = 10 cm b) Volume when r = 10 cm
Solution:
Given: dr/dt = 3 cm/s

Surface Area: S = 4πr² dS/dr = 8πr

dS/dt = (dS/dr) × (dr/dt)
= 8πr × 3
= 24πr

When r = 10:
dS/dt = 24π(10) = 240π ≈ 753.98 cm²/s

Volume: V = (4/3)πr³ dV/dr = 4πr²

dV/dt = (dV/dr) × (dr/dt)
= 4πr² × 3
= 12πr²

When r = 10:
dV/dt = 12π(100) = 1200π ≈ 3,769.91 cm³/s

Answer: a) 240π cm²/s b) 1200π cm³/s
Example 15: Water is being poured into a cylindrical tank at 100 cm³/s. The tank has radius 5 cm. How fast is the water level rising?
Solution:
Given: dV/dt = 100 cm³/s, r = 5 cm (constant) Find: dh/dt

Volume of cylinder: V = πr²h = π(25)h = 25πh dV/dh = 25π
dV/dt = (dV/dh) × (dh/dt)
100 = 25π × (dh/dt) dh/dt = 100/(25π)
= 4/π
≈ 1.27 cm/s

Answer: 4/π ≈ 1.27 cm/s
Maximum and Minimum Values (Introduction)
A function has:
Maximum at x = a if f(a) ≥ f(x) for all x near a
Minimum at x = a if f(a) ≤ f(x) for all x near a
Critical points occur where f'(x) = 0 or f'(x) is undefined.
Diagram 23: Maximum and Minimum
y
|	/\ ← maximum (f' = 0)
| / \
| /	\
|/	\
|	\ ← minimum (f' = 0)
|	\/
|	x
To find maximum/minimum:
Find f'(x)
Set f'(x) = 0 and solve for x
Test values or use second derivative to classify
Example 16: Find the stationary points of f(x) = x³ − 3x² − 9x + 5
Solution:
f'(x) = 3x² − 6x − 9

Set f'(x) = 0:
3x² − 6x − 9 = 0 x² − 2x − 3 = 0 (x − 3)(x + 1) = 0
x = 3 or x = −1

Find y-coordinates:
f(3) = 27 − 27 − 27 + 5 = −22
f(−1) = −1 − 3 + 9 + 5 = 10

Stationary points: (−1, 10) and (3, −22)

To determine which is maximum/minimum, we check the second derivative (covered more in detail later) or test values:
f''(x) = 6x − 6

At x = −1: f''(−1) = −6 − 6 = −12 < 0 → Maximum
At x = 3: f''(3) = 18 − 6 = 12 > 0 → Minimum
Answer: Maximum at (−1, 10); Minimum at (3, −22) Example 17: Find the maximum value of y = 12x − x² for x > 0. Solution:
dy/dx = 12 − 2x

Set dy/dx = 0:
12 − 2x = 0
x = 6

y = 12(6) − 36 = 72 − 36 = 36

Check it's a maximum:
d²y/dx² = −2 < 0 → Maximum ✓
Answer: Maximum value is 36 at x = 6

Application to Business and Economics
Marginal Cost: Rate of change of total cost with respect to quantity. Marginal Revenue: Rate of change of total revenue with respect to quantity. Marginal Profit: Rate of change of profit with respect to quantity.
Example 18: The total cost of producing x units is C(x) = 100 + 5x + 0.02x². Find: a) Marginal cost function b) Marginal cost when x = 50 c) Cost of producing the 51st unit (approximately)
Solution:
Marginal Cost MC = dC/dx = 5 + 0.04x

When x = 50:
MC(50) = 5 + 0.04(50) = 5 + 2 = ₦7 per unit

Cost of 51st unit ≈ MC(50) = ₦7

Answer: a) MC = 5 + 0.04x b) ₦7 c) ₦7
Example 19: A company's revenue function is R(x) = 200x − 2x² and cost function is C(x) = 50
+ 20x where x is quantity in thousands.
Find: a) Profit function b) Marginal profit c) Quantity that maximizes profit
Solution:
Profit P(x) = R(x) − C(x)
P(x) = (200x − 2x²) − (50 + 20x) P(x) = −2x² + 180x − 50
Marginal Profit MP = dP/dx = −4x + 180

For maximum profit, set MP = 0:
−4x + 180 = 0
x = 45 thousand units

Check: d²P/dx² = −4 < 0 → Maximum ✓

Maximum profit:
P(45) = −2(45)² + 180(45) − 50
= −4,050 + 8,100 − 50
= ₦4,000 thousand

Answer: a) P(x) = −2x² + 180x − 50 b) MP = −4x + 180 c) 45,000 units

Example 20: In the stock market, the price of a share (in ₦) after t hours of trading is modeled by P(t) = t³ − 6t² + 9t + 100 for 0 ≤ t ≤ 5. Find: a) Rate of price change at any time t b) When is the price increasing most rapidly? c) When does the price stop falling and start rising?
Solution:
Rate of change = dP/dt = 3t² − 12t + 9

For most rapid increase, find maximum of dP/dt: d²P/dt² = 6t − 12

Set = 0: 6t − 12 = 0 → t = 2

But we need to check endpoints too:
dP/dt(0) = 9
dP/dt(2) = 3(4) − 12(2) + 9 = 12 − 24 + 9 = −3
dP/dt(5) = 3(25) − 12(5) + 9 = 75 − 60 + 9 = 24

Most rapid increase at t = 5 hours

Price stops falling when dP/dt = 0: 3t² − 12t + 9 = 0
t² − 4t + 3 = 0 (t − 1)(t − 3) = 0
t = 1 or t = 3

Check which is minimum:
At t = 1: d²P/dt² = 6(1) − 12 = −6 < 0 → Maximum
At t = 3: d²P/dt² = 6(3) − 12 = 6 > 0 → Minimum

Price stops falling and starts rising at t = 3 hours

Answer: a) dP/dt = 3t² − 12t + 9 b) t = 5 hours c) t = 3 hours
Optimization Problems
Finding maximum or minimum values in practical situations.
Example 21: A farmer has 200 m of fencing to enclose a rectangular plot. Find the dimensions that give maximum area.
Solution:
Let length = x, width = y

Perimeter: 2x + 2y = 200
y = 100 − x

Area: A = xy = x(100 − x) = 100x − x² dA/dx = 100 − 2x
Set = 0: 100 − 2x = 0
x = 50 m

Then: y = 100 − 50 = 50 m

Check: d²A/dx² = −2 < 0 → Maximum ✓

Maximum area = 50 × 50 = 2,500 m²

Answer: Square with side 50 m gives maximum area of 2,500 m²

Example 22: A box with square base and open top is to have volume 32 cm³. Find dimensions that minimize surface area.
Solution:
Let base side = x, height = h

Volume: x²h = 32
h = 32/x²

Surface area (no top): S = x² + 4xh
= x² + 4x(32/x²)
= x² + 128/x
= x² + 128x⁻¹

dS/dx = 2x − 128x⁻²
= 2x − 128/x²

Set = 0: 2x − 128/x² = 0
2x³ = 128
x³ = 64 x = 4 cm

h = 32/16 = 2 cm

Check: d²S/dx² = 2 + 256/x³
At x = 4: 2 + 256/64 = 2 + 4 = 6 > 0 → Minimum ✓
Answer: Base 4 cm × 4 cm, height 2 cm

EVALUATION
Differentiate using the product rule: y = (2x + 3)(x² − 1)
Use the quotient rule to find dy/dx if y = (3x + 1)/(x − 2)
Differentiate using the chain rule: y = (5x − 3)⁴
Find f'(x) if f(x) = x(x + 1)³
Differentiate: y = √(x² + 4)
A cube's edge is increasing at 2 cm/s. Find the rate of volume increase when edge = 5 cm.
Find stationary points of f(x) = x³ − 12x + 5
The cost function is C(x) = 100 + 10x + 0.5x². Find marginal cost when x = 20.
Find dy/dx if y = (2x + 1)²/(x − 3)
Maximize the area of a rectangle with perimeter 60 m.

ASSIGNMENT
1.	Product Rule: Differentiate: a) y = (x² + 2)(x³ − 4) b) y = (3x + 1)(2x² + 5x − 3) c) y = x³(x − 2)⁴	d) f(x) = (x² + 1)(√x + 3)
2.	Quotient Rule: Find dy/dx: a) y = (x + 1)/(x − 1) b) y = (2x² + 3)/(x + 2) c) y = x/(x² + 4) d) y = (x² − 1)/(x² + 1)
3.	Chain Rule: Differentiate: a) y = (4x − 7)⁶ b) y = (x² + 3x − 1)⁵ c) y = √(5x + 2) d) y = 1/(3x − 4)³ e) f(x) = (2x² − x
+ 1)^(−2)
4.	Combined Rules: Find dy/dx: a) y = x²(2x + 1)⁵ b) y = (x + 3)⁴  /(x − 2) c) y = √(x² + 1)	(x − 1) d) y = (x² + 1)³/(2x
– 1)²
Related Rates: a) The radius of a circle is increasing at 3 cm/s. Find the rate of increase of: i) Circumference when r = 10 cm ii) Area when r = 10 cm
A ladder 10 m long leans against a wall. The bottom slides away at 0.5 m/s. How fast is the top sliding down when the bottom is 6 m from the wall?
Water drains from a conical tank (vertex down) at 2 m³/min. If radius = 4 m and height = 6 m, how fast is the water level falling when depth = 3 m?
Maxima and Minima: a) Find and classify all stationary points: i) f(x) = x³ − 6x² + 9x + 2 ii) y = 2x³ + 3x² − 12x + 5
Find maximum and minimum values of f(x) = x⁴	− 8x² + 3 for −3 ≤ x ≤ 3
A rectangle has perimeter 40 cm. Find dimensions for maximum area.
Find two positive numbers whose sum is 20 and whose product is maximum.
Business Applications: a) Total revenue from selling x units is R(x) = 50x − 0.5x². Find: i) Marginal revenue function ii) Revenue-maximizing quantity iii) Maximum revenue
Cost function: C(x) = 200 + 30x + 0.1x² Revenue function: R(x) = 80x − 0.2x² Find: i) Profit function ii)
Marginal profit iii) Profit-maximizing quantity iv) Maximum profit
A company's profit (in ₦1000s) after t years is P(t) = −t³ + 15t² + 72t. Find: i) Rate of profit growth at any time ii) When profit is increasing fastest iii) Maximum profit and when it occurs
Optimization: a) A rectangular garden is to be fenced on three sides (fourth side is a wall). If 60 m of fencing is available, find dimensions for maximum area.
A cylindrical can is to contain 1000 cm³. Find dimensions that minimize surface area.
A wire 100 cm long is cut into two pieces. One forms a square, the other a circle. How should it be cut to: i) Minimize total area? ii) Maximize total area?

WEEK 8: INTEGRATION OF ALGEBRAIC FUNCTIONS
CONTENT
Introduction to Integration
Integration is the reverse process of differentiation. It is also called anti-differentiation. Two main types:
Indefinite Integration: Finding the general anti-derivative (includes constant C)
Definite Integration: Finding area under a curve between limits Notation: ∫ f(x) dx reads as "integral of f(x) with respect to x" Relationship with Differentiation:
If d/dx[F(x)] = f(x), then ∫ f(x) dx = F(x) + C

Where C is the constant of integration (because derivative of a constant is zero).

Standard Integrals
From differentiation formulas, we derive integration formulas:
Basic Integration Formulas:

Function f(x)Integral ∫f(x)dxk (constant)kx + Cxx²/2 + Cx²x³/3 + Cxⁿ (n ≠ −1)xⁿ⁺¹/(n+1) + C1/x = x⁻¹ln1/x²−1/x + C√x(2/3)x^(3/2) + Ceˣeˣ + CPower Rule for Integration: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C (where n ≠ −1)
Rules of Integration:
Constant Multiple Rule: ∫ kf(x) dx = k∫ f(x) dx
Sum Rule: ∫ [f(x) + g(x)] dx = ∫ f(x) dx + ∫ g(x) dx
Difference Rule: ∫ [f(x) − g(x)] dx = ∫ f(x) dx − ∫ g(x) dx
Example 1: Integrate: ∫ 5x³ dx
Solution:
∫ 5x³ dx = 5 ∫ x³ dx
= 5 × x⁴/4 + C
= (5x⁴)/4 + C

Answer: (5x⁴)/4 + C
Verification: d/dx[(5x⁴)/4 + C] = 5x³ ✓ Example 2: Find ∫ (3x² + 4x − 5) dx Solution:
∫ (3x² + 4x − 5) dx = ∫ 3x² dx + ∫ 4x dx − ∫ 5 dx
= 3(x³/3) + 4(x²/2) − 5x + C
= x³ + 2x² − 5x + C

Answer: x³ + 2x² − 5x + C
Example 3: Integrate: ∫ (2x⁴ − 5x² + 7) dx
Solution:
∫ (2x⁴ − 5x² + 7) dx = 2(x⁵/5) − 5(x³/3) + 7x + C
= (2x⁵)/5 − (5x³)/3 + 7x + C

Answer: (2x⁵)/5 − (5x³)/3 + 7x + C Example 4: Find ∫ (1/x²) dx Solution:
∫ (1/x²) dx = ∫ x⁻² dx
= x⁻¹/(−1) + C
= −1/x + C

Answer: −1/x + C
Example 5: Integrate: ∫ √x dx
Solution:
∫ √x dx = ∫ x^(1/2) dx
= x^(3/2)/(3/2) + C
= (2/3)x^(3/2) + C
= (2/3)x√x + C Answer: (2/3)x^(3/2) + C Example 6: Find ∫ (3/√x) dx Solution:
∫ (3/√x) dx = ∫ 3x^(−1/2) dx
= 3 × x^(1/2)/(1/2) + C
= 3 × 2x^(1/2) + C
= 6√x + C

Answer: 6√x + C
Example 7: Integrate: ∫ [(2x³ − 5x + 3)/x²] dx
Solution:
First simplify by dividing each term:
(2x³ − 5x + 3)/x² = 2x − 5x⁻¹ + 3x⁻²

∫ (2x − 5x⁻¹ + 3x⁻²) dx = 2(x²/2) − 5 ln|x| + 3(x⁻¹/(−1)) + C
= x² − 5 ln|x| − 3/x + C

Answer: x² − 5 ln|x| − 3/x + C

Finding Constants Using Initial Conditions
When given additional information, we can find the specific value of C. Example 8: Given dy/dx = 6x² + 4 and y = 10 when x = 1, find y in terms of x. Solution:
Integrate:
y = ∫ (6x² + 4) dx y = 6(x³/3) + 4x + C y = 2x³ + 4x + C

Use initial condition y = 10 when x = 1:
10 = 2(1)³ + 4(1) + C
10 = 2 + 4 + C
C = 4

Therefore: y = 2x³ + 4x + 4

Answer: y = 2x³ + 4x + 4
Example 9: A curve passes through (2, 7) and has gradient function dy/dx = 3x² − 6x + 2. Find the equation of the curve.
Solution:
y = ∫ (3x² − 6x + 2) dx y = x³ − 3x² + 2x + C

At (2, 7):
7 = (2)³ − 3(2)² + 2(2) + C
7 = 8 − 12 + 4 + C
7 = 0 + C
C = 7

Equation: y = x³ − 3x² + 2x + 7

Answer: y = x³ − 3x² + 2x + 7

Definite Integration
Definite integral gives the area under a curve between two limits.
Notation: ∫ₐᵇ f(x) dx reads as "integral of f(x) from a to b" where a = lower limit, b = upper limit
Fundamental Theorem of Calculus: ∫ₐᵇ f(x) dx = [F(x)]ₐᵇ = F(b) − F(a)
Where F(x) is the anti-derivative of f(x). Example 10: Evaluate ∫₁³ x² dx Solution:
∫₁³ x² dx = [x³/3]₁³
= (3³/3) − (1³/3)
= 27/3 − 1/3
= 26/3

Answer: 26/3 or 8⅔
Example 11: Evaluate ∫₀² (3x² + 2x) dx
Solution:
∫₀² (3x² + 2x) dx = [x³ + x²]₀²
= (2³ + 2²) − (0³ + 0²)
= 8 + 4 − 0
= 12

Answer: 12

Example 12: Find ∫₁⁴ (2√x + 1/√x) dx
Solution:
∫₁⁴ (2x^(1/2) + x^(−1/2)) dx = [2(x^(3/2))/(3/2) + 2x^(1/2)]₁⁴
= [(4x^(3/2))/3 + 2√x]₁⁴
= [(4(4)^(3/2))/3 + 2√4] − [(4(1)^(3/2))/3 +
2√1]
= [32/3 + 4] − [4/3 + 2]
= 44/3 − 10/3
= 34/3

Answer: 34/3 or 11⅓
Properties of Definite Integrals:

∫ₐᵇ f(x) dx = −∫ᵇₐ f(x) dx (reversing limits changes sign)
∫ₐᵃ f(x) dx = 0 (same limits)
∫ₐᵇ f(x) dx + ∫ᵇᶜ f(x) dx = ∫ₐᶜ f(x) dx (additivity)
∫ₐᵇ k·f(x) dx = k∫ₐᵇ f(x) dx (constant multiple)

Integration by Substitution
When an integral is in the form ∫ f(g(x))·g'(x) dx, we can use substitution.
Method:
Let u = g(x)
Find du = g'(x) dx
Rewrite integral in terms of u
Integrate
Substitute back
Example 13: Find ∫ 2x(x² + 1)⁵ dx
Solution:
Let u = x² + 1
Then du/dx = 2x, so du = 2x dx

∫ 2x(x² + 1)⁵ dx = ∫ u⁵ du
= u⁶/6 + C
= (x² + 1)⁶/6 + C

Answer: (x² + 1)⁶/6 + C
Example 14: Integrate: ∫ 3x²(x³ − 2)⁷ dx
Solution:
Let u = x³ − 2 du = 3x² dx

∫ 3x²(x³ − 2)⁷ dx = ∫ u⁷ du
= u⁸/8 + C
= (x³ − 2)⁸/8 + C

Answer: (x³ − 2)⁸/8 + C

Example 15: Find ∫ x/√(x² + 1) dx
Solution:
Let u = x² + 1
du = 2x dx, so x dx = du/2

∫ x/√(x² + 1) dx = ∫ (1/√u) · (du/2)
= (1/2) ∫ u^(−1/2) du
= (1/2) · 2u^(1/2) + C
= √u + C
= √(x² + 1) + C

Answer: √(x² + 1) + C

Definite Integration with Substitution:
Method 1: Change limits with substitution Method 2: Integrate, substitute back, then use original limits
Example 16: Evaluate ∫₀¹ x(x² + 1)³ dx
Solution (Method 2):
First find indefinite integral:
Let u = x² + 1, du = 2x dx, x dx = du/2

∫ x(x² + 1)³ dx = ∫ u³ · (du/2)
= (1/2) · u⁴/4 + C
= u⁴/8 + C
= (x² + 1)⁴/8 + C

Now evaluate from 0 to 1:
[(x² + 1)⁴/8]₀¹ = (1 + 1)⁴/8 − (0 + 1)⁴/8
= 16/8 − 1/8
= 15/8

Answer: 15/8

Applications of Integration
Area Under a Curve
The definite integral ∫ₐᵇ f(x) dx gives the area between the curve y = f(x), the x-axis, and the lines x = a and x = b.
Diagram 24: Area Under Curve
y
|
|	/	\
| /	\
|_/		\	x a	b

Area = ∫ₐᵇ f(x) dx

Example 17: Find the area under y = x² from x = 0 to x = 3.
Solution:
Area = ∫₀³ x² dx
= [x³/3]₀³
= 27/3 − 0
= 9 square units

Answer: 9 square units

Example 18: Calculate the area bounded by y = 4 − x², the x-axis, and x = 0 and x = 2.
Solution:
Area = ∫₀² (4 − x²) dx
= [4x − x³/3]₀²
= [8 − 8/3] − 0
= 24/3 − 8/3
= 16/3 square units

Answer: 16/3 square units
Distance from Velocity
If v(t) is velocity, then distance = ∫v(t) dt

Example 19: A particle moves with velocity v = 3t² + 2t m/s. Find the distance traveled in the first 4 seconds.
Solution:
Distance = ∫₀⁴ (3t² + 2t) dt
= [t³ + t²]₀⁴
= (64 + 16) − 0
= 80 meters

Answer: 80 meters
Business Applications
Total Cost from Marginal Cost: If MC = marginal cost, then Total Cost = ∫MC dx + Fixed Cost
Example 20: Marginal cost is MC = 3x² + 20. Fixed cost is ₦500. Find total cost of producing 10 units.
Solution:
Total Cost = ∫₀¹⁰ (3x² + 20) dx + 500
= [x³ + 20x]₀¹⁰ + 500
= (1000 + 200) − 0 + 500
= ₦1,700

Answer: ₦1,700
Example 21: A company's marginal revenue is MR = 100 − 2x. Find: a) Total revenue function
b) Revenue from selling 20 units
Solution:
TR = ∫ MR dx
TR = ∫ (100 − 2x) dx TR = 100x − x² + C

If no revenue when x = 0: TR(0) = 0 So C = 0

TR = 100x − x²

b) TR(20) = 100(20) − (20)²
= 2000 − 400
= ₦1,600

Answer: a) TR = 100x − x² b) ₦1,600

Summary of Integration Techniques
Choosing Method:
Standard forms: Use direct integration
Function of a function: Use substitution
Products: May need integration by parts (advanced)
Rational functions: May need partial fractions (advanced)

EVALUATION
Find ∫ 4x³ dx
Integrate: ∫ (2x² − 5x + 3) dx
Evaluate: ∫₁ ⁴	x² dx
Given dy/dx = 6x − 2 and y = 5 when x = 1, find y.
Find ∫ (1/x³) dx
Integrate: ∫ 2x(x² + 1)⁴	dx
Evaluate: ∫₀ ² (x² + 2x) dx
Find the area under y = 2x + 1 from x = 0 to x = 3.
Marginal cost is MC = 5x + 10. If fixed cost is ₦200, find total cost for 8 units.
Find ∫ √x dx

ASSIGNMENT
Basic Integration: Find: a) ∫ 6x⁵ dx b) ∫ (4x³ − 3x² + 2x − 5) dx c) ∫ (5x⁴	+ 3x² − 7) dx d) ∫ (x⁶ − 2x⁴
+ 3x² − 1) dx
Integration with Fractions: Integrate: a) ∫ (1/x⁴  ) dx b) ∫ (3/x²) dx c) ∫ (2/√x) dx d) ∫ [(x³ + 2x² − 5)/x²] dx
Finding Particular Solutions: a) dy/dx = 4x³ + 6x and y = 8 when x = 1. Find y.
A curve has gradient 3x² − 4x + 1 and passes through (2, 5). Find its equation.
dy/dx = 2x + 3 and y = 10 when x = 2. Find y(5).
Definite Integration: Evaluate: a) ∫₁  ³ x³ dx b) ∫₀  ⁴	(2x² + 3x) dx c) ∫₁  ⁴	(√x + 1/√x) dx d)
∫₂  ⁵ (x − 1)² dx
Integration by Substitution: Find: a) ∫ 4x(x² + 1)⁶ dx b) ∫ 6x²(x³ − 2)⁵ dx c) ∫ x²(x³ + 1)⁷ dx d) ∫₀  ¹ 2x(x² + 3)⁴	dx
Area Under Curves: a) Find area under y = x³ from x = 0 to x = 2.
Calculate area bounded by y = 9 − x², the x-axis, x = 0, and x = 3.
Find area under y = 2x + 3 from x = 1 to x = 4.
Motion Problems: a) Velocity is v = 2t² + 3t m/s. Find distance traveled in first 5 seconds.
A particle's acceleration is a = 6t − 4 m/s². If initial velocity is 5 m/s, find: i) Velocity after t seconds ii)
Velocity after 3 seconds
Position is given by s = ∫(4t + 3) dt. If s = 10 when t = 2, find s when t = 5.
Business Applications: a) Marginal cost MC = 6x + 15. Fixed cost = ₦300. Find: i) Total cost function ii) Cost of producing 10 units
Marginal revenue MR = 80 − 4x. Find: i) Total revenue function (assume TR(0) = 0) ii) Revenue from 10 units
Marginal profit MP = 40 − 2x. Find total profit from producing units 5 to 15.

WEEK 9: FUNCTIONS AND MAPPING
CONTENT
Concept of a Function
A function is a special relationship where each input has exactly one output.
Definition: A function f from set A to set B assigns to each element in A exactly one element in B.
Notation:
f: A → B (f maps A to B)
f(x) = y (f of x equals y)
y = f(x) (y is a function of x)
Diagram 25: Function Concept
Set A (Domain)	Function f	Set B (Range)
•──────────────────────────→ • 1	2

•──────────────────────────→ • 2	4

•──────────────────────────→ • 3	6

f(x) = 2x
Each input has exactly one output

Examples of Functions:
f(x) = 2x + 3
g(x) = x²
h(x) = √x
k(x) = 1/x (for x ≠ 0)
Non-examples (Not Functions):
x² + y² = 1 (one x gives two y values)
y² = x (one x can give two y values: ±√x) Example 1: If f(x) = 3x − 5, find: a) f(2) b) f(−1) c) f(0) Solution:
a) f(2) = 3(2) − 5 = 6 − 5 = 1

b) f(−1) = 3(−1) − 5 = −3 − 5 = −8

c) f(0) = 3(0) − 5 = 0 − 5 = −5

Answer: a) 1 b) −8 c) −5
Example 2: Given g(x) = x² + 2x, find: a) g(3) b) g(−2) c) g(a + 1)
Solution:
a) g(3) = 3² + 2(3) = 9 + 6 = 15

b) g(−2) = (−2)² + 2(−2) = 4 − 4 = 0

c) g(a + 1) = (a + 1)² + 2(a + 1)
= a² + 2a + 1 + 2a + 2
= a² + 4a + 3

Answer: a) 15 b) 0 c) a² + 4a + 3

Domain, Codomain, and Range
Domain: Set of all possible input values (x-values) Codomain: Set containing all possible output values Range: Set of actual output values (subset of codomain)
Diagram 26: Domain, Codomain, Range
Domain		Codomain A	f		B
•─────────────→ •
•─────────────→ • ← Range
•─────────────→ •	(actual outputs)
• ← Not in range

Domain = {all inputs used} Range = {all outputs produced}
Codomain = {all possible outputs}

Example 3: For f(x) = x² where x ∈ {−2, −1, 0, 1, 2}, find: a) Domain b) Range c) Is it one-to- one?
Solution:
a) Domain = {−2, −1, 0, 1, 2}

Calculate outputs: f(−2) = 4
f(−1) = 1
f(0) = 0
f(1) = 1
f(2) = 4

Range = {0, 1, 4}

Not one-to-one because f(−2) = f(2) = 4 (Different inputs give same output)

Example 4: Find the domain of: a) f(x) = 1/(x − 3) b) g(x) = √(x + 2) c) h(x) = x² + 5
Solution:
Cannot divide by zero: x − 3 ≠ 0
x ≠ 3
Domain: All real numbers except 3 Or: {x ∈ ℝ : x ≠ 3}

Cannot take square root of negative: x + 2 ≥ 0
x ≥ −2
Domain: {x ∈ ℝ : x ≥ −2}

No restrictions
Domain: All real numbers ℝ

Types of Functions
One-to-One Function (Injective) Each output comes from exactly one input. Different inputs → different outputs
Diagram 27: One-to-One
A	B
•────────→ •
•────────→ •
•────────→ •

Each element in B has
at most one arrow pointing to it

Test: Horizontal line intersects graph at most once.
Example: f(x) = 2x + 1 is one-to-one

Onto Function (Surjective) Every element in codomain is an output. Range = Codomain

Diagram 28: Onto
A	B
•────────→ •
\	↗
•────→ •
\	↗
•→ •

Every element in B
has at least one arrow pointing to it

One-to-One and Onto (Bijective) Both one-to-one and onto. Perfect pairing.
Many-to-One Different inputs can give same output.
Example: f(x) = x² is many-to-one (Both 2 and −2 map to 4)
Example 5: Determine if f: {1, 2, 3} → {2, 4, 6} defined by f(x) = 2x is: a) One-to-one b) Onto
Solution:
Mappings:
f(1) = 2
f(2) = 4
f(3) = 6

One-to-one? YES
(Each output comes from exactly one input)

Onto? YES
(Range = {2, 4, 6} = Codomain) Therefore: f is bijective

Inverse Functions
If f maps x to y, then f⁻¹ (inverse function) maps y back to x. Condition: Function must be one-to-one to have an inverse. Finding Inverse:
Write y = f(x)
Swap x and y
Solve for y
Write as f⁻¹(x) = ...
Property: f(f⁻¹(x)) = x and f⁻¹(f(x)) = x
Example 6: Find the inverse of f(x) = 3x − 5
Solution:
Step 1: y = 3x − 5
Step 2: Swap: x = 3y − 5 Step 3: Solve for y:
x + 5 = 3y
y = (x + 5)/3

Step 4: f⁻¹(x) = (x + 5)/3

Verification:
f(f⁻¹(x)) = 3[(x + 5)/3] − 5 = x + 5 − 5 = x ✓
f⁻¹(f(x)) = [(3x − 5) + 5]/3 = 3x/3 = x ✓
Answer: f⁻¹(x) = (x + 5)/3
Example 7: Find f⁻¹ if f(x) = (2x + 1)/(x − 3)
Solution:
y = (2x + 1)/(x − 3)
Swap: x = (2y + 1)/(y − 3) Solve:
x(y − 3) = 2y + 1
xy − 3x = 2y + 1 xy − 2y = 3x + 1 y(x − 2) = 3x + 1
y = (3x + 1)/(x − 2)

f⁻¹(x) = (3x + 1)/(x − 2) Answer: f⁻¹(x) = (3x + 1)/(x − 2) Example 8: If f(x) = x³ + 2, find f⁻¹(10). Solution:
Method 1: Find complete inverse
y = x³ + 2 x = y³ + 2 x − 2 = y³
y = ³√(x − 2)

f⁻¹(x) = ³√(x − 2)
f⁻¹(10) = ³√(10 − 2) = ³√8 = 2
Method 2: Use property f(f⁻¹(10)) = 10
Find x such that f(x) = 10:
x³ + 2 = 10
x³ = 8
x = 2

Therefore f⁻¹(10) = 2

Answer: 2

Composite Functions
Composite function (function of a function): Apply one function, then apply another to the result.
Notation:
(g ∘ f)(x) = g(f(x)) "g of f of x"
Read right to left: apply f first, then g
Example 9: If f(x) = 2x + 3 and g(x) = x², find: a) (g ∘ f)(x) b) (f ∘ g)(x) c) (g ∘ f)(1)
Solution:
a) (g ∘	f)(x) = g(f(x))
= g(2x + 3)
= (2x + 3)²
= 4x² + 12x + 9

b) (f ∘	g)(x) = f(g(x))
= f(x²)
= 2(x²) + 3
= 2x² + 3

c) (g ∘	f)(1) = 4(1)² + 12(1) + 9
= 4 + 12 + 9
= 25
Note: Generally, (g ∘ f) ≠ (f ∘ g)
Answer: a) 4x² + 12x + 9 b) 2x² + 3 c) 25
Example 10: Given f(x) = x + 1 and g(x) = x/(x − 2), find: a) (f ∘ g)(x) b) (g ∘ f)(x)
Solution:
a) (f ∘	g)(x) = f[x/(x − 2)]
= x/(x − 2) + 1
= x/(x − 2) + (x − 2)/(x − 2)
= [x + x − 2]/(x − 2)
= (2x − 2)/(x − 2)
= 2(x − 1)/(x − 2)

b) (g ∘	f)(x) = g(x + 1)
= (x + 1)/[(x + 1) − 2]
= (x + 1)/(x − 1)

Answer: a) 2(x − 1)/(x − 2) b) (x + 1)/(x − 1)
Example 11: If f(x) = 2x − 1, find f such that (f ∘ f)(x) = 4x − 3.
Solution:
(f ∘	f)(x) = f(f(x))
= f(2x − 1)
= 2(2x − 1) − 1
= 4x − 2 − 1
= 4x − 3 ✓

This confirms f(x) = 2x – 1

Graphing Functions Common Function Graphs: Linear: y = mx + c
Straight line
Slope = m
y-intercept = c
Quadratic: y = ax² + bx + c
Parabola
Opens up if a > 0
Opens down if a < 0
Cubic: y = ax³ + ...
S-shaped curve
Reciprocal: y = 1/x
Hyperbola
Asymptotes at x = 0, y = 0 Example 12: Sketch y = x² − 4x + 3 Solution:
Find key features:

y-intercept (x = 0): y = 0 − 0 + 3 = 3 Point: (0, 3)

x-intercepts (y = 0): x² − 4x + 3 = 0
(x − 1)(x − 3) = 0
x = 1 or x = 3
Points: (1, 0) and (3, 0)

Vertex (x = −b/2a): x = 4/2 = 2
y = 4 − 8 + 3 = −1
Vertex: (2, −1)

Diagram 29: Parabola
y
3 • (0,3)
|
|
────•───────•──── x 1	•	3
(2,−1)
vertex

Opens upward (a = 1 > 0)

EVALUATION
1.	If f(x) = 4x − 7, find f(3).
Given g(x) = x² − 2x, find g(−1).
Find the domain of f(x) = 1/(x + 2).
Find the inverse of f(x) = 5x + 3.
5.	If f(x) = 2x + 1 and g(x) = x², find (g ∘ f)(2).
6.	Is f(x) = x³ a one-to-one function?
7.	If f(x) = (x − 1)/(x + 2), find f⁻  ¹(x).
Given f(x) = 3x − 5, find f(f(2)).
Find the range of f(x) = x² for x ∈ {−2, −1, 0, 1, 2}.
If f(x) = √x, what is the domain?

ASSIGNMENT
Function Evaluation: a) If f(x) = 3x² − 2x + 1, find: i) f(2) ii) f(−1) iii) f(0) iv) f(a + 1)
b) Given g(x) = (2x − 3)/(x + 1), find: i) g(2) ii) g(−2) iii) Value of x when g(x) = 1
Domain and Range: Find the domain of: a) f(x) = 1/(2x − 5) b) g(x) = √(3x + 6) c) h(x) = 1/(x² − 9) d) k(x) = √(4
– x²)
Inverse Functions: Find the inverse: a) f(x) = 4x − 7 b) g(x) = (x + 3)/2 c) h(x) = x³ − 5 d) k(x) = (3x − 1)/(x + 2) Verify each by showing f(f⁻ ¹(x)) = x.
Composite Functions: Given f(x) = 2x + 3 and g(x) = x² − 1, find: a) (f ∘  g)(x) b) (g ∘  f)(x) c) (f ∘  g)(2) d) (g
f)(−1) e) (f ∘  f)(x) f) (g ∘  g)(1)
Function Types: For each function f: A → B, determine if it's one-to-one, onto, or both: a) f: {1, 2, 3} → {2, 4, 6}, f(x) = 2x b) f: {−1, 0, 1} → {0, 1}, f(x) = x² c) f: ℝ  → ℝ , f(x) = 3x − 5
Mixed Problems: a) If f(x) = 2x − 5 and f(a) = 11, find a.
Given g(x) = x² + kx and g(2) = 10, find k.
If (f ∘  g)(x) = 4x² + 12x + 9 and f(x) = x², find g(x).
d) Find f⁻ ¹(5) if f(x) = 2x³ − 7.
Graphing: Sketch the following, showing key features (intercepts, vertex if applicable): a) y = 2x − 3 b) y = x² + 2x − 3 c) y = (x − 2)² d) y = 1/x

WEEK 10: GENERAL REVIEW OF CALCULUS
CONTENT
Review of Differentiation
Key Formulas:
Power Rule: d/dx(xⁿ) = nxⁿ⁻¹
Product Rule: d/dx(uv) = u(dv/dx) + v(du/dx)
Quotient Rule: d/dx(u/v) = [v(du/dx) − u(dv/dx)]/v²
Chain Rule: d/dx[f(g(x))] = f'(g(x))·g'(x) Review Example 1: Differentiate y = (x² + 1)³(2x − 5) Solution:
Use product rule with chain rule:

u = (x² + 1)³
u' = 3(x² + 1)² · 2x = 6x(x² + 1)²

v = 2x − 5 v' = 2

dy/dx = (x² + 1)³ · 2 + (2x − 5) · 6x(x² + 1)²
= 2(x² + 1)³ + 6x(2x − 5)(x² + 1)²
= 2(x² + 1)²[(x² + 1) + 3x(2x − 5)]
= 2(x² + 1)²[x² + 1 + 6x² − 15x]
= 2(x² + 1)²(7x² − 15x + 1)

Review Example 2: Find f'(x) if f(x) = (3x + 2)/(x² − 1)
Solution:
Use quotient rule:

u = 3x + 2, u' = 3
v = x² − 1, v' = 2x

f'(x) = [(x² − 1)(3) − (3x + 2)(2x)]/(x² − 1)²
= [3x² − 3 − 6x² − 4x]/(x² − 1)²
= (−3x² − 4x − 3)/(x² − 1)²

Review of Integration
Key Formulas:
∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ −1)
∫k dx = kx + C
∫[f(x) + g(x)] dx = ∫f(x) dx + ∫g(x) dx Review Example 3: Find ∫(4x³ − 6x² + 5x − 2) dx Solution:
∫(4x³ − 6x² + 5x − 2) dx = 4(x⁴/4) − 6(x³/3) + 5(x²/2) − 2x + C
= x⁴ − 2x³ + (5x²)/2 − 2x + C

Review Example 4: Evaluate ∫₁³ (x² + 2x) dx
Solution:
∫₁³ (x² + 2x) dx = [x³/3 + x²]₁³
= (27/3 + 9) − (1/3 + 1)
= 9 + 9 − 1/3 − 1
= 17 − 1/3
= 50/3

Applications to Physics
Motion:
Position: s(t)
Velocity: v(t) = ds/dt
Acceleration: a(t) = dv/dt = d²s/dt²
Review Example 5: A particle moves according to s = t³ − 6t² + 9t where s is in meters and t in seconds. Find: a) Velocity and acceleration functions b) When the particle is at rest c) Distance traveled in first 4 seconds
Solution:
a) v = ds/dt = 3t² − 12t + 9 a = dv/dt = 6t − 12

At rest when v = 0: 3t² − 12t + 9 = 0 t² − 4t + 3 = 0
(t − 1)(t − 3) = 0
t = 1 or t = 3 seconds
Distance = ∫₀⁴ |v| dt Check sign of v:
v = 3(t − 1)(t − 3)

For 0 ≤ t < 1: v > 0
For 1 < t < 3: v < 0 For t > 3: v > 0
Distance = ∫₀¹ v dt − ∫₁³ v dt + ∫₃⁴ v dt [Working through the integration...]
= 2 − (−4) + 5 = 11 meters

Applications to Economics
Cost, Revenue, Profit:
Total Cost: TC(x)
Marginal Cost: MC = d(TC)/dx
Total Revenue: TR(x)
Marginal Revenue: MR = d(TR)/dx
Profit: P(x) = TR(x) − TC(x)
Marginal Profit: MP = MR − MC
Review Example 6: A company's total revenue is TR = 300x − 2x² and total cost is TC = 50 + 20x + x². Find: a) Marginal revenue and marginal cost b) Profit function c) Production level that maximizes profit d) Maximum profit
Solution:
MR = d(TR)/dx = 300 − 4x MC = d(TC)/dx = 20 + 2x

P = TR − TC
= (300x − 2x²) − (50 + 20x + x²)
= −3x² + 280x − 50

For maximum profit, dP/dx = 0: dP/dx = −6x + 280 = 0
x = 280/6 = 46.67 ≈ 47 units

Check: d²P/dx² = −6 < 0 → Maximum ✓

d) P(47) = −3(47)² + 280(47) − 50
≈ ₦6,483
Applications to Engineering
Review Example 7: The strength S of a rectangular beam is proportional to its width w and the square of its depth d: S = kwd². If a beam is cut from a cylindrical log of radius 10 cm, find dimensions for maximum strength.
Solution:
From Pythagoras: w² + d² = (20)² = 400
w² = 400 − d² w = √(400 − d²)
S = kwd² = k√(400 − d²) · d² To maximize, find dS/dd:
Let S = k·d²(400 − d²)^(1/2)

Using product and chain rules:
dS/dd = k[2d(400 − d²)^(1/2) + d² · (1/2)(400 − d²)^(−1/2) · (−2d)]
= k[2d(400 − d²)^(1/2) − d³(400 − d²)^(−1/2)]
= kd(400 − d²)^(−1/2)[2(400 − d²) − d²]
= kd(400 − d²)^(−1/2)(800 − 3d²)

Set = 0:
800 − 3d² = 0
d² = 800/3
d = √(800/3) ≈ 16.33 cm

w = √(400 − 800/3) = √(400/3) ≈ 11.55 cm

EVALUATION
Differentiate: y = (x² + 3)⁴
Find dy/dx if y = x²/(x + 1)
Integrate: ∫(3x² − 4x + 5) dx
Evaluate: ∫₀  ² x(x + 1) dx
A particle's position is s = 2t³ − 9t² + 12t. Find when it's at rest.
Marginal cost is MC = 4x + 10. Fixed cost is ₦100. Find total cost for 5 units.
Find maximum value of f(x) = −x² + 6x − 5.
If v = 3t² + 2t, find distance traveled from t = 1 to t = 3.
Differentiate: y = (2x − 1)³(x + 2)
Find area under y = x² + 1 from x = 0 to x = 2.

ASSIGNMENT
[Due to length, this section contains representative problems. Full assignment would be similar to previous weeks.]
Comprehensive Differentiation: a) y = (x³ − 2x)(x² + 5) b) y = (3x² + 1)/(2x − 3) c) y = (x² + 1)⁵ d) Find tangent to y = x³ at (1, 1)
Comprehensive Integration: a) ∫(x⁴	− 3x² + 2x) dx b) ∫₁  ⁴	(√x + 1/√x) dx c) ∫2x(x² + 1)⁴	dx d) Find area under y = 4 − x² from x = 0 to x = 2
Motion Problems: Complete analysis of s = t³ − 9t² + 24t including position, velocity, acceleration, and distance traveled.
Economics: Given TR = 400x − x² and TC = 100 + 50x, complete analysis including profit maximization.
Optimization: Design a cylindrical can with volume 500 cm³ to minimize surface area.
