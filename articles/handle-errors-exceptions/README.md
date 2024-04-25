# What to do with Runtime Errors

Errors are painful for the programmer and the user alike. Errors without a proper message even more. Errors that crash the entire program, way more.

This article will not cover compilation errors (they are build-time errors, not run-time). Once compilation errors are fixed and the program is compiled and running, runtime errors can start to emerge.

## Theoretical vocabulary: errors and exceptions

A runtime error happens when an instruction fails to complete.

Errors can be either:

- checked (also called _exceptions_)
- or unchecked (plain errors)

### Exceptions (checked errors)

An error is considered an exception when it does not imply a fatal malfunction in the program.
Typically, when a third party fails to conform to the program – for example when:

- a user requests a non-existent resource
- a user submits a form with malformed data
- an external HTTP API does not respond

### Unchecked errors

Reciprocally, an error is considered unchecked when it reveals a malfunction in the program: a bug or a misconfiguration – for example:

- an algorithm crashes with valid arguments
- you try to connect to a database with invalid credentials

## In practice

Some programming languages provide a distinction between plain errors and exceptions.

<!-- TODO: review below -->

## Goals

This is a general-use manual to help you with runtime errors in four ways:

- avoid a service crash when an error occurs
- distinguish plain errors and exceptions
- give yourself full information about the error
- give the user limited but useful information about the error

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
