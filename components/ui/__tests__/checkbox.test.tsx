import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Checkbox } from '../checkbox';

describe('Checkbox', () => {
  it('デフォルトのチェックボックスが正しく表示される', () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('checked状態が正しく動作する', () => {
    render(<Checkbox checked />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('disabled状態が正しく動作する', () => {
    render(<Checkbox disabled />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass('disabled:cursor-not-allowed');
  });

  it('クリックイベントが正しく発火する', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Checkbox onCheckedChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('カスタムクラス名が適用される', () => {
    render(<Checkbox className="custom-checkbox-class" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('custom-checkbox-class');
  });

  it('ref が正しく渡される', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('indeterminate状態が正しく動作する', () => {
    render(<Checkbox checked="indeterminate" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });
});
