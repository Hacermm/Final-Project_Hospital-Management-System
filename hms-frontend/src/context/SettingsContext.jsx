import { createContext, useState, useEffect } from 'react';
import api from '../lib/api';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettingsLocally = (newSettings) => {
      setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, fetchSettings, updateSettingsLocally }}>
      {children}
    </SettingsContext.Provider>
  );
};
