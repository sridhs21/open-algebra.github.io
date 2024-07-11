---
sidebar_position: 1
---

# Quick Startup

**Step 1:** Include the necessary Oasis headers in your source file.

```cpp
#include "Oasis/Add.hpp"
#include "Oasis/Exponent.hpp"
#include "Oasis/Imaginary.hpp"
#include "Oasis/Multiply.hpp"
#include "Oasis/Real.hpp"
#include "Oasis/Variable.hpp"
```

**Step 2:** Use the provided classes to create mathematical expressions.

```cpp
Oasis::Add add {
    Oasis::Add {
        Oasis::Real {1.0},
        Oasis::Real {2.0}
    },
    Oasis::Real {3.0}
};
```

In this example, we define the addition of three numbers: 1.0, 2.0, and 3.0.

**Step 3:** Simplify the created expression.

```cpp
auto simplified = add.Simplify();
```

The `Simplify()` function simplifies the expression to its simplest form.

**Step 4:** Use the specialized `As<>()` function to cast the simplified result to the expected type and retrieve the value.

```cpp
auto simplifiedReal = simplified->As<Oasis::Real>();
auto value = simplifiedReal.GetValue();  // value will hold the result of 1.0 + 2.0 + 3.0
```

**Step 5:** Oasis also allows symbolic calculations. Here is how you can perform symbolic addition:

```cpp
Oasis::Add add {
    Oasis::Multiply {
        Oasis::Real {1.0},
        Oasis::Variable {"x"}
    },
    Oasis::Multiply {
        Oasis::Real {2.0},
        Oasis::Variable {"x"}
    }
};

auto simplified = add.Simplify();
```

The code above performs the symbolic addition of "1*x" and "2*x", simplifying it to "3*x".

**Step 6:** You can also perform asynchronous simplification by using the `SimplifyAsync()` method.

```cpp
std::unique_ptr<Oasis::Expression> simplified = add.SimplifyAsync();
```

**Step 7:** To check if two expressions are structurally equivalent, you can use the `StructurallyEquivalent()` or `StructurallyEquivalentAsync()` function.

```cpp
bool areEquivalent = Oasis::Add {
    Oasis::Real {},
    Oasis::Real {}
}.StructurallyEquivalent(
    Oasis::Add {
        Oasis::Real {},
        Oasis::Real {}
    }
);
```

The above code checks if two addition expressions are structurally equivalent.

### Important Concepts

**Expressions**: An expression in Oasis is a mathematical operation which could be as simple as adding two numbers or as complex as a symbolic computation.

**Real and Imaginary Numbers**: Oasis provides `Real` and `Imaginary` classes to represent real and imaginary numbers respectively.

**Symbolic Computations**: Oasis library supports symbolic computations allowing algebraic expressions to be represented and manipulated symbolically.

**Asynchronous Computations**: Oasis allows for asynchronous computation, which means you can perform operations in a non-blocking manner.

**Structural Equivalence**: Two expressions are said to be structurally equivalent if they have the same structure (same operations and ordering of operands). The `StructurallyEquivalent()` function checks this property.

By understanding these concepts and using the steps mentioned above, you should be able to comfortably use the Oasis library. Happy Coding!
