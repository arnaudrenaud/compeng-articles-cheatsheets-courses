# 9 ways to improve for a beginner in software development

I taught the practice of web development to around 200 students in six years. Here are ways to improve on the mistakes and misconceptions I noticed most often.

## TL;DR

- Look for error messages
- Simplify your code until the bug goes away
- Solve only one problem at a time
- Split tasks and commits
- Give symbols a proper name
- Refrain from DRYing everything out
- Optimize reasonably
- Test the risky parts first
- Avoid persisting redundant data

## Look for error messages

When the app _doesn't work_, look for an error message. This is especially true when your app is made of multiple services.

Let's say your single-page web app relies on your API server. When something fails, here are three places you have to look for an error:

- the browser console (uncaught error client-side)
- the server console (uncaught error server-side)
- the server response body in the inspector's Network tab (incorrect request error, it should appear in the UI)

## Simplify your code until the bug goes away

What to do if you can't find any error message, or if the cause of a bug remains obscure after searching the error online?

Simplify your code (for instance, comment out some part that runs when the bug happens), and try to reproduce the bug again. If reproducible, repeat again and again until the bug is gone.

Sometimes, you only need to do this once to find the faulty part in your program.

Some other times, you simplify your program so much that it looks like a Hello world boilerplate and yet the bug is still here.
Try updating dependencies or changing environment variables. If you are still unlucky, post your issue on Stack Overflow or, if applicable, on your framework's repository issues on GitHub, and provide your simplified code.

## Solve only one problem at a time

If you try to simultaneously fix a bug, implement a new feature and refactor code, chances are you will waste time by breaking your code and mix unrelated changes in a single commit, which will make code review harder.

If you feel the need for a refactor or a bug fix in the middle of an unrelated feature, refrain from doing it. Save it for later, preferably by opening a dedicated ticket (you can automate it with GitHub actions that will create an issue from any "TODO" mention in your code, for example [TODO to Issue](https://github.com/marketplace/actions/todo-to-issue)).

## Split tasks and commits

When you receive a ticket for a new feature, work on it before you start implementing it. Add a checklist of subtasks and cases to handle, and implement them one after the other. This will help you keep going when the task at hand is overwhelming. You can also use this detailed case-by-case specification to write automated tests.

The same discipline goes for commits for large features: help the code reviewer by splitting your work into commits with a clear title.

## Give symbols a proper name

Symbols are all the phrases that you define in your code: types, interfaces, constants, variables, functions, classes, methods.

The name `data` is rarely helpful when reading code. Take some time to give a descriptive name to your data and don't forget to use the plural for arrays.

Function and method names should start with a verb that describes what is returned (and/or performed).

Do not be afraid of longer names if necessary: _Everything should be made as simple as possible, but not simpler._ (Einstein).

Follow these rules and your code should read _almost_ like a sentence in English.

## Refrain from DRYing everything out

It is tempting to deduplicate everything in your codebase because someone said "Don't repeat yourself".

You can have rules that look the same but are conceptually different. If you refactor them into an abstraction, they could become harder to understand and maintain.

Rather than DRY, make your code ETC: _Easier To Change_.

This means using a _single source of truth_ for things that are conceptually the same: if you duplicate constants or business rules, they will become hard to change.

## Optimize reasonably

Just like excessive DRYness, premature optimization is a waste of time.

You might want to improve the performance of an algorithm, for instance by replacing a loop with a regular expression.

Is the performance gain valuable to the user in real-world conditions, with realistic data? Is the gain offset by a potential loss in code readability?

A lot of time, micro-optimizations are not worth it.

A rule of thumb to avoid poor performance before it hits you in production:

- keep the [time complexity of the algorithm](https://stackoverflow.com/a/11611770/2339721) under _O(n log n)_
- if you run database queries, do not run them in a loop of the size of the input but use a fixed number of join queries instead

## Test the risky parts first

> What part of my code should I test first?

Again, make good use of your time. Test what is most critical and/or most at risk of failure.

You can start by testing the core business rules of the application, especially if they are supposed to evolve over time (they are at risk of regression).

Also, when a bug is reported, you can start by writing a test that highlights the bug (which means it should fail) before fixing the implementation (_test-driven development_).

> Should I test all cases?

Test all cases that are expected to happen in real-world usage, starting with the most important ones, business-wise.

## Avoid persisting redundant data

Again, aim for a single source of truth.

Whether you're developing a stateful user interface or a service connected to a database, you're persisting data state to work on it.

In React components, I have seen many times a filtered array set to state whereas it could be calculated at render time. Instead of setting in state only the filter arguments, both the arguments and the resulting array are stored, making code more verbose and error-prone because both state values must be updated everytime the filter arguments change.

Similarly, I have seen redundant database design, where data is set in a column whereas it could be calculated in real time.

However, while this single-source-of-truth approach is conceptually cleaner and easier to maintain, it can lead to performance issues if the calculation is heavy and repeated multiple times with the same arguments: why recalculate it if the result is the same?

In this case, you can cache the result of the calculation using memoization: for instance `useMemo` in React, which will automatically refresh calculation when arguments change.

In a database, for instance Postgres, you can use materialized views, but you will have to refresh their content manually.

## Final thoughts

- actively look for error messages ; don't be afraid of them
- keep your work going by splitting tasks into smaller units that are easier to complete
- think of the person that will read your code: favor readability over excessive factorization or optimization
- beware of premature optimization: use your time to fix perceivable problems
