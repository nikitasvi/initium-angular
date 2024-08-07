import { Routes } from '@angular/router';
import { ClientListComponent } from './components/client-list/client-list.component';

export const routes: Routes = [
	{
		path: '',
		component: ClientListComponent,
		data: {
			title: 'Клиенты'
		}
	}
];