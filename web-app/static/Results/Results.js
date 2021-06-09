////
// variables from sessionStorage
////

const candidate_list = JSON.parse(sessionStorage.candidate_list);
const raw_voting_data = JSON.parse(sessionStorage.votes);

////
// Get document elements
////

const table_div = document.getElementById("ElectionTableContainer");
const election_summary = document.getElementById("ElectionSummary");
const text_box = document.getElementById("StoreText");
const store_button = document.getElementById("StoreButton");

////
// Algorithm functions from server
////


////
// Store Algorithm function outputs in variables
////

// direct Algorithm method outputs
const results = Algorithm.results(raw_voting_data);
const name_of_winner = Algorithm.name_of_winner(raw_voting_data);
const percentage_of_winner = Algorithm.percentage_of_winner(raw_voting_data);
const how_many_rounds = Algorithm.how_many_rounds(raw_voting_data);

// other variable calculation
const draw_can1 = Object.keys(results[results.length - 1])[0];
const draw_can2 = Object.keys(results[results.length - 1])[1];

////
// Results summary string
////

// determine whether round(s) is plural
let round_or_rounds;
if (how_many_rounds === 1) {
    round_or_rounds = "round";
} else {
    round_or_rounds = "rounds";
}

// set textContent of results summary
if (name_of_winner === "DRAW") {
    election_summary.textContent = `The election ended in a draw between ${
        draw_can1} and ${draw_can2}`;
} else {
    election_summary.textContent = `${name_of_winner} won with ${
        percentage_of_winner}% of the vote after ${
            how_many_rounds} ${round_or_rounds}`;
}

////
// Results table
////

// create table element and header

const create_table = function () {

    let results_table = document.createElement("table");
    results_table.id = "results_table";

    let results_table_head = document.createElement("thead");
    results_table_head.id = "results_table_head";

    let results_table_header_row = document.createElement("tr");
    results_table_header_row.id = "results_table_header_row";

    // apply first column "Round #" title label
    let results_header = document.createElement("th");
    results_header.innerText = "Round #";
    results_table_header_row.append(results_header);

    // apply candidate names to header row
    candidate_list.forEach(function (candidate_name) {
        results_header = document.createElement("th");
        results_header.innerText = candidate_name;
        results_table_header_row.append(results_header);
    });

    // append header row to table header group element
    results_table_head.append(results_table_header_row);
    results_table.append(results_table_head);

    // create table body element
    let results_table_body = document.createElement("tbody");
    results_table_body.id = "results_table_body";

    // create table body
    let i;
    for (i = 1; i <= how_many_rounds; i += 1) {

        // create new table row for election round
        let new_row = document.createElement("tr");
        new_row.id = String("row_" + i);

        // create round number cell
        let round_number_cell = document.createElement("td");
        round_number_cell.innerText = i;
        new_row.append(round_number_cell);

        // add results to row
        let j;
        for (j = 1; j <= candidate_list.length; j += 1) {

            // create cell for result
            let cell = document.createElement("td");

            // fill cell with percentage if candidate was present that round
            // leave blank if candidate was already eliminated
            if (results[i - 1].hasOwnProperty(candidate_list[j - 1])) {
                cell.textContent = String(results[i - 1][candidate_list[
                    j - 1]] + " %");
            }

            // add cell to row
            new_row.append(cell);
        }

        // add new row to body
        results_table_body.append(new_row);
    }

    // append tabel body to table
    results_table.append(results_table_body);

    // append table to div
    table_div.append(results_table);
};

window.onload = create_table;

////
// Database storage
////