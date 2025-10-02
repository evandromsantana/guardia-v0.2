# Estrutura de Pastas do Frontend (React Native)

A estrutura de pastas do projeto Guardiã foi desenhada para ser escalável e organizada, utilizando o **Expo Router** para um roteamento baseado em arquivos. Todo o código-fonte da aplicação reside no diretório `src`.

## Estrutura Principal

guardia-app/
├── src/
│   ├── app/
│   │   ├── _layout.tsx         # Layout raiz (gerencia autenticação vs. app)
│   │   ├── (auth)/             # Grupo de rotas de autenticação
│   │   │   ├──_layout.tsx     # Layout para rotas de autenticação
│   │   │   └── welcome.tsx     # Tela de boas-vindas que inicia o login social
│   │   ├── (tabs)/             # Grupo de rotas da aplicação principal (autenticada) com navegação por abas
│   │   │   ├── _layout.tsx     # Layout para rotas das abas
│   │   │   ├── chat.tsx        # Tela de Chat (lista de conversas)
│   │   │   ├── guardian-circle.tsx # Tela do Círculo de Guardiãs
│   │   │   ├── index.tsx       # Tela Inicial (Home)
│   │   │   ├── map.tsx         # Tela do Mapa (Trajeto Seguro)
│   │   │   └── profile/        # Grupo de rotas de perfil
│   │   │       ├── _layout.tsx # Layout para rotas de perfil
│   │   │       ├── edit-profile.tsx # Tela de Edição de Perfil
│   │   │       └── index.tsx   # Tela de Visualização de Perfil
│   │   ├── chat/               # Rotas de chat dinâmicas
│   │   │   └── [id].tsx        # Tela de conversa específica
│   │   ├── guardian-panel/     # Rotas do painel do guardião
│   │   │   └── [id].tsx        # Tela do painel para um guardião específico
│   │   ├── user/               # Rotas de usuário
│   │   │   └── [id].tsx        # Tela de visualização de perfil de outro usuário
│   │   ├── start-trip.tsx      # Tela para iniciar um trajeto seguro
│   │   └── trip-history.tsx    # Tela de histórico de trajetos
│   ├── api/                    # Configurações e inicialização de APIs (ex: Firebase)
│   ├── assets/                 # Ativos estáticos (imagens, fontes)
│   ├── components/             # Componentes de UI reutilizáveis (common, layout)
│   ├── constants/              # Valores constantes (tema, cores.ts)
│   ├── contexts/               # Contextos React (ex: AuthContext)
│   ├── hooks/                  # Hooks customizados (ex: useAuth, useSignIn, useUserProfile)
│   └── services/               # Lógica de negócio e comunicação com serviços externos (ex: auth, trip, user)
└── ...

## Descrição dos Diretórios

*   **`app/`**: Contém todas as rotas e layouts da aplicação, gerenciados pelo Expo Router.
    *   **`(auth)/`**: Grupo de rotas para o fluxo de autenticação.
        *   `welcome.tsx`: Tela de boas-vindas que gerencia o início do fluxo de login social.
    *   **`(tabs)/`**: Grupo de rotas da aplicação principal (pós-autenticação) com navegação por abas.
        *   `index.tsx`: Tela Inicial (Home).
        *   `map.tsx`: Tela do Mapa (Trajeto Seguro).
        *   `profile/`: Grupo de rotas relacionadas ao perfil do usuário.
        *   `guardian-circle.tsx`: Tela do Círculo de Guardiãs.
        *   `chat.tsx`: Tela de lista de conversas.
    *   **`chat/[id].tsx`**: Tela de conversa específica com um usuário.
    *   **`guardian-panel/[id].tsx`**: Tela do painel de monitoramento para um guardião específico.
    *   **`user/[id].tsx`**: Tela de visualização do perfil de outro usuário.
    *   **`start-trip.tsx`**: Tela para iniciar um novo trajeto seguro.
    *   **`trip-history.tsx`**: Tela que exibe o histórico de trajetos seguros.
*   **`api/`**: Responsável pela comunicação com o backend (Firebase).
*   **`assets/`**: Armazena todos os ativos estáticos (fontes, imagens, ícones).
*   **`components/`**: Contém componentes de UI reutilizáveis.
*   **`constants/`**: Valores constantes usados em toda a aplicação (cores, espaçamentos).
*   **`contexts/`**: Contextos React para gerenciamento de estado global.
*   **`hooks/`**: Hooks customizados para lógica reutilizável e integração com React Query.
*   **`services/`**: Lógica de negócio e comunicação com serviços externos.