# 2. feladat (4 pont)

## Bevezető

Készíts Chart.js segítségével egy összetett vonaldiagramot, melyen a karra járó hallgatók éves átlagos számát és a kiadott diplomák számát ábrázolod.

Az adatokat a `script.js` fájlban találod.

## Minta adat

```javascript
{
    year: 2020, // év
    semester_spring: 2794, // tanulói létszám a tavaszi félévben.
    semester_autumn: 3400, // tanulói létszám az őszi félévben!

    diploma: 729, // a tárgyévben kiadott diplomák száma
},
...
```

## Leírás

1. Készítsd elő az adatokat JavaScript segítségével. (Az adatok kézzel beégetése nem fogadható el.) A hallgatói létszám legyen a `semester_spring` és a `semester_autumn` átlaga. (1 pont)
2. Adj egy második adathalmazt a diagramhoz, mely az adott évben kiadott diplomák számát tartalmazza. (1 pont)
3. Készíts egy függvényt `randomColor` néven, mely visszaad egy véletlenszerűen generált színt. Ennek segítségével állítsd be a diagramok színét (`borderColor`).
   
    1. Készíts egy `randomBetween(min, max)` segédfüggvényt, mely visszaad egy véletlenszerűen generált egész számot a megadott intervallumban. (1 pont)
    2. A visszatérési érték egy string legyen a következő formátumban: `rgb(RRR, GGG, BBB)`. A három szín értékének generálásához használd a `randomBetween(0, 255)` függvényt. (1 pont)

## Linkek

-   [Chart.js](https://www.chartjs.org/)
-   [Chart.js Getting Started](https://www.chartjs.org/docs/latest/getting-started/)
-   [Chart.js Line Chart](https://www.chartjs.org/docs/latest/charts/line.html)

## Forrás

[Neptun létszámok](https://neptun.elte.hu/VcShowReport/Index/341?skey=kEK61DN0NsNzQ5BjUmDpbFAn)
[Neptun diplomások](https://neptun.elte.hu/VcShowReport/Index/1081?skey=wGndIbbp4mOhmWbx1nDQoOsZ)
