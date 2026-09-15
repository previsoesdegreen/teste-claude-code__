/* Camada de persistência: CRUD de projetos usando localStorage. */
"use strict";

var ProjectStorage = (function () {
  var KEY = "painel-projetos:v1";

  function readAll() {
    var raw = localStorage.getItem(KEY);
    if (!raw) return [];
    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeAll(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function genId() {
    return "p_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  }

  return {
    list: function () {
      return readAll();
    },
    get: function (id) {
      return readAll().find(function (p) { return p.id === id; }) || null;
    },
    create: function (data) {
      var list = readAll();
      var project = {
        id: genId(),
        nome: data.nome,
        responsavel: data.responsavel,
        dataInicio: data.dataInicio,
        prazo: data.prazo,
        status: data.status,
        progresso: data.progresso,
        criadoEm: new Date().toISOString()
      };
      list.push(project);
      writeAll(list);
      return project;
    },
    update: function (id, data) {
      var list = readAll();
      var idx = list.findIndex(function (p) { return p.id === id; });
      if (idx === -1) return null;
      list[idx] = Object.assign({}, list[idx], data);
      writeAll(list);
      return list[idx];
    },
    remove: function (id) {
      var list = readAll();
      var next = list.filter(function (p) { return p.id !== id; });
      writeAll(next);
      return next.length !== list.length;
    }
  };
})();
