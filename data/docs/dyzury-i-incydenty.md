# Dyżury on-call i obsługa incydentów

Biblioteki korzystają z Circulation Desk od rana do wieczora, także w soboty. Dlatego mamy dyżury on-call, które pokrywają czas poza standardowymi godzinami pracy.

## Kto pełni dyżury

- Dyżury pełnią inżynierowie z co najmniej **3-miesięcznym stażem** w firmie (po okresie próbnym).
- Przed pierwszym dyżurem trzeba odbyć **„shadow on-call”**, czyli jeden tydzień w parze z doświadczoną osobą.
- Rotacja jest **tygodniowa**. Dyżur zaczyna się i kończy w **poniedziałek o 10:00**.
- Na każdy tydzień przypadają dwie osoby: **dyżurny główny** (primary) i **zapasowy** (secondary). Lider dyżuru to dyżurny główny.
- Grafik i alerty prowadzimy w **PagerDuty**.

## Wynagrodzenie za dyżur

- **600 zł brutto** dodatku za tydzień dyżuru głównego, **300 zł** za dyżur zapasowy.
- Jeśli interwencja w nocy (22:00–6:00) trwała ponad **1 godzinę**, następnego dnia możesz zacząć pracę później albo wziąć **pół dnia wolnego**. Nie wlicza się to do puli urlopu.
- Na kontrakcie B2B dodatek doliczasz do faktury.

## Zamiana dyżuru

- Dyżurem możesz się zamienić z inną osobą z rotacji. Zamianę wpisujesz w PagerDuty i ogłaszasz na `#on-call`.
- W tygodniu dyżuru **nie możesz brać urlopu** (patrz `urlopy.md`). Najpierw musisz się zamienić.
- Osoba na dyżurze nie może być w tym samym tygodniu Release Captainem (patrz `deploy.md`).

## Poziomy incydentów

| Poziom | Przykład | Czas reakcji | Kto jest powiadamiany |
|---|---|---|---|
| **SEV1** | Circulation Desk niedostępny dla wszystkich bibliotek; wyciek danych | **15 minut**, 24/7 | dyżurny główny + zapasowy + Head of Engineering |
| **SEV2** | Nie działa jedna kluczowa funkcja (np. wypożyczanie) dla części bibliotek | **1 godzina**, 7:00–22:00 | dyżurny główny |
| **SEV3** | Błąd z obejściem, problem pojedynczej biblioteki | następny dzień roboczy | zgłoszenie w Linear (projekt **BUG**) |

Czas reakcji oznacza potwierdzenie alertu w PagerDuty i rozpoczęcie działania, a nie naprawę.

## Przebieg incydentu

1. **Potwierdź alert** w PagerDuty.
2. Załóż wątek na kanale **`#incydenty`** w formacie: `[SEV2] Krótki opis — prowadzi: imię`.
3. Wyznacz **Incident Commandera**. Domyślnie jest to dyżurny główny. Koordynuje on pracę, ale nie musi sam naprawiać.
4. Przy SEV1 i SEV2 aktualizuj **status page** (`status.circulation.example`) **co 30 minut**, dopóki incydent trwa.
5. Jeśli przyczyną był ostatni deploy, **najpierw rollback, potem diagnoza** (`kd deploy rollback production`).
6. Po rozwiązaniu oznacz wątek ✅ i zamknij incydent w PagerDuty.

## Postmortem

- Dla każdego **SEV1 i SEV2** piszemy postmortem w ciągu **5 dni roboczych**.
- Postmortem jest **blameless**: opisujemy, co zawiodło w systemie i procesie, a nie kto zawinił.
- Szablon jest w Google Docs w folderze „Engineering / Postmortems”.
- Postmortem omawiamy na cotygodniowym spotkaniu **„Ops Review”** w czwartek o 11:00.
- Działania naprawcze trafiają do Linear z etykietą `postmortem` i mają termin wykonania nie dłuższy niż **30 dni**.

## Kontakt z bibliotekami w czasie incydentu

- Bezpośrednio z bibliotekami w trakcie incydentu kontaktuje się **wyłącznie zespół Customer Success**, a nie inżynierowie.
- Przy wycieku danych powiadomienie bibliotek musi nastąpić w ciągu **24 godzin** (patrz `sprzet-i-bezpieczenstwo.md`). Treść zatwierdza Head of Engineering razem z Inspektorem Ochrony Danych.
