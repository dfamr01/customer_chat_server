import { Worker } from 'worker_threads';
import path from 'path';
import dataService from './dataService';
import { CONCURRENCY } from '../config';

interface PhenotypeCount {
  [key: string]: number;
}

class AnalysisService {
  private async getPatientDataUrls(): Promise<string[]> {
    const urls: string[] = [];
    let offset = 15;
    let hasMore = true;

    try {
      while (hasMore) {
        console.log('🚀 ~ AnalysisService ~ getPatientDataUrls ~ offset:', offset);

        const address = await dataService.getPatientDataAddresses(offset);
        console.log('🚀 ~ AnalysisService ~ getPatientDataUrls ~ address:', address);
        if (!address?.url) {
          hasMore = false;
        } else {
          urls.push(address.url);
          offset = address.offset;
        }
      }
    } catch (e) {
      console.error('Error in getPatientDataUrls', e);
    }

    return urls;
  }

  private createWorker(urls: string[]): Promise<PhenotypeCount> {
    const workerPath = path.resolve(__dirname, '../workers/analysisWorker.ts');
    return new Promise((resolve, reject) => {
      const worker = new Worker(workerPath, {
        workerData: { urls },
        execArgv: ['--require', 'ts-node/register', '--require', 'tsconfig-paths/register'],
      });

      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', code => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  private mergeCounts(countArrays: PhenotypeCount[]): PhenotypeCount {
    return countArrays.reduce((acc, counts) => {
      for (const [key, value] of Object.entries(counts)) {
        acc[key] = (acc[key] || 0) + value;
      }
      return acc;
    }, {} as PhenotypeCount);
  }

  async analyze(): Promise<PhenotypeCount> {
    const urls = await this.getPatientDataUrls();
    const chunkSize = Math.ceil(urls.length / +CONCURRENCY);
    let urlChunks = Array.from({ length: +CONCURRENCY }, (_, i) => urls.slice(i * chunkSize, (i + 1) * chunkSize));
    urlChunks = urlChunks.filter(chunk => chunk.length > 0);
    const workerPromises = urlChunks.map(chunk => this.createWorker(chunk));
    const results = await Promise.all(workerPromises);
    const mergedCounts = this.mergeCounts(results);

    await dataService.sendStatistics(mergedCounts);

    return mergedCounts;
  }
}

export default new AnalysisService();
