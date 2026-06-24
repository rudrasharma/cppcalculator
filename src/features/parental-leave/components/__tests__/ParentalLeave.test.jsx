import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParentalLeave from '../ParentalLeave';

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

// Mock AICopilot since it's not the subject of this test
jest.mock('../../../../components/shared', () => {
    const original = jest.requireActual('../../../../components/shared');
    return {
        ...original,
        AICopilot: () => <div data-testid="mock-aicopilot" />
    };
});

describe('ParentalLeave Component State', () => {
    
    beforeEach(() => {
        // Clear URL search params to prevent state leak across tests
        delete window.location;
        window.location = new URL('http://localhost');
    });
    
    it('restricts weeks based on plan type and province', () => {
        render(<ParentalLeave initialProvince="ON" initialPlan="STANDARD" />);
        
        // The component has sliders for Parent 1 and Parent 2 weeks
        const sliders = screen.getAllByRole('slider');
        const parent1Slider = sliders[0];
        
        // For standard plan in ON, individual max is 35
        expect(parent1Slider).toHaveAttribute('max', '35');

        // Switch to extended
        const extendedBtn = screen.getByRole('button', { name: /Extended/i });
        fireEvent.click(extendedBtn);
        
        // For extended plan in ON, individual max is 61
        expect(parent1Slider).toHaveAttribute('max', '61');
    });


    it('updates individual max weeks when switching to Quebec (QPIP)', async () => {
        render(<ParentalLeave initialProvince="ON" initialPlan="STANDARD" />);
        
        const sliders = screen.getAllByRole('slider');
        const parent1Slider = sliders[0];
        
        // Initial max in ON is 35
        expect(parent1Slider).toHaveAttribute('max', '35');
        
        // Select QC
        const selects = screen.getAllByRole('combobox');
        const provinceSelect = selects[0];
        
        fireEvent.change(provinceSelect, { target: { value: 'QC' } });
        
        // Max weeks in QC QPIP standard (Basic) for parent 1 includes max parental (32)
        // Wait for the slider max to update
        await waitFor(() => {
            expect(parent1Slider).toHaveAttribute('max', '32');
        });
    });
});
