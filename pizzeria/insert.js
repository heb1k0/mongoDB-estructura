var mongo = require("mongodb").MongoClient;

var url = "mongodb://localhost:27017";
mongo.connect(url, async (err, client) => {
  if (err) return err;
  console.log("Connect");
  var db = client.db("pizzeria");
  db.dropDatabase();
  db.createCollection("provincia");
  db.createCollection("localitat");
  db.createCollection("cat_pizzas");
  db.createCollection("productes");
  db.createCollection("empleats");
  db.createCollection("client");
  db.createCollection("posicio");
  db.createCollection("botiga");
  db.createCollection("comandes");

  let resultPronvicia = await db
    .collection("provincia")
    .insertOne({ nom: "Tarragona" }, { nom: "Barcelona" });
  let localitats = await db.collection("localitat").insertMany([
    {
      nom: "Salou",
      provincia: resultPronvicia.insertedIds[0],
    },
    {
      nom: "Palleja",
      provincia: resultPronvicia.insertedIds[1],
    },
  ]);

  let resultCat = await db.collection("cat_pizzas").insertMany([
    {
      nom: "Cat1",
    },
    {
      nom: "Cat2",
    },
  ]);

  let productes = await db.collection("productes").insertMany([
    { nom: "Pizza1", preu: 10, cat_pizzas: resultCat.insertedIds[0] },
    { nom: "Pizza2", preu: 20, cat_pizzas: resultCat.insertedIds[1] },
  ]);


  let resulPos = await db.collection("posicio").insertMany([{ nom: "cuiner" }, { nom: "repartidor" }]);

  let empleats = await db.collection("empleats").insertMany([
        {
          nom:"Alejandro", 
          cognom:"Garcia", 
          nif:"31311313A",
          telefon:"4525225",
          posicio: resulPos.insertedIds[0]
        }, 
        {
            nom:"Carlos", 
            cognom:"Perez", 
            nif:"31311313b",
            telefon:"453125225", 
            posicio: resulPos.insertedIds[1]
        }
    ]);

  let botiga = await db.collection("botiga").insertOne(
      { nom:"Pizzeria Juan",
        adreca:{
            adreca:"Carrer dos",
            cp: "0933",
            locatitat: localitats.insertedIds[0],
            telefon:"45251325",
        },
        empleats:[empleats.insertedIds[0]]
    },
  );

  let clientes = await db.collection("client").insertOne(
        { 
          nom:"Juan", 
          cognom:"Garcia",
          adreca:{
            adreca:"Carrer tres",
            cp: "0933",
            localitat: localitats.insertedIds[0],
            telefon:"3131314313"
          },
          comandes:[]
        
        },
  )

  let comandes = await db.collection("comandes").insertOne(

    { client:clientes.insertedIds[0],
      entraga: "domicili",
      repartidos:empleats.insertedIds[0], 
      productes: [{producte: productes.insertedIds[0], quantitat: 2}],
      preu: 10,
      botiga: botiga.insertedIds[0]
    }
      
  );

  await db.collection("clients").updateOne({_id: clientes.insertedIds[0]}, {$push: {comandes: comandes.insertedIds[0]}});
  client.close();


});
