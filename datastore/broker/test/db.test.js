"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_testing_1 = require("@ulixee/datastore-testing");
const Fs = require("node:fs");
const Path = require("node:path");
const db_1 = require("../db");
const storageDir = Path.resolve(process.env.ULX_DATA_DIR ?? '.', 'broker.db.test');
beforeEach(() => {
    if (Fs.existsSync(storageDir))
        Fs.rmSync(storageDir, { recursive: true });
});
afterEach(datastore_testing_1.Helpers.afterEach);
afterAll(datastore_testing_1.Helpers.afterAll);
it('can store organization data', async () => {
    const db = new db_1.default(storageDir);
    datastore_testing_1.Helpers.needsClosing.push(db);
    expect(db.organizations.totalGranted()).toBe(0n);
    const org1 = db.organizations.create('test', 10n);
    expect(db.organizations.totalGranted()).toBe(10n);
    db.organizations.grant(org1, 100n);
    expect(db.organizations.totalGranted()).toBe(110n);
    db.organizations.debit(org1, 50n);
    expect(db.organizations.totalBalance()).toBe(60n);
    expect(db.organizations.get(org1).balance).toBe(60n);
    expect(db.organizations.get(org1).balanceInChannelHolds).toBe(50n);
    db.organizations.settle(org1, 10n, 50n);
    expect(db.organizations.get(org1).balance).toBe(70n);
    expect(db.organizations.get(org1).balanceInChannelHolds).toBe(0n);
    db.organizations.updateName(org1, 'new name');
    expect(db.organizations.get(org1).name).toBe('new name');
    db.organizations.create('test2', 20n);
    expect(db.organizations.count()).toBe(2);
    expect(db.organizations.list().length).toBe(2);
    db.organizations.delete(org1);
    expect(db.organizations.count()).toBe(1);
});
it('can store user data', async () => {
    const db = new db_1.default(storageDir);
    datastore_testing_1.Helpers.needsClosing.push(db);
    const org1 = db.organizations.create('org1', 10n);
    const org2 = db.organizations.create('org2', 20n);
    db.users.create('user1', 'name1', org1);
    db.users.create('user2', 'name2', org1);
    db.users.create('user3', 'name3', org2);
    expect(db.users.count()).toBe(3);
    expect(db.users.listByOrganization(org1).length).toBe(2);
    expect(db.users.listByOrganization(org2).length).toBe(1);
    db.users.editName('user1', 'new name');
    expect(db.users.getOrganizationId('user1')).toBe(org1);
    expect(db.users.getOrganizationId('user2')).toBe(org1);
    expect(db.users.getOrganizationId('user3')).toBe(org2);
    db.users.delete('user1');
    expect(db.users.count()).toBe(2);
});
it('can store channelHold data', async () => {
    const db = new db_1.default(storageDir);
    datastore_testing_1.Helpers.needsClosing.push(db);
    const org1 = db.organizations.create('org1', 10n);
    db.users.create('user1', 'name1', org1);
    db.users.create('user2', 'name2', org1);
    db.channelHolds.create({
        channelHoldId: '1',
        heldMicrogons: 10n,
        domain: 'test',
        organizationId: org1,
        settledMicrogons: 0n,
        settlementDate: null,
        createdByIdentity: 'user1',
        created: Date.now(),
    });
    expect(db.channelHolds.pendingBalance()).toBe(10n);
    db.channelHolds.create({
        channelHoldId: '2',
        heldMicrogons: 20n,
        domain: 'test',
        organizationId: org1,
        settledMicrogons: 0n,
        settlementDate: null,
        createdByIdentity: 'user2',
        created: Date.now(),
    });
    expect(db.channelHolds.count()).toBe(2);
    expect(db.channelHolds.countOpen()).toBe(2);
    expect(db.channelHolds.pendingBalance()).toBe(30n);
    const result = db.channelHolds.updateSettlementReturningChange('1', 5n, Date.now());
    expect(result[0]).toBe(org1);
    expect(result[1]).toBe(10n);
    expect(db.channelHolds.countOpen()).toBe(1);
    expect(db.channelHolds.pendingBalance()).toBe(20n);
    const result2 = db.channelHolds.updateSettlementReturningChange('2', 20n, Date.now());
    expect(result2[0]).toBe(org1);
    expect(result2[1]).toBe(20n);
    expect(db.channelHolds.countOpen()).toBe(0);
    expect(db.channelHolds.pendingBalance()).toBe(0n);
});
//# sourceMappingURL=db.test.js.map