import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import Database from '../database.mjs';

function createTempResources(files) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dbtest-'));
    for (const [filename, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(tmpDir, filename), content);
    }
    return tmpDir;
}

test('Database loads data from .txt files', async (t) => {
    const files = {
        'users.txt': 'id|name|DateTime\n1|Alice|2024-06-01T10:00\n2|Bob|2024-06-02T12:30',
        'orders.txt': 'orderId|amount|DateTime\n101|50|2024-06-01T09:00\n102|75|2024-06-03T15:45',
    };
    const tmpDir = createTempResources(files);
    const db = new Database({ resourcesDir: tmpDir, fsModule: fs, pathModule: path });
    assert.deepEqual(db.data.users, [
        { id: '1', name: 'Alice', DateTime: '2024-06-01T10:00' },
        { id: '2', name: 'Bob', DateTime: '2024-06-02T12:30' },
    ]);
    assert.deepEqual(db.data.orders, [
        { orderId: '101', amount: '50', DateTime: '2024-06-01T09:00' },
        { orderId: '102', amount: '75', DateTime: '2024-06-03T15:45' },
    ]);
    fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('byTypes returns correct data', async (t) => {
    const files = {
        'users.txt': 'id|name|DateTime\n1|Alice|2024-06-01T10:00\n2|Bob|2024-06-02T12:30',
    };
    const tmpDir = createTempResources(files);
    const db = new Database({ resourcesDir: tmpDir, fsModule: fs, pathModule: path });
    assert.deepEqual(db.byTypes(['users']), {
        users: [
            { id: '1', name: 'Alice', DateTime: '2024-06-01T10:00' },
            { id: '2', name: 'Bob', DateTime: '2024-06-02T12:30' },
        ],
    });
    fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('filterByTime returns filtered data', async (t) => {
    const files = {
        'users.txt': 'id|name|DateTime\n1|Alice|2024-06-01T10:00\n2|Bob|2024-06-02T12:30',
    };
    const tmpDir = createTempResources(files);
    const db = new Database({ resourcesDir: tmpDir, fsModule: fs, pathModule: path });
    const result = db.filterByTime(['users'], '2024-06-01T09:00', '2024-06-01T10:00');
    assert.deepEqual(result, {
        users: [{ id: '1', name: 'Alice', DateTime: '2024-06-01T10:00' }],
    });
    fs.rmSync(tmpDir, { recursive: true, force: true });
});
