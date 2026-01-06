# Contributing

Grazie per voler contribuire al progetto ActiveMQ Classic Hawtio Plugin.

## Regole generali

- Mantieni i componenti piccoli e modulari
- Evita dipendenze non necessarie
- Mantieni il router semplice (hash-based)
- Usa Recharts per i grafici
- Mantieni la UI coerente con i pannelli esistenti

---

## Struttura del codice

### Componenti
- Ogni pannello è un componente React isolato
- Le viste principali sono in `components/<Section>/`

### Servizi
- Tutte le chiamate JMX via Jolokia sono in `services/`
- Nessuna chiamata diretta a Jolokia nei componenti

### Stile
- Usa className `"broker-panel"` per i pannelli
- CSS minimale

---

## Pull Request

- Descrivi chiaramente cosa hai cambiato
- Aggiungi screenshot se modifichi la UI
- Mantieni la compatibilità con Hawtio 1.x

---

## Coding Style

- React functional components
- Hooks
- Nessuna classe
- Nessun Redux
- Nessun framework UI pesante

---

Grazie per contribuire!
