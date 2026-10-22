# FLORESTA V269 — inventário RPG mobile

Base: GitHub main d4ac45007bb0a9ccaf16c0a64a0f994f9c3d90a5 (V268 e correções do editor de HUD). Preservados o analógico com corrida, os botões personalizáveis, o equipar/guardar da barra e a poção de uso direto. Entradas PC.html e Mobile.html.

## Implementação

Layout baseado na imagem aprovada: equipamento com personagem à esquerda; grade com quatro filtros no centro; detalhes, equipar/guardar e soltar à direita; nove espaços configuráveis abaixo da grade. No retrato, equipamento/detalhes ficam acima da mochila, preservando alvos de toque. As regiões têm rolagem independente.

A prévia é uma captura geométrica do personagem real e dos equipamentos, renderizada em contexto pequeno separado apenas ao abrir ou alterar equipamento/aparência. Não altera o esqueleto, a câmera, as texturas nem os modelos originais. Geometrias e materiais da prévia são próprios e descartados ao atualizar/sair.

A seleção e os botões de equipar usam o inventário existente. Filtros ocultam botões mantendo a ordem original para compatibilidade com a organização de slots. Segurar por 320ms inicia o arraste; deslizar antes disso preserva a rolagem. Toque no item e depois no atalho continua disponível.

Soltar 1 usa um novo registro de coleta genérico no controlador nativo. O item não é eliminado: uma unidade vai para o chão com o mesmo ID e dados. Equipamento em uso é guardado antes da transferência. A tocha inicial não é descartável. A coleta revalida proximidade na ação para evitar reaproveitar candidatos antigos depois de fechar a mochila.

Vida/XP/peso/durabilidade são reais. Não há mana, vigor, dano ou durabilidade de arma fictícios. Dividir aparece desabilitado, pois o inventário agrupa uma pilha por ID; não se introduz uma segunda estrutura de armazenamento.

## Validação

Chromium com toque emulado e renderização limitada durante QA, sem alegar FPS ou uso em aparelho físico. Testes usam itens de preparação adicionados ao inventário para conferir fluxos.

- Inicialização e abertura pela mochila; prévia real inspecionada visualmente.
- Filtros, seleção do item filtrado, equipamento e guardar pelos botões nativos.
- Item filtrado atribuído ao acesso rápido; segurar/arrastar recurso para outro espaço.
- Layouts 844×390, 667×375 e 390×844: regiões principais dentro do viewport.
- Código do inventário e estilo mobile ausentes no PC.
- Sintaxe JS e git diff --check.

A ocorrência antecipada de combatTargets em 096_legacy_095.js é preexistente e não impediu estes testes. O erro antigo do catálogo de nomes da barra ao atribuir cipó foi corrigido no controlador 109.

Resultado final: passou também o ciclo completo de soltar arma equipada, recolher novamente, soltar uma unidade de recurso e recuperar a quantidade original sem perda, pelo controlador de coleta nativo.
