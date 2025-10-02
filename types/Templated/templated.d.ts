type TemplatedImports = Record<string, unknown>

type TemplatedDoc = HTMLDocument | null;

interface Templated {
  render(document: TemplatedDocument): void;
  render(section: TemplatedSection, selector: string): void;
}

interface TemplatedEvent {
  preventDefault(): void;
}

declare abstract class TemplatedComponent {
  document: TemplatedDocument;
  abstract imports: TemplatedImports;
  abstract onRender(callback: (e: TemplatedRenderEvent) => void): void
  abstract onUpdate(callback: (e: TemplatedUpdateEvent) => void): void
  abstract onDelete(callback: (e: TemplatedDeleteEvent) => void): void
}

interface TemplatedDocument extends TemplateComponent {

}

interface TemplatedElement extends TemplateComponent {

}

interface TemplatedSection extends TemplateComponent {

}

interface OptiDOM {
  readonly imports: DOMVars
  bind(vars: DOMVars): this;
}

interface OptiObject {
  templated: true,
};