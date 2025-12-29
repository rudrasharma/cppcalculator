import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MoneyInput } from '../MoneyInput';

describe('MoneyInput', () => {
  const defaultProps = {
    label: 'Test Label',
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with label', () => {
    render(<MoneyInput {...defaultProps} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with subLabel', () => {
    render(<MoneyInput {...defaultProps} subLabel="Sub label text" />);
    expect(screen.getByText('Sub label text')).toBeInTheDocument();
  });

  it('displays the dollar sign', () => {
    render(<MoneyInput {...defaultProps} />);
    const dollarSign = screen.getByText('$');
    expect(dollarSign).toBeInTheDocument();
  });

  it('calls onChange with valid number input', () => {
    const onChange = jest.fn();
    render(<MoneyInput {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    // Simulate typing the full value
    fireEvent.change(input, { target: { value: '123.45' } });
    
    // Verify onChange was called with the valid input
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('123.45');
  });

  it('rejects invalid characters', () => {
    const onChange = jest.fn();
    render(<MoneyInput {...defaultProps} onChange={onChange} value="123" />);
    
    const input = screen.getByRole('textbox');
    // Try to set invalid characters
    fireEvent.change(input, { target: { value: '123abc' } });
    
    // Should not call onChange with invalid characters
    // The component's validation should prevent invalid input
    expect(onChange).not.toHaveBeenCalledWith(expect.stringContaining('a'));
    expect(onChange).not.toHaveBeenCalledWith(expect.stringContaining('b'));
    expect(onChange).not.toHaveBeenCalledWith(expect.stringContaining('c'));
  });

  it('allows decimal point', () => {
    const onChange = jest.fn();
    render(<MoneyInput {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    // Simulate typing a value with decimal point
    fireEvent.change(input, { target: { value: '99.99' } });
    
    // Verify decimal point was accepted
    expect(onChange).toHaveBeenCalledWith('99.99');
    expect(onChange.mock.calls[0][0]).toContain('.');
  });

  it('allows empty string', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<MoneyInput {...defaultProps} onChange={onChange} value="123" />);
    
    const input = screen.getByRole('textbox');
    await user.clear(input);
    
    expect(onChange).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MoneyInput {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    render(
      <MoneyInput
        {...defaultProps}
        data-testid="money-input"
        placeholder="Enter amount"
      />
    );
    
    const input = screen.getByPlaceholderText('Enter amount');
    expect(input).toHaveAttribute('data-testid', 'money-input');
  });
});

