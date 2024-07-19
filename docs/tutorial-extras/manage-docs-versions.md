---
sidebar_position: 1
---

# Implementing an Operation
Welcome developer! So you want to contribute to Oasis? Great! If you're working on `Simplify`, `Differentiate`, or `Integrate`, you can think of these functions as performing pattern matching on the structure of trees.

### The `Specialize` Function
For instance, suppose we have `std::unique_ptr<Oasis::Expression> expr`. We do not know much about `expr`, it could be anything. That's where the `Specialize` function comes in. We can give the `Specialize` function the type of the expression to check for, for example `Oasis::Add<Oasis::Real>` and it will return a `std::unique_ptr` to that if it satisfies the type or `nullptr` otherwise.

### Example
Let's see it in action!
```cpp
Oasis::Add add {
  Oasis::Real { 2 },
  Oasis::Real { 3 }
};

std::unique_ptr<Oasis::Expression> expr = add.Generalize();
// Oh no! we lost type information;

if (auto realCase = Add<Real>::Specialize(simplifiedAdd); realCase != nullptr) {
  const Real& firstReal = realCase->GetMostSigOp();
  const Real& secondReal = realCase->GetLeastSigOp();
  
  // We got type information back! Almost magical.
}
```

Now we do this a bunch of times for different scenarios, and boom! We are doing computer algebra.

### Wildcards
Ok this works pretty well for $2+2$. Now what about $2x+2x$? You could check for `Oasis::Add<Oasis::Multiply<Oasis::Real, Oasis::Variable` and do what you need to do, but then what about $2(x+y)+2(x+y)$? You could spend eons writing each individual case, or you can use wildcards. `Specialize` treats `Oasis::Expression` as a wildcard. For instance:

```cpp
  if (auto likeTermsCase = Add<Multiply<Real, Expression>>::Specialize(simplifiedAdd); likeTermsCase != nullptr) {
    const Oasis::IExpression auto& leftTerm = likeTermsCase->GetMostSigOp().GetLeastSigOp();
    const Oasis::IExpression auto& rightTerm = likeTermsCase->GetLeastSigOp().GetLeastSigOp(); 
     
    if (leftTerm.Equals(rightTerm)) {
      const Real& coefficient1 = likeTermsCase->GetMostSigOp().GetMostSigOp();
      const Real& coefficient2 = likeTermsCase->GetLeastSigOp().GetMostSigOp();
      // Do what you need to do
      }
    }
``` 

### Automatic Flipping
Now you may wonder about $2(x+y)+(y+x)2$. Do not worry, `Specialize` will try all possible orderings where appropriate for you! (Granted, it could be slow).