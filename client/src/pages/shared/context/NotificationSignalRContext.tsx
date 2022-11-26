import {HubConnection} from '@microsoft/signalr';
import {createContext, useContext} from 'react';

export const NotifiSignalRContext = createContext<HubConnection | null>(null);

export const useNotificationSignalRContext = () =>
  useContext(NotifiSignalRContext);
