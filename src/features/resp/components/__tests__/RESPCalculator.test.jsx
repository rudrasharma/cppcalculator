import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RESPCalculator from '../RESPCalculator';

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

describe('RESPCalculator Component State', () => {
    beforeEach(() => {
        delete window.location;
        window.location = new URL('http://localhost');
    });

    it('renders and adds/removes beneficiaries correctly', async () => {
        render(<RESPCalculator />);
        
        // Find Add Child button
        const addBtn = screen.getByRole('button', { name: /Add Child/i });
        
        // Initially 2 children in default state. So 2 trash icons
        let trashIcons = document.querySelectorAll('.text-rose-400');
        expect(trashIcons.length).toBe(2);
        
        // Add a child
        fireEvent.click(addBtn);
        
        await waitFor(() => {
            expect(document.querySelectorAll('.text-rose-400').length).toBe(3);
        });

        // Click the first trash icon to remove the first child
        fireEvent.click(document.querySelectorAll('.text-rose-400')[0]);
        
        await waitFor(() => {
            expect(document.querySelectorAll('.text-rose-400').length).toBe(2);
        });
    });

    it('updates state fields and triggers recalculation', async () => {
        render(<RESPCalculator />);
        
        // Change total plan balance
        const balanceInput = screen.getByRole('textbox', { name: /Total Current Plan Balance/i });
        
        // It's a MoneyInput, so changing value formats it
        fireEvent.change(balanceInput, { target: { value: '10000' } });
        
        await waitFor(() => {
            expect(balanceInput).toHaveValue('10,000');
        });
    });
});
