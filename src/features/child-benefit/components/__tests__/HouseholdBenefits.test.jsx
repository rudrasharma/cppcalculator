import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HouseholdBenefits from '../HouseholdBenefits';
import { calculateAll } from '../../utils/benefitEngine';

// Mock the math utility
jest.mock('../../utils/benefitEngine', () => ({
    calculateAll: jest.fn()
}));

describe('HouseholdBenefits UI Integration', () => {
    beforeEach(() => {
        // Default mock implementation
        calculateAll.mockReturnValue({
            federal: 5000,
            provincial: 1000,
            gst: 500,
            caip: 400,
            total: 6900,
            monthly: 575,
            provName: 'Ontario Child Benefit'
        });
    });

    test('renders input fields and updates on user input', () => {
        render(<HouseholdBenefits />);
        
        // Check for key inputs
        const incomeInput = screen.getByLabelText(/Net Household Income/i);
        const provinceSelect = screen.getByLabelText(/Province/i);
        const maritalStatusSelect = screen.getByLabelText(/Marital Status/i);

        // Verify initial state or presence
        expect(incomeInput).toBeInTheDocument();
        expect(provinceSelect).toBeInTheDocument();
        expect(maritalStatusSelect).toBeInTheDocument();

        // Change income
        fireEvent.change(incomeInput, { target: { value: '80000' } });
        expect(calculateAll).toHaveBeenCalled();
    });

    test('calls math utility and displays mocked result', () => {
        // Customize mock for this specific test
        calculateAll.mockReturnValue({
            federal: 8000,
            provincial: 2000,
            gst: 0,
            caip: 0,
            total: 10000,
            monthly: 833.33,
            provName: 'Mock Province Benefit'
        });

        render(<HouseholdBenefits />);

        // By default, the annual total should be visible in the desktop or mobile view
        // The component uses Math.round(results.total).toLocaleString()
        // 10000 -> "10,000"
        const annualDisplays = screen.getAllByText(/\$10,000/);
        expect(annualDisplays.length).toBeGreaterThan(0);

        // Switch to results tab to see monthly
        const resultsTabButton = screen.getByText(/2. View Entitlement/i);
        fireEvent.click(resultsTabButton);

        // Check for monthly amount in ResultsTab
        // Check for monthly amount in ResultsTab
        // ResultsTab uses results.total.toLocaleString(undefined, {maximumFractionDigits: 0})
        expect(screen.getAllByText(/\$10,000/i).length).toBeGreaterThan(0);
        // Look for the specific monthly support text to be more precise
        expect(screen.getByText(/833 Average Monthly Support/i)).toBeInTheDocument();
    });
});
