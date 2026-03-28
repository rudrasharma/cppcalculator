import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from '../index';
import { useRetirementMath } from '../../hooks/useRetirementMath';

// Mock the math hook
jest.mock('../../hooks/useRetirementMath', () => ({
    useRetirementMath: jest.fn()
}));

describe('Retirement Calculator UI Integration', () => {
    beforeEach(() => {
        useRetirementMath.mockReturnValue({
            grandTotal: 3000,
            cpp: { total: 1800, base: 1500, enhanced: 300, adjustment: 0 },
            oas: { total: 700, gross: 700, clawback: 0 },
            gis: { total: 500, note: 'GIS eligible' },
            breakevenData: [{ age: 65, Early: 1000, Standard: 1200, Deferred: 1500, Selected: 1200 }],
            years: [2024, 2025],
            insights: [],
            crossovers: { age65: 75, age70: 82 },
            userIsDistinct: false,
            selectedAge: 65
        });
    });

    test('renders input fields and accepts input', () => {
        const { container } = render(<Calculator />);
        
        // Find Date of Birth input by type since label is not associated
        const dobInput = container.querySelector('input[type="date"]');
        const salaryInput = screen.getByLabelText(/Generate Forecast from Salary/i);

        expect(dobInput).toBeInTheDocument();
        expect(salaryInput).toBeInTheDocument();

        fireEvent.change(salaryInput, { target: { value: '60000' } });
        // The component might wait for button click or use effect
        const generateButton = screen.getByText(/Generate All/i);
        fireEvent.click(generateButton);
        
        expect(useRetirementMath).toHaveBeenCalled();
    });

    test('displays mocked calculation results', () => {
        useRetirementMath.mockReturnValue({
            grandTotal: 4500,
            cpp: { total: 2500, base: 2000, enhanced: 500, adjustment: 0 },
            oas: { total: 1000, gross: 1000, clawback: 0 },
            gis: { total: 1000, note: 'GIS eligible' },
            breakevenData: [{ age: 65, Early: 2000, Standard: 2500, Deferred: 3000, Selected: 2500 }],
            years: [2024, 2025],
            insights: [],
            crossovers: { age65: 75, age70: 82 },
            userIsDistinct: false,
            selectedAge: 65
        });

        render(<Calculator />);

        // Check for total value display
        // displayTotal.toLocaleString('en-CA', { maximumFractionDigits: 0 })
        // 4500 -> "4,500"
        const totalDisplays = screen.getAllByText(/\$4,500/);
        expect(totalDisplays.length).toBeGreaterThan(0);

        // Switch to results tab
        const resultsTabButton = screen.getByText(/2. View Estimate/i);
        fireEvent.click(resultsTabButton);

        expect(screen.getAllByText(/\$4,500/i).length).toBeGreaterThan(0);
    });
});
