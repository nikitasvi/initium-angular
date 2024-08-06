import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef  } from '@angular/material/dialog';
import { SelectableClient } from '../../../../components/client-list/client-list.component';
import { InputComponent } from "../../ui/input/input.component";
import { FormControlPipe } from '../../../../pipes/form-control.pipe';

@Component({
	standalone: true,
	imports: [FormsModule, ReactiveFormsModule, NgIf, MatDialogClose, InputComponent, FormControlPipe],
	templateUrl: './client-dialog.component.html',
	styleUrl: './client-dialog.component.scss'
})
export class ClientDialogComponent {
	public data = inject(MAT_DIALOG_DATA);
	private dialogRef = inject(MatDialogRef<ClientDialogComponent>);
	private formBuilder = inject(FormBuilder);
	public newClientForm: FormGroup;

	constructor() {
		this.newClientForm = this.formBuilder.group({
			firstName: [this.data?.client?.name  ?? '', [Validators.required, Validators.minLength(2)]],
			lastName: [this.data?.client?.surname ?? '', [Validators.required, Validators.minLength(2)]],
			email: [this.data?.client?.email ?? '', [Validators.required, Validators.email]],
			// Example: +7|7|8 1234567890
			phone: [this.data?.client?.phone ?? '', [Validators.pattern(/^((\+7|7|8)+([0-9]){10})$/)]]
		})
	}

	public get f() {
		return this.newClientForm.controls;
	}

	public onSubmit(): void {
		if (!this.newClientForm.valid) {
			return;
		}

		const client: SelectableClient = new SelectableClient({
			name: this.f['firstName'].value,
			surname: this.f['lastName'].value,
			email: this.f['email'].value,
			phone: this.f['phone'].value,
			id: this.data?.client?.id
		});

		return this.dialogRef.close(client);
	}
}