import { renderHook, act } from '@testing-library/react';
import { useToast, toast, reducer } from '../use-toast';

describe('useToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // メモリ状態をリセット
    jest.resetModules();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('初期状態では空のtoasts配列を返す', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toasts).toEqual([]);
  });

  it('toastを追加できる', () => {
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

  it('複数のtoastを追加した場合、制限数（1個）まで表示される', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Toast 1' });
      result.current.toast({ title: 'Toast 2' });
      result.current.toast({ title: 'Toast 3' });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Toast 3'); // 最新のものが表示される
  });

  it('toastを手動で削除できる', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'テストtoast' });
    });

    expect(result.current.toasts).toHaveLength(1);
    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  it('全てのtoastを削除できる', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'Toast 1' });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(); // IDを指定しない場合は全て削除
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  it('toast関数から返されるオブジェクトでtoastを操作できる', () => {
    let toastInstance: any;

    act(() => {
      toastInstance = toast({ title: '更新テスト' });
    });

    expect(toastInstance.id).toBeDefined();
    expect(typeof toastInstance.dismiss).toBe('function');
    expect(typeof toastInstance.update).toBe('function');

    // 更新テスト
    act(() => {
      toastInstance.update({ title: '更新されたタイトル' });
    });

    const { result } = renderHook(() => useToast());
    expect(result.current.toasts[0].title).toBe('更新されたタイトル');

    // 削除テスト
    act(() => {
      toastInstance.dismiss();
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  it('onOpenChangeが呼ばれた時にtoastが削除される', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: 'テストtoast' });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].open).toBe(true);

    // onOpenChangeを呼び出してfalseを渡す
    act(() => {
      result.current.toasts[0].onOpenChange?.(false);
    });

    expect(result.current.toasts[0].open).toBe(false);
  });
});

describe('reducer', () => {
  const initialState = { toasts: [] };

  it('ADD_TOASTアクションでtoastを追加する', () => {
    const toast = {
      id: '1',
      title: 'テスト',
      open: true,
    };

    const newState = reducer(initialState, {
      type: 'ADD_TOAST',
      toast,
    });

    expect(newState.toasts).toHaveLength(1);
    expect(newState.toasts[0]).toEqual(toast);
  });

  it('ADD_TOASTで制限数を超えた場合、古いtoastが削除される', () => {
    const initialStateWithToast = {
      toasts: [{ id: '1', title: 'Toast 1', open: true }],
    };

    const newToast = {
      id: '2',
      title: 'Toast 2',
      open: true,
    };

    const newState = reducer(initialStateWithToast, {
      type: 'ADD_TOAST',
      toast: newToast,
    });

    expect(newState.toasts).toHaveLength(1);
    expect(newState.toasts[0].id).toBe('2'); // 新しいtoastのみ残る
  });

  it('UPDATE_TOASTアクションでtoastを更新する', () => {
    const initialStateWithToast = {
      toasts: [
        {
          id: '1',
          title: '元のタイトル',
          open: true,
        },
      ],
    };

    const newState = reducer(initialStateWithToast, {
      type: 'UPDATE_TOAST',
      toast: {
        id: '1',
        title: '更新されたタイトル',
      },
    });

    expect(newState.toasts[0].title).toBe('更新されたタイトル');
    expect(newState.toasts[0].open).toBe(true); // 他のプロパティは保持
  });

  it('UPDATE_TOASTで存在しないIDの場合、何も変更されない', () => {
    const initialStateWithToast = {
      toasts: [
        {
          id: '1',
          title: '元のタイトル',
          open: true,
        },
      ],
    };

    const newState = reducer(initialStateWithToast, {
      type: 'UPDATE_TOAST',
      toast: {
        id: '999', // 存在しないID
        title: '更新されたタイトル',
      },
    });

    expect(newState.toasts[0].title).toBe('元のタイトル'); // 変更されない
  });

  it('DISMISS_TOASTアクションでtoastを非表示にする', () => {
    const initialStateWithToast = {
      toasts: [
        {
          id: '1',
          title: 'テスト',
          open: true,
        },
      ],
    };

    const newState = reducer(initialStateWithToast, {
      type: 'DISMISS_TOAST',
      toastId: '1',
    });

    expect(newState.toasts[0].open).toBe(false);
  });

  it('DISMISS_TOASTアクションでIDを指定しない場合、全てのtoastを非表示にする', () => {
    const initialStateWithToasts = {
      toasts: [
        { id: '1', title: 'Toast 1', open: true },
        { id: '2', title: 'Toast 2', open: true },
      ],
    };

    const newState = reducer(initialStateWithToasts, {
      type: 'DISMISS_TOAST',
    });

    expect(newState.toasts.every((toast) => toast.open === false)).toBe(true);
  });

  it('REMOVE_TOASTアクションでtoastを削除する', () => {
    const initialStateWithToasts = {
      toasts: [
        { id: '1', title: 'Toast 1', open: true },
        { id: '2', title: 'Toast 2', open: true },
      ],
    };

    const newState = reducer(initialStateWithToasts, {
      type: 'REMOVE_TOAST',
      toastId: '1',
    });

    expect(newState.toasts).toHaveLength(1);
    expect(newState.toasts[0].id).toBe('2');
  });

  it('REMOVE_TOASTアクションでIDを指定しない場合、全てのtoastを削除する', () => {
    const initialStateWithToasts = {
      toasts: [
        { id: '1', title: 'Toast 1', open: true },
        { id: '2', title: 'Toast 2', open: true },
      ],
    };

    const newState = reducer(initialStateWithToasts, {
      type: 'REMOVE_TOAST',
    });

    expect(newState.toasts).toHaveLength(0);
  });
});
