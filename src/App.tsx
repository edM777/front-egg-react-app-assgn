import './App.css';
import { useState, useEffect } from 'react';
import { useAuth, useAuthActions, useLoginWithRedirect, ContextHolder } from "@frontegg/react";
import { AdminPortal } from '@frontegg/react';

function App() {
  const { switchTenant } = useAuthActions();
  const { user, isAuthenticated } = useAuth();
  const loginWithRedirect = useLoginWithRedirect();
  
  const [tenants, setTenants] = useState<{ id: string; name: string }[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>('');

  useEffect(() => {
    const fetchTenants = async () => {
      const token = user?.accessToken; // Ensure the JWT is available
      if (!token) {
        console.error('No JWT token available');
        return;
      }
      
      const options = { 
        method: 'GET', 
        headers: { 
          accept: 'application/json',
          Authorization: `Bearer ${token}` // Include the JWT in the headers
        } 
      };
      
      try {
        const response = await fetch(`${ContextHolder.getContext().baseUrl}/identity/resources/users/v1/me/tenants`, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.tenants && Array.isArray(data.tenants)) {
          setTenants(data.tenants.map(tenant => ({ id: tenant.tenantId, name: tenant.name })));
        } else {
          console.error('Unexpected response format:', data);
        }
      } catch (err) {
        console.error('Error fetching tenants:', err);
      }
    };
    fetchTenants();
  }, [user]); // Ensure the effect runs when the user changes

  const handleSwitchTenant = () => {
    if (selectedTenant) {
      switchTenant({ tenantId: selectedTenant });
    }
  };

  const logout = () => {
    const baseUrl = ContextHolder.getContext().baseUrl;
    window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${window.location}`;
  };

  const handleClick = () => {
    AdminPortal.show();
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <div>
          <div>
            <img src={user?.profilePictureUrl} alt={user?.name} />
          </div>
          <div>
            <span>Logged in as: {user?.name}</span>
          </div>
          <div>
            <button onClick={() => alert(user.accessToken)}>What is my access token?</button>
          </div>
          <div>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
            >
              <option value="" disabled>
                Select Tenant
              </option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
            <button onClick={handleSwitchTenant}>Switch Tenant</button>
          </div>
          <div>
            <button onClick={logout}>Click to logout</button>
          </div>
          <div>
            <button onClick={handleClick}>Settings</button>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={loginWithRedirect}>Click me to login</button>
        </div>
      )}
    </div>
  );
}

export default App;

