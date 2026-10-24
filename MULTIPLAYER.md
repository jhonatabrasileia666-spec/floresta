# FLORESTA — Multiplayer online (protótipo)

A versão principal do jogo continua **solo**. Esta branch adiciona um primeiro canal online que sincroniza a presença, posição, direção e arma visível de até **4 jogadores** por sala. PC e celular podem entrar na mesma sala. Isto **não sincroniza** inventário, inimigos, dano, construção, mineração, progressão, salvamentos ou seed do mundo. Ainda não é uma experiência cooperativa completa.

## Arquitetura

- **GitHub Pages:** HTML, lógica atual do jogo, menu e clientes online (sem backend no Pages).
- **Servidor Node.js + WebSocket:** `multiplayer-server/server.js`, salas de 6 caracteres, limite de quatro jogadores, estado de presença. Mantém salas apenas em memória.
- **Render:** `render.yaml` na raiz descreve um serviço web dedicado para o backend. A versão gratuita pode ficar inativa e reiniciar; para produção use uma instância estável e persista o estado compartilhado.

## Como ativar o protótipo

1. Publique a branch do jogo em um ambiente de testes (ou depois de aprovar o pull request, faça merge).
2. No Render, crie um serviço Web a partir do mesmo repositório usando o Blueprint `render.yaml` ou configure Root Directory `multiplayer-server`, Build `npm install`, Start `npm start`. A origem permitida já é `https://jhonatabrasileia666-spec.github.io`. Para outra origem, ajuste `ALLOWED_ORIGINS`.
3. Aguarde o serviço responder `https://<seu-servidor>.onrender.com/health` com `ok: true`.
4. No jogo, abra **Multiplayer · Online**; no campo servidor digite `wss://<seu-servidor>.onrender.com/ws`, defina seu nome e clique **Criar sala**.
5. Envie o convite para o outro jogador. Ele abre o mesmo link no PC ou celular e clica **Entrar na sala**. O endpoint fica salvo apenas nas preferências do navegador, sem alterar os saves.

Para testes locais, `cd multiplayer-server && npm install && npm start`; a URL do cliente local é `ws://localhost:10000/ws`. Uma página hospedada em HTTPS deve usar WSS, não WS comum. Execute `npm test` para o teste de handshake, salas e movimento.

## Limites conhecidos e próximos passos

- Os avatares remotos são representações 3D de teste, não os modelos animados originais. O próximo passo é usar o rig verdadeiro e sincronizar animações.
- A criação/junção de salas e movimentação só funcionam depois de **publicar um servidor online**; um servidor não é criado automaticamente pelo GitHub Pages.
- Combate, inimigos, coleta e construções precisam de lógica **autoritativa no servidor**. Nunca confie em eventos de dano ou item enviados diretamente pelo navegador.
- Gerenciar salas em memória exige uma instância única; para múltiplas instâncias, usar persistência/mensageria e roteamento por sala.
- O modo solo, arquivos de salvamento, câmera, controles e HUD nativos não são modificados diretamente.
