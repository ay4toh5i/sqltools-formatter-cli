import { parseArgs } from "https://deno.land/std@0.207.0/cli/mod.ts";
import { expandGlob } from "https://deno.land/std@0.207.0/fs/mod.ts";
import formatter from "npm:@sqltools/formatter@1.2.5";

function parseInteger(i: string | undefined, defaultValue: number): number {
  if (i === undefined) {
    return defaultValue;
  }

  const n = Number(i);

  if (isNaN(n)) {
    throw new Error("value must be integer.");
  }

  return n;
}

const flags = parseArgs(Deno.args);

const options: Parameters<typeof formatter.format>[1] = {
  language: flags["language"] ?? "sql",
  indent: flags["indent"],
  reservedWordCase: flags["reservedWordCase"] ?? "upper",
  linesBetweenQueries: parseInteger(flags["linesBetweenQueries"], 2),
};

const targets = flags._;

for (const target of targets) {
  if (typeof target !== "string") {
    console.error("target must be specified.");
    Deno.exit(1);
  }

  for await (const entry of expandGlob(target)) {
    const text = await Deno.readTextFile(entry.path);

    const formatted = formatter.format(text, options) + "\n";

    if (text !== formatted) {
      console.log(entry.path);
      await Deno.writeTextFile(entry.path, formatted);
    }
  }
}
