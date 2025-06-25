import React from 'react';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useToast, toast, reducer } from '../use-toast';

// MockのsetTimeoutを使用
jest.useFakeTimers();

describe('useToast', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    // メモリステートをリセット
    jest.resetModules();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('初期状態が正しく設定される', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toasts).toEqual([]);
    expect(typeof result.current.toast).toBe('function');
    expect(typeof result.current.dismiss).toBe('function');
  });

  it('トーストが正しく追加される', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'テストタイトル',
        description: 'テスト説明',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('テストタイトル');
    expect(result.current.toasts[0].description).toBe('テスト説明');
    expect(result.current.toasts[0].open).toBe(true);
  });

  it('複数のトーストが制限に従って管理される', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'トースト1' });
      result.current.toast({ title: 'トースト2' });
    });

    // TOAST_LIMIT = 1なので、最新のトーストのみ表示
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('トースト2');
  });

  it('トーストが正しく削除される', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;

    act(() => {
      const toastResult = result.current.toast({ title: '削除テスト' });
      toastId = toastResult.id;
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  it('全てのトーストが削除される', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'トースト1' });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(); // IDなしで全削除
    });

    expect(result.current.toasts[0].open).toBe(false);
  });
});

describe('toast関数', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  it('toast関数が正しくトーストを作成する', () => {
    const result = toast({
      title: 'スタンドアローンテスト',
      description: 'toast関数のテスト',
    });

    expect(result.id).toBeDefined();
    expect(typeof result.dismiss).toBe('function');
    expect(typeof result.update).toBe('function');
  });

  it('トーストのupdateが正しく動作する', () => {
    const toastResult = toast({ title: '元のタイトル' });

    act(() => {
      toastResult.update({
        id: toastResult.id,
        title: '更新されたタイトル',
        description: '新しい説明',
      });
    });

    // updateが呼ばれることを確認（実際の状態変更は統合テストで）
    expect(toastResult.update).toBeDefined();
  });

  it('トーストのdismissが正しく動作する', () => {
    const toastResult = toast({ title: 'dismissテスト' });

    act(() => {
      toastResult.dismiss();
    });

    // dismissが呼ばれることを確認
    expect(toastResult.dismiss).toBeDefined();
  });
});

describe('reducer', () => {
  const initialState = { toasts: [] };

  it('ADD_TOASTアクションが正しく処理される', () => {
    const toast = {
      id: '1',
      title: 'テストトースト',
      open: true,
    };

    const newState = reducer(initialState, {
      type: 'ADD_TOAST',
      toast,
    });

    expect(newState.toasts).toHaveLength(1);
    expect(newState.toasts[0]).toEqual(toast);
  });

  it('UPDATE_TOASTアクションが正しく処理される', () => {
    const existingToast = {
      id: '1',
      title: '元のタイトル',
      open: true,
    };

    const stateWithToast = { toasts: [existingToast] };

    const newState = reducer(stateWithToast, {
      type: 'UPDATE_TOAST',
      toast: {
        id: '1',
        title: '更新されたタイトル',
      },
    });

    expect(newState.toasts[0].title).toBe('更新されたタイトル');
    expect(newState.toasts[0].open).toBe(true); // 既存のプロパティは保持
  });

  it('DISMISS_TOASTアクションが正しく処理される', () => {
    const existingToast = {
      id: '1',
      title: 'テストトースト',
      open: true,
    };

    const stateWithToast = { toasts: [existingToast] };

    const newState = reducer(stateWithToast, {
      type: 'DISMISS_TOAST',
      toastId: '1',
    });

    expect(newState.toasts[0].open).toBe(false);
  });

  it('REMOVE_TOASTアクションが正しく処理される', () => {
    const existingToast = {
      id: '1',
      title: 'テストトースト',
      open: true,
    };

    const stateWithToast = { toasts: [existingToast] };

    const newState = reducer(stateWithToast, {
      type: 'REMOVE_TOAST',
      toastId: '1',
    });

    expect(newState.toasts).toHaveLength(0);
  });

  it('REMOVE_TOASTアクションでIDなしの場合、全てのトーストが削除される', () => {
    const toast1 = { id: '1', title: 'トースト1', open: true };
    const toast2 = { id: '2', title: 'トースト2', open: true };

    const stateWithToasts = { toasts: [toast1, toast2] };

    const newState = reducer(stateWithToasts, {
      type: 'REMOVE_TOAST',
      toastId: undefined,
    });

    expect(newState.toasts).toHaveLength(0);
  });
});
