import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MortgageCalculator from '../MortgageCalculator';

// Mock useFinancialMemory hook
jest.mock('../../../../hooks/useFinancialMemory', () => ({
    useFinancialMemory: () => ({
        memory: {},
        updateMemory: jest.fn()
    })
}));

// We need to mock ResizeObserver for recharts or standard JSDOM
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}
window.ResizeObserver = ResizeObserver;

jest.mock('recharts', () => {
    return {
        ResponsiveContainer: ({ children }) => <div>{children}</div>,
        AreaChart: ({ children }) => <div>{children}</div>,
        BarChart: ({ children }) => <div>{children}</div>,
        Area: () => <div />,
        Bar: () => <div />,
        XAxis: () => <div />,
        YAxis: () => <div />,
        CartesianGrid: () => <div />,
        Tooltip: () => <div />,
        Legend: () => <div />,
    };
});

describe('MortgageCalculator Component State', () => {
    
    it('restricts amortization options to max 25 years when down payment is < 20%', () => {
        render(<MortgageCalculator />);
        
        // Find Asking Price input and set to 500,000
        const askingPriceInput = screen.getByRole('textbox', { name: 'Asking Price' });
        fireEvent.change(askingPriceInput, { target: { value: '500000' } });
        
        // Click on the '% Percent' button for Down Payment to ensure it's in percent mode
        const percentBtn = screen.getByRole('button', { name: '% Percent' });
        fireEvent.click(percentBtn);
        
        // Find Down Payment input and set to 10%
        // Note: It's the textbox immediately after the Asking Price textbox
        const textboxes = screen.getAllByRole('textbox');
        const downPaymentInput = textboxes[1];
        fireEvent.change(downPaymentInput, { target: { value: '10' } });
        
        // Assert the CMHC warning is present
        expect(screen.getByText('*CMHC limits amortization to 25 years with less than 20% down.')).toBeInTheDocument();
        
        // Check the Amortization dropdown (it is the second combobox after Province)
        const selects = screen.getAllByRole('combobox');
        const amortizationSelect = selects[1];
        
        // Since down payment is < 20%, 30 years should not be an option
        const options = Array.from(amortizationSelect.options).map(opt => opt.value);
        expect(options).not.toContain('30');
        expect(options).toContain('25');
    });

    it('toggles correctly between $ CAD and % Percent down payment', () => {
        render(<MortgageCalculator />);
        
        const askingPriceInput = screen.getByRole('textbox', { name: 'Asking Price' });
        fireEvent.change(askingPriceInput, { target: { value: '500000' } });
        
        const dollarBtn = screen.getByRole('button', { name: '$ CAD' });
        const percentBtn = screen.getByRole('button', { name: '% Percent' });
        
        // Click $ CAD and set to 100,000
        fireEvent.click(dollarBtn);
        const textboxes = screen.getAllByRole('textbox');
        const downPaymentInput = textboxes[1];
        fireEvent.change(downPaymentInput, { target: { value: '100000' } });
        
        // Verify input value (it is unformatted in the raw input field)
        expect(downPaymentInput).toHaveValue('100000');
        
        // Click % Percent - it should automatically convert 100000 / 500000 = 20%
        fireEvent.click(percentBtn);
        
        // Let's re-query to be safe
        const updatedInput = screen.getAllByRole('textbox')[1];
        expect(updatedInput).toHaveValue('20');
        
        // Click back to $ CAD - it should automatically convert 20% * 500000 = 100000
        fireEvent.click(dollarBtn);
        const finalInput = screen.getAllByRole('textbox')[1];
        expect(finalInput).toHaveValue('100000');
    });
});
