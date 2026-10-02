const produtosIniciais = [
    { 
        codigo: 'NK-TSH-001', 
        nome: "Camiseta Nike Dri-FIT", 
        desc: "Tecnologia antitranspirante leve para máximo desempenho nos treinos.", 
        custo: 80.00, 
        preco: 199.90, 
        estoque: 50, 
        img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop" 
    },
    { 
        codigo: 'NK-HD-002', 
        nome: "Moletom Nike Club Fleece", 
        desc: "Capuz macio e interior em algodão escovado para conforto térmico.", 
        custo: 180.00, 
        preco: 399.90, 
        estoque: 30, 
        img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop" 
    },
    { 
        codigo: 'NK-SNK-003', 
        nome: "Tênis Nike Air Force 1 '07", 
        desc: "O ícone atemporal com amortecimento Air e acabamento premium.", 
        custo: 350.00, 
        preco: 699.90, 
        estoque: 40, 
        img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop" 
    }
];
 
function getProdutos() {
    return JSON.parse(localStorage.getItem('produtos_nike')) || produtosIniciais;
}
 
function getVendas() {
    return JSON.parse(localStorage.getItem('vendas_nike')) || [];
}
 
function getCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho_nike')) || [];
}
 
function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho_nike', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}
 
if (!localStorage.getItem('produtos_nike')) {
    localStorage.setItem('produtos_nike', JSON.stringify(produtosIniciais));
}
 
function atualizarContadorCarrinho() {
    const carrinho = getCarrinho();
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = totalItens;
}
 
function renderCatalogo() {
    const grid = document.getElementById('grid-produtos');
    if (!grid) return;
    const produtos = getProdutos();
    grid.innerHTML = '';
 
    produtos.forEach(p => {
        const esgotado = p.estoque === 0;
        grid.innerHTML += `
<div class="card">
<div class="img-container">
<img src="${p.img}" alt="${p.nome}" loading="lazy">
</div>
<h3>${p.nome}</h3>
<p><b>REF:</b> ${p.codigo}<br>${p.desc}</p>
<div class="preco">R$ ${p.preco.toFixed(2)}</div>
<div class="estoque ${esgotado ? 'esgotado' : ''}">
                    ${esgotado ? 'PRODUTO ESGOTADO' : `Estoque disponível: ${p.estoque}`}
</div>
<form onsubmit="adicionarAoCarrinho(event, '${p.codigo}')">
<input type="number" id="qtd-${p.codigo}" min="1" max="${p.estoque}" value="1" ${esgotado ? 'disabled' : ''}>
<button type="submit" ${esgotado ? 'disabled' : ''}>Adicionar ao Carrinho</button>
</form>
</div>
        `;
    });
}
 
function adicionarAoCarrinho(e, codigo) {
    e.preventDefault();
    const qtdInput = document.getElementById(`qtd-${codigo}`);
    const qtdPedida = parseInt(qtdInput.value);
 
    const produtos = getProdutos();
    const produto = produtos.find(p => p.codigo === codigo);
    const carrinho = getCarrinho();
 
    const itemExistente = carrinho.find(item => item.codigo === codigo);
    const qtdAtualNoCarrinho = itemExistente ? itemExistente.quantidade : 0;
 
    if (qtdPedida + qtdAtualNoCarrinho > produto.estoque) {
        alert(`Quantidade excede o estoque disponível! Você já tem ${qtdAtualNoCarrinho} item(ns) no carrinho.`);
        return;
    }
 
    if (itemExistente) {
        itemExistente.quantidade += qtdPedida;
    } else {
        carrinho.push({ codigo, quantidade: qtdPedida });
    }
 
    salvarCarrinho(carrinho);
    alert(`${produto.nome} adicionado ao carrinho!`);
}
 
function abrirCarrinho() {
    const modal = document.getElementById('modal-carrinho');
    if (modal) {
        modal.style.display = 'flex';
        renderCarrinho();
    }
}
 
function fecharCarrinho() {
    const modal = document.getElementById('modal-carrinho');
    if (modal) modal.style.display = 'none';
}
 
function removerDoCarrinho(index) {
    let carrinho = getCarrinho();
    carrinho.splice(index, 1);
    salvarCarrinho(carrinho);
    renderCarrinho();
}
 
function renderCarrinho() {
    const container = document.getElementById('itens-carrinho');
    const totalSpan = document.getElementById('cart-total');
    if (!container) return;
 
    const carrinho = getCarrinho();
    const produtos = getProdutos();
 
    if (carrinho.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">O seu carrinho está vazio.</p>';
        if (totalSpan) totalSpan.innerText = 'R$ 0,00';
        return;
    }
 
    let totalGeral = 0;
    container.innerHTML = '';
 
    carrinho.forEach((item, index) => {
        const produto = produtos.find(p => p.codigo === item.codigo);
        if (!produto) return;
 
        const subtotal = produto.preco * item.quantidade;
        totalGeral += subtotal;
 
        container.innerHTML += `
<div class="item-carrinho">
<img src="${produto.img}" alt="${produto.nome}">
<div class="item-info">
<h4>${produto.nome}</h4>
<p>R$ ${produto.preco.toFixed(2)} x ${item.quantidade}</p>
<strong>Subtotal: R$ ${subtotal.toFixed(2)}</strong>
</div>
<button class="btn-remover" onclick="removerDoCarrinho(${index})">🗑️</button>
</div>
        `;
    });
 
    if (totalSpan) totalSpan.innerText = `R$ ${totalGeral.toFixed(2)}`;
}
 
function finalizarCompraCarrinho() {
    const carrinho = getCarrinho();
    if (carrinho.length === 0) {
        alert("O seu carrinho está vazio!");
        return;
    }
 
    let produtos = getProdutos();
    let vendas = getVendas();
 
    for (let item of carrinho) {
        let produto = produtos.find(p => p.codigo === item.codigo);
        if (!produto || item.quantidade > produto.estoque) {
            alert(`Estoque insuficiente para ${produto ? produto.nome : item.codigo}!`);
            return;
        }
    }
 
    carrinho.forEach(item => {
        let produto = produtos.find(p => p.codigo === item.codigo);
        produto.estoque -= item.quantidade;
 
        vendas.push({
            codigoProduto: item.codigo,
            nomeProduto: produto.nome,
            quantidade: item.quantidade,
            valorTotal: item.quantidade * produto.preco,
            data: new Date().toISOString()
        });
    });
 
    localStorage.setItem('produtos_nike', JSON.stringify(produtos));
    localStorage.setItem('vendas_nike', JSON.stringify(vendas));
    localStorage.removeItem('carrinho_nike');
 
    atualizarContadorCarrinho();
    fecharCarrinho();
    alert("Compra realizada com sucesso!");
    renderCatalogo();
}
 
let meuGrafico = null;
function renderRelatorio(dataIni = null, dataFim = null) {
    const canvas = document.getElementById('graficoVendas');
    if (!canvas) return;
 
    const vendas = getVendas();
    let vendasFiltradas = vendas;
 
    if (dataIni && dataFim) {
        vendasFiltradas = vendas.filter(v => {
            const dataV = v.data.split('T')[0];
            return dataV >= dataIni && dataV <= dataFim;
        });
    }
 
    const totaisPorProduto = { 'NK-TSH-001': 0, 'NK-HD-002': 0, 'NK-SNK-003': 0 };
    let faturamento = 0;
 
    vendasFiltradas.forEach(v => {
        totaisPorProduto[v.codigoProduto] += v.quantidade;
        faturamento += v.valorTotal;
    });
 
    document.getElementById('resumoMetricas').innerHTML = `
<div class="card" style="flex:1;"><b>Total Faturado:</b> R$ ${faturamento.toFixed(2)}</div>
<div class="card" style="flex:1;"><b>Total Unidades Vendidas:</b> ${Object.values(totaisPorProduto).reduce((a,b)=>a+b, 0)} un.</div>
    `;
 
    const ctx = canvas.getContext('2d');
    if (meuGrafico) meuGrafico.destroy();
 
    meuGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Camiseta Dri-FIT", "Moletom Club Fleece", "Tênis Air Force 1"],
            datasets: [{
                label: 'Unidades Vendidas',
                data: [totaisPorProduto['NK-TSH-001'], totaisPorProduto['NK-HD-002'], totaisPorProduto['NK-SNK-003']],
                backgroundColor: ['#ff5500', '#3b82f6', '#10b981']
            }]
        },
        options: { 
            responsive: true, 
            scales: { 
                y: { beginAtZero: true, grid: { color: '#27272a' }, ticks: { color: '#a1a1aa' } },
                x: { grid: { color: '#27272a' }, ticks: { color: '#a1a1aa' } }
            } 
        }
    });
}
 
function filtrarRelatorio() {
    const ini = document.getElementById('dataInicio').value;
    const fim = document.getElementById('dataFim').value;
    renderRelatorio(ini, fim);
}
