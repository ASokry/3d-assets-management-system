// ########################################
// ########## SETUP

// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 23423; 

// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/', async function (req, res) {
    try {
        res.render('home'); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});

app.get('/models', async function (req, res) {
    try {
        // Retrieve models plus lists for dropdowns
        const query1 = 'SELECT * FROM 3D_Models;';
        const [models] = await db.query(query1);
        const [materials] = await db.query('SELECT id_material, name FROM Materials;');
        const [textures] = await db.query('SELECT id_texture, name FROM Textures;');
        res.render('models', { models: models, materials: materials, textures: textures });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/artists', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, we use a JOIN clause to display the names of the homeworlds
        const query1 = 'SELECT * FROM Artists;';
        const [artists] = await db.query(query1);
        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('artists', { artists: artists });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/materials', async function (req, res) {
    try {
        // Retrieve materials and artist list for dropdowns
        const query1 = 'SELECT * FROM Materials;';
        const [materials] = await db.query(query1);
        const [artists] = await db.query('SELECT id_artist, first_name, last_name FROM Artists;');
        // Render the view with both datasets
        res.render('materials', { materials: materials, artists: artists });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/textures', async function (req, res) {
    try {
        // Retrieve textures and artist list for dropdowns
        const query1 = 'SELECT * FROM Textures;';
        const [textures] = await db.query(query1);
        const [artists] = await db.query('SELECT id_artist, first_name, last_name FROM Artists;');
        res.render('textures', { textures: textures, artists: artists });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/model-artist', async function (req, res) {
    try {
        // Create and execute our queries
        // In query1, we use JOIN clauses to display model-artist relationships
        const query1 = `SELECT 
                            mha.id_model_artist, 
                            m.name AS model_name, 
                            CONCAT(a.first_name, ' ', a.last_name) AS artist_full_name,
                            mha.id_model,
                            mha.id_artist
                        FROM 3D_Models_Has_Artists mha
                        JOIN 3D_Models m ON mha.id_model = m.id_model
                        JOIN Artists a ON mha.id_artist = a.id_artist;`;
        const [modelArtists] = await db.query(query1);
        const [artists] = await db.query('SELECT id_artist, first_name, last_name FROM Artists;');
        const [models] = await db.query('SELECT id_model, name FROM 3D_Models;');
        // Render the model-artist.hbs file with the relationship data and dropdown info
        res.render('model-artist', { modelArtists: modelArtists, artists: artists, models: models });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});;
// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});