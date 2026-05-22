---
name: 2026-05-22-about-personal-approach
description: Новый premium/B2B блок персонального подхода на странице «О компании»
metadata:
  type: changelog
---

## Что сделано

- Добавлен `src/components/about/AboutApproach.tsx` — двухколоночный editorial-блок сразу после hero на `/about`.
- Левая колонка: фото-карточка с rounded 32px, мягкой тенью и `object-fit: cover`; высота на desktop тянется по правой контентной карточке.
- Правая колонка: label «Наш подход», крупный заголовок, два абзаца обращения и три тезиса-карточки.
- Убраны общий фон вокруг двух колонок, белая рамка фото и floating-плашка поверх изображения.
- Для будущего фото используется `/images/about/company-representative.jpg`; пока файла нет, картинка автоматически fallback-ится на `/images/specialist-consultation.png`.
- Проверены desktop/mobile: порядок секций корректный, на mobile блок перестраивается в одну колонку, горизонтального скролла нет.

## Проверка

- `npm run build` — успешно; осталось только существующее предупреждение Vite о крупном chunk.
