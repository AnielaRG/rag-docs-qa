# FAQ — najczęstsze pytania pracowników

Krótkie odpowiedzi na pytania, które najczęściej pojawiają się na `#people` i `#engineering`. Szczegóły są w pozostałych dokumentach.

## Wynagrodzenie i rozliczenia

**Kiedy jest wypłata?**
Na umowie o pracę wynagrodzenie wypłacamy **do 10. dnia** następnego miesiąca. Na B2B wystawiasz fakturę **do 5. dnia** miesiąca, a płacimy w terminie **7 dni** od jej otrzymania.

**Gdzie wysłać fakturę B2B?**
Na adres `faktury@kartoteka.example`, w formacie PDF, z numerem umowy w tytule maila.

**Jak rozliczyć dojazd na spotkanie zespołu?**
W Kadrowniku, do 10. dnia następnego miesiąca. Zwracamy pociąg 2. klasy albo kilometrówkę. Nocleg (do 350 zł) przysługuje, jeśli podróż w jedną stronę trwa ponad 3 godziny.

## Rozwój

**Czy mam budżet szkoleniowy?**
Tak, **3000 zł rocznie** na osobę na kursy, książki i certyfikaty. Niewykorzystany budżet nie przechodzi na następny rok. Wnioski składasz w Kadrowniku, akceptuje manager.

**Czy mogę pojechać na konferencję?**
Tak. Raz w roku firma pokrywa wyjazd na jedną konferencję (bilet, dojazd, nocleg). Koszt **nie jest** odejmowany od budżetu szkoleniowego. Dni na konferencji to czas pracy, nie urlop. Jeśli wystąpisz z prelekcją, możesz pojechać na dodatkowe konferencje.

**Ile czasu mogę poświęcać na naukę?**
Inżynierowie mają **4 godziny tygodniowo** na naukę i eksperymenty, najlepiej w środę (dzień bez spotkań).

## Benefity

**Jakie mam benefity?**
Kartę Multisport (firma pokrywa 100% za pracownika), prywatną opiekę medyczną (pakiet rodzinny z dopłatą), dofinansowanie home office (2000 zł jednorazowo + 200 zł miesięcznie) oraz 1 dodatkowy dzień wolny na wolontariat.

**Czy benefity przysługują na B2B?**
Tak, te same benefity przysługują na B2B i na UoP. Inny jest tylko wymiar urlopu (24 dni na B2B).

## Urlopy i czas pracy

**Ile dni wcześniej zgłaszam tygodniowy urlop?**
Co najmniej **14 dni** wcześniej, w Kadrowniku. Krótki urlop (1–3 dni) zgłaszasz co najmniej 2 dni robocze wcześniej.

**Czy mogę wziąć urlop w czasie release freeze?**
Tak. Freeze (20 grudnia – 6 stycznia) dotyczy tylko wdrożeń. W okresie 15–31 grudnia na urlopie może być jednak najwyżej połowa zespołu.

**Czy muszę przychodzić do biura?**
Nie na co dzień. Obowiązkowe są spotkania zespołu w biurze 2 razy w miesiącu i coroczny zjazd firmowy we wrześniu.

## Technika

**Mogę zrobić deploy w piątek?**
Nie. Deploy na produkcję odbywa się od wtorku do czwartku w godzinach 10:00–15:00. Wyjątkiem jest hotfix SEV1/SEV2, który zatwierdza Head of Engineering albo lider dyżuru.

**Kiedy dostanę dostęp do produkcji?**
Najwcześniej po 30 dniach pracy i po szkoleniu „Bezpieczeństwo danych czytelników”.

**Skąd wziąć dane do lokalnej bazy?**
Z zanonimizowanego dumpa: `kd db pull`. Dump generujemy co niedzielę o 3:00. Nigdy nie kopiuj danych produkcyjnych.

**Zgubiłem laptopa. Co robić?**
Zgłoś to w ciągu **1 godziny** na `#security` i na `security@kartoteka.example`. IT zablokuje urządzenie zdalnie. Jeśli zgłosisz utratę w terminie, nie poniesiesz kosztów.

**Kto może zdecydować o rollbacku?**
Release Captain albo osoba na dyżurze on-call, bez czekania na niczyją zgodę. Rollback powinien się zakończyć w ciągu 15 minut.

**Od kiedy mogę pełnić dyżury on-call?**
Po okresie próbnym (3 miesiące) i po tygodniu „shadow on-call” z doświadczoną osobą.
