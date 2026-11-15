# Proces wdrożenia (deploy)

Circulation Desk obsługuje ponad 140 bibliotek w Polsce. Bibliotekarze używają go na żywo przy ladzie wypożyczeń, więc każda awaria jest natychmiast widoczna. Dlatego proces wdrożenia jest ostrożny i przewidywalny.

## Środowiska

| Środowisko | Adres | Dane | Kto deployuje |
|---|---|---|---|
| `dev` | `dev.circulation.example` | syntetyczne | automatycznie, każdy merge do `main` |
| `staging` | `staging.circulation.example` | zanonimizowana kopia produkcji (odświeżana w każdą niedzielę) | automatycznie, każdy tag `rc-*` |
| `production` | `app.circulation.example` | prawdziwe dane bibliotek i czytelników | Release Captain przez `kd deploy` |

Do produkcji trafia wyłącznie kod, który wcześniej był na stagingu.

## Zanim zmiana trafi do `main`

- Pull request musi mieć **zielone CI** (testy jednostkowe, testy e2e w Playwright, lint, typecheck).
- Wymagane są **2 akceptacje** code review, w tym **co najmniej 1 od osoby z pliku CODEOWNERS** dla zmienianego obszaru.
- Zmiany w migracjach bazy danych wymagają dodatkowo akceptacji osoby z zespołu **Platform**.
- Duże funkcje wdrażamy za **feature flagą** (Unleash). Flaga jest domyślnie wyłączona na produkcji.

## Okna wdrożeniowe na produkcję

- Deploy na produkcję odbywa się **od wtorku do czwartku, w godzinach 10:00–15:00**.
- **Nie deployujemy:** w poniedziałki, w piątki, w weekendy ani w dzień roboczy poprzedzający święto państwowe.
- Zmiana musi być na stagingu przez **co najmniej 1 pełny dzień roboczy** przed wdrożeniem na produkcję.

## Release Captain

- Release Captain to rola **rotacyjna, zmieniana co tydzień**. Grafik jest w Linear w projekcie **REL**.
- Release Captain **zatwierdza i uruchamia** każdy deploy na produkcję.
- Po wdrożeniu obserwuje dashboardy przez **30 minut** i dopiero potem ogłasza release na `#releases`.
- Release Captain nie może jednocześnie pełnić dyżuru on-call.

## Jak wygląda deploy

1. Release Captain tworzy tag `rc-RRRR-MM-DD` (np. `rc-2026-11-17`). Tag trafia automatycznie na staging.
2. QA i autorzy zmian sprawdzają staging. Wynik oznaczają w zadaniu releasowym w Linear.
3. Następnego dnia roboczego (w oknie wdrożeniowym) Release Captain uruchamia:
   ```
   kd deploy production --tag rc-2026-11-17
   ```
4. Deploy jest typu blue-green. Ruch przełącza się po pozytywnym health checku.
5. Release Captain publikuje changelog na `#releases`.

## Rollback

- Rollback ma się zakończyć w ciągu **15 minut** od decyzji.
- Komenda: `kd deploy rollback production`. Przywraca poprzednią wersję (środowisko „blue").
- Decyzję o rollbacku podejmuje Release Captain albo osoba na dyżurze on-call. Nie trzeba niczyjej zgody.
- Migracje bazy danych muszą być **wstecznie kompatybilne**, żeby rollback był możliwy bez cofania schematu.

## Hotfix

Hotfix to pilna poprawka błędu produkcyjnego o priorytecie SEV1 lub SEV2 (patrz `dyzury-i-incydenty.md`).

- Hotfix **może** iść poza oknem wdrożeniowym i z pominięciem dnia na stagingu.
- Wymaga **1 akceptacji** code review zamiast 2.
- Wdrożenie zatwierdza **Head of Engineering (Marta Wiśniewska)** albo, pod jej nieobecność, **lider dyżuru on-call**.
- W ciągu **2 dni roboczych** po hotfixie trzeba dopisać brakujące testy.

## Release freeze

- Od **20 grudnia do 6 stycznia** obowiązuje release freeze: nie ma planowanych wdrożeń na produkcję.
- W tym czasie dozwolone są **wyłącznie hotfixy** SEV1/SEV2.
- Na `dev` i `staging` można normalnie pracować.
