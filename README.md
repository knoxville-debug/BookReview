# BookReview

BookReview este o aplicație web pentru prezentarea cărților și a recenziilor. Vizitatorii pot explora un catalog de cărți, pot căuta și filtra titluri, pot consulta recenzii demonstrative și pot adăuga, modifica sau șterge propriile recenzii.

**Site publicat:** https://knoxville-debug.github.io/BookReview/

## Pagini și funcționalități

| Pagină | Descriere |
| --- | --- |
| `index.html` | Pagina principală, cu recomandări de cărți și recenzii demonstrative |
| `carti.html` | Catalog de cărți, căutare după titlu sau autor și filtrare după gen |
| `recenzii.html` | Afișarea recenziilor și opțiuni de editare și ștergere |
| `adauga-recenzie.html` | Formular pentru adăugarea și modificarea recenziilor, cu validări |

Aplicația este organizată în patru module: catalog de cărți, căutare și filtrare, afișare de recenzii și gestionare de recenzii.

## Tehnologii utilizate

- **HTML5** — structura paginilor;
- **CSS3** — stilizare și adaptare pentru diferite dimensiuni de ecran;
- **Bootstrap 5.3.6** — sistem de grilă și componente responsive;
- **JavaScript** — căutare, filtrare, validare și gestionarea recenziilor;
- **Git și GitHub** — versionarea și publicarea proiectului;
- **GitHub Pages** — găzduirea versiunii publice.

## Structura proiectului

```text
BookReview/
├── index.html
├── carti.html
├── recenzii.html
├── adauga-recenzie.html
├── css/
│   ├── bootstrap.min.css
│   ├── BOOTSTRAP_LICENSE.txt
│   └── style.css
├── js/
│   └── script.js
└── wireframes/
```

## Rulare

Aplicația poate fi accesată direct prin [GitHub Pages](https://knoxville-debug.github.io/BookReview/).

Pentru rulare locală, se poate deschide folderul proiectului într-un editor și se poate servi fișierul `index.html` printr-un server HTTP local, de exemplu Live Server din Visual Studio Code. Nu sunt necesare instalarea unui backend sau configurarea unei baze de date.

## Stadiul implementării

Pentru Tema 1 sunt realizate paginile și interfața responsive, navigarea între pagini, căutarea, filtrarea și validarea formularului. Recenziile introduse de vizitatori sunt salvate prin `localStorage`, doar în browserul utilizatorului; nu există încă o bază de date SQL sau conturi de utilizator.

Structura propusă pentru o bază de date ulterioară este ilustrată în `wireframes/06_diagrama_bd_planificata.png`.

## Documentație

Documentația Temei 1 se predă separat, în format Word sau PDF. Ea prezintă structura aplicației, modulele, designul, wireframe-urile și jurnalul utilizării AI.
