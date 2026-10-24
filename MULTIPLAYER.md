# FLORESTA — Cooperativo para duas pessoas (protótipo, V281)

Este é um primeiro teste de presença/posição online entre **somente dois jogadores**, com **Supabase Realtime**, sem Render, sem VPS e sem mexer no jogo principal. Não é o modo cooperativo completo: o mundo do jogo ainda é simulado separadamente em cada aparelho e combate, IA, inventário, construções, coleta e persistência do mundo NÃO estão sincronizados.

## Preparação sem custo

1. Criar um projeto Supabase **Free dedicado exclusivamente ao jogo** (não reutilizar o banco da Gold Sistema).
2. No dashboard Supabase, copiar a URL pública do projeto (`https://<ref>.supabase.co`) e a chave **Publishable** (`sb_publishable_...`) disponível em Project Settings → API Keys / Connect. **Nunca** copiar uma chave secret, service_role ou chave de banco.
3. Abrir uma versão de teste do FLORESTA com esta branch (não a versão normal do GitHub Pages). No menu principal escolher **Cooperativo · 2 jogadores**.
4. Informar URL/chave e clicar **Criar sala**. Após conectado, clicar **Copiar convite** e enviar para o amigo. O convite inclui apenas a chave pública, URL e código da sala.
5. Seu amigo abre o link pelo PC ou Mobile e clica **Entrar**. O cliente cria uma conexão WebSocket Supabase Realtime em um canal de presença e atualiza as posições por Broadcast a 4 Hz.

O jogo continua funcionando solo caso não seja possível conectar. Não requer tabelas SQL nem libera acesso ao banco; usa canal **public: private=false**, acessível a quem possuir o nome do canal e a publishable key. O código de 9 caracteres é um convite difícil de adivinhar, mas não substitui autorização robusta. Não compartilhar convites publicamente.

## Custos e limites
- Plano Free: 2 milhões de mensagens Realtime por organização/mês e 200 conexões simultâneas (verifique o dashboard/termos atuais).
- Duas pessoas, 4 Broadcasts/segundo por jogador, aproximadamente 57.600 mensagens/hora contando envio + recebimento (além de mensagens Presence). Em torno de 34 horas/mês só para o movimento antes de esgotar a franquia.
- Movimento com interpolação visual; os modelos de personagens remotos são proxies 3D provisórios, não o rig final.
- A frequência poderá ser adaptada após medir tráfego, e as atualizações devem ficar suspensas fora do jogo.

## Ainda falta
- Teste funcional real com dois navegadores/dispositivos e conexão Supabase configurada.
- Transformar o mundo em uma única simulação autoritativa: anfitrião gerencia monstros, hitboxes, dano, loot e construção; outro jogador recebe resultados e envia comandos. Nunca fazer o servidor aceitar dano/itens arbitrários.
- Reconciliação, interpolação, persistência de mundo e substituição dos proxies pelo personagem rigado.
- Fluxo de reconexão e bloqueio de terceiros robusto (com autenticação e autorização do canal).

**Status:** branch experimental, não publicar como multiplayer final nem mesclar automaticamente. Requer projeto Supabase Free dedicado e teste entre dois jogadores.
