# FLORESTA — Cooperativo para duas pessoas (protótipo, V281)

Este é um primeiro teste de presença/posição online entre **somente dois jogadores**, com **Supabase Realtime**, sem Render, sem VPS e sem mexer no jogo principal. O cliente da branch está ligado à conexão **jfloresta** (projeto Supabase **tatoo Project**, usado apenas para canais Realtime com prefixo `floresta-duo-`). Nenhuma tabela existente foi alterada. Não é o modo cooperativo completo: o mundo do jogo ainda é simulado separadamente em cada aparelho e combate, IA, inventário, construções, coleta e persistência do mundo NÃO estão sincronizados.

## Conexão já configurada
- URL do Supabase e chave **publishable** foram inseridas no cliente experimental da branch. A chave é pública por definição; nenhuma chave service_role/secret foi usada.
- **Não** é preciso criar tabelas, alterar dados do site de tatuagem ou inserir credenciais manualmente para este protótipo. Os dados do site ficam isolados em relação aos canais `floresta-duo-...` de Presence e Broadcast.
- Para experimentar, publique uma **versão de testes** desta branch, abra a opção **Cooperativo · 2 jogadores**, escolha seu nome e clique **Criar sala**.
- Use **Copiar convite** para compartilhar apenas o código da sala via URL. O amigo abre o mesmo ambiente de testes e clica **Entrar**.
- Ainda falta validar o jogo de ponta a ponta em PC e Mobile e implementar o mundo cooperativo real (veja abaixo).
- **Não compartilhar convites publicamente:** a sala com código não constitui autenticação forte; um canal público não oferece controle de membros robusto.

