import { NextResponse } from "next/server";
import { z } from "zod";
import { formations } from "@/lib/game-data";
import { spinDraftSlot } from "@/lib/game-engine";

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
});

const bodySchema = z.object({
  formationKey: z.string(),
  spinRule: z.enum(["position", "team"]),
  lineup: z.record(z.string(), playerSchema),
});

export async function POST(request: Request) {
  const body = bodySchema.parse(await request.json());
  const formation = formations[body.formationKey];
  if (!formation) {
    return NextResponse.json({ error: "Formasi tidak ditemukan." }, { status: 400 });
  }
  return NextResponse.json(spinDraftSlot({ formation, lineup: body.lineup, spinRule: body.spinRule }));
}
