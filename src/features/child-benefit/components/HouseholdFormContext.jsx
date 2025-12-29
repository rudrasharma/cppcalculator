import React, { createContext, useContext } from 'react';
import { useHouseholdCalculator } from '../hooks/useHouseholdCalculator';

const HouseholdFormContext = createContext();

export const HouseholdFormProvider = ({ children }) => {
    const allContext = useHouseholdCalculator();

    return (
        <HouseholdFormContext.Provider value={allContext}>
            {children}
        </HouseholdFormContext.Provider>
    );
};

export const useHouseholdForm = () => {
    const context = useContext(HouseholdFormContext);
    if (context === undefined) {
        throw new Error('useHouseholdForm must be used within a HouseholdFormProvider');
    }
    return context;
};
