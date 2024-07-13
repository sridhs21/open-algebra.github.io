---
sidebar_position: 1
---

# Converting an `Oasis::Expression` Object to a MathML String in C++
This guide shows you how to convert an `Oasis::Expression` object into a serialized MathML string using C++ and the TinyXML2 library.

**Step 1: Prepare XML Document**

You'll need to create an instance of `tinyxml2::XMLDocument`. This object represents an XML file in memory and allows you to manipulate and extract information from it:

```cpp
tinyxml2::XMLDocument doc;
```

**Step 2: Create MathMLSerializer**

Next, you'll need to create an instance of `Oasis::MathMLSerializer`. This class is used to serialize Oasis expressions into MathML:

```cpp
Oasis::MathMLSerializer serializer { doc };
```
`MathMLSerializer` is initialized with the `doc` object which is a mold for the final XML code representation.

**Step 3: Create XMLPrinter**

After that, you'll need to create `tinyxml2::XMLPrinter`. This object is used to convert the document object model (i.e., the `XMLDocument`) to a string:

```cpp
tinyxml2::XMLPrinter printer;
```

**Step 4: Create Math Element and add to Document**

Create a new element named "math" and set its attribute "display" to "block". This element is the root element of a MathML document:

```cpp
tinyxml2::XMLElement* mathElement = doc.NewElement("math");
mathElement->SetAttribute("display", "block");
doc.InsertFirstChild(mathElement);
```

After creating the root element, it's inserted as the first child of `doc`.

**Step 5: Serialize Oasis Expression**

Use the `Serializer` object to serialize the `Oasis::Expression` referenced by `expr`:

```cpp
expr->Serialize(serializer);
tinyxml2::XMLElement* queryElement = serializer.GetResult();
```
The `Serialize()` method modifies the state of `serializer` such that we can later retrieve the serialized form of `expr` by calling `serializer.GetResult()`.

**Step 6: Attach Serialized Element to Math Element**

Insert the serialized Oasis expression as the first child of the "math" element:

```cpp
mathElement->InsertFirstChild(queryElement);
```

**Step 7: Generate MathML String**

At this point, `doc` contains an XML representation of the Oasis expression. To extract this structure as a string, call `doc.Print(&printer)`. After the print operation is complete, you can get the string by calling `printer.CStr()`. Here's the final code snippet for this step:

```cpp
doc.Print(&printer);
return printer.CStr();
```
This should return a string representing the Oasis::Expression object as MathML.