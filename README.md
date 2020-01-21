# Prodekon autoaikataulu

Työkalu automaattisten aikataulukuvien muodostamiseen Prodekon kalentereista.

---

### Kehittäminen

Paikallinen kehittäminen onnistuu seuraavilla komennoilla:

```
yarn
yarn dev

// Kääntäminen
yarn build
```

### Koodityyli

Tiedostot tsconfig.json, .eslintrc ja .prettierrc sisältävät koodin tyyppi- ja tyylimäärittelyjä. Käytössä on Typescript, ESLint ja Prettier

## Konfigurointi

Työkaluun on laitettava `credentials.json` tiedosto, joka toimii samalla tavalla, kun googlen node.js quickstart https://developers.google.com/calendar/quickstart/nodejs

Työkaluun on myös kirjauduttava google-tunnuksilla, jotka ovat tilanneet kyseiset kalenterit. Ohjeet tulostuvat komentoriville.

### Kalenterit

Kalenterit, joista tietoa haetaan, on määritelty caldendarId:n perusteella `calendarIds.json` tiedostossa. Nykyiset kalenterit josta dataa haetaan ovat:

- 'a440frd2hhop84nhvesq3krijc@group.calendar.google.com', Excut
- '4j6ircv0qosvgfk66588an88n8@group.calendar.google.com', Bileet
- 'jgqf5u162heo7vgkgddq90d68s@group.calendar.google.com', Ulkosektori
- 'cto@prodeko.org', Yleiset
- 'miqv1ra1mb1878p9d5766i8a7g@group.calendar.google.com', PoRa
- 'ekm75qbnvm91a45rs2q5p2edok@group.calendar.google.com', Fuksit

## Setup

Asenna työkalun riippuvuudet

```
yarn
```

## Käyttö

Kuva tulostuu tulos.jpg tiedostoon

```
// Nykyisen viikon
yarn start

// Seuraavan viikon
yarn start-nextweek
```

Viikon voi myös valita manuaalisesti ajamalla lähdehakemistossa

```
// Nykyisen viikon
node ./build/index.js

// Seuraavan viikon
node ./build/index.js next

// Tietyn viikon
node ./build/index.js [viikon numero]
```

## Rakennuspalikat

- [Jimp](https://github.com/oliver-moran/jimp) - Kuvanmuokkauskirjasto
- [Googleapis](https://github.com/googleapis/google-api-nodejs-client) - Googlen rajapinta

## Kehittäjät

- Taavi Mustajoki

## Lisenssi

MIT lisenssi - [LICENSE](LICENSE).
