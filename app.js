// Citation for the following file: app.js
// Date: 02/26/2026
// Adapted from: CS340 Canvas Exploration - Web Application Technology and Exploration - Implementing CUD operations in your app, Node.js code
// Source URL: https://canvas.oregonstate.edu/courses/2031764/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=26243436

// Citation for use of AI Tools:
// Date: 03/12/2026
// Prompts used: How do i auto-populate a form with attributes currently in the database once a user has selected an ID from the dropdown menu. 
// Here is the JS app.post code and handlebar form code. {INSERT_JS_CODE} {INSERT_HANDLEBAR_CODE}
// AI Source URL: google.com/ai 

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

// RESET DATABASE ROUTE
app.get('/reset-database', async function (req, res) {
    try {
        await db.query('CALL sp_ResetDataBase();');
        res.redirect('/');
    } catch (error) {
        console.error('Error resetting database:', error);
        res.status(500).send('An error occurred while resetting the database.');
    }
});

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
        const query1 = `SELECT 
                            m.id_model AS ID, 
                            m.name AS Name, 
                            m.description AS Description,
                            DATE_FORMAT(m.created_date, '%d/%m/%Y') AS "Created On",
                            DATE_FORMAT(m.modified_date, '%d/%m/%Y') AS "Modified On",
                            m.file_path AS "File Path", 
                            m.is_active AS Active, 
                            mat.name AS Material,
                            m.id_material AS MaterialID, 
                            text.name AS Texture,
                            m.id_texture AS TextureID
                        FROM 3D_Models m
                        LEFT JOIN Materials mat ON m.id_material = mat.id_material
                        LEFT JOIN Textures text ON m.id_texture = text.id_texture;`;
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
        const query1 = `SELECT
                            id_artist AS ID,
                            first_name AS "First Name",
                            last_name AS "Last Name",
                            email AS Email,
                            phone AS Phone
                        FROM Artists;`;
        const [artists] = await db.query(query1);
        // Render the artists.hbs file, and also send the renderer
        //  an object that contains artists information
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
        const query1 = `SELECT 
                            mat.id_material AS ID, 
                            mat.name AS Name, 
                            mat.description AS Description, 
                            DATE_FORMAT(mat.created_date, '%d/%m/%Y') AS "Created On",
                            DATE_FORMAT(mat.modified_date, '%d/%m/%Y') AS "Modified On", 
                            mat.base_color AS "Base Color", 
                            mat.roughness AS Roughness, 
                            mat.metallic AS Metallic, 
                            mat.transparency AS Transparency, 
                            mat.file_path AS "File Path", 
                            CONCAT(a.first_name, ' ', a.last_name) AS Artist,
                            mat.id_artist AS ArtistID, 
                            mat.is_active AS Active
                        FROM Materials mat
                        LEFT JOIN Artists a ON mat.id_artist = a.id_artist;`;
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
        const query1 = `SELECT
                            text.id_texture AS ID, 
                            text.name AS Name, 
                            text.description AS Description, 
                            DATE_FORMAT(text.created_date, '%d/%m/%Y') AS "Created On",
                            DATE_FORMAT(text.modified_date, '%d/%m/%Y') AS "Modified On", 
                            text.resolution AS Resolution, 
                            text.file_path AS "File Path", 
                            CONCAT(a.first_name, ' ', a.last_name) AS Artist,
                            text.id_artist AS ArtistID,
                            text.is_active AS Active
                        FROM Textures text
                        LEFT JOIN Artists a ON text.id_artist = a.id_artist;`;
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
                            mha.id_model_artist AS ID, 
                            m.name AS Model, 
                            CONCAT(a.first_name, ' ', a.last_name) AS Artist,
                            mha.id_model AS ModelID,
                            mha.id_artist AS ArtistID
                        FROM 3D_Models_Has_Artists mha
                        LEFT JOIN 3D_Models m ON mha.id_model = m.id_model
                        LEFT JOIN Artists a ON mha.id_artist = a.id_artist;`;
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
});

// CREATE ROUTES
app.post('/models/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // If material id or texture id aren't numbers, make them NULL.
        if (isNaN(parseInt(data.create_model_id_material)))
            data.create_model_id_material = null;
        if (isNaN(parseInt(data.create_model_id_texture)))
            data.create_model_id_texture = null;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_CreateModel(?, ?, ?, ?, ?, ?, ?, ?, @new_id);`;

        // Store ID of last inserted row
        const [[[rows]]] = await db.query(query1, [
            data.create_model_name,
            data.create_model_description,
            data.create_model_created_date,
            data.create_model_modified_date,
            data.create_model_file_path,
            data.create_model_is_active,
            data.create_model_id_material,
            data.create_model_id_texture
        ]);

        console.log(`CREATE Model. ID: ${rows.new_id} ` +
            `Name: ${data.create_model_name}`
        );

        // Redirect the user to the updated webpage
        res.redirect('/models');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/artists/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_CreateArtist(?, ?, ?, ?, @new_id);`;

        // Store ID of last inserted row
        const [[[rows]]] = await db.query(query1, [
            data.create_artist_first_name,
            data.create_artist_last_name,
            data.create_artist_email,
            data.create_artist_phone
        ]);

        console.log(`CREATE Artist. ID: ${rows.new_id} ` +
            `Name: ${data.create_artist_first_name} ${data.create_artist_last_name}`
        );

        // Redirect the user to the updated webpage
        res.redirect('/artists');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/materials/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // If artist id isn't a number, make it NULL.
        if (isNaN(parseInt(data.create_material_id_artist)))
            data.create_material_id_artist = null;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_CreateMaterial(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @new_id);`;

        // Store ID of last inserted row
        const [[[rows]]] = await db.query(query1, [
            data.create_material_name,
            data.create_material_description,
            data.create_material_created_date,
            data.create_material_modified_date,
            data.create_material_base_color,
            data.create_material_roughness,
            data.create_material_metallic,
            data.create_material_transparency,
            data.create_material_file_path,
            data.create_material_id_artist,
            data.create_material_is_active
        ]);

        console.log(`CREATE Material. ID: ${rows.new_id} ` +
            `Name: ${data.create_material_name}`
        );

        // Redirect the user to the updated webpage
        res.redirect('/materials');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/textures/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // If artist id isn't a number, make it NULL.
        if (isNaN(parseInt(data.create_texture_id_artist)))
            data.create_texture_id_artist = null;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_CreateTexture(?, ?, ?, ?, ?, ?, ?, ?, @new_id);`;

        // Store ID of last inserted row
        const [[[rows]]] = await db.query(query1, [
            data.create_texture_name,
            data.create_texture_description,
            data.create_texture_created_date,
            data.create_texture_modified_date,
            data.create_texture_resolution,
            data.create_texture_file_path,
            data.create_texture_id_artist,
            data.create_texture_is_active
        ]);

        console.log(`CREATE Texture. ID: ${rows.new_id} ` +
            `Name: ${data.create_texture_name}`
        );

        // Redirect the user to the updated webpage
        res.redirect('/textures');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/model-artist/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our queries
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_CreateModelAndArtist(?, ?, @new_id);`;

        // Store ID of last inserted row
        const [[[rows]]] = await db.query(query1, [
            data.create_model_artist_id_model,
            data.create_model_artist_id_artist
        ]);

        console.log(`CREATE Model-Artist. ID: ${rows.new_id} `);

        // Redirect the user to the updated webpage
        res.redirect('/model-artist');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// UPDATE ROUTES
app.post('/models/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        // If material id or texture id aren't numbers, make them NULL.
        if (isNaN(parseInt(data.update_model_id_material)))
            data.update_model_id_material = null;
        if (isNaN(parseInt(data.update_model_id_texture)))
            data.update_model_id_texture = null;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_UpdateModel(?, ?, ?, ?, ?, ?, ?);';
        const query2 = 'SELECT name FROM 3D_Models WHERE id_model = ?;';
        await db.query(query1, [
            data.update_model_id,
            data.update_model_description,
            data.update_model_modified_date,
            data.update_model_file_path,
            data.update_model_is_active,
            data.update_model_id_material,
            data.update_model_id_texture
        ]);
        const [[rows]] = await db.query(query2, [data.update_model_id]);

        console.log(`UPDATE Model. ID: ${data.update_model_id} ` +
            `Name: ${rows.name}`
        );

        // Redirect the user to the updated webpage data
        res.redirect('/models');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/artists/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_UpdateArtist(?, ?, ?);';
        const query2 = 'SELECT first_name, last_name FROM Artists WHERE id_artist = ?;';
        await db.query(query1, [
            data.update_artist_id,
            data.update_artist_email,
            data.update_artist_phone
        ]);
        const [[rows]] = await db.query(query2, [data.update_artist_id]);

        console.log(`UPDATE Artist. ID: ${data.update_artist_id} ` +
            `Name: ${rows.first_name} ${rows.last_name}`
        );

        // Redirect the user to the updated webpage data
        res.redirect('/artists');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/materials/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        // If artist id isn't a number, make it NULL.
        if (isNaN(parseInt(data.update_material_id_artist)))
            data.update_material_id_artist = null;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_UpdateMaterial(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
        const query2 = 'SELECT name FROM Materials WHERE id_material = ?;';
        await db.query(query1, [
            data.update_material_id,
            data.update_material_description,
            data.update_material_modified_date,
            data.update_material_base_color,
            data.update_material_roughness,
            data.update_material_metallic,
            data.update_material_transparency,
            data.update_material_file_path,
            data.update_material_id_artist,
            data.update_material_is_active
        ]);
        const [[rows]] = await db.query(query2, [data.update_material_id]);

        console.log(`UPDATE Material. ID: ${data.update_material_id} ` +
            `Name: ${rows.name}`
        );

        // Redirect the user to the updated webpage data
        res.redirect('/materials');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/textures/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        // If artist id isn't a number, make it NULL.
        if (isNaN(parseInt(data.update_texture_id_artist)))
            data.update_texture_id_artist = null;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_UpdateTexture(?, ?, ?, ?, ?, ?, ?);';
        const query2 = 'SELECT name FROM Textures WHERE id_texture = ?;';
        await db.query(query1, [
            data.update_texture_id,
            data.update_texture_description,
            data.update_texture_modified_date,
            data.update_texture_resolution,
            data.update_texture_file_path,
            data.update_texture_id_artist,
            data.update_texture_is_active
        ]);
        const [[rows]] = await db.query(query2, [data.update_texture_id]);

        console.log(`UPDATE Texture. ID: ${data.update_texture_id} ` +
            `Name: ${rows.name}`
        );

        // Redirect the user to the updated webpage data
        res.redirect('/textures');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/model-artist/update', async function (req, res) {
    try {
        // Parse frontend form information
        const data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = 'CALL sp_UpdateModelAndArtist(?, ?, ?);';
        await db.query(query1, [
            data.update_model_artist_id,
            data.update_model_artist_id_model,
            data.update_model_artist_id_artist
        ]);

        console.log(`UPDATE Model-Artist. ID: ${data.update_model_artist_id} `);

        // Redirect the user to the updated webpage data
        res.redirect('/model-artist');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// DELETE ROUTES
app.post('/models/delete', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_DeleteModel(?);`;
        await db.query(query1, [data.delete_model_id]);

        console.log(`DELETE Model. ID: ${data.delete_model_id} ` +
            `Name: ${data.delete_model_name}`
        );

        // Redirect the user to the updated webpage data
        res.redirect('/models');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/artists/delete', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_DeleteArtist(?);`;
        await db.query(query1, [data.delete_artist_id]);

        console.log(`DELETE Artist. ID: ${data.delete_artist_id} ` +
            `Name: ${data.delete_artist_name}`
        );

        // Redirect the user to the updated webpage data
        res.redirect('/artists');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/materials/delete', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_DeleteMaterial(?);`;
        await db.query(query1, [data.delete_material_id]);

        console.log(`DELETE Material. ID: ${data.delete_material_id} ` +
            `Name: ${data.delete_material_name}`
        );

        // Redirect the user to the updated webpage data
        res.redirect('/materials');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/textures/delete', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_DeleteTexture(?);`;
        await db.query(query1, [data.delete_texture_id]);

        console.log(`DELETE Texture. ID: ${data.delete_texture_id} ` +
            `Name: ${data.delete_texture_name}`
        );

        // Redirect the user to the updated webpage data
        res.redirect('/textures');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/model-artist/delete', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Create and execute our query
        // Using parameterized queries (Prevents SQL injection attacks)
        const query1 = `CALL sp_DeleteModelAndArtist(?);`;
        await db.query(query1, [data.delete_model_artist_id]);

        console.log(`DELETE Model-Artist. ID: ${data.delete_model_artist_id} `);

        // Redirect the user to the updated webpage data
        res.redirect('/model-artist');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});