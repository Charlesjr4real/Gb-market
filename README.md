# Mercado GB — protótipo

Protótipo estático e responsivo de um marketplace local para a Guiné-Bissau.

## Funcionalidades

- Página inicial com pesquisa, categorias e anúncios recentes
- Pesquisa por texto e filtros por categoria, localização, preço e estado
- Página individual de cada anúncio
- Contacto por WhatsApp simulado, sem enviar mensagens reais
- Fluxo em três passos para publicar um anúncio
- Área do comprador com favoritos
- Área do vendedor com anúncios e métricas fictícias
- Persistência local de favoritos e anúncios criados

## Executar localmente

Não há dependências nem etapa de compilação. Abre `index.html` diretamente no navegador ou executa um servidor estático:

```bash
python3 -m http.server 4173
```

Depois visita `http://localhost:4173`.

Para preparar os ficheiros de publicação:

```bash
npm run build
```

## Testes

Instala a única dependência de desenvolvimento e executa os testes dos fluxos principais:

```bash
npm install
npm test
```

## Estrutura

- `index.html`: estrutura base e ícones
- `styles.css`: design responsivo
- `app.js`: dados fictícios, navegação e interações

Os dados são apenas demonstrativos. Não existe servidor, autenticação, pagamentos nem contactos reais.
