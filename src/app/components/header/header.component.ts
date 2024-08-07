import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';

@Component({
	selector: 'header',
	standalone: true,
	imports: [],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})
export class HeaderComponent {
	private router = inject(Router);
	private activatedRoute = inject(ActivatedRoute);
	private destroyRef: DestroyRef = inject(DestroyRef);

	public title: string = '';

	public ngOnInit() {
		this.router.events.pipe(
				filter(event => event instanceof NavigationEnd),
				map(() => this.activatedRoute),
				map(route => {
				while (route.firstChild) route = route.firstChild;
				return route;
				}),
				mergeMap(route => route.data),
				takeUntilDestroyed(this.destroyRef),
		  ).subscribe(data => {
				this.title = data['title'];
		  });
	}
}