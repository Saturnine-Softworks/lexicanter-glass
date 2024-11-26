import { Plugin, WorkspaceLeaf } from 'obsidian';
import { LexicanterView, LEXICANTER_VIEW } from './view.svelte';

export default class LexicanterPlugin extends Plugin {
  async onload() {
    this.registerView(
      LEXICANTER_VIEW,
      (leaf) => new LexicanterView(leaf)
    );

	  this.registerExtensions(['lexc'], LEXICANTER_VIEW);

    this.addRibbonIcon('book-open-text', 'Activate view', () => {
      this.activateView();
    });
  }

  async onunload() {
    this.app.workspace.detachLeavesOfType(LEXICANTER_VIEW);
  }

  async activateView() {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(LEXICANTER_VIEW);

    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getRightLeaf(false) as WorkspaceLeaf;
      await leaf.setViewState({ type: LEXICANTER_VIEW, active: true });
    }

    workspace.revealLeaf(leaf);
  }
}