import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appAutoTranslate]'
})
export class AutoTranslateDirective implements OnInit, OnDestroy {

  private langChangeSub!: Subscription;

  constructor(private el: ElementRef, private translate: TranslateService) {}

  ngOnInit() {
    this.translateContent();

    // Jab language change ho to dobara translate kare
    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      this.translateContent();
    });
  }

  private translateContent() {
    const textNodes = this.getTextNodes(this.el.nativeElement);

    textNodes.forEach(node => {
      const originalText = node.originalText || node.nodeValue?.trim();

      if (originalText) {
        node.originalText = originalText; // original save
        this.translate.get(originalText).subscribe(translated => {
          node.nodeValue = translated;
        });
      }
    });
  }

  private getTextNodes(element: HTMLElement) {
    const textNodes: any[] = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue?.trim()) {
        textNodes.push(node);
      }
    }
    return textNodes;
  }

  ngOnDestroy() {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }
}
