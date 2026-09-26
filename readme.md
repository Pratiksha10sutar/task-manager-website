# Parsing 🔍

Parsing is the process where the browser reads the HTML document and understands its structure.


# Tokenization 🧩

Before building the DOM Tree, the browser converts HTML into tokens.

# DOM Tree 🌳

This is one of the most important concepts in Web Development.
It is a tree-like representation of an HTML document.

# CSSOM Tree 🎨

Just like HTML becomes DOM, CSS becomes CSSOM.
It is a tree representation of CSS rules.

# DOM + CSSOM = Render Tree 🖥️

Render Tree is a combination of:

DOM Tree
     +
CSSOM Tree
     =
Render Tree


1. Event Bubbling:
Event bubbling is a process where an event moves from the target element to its parent elements.

Example:
Child → Parent → Grandparent

2. Event Capturing:
Event capturing is a process where an event moves from the parent element to the target element.

Example:
Grandparent → Parent → Child

3. Event Delegation:
Event delegation is a technique where we add one event listener to a parent element to handle events of its child elements.

Example:
Instead of adding listeners to every button, add one listener to their parent.

echo "# task-manager-website" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Pratiksha10sutar/task-manager-website.git
git push -u origin main
