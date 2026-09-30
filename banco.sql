CREATE TABLE IF NOT EXISTS produtos (
    codigo TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    custo REAL NOT NULL,
    valor_venda REAL NOT NULL,
    estoque INTEGER NOT NULL,
    imagem TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_produto TEXT NOT NULL,
    quantidade INTEGER NOT NULL,
    valor_total REAL NOT NULL,
    data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (codigo_produto) REFERENCES produtos(codigo)
);

INSERT INTO produtos VALUES 
('NK-TSH-001', 'Camiseta Nike Dri-FIT', 'Camiseta leve e respirável para treino e uso diário.', 80.00, 199.90, 50, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'),
('NK-HD-002', 'Moletom Nike Club Fleece', 'Moletom com capuz macio e aconchegante em algodão.', 180.00, 399.90, 30, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500'),
('NK-SNK-003', 'Tênis Nike Air Force 1 ''07', 'O ícone clássico do basquete em couro premium.', 350.00, 699.90, 40, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500');