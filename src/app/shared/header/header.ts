import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  router = inject(Router);

  // Routen -> Bildpfad (exakt oder erstes Segment). '*' = Fallback
  imageByRoute: Record<string, string> = {
    '': 'img/logo.png',                 // Root
    'generate-recipe': 'img/logo_green.png',
    'preferences': 'img/logo_green.png',
    // weitere Beispiele:
    // 'about': 'img/logo_about.png',
    // 'products/list': 'img/logo_products_list.png', // exakter Pfad
    '*': 'img/logo.png',                // Fallback
  };

  private get isAppLoading(): boolean {
    return document.body.classList.contains('app-loading');
  }

  get logoSrc(): string {
    if (this.isAppLoading) {
      return 'img/logo.png';
    }
    const url = this.router.url.split(/[?#]/)[0];   // "/foo/bar"
    const full = url.replace(/^\/+/, '');           // "foo/bar" oder ""
    const first = full.split('/')[0] || '';         // "foo" oder ""
    return (
      this.imageByRoute[full] ??
      this.imageByRoute[first] ??
      this.imageByRoute['*']
    );
  }

  // Neu: true, wenn wir auf der Landing Page sind
  get isHome(): boolean {
    const url = this.router.url.split(/[?#]/)[0];   // "/foo/bar"
    const full = url.replace(/^\/+/, '');           // "foo/bar" oder ""
    return full === '';                            // true, wenn wir auf der Landing Page sind
  }

  get showBackButton(): boolean {
    const url = this.router.url.split(/[?#]/)[0];
    const full = url.replace(/^\/+/, '');
    return !this.isAppLoading && full === 'preferences';
  }
}
