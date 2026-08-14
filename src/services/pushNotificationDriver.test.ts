import { describe, it, expect, vi, beforeEach } from 'vitest';

const axiosPost = vi.fn();
const userFind = vi.fn();
const updateMany = vi.fn();
const logSave = vi.fn();
const pushLogCtor = vi.fn();

vi.mock('axios', () => ({
  default: { post: (...args: unknown[]) => axiosPost(...args) },
}));

vi.mock('../models/AppUser', () => ({
  default: {
    find: (...args: unknown[]) => userFind(...args),
    updateMany: (...args: unknown[]) => updateMany(...args),
  },
}));

vi.mock('../models/PushNotificationLog', () => ({
  PushNotificationLog: vi.fn(function (this: any, fields: unknown) {
    Object.assign(this, fields as object);
    this.save = logSave;
  }),
}));

import { PushNotificationDriver } from './pushNotificationDriver';
import { PushNotificationLog } from '../models/PushNotificationLog';

beforeEach(() => {
  vi.clearAllMocks();
  userFind.mockResolvedValue([]);
  logSave.mockResolvedValue(undefined);
});

const validToken = 'ExponentPushToken[abc]';
const pushTo = (to: string) => ({ to, title: 'T', body: 'B', data: { type: 'test_event' } });

describe('PushNotificationDriver.sendBatch', () => {
  it('posts to Expo, records the awaited-receipt audit log, and returns the ticket id', async () => {
    axiosPost.mockResolvedValue({ data: { data: [{ status: 'ok', id: 'ticket-1' }] } });

    const result = await PushNotificationDriver.sendBatch([pushTo(validToken)]);

    expect(result.delivered).toEqual([true]);
    expect(result.ticketIds).toEqual(['ticket-1']);
    expect(axiosPost).toHaveBeenCalledTimes(1);
    expect(axiosPost.mock.calls[0][0]).toBe('https://exp.host/--/api/v2/push/send');
    expect(axiosPost.mock.calls[0][1]).toEqual([
      expect.objectContaining({ to: validToken, title: 'T', body: 'B', priority: 'high' }),
    ]);
    expect(PushNotificationLog).toHaveBeenCalledWith({
      token: validToken,
      title: 'T',
      dataType: 'test_event',
      ticketId: 'ticket-1',
      status: 'pending',
      error: undefined,
    });
    expect(logSave).toHaveBeenCalled();
  });

  it('skips non-Expo tokens without posting or logging', async () => {
    const result = await PushNotificationDriver.sendBatch([pushTo('not-an-expo-token')]);

    expect(result.delivered).toEqual([false]);
    expect(result.ticketIds).toEqual([null]);
    expect(axiosPost).not.toHaveBeenCalled();
    expect(PushNotificationLog).not.toHaveBeenCalled();
  });

  it('skips opted-out users without posting or logging, but counts them as delivered', async () => {
    userFind.mockResolvedValue([{ fcmToken: validToken }]);
    axiosPost.mockResolvedValue({ data: { data: [] } });

    const result = await PushNotificationDriver.sendBatch([pushTo(validToken)]);

    expect(result.delivered).toEqual([true]);
    expect(axiosPost).not.toHaveBeenCalled();
    expect(PushNotificationLog).not.toHaveBeenCalled();
  });

  it('clears DeviceNotRegistered tokens and logs the failure', async () => {
    axiosPost.mockResolvedValue({
      data: {
        data: [
          {
            status: 'error',
            message: 'DeviceNotRegistered',
            details: { error: 'DeviceNotRegistered' },
          },
        ],
      },
    });

    const result = await PushNotificationDriver.sendBatch([pushTo(validToken)]);

    expect(result.delivered).toEqual([false]);
    expect(result.ticketIds).toEqual([null]);
    expect(updateMany).toHaveBeenCalledWith({ fcmToken: validToken }, { $unset: { fcmToken: '' } });
    expect(PushNotificationLog).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'failed', error: 'DeviceNotRegistered' })
    );
    expect(logSave).toHaveBeenCalled();
  });

  it('chunks large batches at 100 messages per request', async () => {
    axiosPost.mockResolvedValue({
      data: {
        data: Array.from({ length: 100 }, (_, i) => ({ status: 'ok', id: `t${i}` })),
      },
    });
    const many = Array.from({ length: 101 }, (_, i) => pushTo(`ExponentPushToken[t${i}]`));

    const result = await PushNotificationDriver.sendBatch(many);

    expect(axiosPost).toHaveBeenCalledTimes(2);
    expect(axiosPost.mock.calls[0][1]).toHaveLength(100);
    expect(axiosPost.mock.calls[1][1]).toHaveLength(1);
    expect(result.delivered.filter(Boolean)).toHaveLength(101);
    expect(result.ticketIds.filter(Boolean)).toHaveLength(101);
  });
});
