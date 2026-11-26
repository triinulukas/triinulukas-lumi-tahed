# Lumi tähed

Veebiäpp (PWA) umbes 3-aastasele lapsele trükitähtede ja lugemise algõppeks.
Last juhendab lumehaldjas **Lumi**, kes räägib eesti keeles ja loeb iga ülesande ette, nii et laps saab äppi kasutada ka üksi.
Äpp töötab **ilma internetita** ja kõik andmed jäävad telefoni.

## Mida laps teeb

Üks mänguring kestab umbes 5 minutit ja koosneb 8 voorust. Lumi tutvustab päevas kõige rohkem ühe uue tähe.

| Voor | Mis toimub |
|---|---|
| ❄️ Uus täht | Suur täht ja pilt (M ja 🐝). Lumi ütleb hääliku „mmm, nagu mesilane“ ja laps puudutab tähte. |
| 🔍 Kus on…? | „Kus on mmm?“ Laps valib 2–3 tähe seast. |
| 🐝 Mis tähega algab? | Pilt ja küsimus „Millise tähega algab mesilane?“ |
| 🧩 Paneme kokku | M ja A liiguvad kokku: „mmm… aaa… MA“ (häälikute ühendamine). |
| 📖 Loeme sõna | E-M-A: laps puudutab tähti järjest, siis ilmub pilt 👩 ja Lumi ütleb sõna. |

Õige vastuse eest saab laps lumehelbe. Selgeks õpitud tähed lähevad **jäälossi** (🏰), kus laps saab neid uuesti kuulata.
Vale vastuse korral Lumi ütleb, mis täht see oli, ja näitab helendavalt õiget tähte. Laps ei jää kunagi jänni.

## Vanemale

Hoia paremas ülanurgas olevat väikest ⚙️ nuppu **2 sekundit** all.

- **Tunneb**: märgi tähed, mida laps juba tunneb. Neid harjutatakse kohe ja need saavad kiiresti selgeks.
- **▶** kuula häälikut, **🎙️** loe häälik oma häälega sisse (kuni 4 sekundit). Sinu hääl asendab arvutihäält kõikjal. **↺** viib tagasi arvutihäälele.
- Igal tähel on edenemine (●●○○). Täht on selge, kui laps on selle õigesti ära tundnud **neljal eri päeval**.

## Õpetamise alus

- **Süsteemne häälikupõhine õpe** (*systematic synthetic phonics*). Laps õpib tähe häälikut (M on „mmm“), mitte tähe nime („emm“). See on uuringute järgi kõige tõhusam viis lugema õppida (National Reading Panel 2000; Ehri jt 2001; Rose Review 2006). Eesti keel sobib selleks väga hästi, sest kirjapilt vastab hääldusele.
- **Märksõna pildiga** (M nagu 🐝). Pildiga seotud häälik jääb paremini meelde (Ehri jt, *integrated picture mnemonics*).
- **Tähejärjekord**: kõigepealt sagedased ja kergesti kuuldavad häälikud (A, M, E, I, S…). Sarnased tähed (O/Õ/Ö, A/Ä, U/Ü) tulevad hiljem ja ajaliselt lahus. Need ei ole vastusevariantidena kõrvuti enne, kui laps tunneb esimest tähte kindlalt.
- **Hajutatud kordamine** (*spaced repetition*, Leitneri kastid). Täht saab selgeks alles mitme päeva harjutamise järel. Nõrgemaid tähti küsitakse sagedamini.
- **Eksimusteta õppimine** ja **lühikesed seansid**. 3-aastase tähelepanu kestab mõne minuti. Laps peab saama palju eduelamusi ja eksimus ei tohi tunduda karistusena.
- **Häälikute ühendamine** (*blending*) kohe, kui laps tunneb paari häälikut, sest just ühendamine viib lugemiseni. Esimesed sõnad on lühikesed ja lapsele tuttavad (EMA, ISA, LUMI, SAI).

Äpp täiendab ühist lugemist, aga ei asenda seda. Ettelugemine ja koos raamatu vaatamine on 3-aastasele endiselt kõige tähtsamad.

## Hääl

Laused on eelnevalt loodud TÜ keeletehnoloogia **Neurokõnega** (kõneleja „mari“) ja kaasas failidena `audio/`. API-le saadetakse ainult äpi üldised laused, mitte midagi lapse kohta.
Üksikuid häälikuid hääldab arvutihääl vahel ebatäpselt, eriti T, K, P, D, G ja B. Need tasub vanema vaates üle kuulata ja vajaduse korral ise sisse lugeda.

## Arendus

```bash
python3 -m http.server 8766        # ava http://localhost:8766
npm test                           # õppeloogika testid
node scripts/generate-audio.mjs    # loo hääled uutele lausetele (macOS)
```

Pärast iga muudatust suurenda `sw.js` failis `CACHE` versiooni, et telefon laadiks uue versiooni.
