# 1. feladat (6 pont)

## Bevezető

Használd az IntersectionObserver API-t, hogy elkészítsd a videón látható oldalt, ami egy modell az előttetek álló félévről.

## Leírás

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

## Forrás

&copy; Vikor Bogdán Vitold