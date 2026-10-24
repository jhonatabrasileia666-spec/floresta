# FLORESTA — Cooperativo para duas pessoas (V281, experimental)

Branch: `feature/multiplayer-online-mvp` · [PR #3](https://github.com/jhonatabrasileia666-spec/floresta/pull/3)

## Backend configurado e validado

O jogo experimental está configurado com **Supabase Realtime** no projeto `tatoo Project` (`fswfhhymihuypkudnopg`) acessado pela conexão `jfloresta`. Somente a URL e a **chave publicável** foram utilizadas. Não houve alterações em tabelas ou outros dados do projeto TATOO. Não depende de Render ou de uma VPS.

Teste automático com duas conexões Supabase Realtime verdadeiras valida inscrição, Presence e entrega de Broadcast de posições. Outro teste simula mensagens e adaptadores da ponte de mundo.

## Recursos integrados nesta etapa

- Salas por código com limite de 2 participantes na UI, convite por link, nomes, saída, perda de anfitrião.
- PC e mobile compartilham o mesmo protocolo e veem a posição do outro jogador; movimento interpolado e exibição visual de arma/tocha/tronco.
- Hora e dia recebidos do anfitrião.
- Construções em ambos os sentidos: o jogo usa o `restoreRecord()` nativo do módulo V224 para replicar geometria, materiais, escadas, portas, paredes e integrar colisão e suporte físico em ambos os aparelhos. Os recursos consumidos durante a construção ainda são controlados por cada jogador; simultaneidade, gerenciamento e salvamento compartilhado continuam experimentais.
- Sincronização aproximada de posições de zumbis que já existam nos dois aparelhos, identificados pelo mesmo ID. A IA segue local, portanto pode divergir.
- Acerto confirmado de espada do convidado pode solicitar ao anfitrião dano a inimigo compatível, com validação de posição, distância e intervalo. Não abrange todo o arsenal nem resolve a vida de cada monstro entre as sessões.
- Coleta de pedras e galhos com IDs derivados da posição, validação pelo anfitrião, remoção nos dois aparelhos e proteção contra tentativas duplicadas. Para itens gerados dinamicamente por outros sistemas, podem ser necessários IDs globais adicionais.
- Mensagens rápidas de chat.

## Como testar

1. Publique **uma versão de testes desta branch**, sem fazer merge na versão solo oficial.
2. Abra o jogo e no menu selecione **Cooperativo · 2 jogadores**.
3. Jogador 1: clique **Criar sala** e **Copiar convite**.
4. Jogador 2: abra o link no outro aparelho e clique **Entrar**, usando o código preenchido.
5. Comecem na mesma região e comparem posições, horário, equipamentos e construções.

A configuração Supabase está incorporada ao cliente da branch; **não copie keys de service_role/secret**. O link de convite contém apenas o código da sala. Como os canais são públicos, o código aleatório de 9 caracteres não equivale a autenticação forte; não divulgue convites publicamente.

## Limitações importantes

Isto **não é cooperativo completo**: o jogo original não foi construído com simulação de mundo autoritativa. IA de todos os inimigos e chefes, montarias/transportes, conflitos simultâneos e persistência das construções, dano recebido, itens coletados, trading, craft, poções, forja, cavernas, progressão e salvamento compartilhado ainda precisam ser migrados para um estado único.

Dois navegadores jogando cenas 3D reais ainda não foram validados; os testes automatizados verificam transporte de mensagens e algumas integrações simuladas. O modo solo e a main permanecem intactos.

## Consumo gratuito

O Supabase Free tem limites de mensagens Realtime. Com duas pessoas a 4 atualizações por segundo, cerca de 57.600 mensagens/hora só para movimento entregue entre pares, além dos snapshots de mundo/inimigos e eventos. Verificar o uso real no dashboard.

## Próximas mudanças indispensáveis

Substituir adaptadores de aparência por rig/animações originais; implementar simulação autoritativa do anfitrião para cada entidade interativa; snapshots/IDs persistentes, reconciliação de combate, estoque/loot com autorização por ação e saves seguros; testar 2 dispositivos reais PC/Android/iPhone antes de publicar para todos.

## Correção de 24/10/2026 — construção e coleta

Teste manual informado: tablet e notebook entram na mesma sala; o usuário relatou materiais e colisão diferentes nas construções, além de pedras e galhos não desaparecerem no outro aparelho. Corrigido no código publicado usando a engine V224 que realmente roda em `Jogo.html`, e confirmação de coleta via host. Testes automáticos no GitHub Actions validam lógica de conexão, construção em mock, relógio, zumbis, combate e bloqueio de coleta dupla. Ainda é necessário **retestar visualmente com dois aparelhos** para confirmar geometria, colisão e coletas em partidas reais.

## Correção em desenvolvimento — autoridade de construções e horda (24/10/2026)

Branch `fix/duo-shared-world`, baseada em `2efedda9`. Não publicada.

- Construções têm IDs persistentes. O anfitrião mantém a coleção canônica e salva também as peças criadas pelo convidado. As duas sessões usam os mesmos construtores nativos, materiais e colisores.
- Edições do convidado são operações por peça com comparação do estado anterior. Alterações em peças diferentes podem coexistir; conflito na mesma peça recebe rejeição explícita. Novas edições durante uma confirmação pendente são preservadas.
- Entrada tardia solicita o estado completo. Reenvio, deduplicação e atualização periódica recuperam mensagens/confirmacões perdidas. O mundo de construção solo do convidado é restaurado ao sair; o salvamento de perfil do convidado na sala é bloqueado para preservar o slot solo.
- Zumbis da horda são gerados e simulados pelo anfitrião; convidado recebe criação do pool, posição, rotação, vida, estado e visibilidade. O anfitrião pode selecionar qualquer um dos jogadores como alvo. Acertos do convidado passam pelo anfitrião; dano remoto tem limite de alcance/valor/frequência, ainda não é uma solução antitrapaça.
- Pedras, galhos, cipós, lascas e escudos de madeira recebem uma lista autoritativa de recursos presentes. Isso corrige recursos iniciais gerados em torno de posições salvas diferentes. Confirmações de coleta perdidas são reenviadas sem conceder o item duas vezes; inventário cheio mantém a concessão pendente.

### Verificação e limites desta correção

`node world.test.mjs`, `node shared.test.mjs` e `node native-avatar.test.mjs`: testes de lógica com adaptadores simulados; não equivalem a duas cenas 3D reais. `smoke.mjs`: duas conexões reais de Presence/Broadcast aceitas pelo Supabase. Sintaxe e diff verificados.

O navegador conectado recusou o endereço local de desenvolvimento (`ERR_CONNECTION_REFUSED`); validação visual desta branch permanece pendente. Não foi feito merge ou deploy.

**Ainda não é cooperativo integral:** outros monstros/chefes, árvores e troncos, montarias, carrinho, mineração, alquimia/forja, progressão de caverna e transações de inventário de baús continuam com lógica local. As mudanças de inventário ligadas a uma construção rejeitada por conflito não têm rollback. Golpes de área do convidado ainda esbarram no limite de frequência de dano. O anfitrião dentro da caverna pausa a horda da floresta. Falta persistência completa dos recursos consumidos e da horda entre reinicializações. O tamanho de snapshots grandes ainda precisa de teste de carga. Não apresentar esta branch como modo online completo ou pronto para produção.
