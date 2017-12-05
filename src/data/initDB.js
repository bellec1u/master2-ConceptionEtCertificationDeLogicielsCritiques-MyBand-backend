var instruments = [
    /* 1 */
    {
        "name" : "orgue de Barbarie",
        "type" : "vent"
    },

    /* 2 */
    {
        "name" : "mélodica",
        "type" : "vent"
    },

    /* 3 */
    {
        "name" : "thérémine",
        "type" : "electronique"
    },

    /* 4 */
    {
        "name" : "bazooka",
        "type" : "vent"
    },

    /* 5 */
    {
        "name" : "kazoo",
        "type" : "vent"
    },

    /* 6 */
    {
        "name" : "batterie",
        "type" : "percussion"
    },

    /* 7 */
    {
        "name" : "guitare",
        "type" : "corde"
    },

    /* 8 */
    {
        "name" : "piano",
        "type" : "corde"
    },

    /* 9 */
    {
        "name" : "voix",
        "type" : "vent"
    },

    /* 10 */
    {
        "name" : "guitare basse",
        "type" : "corde"
    }
];

var users = [
    /* 1 */
    {
        "firstname" : "Dexter",
        "lastname" : "Holland",
        "favoriteInstrument" : "voix",
        "band" : "",
        "instruments" : [
            "voix"
        ]
    },

    /* 2 */
    {
        "firstname" : "Kevin",
        "lastname" : "Wasserman",
        "favoriteInstrument" : "guitare",
        "band" : "",
        "instruments" : [
            "guitare"
        ]
    },

    /* 3 */
    {
        "firstname" : "Greg",
        "lastname" : "K",
        "favoriteInstrument" : "guitare basse",
        "band" : "",
        "instruments" : [
            "guitare basse",
            "guitare"
        ]
    },

    /* 4 */
    {
        "firstname" : "Pete",
        "lastname" : "Parada",
        "favoriteInstrument" : "batterie",
        "band" : "",
        "instruments" : [
            "batterie"
        ]
    },

    /* 5 */
    {
        "firstname" : "John",
        "lastname" : "Lennon",
        "favoriteInstrument" : "guitare",
        "band" : "",
        "instruments" : [
            "guitare",
            "piano"
        ]
    },

    /* 6 */
    {
        "firstname" : "Paul",
        "lastname" : "McCartney",
        "favoriteInstrument" : "guitare",
        "band" : "",
        "instruments" : [
            "guitare",
            "guitare basse",
            "piano",
            "batterie"
        ]
    },

    /* 7 */
    {
        "firstname" : "George",
        "lastname" : "Harrison",
        "favoriteInstrument" : "guitare",
        "band" : "",
        "instruments" : [
            "guitare",
            "guitare basse",
            "piano"
        ]
    },

    /* 8 */
    {
        "firstname" : "Ringo",
        "lastname" : "Starr",
        "favoriteInstrument" : "batterie",
        "band" : "",
        "instruments" : [
            "batterie",
            "voix",
            "piano"
        ]
    },

    /* 9 */
    {
        "firstname" : "toto",
        "lastname" : "tata",
        "favoriteInstrument" : "batterie",
        "band" : "",
        "instruments" : [
            "batterie",
            "voix",
            "piano"
        ]
    }
];

var bands = [
    /* 1 */
    {
        "logo" : "https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/012013/the_offspring.png?itok=jISY5A2T",
        "name" : "The Offspring",
        "description" : "The Offspring est un groupe de punk rock américain, originaire du Comté d'Orange, en Californie. Formé en 1984, il comprend actuellement Dexter Holland au chant et à la guitare rythmique, Greg K à la basse et aux chœurs, de Noodles à la guitare solo et aux chœurs, et de Pete Parada à la batterie, en remplacement de leur batteur historique Ron Welty.",
        "members" : [
        ],
        "location" : {
            "latitude" : 0,
            "longitude" : 0
        }
    },

    /* 2 */
    {
        "logo" : "https://upload.wikimedia.org/wikipedia/commons/d/df/The_Beatles_official_logo.svg?uselang=fr",
        "name" : "The Beatles",
        "description" : "The Beatles est un groupe de rock britannique, originaire de Liverpool, en Angleterre. Formé en 1960, et composé de John Lennon, Paul McCartney, George Harrison et Ringo Starr, il est considéré le groupe de rock le plus populaire et influent de l'histoire. En dix ans d'existence et seulement huit ans de carrière discographique (de 1962 à 1970), les Beatles ont enregistré douze albums originaux et ont composé plus de 200 chansons. Influencés par le skiffle, la musique beat et le rock'n'roll des années 1950, ils ont rapidement fait évoluer leur style musical, abordant des genres aussi variés que la pop, la musique indienne, le rock psychédélique et le hard rock. Leurs expérimentations techniques et musicales, leur popularité mondiale et leur conscience politique grandissante au fil de leur carrière, ont étendu l'influence des Beatles au-delà de la musique, jusqu'aux révolutions sociales et culturelles de leur époque.",
        "members" : [
        ],
        "location" : {
            "latitude" : 0,
            "longitude" : 0
        }
    }
];

var researchs = [
    /* 1 */
    {
        "description": "Hey ! On cherche un pianiste",
        "instruments": [
            "piano",
            "guitare"
        ],
        "band": "The Offspring"
    }
];

// ---------- ---------- ---------- ---------- ---------- ---------- ---------- ---------- ---------- db connexion
conn = new Mongo();
db = conn.getDB("mybanddb");

// ---------- ---------- ---------- ---------- ---------- ---------- ---------- ---------- ---------- insert instruments
db.instruments.insert(instruments);

// ---------- ---------- ---------- ---------- ---------- ---------- ---------- ---------- ---------- insert users
db.users.insert(users);

// update users instruments
for (i = 0; i < users.length; i++) {
    // favorit instrument
    // get good favorite instrument id
    fInstru = db.instruments.findOne({"name" : users[i].favoriteInstrument});
    // set favorit instrument
    db.users.findOneAndUpdate({ "firstname" : users[i].firstname, "lastname" : users[i].lastname}, { $set: {"favoriteInstrument" : fInstru._id.valueOf()} });

    // all instruments
    userInstruments = users[i].instruments;
    // remplace name by id
    for (j = 0; j < userInstruments.length; j++) {
        userInstruments[j] = db.instruments.findOne({"name" : userInstruments[j]})._id.valueOf();
    }
    //change in users
    db.users.findOneAndUpdate({ "firstname" : users[i].firstname, "lastname" : users[i].lastname}, { $set: {"instruments" : userInstruments} });
}

// get users id
usersID = [new Array(4), new Array(4)];
usersCursor = db.users.find({});
i = 0;
j = 0;
while (usersCursor.hasNext()) {
    user = usersCursor.next();
    usersID[j][i%4] = user._id.valueOf();
    i++;
    if (i == 4)
        j = 1;
}

// insert users id into bands
for (i = 0; i < bands.length; i++) {
    bands[i].members = usersID[i];
}

// ---------- ---------- ---------- ---------- ---------- ---------- ---------- ---------- ---------- insert bands
db.bands.insert(bands);

// update users with band
j = 0
for (i = 0; i < users.length; i++) {
    // find id band
    idBand = db.bands.findOne({"name" : bands[j].name});
    // update user
    db.users.findOneAndUpdate({ "firstname" : users[i].firstname, "lastname" : users[i].lastname}, { $set: {"band" : idBand._id.valueOf()}});
    if (i == 4)
        j = 1;
}

// ---------- ---------- ---------- ---------- ---------- ---------- ---------- ---------- ---------- insert research
db.researchs.insert(researchs);

researchsCursor = db.researchs.find({});
// update researchs
while (researchsCursor.hasNext()) {
    // change band
    research = researchsCursor.next();
    idBand = db.bands.findOne({"name" : research.band});
    db.researchs.findOneAndUpdate({"_id" : research._id}, { $set: {"band" : idBand._id.valueOf()} });

    // change instruments
    // all instruments
    researchInstruments = research.instruments;
    // remplace name by id
    for (j = 0; j < researchInstruments.length; j++) {
        researchInstruments[j] = db.instruments.findOne({"name" : researchInstruments[j]})._id.valueOf();
    }
    //change in research
    db.researchs.findOneAndUpdate({"_id" : research._id}, { $set: {"instruments" : researchInstruments} });

}
