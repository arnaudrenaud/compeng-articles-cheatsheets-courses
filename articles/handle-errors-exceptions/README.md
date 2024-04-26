# What to do with runtime errors

Errors are painful for the programmer and the user alike. Errors without a proper message even more. And what about silent errors that make debugging harder?

## Goals

This is a practical guide to help you with runtime errors in four ways:

- Distinguish exceptions from uncaught errors…
- …even if errors are almost always caught in the end
- Give yourself full information about the error
- Give the user limited but useful information about the error

## Distinguish exceptions from errors…

A runtime error happens when an instruction fails to complete.

You can either:

- let errors terminate the program – in this case, errors are left _unckecked_
- or catch them before they do – in this case, errors are _checked_ and are called exceptions

### Unchecked error

Errors may imply a bug: a logical misconception or some misconfiguration. In that case, they should _not_ be caught and silenced but rather fixed.

Examples:

- an algorithm crashes unexpectedly
- you try to connect to a database with invalid credentials

### Exceptions

Reciprocally, an error may not imply a malfunction in the program. It is typically the case when a third party behaves abnormally.

Hence the name, _exception_: exceptionally, it should be caught and worked around because there is no fix in our program.

Examples:

- a user requests a non-existent resource
- a user submits malformed data
- an external provider does not respond

## …even if errors are almost always caught in the end

Even if an error is unrecoverable and should terminate the program, most of the time one does not want to crash the entire app or server when one error occurs.

For example, if you're running a web server that depends on a database:

- if you can't connect to the database, do not try to catch the error, as it is unrecoverable

## Assumptions

We’ll use the example of a web server, but the same principles apply to any other type of service, and also to most client-side applications.

In the JavaScript vocabulary, there are no “exceptions”. There are only “errors”. It is up to the developers to know whether those should be treated as exceptions or as actual errors.

The golden rule: never crash

First, the service should never crash. It should handle the error and keep the service up for subsequent requests. Fortunately, web servers often provide this feature by default. (careful with Express 4 and async errors).

Some errors are bugs, some are not

A user-induced error (for example, a malformed request):

- Is it an error or an exception? An exception.
- Should I tell the user all about it? Absolutely, so they can fix it.
- Should I output it in my logs? You may, marking it as a user-induced exception. This way, you could learn about app usage and improve user experience.

A third-party-induced error (for example, an external remote API used by your product):

- Is it an error or an exception? An exception.
- Should I tell the user all about it? Yes, so that they know it’s not a bug on your side: you can’t do much, and they just have to wait.
- Should I output it in my logs? Yes, marking it as a third-party-induced exception.

An internal error (AKA a bug, which is an error you didn’t predict):

- Is it an error or an exception? An error.
- Should I tell the user all about it? No, just show them a simple message (such as ‘Internal server error’) so that they know something has to be fixed on your side.
- Should I output it in my logs? Yes, marking it as an internal error: it’s a bug that needs to be addressed.

Using these rules, both you and the user are properly informed at the correct level:

- The user knows whether:
  - their request is incorrect
  - or if they just need to wait for a service to resume
  - or they have to get in touch with you for a bugfix
- You know whether errors need urgent work (a bug fix) or if they are independent of your work

## In practice in JavaScript

Some programming languages provide a distinction between plain errors and exceptions, such as Java that treats both `Error` and `Exception` as subclasses of `Throwable`.

On the other hand, in JavaScript you can only `throw new Error(…)`. There is no specific class for `Exceptions`, which is not
