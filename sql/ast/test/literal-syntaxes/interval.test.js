"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../testing/helpers");
const IntervalUtils_1 = require("../../lib/helpers/IntervalUtils");
describe('Interval literals', () => {
    (0, helpers_1.checkInterval)(['2 year',
        '2 years',
        '2 YEARS',
        '2 yr',
        '2 yrs',
        '2yrs',
        '2 y',
        '2y',
        'P2Y'], { years: 2 });
    (0, helpers_1.checkInterval)(['2 mons',
        '2 months',
        '2 month',
        '2month',
        'P2M',
    ], { months: 2 });
    (0, helpers_1.checkInterval)(['2 days',
        '2 day',
        '2 d',
        '2d',
        'P2D',
    ], { days: 2 });
    (0, helpers_1.checkInterval)(['2 h',
        '2 hours',
        '2 hrs',
    ], { hours: 2 });
    (0, helpers_1.checkInterval)(['2 m',
        '2 min',
        '2 mins',
    ], { minutes: 2 });
    (0, helpers_1.checkInterval)(['2 sec',
        '2 s',
        '2 secs',
    ], { seconds: 2 });
    (0, helpers_1.checkInterval)(['2 ms',
        '2 millisecond',
        '2 milliseconds',
    ], { milliseconds: 2 });
    (0, helpers_1.checkInterval)('-1 hours', { hours: -1 });
    (0, helpers_1.checkInterval)('P1W', { days: 7 });
    (0, helpers_1.checkInterval)('P-1Y1D', { years: -1, days: 1 });
    (0, helpers_1.checkInterval)('P-1.5Y1M2D', { years: -1, months: -5, days: 2 });
    (0, helpers_1.checkInterval)('-2.5 hours', { hours: -2, minutes: -30 });
    (0, helpers_1.checkInterval)('-2.5 hours 5 mins', { hours: -2, minutes: -25 });
    (0, helpers_1.checkInterval)('1 hours -65 mins', { minutes: -5 });
    (0, helpers_1.checkInterval)('P1.5D', { days: 1, hours: 12 });
    (0, helpers_1.checkInterval)('P-1.5D', { days: -1, hours: -12 });
    (0, helpers_1.checkInterval)('P-1.5DT2M', { days: -1, hours: -11, minutes: -58 });
    (0, helpers_1.checkInterval)('P1D2M1Y', { days: 1, months: 2, years: 1 });
    (0, helpers_1.checkInterval)('P1D2D', { days: 3 });
    (0, helpers_1.checkInterval)('PT1M2M', { minutes: 3 });
    (0, helpers_1.checkInterval)('PT-1MT2MT1H', { minutes: 1, hours: 1 });
    (0, helpers_1.checkInterval)('PT70S', { minutes: 1, seconds: 10 });
    (0, helpers_1.checkInterval)('PT120M', { hours: 2 });
    (0, helpers_1.checkInterval)('P500D', { days: 500 });
    (0, helpers_1.checkInterval)('1:00:00', { hours: 1 });
    (0, helpers_1.checkInterval)('1:2:3.004', { hours: 1, minutes: 2, seconds: 3, milliseconds: 4 });
    (0, helpers_1.checkInterval)('1:2.003 4y', { minutes: 1, seconds: 2, milliseconds: 3, years: 4 });
    (0, helpers_1.checkInterval)('1 year 40 days 1 minute', { years: 1, days: 40, minutes: 1 });
    (0, helpers_1.checkInterval)(`2 years 13 months 50 days`, { years: 3, months: 1, days: 50 });
    (0, helpers_1.checkInterval)(`2 years 13 months`, { years: 3, months: 1 });
    (0, helpers_1.checkInterval)(`2 years -13 months 50 days`, { months: 11, days: 50 });
    it('produces a string', () => {
        expect((0, IntervalUtils_1.intervalToString)({ years: 1 })).toEqual('1 year');
        expect((0, IntervalUtils_1.intervalToString)({ years: -1 })).toEqual('-1 years');
        expect((0, IntervalUtils_1.intervalToString)({ years: 2 })).toEqual('2 years');
        expect((0, IntervalUtils_1.intervalToString)({ minutes: -2, seconds: 1 })).toEqual('-00:01:59');
        expect((0, IntervalUtils_1.intervalToString)({ milliseconds: 1 })).toEqual('00:00:00.001');
        expect((0, IntervalUtils_1.intervalToString)({ milliseconds: 10 })).toEqual('00:00:00.01');
    });
});
//# sourceMappingURL=interval.test.js.map