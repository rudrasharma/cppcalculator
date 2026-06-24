import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CAGRCalculator from '../CAGRCalculator';

// Mock useFinancialMemory hook
jest.mock('../../../../hooks/useFinancialMemory', () => ({
    useFinancialMemory: () => ({
        memory: {},
        updateMemory: jest.fn()
    })
}));

// Mock ResizeObserver for recharts or standard JSDOM
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
        ReferenceLine: () => <div />,
        Label: () => <div />,
        linearGradient: 'linearGradient',
        defs: 'defs',
        stop: 'stop'
    };
});

// Mock AICopilot since it's not the subject of this test
jest.mock('../../../../components/shared', () => {
    const original = jest.requireActual('../../../../components/shared');
    return {
        ...original,
        AICopilot: () => <div data-testid="mock-aicopilot" />
    };
});

describe('CAGRCalculator Component State', () => {
    it('switches modes and displays correct inputs', async () => {
        render(<CAGRCalculator />);
        
        // Mode buttons
        const rateBtn = screen.getByRole('button', { name: /Find Growth Rate/i });
        const startBtn = screen.getByRole('button', { name: /Find Initial Deposit/i });
        
        // Initial mode is FUTURE
        expect(screen.queryByRole('textbox', { name: /Initial Investment/i })).toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: /Target Goal/i })).not.toBeInTheDocument(); 
        
        // Switch to RATE
        fireEvent.click(rateBtn);
        await waitFor(() => {
            // Target Goal should become visible
            expect(screen.queryByRole('textbox', { name: /Target Goal/i })).toBeInTheDocument();
            // Annual Return should disappear
            expect(screen.queryByText(/Annual Return/i)).not.toBeInTheDocument();
        });
        
        // Switch to START
        fireEvent.click(startBtn);
        await waitFor(() => {
            // Initial Investment should disappear
            expect(screen.queryByRole('textbox', { name: /Initial Investment/i })).not.toBeInTheDocument();
        });
    });

    it('toggles contributions', async () => {
        render(<CAGRCalculator />);
        
        // Find the checkbox for contributions
        // It's hidden visually but accessible via label
        const contribCheckbox = screen.getByRole('checkbox', { hidden: true });
        expect(contribCheckbox).not.toBeChecked();
        
        // Toggle contributions
        fireEvent.click(contribCheckbox);
        
        await waitFor(() => {
            expect(contribCheckbox).toBeChecked();
            expect(screen.getByText(/Frequency/i)).toBeInTheDocument();
        });
    });
});
