1.

-   Tekoäly ymmärsi hyvin sille antamani pyynnöt ja sen tuottama koodi oli suurimmalta osin erittäin hyvää.
-   Tekoäly teki sille antamani tehtävät nopeasti.
-   AI löysi hyvin tiedostot joihin piti tehdä muutoksia (.gitignore poikkeusta lukuunottamatta) annoin sille tiedostokohtaisen kontekstin promptissa tai en.
-   Se ajoi fiksusti esimerkiksi koodin koontikomennon tehtävän päätteeksi tarkistaakseen esimerkiksi typescript virheet ja sovelluksen kännistyskomennon yhdistettynä curl-komentoon tarkistaakseen oliko eräs virhe korjattu ja tehtävä suoritettu.
-   Se myös osasi luoda ja ajaa väliaikaisen aputiedoston, joka javascriptin avulla muokkasi pyydettyä tiedostoa (PROMPTIT.md) halutulla tavalla.

2.

-   Tekoälyllä saattoi olla vaikeuksia lukea tai kirjoittaa tiettyjä tiedostoja, se esimerkiksi epäonnistui lukemaan ja päivittämään .gitignore-tiedostoa ja loi uuden jo olemassaolevan tilalle.
-   AI ei myöskään huomannut lisätä virheenkäsittelyä samalla kun teki koodia.
-   AI ei organisoinut koodia milestäni hyvällä tavalla jatkokehitystä ajatellen kun se loi alussa niin tietokantaan kuin päätepisteisiin liittyvät kooditiedostot kansion src alle, eikä esimerkiksi kansioiden src/db ja src/routes.
-   Tekoälyn luomassa koodissa oli logiikka/käyttötapavirhe, jonka se korjasi myöhemmin antamani virheviestin avulla.

3.

-   Jäsennytin ja organisoin koodin paremmin jatkokehitystä ajatelllen, että tiedostot ovat loogisissa alikansioissa ja siten helpommin löydettävissä ja ymmärrettävissä.
-   Pyysin lisäämään virheidenkäsittelyn koodiin, jatkokehityksen, palvelimen toimivuuden ja virheiden löytämisen (debuggauksen) takia.
-   Pyysin tekoälyä lisäämään testit, jotta varmuus koodin toimivuudesta paranee ja jatkokehitys on kivuttomampaa ja helpompaa.
