# 🍎 Instruções para Build iOS no Mac

## Pré-requisitos no Mac
1. **macOS** (versão recente)
2. **Xcode** (versão mais recente da App Store)
3. **Apple Developer Account** ($99/ano)
4. **Node.js** e **npm**

## Passos no Mac

### 1. Transferir o Projeto
```bash
# Clonar o repositório ou transferir a pasta
git clone [seu-repositorio]
cd sol-vita-tracker

# Instalar dependências
npm install
```

### 2. Build e Sync
```bash
# Build da aplicação
npm run build

# Sync para iOS
npx cap sync ios
```

### 3. Abrir no Xcode
```bash
# Abrir projeto no Xcode
npx cap open ios
```

### 4. Configurar no Xcode

**Em App/App/Info.plist, adicionar:**
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Solarin precisa da sua localização para obter dados precisos de UV da sua região.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Solarin usa sua localização para fornecer informações de UV personalizadas.</string>
```

**Configurar Bundle Identifier:**
- Selecionar "App" no navigator
- Em "Signing & Capabilities"
- Bundle Identifier: `com.solarin.uvtracker`
- Team: Sua conta de desenvolvedor Apple

### 5. Build para Archive
1. Selecionar "Any iOS Device" como target
2. Product → Archive
3. Aguardar o build
4. Upload para App Store Connect

## ⚡ Comandos Rápidos no Mac
```bash
# Sequência completa
npm install
npm run build
npx cap sync ios
npx cap open ios
``` 