import { InjectionToken } from '@utilly/di';
import { Client } from 'eris';

export const CLIENT_TOKEN = new InjectionToken<Client>('eris client');
