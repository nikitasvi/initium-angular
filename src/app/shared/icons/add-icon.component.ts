import { Component } from '@angular/core';

@Component({
	selector: 'add-icon',
	standalone: true,
	template: `
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M18 18V2H2V18H18ZM17.7778 0C18.3671 0 18.9324 0.234126 19.3491 0.650874C19.7659 1.06762 20 1.63285 20 2.22222V17.7778C20 18.3671 19.7659 18.9324 19.3491 19.3491C18.9324 19.7659 18.3671 20 17.7778 20H2.22222C1.63285 20 1.06762 19.7659 0.650874 19.3491C0.234126 18.9324 0 18.3671 0 17.7778V2.22222C0 0.988889 1 0 2.22222 0H17.7778ZM8.88889 5.55556C8.88889 4.94191 9.38635 4.44444 10 4.44444C10.6137 4.44444 11.1111 4.94191 11.1111 5.55556V8.88889H14.4444C15.0581 8.88889 15.5556 9.38635 15.5556 10C15.5556 10.6137 15.0581 11.1111 14.4444 11.1111H11.1111V14.4444C11.1111 15.0581 10.6137 15.5556 10 15.5556C9.38635 15.5556 8.88889 15.0581 8.88889 14.4444V11.1111H5.55556C4.94191 11.1111 4.44444 10.6137 4.44444 10C4.44444 9.38635 4.94191 8.88889 5.55556 8.88889H8.88889V5.55556Z" fill="currentColor"/>
		</svg>
	`,
	styles: [],
})
export class IconAddComponent {
}