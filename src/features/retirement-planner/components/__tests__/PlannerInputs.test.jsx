import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlannerInputs } from '../PlannerInputs';
import '@testing-library/jest-dom';

describe('PlannerInputs Component', () => {
    const mockState = {
        inflation: 0.02,
        returnRate: 0.05,
        drawdownOrder: ['nonReg', 'rrsp', 'lira', 'tfsa'],
        hasSpouse: false,
        balances: { tfsa: 0, rrsp: 0, nonReg: 0, lira: 0 },
        contributions: { tfsa: 0, rrsp: 0, nonReg: 0 },
        pension: { amount: 0, startAge: 65 },
        cpp: { amount: 0, startAge: 65 },
        oas: { amount: 8000, startAge: 65 },
        spouse: {
            balances: { tfsa: 0, rrsp: 0, lira: 0 },
            contributions: { tfsa: 0, rrsp: 0 },
            pension: { amount: 0, startAge: 65 },
            cpp: { amount: 0, startAge: 65 },
            oas: { amount: 8000, startAge: 65 }
        }
    };
    
    it('renders and updates the Drawdown Strategy dropdown', () => {
        const updateFieldMock = jest.fn();
        render(<PlannerInputs state={mockState} updateField={updateFieldMock} />);
        
        const selects = screen.getAllByRole('combobox');
        const select = selects.find(s => s.value.includes('tfsa')); // Find the one that has the drawdown options
        expect(select).toBeInTheDocument();
        expect(select).toBeInTheDocument();
        expect(select.value).toBe('nonReg,rrsp,lira,tfsa');
        
        fireEvent.change(select, { target: { value: 'tfsa,nonReg,rrsp,lira' } });
        expect(updateFieldMock).toHaveBeenCalledWith('drawdownOrder', ['tfsa', 'nonReg', 'rrsp', 'lira']);
    });
});
