/* Micro-framework de testes sem dependências externas (o projeto não possui Node/npm disponível — ver DECISIONS.md). */
"use strict";

var TestRunner = (function () {
  var results = [];

  function test(name, fn) {
    try {
      fn();
      results.push({ name: name, pass: true });
    } catch (e) {
      results.push({ name: name, pass: false, error: e && e.message ? e.message : String(e) });
    }
  }

  function assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error((message ? message + " — " : "") + "esperado " + JSON.stringify(expected) + ", obtido " + JSON.stringify(actual));
    }
  }

  function assertTrue(value, message) {
    if (!value) throw new Error(message || "esperado valor verdadeiro");
  }

  function assertFalse(value, message) {
    if (value) throw new Error(message || "esperado valor falso");
  }

  function summary() {
    var passed = results.filter(function (r) { return r.pass; }).length;
    var failed = results.length - passed;
    return { total: results.length, passed: passed, failed: failed, results: results };
  }

  function reset() {
    results = [];
  }

  return { test: test, assertEqual: assertEqual, assertTrue: assertTrue, assertFalse: assertFalse, summary: summary, reset: reset };
})();
