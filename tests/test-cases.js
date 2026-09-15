/* Casos de teste para as regras críticas do Painel de Projetos (BKL-101).
   Executam contra a aplicação real carregada em um iframe (../index.html) — nenhuma implementação é mockada. */
"use strict";

function runAllTests(appWindow) {
  TestRunner.reset();
  var Core = appWindow.PainelProjetosCore;
  var Storage = appWindow.ProjectStorage;

  var PAST = "2000-01-01";   // sempre no passado, independente da data de execução
  var FUTURE = "2099-01-01"; // sempre no futuro, independente da data de execução

  /* ---------- effectiveStatus ---------- */

  TestRunner.test("effectiveStatus: concluído com prazo vencido permanece concluído (nunca vira atrasado)", function () {
    var result = Core.effectiveStatus({ status: "concluido", prazo: PAST });
    TestRunner.assertEqual(result, "concluido");
  });

  TestRunner.test("effectiveStatus: 'em andamento' com prazo vencido vira 'atrasado'", function () {
    var result = Core.effectiveStatus({ status: "andamento", prazo: PAST });
    TestRunner.assertEqual(result, "atrasado");
  });

  TestRunner.test("effectiveStatus: 'planejado' com prazo vencido vira 'atrasado'", function () {
    var result = Core.effectiveStatus({ status: "planejado", prazo: PAST });
    TestRunner.assertEqual(result, "atrasado");
  });

  TestRunner.test("effectiveStatus: 'em andamento' com prazo futuro permanece 'em andamento'", function () {
    var result = Core.effectiveStatus({ status: "andamento", prazo: FUTURE });
    TestRunner.assertEqual(result, "andamento");
  });

  TestRunner.test("effectiveStatus: sem prazo definido não quebra e mantém o status original", function () {
    var result = Core.effectiveStatus({ status: "planejado", prazo: "" });
    TestRunner.assertEqual(result, "planejado");
  });

  /* ---------- validateProjectData ---------- */

  TestRunner.test("validateProjectData: payload totalmente vazio é inválido com todos os campos obrigatórios reportados", function () {
    var result = Core.validateProjectData({ nome: "", responsavel: "", dataInicio: "", prazo: "", status: "", progresso: "" });
    TestRunner.assertFalse(result.valid, "deveria ser inválido");
    TestRunner.assertTrue(!!result.errors.nome, "deveria reportar erro em nome");
    TestRunner.assertTrue(!!result.errors.responsavel, "deveria reportar erro em responsavel");
    TestRunner.assertTrue(!!result.errors.dataInicio, "deveria reportar erro em dataInicio");
    TestRunner.assertTrue(!!result.errors.prazo, "deveria reportar erro em prazo");
    TestRunner.assertTrue(!!result.errors.progresso, "deveria reportar erro em progresso");
    TestRunner.assertTrue(!!result.errors.status, "deveria reportar erro em status");
    TestRunner.assertEqual(result.data, null);
  });

  TestRunner.test("validateProjectData: prazo anterior à data de início é inválido", function () {
    var result = Core.validateProjectData({
      nome: "Projeto X", responsavel: "Fulano", dataInicio: "2026-05-01", prazo: "2026-04-01",
      status: "andamento", progresso: "10"
    });
    TestRunner.assertFalse(result.valid);
    TestRunner.assertTrue(!!result.errors.prazo, "deveria reportar erro de coerência de datas em prazo");
  });

  TestRunner.test("validateProjectData: progresso fora da faixa 0-100 é inválido (negativo)", function () {
    var result = Core.validateProjectData({
      nome: "Projeto X", responsavel: "Fulano", dataInicio: "2026-01-01", prazo: "2026-02-01",
      status: "andamento", progresso: "-5"
    });
    TestRunner.assertFalse(result.valid);
    TestRunner.assertTrue(!!result.errors.progresso);
  });

  TestRunner.test("validateProjectData: progresso fora da faixa 0-100 é inválido (acima de 100)", function () {
    var result = Core.validateProjectData({
      nome: "Projeto X", responsavel: "Fulano", dataInicio: "2026-01-01", prazo: "2026-02-01",
      status: "andamento", progresso: "101"
    });
    TestRunner.assertFalse(result.valid);
    TestRunner.assertTrue(!!result.errors.progresso);
  });

  TestRunner.test("validateProjectData: progresso não numérico é inválido", function () {
    var result = Core.validateProjectData({
      nome: "Projeto X", responsavel: "Fulano", dataInicio: "2026-01-01", prazo: "2026-02-01",
      status: "andamento", progresso: "abc"
    });
    TestRunner.assertFalse(result.valid);
    TestRunner.assertTrue(!!result.errors.progresso);
  });

  TestRunner.test("validateProjectData: payload totalmente válido é aceito e normalizado", function () {
    var result = Core.validateProjectData({
      nome: "  Projeto X  ", responsavel: "  Fulano  ", dataInicio: "2026-01-01", prazo: "2026-02-01",
      status: "andamento", progresso: "45"
    });
    TestRunner.assertTrue(result.valid, "deveria ser válido");
    TestRunner.assertEqual(Object.keys(result.errors).length, 0);
    TestRunner.assertEqual(result.data.nome, "Projeto X", "nome deveria ser aparado (trim)");
    TestRunner.assertEqual(result.data.responsavel, "Fulano", "responsavel deveria ser aparado (trim)");
    TestRunner.assertEqual(result.data.progresso, 45, "progresso deveria ser convertido para número");
  });

  /* ---------- ProjectStorage (CRUD real, com backup/restauração do localStorage) ---------- */

  TestRunner.test("ProjectStorage: create() gera um projeto com id e o retorna", function () {
    var created = Storage.create({ nome: "Teste CRUD", responsavel: "QA", dataInicio: "2026-01-01", prazo: "2026-02-01", status: "andamento", progresso: 10 });
    try {
      TestRunner.assertTrue(!!created.id, "deveria gerar um id");
      TestRunner.assertEqual(created.nome, "Teste CRUD");
    } finally {
      Storage.remove(created.id);
    }
  });

  TestRunner.test("ProjectStorage: get() recupera o projeto criado", function () {
    var created = Storage.create({ nome: "Teste Get", responsavel: "QA", dataInicio: "2026-01-01", prazo: "2026-02-01", status: "andamento", progresso: 10 });
    try {
      var fetched = Storage.get(created.id);
      TestRunner.assertTrue(!!fetched, "deveria encontrar o projeto");
      TestRunner.assertEqual(fetched.nome, "Teste Get");
    } finally {
      Storage.remove(created.id);
    }
  });

  TestRunner.test("ProjectStorage: update() mescla os campos sem duplicar o registro", function () {
    var created = Storage.create({ nome: "Teste Update", responsavel: "QA", dataInicio: "2026-01-01", prazo: "2026-02-01", status: "andamento", progresso: 10 });
    try {
      var before = Storage.list().length;
      Storage.update(created.id, { progresso: 90, status: "concluido" });
      var after = Storage.list().length;
      var updated = Storage.get(created.id);
      TestRunner.assertEqual(after, before, "update não deve criar registro novo");
      TestRunner.assertEqual(updated.progresso, 90);
      TestRunner.assertEqual(updated.status, "concluido");
      TestRunner.assertEqual(updated.nome, "Teste Update", "campos não alterados devem ser preservados");
    } finally {
      Storage.remove(created.id);
    }
  });

  TestRunner.test("ProjectStorage: remove() apaga o projeto e list() deixa de contê-lo", function () {
    var created = Storage.create({ nome: "Teste Remove", responsavel: "QA", dataInicio: "2026-01-01", prazo: "2026-02-01", status: "andamento", progresso: 10 });
    var removed = Storage.remove(created.id);
    TestRunner.assertTrue(removed, "remove() deveria retornar true");
    var fetched = Storage.get(created.id);
    TestRunner.assertEqual(fetched, null, "projeto não deveria mais existir");
  });

  TestRunner.test("ProjectStorage: remove() de um id inexistente retorna false", function () {
    var removed = Storage.remove("id-que-nao-existe-123");
    TestRunner.assertFalse(removed, "remove() de id inexistente deveria retornar false");
  });

  return TestRunner.summary();
}
