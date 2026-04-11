import type { NextRequest } from "next/server";
import { forwardStemBeApi } from "@/lib/api-proxy";

type Ctx = { params: Promise<{ rest?: string[] }> };

function segmentsFromRest(rest: string[] | undefined): string[] {
  const tail = Array.isArray(rest) ? rest : [];
  return ["categories", ...tail];
}

async function handle(req: NextRequest, ctx: Ctx) {
  const { rest } = await ctx.params;
  return forwardStemBeApi(req, segmentsFromRest(rest));
}

export async function GET(req: NextRequest, ctx: Ctx) {
  return handle(req, ctx);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  return handle(req, ctx);
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  return handle(req, ctx);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  return handle(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  return handle(req, ctx);
}
