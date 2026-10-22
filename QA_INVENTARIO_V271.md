# FLORESTA V271 — inventário adaptado ao celular

Base GitHub: ca7f211e47c07d78144452128938a0f737a5ea49, integrando os menus RPG da V270 e a corrida automática com distância ajustável. O inventário substitui a disposição fixa em três colunas por mochila com detalhes laterais e personagem opcional.

- Cabeçalho único de 44 CSS px com peso/capacidade, personagem, navegação e fechar.
- Abas de outras telas em menu recolhível; filtros em linha de 44px.
- Equipamento em painel próprio; geometria da prévia só é preparada ao abrir o personagem.
- Grade em 844×390: 579×191 CSS px; botões de item de 62px de altura. A grade anterior media 329×119 aproximadamente com o mesmo viewport.
- Atalhos de 46px, nove espaços por deslize; tocar item/espaço ou segurar e arrastar.
- Ações do item à direita em paisagem; painel inferior em retrato, com voltar e acesso rápido mantido.
- Espaços vazios excedentes ficam recolhidos visualmente; capacidade nativa intacta. Não há alteração da ordem dos índices dos itens.
- Arraste ativo impede o gesto nativo de rolagem; mover antes do tempo de segurar preserva o scroll.
- Removidos da tela o botão de divisão sem suporte e o botão de soltar quando indisponível.

## Verificação

Chromium com toque emulado, renderização limitada durante QA, preparação de itens para os testes. Não se trata de teste em telefone físico ou de FPS.

Abertura/fechamento pelo HUD; painel de personagem e prévia real; menu de navegação; filtros e seleção nativa; equipar/guardar; item filtrado em atalho; arraste de recurso; soltar/recolher arma equipada; soltar/recolher recurso sem perda; tamanhos 844×390, 667×375 e retrato 390×844; folha/controlador ausentes no PC. Revisão visual das capturas de todos os estados, incluindo os detalhes no retrato, e checagem dos limites das regiões visíveis.

Ocorrência preexistente de combatTargets em 096_legacy_095.js na inicialização. Não impediu esses fluxos. Mecânicas, dados, mundo, modelos originais, câmera, controles V268 e interface PC preservados.

Integração final: módulos de fabricação/habilidades e bestiário da V270 carregados junto ao inventário; API da corrida automática presente. Todos os fluxos acima repetidos com o carregador integrado da V271.
