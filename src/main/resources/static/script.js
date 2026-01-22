const api = {
  listarMinas: () => fetch('/mina').then(r => r.json()),
  buscarMina: (id) => fetch(`/mina/${id}`).then(async r => {
    if (r.ok) {
    return r.json();
    }
    const txt = await r.text();
    throw new Error(txt || r.statusText);
  }),
  listarProducoes: () => fetch('/producoes').then(r => r.json()),
  listarProducoesPorMina: (id) => fetch(`/mina/${id}/producoes`).then(async r => {
    if (r.ok) {
    return r.json();
    }
    const txt = await r.text();
    throw new Error(txt || r.statusText);
  }),
  criarProducao: (body) => fetch('/producoes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(async r => {
    if (r.ok) {
    return r.json();
    }
    const text = await r.text(); throw new Error(text || r.statusText);
  }),
  relatorioMina: (id) => fetch(`/mina/${id}/relatorio`).then(async r => {
    if (r.ok) {
    return r.json();
    }
    const txt = await r.text();
    throw new Error(txt || r.statusText);
  })
};

const estado = {
  minas: [],
  producoes: [],
  minaSelecionada: null
};

function mostrarMensagem(texto, tipo='info'){
  const el = document.getElementById('mensagens');
  el.innerHTML = `<div class="msg ${tipo}">${texto}</div>`;
  setTimeout(()=>{
    if (el.firstChild) {
        el.firstChild.remove();
        }
       }, 5000);
}

function renderizarMinas(){
  const ul = document.getElementById('lista-minas');
  ul.innerHTML = '';
  estado.minas.forEach(m => {
    const li = document.createElement('li');
    li.textContent = `${m.id} - ${m.nome} (${m.mineral})`;
    li.dataset.id = m.id;
    li.addEventListener('click', () => selecionarMina(m.id));
    ul.appendChild(li);
  });
}

function renderizarDetalhesMina(){
  const container = document.getElementById('detalhes-mina');
  if (!estado.minaSelecionada) {
    container.textContent = 'Selecione uma mina na lista à esquerda.';
    return;
  }
  const m = estado.minaSelecionada;
  container.innerHTML = `
    <h3>${m.nome}</h3>
    <p><strong>Localização:</strong> ${m.localizacao}</p>
    <p><strong>Mineral:</strong> ${m.mineral}</p>
    <p><strong>Ativa:</strong> ${m.ativa ? 'Sim' : 'Não'}</p>
    <div class="acoes">
      <button id="btn-relatorio" class="btn btn-secondary">
        Relatório
      </button>
      <button id="btn-mostrar-form" class="btn btn-primary">
        Adicionar produção
      </button>
    </div>
  `;
  document.getElementById('relatorio').style.display = 'none';
  document.getElementById('producoes').style.display = 'block';
  document.getElementById('formulario-producao').style.display = 'none';

  document.getElementById('btn-relatorio').addEventListener('click', async ()=>{
    try{
      const dto = await api.relatorioMina(m.id);
      const r = document.getElementById('relatorio');
      r.style.display = 'block';
      r.innerHTML = `<h4>Relatório de Valor</h4>
        <p><strong>Mina:</strong> ${dto.nome}</p>
        <p><strong>Localização:</strong> ${dto.localizacao}</p>
        <p><strong>Mineral:</strong> ${dto.mineral}</p>
        <p><strong>Valor total:</strong> R$ ${Number(dto.valorTotal).toFixed(2)}</p>`;
    }catch(err){
      console.error(err);
      mostrarMensagem('Erro ao buscar relatório: '+err.message, 'error');
    }
  });

  document.getElementById('btn-mostrar-form').addEventListener('click', ()=>{
    renderizarFormularioProducao();
    document.getElementById('formulario-producao').style.display = 'block';
  });
}

function renderizarProducoes(){
  const container = document.getElementById('producoes');
  if (!estado.minaSelecionada) {
    container.style.display = 'none';
    return;
    }
  const mineId = estado.minaSelecionada.id;
  const normalizadas = (estado.producoes || []).map(p => {
    const geoId = p.geoMineModel?.id ?? (p.geoMineId ?? null);
    const dataStr = p.data ?? p.dataString ?? null;
    return {
      id: p.id,
      data: dataStr,
      quantidade: p.quantidade,
      unidadeMedida: p.unidadeMedida,
      valorTotal: p.valorTotal,
      geoMineId: geoId
    };
  });
  const filtradas = normalizadas.filter(p => p.geoMineId === null || p.geoMineId === mineId);

  container.style.display = 'block';
  if (!filtradas || filtradas.length === 0) {
    container.innerHTML = `\n <h4>\n    Produções\n  </h4>\n  <p>Sem produções para esta mina.</p>\n  `;
    return;
    }

  let html = `\n    <h4>\n        Produções\n    </h4>\n    <table class="tabela">\n        <thead>\n            <tr>\n                <th>ID</th>\n                <th>Data</th>\n                <th>Quantidade</th>\n                <th>Unidade</th>\n                <th>Valor Total</th>\n            </tr>\n        </thead>\n        <tbody>`;

  filtradas.forEach(p => {
    const dataText = p.data ? p.data : '';
    const valorText = (p.valorTotal === null || p.valorTotal === undefined) ? '—' : `R$ ${Number(p.valorTotal).toFixed(2)}`;
    html += `\n    <tr>\n        <td>${p.id}</td>\n        <td>${dataText}</td>\n        <td>${p.quantidade}</td>\n        <td>${p.unidadeMedida}</td>\n        <td>${valorText}</td>\n    </tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

function renderizarFormularioProducao(){
  const container = document.getElementById('formulario-producao');
  if (!estado.minaSelecionada) {
  return;
  }
  container.innerHTML = `
    <h4>Adicionar Produção para ${estado.minaSelecionada.nome}</h4>
    <form id="form-prod">
      <label>Data: <input type="date" name="data" required></label>
      <label>Quantidade: <input type="number" name="quantidade" min="0.01" step="0.01" required></label>
      <label>Unidade de Medida: <input type="text" name="unidadeMedida" required></label>
      <label>Valor Total (R$): <input type="number" name="valorTotal" min="0" step="0.01" required></label>
      <div class="acoes-form">
        <button type="submit">Salvar</button>
        <button type="button" id="cancelar-prod">Cancelar</button>
      </div>
    </form>
  `;
  const form = document.getElementById('form-prod');

  form.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const fd = new FormData(form);
    const body = {
      data: fd.get('data'),
      quantidade: Number(fd.get('quantidade')),
      unidadeMedida: fd.get('unidadeMedida'),
      valorTotal: Number(fd.get('valorTotal')),
      geoMineId: estado.minaSelecionada.id
    };
    if (!body.data || !body.unidadeMedida || body.quantidade <= 0 || body.valorTotal < 0){
      mostrarMensagem('Dados inválidos. Verifique os campos.', 'error');
      return;
    }
    try{
      const salvo = await api.criarProducao(body);
      mostrarMensagem('Produção criada com sucesso', 'success');
      estado.producoes.push(salvo);
      renderizarProducoes();
      document.getElementById('formulario-producao').style.display = 'none';
    }catch(err){
      console.error(err);
      mostrarMensagem('Erro ao criar produção: '+err.message, 'error');
    }
  });

  document.getElementById('cancelar-prod').addEventListener('click', ()=>{
    document.getElementById('formulario-producao').style.display = 'none';
  });
}

function renderizarFormularioNovaMina(){
  const container = document.getElementById('form-nova-mina');
  container.style.display = 'block';
  container.innerHTML = `
    <h4>Nova Mina</h4>
    <form id="form-nova-mina-form" class="form-nova-mina">
      <div class="form-field"><label>Nome:<br><input type="text" name="nome" required></label></div>
      <div class="form-field"><label>Localização:<br><input type="text" name="localizacao" required></label></div>
      <div class="form-field"><label>Mineral:<br><input type="text" name="mineral" required></label></div>
      <div class="form-field"><label>Ativa:<br>
        <select name="ativa">
          <option value="true">Sim</option>
          <option value="false">Não</option>
        </select>
      </label>
      <div class="acoes-form">
        <button type="submit">Criar</button>
        <button type="button" id="cancelar-nova-mina">Cancelar</button>
      </div>
    </form>
  `;

  form.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const fd = new FormData(form);
    const body = {
      nome: fd.get('nome'),
      localizacao: fd.get('localizacao'),
      mineral: fd.get('mineral'),
      ativa: (fd.get('ativa') === 'true')
    };
    if (!body.nome || !body.localizacao || !body.mineral) {
      mostrarMensagem('Preencha todos os campos.', 'error');
      return;
    }
    try{
      const res = await fetch('/mina', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok){
        const txt = await res.text(); throw new Error(txt || res.statusText);
      }
      const nova = await res.json();
      mostrarMensagem('Mina criada com sucesso', 'success');
      estado.minas.push(nova);
      renderizarMinas();
      container.style.display = 'none';
    }catch(err){
      console.error(err);
      mostrarMensagem('Erro ao criar mina: '+err.message, 'error');
    }
  });

  document.getElementById('cancelar-nova-mina').addEventListener('click', ()=>{
    container.style.display = 'none';
  });
}

(function(){
  document.addEventListener('DOMContentLoaded', ()=>{
    const btn = document.getElementById('nova-mina');
    if (btn){
      btn.addEventListener('click', ()=>{
        const container = document.getElementById('form-nova-mina');
        if (container.style.display === 'block') container.style.display = 'none'; else renderizarFormularioNovaMina();
      });
    }
  });
})();

async function selecionarMina(id){
  try{
    const mine = await api.buscarMina(id);
    estado.minaSelecionada = mine;
    renderizarDetalhesMina();
    estado.producoes = await api.listarProducoesPorMina(id);
    renderizarProducoes();
  }catch(err){
    console.error(err);
    mostrarMensagem('Erro ao buscar mina: '+(err.message || err.statusText), 'error');
  }
}

async function iniciar(){
  try{
    estado.minas = await api.listarMinas();
    renderizarMinas();
    document.getElementById('atualizar-minas').addEventListener('click', async ()=>{
      estado.minas = await api.listarMinas();
      renderizarMinas();
      mostrarMensagem('Minas atualizadas', 'success');
    });
    estado.producoes = await api.listarProducoes();
  }catch(err){
    console.error(err);
    mostrarMensagem('Erro ao iniciar aplicação: '+err.message, 'error');
  }
}

globalThis.addEventListener('DOMContentLoaded', iniciar);
