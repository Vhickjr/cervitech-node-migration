import { describe, it, expect, vi, beforeEach } from 'vitest';

const logFind = vi.fn();
const getReceipts = vi.fn();
const clearToken = vi.fn();
const notifyFailure = vi.fn();

vi.mock('../models/PushNotificationLog', () => ({
  PushNotificationLog: { find: (...args: unknown[]) => logFind(...args) },
}));

vi.mock('../services/pushNotificationDriver', () => ({
  PushNotificationDriver: { getReceipts: (...args: unknown[]) => getReceipts(...args) },
  clearInvalidToken: (...args: unknown[]) => clearToken(...args),
}));

vi.mock('../services/pushAlert.service', () => ({
  notifyPushFailure: (...args: unknown[]) => notifyFailure(...args),
}));

import { runPushReceiptPolling } from './pushReceipts.job';

const NOW = new Date('2026-08-14T12:00:00Z');
const pendingLog = (ticketId: string, extra: object = {}) => {
  const log = {
    _id: ticketId,
    token: 'ExponentPushToken[abc]',
    title: 'Goal reminder',
    dataType: 'goal_reminder',
    ticketId,
    status: 'pending',
    deliveredAt: undefined as Date | undefined,
    error: undefined as string | undefined,
    save: vi.fn().mockResolvedValue(undefined),
    ...extra,
  };
  return log;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('runPushReceiptPolling', () => {
  it('marks pending logs as delivered when Expo confirms delivery', async () => {
    const log = pendingLog('t1');
    logFind.mockResolvedValue([log]);
    getReceipts.mockResolvedValue({ t1: { status: 'ok', id: 't1' } });

    const processed = await runPushReceiptPolling(NOW);

    expect(processed).toBe(1);
    expect(log.status).toBe('delivered');
    expect(log.deliveredAt).toEqual(NOW);
    expect(log.save).toHaveBeenCalled();
    expect(notifyFailure).not.toHaveBeenCalled();
  });

  it('marks DeviceNotRegistered as failed, clears the token, and raises an alert', async () => {
    const log = pendingLog('t1');
    logFind.mockResolvedValue([log]);
    getReceipts.mockResolvedValue({
      t1: {
        status: 'error',
        message: 'DeviceNotRegistered',
        details: { error: 'DeviceNotRegistered' },
      },
    });

    const processed = await runPushReceiptPolling(NOW);

    expect(processed).toBe(1);
    expect(log.status).toBe('failed');
    expect(log.error).toBe('DeviceNotRegistered');
    expect(clearToken).toHaveBeenCalledWith('ExponentPushToken[abc]');
    expect(notifyFailure).toHaveBeenCalledWith(expect.stringContaining('1 push(es) not delivered'));
  });

  it('keeps logs awaiting Expo confirmation untouched', async () => {
    const log = pendingLog('t1');
    logFind.mockResolvedValue([log]);
    getReceipts.mockResolvedValue({});

    const processed = await runPushReceiptPolling(NOW);

    expect(processed).toBe(1);
    expect(log.status).toBe('pending');
    expect(log.save).not.toHaveBeenCalled();
    expect(notifyFailure).not.toHaveBeenCalled();
  });

  it('does nothing when there are no pending logs', async () => {
    logFind.mockResolvedValue([]);

    const processed = await runPushReceiptPolling(NOW);

    expect(processed).toBe(0);
    expect(getReceipts).not.toHaveBeenCalled();
  });

  it('only polls logs older than the receipts grace period', async () => {
    logFind.mockResolvedValue([]);

    await runPushReceiptPolling(NOW);

    expect(logFind).toHaveBeenCalledWith({
      status: 'pending',
      ticketId: { $exists: true },
      sentAt: { $lte: expect.any(Date) },
    });
  });
});
