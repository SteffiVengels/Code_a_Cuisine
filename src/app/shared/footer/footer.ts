import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit, OnDestroy {
  private router = inject(Router);
  private sub?: Subscription;

  // Route -> Farbe (exakt oder erstes Segment). '*' = Fallback
  colorByRoute: Record<string, string> = {
    '': '#FAF0E6',                 // Root
    'generate-recipe': '#1E5515',  // Beispiel
    // weitere Beispiele:
    // 'about': '#A0AEC0',
    // 'products/list': '#FFB020',
    '*': '#FAF0E6',                // Fallback
  };

  footerColor = this.colorByRoute['*'];

  ngOnInit(): void {
    this.updateColor();
    this.sub = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) this.updateColor();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private updateColor(): void {
    const url = this.router.url.split(/[?#]/)[0];
    const full = url.replace(/^\/+/, '');
    const first = full.split('/')[0] || '';
    this.footerColor = this.colorByRoute[full] ?? this.colorByRoute[first] ?? this.colorByRoute['*'];
  }
}
