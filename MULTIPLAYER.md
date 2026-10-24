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
