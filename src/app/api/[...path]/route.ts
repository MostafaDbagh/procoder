import type { NextRequest } from "next/server";
import {
 forwardStemBeApi,
 segmentsFromPathnameOrParams,
} from "@/lib/api-proxy";

type Ctx = { params: Promise<{ path?: string | string[] }> };

async function handle(req: NextRequest, ctx: Ctx) {
 const params = await ctx.params;
 const segments = segmentsFromPathnameOrParams(req, params.path);
 return forwardStemBeApi(req, segments);
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
