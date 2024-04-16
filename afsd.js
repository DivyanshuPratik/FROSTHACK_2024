const fs = require('fs');

function readCSV(filePath) {
    const data = [];
    const file = fs.readFileSync(filePath, 'utf-8').split('\n');
    file.forEach(row => {
        const cleanedRow = row.split(',').map(cell => cell.trim()).filter(cell => cell !== '');
        if (cleanedRow.length > 0) {
            data.push(cleanedRow);
        }
    });
    return data;
}
function findMatchingDiseases(dataset, symptomsToFind) {
    const matchingDiseases = [];
    dataset.forEach(row => {
        if (row.slice(1).join(',') === symptomsToFind.join(',')) {
            matchingDiseases.push(row[0]);
        }
    });
    return matchingDiseases;
}

const csvFilePath = 'data/dataset.csv';

let dataset = readCSV(csvFilePath);
dataset = dataset.map(row => row.filter(value => value !== ''));

const symptomsToFind = [ "shivering",	 "chills"	 ,"watering_from_eyes"];

const matchingDiseases = findMatchingDiseases(dataset, symptomsToFind);

console.log("Matching diseases:", matchingDiseases);
