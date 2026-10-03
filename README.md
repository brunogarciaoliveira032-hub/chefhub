# ChefHub Mobile — PWA instalável

Esta pasta contém a versão mobile do ChefHub, pensada para Android e iPhone.

## Abrir e instalar

Para que a instalação funcione, publique a pasta `mobile` em HTTPS. Para testar localmente, sirva-a por `localhost`; abrir o `index.html` diretamente ainda permite ver as telas, mas não habilita o service worker nem a instalação.

- Android/Chrome: abra o site e escolha **Instalar app** no menu do navegador quando disponível.
- iPhone/Safari: abra o site, toque em **Compartilhar** e escolha **Adicionar à Tela de Início**.

## Conteúdo editável

- Catálogo, categorias e parceiros: início de `app.js`.
- Nome, cores e metadados do aplicativo: `manifest.webmanifest`.
- Lista de arquivos disponíveis offline: `service-worker.js`.

A PWA já inclui cache offline de todos os arquivos do aplicativo e simulações funcionais de navegação, carrinho, checkout e rastreio.
