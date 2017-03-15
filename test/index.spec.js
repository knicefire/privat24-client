const sinon = require('sinon');
const {expect} = require('chai');
const Privat = require('../lib');

describe('Privat24 Client', () => {
    describe('Constructor', () => {
        const assertionTest = (opts, assertion) => {
            expect(() => new Privat(opts)).to.throw(assertion);
        };

        it('should require merchantId to be defined', () => {
            const opts = undefined;

            assertionTest(opts, 'AssertionError: \'merchantId\' is required');
        });

        it('should require password to be defined', () => {
            const opts = {
                merchantId: 123321
            };

            assertionTest(opts, 'AssertionError: \'password\' is required');
        });

        it('should require cardnumber to be defined', () => {
            const opts = {
                merchantId: 123321,
                password: '12332112sdfasdf'
            };

            assertionTest(opts, 'AssertionError: \'cardnumber\' is required');
        });

        it('should apply default country to UA', () => {
            const opts = {
                merchantId: 123321,
                password: '12332112sdfasdf',
                cardnumber: '31212312'
            };

            const card = new Privat(opts);

            expect(card.country).to.equal('UA');
        });

        it('should have proper interface to be defined', () => {
            const opts = {
                merchantId: 123321,
                password: '12332112sdfasdf',
                cardnumber: '31212312',
                country: 'UA'
            };

            const card = new Privat(opts);

            expect(card.balance).to.be.a('function', 'No balance method implemented');
            expect(card.statements).to.be.a('function', 'No statements method implemented');
        });
    });

    xdescribe('Balance', () => {
        let card;
        let balance;

        beforeEach(() => {
            card = new Privat({
                merchant: 12321,
                password: '12321sdfasdf',
                cardnumber: '1233321231',
                country: 'UA'
            });

            balance = sinon.spy(card, 'balance').and.stub();
        });

        afterEach(() => {
            balance.restore();
        });
    });
});
