import fs from "fs";
import path from "path";
import { styleText } from "util";

function inferCommand<const A extends WideArgs, const F extends WideFlags>(obj: Command<A, F>): Command<A, F> {
  return obj;
}

function partition<T>(arr: T[], callback: (value: T, index: number, array: T[]) => boolean): [T[], T[]] {
  const res: [T[], T[]] = [[], []];
  arr.forEach((value, index, array) => { res[callback(value, index, array) ? 0 : 1].push(value); });
  return res;
}

function log(indent: number = 0, arg?: string): void {
  if (indent <= 0 || !arg) {
    console.log(arg || "");
  } else {
    const pad = " ".repeat(Math.max(0, indent));

    console.log(pad + arg);
  }
}

function wordWrap(lines: string[], word: string | true) {
  const WRAP_LIMIT = 80;

  if (word === true) return [];

  const i = lines.length - 1;
  const canFit = (lines[i].length + word.length + 1) <= WRAP_LIMIT;

  return canFit
    ? (lines[i] += (lines[i] ? " " : "") + word, lines)
    : [...lines, word];
}

function help(obj: Command<WideArgs, WideFlags>[], raw: string[]) {
  // (opti help) [cmd]
  const specificCommandName = raw[0];

  log();
  if (!specificCommandName) {
    // No specific help requested (just opti help)
    log();
    log(0, styleText(["whiteBright", "italic"], `Type ${styleText(["bold"], 'opti help <command>')} for more information about a specific command`));
    log(0, "Command-line options for Opti:");

    for (const cmd of obj) {
      log(2, `${cmd.name.padEnd(20)}` + cmd.desc);
    }

    log();
  } else {
    const cmd: Command<WideArgs, WideFlags> | undefined = obj.find(v => v.name === specificCommandName);
    if (cmd) {
      log(0, styleText(["whiteBright", "italic"], `Detailed Help: ${styleText(["bold"], specificCommandName)}`));

      // This is a parameter that can be verified using the values array
      if (!cmd.args.find(v => v.values.length > 1)) {
        raw.forEach((val, i) => {
          if (cmd.args[i].values.some(v => v === val)) {

          }
        });
      }

      const argList = cmd.args.map(v => {
        const newDesc = v.desc
          .split(' ')
          .reduce(wordWrap, [""]);

        const newArgList = v.values.reduce(wordWrap, [""]);

        if (v.optional) {
          return { arg: "[" + v.placeholder + "]", lines: newDesc, original: newArgList };
        } else {
          return { arg: "<" + v.placeholder + ">", lines: newDesc, original: newArgList };
        }
      });

      const formattedArgs = argList.map(v => v.arg).join(" ");

      log(2, `opti ${specificCommandName} ${formattedArgs}`);
      log();
      if (argList.length > 0) {
        log(2, styleText(["whiteBright", "italic"], "Arguments:"));
        for (const argName of argList) {
          log(4, `${argName.arg.padEnd(15)}${argName.lines.join("\n".padEnd(20))}`);

          for (let i = 0; i < (argName.original).length; i++) {
            log(21, styleText(["whiteBright", "italic"], `${i === 0 ? "Possible Values: [" : ""}${argName.original[i].replace(/ /g, ", ")}${i === argName.original.length - 1 ? "]" : ""}`));
          }
        }
      }

      if (cmd.flags.length > 0) {
        log(2, styleText(["whiteBright", "italic"], "Options:"));
        for (const flag of cmd.flags) {
          log(4, `${((flag.alias ? flag.alias + ", " : "") + flag.name).padEnd(40)}${flag.desc.split(" ").reduce(wordWrap, [""]).join("\n".padEnd(45))}`);
        }
      }
    } else {
      console.error("Invalid option. Valid options are: " + obj.map(v => v.name).join(", "));
    }
  }
}

function iFail(obj: Command<WideArgs, WideFlags>[], cmd: string, message: string, err: boolean): never {
  console.error(styleText([err ? "redBright" : "yellowBright", "bold"], err ? "Error:" : "Warning:"));
  console.error(styleText([err ? "redBright" : "yellowBright", "bold"], message));
  help(obj, ["help", cmd]);
  
  process.exit(1);
}

function fail(obj: Command<WideArgs, WideFlags>[], cmd: string, message: string) {
  iFail(obj, cmd, message, true);
}

function warn(obj: Command<WideArgs, WideFlags>[], cmd: string, message: string) {
  iFail(obj, cmd, message, false);
}

function parseCommands(obj: Command<WideArgs, WideFlags>[], raw: string[] = process.argv.slice(2)): void {
  const command = raw[0];

  if (command === "help" || !command) {
    help(obj, raw);
  } else {
    for (const { name, args, flags, callback } of obj) {
      if (name === command) {
        const [inputArgs, inputFlags] = partition(raw.slice(1), v => !v.includes("-"));
        const finalArgs: (string | undefined)[] = [];
        const finalFlags: string[] = [];

        args.forEach((arg, idx) => {
          const val = inputArgs[idx];
          console.log(val);

          function isConstrainedArg(iarg: WideArgs[number]): iarg is WideArgs<string[]>[number] {
            return !(iarg.values.length === 1 && iarg.values[0] === true);
          }

          // Handle missing values
          if (val === undefined) {
            if ("default" in arg || arg.optional) {
              finalArgs.push(arg.default);
              return;
            }
            fail(obj, name, `Argument for '${styleText(["italic"], arg.placeholder)}' is missing.`);
          }

          // Handle invalid values
          if (isConstrainedArg(arg) && !arg.values.includes(val)) {
            fail(obj, name, `Invalid value '${val}' for '${arg.placeholder}'. Allowed: ${arg.values.join(", ")}`);
          }

          finalArgs.push(val);
        });

        inputFlags.forEach(flag => {
          if (flags.some(v => v.name === flag)) {
            finalArgs.push(flag);
          } else {
            console.error(styleText(["yellowBright", "bold"], "Warning:"));
            console.error(styleText(["yellowBright", "bold"], `Unknown flag '${styleText(["italic"], flag)}' passed`));
            help(obj, raw);
            process.exit(1);
          }
        });

        callback(finalArgs as MapToValues<WideArgs>, finalFlags);
        return;
      }
    }
  }
}

export function run(raw: string[]): void {
  parseCommands([
    inferCommand({
      name: "init",
      desc: "Initializes the project with opti imports",
      args: [],
      flags: [{
        name: "",
        desc: "",
        alias: "-"
      }],
      callback(args, flags) {
        
      }
    }),
    inferCommand({
      name: "explain",
      desc: "Explains the features opti adds, from main and sub-modules",
      args: [
        {
          optional: false,
          values: ["core", "crafty", "query", "unsync", "requests", "flow", "everything"],
          placeholder: "target",
          desc: "The submodule who's features should be printed."
        },
        {
          optional: true,
          values: [true],
          placeholder: "feature",
          desc: "The specific feature to search for within a module/submodule."
        }
      ],
      flags: [],
      callback(args) {
        if (args.length === 1) {
          const contents: JSONFileContent = JSON.parse(fs.readFileSync(path.resolve("assets", args[0] + ".json"), "utf-8"));
          log(0, styleText(["bold"], `Features of ${args[0]}:`));
          for (const [item, arr] of Object.entries(contents)) {
            log(2, item);
          }
          log(0, styleText(["italic"], `Type ${styleText(["bold"], `opti explain ${args[0]} <feature>`)} for more specific information about a feature`));
        }
      }
    }),
    inferCommand({
      name: "where",
      desc: "Locates where opti is used in the project",
      args: [
        {
          optional: true,
          values: [true],
          placeholder: "feature",
          desc: ""
        }
      ],
      flags: [],
      callback(args, flags) {

      }
    }),
    inferCommand({
      name: "suggest",
      desc: "Suggests opti-native feature replacements and preferred coding styles",
      args: [],
      flags: [
        { name: "--apply", desc: "Apply all of opti's suggestions, except for replacements that require imports", alias: "-a" },
        { name: "--apply-import-replacements", desc: "Apply all of opti's suggestions that require imports from other submodules" },
        { name: "--apply-preferred", desc: "Apply all of opti's preferences (e.g Exceptions instead of throwing anything)" },
        { name: "--apply-careful", desc: "Same as apply, but only using the opti.opt module with initializers" },
        { name: "--apply-replacements", desc: "Apply of opti's suggestions that replace base js functionality with opti functionality", alias: "-r" }
      ] as const,
      callback(_, flags) {
        log(0, "flags: " + flags);
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
  ], (raw ?? "").slice(2));
}

run(process.argv);