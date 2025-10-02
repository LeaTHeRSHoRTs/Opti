namespace Opti.Templated {
  export class TemplatedParseException extends globalThis.Exception {
    constructor(message?: string, cause?: string) {
      super("TemplatedParseException", message, cause);
    }
  }

  export class Templated {
    static render(docOrSection: TemplatedDocument | TemplatedSection, selector?: string): void {
      throw new globalThis.NotImplementedException();
    }
  }

  export abstract class TemplatedComponent {
    private _file: string = "";
    public document: TemplatedDoc = null;
    public readonly styles = {};
    constructor(file: string) {
      fetch(file)
        .then(async contents => {
          this._file = await contents.text();
        }).catch(e => {
          throw new globalThis.FetchException(e);
        });
    }

    abstract imports: TemplatedImports;
    abstract onRender(e: TemplatedEvent): void;
    abstract onUpdate(e: TemplatedEvent): void;
    abstract onDelete(e: TemplatedEvent): void;

    protected getFile() {
      return this._file;
    }
  }

  export abstract class TemplatedDocument extends TemplatedComponent {
    constructor(file?: string) {
      super(file ?? window.location.pathname);
    }
  }

  export abstract class TemplatedSection extends TemplatedComponent {
    
  }

  export abstract class TemplatedElement extends TemplatedComponent {
    constructor(file: string, public readonly name: string, public readonly args: Record<string, unknown>) {
      super(file);
    }

    hasSlot(): boolean {
      throw new globalThis.NotImplementedException();
    }
  }
}