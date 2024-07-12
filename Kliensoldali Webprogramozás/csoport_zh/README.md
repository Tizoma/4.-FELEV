# CsoportZH 2024

## Leírás

A zárthelyi dolgozat 3 feladatból áll.
A megoldásra 60 perc áll rendelkezésre.
Az elkészült munkát a Canvas-re kell feltölteni egy zip fájlban.

## 1. feladat (6 pont)

### Bevezető

Használd az IntersectionObserver API-t, hogy elkészítsd a videón látható oldalt, ami egy modell az előttetek álló félévről.

### Leírás

1. Készíts a querySelector metódus használatával DOM hivatkozásokat a kódodban a HTML-ben lévő elemekhez. (0,5 pont)
    1. `milestones` : NodeList, tartalmazza az összes milestone stílusosztályú sectiont
    2. `motivationTitle`: Element, hivatkozás a “motivation” id-val rendelkező főcímre
2. Írj egy callback függvényt az IntersectionObserver számára, ami paraméterként egy [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#targeting_an_element_to_be_observed) llistát vár, amelynek az elemein végigiterál és a következőket csinálja velük, amennyiben a megadott entry épp a viewportban van:
    1. Lekéri az adott `entry` target adattagjához tartozó ID-t, és elmenti egy `progressProperty` nevű konstansba az azonos `id` adattaggal rendelkező objektumot a `progressProperties` nevű tömbből (2 pont)
    2. Beállítja a dokumentum háttér stílusát a `progressProperty.backgroundColor` értékére (0,5 pont)
    3. Beállítja a `motivationTitle` szöveges tartalmát a `progressProperty.motivationalText` vagy `progressProperty.motivationalTextHungarian` értékére. (0,5 pont)
3. Példányosíts [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) objektumot `milestoneObserver` néven
    1. Használd a 2-es feladatban létrehozott callback függvényt (0,5 pont)
    2. Az [IntersectionObserver beállításával](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#thresholds) érd el, hogy elegendő legyen a detektáláshoz, ha a megfigyelt elem magasságának 50%-a ér a viewportba. (1 pont)
4. Rendeld hozzá a létrehozott `milestoneObserver` -t minden egyes elemhez, amit a `milestones` lista tartalmaz (1 pont)

### Forrás

&copy; Vikor Bogdán Vitold

## 2. feladat (4 pont)

### Bevezető

Készíts Chart.js segítségével egy összetett vonaldiagramot, melyen a karra járó hallgatók éves átlagos számát és a kiadott diplomák számát ábrázolod.

Az adatokat a `script.js` fájlban találod.

### Minta adat

```javascript
{
    year: 2020, // év
    semester_spring: 2794, // tanulói létszám a tavaszi félévben.
    semester_autumn: 3400, // tanulói létszám az őszi félévben!

    diploma: 729, // a tárgyévben kiadott diplomák száma
},
...
```

### Leírás

1. Készítsd elő az adatokat JavaScript segítségével. (Az adatok kézzel beégetése nem fogadható el.) A hallgatói létszám legyen a `semester_spring` és a `semester_autumn` átlaga. (1 pont)
2. Adj egy második adathalmazt a diagramhoz, mely az adott évben kiadott diplomák számát tartalmazza. (1 pont)
3. Készíts egy függvényt `randomColor` néven, mely visszaad egy véletlenszerűen generált színt. Ennek segítségével állítsd be a diagramok színét (`borderColor`).
   a. Készíts egy `randomBetween(min, max)` segédfüggvényt, mely visszaad egy véletlenszerűen generált egész számot a megadott intervallumban. (1 pont)
    - Tipp: használd az MDN dokumentációját, ahol megtalálható a függvény egy lehetséges implementációja. (Ezt felhasználhatod)
      b. A visszatérési érték egy string legyen a következő formátumban: `rgb(RRR, GGG, BBB)`. A három szín értékének generálásához használd a `randomBetween(0, 255)` függvényt. (1 pont)

### Linkek

-   [Chart.js](https://www.chartjs.org/)
-   [Chart.js Getting Started](https://www.chartjs.org/docs/latest/getting-started/)
-   [Chart.js Line Chart](https://www.chartjs.org/docs/latest/charts/line.html)

### Forrás

[Neptun létszámok](https://neptun.elte.hu/VcShowReport/Index/341?skey=kEK61DN0NsNzQ5BjUmDpbFAn)
[Neptun diplomások](https://neptun.elte.hu/VcShowReport/Index/1081?skey=wGndIbbp4mOhmWbx1nDQoOsZ)

## 3. feladat (10 pont)

### Bevezető

Készíts egy egyedi elemet, amely lehetővé teszi egy árúcikkeket listázó oldal létrehozását.

### Leírás

<aside>
💡 Vizsgáld meg a HTML fájl tartalmát, hogy az elvárt működés világosabb legyen számodra a feladat megoldása során!
</aside>

1. Készítsd el a `CommercialItem` osztályt, ami a `HTMLElement` leszármazottja, és a `shadowRoot` host-jaként fog funkcionálni.
2. Készítsd el a `CommercialItem` konstruktorát:

    1. Hívd meg az ősosztály konstruktorát! (1 pont)
    2. [Rendelj ShadowDOM-ot](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#creating_a_shadow_dom) a `CommercialItem` host-hoz! (mode: open) (1 pont)
    3. Add hozzá a lenti `commercialItemStyles` stílusokat a `shadowRoot`-hoz (1 pont)

        **Stílusok**

        ```jsx
        const commercialItemStyles = `<style>
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 20px;
                padding: 20px;
                border: 1px solid #000;
                border-radius: 10px;
            }
            img {
                width: 100px;
                height: 100px;
                border-radius: 50%;
            }
        </style>
        `
        ```

    4. **Indexkép** (2 pont)
        1. Hozz létre egy `img` elemet `itemPictureImg` néven
        2. [Kérd le az host `picture` attribútumának értékét](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute), majd állítsd be ezt a stringet az `itemPictureImg` src adattagjaként.
    5. **Árucikk neve** (2 pont)
        1. Hozz létre egy `div` elemet `itemNameDiv` néven
        2. [Kérd le az host `name` attribútumának értékét](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute), majd állítsd be ezt a stringet az `itemNameDiv` szöveges tartalmaként.
    6. **Árucikk ára** (2 pont)
        1. Hozz létre egy `div` elemet `itemPriceDiv` néven
        2. [Kérd le a host `price` attribútumának értékét](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute), fűzz hozzá valamilyen pénznemet
           (pl. `“ Ft”`), majd állítsd be ezt a stringet az `itemPriceDiv` szöveges tartalmaként.

    <aside>
    💡 Az így létrehozott elemeket add hozzá a `shadowRoot`-hoz!
    </aside>

3. Definiáld az egyedi elemet [a beépített funkciók segítségével.](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#examples) (1 pont)

### Forrás

&copy; Vikor Bogdán Vitold
