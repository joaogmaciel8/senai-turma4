-- Estrutura da Base de Dados Relacional - Nike Core Store (SQLite)CREATE TABLE IF NOT EXISTS produtos (
    codigo TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    custo REAL NOT NULL,
    valor_venda REAL NOT NULL,
    estoque INTEGER NOT NULL,
    imagem TEXT
);
CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_produto TEXT NOT NULL,
    quantidade INTEGER NOT NULL,
    valor_total REAL NOT NULL,
    forma_pagamento TEXT NOT NULL,
    data_venda TEXT NOT NULL,
    FOREIGN KEY (codigo_produto) REFERENCES produtos(codigo)
);
-- Carga de dados inicial com novas imagens e produtosINSERT INTO produtos (codigo, nome, descricao, custo, valor_venda, estoque, imagem) VALUES('NK-TSH-001', 'Camiseta Nike Tech Fleece Core', 'Algodão premium encorpado com corte relaxed fit minimalista.', 80.00, 229.90, 45, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'),
('NK-HD-002', 'Moletom Nike Solo Swoosh Hoodie', 'Design limpo, tecido denso e toque ultra suave interior.', 180.00, 449.90, 25, 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop'),
('NK-SNK-003', 'Tênis Nike Air Force 1 ''07 Mono', 'Estética monocromática atemporal com couro de grão integral.', 350.00, 799.90, 35, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop');
