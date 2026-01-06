import fs from "fs";
import { styleText } from "util";

type WideArgs = Readonly<{ optional: boolean; values: (string | true)[] }>[];
type WideFlags = readonly string[];

interface JSONFileContent {
  [key: string]: string[]
}

interface Command<A extends WideArgs, F extends WideFlags> {
  readonly name: string;
  readonly desc: string;
  readonly args: A
  readonly flags: F,
  callback(
    args: string[],
    flags: string[],
  ): void;
}

function inferCommand<const A extends WideArgs, const F extends WideFlags>(obj: Command<A, F>): Command<A, F> {
  return obj;
}

function parseCommands(obj: Command<WideArgs, WideFlags>[]): void {
  const raw = process.argv.splice(2);
  const command = raw[0];

  if (command === "help" || !command) {
    const specificCommandName = raw[1];

    console.log();
    if (!specificCommandName) {
      // No specific help requested
      console.log();
      console.log(styleText(["whiteBright", "italic"], "Type help <command> for more information about a specific command"));
      console.log("Command-line options for Opti:");

      for (const cmd of obj) {
        console.log(`  ${cmd.name.padEnd(20)}`, cmd.desc);
      }

      console.log();
    } else {
      // Specific help requested
      console.log();
      console.log(styleText(["whiteBright", "italic"], `Type help ${specificCommandName} <feature> for help on ${specificCommandName}`));
    }
  }

  process.exit(1);
}


parseCommands([
  inferCommand({
    name: "explain",
    desc: "Explains the features that opti provides, and shows what features that each submodule of opti adds",
    args: [
      { optional: false, values: ["opti", "crafty", "query", "unsync", "requests", "flow", "everything"] as const },
      { optional: true, values: [true] }
    ],
    flags: [],
    callback(args) {
      if (!args[0]) {
        console.error("Command explain requires at least 1 argument");
        return;
      }

      const contents: JSONFileContent = JSON.parse(fs.readFileSync(args[0] + ".json", "utf-8"));
      for (const [item, arr] of Object.entries(contents)) {
        console.log(item);
        for (const val of arr) {
          console.log(`  ${val}`);
        }
      }
    }
  }),
  inferCommand({
    name: "where",
    desc: "Locates where opti is used in the project",
    args: [
      { optional: true, values: [true] }
    ],
    flags: [],
    callback(args) {

    }
  }),
  inferCommand({
    name: "suggest",
    desc: "Suggests opti-native feature replacements and preferred coding styles",
    args: [],
    flags: [
      "--apply",
      "--applyImportReplacements",
      "--applyPreferred",
      "--applyCareful",
      "--applyReplacements"
    ],
    callback(_, flags) {

    }
  }),
  inferCommand({
    name: "init",
    desc: "Initializes an opti project",
    args: [],
    flags: [],
    callback() {

    }
  })
]);