import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

let cachedDataset = null;

const normalizeSymptom = (value) => String(value || '').trim().toLowerCase();

const tokenizeSymptoms = (symptomsText) => {
    return String(symptomsText || '')
        .split(',')
        .map(normalizeSymptom)
        .filter(Boolean);
};

const resolveDatasetPath = () => {
    const envPath = process.env.CLASSIFIER_DATASET_PATH;

    if (envPath) {
        return path.resolve(process.cwd(), envPath);
    }

    return path.resolve(process.cwd(), '..', 'Healthcare_5000_with_Specialist.csv');
};

const loadDataset = () => {
    if (cachedDataset) {
        return cachedDataset;
    }

    const datasetPath = resolveDatasetPath();

    if (!fs.existsSync(datasetPath)) {
        throw new Error(`Classifier dataset not found at path: ${datasetPath}`);
    }

    const csvRaw = fs.readFileSync(datasetPath, 'utf-8');
    const rows = parse(csvRaw, {
        columns: true,
        skip_empty_lines: true,
        relax_quotes: true
    });

    cachedDataset = rows
        .filter((row) => row.Symptoms && row.Specialist)
        .map((row) => ({
            specialist: String(row.Specialist).trim(),
            symptomTokens: tokenizeSymptoms(row.Symptoms)
        }))
        .filter((entry) => entry.specialist && entry.symptomTokens.length > 0);

    return cachedDataset;
};

export const classifySpecialistFromSymptoms = ({ symptoms }) => {
    const dataset = loadDataset();
    const inputTokens = tokenizeSymptoms(symptoms);

    if (inputTokens.length === 0) {
        throw new Error('At least one symptom is required.');
    }

    const inputSet = new Set(inputTokens);
    const specialistScores = new Map();

    for (const row of dataset) {
        const rowSet = new Set(row.symptomTokens);
        let overlap = 0;

        for (const token of rowSet) {
            if (inputSet.has(token)) {
                overlap += 1;
            }
        }

        if (overlap === 0) {
            continue;
        }

        const unionSize = new Set([...inputSet, ...rowSet]).size;
        const jaccard = unionSize > 0 ? overlap / unionSize : 0;
        const overlapRatio = overlap / inputSet.size;
        const combinedScore = (jaccard * 0.6) + (overlapRatio * 0.4);

        const current = specialistScores.get(row.specialist) || { sum: 0, count: 0, best: 0 };
        current.sum += combinedScore;
        current.count += 1;
        current.best = Math.max(current.best, combinedScore);
        specialistScores.set(row.specialist, current);
    }

    if (specialistScores.size === 0) {
        return {
            predictedSpecialist: 'General Physician',
            confidence: 0.2,
            matches: []
        };
    }

    const ranked = [...specialistScores.entries()]
        .map(([specialist, score]) => {
            const average = score.sum / score.count;
            const finalScore = (score.best * 0.7) + (average * 0.3);
            return { specialist, score: finalScore };
        })
        .sort((a, b) => b.score - a.score);

    const top = ranked[0];
    const topThree = ranked.slice(0, 3).map((item) => ({
        specialist: item.specialist,
        score: Number(item.score.toFixed(4))
    }));

    return {
        predictedSpecialist: top.specialist,
        confidence: Number(Math.min(0.99, Math.max(0.2, top.score)).toFixed(4)),
        matches: topThree
    };
};

