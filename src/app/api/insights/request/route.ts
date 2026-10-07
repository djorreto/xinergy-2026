import { NextResponse } from "next/server";
import { requestInsightDownload } from "@/lib/insights/download";

export async function POST(request: Request) {
  let payload: Parameters<typeof requestInsightDownload>[1] = {};
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      companyWebsite?: string;
      turnstileToken?: string;
      slug?: string;
      locale?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      utmContent?: string;
      utmTerm?: string;
      referrer?: string;
      preview?: boolean;
    };
    payload = body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const result = await requestInsightDownload(request, payload);
  if (!result.ok) {
    const status = result.error === "rate_limited" ? 429 : result.error === "unavailable" ? 503 : 400;
    return NextResponse.json(result, { status });
  }
  return NextResponse.json(result);
}
