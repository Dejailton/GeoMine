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

let _messageTimeout = null;
let _messageModalInstance = null;

function mostrarMensagem(texto, tipo='info'){
  if (!_messageModalInstance) {
    const modalEl = document.getElementById('messageModal');
    _messageModalInstance = new bootstrap.Modal(modalEl, { backdrop: true });
  }

  const header = document.getElementById('messageModalHeader');
  const title = document.getElementById('messageModalLabel');
  const body = document.getElementById('messageModalBody');

  // Reset classes
  header.className = 'modal-header';

  if (tipo === 'success') {
    title.textContent = 'Sucesso';
    header.classList.add('bg-success','text-white');
  } else if (tipo === 'error') {
    title.textContent = 'Erro';
    header.classList.add('bg-danger','text-white');
  } else {
    title.textContent = 'Informação';
    header.classList.add('bg-info','text-white');
  }

  body.textContent = texto;

  // show modal
  _messageModalInstance.show();

  // limpa timeout anterior
  if (_messageTimeout) {
    clearTimeout(_messageTimeout);
    _messageTimeout = null;
  }

  // auto-hide após 5s
  _messageTimeout = setTimeout(()=>{
    try{ _messageModalInstance.hide(); }catch(e){}
    _messageTimeout = null;
  }, 5000);
}

function renderizarMinas(){
  const container = document.getElementById('lista-minas');
  container.innerHTML = '';
  estado.minas.forEach(m => {
    const item = document.createElement('div');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';
    item.dataset.id = m.id;

    const mainText = document.createElement('div');
    mainText.className = 'mina-item-text';
    mainText.textContent = `${m.id} - ${m.nome} (${m.mineral})`;
    mainText.style.cursor = 'pointer';
    mainText.addEventListener('click', () => selecionarMina(m.id));

    const actions = document.createElement('div');
    actions.className = 'd-flex flex-column justify-content-center align-items-end gap-2';
    actions.style.minWidth = '110px';

    const updBtn = document.createElement('button');
    updBtn.className = 'btn btn-sm btn-outline-primary mb-2';
    updBtn.textContent = 'Atualizar';
    updBtn.addEventListener('click', async (ev) => {
      ev.stopPropagation();
      try{
        const minaDados = await api.buscarMina(m.id);
        renderizarFormularioMina(minaDados);
      }catch(err){
        console.error(err);
        mostrarMensagem('Erro ao carregar dados da mina: '+(err.message||err.statusText),'error');
      }
    });

    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-sm btn-danger';
    delBtn.textContent = 'Deletar';
    delBtn.addEventListener('click', async (ev)=>{
      ev.stopPropagation();
      if (!confirm(`Deseja realmente deletar a mina "${m.nome}" (id=${m.id})?`)) return;
      try{
        const res = await fetch(`/mina/${m.id}`, { method: 'DELETE' });
        if (!res.ok){
          const txt = await res.text(); throw new Error(txt || res.statusText);
        }
        // remover do estado e re-renderizar
        estado.minas = estado.minas.filter(x => x.id !== m.id);
        if (estado.minaSelecionada && estado.minaSelecionada.id === m.id) {
          estado.minaSelecionada = null;
          document.getElementById('detalhes-mina').textContent = 'Selecione uma mina na lista à esquerda.';
          document.getElementById('producoes').style.display = 'none';
        }
        renderizarMinas();
        mostrarMensagem('Mina deletada com sucesso', 'success');
      }catch(err){
        console.error(err);
        mostrarMensagem('Erro ao deletar mina: '+(err.message||err.statusText), 'error');
      }
    });

    actions.appendChild(updBtn);
    actions.appendChild(delBtn);

    item.appendChild(mainText);
    item.appendChild(actions);
    container.appendChild(item);
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
      r.innerHTML = `<h4>Produção total da mina:</h4>
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
    document.getElementById('relatorio').style.display = 'none';
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
      geoMineId: geoId,
      raw: p
    };
  });
  const filtradas = normalizadas.filter(p => p.geoMineId === null || p.geoMineId === mineId);

  container.style.display = 'block';
  if (!filtradas || filtradas.length === 0) {
    container.innerHTML = `\n <h4>\n    Produções\n  </h4>\n  <p>Sem produções para esta mina.</p>\n  `;
    return;
    }

  let html = `\n    <h4>\n        Produções\n    </h4>\n    <table class="tabela table">\n        <thead>\n            <tr>\n                <th>ID</th>\n                <th>Data</th>\n                <th>Quantidade</th>\n                <th>Unidade</th>\n                <th>Valor Total</th>\n                <th>Ações</th>\n            </tr>\n        </thead>\n        <tbody>`;

  filtradas.forEach(p => {
    const dataText = p.data ? p.data : '';
    const valorText = (p.valorTotal === null || p.valorTotal === undefined) ? '—' : `R$ ${Number(p.valorTotal).toFixed(2)}`;
    html += `\n
        <tr data-id="${p.id}">\n
            <td>${p.id}</td>\n
            <td>${dataText}</td>\n
            <td>${p.quantidade}</td>\n
            <td>${p.unidadeMedida}</td>\n
            <td>${valorText}</td>\n
            <td class="producoes-acoes"></td>\n
        </tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;

  filtradas.forEach(p => {
    const row = container.querySelector(`tr[data-id='${p.id}']`);
    const actionsTd = row.querySelector('.producoes-acoes');

    const upd = document.createElement('button');
    upd.className = 'btn btn-sm btn-outline-primary me-2';
    upd.textContent = 'Atualizar';
    upd.addEventListener('click', async ()=>{
      renderizarFormularioProducao(p.raw);
      document.getElementById('formulario-producao').style.display = 'block';
    });

    const del = document.createElement('button');
    del.className = 'btn btn-sm btn-danger';
    del.textContent = 'Deletar';
    del.addEventListener('click', async ()=>{
      if (!confirm(`Deseja remover a produção id=${p.id}?`)) return;
      try{
        const res = await fetch(`/producoes/${p.id}`, { method: 'DELETE' });
        if (!res.ok){
          const txt = await res.text(); throw new Error(txt || res.statusText);
        }
        // remove from estado.producoes
        estado.producoes = (estado.producoes || []).filter(x => x.id !== p.id);
        renderizarProducoes();
        mostrarMensagem('Produção removida', 'success');
      }catch(err){
        console.error(err);
        mostrarMensagem('Erro ao remover produção: '+(err.message||err.statusText), 'error');
      }
    });

    actionsTd.appendChild(upd);
    actionsTd.appendChild(del);
  });
}

function renderizarFormularioProducao(producao){
  const container = document.getElementById('formulario-producao');
  if (!estado.minaSelecionada && !producao) {
    return;
  }
  const isEdit = !!producao;
  const titulo = isEdit ? `Editar Produção #${producao.id}` : `Adicionar Produção para ${estado.minaSelecionada?.nome ?? ''}`;
  const dataVal = isEdit ? (producao.data ?? '') : '';
  const quantidadeVal = isEdit ? (producao.quantidade ?? '') : '';
  const unidadeVal = isEdit ? (producao.unidadeMedida ?? '') : '';
  const valorVal = isEdit ? (producao.valorTotal ?? '') : '';

  container.innerHTML = `
    <h4>${titulo}</h4>
    <form id="form-prod">
      <label>Data: <input type="date" name="data" value="${dataVal}" required></label>
      <label>Quantidade: <input type="number" name="quantidade" min="0.01" step="0.01" value="${quantidadeVal}" required></label>
      <label>Unidade de Medida: <input type="text" name="unidadeMedida" value="${unidadeVal}" required></label>
      <label>Valor Total (R$): <input type="number" name="valorTotal" min="0" step="0.01" value="${valorVal}" required></label>
      <div class="acoes-form">
        <button type="submit" class="btn btn-primary btn-sm">${isEdit ? 'Atualizar' : 'Salvar'}</button>
        <button type="button" id="cancelar-prod" class="btn btn-secondary btn-sm">Cancelar</button>
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
      geoMineId: estado.minaSelecionada ? estado.minaSelecionada.id : (producao ? (producao.geoMineModel?.id ?? producao.geoMineId) : null)
    };
    if (!body.data || !body.unidadeMedida || body.quantidade <= 0 || body.valorTotal < 0){
      mostrarMensagem('Dados inválidos. Verifique os campos.', 'error');
      return;
    }

    try{
      if (isEdit){
        const res = await fetch(`/producoes/${producao.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok){
          const txt = await res.text(); throw new Error(txt || res.statusText);
        }
        const atualizado = await res.json();
        estado.producoes = (estado.producoes || []).map(p => p.id === atualizado.id ? atualizado : p);
        renderizarProducoes();
        mostrarMensagem('Produção atualizada', 'success');
      } else {
        const res = await fetch('/producoes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok){
          const txt = await res.text(); throw new Error(txt || res.statusText);
        }
        const salvo = await res.json();
        estado.producoes.push(salvo);
        renderizarProducoes();
        mostrarMensagem('Produção criada com sucesso', 'success');
      }
      container.style.display = 'none';
    }catch(err){
      console.error(err);
      mostrarMensagem('Erro ao salvar produção: '+(err.message||err.statusText), 'error');
    }
  });

  document.getElementById('cancelar-prod').addEventListener('click', ()=>{
    document.getElementById('formulario-producao').style.display = 'none';
  });
}

function renderizarFormularioMina(mina){
  const container = document.getElementById('form-nova-mina');
  container.style.display = 'block';
  const isEdit = !!mina;
  container.innerHTML = `
    <h4>${isEdit ? 'Atualizar Mina' : 'Nova Mina'}</h4>
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
        <button type="submit" class="btn btn-primary btn-sm">${isEdit ? 'Atualizar' : 'Criar'}</button>
        <button type="button" id="cancelar-nova-mina" class="btn btn-secondary btn-sm">Cancelar</button>
      </div>
    </form>
  `;

  const form = document.getElementById('form-nova-mina-form');

  if (isEdit){
    form.elements['nome'].value = mina.nome ?? (mina.nome === undefined ? '' : mina.nome);
    form.elements['localizacao'].value = mina.localizacao ?? '';
    form.elements['mineral'].value = mina.mineral ?? '';
    form.elements['ativa'].value = (mina.ativa === true) ? 'true' : 'false';
  }

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
      if (isEdit){
        const res = await fetch(`/mina/${mina.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok){
          const txt = await res.text(); throw new Error(txt || res.statusText);
        }
        const atualizada = await res.json();
        estado.minas = (estado.minas || []).map(m => m.id === atualizada.id ? atualizada : m);
        estado.minaSelecionada = atualizada;
        renderizarMinas();
        renderizarDetalhesMina();
        mostrarMensagem('Mina atualizada com sucesso', 'success');
      } else {
        const res = await fetch('/mina', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok){
          const txt = await res.text(); throw new Error(txt || res.statusText);
        }
        const nova = await res.json();
        estado.minas.push(nova);
        renderizarMinas();
        mostrarMensagem('Mina criada com sucesso', 'success');
      }
      container.style.display = 'none';
    }catch(err){
      console.error(err);
      mostrarMensagem((isEdit ? 'Erro ao atualizar mina: ' : 'Erro ao criar mina: ') + err.message, 'error');
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
        if (container.style.display === 'block') container.style.display = 'none'; else renderizarFormularioMina();
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
