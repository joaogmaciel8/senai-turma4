-- Criação da Base de Dados
CREATE DATABASE IF NOT EXISTS cucina_della_nonna;
USE cucina_della_nonna;
 
-- Tabela de Produtos (com limite de stock de 50 unidades)
CREATE TABLE IF NOT EXISTS produtos (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL DEFAULT 50,
    categoria VARCHAR(50),
    imagem_url TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20)
);
 
-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    valor_total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(30) DEFAULT 'Em Preparação',
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
 
-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    produto_id VARCHAR(50),
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
 
-- Inserção inicial com limite de 50 unidades em stock para cada produto
INSERT INTO produtos (id, nome, preco, estoque, categoria, imagem_url) VALUES
('pizza', 'Pizza Napoletana Tradizionale', 58.90, 50, 'Pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591'),
('macarrao', 'Spaghetto al Ragù Bolognese', 46.00, 50, 'Massa', 'https://images.unsplash.com/photo-1621996346565-e3d5d6281288'),
('lasanha', 'Lasagna Classica al Forno', 52.00, 50, 'Massa', 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3');
