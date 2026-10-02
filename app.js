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
 
// Inicializa o localStorage caso esteja vazio
if (!localStorage.getItem('produtos_nike')) {
    localStorage.setItem('produtos_nike', JSON.stringify(produtosIniciais));
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
<form onsubmit="fazerPedido(event, '${p.codigo}')">
<input type="number" id="qtd-${p.codigo}" min="1" max="${p.estoque}" value="1" ${esgotado ? 'disabled' : ''}>
<button type="submit" ${esgotado ? 'disabled' : ''}>Comprar</button>
</form>
</div>
        `;
    });
}
 
function fazerPedido(e, codigo) {
    e.preventDefault();
    const qtdInput = document.getElementById(`qtd-${codigo}`);
    const qtdPedida = parseInt(qtdInput.value);
 
    let produtos = getProdutos();
    let produto = produtos.find(p => p.codigo === codigo);
 
    if (qtdPedida > produto.estoque) {
        alert("Quantidade solicitada é maior do que o estoque disponível!");
        return;
    }
 
    produto.estoque -= qtdPedida;
    localStorage.setItem('produtos_nike', JSON.stringify(produtos));
 
    let vendas = getVendas();
    vendas.push({
        codigoProduto: codigo,
        nomeProduto: produto.nome,
        quantidade: qtdPedida,
        valorTotal: qtdPedida * produto.preco,
        data: new Date().toISOString()
    });
    localStorage.setItem('vendas_nike', JSON.stringify(vendas));
 
    alert("Pedido realizado com sucesso!");
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
