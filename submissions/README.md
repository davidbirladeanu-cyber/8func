# 8Func — Folder Submissions (Răspunsuri Stocate)

Acest folder colectează automat și în secret fișierele JSON cu răspunsurile fiecărei persoane care completează testul 8Func.

## Formatul Fișierelor
Fiecare test finalizat generează un fișier de tipul:
`quiz_YYYY-MM-DDTHH-mm-ss_TYPE_MODE.json` (de exemplu: `quiz_2026-10-21T02-45-00_INTJ_complete.json`).

## Ce conține fiecare fișier JSON:
1. `id`: ID unic al sesiunii
2. `timestamp` și `localTime`: Data și ora exactă a completării
3. `mode`: Modul de testare (`rapid` - 24, `standard` - 60, `complete` - 100)
4. `orderMode`: Modul de ordonare a întrebărilor (`format`, `function`, `random`)
5. `mbtiType` și `derivedType`: Tipul MBTI rezultat (ex: `INTJ`)
6. `matchPercentage`: Procentul de potrivire cu tipul rezultat
7. `functionPercentages`: Procentele finale pentru toate cele 8 funcții cognitive (Ni, Ne, Ti, Te, Fi, Fe, Si, Se)
8. `axisPercentages`: Procentele pe cele 4 axe (EI, NS, TF, JP)
9. `answers`: Dicționar simplu ID întrebare -> Răspuns (ex: `{"D01": "STRONGLY_AGREE", ...}`)
10. `detailedResponses`: Toate întrebările cu textul lor, categoria, funcția țintă și răspunsul dat

## Cum accesezi panoul secret din browser (Secret Admin Vault):
- **Comandă rapidă tastatură**: Apasă `Ctrl + Shift + S` (sau `Cmd + Shift + S` pe Mac) oriunde în aplicație.
- **Click secret pe logo**: Dă 5 click-uri rapide pe logo-ul **8func** din bara de sus.
- **Link direct**: Adaugă `#vault` la sfârșitul adresei URL (ex: `http://localhost:5173/8func/#vault`).
