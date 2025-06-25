import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { DeleteConfirmationModal } from '../delete-confirmation-modal';

// モックデータ
const mockStores = [
  {
    id: '1',
    name: 'ABCシステム',
    email: 'abc@example.com',
  },
  {
    id: '2',
    name: 'XYZ商事',
    email: 'xyz@example.com',
  },
];

describe('DeleteConfirmationModal', () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    storeName: 'テストストア',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('単一削除モーダルが正しくレンダリングされる', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);

    // タイトルの確認
    expect(screen.getByText('削除の確認')).toBeInTheDocument();

    // メッセージの確認
    expect(screen.getByText('選択した加盟店を削除します。')).toBeInTheDocument();
    expect(screen.getByText('加盟店名：テストストア')).toBeInTheDocument();

    // ボタンの確認
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '確定' })).toBeInTheDocument();
  });

  it('複数削除モーダルが正しくレンダリングされる', () => {
    render(
      <DeleteConfirmationModal
        {...defaultProps}
        isMultiple={true}
        selectedStores={mockStores}
        storeCount={2}
      />
    );

    // タイトルの確認
    expect(screen.getByText('削除の確認')).toBeInTheDocument();

    // メッセージの確認
    expect(screen.getByText('選択した2件の加盟店を削除します。')).toBeInTheDocument();
    expect(screen.getByText('削除対象の加盟店：')).toBeInTheDocument();

    // 加盟店リストの確認
    expect(screen.getByText('1. ABCシステム')).toBeInTheDocument();
    expect(screen.getByText('(abc@example.com)')).toBeInTheDocument();
    expect(screen.getByText('2. XYZ商事')).toBeInTheDocument();
    expect(screen.getByText('(xyz@example.com)')).toBeInTheDocument();
  });

  it('モーダルが閉じている時は表示されない', () => {
    render(<DeleteConfirmationModal {...defaultProps} open={false} />);

    expect(screen.queryByText('削除の確認')).not.toBeInTheDocument();
  });

  it('キャンセルボタンをクリックするとonOpenChangeが呼ばれる', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    render(<DeleteConfirmationModal {...defaultProps} onOpenChange={onOpenChange} />);

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    await user.click(cancelButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('確定ボタンをクリックするとonOpenChangeが呼ばれる', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    render(<DeleteConfirmationModal {...defaultProps} onOpenChange={onOpenChange} />);

    const confirmButton = screen.getByRole('button', { name: '確定' });
    await user.click(confirmButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('ESCキーでモーダルが閉じる', () => {
    const onOpenChange = jest.fn();

    render(<DeleteConfirmationModal {...defaultProps} onOpenChange={onOpenChange} />);

    // ESCキーを押下
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('オーバーレイをクリックするとモーダルが閉じる', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    render(<DeleteConfirmationModal {...defaultProps} onOpenChange={onOpenChange} />);

    // オーバーレイ要素を取得してクリック
    const overlay = document.querySelector('[data-radix-dialog-overlay]');
    if (overlay) {
      await user.click(overlay);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    }
  });

  it('確定ボタンが表示される', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: '確定' });
    expect(confirmButton).toBeVisible();
  });

  it('加盟店リストがスクロール可能である', () => {
    const manyStores = Array.from({ length: 10 }, (_, i) => ({
      id: `store-${i}`,
      name: `ストア${i + 1}`,
      email: `store${i + 1}@example.com`,
    }));

    render(
      <DeleteConfirmationModal
        {...defaultProps}
        isMultiple={true}
        selectedStores={manyStores}
        storeCount={10}
      />
    );

    // スクロール可能なコンテナの確認
    const scrollContainer = screen
      .getByText('削除対象の加盟店：')
      .parentElement?.querySelector('.max-h-40');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('overflow-y-auto');
  });

  it('プロパティが正しく適用される', () => {
    const customProps = {
      ...defaultProps,
      storeName: 'カスタムストア名',
    };

    render(<DeleteConfirmationModal {...customProps} />);

    expect(screen.getByText('加盟店名：カスタムストア名')).toBeInTheDocument();
  });

  it('selectedStoresが空の場合は単一削除として動作する', () => {
    render(
      <DeleteConfirmationModal
        {...defaultProps}
        isMultiple={false}
        selectedStores={[]}
        storeCount={0}
      />
    );

    // 単一削除のメッセージが表示される
    expect(screen.getByText('選択した加盟店を削除します。')).toBeInTheDocument();
    expect(screen.getByText('加盟店名：テストストア')).toBeInTheDocument();

    // リストは表示されない
    expect(screen.queryByText('削除対象の加盟店：')).not.toBeInTheDocument();
  });

  it('アクセシビリティ属性が正しく設定される', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);

    // ダイアログのロール確認
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // ダイアログタイトルの関連付け確認
    expect(dialog).toHaveAttribute('aria-labelledby');

    // ダイアログの説明の関連付け確認
    expect(dialog).toHaveAttribute('aria-describedby');
  });

  it('削除確定ボタンが赤色スタイルで表示される', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    const confirmButton = screen.getByRole('button', { name: '確定' });

    // ボタンが存在することを確認
    expect(cancelButton).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();

    // ボタンがクリック可能であることを確認
    expect(cancelButton).toBeEnabled();
    expect(confirmButton).toBeEnabled();

    // 削除ボタンが赤色であることを確認（実装に応じて）
    expect(confirmButton).toHaveClass('bg-red-600');
  });

  it('危険な操作であることが伝わるUI構造になっている', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);

    // 削除という危険な操作のタイトル
    expect(screen.getByText('削除の確認')).toBeInTheDocument();

    // 削除という文言が含まれる
    expect(screen.getByText('選択した加盟店を削除します。')).toBeInTheDocument();

    // 確定ボタンが存在する
    const confirmButton = screen.getByRole('button', { name: '確定' });
    expect(confirmButton).toBeInTheDocument();
  });
});
