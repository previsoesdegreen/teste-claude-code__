/* Lógica da aplicação: renderização do dashboard, formulário e lista de projetos. */
"use strict";

(function () {
  var STATUS_LABEL = {
    planejado: "Planejado",
    andamento: "Em andamento",
    concluido: "Concluído",
    atrasado: "Atrasado"
  };

  var form = document.getElementById("project-form");
  var idField = document.getElementById("project-id");
  var fNome = document.getElementById("f-nome");
  var fResponsavel = document.getElementById("f-responsavel");
  var fInicio = document.getElementById("f-inicio");
  var fPrazo = document.getElementById("f-prazo");
  var fStatus = document.getElementById("f-status");
  var fProgresso = document.getElementById("f-progresso");
  var formTitle = document.getElementById("form-title");
  var formMsg = document.getElementById("form-msg");
  var btnSubmit = document.getElementById("btn-submit");
  var btnCancel = document.getElementById("btn-cancel");
  var searchInput = document.getElementById("f-search");
  var filterStatus = document.getElementById("f-filter-status");
  var tableBody = document.getElementById("table-body");
  var emptyState = document.getElementById("empty-state");
  var kpiRow = document.getElementById("kpi-row");
  var confirmOverlay = document.getElementById("confirm-overlay");
  var confirmOk = document.getElementById("confirm-ok");
  var confirmCancel = document.getElementById("confirm-cancel");
  var toastEl = document.getElementById("toast");
  var btnTheme = document.getElementById("btn-theme");

  var pendingDeleteId = null;
  var toastTimer = null;

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function fmtDate(iso) {
    if (!iso) return "—";
    var parts = iso.split("-");
    if (parts.length !== 3) return iso;
    return parts[2] + "/" + parts[1] + "/" + parts[0];
  }

  function effectiveStatus(project) {
    if (project.status !== "concluido" && project.prazo && project.prazo < todayISO()) {
      return "atrasado";
    }
    return project.status;
  }

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2600);
  }

  function clearFieldErrors() {
    form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("invalid"); });
    form.querySelectorAll(".error").forEach(function (e) { e.textContent = ""; });
  }

  function setFieldError(inputId, message) {
    var input = document.getElementById(inputId);
    var field = input.closest(".field");
    field.classList.add("invalid");
    var errEl = form.querySelector('.error[data-for="' + inputId + '"]');
    if (errEl) errEl.textContent = message;
  }

  var VALIDATION_FIELD_IDS = {
    nome: "f-nome",
    responsavel: "f-responsavel",
    dataInicio: "f-inicio",
    prazo: "f-prazo",
    progresso: "f-progresso",
    status: "f-status"
  };

  /* Regra de negócio pura (sem DOM) — testável isoladamente em /tests. */
  function validateProjectData(input) {
    var errors = {};
    var nome = (input.nome || "").trim();
    var responsavel = (input.responsavel || "").trim();
    var inicio = input.dataInicio || "";
    var prazo = input.prazo || "";
    var status = input.status || "";
    var progresso = input.progresso;

    if (!nome) errors.nome = "Informe o nome do projeto.";
    if (!responsavel) errors.responsavel = "Informe o responsável.";
    if (!inicio) errors.dataInicio = "Informe a data de início.";
    if (!prazo) errors.prazo = "Informe o prazo.";
    if (inicio && prazo && prazo < inicio) {
      errors.prazo = "O prazo não pode ser anterior ao início.";
    }
    if (progresso === "" || progresso === undefined || progresso === null || isNaN(progresso) || Number(progresso) < 0 || Number(progresso) > 100) {
      errors.progresso = "Progresso deve ser um número entre 0 e 100.";
    }
    if (!status) errors.status = "Selecione um status.";

    var valid = Object.keys(errors).length === 0;
    return {
      valid: valid,
      errors: errors,
      data: valid ? { nome: nome, responsavel: responsavel, dataInicio: inicio, prazo: prazo, status: status, progresso: Number(progresso) } : null
    };
  }

  function validate() {
    clearFieldErrors();
    var result = validateProjectData({
      nome: fNome.value,
      responsavel: fResponsavel.value,
      dataInicio: fInicio.value,
      prazo: fPrazo.value,
      status: fStatus.value,
      progresso: fProgresso.value
    });
    Object.keys(result.errors).forEach(function (field) {
      setFieldError(VALIDATION_FIELD_IDS[field], result.errors[field]);
    });
    return result.data;
  }

  function resetForm() {
    form.reset();
    idField.value = "";
    fProgresso.value = 0;
    fStatus.value = "andamento";
    formTitle.textContent = "Novo projeto";
    btnSubmit.textContent = "Salvar projeto";
    btnCancel.hidden = true;
    formMsg.textContent = "";
    formMsg.classList.remove("error");
    clearFieldErrors();
  }

  function startEdit(id) {
    var project = ProjectStorage.get(id);
    if (!project) return;
    idField.value = project.id;
    fNome.value = project.nome;
    fResponsavel.value = project.responsavel;
    fInicio.value = project.dataInicio;
    fPrazo.value = project.prazo;
    fStatus.value = project.status;
    fProgresso.value = project.progresso;
    formTitle.textContent = "Editar projeto";
    btnSubmit.textContent = "Salvar alterações";
    btnCancel.hidden = false;
    formMsg.textContent = "";
    clearFieldErrors();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderKpis() {
    var list = ProjectStorage.list();
    var total = list.length;
    var andamento = list.filter(function (p) { return effectiveStatus(p) === "andamento"; }).length;
    var concluidos = list.filter(function (p) { return effectiveStatus(p) === "concluido"; }).length;
    var atrasados = list.filter(function (p) { return effectiveStatus(p) === "atrasado"; }).length;

    var kpis = [
      { label: "Total de projetos", value: total, cls: "" },
      { label: "Em andamento", value: andamento, cls: "" },
      { label: "Concluídos", value: concluidos, cls: "good" },
      { label: "Atrasados", value: atrasados, cls: atrasados > 0 ? "warn" : "" }
    ];
    kpiRow.innerHTML = "";
    kpis.forEach(function (k) {
      var d = document.createElement("div");
      d.className = "kpi" + (k.cls ? " " + k.cls : "");
      d.innerHTML = '<div class="label">' + k.label + '</div><div class="value mono">' + k.value + "</div>";
      kpiRow.appendChild(d);
    });
  }

  function renderTable() {
    var list = ProjectStorage.list();
    var term = searchInput.value.trim().toLowerCase();
    var statusFilter = filterStatus.value;

    var filtered = list.filter(function (p) {
      var matchesTerm = !term || p.nome.toLowerCase().indexOf(term) !== -1 || p.responsavel.toLowerCase().indexOf(term) !== -1;
      var matchesStatus = !statusFilter || effectiveStatus(p) === statusFilter;
      return matchesTerm && matchesStatus;
    });

    filtered.sort(function (a, b) { return (a.prazo || "").localeCompare(b.prazo || ""); });

    tableBody.innerHTML = "";
    emptyState.hidden = list.length !== 0;

    if (list.length !== 0 && filtered.length === 0) {
      var trEmpty = document.createElement("tr");
      trEmpty.innerHTML = '<td colspan="7" style="text-align:center;color:var(--muted);padding:24px 0;">Nenhum projeto corresponde aos filtros.</td>';
      tableBody.appendChild(trEmpty);
      return;
    }

    filtered.forEach(function (p) {
      var st = effectiveStatus(p);
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + escapeHtml(p.nome) + "</td>" +
        "<td>" + escapeHtml(p.responsavel) + "</td>" +
        "<td>" + escapeHtml(fmtDate(p.dataInicio)) + "</td>" +
        "<td>" + escapeHtml(fmtDate(p.prazo)) + "</td>" +
        '<td><span class="badge ' + st + '">' + STATUS_LABEL[st] + "</span></td>" +
        '<td><div class="progress-cell"><span class="progress-bar"><span style="width:' + p.progresso + '%"></span></span>' + p.progresso + "%</div></td>" +
        '<td class="num"><div class="row-actions">' +
          '<button type="button" class="icon-btn" data-action="edit" data-id="' + p.id + '">Editar</button>' +
          '<button type="button" class="icon-btn danger" data-action="delete" data-id="' + p.id + '">Excluir</button>' +
        "</div></td>";
      tableBody.appendChild(tr);
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderAll() {
    renderKpis();
    renderTable();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = validate();
    if (!data) {
      formMsg.textContent = "Corrija os campos destacados.";
      formMsg.classList.add("error");
      return;
    }
    var id = idField.value;
    if (id) {
      ProjectStorage.update(id, data);
      showToast("Projeto atualizado com sucesso.");
    } else {
      ProjectStorage.create(data);
      showToast("Projeto cadastrado com sucesso.");
    }
    resetForm();
    renderAll();
  });

  btnCancel.addEventListener("click", function () {
    resetForm();
  });

  tableBody.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-action]");
    if (!btn) return;
    var id = btn.getAttribute("data-id");
    var action = btn.getAttribute("data-action");
    if (action === "edit") {
      startEdit(id);
    } else if (action === "delete") {
      pendingDeleteId = id;
      confirmOverlay.hidden = false;
    }
  });

  confirmCancel.addEventListener("click", function () {
    pendingDeleteId = null;
    confirmOverlay.hidden = true;
  });

  confirmOk.addEventListener("click", function () {
    if (pendingDeleteId) {
      ProjectStorage.remove(pendingDeleteId);
      showToast("Projeto excluído.");
      if (idField.value === pendingDeleteId) resetForm();
      renderAll();
    }
    pendingDeleteId = null;
    confirmOverlay.hidden = true;
  });

  confirmOverlay.addEventListener("click", function (e) {
    if (e.target === confirmOverlay) {
      pendingDeleteId = null;
      confirmOverlay.hidden = true;
    }
  });

  searchInput.addEventListener("input", renderTable);
  filterStatus.addEventListener("change", renderTable);

  /* ---- Theme toggle ---- */
  var THEME_KEY = "painel-projetos:theme";
  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }
  var savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme);
  btnTheme.addEventListener("click", function () {
    var current = document.documentElement.getAttribute("data-theme");
    var isDark = current === "dark" || (!current && window.matchMedia("(prefers-color-scheme: dark)").matches);
    var next = isDark ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  /* ---- Init ---- */
  document.getElementById("meta-date").textContent = fmtDate(todayISO());
  resetForm();
  renderAll();

  /* Exposição somente-leitura das regras de negócio puras para a suíte de testes em /tests. Não afeta o comportamento da aplicação. */
  window.PainelProjetosCore = {
    effectiveStatus: effectiveStatus,
    validateProjectData: validateProjectData
  };
})();
