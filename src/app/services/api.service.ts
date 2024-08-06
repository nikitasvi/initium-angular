import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class ApiService {
	private httpClient = inject(HttpClient);	
	private baseUrl = "https://test-data.directorix.cloud/";
	
	public get<TResult = any>(endpoint: string): Observable<TResult> {
		const url = this.buildUrl(endpoint);
		return this.httpClient.get<TResult>(url);
	}

	public post<TResult = any>(endpoint: string, payload: any): Observable<TResult> {
		const url = this.buildUrl(endpoint);
		return this.httpClient.post<TResult>(url, payload);
	}

	public put<TResult = any>(endpoint: string, payload: any): Observable<TResult> {
		const url = this.buildUrl(endpoint);
		return this.httpClient.put<TResult>(url, payload);
	}

	public delete<TResult = any>(endpoint: string): Observable<TResult> {
		const url = this.buildUrl(endpoint);
		return this.httpClient.delete<TResult>(url);
	}
	
	private buildUrl(endpoint: string) {
		return this.baseUrl + endpoint;
	}
}