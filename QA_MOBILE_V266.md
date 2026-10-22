# Validação da interface mobile V266

Base: commit `1dcdf0d9c90cd03f5592f743f93122f6d7e075b0` (V265).

## Executado

Chromium com emulação de toque e telas de 844×390, 667×375 e 390×844. PC verificado em 1280×720.

- Inicialização, menu, nova partida e criador de personagem; alteração de aparência aplicada e salva no ambiente de teste.
- Revisão visual de HUD, inventário, organizador da barra, fabricação, construção, habilidades, criaturas, guia da ferraria, alquimia e grimório.
- Testes de dimensões: inventário, seus painéis internos e Equipar dentro do viewport, incluindo orientação vertical.
- Gesto de toque real emulado rolou a grade de itens (104 px), a barra rápida (145 px) e as abas na vertical.
- Selecionar Tocha na mochila e tocar no espaço 9 do organizador atualizou `gameHotbarV256.slots[8]` para `torch`.
- Rolamento acionou `gameRoll.active`; botão de defesa ativou `gameShield.blocking` ao pressionar e desativou ao soltar.
- Receitas adicionais alcançáveis por rolagem da fabricação.
- Fornalha com cabeçalho, painel lateral e ações inteiramente dentro do viewport. Ocultar/mostrar receitas funcionou.
- Bigorna criada com o controlador original, e tela de forja renderizada.
- No PC, a classe, o controlador e o CSS da V266 mobile não foram carregados.
- Sintaxe JavaScript e `git diff --check` passaram.

## Limites

Não houve teste em aparelho Android/iOS físico, nem medição de FPS. Para inspecionar os painéis sem o custo da renderização 3D por software, parte da verificação pausou o loop da cena no ambiente de teste. A fornalha recebeu um estado de teste de estrutura concluída para abrir seu painel; isso não valida o processo completo de construção ou fundição. A bigorna e seus controles usaram os controladores originais. Não foram testadas todas as receitas nem todas as montarias.

O console registrou `Cannot read properties of undefined (reading 'combatTargets')` na inicialização legada. A implementação desta entrega não altera esse subsistema de combate.

Verificação complementar: Configurações abriu acima do menu e fechou por toque; catálogo de dragões do criativo abriu e fechou sem cobrir o HUD permanentemente.
