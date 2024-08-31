import { parentPort, workerData } from 'worker_threads';
import dataService from '../services/dataService';

interface WorkerData {
  urls: string[];
}

interface PhenotypeCount {
  [key: string]: number;
}

async function processUrls(urls: string[]): Promise<PhenotypeCount> {
  const phenotypeCounts: PhenotypeCount = {};

  for (const url of urls) {
    try {
      const patientData = await dataService.fetchPatientData(url);
      console.log('🚀 ~ processUrls ~ patientData:', patientData);

      // Assuming patientData is an array of phenotypes
      for (const phenotype of patientData) {
        const key = phenotype.description; // Use ICD9 or ICD10 description as key
        phenotypeCounts[key] = (phenotypeCounts[key] || 0) + 1;
      }
    } catch (error) {
      console.error(`Error processing URL ${url}:`, (error as Error).message);
    }
  }

  return phenotypeCounts;
}

async function runWorker() {
  const { urls } = workerData as WorkerData;
  const result = await processUrls(urls);
  parentPort?.postMessage(result);
}

runWorker();
