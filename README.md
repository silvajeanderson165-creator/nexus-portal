# NEXUS PORTAL

Experiencia web interativa com cena 3D em tempo real, animações cinematograficas e personalizacao visual do artefato Nexus.

## Stack

- React 19 + TypeScript
- Vite 7
- Three.js + @react-three/fiber + @react-three/drei
- GSAP + ScrollTrigger
- Zustand
- Tailwind CSS

## Funcionalidades

- Cena 3D em background fixo com controle de orbita e zoom
- Shader custom no anel Nexus
- Campo de particulas e estrelas
- Loading screen animado
- Personalizacao em tempo real (tema de cor, brilho e quantidade de particulas)
- Efeitos de audio para hover/click
- Scroll suave com Lenis

## Estrutura de Pastas

```text
src/
  components/
    three/          Componentes da cena 3D
    ui/             Componentes base (shadcn/radix)
    ui-custom/      Componentes visuais customizados
  sections/         Secoes da pagina
  hooks/            Hooks customizados
  store/            Estado global com Zustand
  pages/            Paginas (quando aplicavel)
```

## Requisitos

- Node.js 20+
- npm 10+

## Como Rodar

```bash
npm install
npm run dev
```

O app fica disponivel em http://localhost:3000/.

## Scripts

- npm run dev: inicia servidor de desenvolvimento
- npm run build: gera build de producao
- npm run preview: sobe preview da build
- npm run lint: executa o lint

## Qualidade

Fluxo recomendado antes de publicar:

```bash
npm run lint
npm run build
```

## Observacoes

- Componentes em src/components/ui sao baseados em biblioteca de UI e usam regras de lint ajustadas para evitar falsos positivos.
- O controle de estado da cena 3D e feito via Zustand para integrar UI e canvas.
