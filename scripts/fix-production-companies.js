const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('../db/movies.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to the movies database.');
});

// Function to process and update JSON
function updateProductionCompanies() {
    // Select rows with potential escaped double quotes
    db.all(`SELECT movieId, productionCompanies FROM movies WHERE json_valid(productionCompanies) = 0;`, [], (err, rows) => {
        if (err) {
            console.error('Error querying database:', err.message);
            return;
        }

        let updateCount = 0;

        // Process each row
        rows.forEach((row) => {
            const { movieId, productionCompanies } = row;
            let validJson = productionCompanies.replace(/(?<=:\s*"[^"]*)"(?!\s*[,}])/g, "'");
            validJson = validJson.replace(/(?<=:\s*"[^"]*)"(?!\s*[,}])/g, "'");
            validJson = validJson.replace(/\\xa0/g, "")
            db.run(
                `UPDATE movies SET productionCompanies = ? WHERE movieId = ?`,
                [validJson, movieId],
                (updateErr) => {
                    if (updateErr) {
                        console.error(`Error updating row ${movieId}:`, updateErr.message);
                    } else {
                        console.log(`Updated row ${movieId} with new JSON`);
                        updateCount++;
                    }
                }
            );
        });
    });
}

// Run the update
updateProductionCompanies();