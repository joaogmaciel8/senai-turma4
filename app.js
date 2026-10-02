// PRODUTOS COM IMAGENS MODERNAS E MINIMALISTAS DO UNSPLASHconst produtosIniciais = [
    { 
        codigo: 'NK-TSH-001', 
        nome: "Camiseta Nike Tech Fleece Core", 
        desc: "Algodão premium encorpado com corte relaxed fit minimalista.", 
        custo: 80.00, 
        preco: 229.90, 
        estoque: 45, 
        img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop" 
    },
    { 
        codigo: 'NK-HD-002', 
        nome: "Moletom Nike Solo Swoosh Hoodie", 
        desc: "Design limpo, tecido denso e toque ultra suave interior.", 
        custo: 180.00, 
        preco: 449.90, 
        estoque: 25, 
        img: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop" 
    },
    { 
        codigo: 'NK-SNK-003', 
        nome: "Tênis Nike Air Force 1 '07 Mono", 
        desc: "Estética monocromática atemporal com couro de grão integral.", 
        custo: 350.00, 
        preco: 799.90, 
        estoque: 35, 
        img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop" 
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
    const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = total;
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
                <div>
                    <div class="img-container">
                        <img src="${p.img}" alt="${p.nome}">
                    </div>
                    <h3>${p.nome}</h3>
                    <p>${p.desc}</p>
                </div>
                <div>
                    <div class="preco">R$ ${p.preco.toFixed(2)}</div>
                    <div class="estoque ${esgotado ? 'esgotado' : ''}">
                        ${esgotado ? 'Esgotado' : `Disponível em estoque: ${p.estoque} un.`}                    </div>
                    <form onsubmit="adicionarAoCarrinho(event, '${p.codigo}')" class="card-actions">
                        <input type="number" id="qtd-${p.codigo}" class="input-neutral input-qtd" min="1" max="${p.estoque}" value="1" ${esgotado ? 'disabled' : ''}>
                        <button type="submit" class="btn-primary" ${esgotado ? 'disabled' : ''}>Adicionar ao Carrinho</button>
                    </form>
                </div>
            </div>
        `;
    });
}
function adicionarAoCarrinho(e, codigo) {
    e.preventDefault();
    const qtdPedida = parseInt(document.getElementById(`qtd-${codigo}`).value);
    const produtos = getProdutos();
    const produto = produtos.find(p => p.codigo === codigo);
    const carrinho = getCarrinho();

    const itemExistente = carrinho.find(item => item.codigo === codigo);
    const qtdAtual = itemExistente ? itemExistente.quantidade : 0;

    if (qtdPedida + qtdAtual > produto.estoque) {
        alert(`Estoque limite atingido! Você já possui ${qtdAtual} no carrinho.`);
        return;
    }

    if (itemExistente) {
        itemExistente.quantidade += qtdPedida;
    } else {
        carrinho.push({ codigo, quantidade: qtdPedida });
    }

    salvarCarrinho(carrinho);
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
function trocarFormaPagamento(tipo) {
    document.getElementById('campo-pix').style.display = tipo === 'pix' ? 'block' : 'none';
    document.getElementById('campo-cartao').style.display = tipo === 'cartao' ? 'block' : 'none';
    document.getElementById('campo-boleto').style.display = tipo === 'boleto' ? 'block' : 'none';
    renderCarrinho();
}
function renderCarrinho() {
    const container = document.getElementById('itens-carrinho');
    const totalSpan = document.getElementById('cart-total');
    if (!container) return;

    const carrinho = getCarrinho();
    const produtos = getProdutos();

    if (carrinho.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem 0;">Seu carrinho está vazio.</p>';
        if (totalSpan) totalSpan.innerText = 'R$ 0,00';
        return;
    }

    let subtotalGeral = 0;
    container.innerHTML = '';

    carrinho.forEach((item, index) => {
        const produto = produtos.find(p => p.codigo === item.codigo);
        if (!produto) return;

        const subtotal = produto.preco * item.quantidade;
        subtotalGeral += subtotal;

        container.innerHTML += `
            <div class="item-carrinho">
                <img src="${produto.img}" alt="${produto.nome}">
                <div class="item-info">
                    <h4>${produto.nome}</h4>
                    <p>R$ ${produto.preco.toFixed(2)} × ${item.quantidade}</p>
                    <strong>R$ ${subtotal.toFixed(2)}</strong>
                </div>
                <button class="btn-remover" onclick="removerDoCarrinho(${index})">&times;</button>
            </div>
        `;
    });

    const formaPagamento = document.querySelector('input[name="formaPagamento"]:checked')?.value || 'pix';
    let totalFinal = subtotalGeral;

    if (formaPagamento === 'pix') {
        totalFinal = subtotalGeral * 0.95;
    }

    if (totalSpan) {
        totalSpan.innerText = `R$ ${totalFinal.toFixed(2)}`;
    }
}
function finalizarCompraCarrinho() {
    const carrinho = getCarrinho();
    if (carrinho.length === 0) {
        alert("O seu carrinho está vazio!");
        return;
    }

    const formaPagamento = document.querySelector('input[name="formaPagamento"]:checked').value;

    if (formaPagamento === 'cartao') {
        const num = document.getElementById('cartao-numero').value;
        const val = document.getElementById('cartao-validade').value;
        const cvv = document.getElementById('cartao-cvv').value;
        if (!num || !val || !cvv) {
            alert("Preencha os dados do cartão de crédito.");
            return;
        }
    }

    let produtos = getProdutos();
    let vendas = getVendas();

    for (let item of carrinho) {
        let produto = produtos.find(p => p.codigo === item.codigo);
        if (!produto || item.quantidade > produto.estoque) {
            alert(`Estoque indisponível para ${produto ? produto.nome : item.codigo}!`);
            return;
        }
    }

    carrinho.forEach(item => {
        let produto = produtos.find(p => p.codigo === item.codigo);
        produto.estoque -= item.quantidade;

        let valorItem = produto.preco * item.quantidade;
        if (formaPagamento === 'pix') valorItem *= 0.95;

        vendas.push({
            codigoProduto: item.codigo,
            nomeProduto: produto.nome,
            quantidade: item.quantidade,
            valorTotal: valorItem,
            formaPagamento: formaPagamento.toUpperCase(),
            data: new Date().toISOString()
        });
    });

    localStorage.setItem('produtos_nike', JSON.stringify(produtos));
    localStorage.setItem('vendas_nike', JSON.stringify(vendas));
    localStorage.removeItem('carrinho_nike');

    atualizarContadorCarrinho();
    fecharCarrinho();
    alert(`Pedido confirmado via ${formaPagamento.toUpperCase()}!`);
    renderCatalogo();
}
let meuGrafico = null;function renderRelatorio(dataIni = null, dataFim = null) {
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
        <div class="card">
            <span>Faturamento Bruto</span>
            <strong>R$ ${faturamento.toFixed(2)}</strong>
        </div>
        <div class="card">
            <span>Unidades Vendidas</span>
            <strong>${Object.values(totaisPorProduto).reduce((a,b)=>a+b, 0)} un.</strong>
        </div>
    `;

    const tbody = document.getElementById('tabela-vendas-body');
    if (tbody) {
        tbody.innerHTML = '';
        vendasFiltradas.slice(-10).reverse().forEach(v => {
            tbody.innerHTML += `
                <tr>
                    <td>${new Date(v.data).toLocaleString('pt-BR')}</td>
                    <td>${v.nomeProduto}</td>
                    <td>${v.quantidade}</td>
                    <td>R$ ${v.valorTotal.toFixed(2)}</td>
                    <td><span class="tag-payment">${v.formaPagamento || 'PIX'}</span></td>
                </tr>
            `;
        });
    }

    const ctx = canvas.getContext('2d');
    if (meuGrafico) meuGrafico.destroy();

    // GRÁFICO EM CORES NEUTRAS MONOCROMÁTICAS    meuGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Tech Fleece T-Shirt", "Solo Swoosh Hoodie", "Air Force 1 Mono"],
            datasets: [{
                label: 'Unidades Vendidas',
                data: [totaisPorProduto['NK-TSH-001'], totaisPorProduto['NK-HD-002'], totaisPorProduto['NK-SNK-003']],
                backgroundColor: ['#f4f4f5', '#a1a1aa', '#525252'],
                borderRadius: 8            }]
        },
        options: { 
            responsive: true, 
            scales: { 
                y: { beginAtZero: true, grid: { color: '#27272a' }, ticks: { color: '#71717a' } },
                x: { grid: { color: '#27272a' }, ticks: { color: '#71717a' } }
            },
            plugins: {
                legend: { labels: { color: '#a1a1aa' } }
            }
        }
    });
}
function filtrarRelatorio() {
    const ini = document.getElementById('dataInicio').value;
    const fim = document.getElementById('dataFim').value;
    renderRelatorio(ini, fim);
}
