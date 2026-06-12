import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../button.js';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button appName="test">Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeTruthy();
  });

  it('applies custom className', () => {
    render(
      <Button appName="test" className="custom-class">
        Test
      </Button>
    );
    const button = screen.getByText('Test');
    expect(button.className).toContain('custom-class');
  });
});
