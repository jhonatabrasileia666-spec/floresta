# FLORESTA V267 — HUD RPG para celular

Composição aprovada pelo jogador: medalhão de nível com arco de experiência; barras de vida e XP; durabilidade azul apenas com armadura equipada. Não há barras de mana/vigor fictícias nem mudanças de regras de combate.

Equipamento: nove slots nativos por deslize. Artes: atalhos de Ignis com bloqueio conforme a escolha conquistada; no criativo respeitam os controles originais. Poção: um slot abre a seleção, o equipamento na mão esquerda e o uso, mantendo os eventos e animações originais.

Ações de combate ancoradas no polegar direito. Defesa somente com escudo. Correr e agachar mantêm os controles nativos. Habilidades acessíveis no nível e no códice; montaria, poderes, ferraria e construção no códice. Jornada nativa recolhida, expansível.

Construção: categorias horizontais, lista de peças com rolagem própria, detalhes e confirmação; projetos e busca recolhidos.

Aplicação exclusiva mobile: novo módulo 149 carregado após adaptador 148 apenas na plataforma mobile. Nenhuma alteração no Jogo.html, motor, mundo, animações, modelos, salvamentos ou interface de PC.

Validação em Chromium com toque emulado; sem alegação de teste em aparelho físico. Registro dos resultados ao concluir os testes.

## Resultados

- Inicialização real do jogo e partida de sobrevivência no Chromium. Renderização limitada durante QA para reduzir custo do renderizador de software; não é medição de FPS.
- Inspeção das capturas renderizadas do HUD, construção, poções e tamanhos 844×390, 667×375 e 390×844. Alvos de ação entre 44 e 68 CSS px; nenhum controle principal fora do viewport.
- Toque abre habilidades pelo medalhão, códice e menu de construção; seleção de peça habilita confirmação, com preview e materiais nativos.
- Botões legados que perdiam o clique de compatibilidade recebem ativação por pointerup com filtro de deslize e deduplicação.
- Seletor de poções abre/fecha; funções de equipar e usar permanecem nos botões nativos, em painel próprio rolável.
- Rolamento nativo ativo após toque; escudo nativo bloqueia ao segurar e libera ao soltar.
- Experiência muda o preenchimento e durabilidade aparece ao equipar armadura.
- PC não carrega o controlador, folha de estilo ou atributos do HUD mobile.
- Verificação de sintaxe dos módulos editados e git diff --check.

Permanece a ocorrência preexistente em 096_legacy_095.js, acesso antecipado a combatTargets durante a inicialização. Não impediu os fluxos de interface acima. Não é uma análise completa do combate ou de desempenho; não houve teste em aparelho físico.
