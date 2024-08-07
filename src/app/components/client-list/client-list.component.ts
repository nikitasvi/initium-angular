import { Component, inject, OnInit } from '@angular/core';
import { IconAddComponent } from '../../shared/icons/add-icon.component';
import { IconDeleteComponent } from '../../shared/icons/delete-icon.component';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from '../../shared/components/ui/checkbox/checkbox.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientDialogComponent } from '../../shared/components/dialogs/client-dialog/client-dialog.component';
import { ClientsService } from '../../services/clients.service';
import { map, of, switchMap, take, takeWhile, tap } from 'rxjs';
import { Client } from '../../models/client.model';
import { DeleteDialogComponent } from '../../shared/components/dialogs/delete-dialog/delete-dialog.component';
import { SortDirective } from '../../directives/sort.directive';

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

	public clients: SelectableClient[] = [];
	public sortedClients: SelectableClient[] = [];

	public allSelected: boolean = false;
	public isIndeterminate: boolean = false;

	public ngOnInit(): void {
		this.clientsService.clients$
			.pipe(
				take(1),
				switchMap((clients) => {
					if (clients.length === 0) {
						return this.clientsService.getClients()
							.pipe(
								map((clients) => {
									return clients.map((client) => new SelectableClient(client))
								}),
							);
					} else {
						return of(clients.map((client) => new SelectableClient(client)));
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
				this.clients = clients.map((client) => new SelectableClient(client));
				this.sortedClients = [...this.clients];
			});
	}

	public get selectedClients(): SelectableClient[] {
		return this.sortedClients.filter((client) => client.selected);
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

	public openEditClientDialog(client: SelectableClient): void {
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
	public handleRowCheckboxChange(event: { checked: boolean, indeterminate: boolean }): void {
		this.updateHeaderCheckboxState();
	}

	public handleHeaderCheckboxChange(event: { checked: boolean, indeterminate: boolean }): void {
		if (this.isIndeterminate) {
			this.clearSelections();
		} else {
			this.allSelected = event.checked;
			this.sortedClients.forEach(client => client.selected = this.allSelected);
		}
		this.updateHeaderCheckboxState();
	}
	
	public clearSelections(): void {
		this.sortedClients.forEach(row => row.selected = false);
		this.allSelected = false;
		this.isIndeterminate = false;
	}
	
	public updateHeaderCheckboxState(): void {
		const selectedRows = this.sortedClients.filter(row => row.selected);
		this.allSelected = selectedRows.length === this.sortedClients.length;
		this.isIndeterminate = selectedRows.length > 0 && !this.allSelected;
	}
}

export type PropertyType = 'name' | 'surname' | 'email' | 'phone';

export class SelectableClient extends Client {
	public selected: boolean = false;

	constructor(client: Client) {
		super(client.name, client.surname, client.email, client.phone, client.id);
	}
}