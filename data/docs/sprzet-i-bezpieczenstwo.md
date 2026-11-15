# Sprzęt i bezpieczeństwo

Circulation Desk przetwarza dane osobowe czytelników bibliotek: imiona, nazwiska, adresy, numery kart bibliotecznych i historię wypożyczeń. Kartoteka jest **podmiotem przetwarzającym** dane w imieniu bibliotek (zgodnie z RODO). To oznacza konkretne obowiązki dla każdego z nas.

## Sprzęt służbowy

- Laptop jest **własnością firmy** i wymieniamy go co **3 lata**. Wcześniejsza wymiana jest możliwa tylko w razie awarii.
- Dodatkowe akcesoria (myszka, klawiatura, stacja dokująca) zamawiasz na `#it-help`. Limit wynosi **800 zł rocznie** i jest niezależny od dofinansowania home office.
- Na laptopie musi działać szyfrowanie dysku (FileVault lub BitLocker), co sprawdza MDM. Laptop bez szyfrowania jest odcinany od VPN.
- Prywatne konta (np. prywatny Dropbox, prywatny GitHub) nie mogą przechowywać żadnych plików firmowych.
- Po zakończeniu współpracy zwracasz sprzęt w ciągu **7 dni**, osobiście w biurze albo kurierem na koszt firmy.

## Hasła i konta

- Wszystkie hasła firmowe przechowujesz w **1Password**. Zapisywanie haseł w przeglądarce, notatkach czy plikach `.env` commitowanych do repozytorium jest zabronione.
- **2FA jest obowiązkowe** wszędzie. Preferujemy klucz sprzętowy YubiKey, który każdy inżynier dostaje na onboardingu. Aplikacja TOTP jest dozwolona tylko jako zapasowa metoda.
- Hasło do 1Password musi mieć co najmniej **16 znaków**.
- Konto nieużywane przez **60 dni** jest automatycznie dezaktywowane.

## Dane czytelników

- **Nigdy** nie kopiuj produkcyjnej bazy danych ani jej fragmentów na laptopa, do arkusza czy na Slacka.
- Do pracy lokalnej używasz **zanonimizowanego dumpa**. Generujemy go automatycznie **co niedzielę o 3:00** i pobierasz go przez `kd db pull`.
- Dostęp do produkcji (odczyt) dostajesz po **30 dniach** pracy i szkoleniu „Bezpieczeństwo danych czytelników" (patrz `onboarding.md`). Każde zapytanie do produkcyjnej bazy jest logowane.
- Szkolenie z bezpieczeństwa danych powtarzasz **co roku**. Przypomnienie przychodzi z Kadrownika.
- Wsparcie dla konkretnej biblioteki (np. sprawdzenie konta czytelnika) robisz tylko w ramach zgłoszenia w systemie supportowym, nigdy „na prośbę na Slacku”.

## Zgubiony lub skradziony sprzęt

1. Zgłoś to **w ciągu 1 godziny** od zauważenia: na kanale `#security` **i** mailem na `security@kartoteka.example`.
2. IT zdalnie blokuje i czyści urządzenie przez MDM.
3. Jeśli doszło do kradzieży, zgłoś ją na policję, a kopię zgłoszenia prześlij do People Team.
4. Nie poniesiesz kosztów utraty sprzętu, jeśli zgłosisz ją w terminie.

Telefon z firmową pocztą lub Slackiem traktujemy tak samo jak laptop: jego utratę też zgłaszasz w ciągu 1 godziny.

## Phishing i podejrzane wiadomości

- Podejrzane maile zgłaszasz przyciskiem „Zgłoś phishing” w Gmailu albo na `#security`.
- Nikt z Kartoteki **nigdy** nie poprosi Cię o hasło ani kod 2FA, ani na Slacku, ani mailem, ani telefonicznie.
- Raz na kwartał przeprowadzamy testową kampanię phishingową. Kliknięcie oznacza dodatkowe 20-minutowe szkolenie, bez żadnych konsekwencji.

## Incydent bezpieczeństwa

Wyciek danych lub podejrzenie wycieku zgłaszasz **natychmiast** jako incydent **SEV1** (patrz `dyzury-i-incydenty.md`). Zgodnie z umowami z bibliotekami musimy je powiadomić w ciągu **24 godzin** od wykrycia naruszenia, więc liczy się każda godzina.
