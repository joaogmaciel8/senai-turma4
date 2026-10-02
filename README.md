# 🍝 Cucina della Nonna - Sistema E-commerce & Gestão
 
Sistema web completo para e-commerce de culinária italiana artesanal com controlo de stock e painel de relatórios integrado.
 
## 🚀 Tecnologias Utilizadas
- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **Base de Dados:** MySQL / MariaDB (`banco.sql`)
 
## 📦 Gestão de Stock
- Cada produto possui um **limite inicial de 50 unidades em stock**.
- O sistema valida a quantidade antes de adicionar ao carrinho e impede compras que excedam o limite.
- Ao finalizar a encomenda, as unidades são abatidas automaticamente do inventário.
 
## 📁 Estrutura do Projeto
- `index.html`: Página do catálogo, visualização de stock e carrinho de compras.
- `relatorios.html`: Painel administrativo de vendas, histórico e inventário.
- `style.css`: Estilização unificada do projeto.
- `app.js`: Lógica do carrinho, validação e atualização dinâmica de stock.
- `banco.sql`: Estrutura de tabelas e dados iniciais (com coluna `estoque`).
- `documentação`: Manual de arquitetura do sistema.
- `LICENÇA`: Licença open-source MIT.
 
## 🛠️ Como Executar
1. Abra o ficheiro `index.html` num navegador web.
2. Navegue entre as páginas de Catálogo e Relatórios através do menu superior.
3. Importe o ficheiro `banco.sql` na sua base de dados MySQL/MariaDB para integração com o backend.
