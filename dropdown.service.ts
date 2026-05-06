import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map, shareReplay, catchError } from 'rxjs/operators';

interface DropdownCache {
  timestamp: number;
  data: { [key: string]: any[] };
}

@Injectable({ providedIn: 'root' })
export class DropdownService {

  private STORAGE_KEY = 'dropdown_cache';
  private TTL = 24 * 60 * 60 * 1000; // 24 hours

  private dropdownSubject = new BehaviorSubject<{ [key: string]: any[] }>({});
  dropdowns$ = this.dropdownSubject.asObservable();

  private dropdownRequest$: Observable<any> | null = null;

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  // 🔹 Load from localStorage
  private loadFromLocalStorage() {
    const cached = localStorage.getItem(this.STORAGE_KEY);
    if (cached) {
      try {
        const parsed: DropdownCache = JSON.parse(cached);

        this.dropdownSubject.next(parsed.data);

        // Check TTL
        const isExpired = Date.now() - parsed.timestamp > this.TTL;
        if (isExpired) {
          this.refresh(); // 🔥 auto refresh if expired
        }

      } catch {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } else {
      this.refresh(); // no cache → fetch
    }
  }

  // 🔹 Save to localStorage
  private saveToLocalStorage(data: any) {
    const cache: DropdownCache = {
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache));
  }

  // 🔹 API call
  loadDropdowns(): Observable<any> {
    if (!this.dropdownRequest$) {
      this.dropdownRequest$ = this.http.get<any>('/api/dropdowns/all').pipe(
        tap(response => {
          this.dropdownSubject.next(response);
          this.saveToLocalStorage(response);
        }),
        shareReplay(1),
        catchError(err => {
          console.error('Dropdown load failed', err);
          return of({});
        })
      );
    }
    return this.dropdownRequest$;
  }

  // 🔹 Force refresh
  refresh(): void {
    this.dropdownRequest$ = null;
    this.loadDropdowns().subscribe();
  }

  // 🔹 Reactive getter
  getOptions$(field: string): Observable<any[]> {
    return this.dropdowns$.pipe(
      map(data => data[field] || [])
    );
  }

  // 🔹 Sync getter (optional)
  getOptions(field: string): any[] {
    return this.dropdownSubject.value[field] || [];
  }
}
