import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NumberStepper } from '../NumberStepper';

describe('NumberStepper', () => {
    const defaultProps = {
        label: 'Retirement Age',
        value: 65,
        onChange: jest.fn(),
        min: 50,
        max: 75,
        step: 1,
        unit: 'yrs',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with label and unit', () => {
        render(<NumberStepper {...defaultProps} />);
        expect(screen.getByText('Retirement Age')).toBeInTheDocument();
        expect(screen.getByText('yrs')).toBeInTheDocument();
        expect(screen.getByDisplayValue('65')).toBeInTheDocument();
    });

    it('renders tooltip when provided', () => {
        render(<NumberStepper {...defaultProps} tooltip="Standard age is 65" />);
        expect(screen.getByText('Standard age is 65')).toBeInTheDocument();
    });

    it('increments value on plus button click', () => {
        const onChange = jest.fn();
        render(<NumberStepper {...defaultProps} onChange={onChange} />);

        const incBtn = screen.getByRole('button', { name: /Increase/i });
        fireEvent.click(incBtn);

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(66);
    });

    it('decrements value on minus button click', () => {
        const onChange = jest.fn();
        render(<NumberStepper {...defaultProps} onChange={onChange} />);

        const decBtn = screen.getByRole('button', { name: /Decrease/i });
        fireEvent.click(decBtn);

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(64);
    });

    it('disables decrement button when value reaches min', () => {
        render(<NumberStepper {...defaultProps} value={50} min={50} />);
        const decBtn = screen.getByRole('button', { name: /Decrease/i });
        expect(decBtn).toBeDisabled();
    });

    it('disables increment button when value reaches max', () => {
        render(<NumberStepper {...defaultProps} value={75} max={75} />);
        const incBtn = screen.getByRole('button', { name: /Increase/i });
        expect(incBtn).toBeDisabled();
    });

    it('renders preset chips and updates on chip click', () => {
        const onChange = jest.fn();
        render(<NumberStepper {...defaultProps} presets={[60, 65, 70]} onChange={onChange} />);

        const chip60 = screen.getByRole('button', { name: '60 yrs' });
        expect(chip60).toBeInTheDocument();

        fireEvent.click(chip60);
        expect(onChange).toHaveBeenCalledWith(60);
    });

    it('allows typing new value and calls onChange', () => {
        const onChange = jest.fn();
        render(<NumberStepper {...defaultProps} onChange={onChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '62' } });

        expect(onChange).toHaveBeenCalledWith(62);
    });

    it('clamps to bounds on blur', () => {
        const onChange = jest.fn();
        render(<NumberStepper {...defaultProps} min={50} max={75} onChange={onChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '99' } });
        fireEvent.blur(input);

        expect(onChange).toHaveBeenLastCalledWith(75);
    });

    it('falls back to min on blur when cleared', () => {
        const onChange = jest.fn();
        render(<NumberStepper {...defaultProps} min={50} max={75} onChange={onChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.blur(input);

        expect(onChange).toHaveBeenLastCalledWith(50);
    });
});
