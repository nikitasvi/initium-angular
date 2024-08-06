import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-delete-client',
	standalone: true,
	imports: [MatDialogClose],
	templateUrl: './delete-dialog.component.html',
	styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {
	public data = inject(MAT_DIALOG_DATA);
	private dialogRef = inject(MatDialogRef<DeleteDialogComponent>);

	public onSubmit(): void {
		this.dialogRef.close(true);
	}
}
