import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'checkbox',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './checkbox.component.html',
	styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent implements OnChanges {
	@Input() checked: boolean = false;
	@Output() checkedChange = new EventEmitter<boolean>();

	@Input() indeterminate: boolean = false;
	@Output() indeterminateChange = new EventEmitter<boolean>();

	@Output() stateChange = new EventEmitter<{ checked: boolean, indeterminate: boolean }>();

	public ngOnChanges(changes: SimpleChanges) {
		if (changes['indeterminate'] && changes['indeterminate'].currentValue) {
			this.checked = false;
		}
	}

	public onChange() {
		if (this.indeterminate) {
			this.checked = false;
			this.indeterminate = false;

			this.indeterminateChange.emit(this.indeterminate);
		} else {
			this.checkedChange.emit(this.checked);
		}

		this.stateChange.emit({ checked: this.checked, indeterminate: this.indeterminate });
	}

	public onClick(event: Event) {
		event.stopPropagation();

		if (this.indeterminate) {
			this.indeterminate = false;
			this.checked = false;
		}

		this.stateChange.emit({ checked: this.checked, indeterminate: this.indeterminate });
	}
}