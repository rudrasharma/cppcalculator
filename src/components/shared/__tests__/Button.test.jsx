import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  const defaultProps = {
    children: 'Click me',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with children', () => {
    render(<Button {...defaultProps} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button {...defaultProps} onClick={onClick} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button {...defaultProps} onClick={onClick} disabled />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies primary variant styles by default', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-indigo-600');
  });

  it('applies secondary variant styles', () => {
    render(<Button {...defaultProps} variant="secondary" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white');
    expect(button).toHaveClass('text-indigo-600');
  });

  it('applies success variant styles', () => {
    render(<Button {...defaultProps} variant="success" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-emerald-600');
  });

  it('applies danger variant styles', () => {
    render(<Button {...defaultProps} variant="danger" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-rose-600');
  });

  it('applies ghost variant styles', () => {
    render(<Button {...defaultProps} variant="ghost" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
  });

  it('applies size classes', () => {
    const { rerender } = render(<Button {...defaultProps} size="sm" />);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-xs');
    
    rerender(<Button {...defaultProps} size="lg" />);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-base');
  });

  it('applies custom className', () => {
    render(<Button {...defaultProps} className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('has correct type attribute', () => {
    render(<Button {...defaultProps} type="submit" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('passes through additional props', () => {
    render(
      <Button
        {...defaultProps}
        data-testid="custom-button"
        aria-label="Custom button"
      />
    );
    
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom button');
  });
});

