'use strict';

const utils = require('@iobroker/adapter-core');

const axios = require('axios');
const { debug } = require('console');
const https = require('https');
let sCookie = 'bad';
let tmr_GetValues = null;
let tmr_GetValues_Live = null;
let bApiConnected = false;

class Pbx3cx extends utils.Adapter {
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    constructor(options) {
        super({
            ...options,
            name: 'pbx-3cx',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));

        this.ApiClient3CX = null;
    }

    async onReady() {
        // Reset the connection indicator during startup
        this.setState('info.connection', false, true);
        // Pre-Start checks
        if (this.config.sHost == undefined || this.config.sUser == undefined || this.config.sPass == undefined) {
            this.log.error('Parameter missing - please check instance configuration!');
            return;
        }
        if (this.config.sRefresh < 5 || this.config.sRefresh > 10000) {
            this.log.error('Refresh interval should be between 5 and 10000 - please check instance configuration!');
            return;
        }

        // Create HTTP API Object
        this.ApiClient3CX = axios.create({
            baseURL: this.config.sHost,
            timeout: 1000,
            headers: { 'Content-Type': 'application/json' },
            responseEncoding: 'utf8',
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });
        this.log.debug('Axios-Client created!');

        // Get new Cookie on startup
        await this.getNewCookie();

        // Print PBX DNS Name and Version
        const oRes = await this.ApiClient3CX.request({
            url: 'systemstatus',
            method: 'get',
            headers: { Cookie: sCookie },
        }).catch((sErr) => {
            this.log.error('Error get PBX info: ' + sErr);
            sCookie = 'bad';
        });
        // Check for valid Response
        if (oRes != undefined) {
            if (oRes.status == 200) {
                this.log.info(
                    'Connection to 3CX ' +
                        JSON.parse(JSON.stringify(oRes.data.FQDN)) +
                        ' (' +
                        JSON.parse(JSON.stringify(oRes.data.Version)) +
                        ') successful.',
                );
                // All Connection-Check OK, set API Connected
                this.setApiConnection(true);
            } else {
                this.log.error('Error fetching PBX-Informations from API!');
            }
        } else {
            this.log.error('Error fetching PBX-Informations from API!');
        }

        // Create IO-Objects
        this.config.aAPIEndpoints.forEach((oEntry) => {
            if (oEntry.bEnabled) {
                this.setObjectNotExists(oEntry.sEP.split(/[^a-z/]/i)[0], {
                    type: 'state',
                    common: {
                        type: 'json',
                        role: 'state',
                    },
                    native: {},
                });
            }
        });

        // Start Data-Refresh-Loops (even if connection is not valid)
        this.startDataLoop();
        this.startLiveDataLoop();
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
            // Stop DataLoop's on exit
            this.clearTimeout(tmr_GetValues);
            this.clearTimeout(tmr_GetValues_Live);

            callback();
        } catch (e) {
            callback();
        }
    }

    //######### Custom Functions

    // Get new Cookie from API
    async getNewCookie() {
        await this.ApiClient3CX.request({
            url: 'login',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: '{"Username":"' + this.config.sUser + '","Password":"' + this.config.sPass + '"}',
        })
            .then(function (res) {
                // On successful request, remember Cookie
                sCookie = res.headers['set-cookie'].toString().split(';')[0];
                return;
            })
            .catch((sErr) => {
                // On error request, set bad Cookie, set Apiconnection and print error in IOBroker
                this.log.warn('Error getting Cookie: ' + sErr);
                sCookie = 'bad';
                this.setApiConnection(false);
                return;
            });
        this.log.debug('Got Cookie: ' + sCookie);
    }

    async startDataLoop() {
        // Set Timer for next Refresh
        tmr_GetValues = setTimeout(() => this.startDataLoop(), this.config.sRefresh * 1000);

        // Loop through every APIEndpoint enabled in Adapter-Config (enabled, not live)
        if (bApiConnected) {
            this.config.aAPIEndpoints.forEach((oEntry) => {
                if (oEntry.bEnabled && !oEntry.bLive) {
                    this.getJsonData(oEntry.sEP);
                }
            });
        } else {
            // Get SystemStatus Endpoint if connection is lost (Device-Online-Check)
            this.getJsonData('SystemStatus');
        }
        // Request SystemStatus if it is not enabled in admin-config for (Device-Online-Check)
        if (this.config.aAPIEndpoints.findIndex((oEntry) => oEntry.sEP == 'SystemStatus') == -1)
            this.getJsonData('SystemStatus');
    }

    async startLiveDataLoop() {
        // Set Timer for next Refresh
        tmr_GetValues_Live = setTimeout(() => this.startLiveDataLoop(), 1000);

        // Loop through every APIEndpoint enabled in Adapter-Config (enabled, and live)
        if (bApiConnected) {
            this.config.aAPIEndpoints.forEach((oEntry) => {
                if (oEntry.bEnabled && oEntry.bLive) {
                    this.getJsonData(oEntry.sEP);
                }
            });
        }
    }

    async getJsonData(sEP) {
        this.log.debug('Update json of ' + sEP);
        const oRes = await this.ApiClient3CX.request({
            url: sEP,
            method: 'get',
            headers: { Cookie: sCookie },
        }).catch((sErr) => {
            // Sometimes sErr.response.status is not accessible, then return connection false
            try {
                // If http-code is Unathorized (401), get new cookie
                if (sErr.response.status == 401) {
                    this.log.debug('Result: Unathorized (HTTP401)');
                    this.getNewCookie();
                    return;
                } else {
                    // Print error and set Device Online-Check
                    this.log.warn('Error get PBX info: ' + sErr);
                    if (sEP == 'SystemStatus') this.setApiConnection(false);
                }
            } catch (err) {
                // Print error and set Device Online-Check
                this.log.warn('Error get PBX info: ' + sErr);
                if (sEP == 'SystemStatus') this.setApiConnection(false);
            }
        });
        if (oRes != undefined) {
            if (oRes.status == 200) {
                // Print error and set Device Online-Check
                this.setStateChangedAsync(sEP, { val: JSON.stringify(oRes.data), ack: true });
                if (sEP == 'SystemStatus') this.setApiConnection(true);
            }
        } else {
            // Print error and set Device Online-Check
            this.log.warn('Error getting Endpoint: ' + sEP);
            if (sEP == 'SystemStatus') this.setApiConnection(false);
        }
    }

    async setApiConnection(bStatus) {
        // Nothing to do if no status change
        if (bApiConnected == bStatus) return;
        // Set ioBroker Devicestatus and Log
        bApiConnected = bStatus;
        await this.setStateChangedAsync('info.connection', { val: bStatus, ack: true });
        // Print error if connection is lost
        if (!bStatus) this.log.error('PBX-Connection Changed isConnected: ' + bStatus);
        else this.log.warn('PBX-Connection Changed isConnected: ' + bStatus);
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new Pbx3cx(options);
} else {
    // otherwise start the instance directly
    new Pbx3cx();
}
