# Vocabulary data attribution

The bulk vocabulary is generated into `public/vocabulary-data/` at build time and fetched lazily by language + level. It is intentionally not bundled into the React source. Hand-edited lesson vocabulary remains a compact fallback and takes precedence when the same word and level occur in both datasets.

## English

- [CEFR-J Vocabulary Profile](https://github.com/openlanguageprofiles/olp-en-cefrj), levels A1–B2. The repository requests citation of the CEFR-J Wordlist Version 1.6 research paper.
- [Octanove Vocabulary Profile C1/C2](https://github.com/openlanguageprofiles/olp-en-cefrj), licensed under CC BY-SA 4.0.
- [English–Vietnamese Dictionary](https://github.com/skypediacode/english-vietnamese-dictionary), licensed under CC BY-SA 4.0.
- [thichhoc-dict](https://github.com/thichhoc-org/thichhoc-dict), data licensed under CC BY-SA 4.0.
- [Tatoeba through OPUS](https://opus.nlpl.eu/Tatoeba/en&vi/v2023-04-12/Tatoeba), used for a subset of aligned example sentences and Vietnamese translations. Individual sentence licenses are distributed with the corpus.

## Chinese

- [HSK Vocabulary](https://github.com/jelleverheyen/hsk-vocabulary), MIT License.
- [CVDICT](https://github.com/ph0ngp/CVDICT), licensed under CC BY-SA 4.0.

## Japanese

- [OpenJLPT](https://github.com/evanclan/OpenJLPT), licensed under CC BY-SA 4.0.
- English glosses are linked to Vietnamese meanings from the English–Vietnamese Dictionary above.

## Korean

- [NIKL TOPIK Vocabulary derived data](https://topikvocab.foldalpha.com/download/), provided under the Korea Open Government License Type 1. The generated data uses the Vietnamese export.

## Scope note

NT targets about **1,000 study words per app level**. Some source lists are smaller than 1,000 (for example early HSK 3.0 and JLPT bands), so the build may supplement a band with words from a neighboring harder source band. Every generated item keeps `officialLevel`, `levelBasis`, and `source` so the UI/data can distinguish source classification from the NT learning band.

Level labels support study and filtering inside this application. They do not constitute official exam certification or an official vocabulary prescription by CEFR, HSK, JLPT, TOPIK, or their governing organizations.

