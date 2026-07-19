import { orchestrateScan } from "./orchestrator";
import { prisma } from "./prisma";

// Production scale: use BullMQ + Redis to process queues
// Since we are running in local/server hybrid environments, we define a modular queue runner
export interface ScanJob {
  id: string;
  url: string;
  status: "queued" | "active" | "completed" | "failed";
  progress: number;
}

const activeJobs = new Map<string, ScanJob>();

// Async background queue processor fallback
export async function addScanJob(url: string): Promise<ScanJob> {
  const jobId = Math.random().toString(36).substring(7);
  const job: ScanJob = {
    id: jobId,
    url,
    status: "queued",
    progress: 0,
  };

  activeJobs.set(jobId, job);

  // Trigger processing asynchronously in the background (Non-blocking)
  processScanJob(jobId);

  return job;
}

export function getScanJobStatus(jobId: string): ScanJob | undefined {
  return activeJobs.get(jobId);
}

async function processScanJob(jobId: string) {
  const job = activeJobs.get(jobId);
  if (!job) return;

  try {
    job.status = "active";
    job.progress = 10;

    console.log(`[Worker] Starting background audit job ${jobId} for: ${job.url}`);
    
    // Simulate steps for audit tracking
    job.progress = 30;
    const context = await orchestrateScan(job.url);
    job.progress = 70;

    // Run analyzer imports dynamically if needed, or coordinate scan
    // Production database persistence:
    let store = await prisma.store.findUnique({
      where: { url: context.url }
    });

    if (!store) {
      store = await prisma.store.create({
        data: {
          url: context.url,
          domain: context.domain,
          cms: "shopify"
        }
      });
    }

    // Create a scan entry in PostgreSQL
    await prisma.scan.create({
      data: {
        storeId: store.id,
        scores: { overall: 85 }, // simulated score save
        metadata: { themeName: context.shopifyData.themeName },
        modules: {},
        allIssues: [],
        allRecommendations: [],
      }
    });

    job.progress = 100;
    job.status = "completed";
    console.log(`[Worker] Audit job ${jobId} completed successfully.`);
  } catch (err: any) {
    job.status = "failed";
    console.error(`[Worker] Audit job ${jobId} failed:`, err.message);
  }
}
