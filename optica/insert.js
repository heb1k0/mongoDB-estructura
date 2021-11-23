var mongo = require("mongodb").MongoClient;

var url = "mongodb://localhost:27017";
mongo.connect(url, async (err, client) => {
  if (err) return err;
  console.log("Connecting People XD");
  var db = client.db("optica");
  db.dropDatabase();
  db.createCollection("ulleresbase");
  db.createCollection("proveidors");
  db.createCollection("ulleres_venudes");
  db.createCollection("productes");
  db.createCollection("clients");
  db.createCollection("empleats");

    try{

        let ulleresBase = await db
        .collection("ulleresbase")
        .insertOne(
            { 
                proveidor:null,
                marca:"Falsa"
            }
            
            
        );
    
        let ulleresVenudes = await db.collection("ulleres_venudes").insertOne(
            {
                base_id:ulleresBase.insertedId,
                client_id:null,
                emplead_id:null,
                created_at:new Date(),
                config:{
                    graduacio_izq:0.2,
                    graduacio_der:0.5,
                    montura:"flotant",
                    color_montura:"vermella",
                    color_vidres:null
                
                },
                preu:109.02
            }
        );
    
        let proveidor = await db.collection("proveidors").insertOne(
            {
                nom:"Proveidor fals",
                adreca:{
                    carrec:"Carrer del proviedor fals",
                    num:10,
                    pis:"segona",
                    porta:"B",
                    cp:08001,
                     pais:"Espanya",
                },
                telefon:"123456789",
                fax:"123456789",
                nif:"123456789B",
            
            }
        );
    
        let clien = await db.collection("clients").insertOne(
            {
                 nom:"Client fals",
                 adreca:{
                     adreca:"Carrer del client fals",
                     cp:08001,
                     telefon:"123456789",
                     email:"email@falso.com"
                 },
                 created_at:new Date(),
                 recomenand_id:null,
                 ulleres:[ulleresVenudes.insertedId]
            }
        );
    
        let empleat = await db.collection("empleats").insertOne(
            {
                nom:"Empleat fals",
                telefon:"123456789",
                email:"email@falso.es",
                nif:"123413139B"
            }
        );
        
        await db.collection("ulleresbase").updateOne({_id:ulleresBase.insertedId},{$set:{proveidor:proveidor.insertedId}});
        await db.collection("ulleres_venudes").updateOne({_id:ulleresVenudes.insertedId},{$set:{client_id:clien.insertedId,emplead_id:empleat.insertedId}});

    }catch(err){
        console.log(err);
    }

    

  client.close();


});
