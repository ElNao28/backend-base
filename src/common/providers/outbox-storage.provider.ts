import { Provider } from '@nestjs/common';
import { OutboxStorage } from '@nestjs/outbox';
import { fromTypeOrm, PostgresOutboxStore } from '@nestjs/outbox/postgres';
import { DataSource } from 'typeorm';

export const OutBoxStorageProvider: Provider = {
  provide: PostgresOutboxStore,
  useFactory: (datasource: DataSource, outboxStorage: OutboxStorage) =>
    new PostgresOutboxStore(
      {
        executor: fromTypeOrm(datasource),
      },
      outboxStorage,
    ),
  inject: [DataSource, OutboxStorage],
};
