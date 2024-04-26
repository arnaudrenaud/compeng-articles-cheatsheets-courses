# What to do with runtime errors

Errors are painful for the programmer and the user alike. Errors without a proper message even more. And what about silent errors that make debugging harder?

## Goals

This is a practical guide to help you with runtime errors in four ways:

- Distinguish exceptions from errors
- Give yourself full information about the error
- Give the user limited but useful information about the error

We’ll use the example of a web server, but the same principles apply to any other type of service and to most client-side applications.

## Error or exception?

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

## What to do with the different cases

### User-induced error

In case of a user-induced error (for example, a malformed request):

- Is it an error or an exception? An exception.
- Should I tell the user all about it? Absolutely, so they can fix it.
- Should I output it in my logs? You may, marking it as a user-induced exception. This way, you could learn about app usage and improve user experience.

### Third-party-induced error

In case of a third-party-induced error (for example, an external remote API used by your product):

- Is it an error or an exception? An exception.
- Should I tell the user all about it? Yes, so that they know it’s not a bug on your side: you can’t do much, and they just have to wait.
- Should I output it in my logs? Yes, marking it as a third-party-induced exception. This way, you could learn about potential deficiencies among your third-party provider and possibly switch to another one.

### Internal error

#### Outside a user request

In case of an error occuring outside a user request (for example a database migration failing at server startup):

- Is it an error or an exception? An error.
- Should I output it in my logs? Yes, it’s a bug that needs to be addressed.

You have nothing to do in this case: do not catch the error. By default, it will crash the server and output the error to the logs.

#### Within a user request

In case of an error occuring inside a user request:

- Is it an error or an exception? An error.
- Should I tell the user all about it? No, just show them a simple message (such as "Internal server error") so that they know something has to be fixed on your side.
- Should I output it in my logs? Yes, it’s a bug that needs to be addressed.

You have nothing to do in this case: do not catch the error. Any error uncaught by the developer will be caught by the server and result in a default client-side error message and output the full error in the logs.

_Note: this is not true for Express 4 where async errors are not handled by default and make the server crash_.

## Summary

Using these rules, both you and the user are properly informed at the correct level:

- The user knows whether:
  - their request is incorrect
  - or if they just need to wait for a service to resume
  - or they have to get in touch with you for a bugfix
- You know whether errors need a bug fix or if they are exceptions independent of your work

Finally, you have seen it is no use to surround everything with `try-catch` blocks: you should only catch specific exceptions and let your server treat the rest as errors.

## In practice in JavaScript

Some programming languages provide a distinction between plain errors and exceptions, such as Java that treats both `Error` and `Exception` as subclasses of `Throwable`.

On the other hand, in JavaScript you can only `throw new Error(…)`. There is no specific class for `Exceptions`, which is not

In the JavaScript vocabulary, there are no built-in exceptions. There are only errors from the `Error` class.

It is up to you to throw and catch these as exceptions or as actual errors.
