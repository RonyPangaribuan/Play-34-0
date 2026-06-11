import { NextResponse } from "next/server";
import { z } from "zod";
import { simulateSeason } from "@/lib/game-engine";

const playerSchema = z.object({
  id: z.string(),
  name: z.string(),
  team: z.string(),
  season: z.string(),
  group: z.enum(["GK", "DEF", "MID", "FWD"]),
  attack: z.number(),
  defense: z.number(),
  creative: z.number(),
  stamina: z.number(),
  dataStatus: z.enum(["verified", "manual", "generated"]).default("manual"),
  generated: z.boolean().optional(),
});

const bodySchema = z.object({
  lineup: z.record(z.string(), playerSchema),
  ratingMode: z.enum(["season", "prime"]).optional(),
  seed: z.string().optional(),
});

export async function POST(request: Request) {
  const body = bodySchema.parse(await request.json());
  return NextResponse.json(simulateSeason(body.lineup, body.ratingMode, body.seed));
}
