# ☁️ Build iOS em Nuvem (Sem Mac Necessário)

## 🚀 Expo EAS Build (Recomendado)

### Por que Expo EAS?
- ✅ **Funciona no Windows/Linux**
- ✅ **Build iOS sem Mac**
- ✅ **Fácil configuração**
- ✅ **Gratuito até certo limite**

### Setup do EAS

#### 1. Instalar Expo CLI
```bash
npm install -g @expo/cli
npm install -g eas-cli
```

#### 2. Configurar o Projeto
```bash
# Fazer login na Expo
eas login

# Inicializar EAS no projeto
eas build:configure
```

#### 3. Configurar eas.json
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### 4. Configurar app.json/app.config.js
```json
{
  "expo": {
    "name": "Solarin UV Tracker",
    "slug": "solarin-uv-tracker",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "bundleIdentifier": "com.solarin.uvtracker",
      "buildNumber": "1",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Solarin precisa da sua localização para obter dados precisos de UV da sua região."
      }
    }
  }
}
```

#### 5. Build iOS
```bash
# Build para produção
eas build --platform ios --profile production

# Submeter para App Store
eas submit --platform ios
```

## 🔧 Codemagic (Alternativa)

### Setup Codemagic

#### 1. Criar conta em [codemagic.io](https://codemagic.io)

#### 2. Conectar repositório GitHub

#### 3. Configurar codemagic.yaml
```yaml
workflows:
  ios-workflow:
    name: iOS Workflow
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.solarin.uvtracker
      node: latest
    scripts:
      - name: Install dependencies
        script: |
          npm install
          npm run build
          npx cap sync ios
      - name: Set up code signing settings on Xcode project
        script: xcode-project use-profiles
      - name: Build ipa for distribution
        script: |
          xcode-project build-ipa \
            --workspace ios/App/App.xcworkspace \
            --scheme App
    artifacts:
      - build/ios/ipa/*.ipa
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: false
        submit_to_app_store: true
```

## 💰 Custos Comparativos

### Expo EAS
- **Gratuito:** 30 builds/mês
- **Hobby:** $29/mês - builds ilimitados
- **Production:** $99/mês - recursos avançados

### Codemagic
- **Gratuito:** 500 min/mês
- **Team:** $28/mês - 2000 min/mês
- **Professional:** $68/mês - builds ilimitados

## 🎯 Recomendação

**Para seu primeiro app:**
1. **Comece com EAS Build** (mais simples)
2. **Teste no plano gratuito**
3. **Upgrade se necessário**

### Próximos Passos com EAS:
```bash
# 1. Instalar CLI
npm install -g @expo/cli eas-cli

# 2. Login
eas login

# 3. Configurar
eas build:configure

# 4. Build
eas build --platform ios
```

**Vantagem:** Você pode fazer tudo direto do Windows! 🎉 