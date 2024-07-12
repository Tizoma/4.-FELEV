# 3. feladat (10 pont)

## Bevezető

Készíts egy egyedi elemet, amely lehetővé teszi egy árúcikkeket listázó oldal létrehozását.

## Leírás

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

## Forrás

&copy; Vikor Bogdán Vitold
