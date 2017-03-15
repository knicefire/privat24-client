const assert = require('assert');
const fetch = require('node-fetch');
const sha1 = require('sha1');
const md5 = require('md5');
const xml2json = require('xml2json');
const moment = require('moment');

const DATE_FORMAT = 'DD.MM.YYYY';

const DATES = {
    today: () => moment().format(DATE_FORMAT),
    oneMonthAgo: () => moment().subtract(1, 'month').format(DATE_FORMAT)
}

function isRequired(field) {
    return assert(false, `'${field}' is required`);
}

class Privat {
    constructor(opts = {}) {
        const {
            merchantId = isRequired('merchantId'),
            password = isRequired('password'),
            cardnumber = isRequired('cardnumber'),
            country = 'UA'
        } = opts;

        Object.assign(this, opts);
    }

    _getSignature(data) {
        return sha1(md5(`${data}${this.password}`));
    }

    _request(url, data) {
        /* Normalizing data string. Removing spaces and newlines */
        data = data.trim().replace(/>(\n*\s*)</g, '><');

        const body = `<?xml version="1.0" encoding="UTF-8"?>
            <request version="1.0">
                <merchant>
                    <id>${this.merchantId}</id>
                    <signature>${this._getSignature(data)}</signature>
                </merchant>
                <data>${data}</data>
            </request>`;

        return fetch(url, {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/xml'
            }
        })
        .then(res => res.text())
        .then(text => {
            console.log(text);
            return text;
        })
        .then(text => JSON.parse(xml2json.toJson(text)));
    }

    balance() {
        const data = `
            <oper>cmt</oper>
            <wait>0</wait>
            <test>0</test>
            <payment id="">
                <prop name="cardnum" value="${this.cardnumber}" />
                <prop name="country" value="${this.country}" />
            </payment>`;

        return this._request('https://api.privatbank.ua/p24api/balance', data);
    }

    statements(startDate = DATES.oneMonthAgo(), endDate = DATES.today()) {
        const data = `
            <oper>cmt</oper>
            <wait>0</wait>
            <test>0</test>
            <payment id="">
                <prop name="sd" value="${startDate}" />
                <prop name="ed" value="${endDate}" />
                <prop name="card" value="${this.cardnumber}" />
            </payment>`;

        return this._request('https://api.privatbank.ua/p24api/rest_fiz', data);
    }
}

module.exports = Privat;
