---
marp: true
---

# TypeScript

## Principes & mise en application avec Node.js, React.js, Vue.js

Arnaud Renaud

<!-- Pré-requis pour la pratique : Node.js, Visual Studio Code -->

<!-- Objectif : créer une application qui affiche les prévisions météo -->
<!-- Première note : back-end : fonction de récupération de données météo, puis classe, serveur HTTP avec contrôleurs fonctionnels (Express ou ?) -->
<!-- Deuxième note : web-app React ou Vue.js, typage de bout en bout -->

---

## TypeScript plutôt que JavaScript : quel intérêt ?

---

## 🤔 Problème avec JavaScript : pas de typage

- Erreurs à l'exécution
- Autocomplétion restreinte
- Lecture du code difficile

_Pratique avec l'appel d'une fonction non typée_

---

## Apports de TypeScript

---

### ✍️ TypeScript : sur-ensemble de JavaScript

Reprend le langage JavaScript et ajoute des annotations de type aux :

- Variables
- Paramètres des fonctions
- Valeurs de retour des fonctions
- Classes

---

### ❌ TypeScript : règles de validation

Émet des erreurs lorsque le typage est incomplet ou incohérent

_(Ces erreurs sont affichées en temps réel dans l'éditeur de texte)_

---

### ✅ TypeScript : compilateur

Permet la compilation en code JavaScript une fois que les erreurs ont été corrigées

_(On résout les erreurs à la compilation – build time – au lieu d'attendre l'exécution – run time)_

---

### 📜 TypeScript : documentation et autocomplétion automatiques

Les annotations de type :

- facilitent la lecture
- permettent l'autocomplétion des propriétés d'une variable d'un type donné

---

### Apports de TypeScript :

- ✍️ Sur-ensemble de JavaScript
- ❌ Règles de validation
- ✅ Compilateur
- 📜 Documentation et autocomplétion automatiques

---

## Mise en pratique : projet Node.js

---

### Mise en place d'un projet Node.js (JavaScript)

- Se placer dans un nouveau dossier : `mkdir ts-practice && cd ts-practice`
- Initialiser un projet Node.js : `npm init -y`
- Créer un fichier `index.js` et y ajouter une instruction
- Vérifier sa bonne exécution : `node index.js`

---

### Configuration de TypeScript

- Ajouter TypeScript au projet : `npm install --save-dev typescript`
- Générer une configuration TypeScript : `npx tsc --init`
- Dans le fichier `tsconfig.json` généré, spécifier :
  - `"rootDir": "./src"`
  - `"outDir": "./dist"`

---

### Compilation avec TypeScript

- Renommer `index.js` en `index.ts`
- Déplacer `index.ts` dans le répertoire `src`
- Compiler le contenu de `src` dans `dist` : `npx tsc`
- Vérifier la bonne exécution du code compilé : `node dist/index.js`

---

### Définition des scripts de compilation et d'exécution

- Dans `package.json`, ajouter deux lignes à l'objet `scripts` :
  - `"build": "tsc"`
  - `"start": "node dist/index.js"`
  - `"dev": "npm run build && npm run start"`
- Compiler puis exécuter le programme dans la foulée :
  `npm run dev`

---

## Notions pratiques

---

### Typage d'une fonction

```ts
function getTemperatureForCity(city: string): number | undefined {
  …
}
```

On annote la signature d'une fonction :

- le type de chaque paramètre
- le type de la valeur de retour

---

### Types primitifs

Valeurs définies : `boolean`, `number`, `bigint`, `string`
Valeurs indéfinies : `undefined`, `null`, `NaN`, `void`

---

### Types spéciaux

Valeurs inconnues : `unknown`, `any`
Promesse : `Promise` (par exemple : `Promise<string>`)

---

### Types composés

Tableaux : `Array` ou `[]` (par exemple : `number[]`, `Array<number>`, `any[]`, `Array<any>`)
Tuples : par exemple : `[boolean, string, string, number]`
Objets : par exemple : `{name: string; height: number}`

---

### Restriction du type avec l'émission d'une erreur

```ts
function getTemperatureForCity(city: string): number {
  …
  if (!weather) {
    throw new Error(`Weather not found.`)
  }
  return weather.temperature
}
```

Si l'on veut restreindre le type retourné (éviter `undefined`), on peut émettre une erreur à la place.
_Sans TypeScript, on n'aurait peut être pas pensé à gérer ce cas._

---

### Définition d'un type composé (objet)

```ts
function getWeatherForCity(city: string): {
   city: string;
   country: string;
   temperatureCelsius: number;
   weatherCode: number;
 } {
  …
 }
```

---

### Définition d'un alias pour un type

```ts
type Weather = {
  city: string;
  country: string;
  temperatureCelsius: number;
  weatherCode: number;
};
```

Cet alias permet de factoriser la définition du type composé (on peut aussi utiliser `interface`). On peut l'exporter et l'importer dans d'autres fichiers.

---

### Typage d'une constante

```ts
const WEATHER_FOR_CITIES: Weather[] = […]
```

Le typage explicite d'une variable ou d'une constante est souvent superflu mais peut aider à l'autocomplétion du code.

---

### Typage d'une fonction sans valeur de retour

```ts
function printWeatherForCity(city: string): void {
  …
  // ne retourne rien
}
```

Le type `void` est réservé aux fonctions qui ne retournent aucune valeur.

---

### Énumérations avec type littéral

```ts
function printWeatherForCity(
  city: string,
  temperatureUnit: "CELSIUS" | "FAHRENHEIT"
) {
  …
}
```

Le littéral `"CELSIUS" | "FAHRENHEIT"` est plus précis que `string` et empêche ensuite les fautes de frappe à l'usage de la fonction.

---

### Énumération avec _enum_

```ts
enum TemperatureUnit {
  CELSIUS = "CELSIUS",
  FAHRENHEIT = "FAHRENHEIT",
}

function printWeatherForCity(
  city: string,
  temperatureUnit: TemperatureUnit
) {
  …
}
```

---

### Typage d'une classe

```ts
class Weather implements WeatherAttributes {
  city: string;
  // … et tous les autres attributs et méthodes de `WeatherAttributes`

  constructor(city: string) {
    // …
  }

  print(temperatureUnit: TemperatureUnit): void {
    // …
  }
}
```

Une classe peut implémenter un type (ou une interface).
Ses méthodes peuvent être typées comme des fonctions.

---

### Import-export des types

```ts
export type WeatherAttributes = {
  city: string;
  country: string;
  temperatureCelsius?: number;
  weatherCode?: number;
};
```

Les types peuvent être exportés et importés comme n'importe quel autre symbole.

---

### Type de retour d'une fonction asynchrone

```ts
async setCurrent(): Promise<void> {
  // code asynchrone (await)
}
```

Lorsqu'une fonction contient du code asynchrone (`async`-`await`), sa valeur de retour est enveloppée dans une promesse (`Promise<…>`).

---

### Conversion de type (_type cast_)

```ts
const weather = (await weatherResponse.json()) as {
  current: { temperature_2m: number; weather_code: number };
};
```

Le mot-clé `as` permet au développeur de forcer le compilateur à considérer qu'une variable est d'un type donné.
On l'utilise quand on connaît le type d'une donnée issue d'un système extérieur.
