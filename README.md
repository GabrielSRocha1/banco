# 💰 Wallet App - Carteira Digital Non-Custodial

> **Blockchain invisível. UX bancária. Segurança Web3.**

## 🌟 Características

### ✅ **Non-Custodial Verdadeiro**
- Chave privada **nunca** sai do dispositivo
- Armazenamento em **Secure Enclave (iOS)** / **Keystore (Android)**
- Usuário controla 100% dos fundos

### 🎯 **UX Bancária Premium**
- Login com **CPF + Senha**
- Wallet criada **automaticamente**
- Usuário **nunca vê** seed phrases
- Biometria nativa (Face ID / Touch ID)

### 🔐 **Segurança Enterprise**
- Criptografia **AES-256**
- Assinatura de transações **local**
- Backend **nunca** recebe chaves privadas
- Auditável e transparente

### 💎 **Features**
- ✅ Autenticação segura (CPF validado)
- ✅ Dashboard com saldo consolidado
- ✅ Envio de tokens (multi-step flow)
- ✅ Receber via QR Code
- ✅ Lista de tokens ERC-20
- ✅ Histórico de transações
- ✅ Real-time balance updates
- ✅ Toast notifications

---

## 🚀 Quick Start

### Pré-requisitos

```bash
node >= 18
npm >= 9
React Native CLI
Xcode 14+ (para iOS)
Android Studio (para Android)
```

### Instalação

```bash
# 1. Clonar repositório
git clone <repo-url>
cd WalletApp

# 2. Instalar dependências
npm install

# 3. iOS - Instalar pods
cd ios && pod install && cd ..

# 4. Rodar app
npm run ios
# ou
npm run android
```

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── App.tsx                 # Entry point
│   └── navigation/             # Navegação (Auth + Main)
│
├── screens/
│   ├── auth/                   # Login + Biometria
│   ├── home/                   # Dashboard
│   ├── wallet/                 # Send + Receive + Tokens
│   └── profile/                # Configurações
│
├── components/
│   ├── inputs/                 # CPF, Password, Amount
│   ├── buttons/                # Primary, Secondary
│   ├── cards/                  # BalanceCard
│   └── feedback/               # Toast, Loading
│
├── blockchain/                 # ⚠️ CRÍTICO
│   ├── core/
│   │   └── KeyManager.ts       # Gerenciamento de chaves
│   ├── services/
│   │   ├── TransactionService  # Envio de transações
│   │   └── BalanceService      # Consulta de saldos
│   └── providers/
│       └── EVMProvider.ts      # RPC connection
│
├── store/                      # Zustand
│   ├── auth.store.ts
│   ├── wallet.store.ts
│   └── ui.store.ts
│
├── hooks/                      # Custom hooks
│   ├── useAuth.ts
│   ├── useBiometric.ts
│   ├── useTransaction.ts
│   └── useBalance.ts
│
├── utils/
│   ├── validators/             # CPF, Address
│   └── formatters/             # Currency, Date
│
└── theme/                      # Design System
    ├── colors.ts
    ├── spacing.ts
    └── typography.ts
```

---

## 🔑 Fluxo de Segurança

### 1. **Criação de Wallet (Primeiro Login)**

```typescript
User → CPF + Senha → Backend Auth
                   ↓
            Validação OK
                   ↓
    ethers.Wallet.createRandom() → Mnemonic
                   ↓
         AES.encrypt(mnemonic, senha)
                   ↓
    Keychain.set(encrypted, biometria)
                   ↓
      Backend recebe APENAS endereço público
```

### 2. **Envio de Transação**

```typescript
User → Confirma transação
          ↓
   Solicita senha
          ↓
 Keychain.get(biometria)
          ↓
AES.decrypt(senha)
          ↓
Wallet efêmera em memória
          ↓
wallet.signTransaction()
          ↓
provider.sendTransaction()
          ↓
Wallet destruída (GC)
```

### 3. **O que o Backend VÊ**

```typescript
✅ VÊ:
- userId
- walletAddress (público)
- txHash
- saldo (consultado on-chain)

❌ NUNCA VÊ:
- Private key
- Mnemonic
- Senha do usuário
```

---

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Cobertura Atual
- ✅ Validação CPF (100%)
- ✅ Formatação de moedas (100%)
- ⏳ Componentes React (em progresso)
- ⏳ Hooks (em progresso)

---

## 🔧 Configuração

### Variáveis de Ambiente

Criar `.env`:

```env
# Blockchain
RPC_ENDPOINT=https://polygon-rpc.com
CHAIN_ID=137

# Backend (mock em desenvolvimento)
API_URL=http://localhost:3000
```

### Trocar Blockchain

Editar `src/blockchain/services/TransactionService.ts`:

```typescript
// Polygon Mainnet
private readonly RPC_ENDPOINT = 'https://polygon-rpc.com';

// Ethereum Mainnet
private readonly RPC_ENDPOINT = 'https://mainnet.infura.io/v3/YOUR_KEY';

// BSC
private readonly RPC_ENDPOINT = 'https://bsc-dataseed.binance.org';
```

---

## 📱 Testar no Device

### iOS

```bash
# Simulador
npm run ios

# Device físico
npm run ios -- --device "iPhone de João"
```

### Android

```bash
# Emulador
npm run android

# Device físico (USB debugging)
adb devices
npm run android
```

---

## 🚨 Troubleshooting

### Erro: "Module not found: crypto"

```bash
npm install crypto-browserify stream-browserify
```

Adicionar em `metro.config.js`:

```javascript
resolver: {
  extraNodeModules: {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
  },
}
```

### iOS: Pods não instalam

```bash
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..
```

### Android: Build falha

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Metro: Cache problems

```bash
npx react-native start --reset-cache
```

---

## 🛣️ Roadmap

### ✅ MVP (Concluído)
- [x] Autenticação CPF + Senha
- [x] Criação automática de wallet
- [x] Dashboard com saldo
- [x] Envio de tokens
- [x] Receber via QR Code
- [x] Lista de tokens

### 🔄 Em Progresso
- [ ] Social Recovery (recuperação de conta)
- [ ] Account Abstraction (ERC-4337)
- [ ] Gasless transactions (Meta-transactions)
- [ ] Swap de tokens (integração DEX)

### 📅 Próximas Versões
- [ ] NFT Gallery
- [ ] DeFi Dashboard (posições em pools)
- [ ] Multi-chain (Ethereum, BSC, Arbitrum)
- [ ] Dark mode
- [ ] Internacionalização (i18n)
- [ ] Hardware wallet support

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Guidelines
- Use TypeScript estrito
- Mantenha cobertura de testes > 80%
- Siga os padrões de código (ESLint)
- Documente funções complexas

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes

---

## 🔒 Auditoria de Segurança

Este app foi projetado com segurança em mente:

- ✅ Chaves privadas nunca saem do device
- ✅ Criptografia AES-256
- ✅ Armazenamento em hardware seguro (Secure Enclave)
- ✅ Sem armazenamento de senhas
- ✅ Assinatura de transações local

**⚠️ Antes de produção:**
- Realizar auditoria de código profissional
- Implementar bug bounty program
- Obter certificações de segurança (SOC 2, ISO 27001)

---

## 📞 Suporte

- 📧 Email: support@walletapp.com
- 💬 Discord: [discord.gg/walletapp](https://discord.gg/walletapp)
- 📖 Docs: [docs.walletapp.com](https://docs.walletapp.com)

---

**Built with ❤️ using React Native + TypeScript + ethers.js**