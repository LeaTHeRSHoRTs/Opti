import { after, before, hasText, hidden, parent, styles, visible } from "./transformers";

export type Processor = (el: Element | null) => Element | Query.PseudoElement | null;
export type RefinerFactory = (el: Element | null, ...args: string[]) => Processor;
export function transformQuery(query: string): [string, Processor[]] {
  let queryString = query;
  const processors: RefinerFactory[] = [];

  function transform(regex: RegExp, transformer: (...matches: string[]) => string): void {
    queryString = queryString.replace(regex, (_, ...args: unknown[]) => {
      const captures = args.filter((arg): arg is string => typeof arg === 'string');
      return transformer(...captures);
    });
  }

  function extract(regex: RegExp, id: string, refinerFactory: RefinerFactory): void {
    queryString = queryString.replace(regex, (_, ...args) => {
      processors.push(refinerFactory);
      return "\x01" + id + "\x01";
    });
  }

  transform(/([^\s,>+~]+?)?:styles\(([A-Za-z0-9=,()#%.\s:-]+?)\)/, styles);
  transform(/([^\s,>+~]+?)?:parent/, parent);
  transform(/([^\s,>+~]+?)?:visible/, visible);
  transform(/([^\s,>+~]+?)?:hidden/, hidden);

  extract(/::before$/, "before", before);
  extract(/::after$/, "after", after);
  extract(/:has-text\((.+?)\)/, "hasText", (text) => hasText());

  return [queryString, processors];
}