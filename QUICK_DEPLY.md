# ⚡ Quick Deploy Guide

## 🚀 Do Zero ao App Funcionando em 15 Minutos

### Step 1: Criar Projeto (2 min)

```bash
npx react-native@latest init WalletApp --template react-native-template-typescript
cd WalletApp
```

### Step 2: Instalar TODAS as Dependências (5 min)

```bash
# Core
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler

# State
npm install zustand

# Blockchain
npm install ethers@6.9.0

# Security
npm install react-native-keychain react-native-biometrics crypto-js
npm install --save-dev @types/crypto-js

# UI
npm install react-native-vector-icons @react-native-community/blur
npm install react-native-reanimated react-native-linear-gradient react-native-qrcode-svg

# Storage & Utils
npm install @react-native-async-storage/async-storage
npm install @react-native-clipboard/clipboard
npm install axios

# Polyfills
npm install crypto-browserify stream-browserify react-native-get-random-values

# Testing
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

### Step 3: Setup iOS (2 min)

```bash
cd ios
pod install
cd ..
```

Editar `ios/Podfile` - adicionar após `platform :ios`:

```ruby
permissions_path = '../node_modules/react-native-permissions/ios'
pod 'Permission-FaceID', :path => "#{permissions_path}/FaceID"
```

Editar `ios/WalletApp/Info.plist`:

```xml
<key>NSFaceIDUsageDescription</key>
<string>Usamos Face ID para proteger sua carteira</string>
```

### Step 4: Setup Android (1 min)

Editar `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.USE_BIOMETRIC"/>
<uses-permission android:name="android.permission.CAMERA"/>
```

Editar `android/app/build.gradle` - adicionar em `android {}`:

```gradle
packagingOptions {
    pickFirst 'lib/x86/libc++_shared.so'
    pickFirst 'lib/x86_64/libc++_shared.so'
    pickFirst 'lib/armeabi-v7a/libc++_shared.so'
    pickFirst 'lib/arm64-v8a/libc++_shared.so'
}
```

### Step 5: Configurar Babel e Metro (1 min)

Editar `babel.config.js`:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
  ],
};
```

Criar `metro.config.js`:

```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    extraNodeModules: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

### Step 6: Criar Estrutura de Pastas (1 min)

```bash
mkdir -p src/{app/{navigation,config},screens/{auth,home,wallet,profile},components/{inputs,buttons,cards,feedback},blockchain/{core,services,providers},store,services,hooks,utils/{validators,formatters},theme,__tests__/utils}
```

### Step 7: Copiar Código (2 min)

Copie todos os arquivos `.ts` e `.tsx` dos artifacts anteriores para as pastas correspondentes.

### Step 8: Atualizar index.js (30 seg)

```javascript
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

### Step 9: Criar Polyfill (30 seg)

Criar `src/app/config/polyfills.ts`:

```typescript
import 'react-native-get-random-values';
```

Importar no topo de `src/App.tsx`:

```typescript
import './config/polyfills';
```

### Step 10: Rodar! (30 seg)

```bash
# iOS
npm run ios

# Android
npm run android
```

---

## ✅ Checklist de Verificação

Antes de rodar, verifique:

- [ ] Node >= 18 instalado
- [ ] React Native CLI instalado globalmente
- [ ] Xcode instalado (para iOS)
- [ ] Android Studio instalado (para Android)
- [ ] Todas as dependências instaladas (`npm install`)
- [ ] Pods instalados (iOS): `cd ios && pod install`
- [ ] Estrutura de pastas criada
- [ ] Todos os arquivos copiados
- [ ] `index.js` atualizado
- [ ] Polyfills configurados

---

## 🧪 Testar Funcionalidades

### 1. Login
- CPF: `123.456.789-09` (qualquer CPF válido)
- Senha: `123456` (mínimo 6 caracteres)

### 2. Verificar Wallet Criada
- Após login, verifique console: deve mostrar endereço Ethereum

### 3. Dashboard
- Deve mostrar saldo (inicialmente R$ 0,00)
- Pull to refresh deve funcionar

### 4. Navegação
- Bottom tabs: Home, Carteira, Perfil
- Todas devem navegar corretamente

---

## 🐛 Problemas Comuns

### Metro não inicia
```bash
npx react-native start --reset-cache
```

### iOS build falha
```bash
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..
```

### Android build falha
```bash
cd android
./gradlew clean
cd ..
```

### Erro de crypto/stream
Verifique se `metro.config.js` está configurado corretamente

---

## 🎉 Pronto!

Seu app deve estar rodando com:
- ✅ Login funcional
- ✅ Wallet criada automaticamente
- ✅ Dashboard com saldo
- ✅ Navegação completa
- ✅ Tema visual premium

**Próximo passo:** Conectar a um backend real e RPC node de produção!