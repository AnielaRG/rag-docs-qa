# Onboarding w Kartotece

Kartoteka sp. z o.o. tworzy **Circulation Desk** — system wypożyczeń w modelu SaaS dla bibliotek miejskich i uczelnianych. Zatrudniamy około 85 osób w dwóch biurach: **Poznań** (ul. Drukarska 7, główna siedziba) i **Gdańsk** (ul. Introligatorska 3). Ten dokument opisuje Twoje pierwsze tygodnie w firmie.

## Pierwszy dzień

- Przyjdź do biura na **9:30**. Wyjątkowo nie obowiązują wtedy godziny core hours (patrz `praca-zdalna.md`).
- Na recepcji odbierzesz identyfikator i laptopa. Jeśli zaczynasz w pełni zdalnie, kurier dostarczy sprzęt **najpóźniej 2 dni robocze przed** pierwszym dniem pracy.
- O **10:00** jest spotkanie powitalne z People Team (dział HR). Prowadzi je Agnieszka Rogal.
- O **13:00** jest lunch z Twoim **buddym**, czyli osobą z innego zespołu, która przez pierwsze 3 miesiące pomaga Ci w sprawach nietechnicznych.
- Po południu konfigurujesz konta (sekcja „Dostępy").

## Dostępy

Od pierwszego dnia dostajesz konta w:

| Narzędzie | Do czego służy | Kto nadaje dostęp |
|---|---|---|
| Google Workspace | poczta (`imie.nazwisko@kartoteka.example`), kalendarz, dokumenty | IT, przed pierwszym dniem |
| Slack | komunikacja, workspace `kartoteka` | IT, przed pierwszym dniem |
| 1Password | wszystkie hasła firmowe | IT, pierwszy dzień |
| Linear | zadania i projekty | Twój manager |
| GitHub | organizacja `kartoteka-dev` | Tech Lead zespołu |
| Kadrownik | wnioski urlopowe, dokumenty kadrowe | People Team |

Dostęp do **środowiska produkcyjnego** (bazy danych, logi produkcyjne, panel administracyjny bibliotek) dostajesz **nie wcześniej niż po 30 dniach** od rozpoczęcia pracy i dopiero po zaliczeniu szkolenia „Bezpieczeństwo danych czytelników". Szkolenie trwa około 2 godzin i jest dostępne w Kadrowniku.

Uwierzytelnianie dwuskładnikowe (2FA) jest **obowiązkowe** we wszystkich narzędziach. Konto bez 2FA blokujemy automatycznie po 7 dniach.

## Narzędzia deweloperskie

- **Laptop:** do wyboru MacBook Pro 14" albo Lenovo ThinkPad T14. Wybór zgłaszasz People Team przed podpisaniem umowy.
- **VPN:** WireGuard. Konfigurację pobierasz z 1Password (sejf „Engineering").
- **CLI firmowe `kd`:** instalacja `brew install kartoteka/tap/kd`. Służy do deployu, logów i lokalnej bazy z danymi testowymi.
- **Lokalna baza:** zawsze z zanonimizowanego dumpa (`kd db pull`). Kopiowanie produkcyjnej bazy na laptopa jest zabronione (patrz `sprzet-i-bezpieczenstwo.md`).
- **Stack:** Next.js, TypeScript, PostgreSQL, Redis, hosting na AWS (region `eu-central-1`, Frankfurt).

## Pierwszy tydzień

1. **Dzień 1–2:** konta, sprzęt, przeczytanie tego folderu z dokumentacją.
2. **Dzień 2:** pierwsze 1:1 z managerem, na którym ustalacie cele na 30 dni.
3. **Dzień 3–5:** pierwszy „good first issue" z Linear (etykieta `onboarding`). Celem jest przejście całej ścieżki: branch → PR → review → staging.
4. **Piątek:** krótkie demo na spotkaniu zespołu. Nie musi być dopracowane.

Checklistę onboardingową znajdziesz w Linear w projekcie **ONB**. Każdy nowy pracownik ma tam własne zadanie z podzadaniami.

## Okres próbny i przeglądy

- Okres próbny trwa **3 miesiące** (dotyczy umowy o pracę i B2B).
- Przeglądy z managerem odbywają się po **30, 60 i 90 dniach**.
- Po 90 dniach buddy kończy swoją rolę, a Ty możesz zgłosić się jako buddy dla kolejnej osoby.

## Do kogo pisać

- Sprawy kadrowe, umowy, benefity: **People Team**, kanał `#people`.
- Sprzęt i konta: **IT**, kanał `#it-help`.
- Bezpieczeństwo, zgubiony sprzęt: kanał `#security` (patrz `sprzet-i-bezpieczenstwo.md`).
- Pytania techniczne o kod: kanał Twojego zespołu albo `#engineering`.
