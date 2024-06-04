import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import './index.css';
import { FronteggProvider } from '@frontegg/react';

const contextOptions = {
  baseUrl: 'https://app-xq75stmwvbbs.us.frontegg.com',
  clientId: '214e193d-6689-4a10-bf52-18bff7624d4b'
};

const authOptions = {
 // keepSessionAlive: true // Uncomment this in order to maintain the session alive
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <FronteggProvider 
    contextOptions={contextOptions} 
    hostedLoginBox={true}
    authOptions={authOptions}>
        <App />
    </FronteggProvider>,
    document.getElementById('root')
);
