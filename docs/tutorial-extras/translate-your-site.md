---
sidebar_position: 2
---

# Expression as Binary Trees
How do you represent an equation in a computer? We could do with a string, but that no fun for anyone. Instead, we do it with trees. Here is how it goes, almost everything is a node in the tree: operations, numbers, variables, functions, and so on. The operands of an operation or arguments to a function are children of said operand or function in the tree.

### The Naive Approach
Let us consider a simple tree implementation:
```cpp
struct Expression
{
  Expression *left, *right;
};

struct Add: public Expression { };

struct Real: public Expression
{
  double value;
};
``` 

While the above works for simple cases, it quickly becomes very messy when we want do more complicated things. For instance, to get values of out the tree, we must first do a `dynamic_cast` to get a Real or an Add. This became tedious for more complicated trees.

### The Templated Approach
What if we could simply "get" the numbers in an `Add`? We could go with templates:
```cpp
struct Expression { };

template <typename LeftT, typename RightT>
struct Add: public Expression {
  Left* left;
  Right* right;
};

struct Real: public Expression
{
  double value;
};
```
Great! Now can simply "get" the number on the left-hand side and we will a variable of type `Real` - assuming we have a number on the left-hand side. Passing this tree around also becomes tedious, what if instead of `Add<Real, Real>`, we had `Add<Add<Real, Real>, Real>`>? We could just pass an `Expression*` to it again, but then we're back to the same problem.

### The Oasis Approach
So it's a lot easier to pass around `Expression*`, but using templates makes it easier to actually work with. What if we just did both? In Oasis, each `Expression` has a `Generalize` method that returns an `std::unique<Oasis::Expression`, the status quo of passing expressions around. When you want to operate on the expression, you can use `Oasis::Specialize` to check if an expression is of a certain type and cast it if so!