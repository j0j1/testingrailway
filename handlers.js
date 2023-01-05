const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const sgMail = require('@sendgrid/mail')

//dotenc variables
require("dotenv").config();
const { MONGO_URI, CLUSTER_URI, SENDGRID_API_KEY} = process.env;

//mongo configuration
const { MongoClient } = require("mongodb");
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
const client = new MongoClient(MONGO_URI, options);

//send response to client
const sendMessage = (res, status, data, message="no message provided") => {
    console.log(status)
    return res.status(status).json({ status:status, data:data, message:message })
}

//gets employees from mongodb
const getG4team = async ( req, res ) => {
    try {
    await client.connect();
    const db = client.db("G4_SNTTC");
    console.log("connected!");
    const team = await db.collection("team").find().toArray()
    console.log(team)
    client.close();
    console.log("disconnected!");

    sendMessage(res, 200, team, "get team success")
    } catch (err) {
        sendMessage( res, 400, null, "get team error")
    }

};

//gets events from mongodb
const getEvents = async ( req, res ) => {
    try {
        await client.connect();
        const db = client.db("G4_SNTTC");
        const events = await db.collection("events").find().toArray()
        client.close();    
        sendMessage(res, 200, events, "get team success")
    } catch (err) {
        sendMessage( res, 400, null, "get team error")
    }
}

const postEmail = async (req, res) => {
    cors();
    console.log (req.body);
    const text = req.body.message;
    const sender = req.body.email;
    const recipients = ['AdminSupport@g4tc.org', 'AdminSupport@g4tc.org', 'tmanywounds@g4tc.org', 'margododginghorse@g4tc.org', 'CCardinal@g4tc.org', 'AdminSupport@g4tc.org', 'tsimeon@g4tc.org', ]
    const recipient = recipients[req.body.subject];
    const subjects = ['general inquires', 'press/publicity', 'justice', 'health',  'reaching home', 'education', 'child and family services']
    const subject = subjects[req.body.subject]
    console.log(recipients[req.body.subject]);
    console.log(subjects[req.body.subject]);


    sgMail.setApiKey(SENDGRID_API_KEY)
    const msg = {
        to: 'jgabereau@gmail.com', // Change to your recipient
        from: 'g4_contact_emails@g-4.org', // Change to your verified sender
        replyTo: sender,
        subject: `email from G-4 site / ${subject}`,
        text: text,
        html: `<strong>${text}</strong>`,
        }
        sgMail
        .send(msg)
        .then(() => {
            sendMessage(res, 200, "email success")
        })
        .catch((error) => {
            console.error(error);
            sendMessage(res, 400, "email not sent")
        })
        
}

//uploads a new teammember to mongodb
const postTeam = async (req, res) => {    
    try {
        await client.connect();
        const db = client.db("G4_SNTTC");
        const result = await db.collection("team").insertOne(req.body);
        res.status(201).json({ status: 201, data: req.body });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }
    client.close();

};

//uploads new event to mongodb
const postEvent = async (req, res) => {
    try {
        await client.connect();
        const db = client.db("G4_SNTTC");
        const result = await db.collection("events").insertOne(req.body);
        res.status(201).json({ status: 201, data: req.body });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, data: req.body, message: err.message });
    }
    client.close();

}

//removes employee from mongodb
const deleteTeam = async (req, res) => {
    const _id_ = req.params;
    console.log(_id_)
    try {
        await client.connect();
        const db = client.db("G4_SNTTC");
        const team = db.collection("team")

        const query = _id_
        const result = await team.deleteOne(query);
        if (result.deletedCount === 1) {
            sendMessage(res, 200, "null", "team-mate deletd")
          } else {
            sendMessage(res, 400, "null", "teamMate could not be deleted")
          }
        } finally {
          await client.close();
        }
    client.close();
}

//changes information of employee in mongodb
const updateTeam = async (req, res) => {
    const teamId = req.params;
    let valuesToChange;
    console.log(teamId)
    console.log(req.body)
    if (!req.body.form){
        valuesToChange = req.body
    } else {
        valuesToChange = req.body.form
    }
    console.log(valuesToChange)
    try {
        await client.connect();
        const db = client.db("G4_SNTTC");
        const team = db.collection("team")
        // create a filter for a team member to update
        const filter = teamId;
        // this option instructs the method to create a document if no documents match the filter
        const options = { upsert: true };
        // create a document that sets the values to be changed
        const updateDoc = {
            $set: valuesToChange,
        };
        const result = await team.updateOne(filter, updateDoc, options);
        console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        );

        if (result.modifiedCount === 1) {
            sendMessage(res, 200, "null", "team-mate updated")
        } else {
            sendMessage(res, 400, "null", "teamMate could not be updated")
        }
    } finally {
        await client.close();
    }
}

//validates admin sign in
const postSignIn = async(req, res) => {
    console.log(req.body);
    const username = encodeURIComponent(req.body.userName);
    const password = encodeURIComponent(req.body.password);
    const cluster = encodeURIComponent(CLUSTER_URI);
    const authMechanism = "DEFAULT"
    const uri =  `mongodb+srv://${username}:${password}@${cluster}/?authMechanism=${authMechanism}`;
    const client = new MongoClient(uri);
    try {
        // Establish and verify connection
        await client.db("admin").command({ ping: 1 });
        sendMessage(res, 200, "login sucess")
    } catch(err) {
        sendMessage(res, 400, "login failure")
    } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
            }

}

const helloWorld = (req, res) => {
    sendMessage(res, 200, "null", "hello gorgeous")
}


module.exports = {
    getG4team,
    getEvents,
    postEmail,
    postTeam,
    postEvent,
    deleteTeam,
    updateTeam,
    postSignIn,
    helloWorld
};