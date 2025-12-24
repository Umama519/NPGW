    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { BehaviorSubject, Subject } from 'rxjs';

    @Injectable({ providedIn: 'root' })
    export class TranslationService {
      private apiUrl = 'https://api.mymemory.translated.net/get'; // Free API
      private cache = new Map<string, string>();
      private registeredKeys = new Set<string>();
      private currentLang$ = new BehaviorSubject<string>('en');
      currentLang = this.currentLang$.asObservable();

      // Notify when translation cache updates
      translationUpdates = new Subject<void>();

      constructor(private http: HttpClient) {}

      registerKey(key: string) {
        if (key && key.trim()) {
          this.registeredKeys.add(key.trim());
        }
      }

      getTranslation(key: string, lang: string) {
        const cacheKey = this.cacheKey(key, lang);
        return this.cache.has(cacheKey) ? this.cache.get(cacheKey)! : key;
      }

      setLanguage(lang: string) {
        if (lang === this.currentLang$.value) return;
        this.currentLang$.next(lang);
        if (lang === 'en') {
          this.translationUpdates.next();
          return;
        }

        const keysToTranslate = Array.from(this.registeredKeys).filter(
          key => !this.cache.has(this.cacheKey(key, lang))
        );

        if (keysToTranslate.length === 0) {
          this.translationUpdates.next();
          return;
        }

        keysToTranslate.forEach(key => {
          const url = `${this.apiUrl}?q=${encodeURIComponent(key)}&langpair=en|${lang}`;
          this.http.get<any>(url).subscribe({
            next: (res) => {
              const translatedText = res?.responseData?.translatedText || key;
              this.cache.set(this.cacheKey(key, lang), translatedText);
              this.translationUpdates.next();  // Notify on each translated key
            },
            error: () => {
              this.cache.set(this.cacheKey(key, lang), key);
              this.translationUpdates.next();
            }
          });
        });
      }

      private cacheKey(orig: string, lang: string) {
        return `${lang}::${orig}`;
      }
    }
