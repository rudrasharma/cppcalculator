import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SmithCalculator from '../SmithCalculator';

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
        ComposedChart: ({ children }) => <div>{children}</div>,
        Area: () => <div />,
        Bar: () => <div />,
        Line: () => <div />,
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

describe('SmithCalculator Component State', () => {
    beforeEach(() => {
        delete window.location;
        window.location = new URL('http://localhost');
    });

    it('renders inputs and recalculates on change', async () => {
        render(<SmithCalculator />);
        
        // Let's assume there is an input for Home Value. 
        const homeValueInput = screen.getByRole('textbox', { name: /Home Value/i });
        fireEvent.change(homeValueInput, { target: { value: '800000' } });
        
        await waitFor(() => {
            expect(homeValueInput).toHaveValue('800,000');
        });

        // Advanced Settings toggle
        const advancedBtn = screen.getByRole('button', { name: /Advanced Settings/i });
        expect(screen.queryByRole('textbox', { name: /Initial HELOC Investment/i })).not.toBeInTheDocument();
        
        fireEvent.click(advancedBtn);
        
        await waitFor(() => {
            expect(screen.queryByRole('textbox', { name: /Initial HELOC Investment/i })).toBeInTheDocument();
        });
        
        // Initial HELOC Investment
        const lumpSumInput = screen.getByRole('textbox', { name: /Initial HELOC Investment/i });
        fireEvent.change(lumpSumInput, { target: { value: '50000' } });
        
        await waitFor(() => {
            expect(lumpSumInput).toHaveValue('50,000');
        });
    });

    it('toggles strategy presets', async () => {
        render(<SmithCalculator />);
        
        // The preset buttons
        const consBtn = screen.getByRole('button', { name: /Cons/i });
        const balBtn = screen.getByRole('button', { name: /Bal/i });
        
        fireEvent.click(consBtn);
        
        await waitFor(() => {
            expect(consBtn).toHaveClass('bg-indigo-600');
            expect(balBtn).not.toHaveClass('bg-indigo-600');
        });
        
        fireEvent.click(balBtn);
        
        await waitFor(() => {
            expect(balBtn).toHaveClass('bg-indigo-600');
            expect(consBtn).not.toHaveClass('bg-indigo-600');
        });
    });
});
