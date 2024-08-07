import { Component, inject, OnInit } from '@angular/core';
import { IconAddComponent } from '../../shared/icons/add-icon.component';
import { IconDeleteComponent } from '../../shared/icons/delete-icon.component';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from '../../shared/components/ui/checkbox/checkbox.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientDialogComponent } from '../../shared/components/dialogs/client-dialog/client-dialog.component';
import { ClientsService } from '../../services/clients.service';
import { map, of, switchMap, take } from 'rxjs';
import { Client } from '../../models/client.model';
import { DeleteDialogComponent } from '../../shared/components/dialogs/delete-dialog/delete-dialog.component';
import { SortDirective } from '../../directives/sort.directive';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		NgTemplateOutlet,
		IconAddComponent,
		IconDeleteComponent,
		CheckboxComponent,
		SortDirective
	],
	templateUrl: './client-list.component.html',
	styleUrl: './client-list.component.scss'
})
export class ClientListComponent implements OnInit {
	private dialog = inject(MatDialog);
	private clientsService = inject(ClientsService);

	public clients: Client[] = [];
	public sortedClients: Client[] = [];
	public selection = new SelectionModel<Client>(true, []);

	public ngOnInit(): void {
		this.clientsService.clients$
			.pipe(
				take(1),
				switchMap((clients) => {
					if (clients.length === 0) {
						return this.clientsService.getClients()
							.pipe(
								map((clients) => clients)
							);
					} else {
						return of(clients);
					}
				})
			)
			.subscribe((clients) => {
				this.clients = clients;
				this.sortedClients = [...clients];
			});
	}

	private loadClients(): void {
		this.clientsService.clients$
			.pipe(take(1))
			.subscribe((clients) => {
				this.clients = clients;
				this.sortedClients = [...this.clients];
			});
	}

	public get selectedClients(): Client[] {
		return this.selection.selected;
	}

	/*
	// Work with dialogs
	*/
	public openAddClientDialog(): void {
		const dialogRef = this.dialog.open(ClientDialogComponent, {
			width: '448px',
			height: '593px',
			data: {
				title: 'Новый клиент',
			}
		});

		dialogRef.afterClosed()
			.subscribe((client) => {
				if (client) {
					this.clientsService.addClient(client);
					this.loadClients();
				}
			})
	}

	public openEditClientDialog(client: Client): void {
		const dialogRef = this.dialog.open(ClientDialogComponent, {
			width: '448px',
			height: '593px',
			data: {
				title: 'Редактирование',
				client: client
			}
		});

		dialogRef.afterClosed()
			.subscribe((client) => {
				if (client) {
					this.clientsService.updateClient(client);
					this.loadClients();
				}
			})
	}

	public openDeleteClientDialog(): void {
		const dialogRef = this.dialog.open(DeleteDialogComponent, {
			width: '448px',
			height: '300px',
			data: {
				count: this.selectedClients.length,
			}
		});

		dialogRef.afterClosed()
			.subscribe((result) => {
				if (result) {
					this.selectedClients.forEach(client => this.clientsService.deleteClient(client.id ?? ''));
					this.loadClients();
				}
			})
	}

/*
// Work with sorting clients
*/
	public onSortChanged(event: { field: PropertyType, direction: 'asc' | 'desc' }) {
		this.sortedClients = [...this.clients].sort((a, b) => {
			if (a[event.field] < b[event.field]) return event.direction === 'asc' ? -1 : 1;
			if (a[event.field] > b[event.field]) return event.direction === 'asc' ? 1 : -1;
			return 0;
		});
	}

/*
// Work with checkboxes
*/
	public isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.sortedClients.length;
		return numSelected === numRows;
	}

	public masterToggle(): void {
		if (this.isAllSelected()) {
			this.selection.clear();
		} else {
			this.selection.select(...this.sortedClients);
		}
	}
}

export type PropertyType = 'name' | 'surname' | 'email' | 'phone';