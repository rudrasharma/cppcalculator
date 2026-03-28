import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ParentalLeave from '../ParentalLeave';
import { calculateParentalLeave } from '../../utils/parentalLeaveEngine';

// Mock the math utility
jest.mock('../../utils/parentalLeaveEngine', () => ({
    calculateParentalLeave: jest.fn(),
    getCurrentMaxInsurable: jest.fn(() => 66600),
    getIndividualMaxWeeks: jest.fn(() => 35),
    getMaxWeeks: jest.fn(() => 40),
    isBonusWeeksActive: jest.fn(() => false)
}));

describe('ParentalLeave UI Integration', () => {
    beforeEach(() => {
        calculateParentalLeave.mockReturnValue({
            maternityWeekly: 600,
            maternityWeeks: 15,
            maternityTotal: 9000,
            p1Weekly: 600,
            p1Weeks: 30,
            p1Total: 18000,
            p2Weekly: 600,
            p2Weeks: 5,
            p2Total: 3000,
            totalDuration: 50,
            totalValue: 30000
        });
    });

    test('renders input fields and accepts input', () => {
        render(<ParentalLeave />);
        
        // Multiple matches for "Parent 1 (Birth)" due to MoneyInput and RangeSlider
        const salaryInput = screen.getAllByLabelText(/Parent 1 \(Birth\)/i)[0];
        const provinceSelect = screen.getByLabelText(/Province/i);

        expect(salaryInput).toBeInTheDocument();
        expect(provinceSelect).toBeInTheDocument();

        fireEvent.change(salaryInput, { target: { value: '50000' } });
        expect(calculateParentalLeave).toHaveBeenCalled();
    });

    test('displays mocked calculation results', () => {
        calculateParentalLeave.mockReturnValue({
            maternityWeekly: 500,
            maternityWeeks: 15,
            maternityTotal: 7500,
            p1Weekly: 500,
            p1Weeks: 30,
            p1Total: 15000,
            p2Weekly: 0,
            p2Weeks: 0,
            p2Total: 0,
            totalDuration: 45,
            totalValue: 22500
        });

        render(<ParentalLeave />);

        // Check for total value display - use getAllByText to avoid ambiguity
        const totalDisplays = screen.getAllByText(/\$22,500/);
        expect(totalDisplays.length).toBeGreaterThan(0);

        // Switch to results tab
        const resultsTabButton = screen.getByText(/2. Your Results/i);
        fireEvent.click(resultsTabButton);

        expect(screen.getAllByText(/\$22,500/i).length).toBeGreaterThan(0);
    });
});
