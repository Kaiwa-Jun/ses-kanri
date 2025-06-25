import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Switch } from '../switch';

describe('Switch', () => {
  it('デフォルトのスイッチが正しく表示される', () => {
    render(<Switch />);

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();
  });

  it('checked状態が正しく動作する', () => {
    render(<Switch checked />);

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeChecked();
  });

  it('disabled状態が正しく動作する', () => {
    render(<Switch disabled />);

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveClass('disabled:cursor-not-allowed');
  });

  it('クリックイベントが正しく発火する', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Switch onCheckedChange={handleChange} />);

    const switchElement = screen.getByRole('switch');
    await user.click(switchElement);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('カスタムクラス名が適用される', () => {
    render(<Switch className="custom-switch-class" />);

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('custom-switch-class');
  });

  it('トグル動作が正しく動作する', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Switch onCheckedChange={handleChange} />);

    const switchElement = screen.getByRole('switch');

    // 最初のクリック（ON）
    await user.click(switchElement);
    expect(handleChange).toHaveBeenCalledWith(true);

    // 2回目のクリック（OFF）
    await user.click(switchElement);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('ref が正しく渡される', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Switch ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
