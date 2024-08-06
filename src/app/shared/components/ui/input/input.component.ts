import { CommonModule } from '@angular/common';
import { Component, DestroyRef, forwardRef, inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'form-control',
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputComponent),
			multi: true
		}
	],
	imports: [ReactiveFormsModule, CommonModule],
	templateUrl: './input.component.html',
	styleUrl: './input.component.scss'
})
export class InputComponent implements ControlValueAccessor, OnInit {
	@Input() label: string = '';
	@Input() name: string = '';
	@Input() type: string = 'text';
	@Input() control!: FormControl;

	public touched = false;
	public disabled = false;
	public focused = false;

	private destroyRef: DestroyRef = inject(DestroyRef);
	
	public get isFilled(): boolean {
		return this.control.value !== '';
	}

	public writeValue(value: string): void {
		this.control.setValue(value, { emitEvent: false });
	}

	public registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	public setDisabledState?(isDisabled: boolean): void {
		isDisabled ? this.control.disable() : this.control.enable();
	}

	private onChange: (value: string) => void = () => {};
	private onTouched: () => void = () => {};

	public onBlur(): void {
		this.touched = true;
		this.focused = false;
		this.onTouched();
	}

	public onFocus(): boolean {
		return this.focused = true;
	}

	public ngOnInit(): void {
		this.control.valueChanges
		  .pipe(
			debounceTime(200),
			tap(value => this.onChange(value)),
			takeUntilDestroyed(this.destroyRef),
		  )
		  .subscribe();
	}

	public getErrorMessage(): string {
		if (this.control.hasError('required')) {
			return ErrorMessages.required;
		} else if (this.control.hasError('minlength')) {
			return ErrorMessages.minlength(this.control.errors?.['minlength'].requiredLength);
		} else if (this.control.hasError('email')) {
			return ErrorMessages.email;
		} else if (this.control.hasError('pattern')) {
			return ErrorMessages.pattern;
		}

		return '';
	}

	public getClassNames(): string {
		if (this.focused) {
			return 'focused';
		} else if (this.control.invalid && this.control.touched) {
			return 'error';
		} else if (this.control.value) {
			return 'filled';
		} else {
			return 'default';
		}
	}
}

export const ErrorMessages = {
	required: 'Поле обязательно для заполнения',
	minlength: (requiredLength: number) => `Минимальное количество символов: ${requiredLength}`,
	email: 'Некорректный адрес',
	pattern: 'Некорректный номер телефона',
};