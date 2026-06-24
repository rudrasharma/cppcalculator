import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaxCalculator from '../TaxCalculator';

// Mock useFinancialMemory hook
jest.mock('../../../../hooks/useFinancialMemory', () => ({
    useFinancialMemory: () => ({
        memory: {},
        updateMemory: jest.fn()
    })
}));

// Mock AICopilot since it's not the subject of this test
jest.mock('../../../../components/shared', () => {
    const original = jest.requireActual('../../../../components/shared');
    return {
        ...original,
        AICopilot: () => <div data-testid="mock-aicopilot" />
    };
});

// We need to mock ResizeObserver for recharts or standard JSDOM
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}
window.ResizeObserver = ResizeObserver;

describe('TaxCalculator Component State', () => {
    
    it('updates province state and calculations correctly', () => {
        render(<TaxCalculator initialIncome={100000} initialProvince="ON" />);
        
        // Ensure ON is selected by default
        const provinceSelect = screen.getByLabelText('Province of Residence');
        expect(provinceSelect).toHaveValue('ON');
        
        // Grab initial net pay by finding the heading and getting its sibling
        const initialNetPay = screen.getByText('Estimated Take-Home Pay').nextElementSibling.textContent;
        
        // Change province to Alberta (AB), which has lower taxes
        fireEvent.change(provinceSelect, { target: { value: 'AB' } });
        
        expect(provinceSelect).toHaveValue('AB');
        
        // Wait for the net pay to update and verify it changed
        const newNetPay = screen.getByText('Estimated Take-Home Pay').nextElementSibling.textContent;
        expect(newNetPay).not.toBe(initialNetPay);
    });

    it('updates RRSP available room when income changes', () => {
        render(<TaxCalculator initialIncome={50000} initialProvince="ON" />);
        
        // RRSP room is typically 18% of income. For 50k, it's $9,000.
        expect(screen.getByText(/Available Room: \$9,000/)).toBeInTheDocument();
        
        // Change income to $100,000 (18% = 18,000)
        const incomeInput = screen.getByRole('textbox', { name: 'Gross Annual Income' });
        
        // The value is formatted (100,000), but fireEvent.change expects the raw string value passed to react-number-format
        fireEvent.change(incomeInput, { target: { value: '100000' } });
        
        // Verify room updated
        expect(screen.getByText(/Available Room: \$18,000/)).toBeInTheDocument();
    });

    it('syncs RRSP slider correctly', () => {
        render(<TaxCalculator initialIncome={100000} initialProvince="ON" />);
        
        const rrspSlider = screen.getByRole('slider', { name: 'Your RRSP Contribution' });
        
        // Move slider to $5,000
        fireEvent.change(rrspSlider, { target: { value: '5000' } });
        
        // The RangeSlider component renders the value in a span next to the label
        expect(screen.getByText('5000')).toBeInTheDocument();
    });
});
