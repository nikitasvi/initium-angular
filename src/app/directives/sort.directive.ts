import { Directive, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { PropertyType } from "../components/client-list/client-list.component";

@Directive({
	selector: "[appSort]",
	standalone: true
})
export class SortDirective { 
	@Input() field: PropertyType = 'name';
	@Output() sortChanged = new EventEmitter<{ field: PropertyType, direction: 'asc' | 'desc' }>();

	private direction: 'asc' | 'desc' = 'asc';

	@HostListener('click')
	public onClick() {
		this.direction = this.direction === 'asc' ? 'desc' : 'asc';
		this.sortChanged.emit({ field: this.field, direction: this.direction });
	}
}