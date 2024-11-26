import { FileView, TFile, WorkspaceLeaf } from 'obsidian';
import Viewer from './Viewer.svelte';
import { mount, unmount } from 'svelte';
export const LEXICANTER_VIEW = 'lexicanter-view';

export class LexicanterView extends FileView {
  viewer: Viewer | undefined;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  canAcceptExtension(extension: string): boolean {
    return extension === 'lexc';
  }

  getViewType() {
    return LEXICANTER_VIEW;
  }

  getDisplayText() {
    return this.file?.basename ?? 'Lexicanter';
  }

  async onLoadFile(file: TFile) {

    const lang = JSON.parse(await this.app.vault.cachedRead(file));
    const props = $state({ lang: lang });
    this.viewer = mount(Viewer, {
      target: this.contentEl, props,
    });
  }

  async onClose() {
    if (this.viewer) {
      unmount(this.viewer);
    }
  }
}
