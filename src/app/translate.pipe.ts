import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private currentLang: string = 'en';
  private subscription: Subscription;

  constructor(
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    this.subscription = this.translationService.currentLang.subscribe(lang => {
      this.currentLang = lang;
      this.cdr.markForCheck();
    });

    this.subscription.add(
      this.translationService.translationUpdates.subscribe(() => {
        this.cdr.markForCheck();  // Trigger Angular to check for updates
      })
    );
  }

  transform(value: string): string {
    if (!value) return '';
    this.translationService.registerKey(value);
    return this.translationService.getTranslation(value, this.currentLang);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
