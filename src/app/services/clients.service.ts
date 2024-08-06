import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Client } from "../models/client.model";
import { BehaviorSubject, Observable, switchMap, tap } from "rxjs";
import { v4 as uuidv4 } from 'uuid';

@Injectable({
	providedIn: "root",
})
export class ClientsService {
	private apiService = inject(ApiService);

	private clientsSubject = new BehaviorSubject<Client[]>(this.loadFromLocalStorage());
	public clients$ = this.clientsSubject.asObservable();
	
	/*
	// Work with API
	*/
	public getClients(): Observable<Client[]>{
		return this.apiService.get<{ users: Client[] }>("task1")
			.pipe(
				tap((response) => {
					const clientsWithId = response.users.map(client => ({ ...client, id: uuidv4() }));
					const combinedRecords = [...this.clientsSubject.value, ...clientsWithId];
					this.saveToLocalStorage(combinedRecords);
					this.clientsSubject.next(combinedRecords);
				}),
				switchMap(() => this.clients$)
			);
	}

	/*
	// Work with local storage
	*/
	public addClient(client: Client): void {
		const newClient = { ...client, id: uuidv4() };
		const clients =  [...this.clientsSubject.value, newClient];
		this.saveToLocalStorage(clients);
		this.clientsSubject.next(clients);
	}

	// Expect that email is unique
	public updateClient(client: Client): void {
		const clients = this.clientsSubject.value.map((u) => u.id === client.id ? client : u);
		this.saveToLocalStorage(clients);
		this.clientsSubject.next(clients);
	}

	public deleteClient(id: string): void {
		const clients = this.clientsSubject.value.filter((u) => u.id !== id);		
		this.saveToLocalStorage(clients);
		this.clientsSubject.next(clients);
	}

	private loadFromLocalStorage(): Client[] {
		const data = localStorage.getItem('clients');
		return data ? JSON.parse(data) : [];
	}

	private saveToLocalStorage(records: Client[]): void {
		localStorage.setItem('clients', JSON.stringify(records));
	}
}