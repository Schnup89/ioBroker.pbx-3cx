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
        this.on('stateChange', this.onStateChange.bind(this));
        // this.on('objectChange', this.onObjectChange.bind(this));
        // this.on('message', this.onMessage.bind(this));
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
        if (oRes != undefined) {
            if (oRes.status == 200) {
                this.log.info(
                    'Verbindung zu 3CX ' +
                        JSON.parse(JSON.stringify(oRes.data.FQDN)) +
                        ' (' +
                        JSON.parse(JSON.stringify(oRes.data.Version)) +
                        ') erfolgreich.',
                );
                this.setApiConnection(true);
            } else {
                this.log.error('Error fetching PBX-Informations from API!');
            }
        } else {
            this.log.error('Error fetching PBX-Informations from API!');
        }

        // Create Objects
        this.config.aAPIEndpoints.forEach((oEntry) => {
            if (oEntry.bEnabled) {
                this.setObjectNotExists(oEntry.sEP, {
                    type: 'state',
                    common: {
                        type: 'json',
                        role: 'state',
                    },
                    native: {},
                });
            }
        });

        // Start Data-Refresh-Loops
        this.startDataLoop();

        this.startLiveDataLoop();
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
            this.clearTimeout(tmr_GetValues);
            this.clearTimeout(tmr_GetValues_Live);

            callback();
        } catch (e) {
            callback();
        }
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  * @param {string} id
    //  * @param {ioBroker.Object | null | undefined} obj
    //  */
    // onObjectChange(id, obj) {
    //     if (obj) {
    //         // The object was changed
    //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    //     } else {
    //         // The object was deleted
    //         this.log.info(`object ${id} deleted`);
    //     }
    // }

    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    onStateChange(id, state) {
        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
    //  * @param {ioBroker.Message} obj
    //  */
    // onMessage(obj) {
    //     if (typeof obj === 'object' && obj.message) {
    //         if (obj.command === 'send') {
    //             // e.g. send email or pushover or whatever
    //             this.log.info('send command');

    //             // Send response in callback if required
    //             if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
    //         }
    //     }
    // }

    // Get new Cookie from API
    async getNewCookie() {
        await this.ApiClient3CX.request({
            url: 'login',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: '{"Username":"' + this.config.sUser + '","Password":"' + this.config.sPass + '"}',
        })
            .then(function (res) {
                // Remember Cookie
                sCookie = res.headers['set-cookie'].toString().split(';')[0];
                return;
            })
            .catch((sErr) => {
                this.log.error('Error get PBX info: ' + sErr);
                sCookie = 'bad';
                return;
            });
        this.log.debug('Got Cookie: ' + sCookie);
    }

    async startDataLoop() {
        // Set Timer for next Refresh
        tmr_GetValues = setTimeout(() => this.startDataLoop(), this.config.sRefresh * 1000);

        if (bApiConnected) {
            this.config.aAPIEndpoints.forEach((oEntry) => {
                if (oEntry.bEnabled && !oEntry.bLive) {
                    this.getJsonData(oEntry.sEP);
                }
            });
        } else {
            // Refresh if connection is lost
            this.getJsonData('SystemStatus');
        }
        // Device Online-Check if SystemStatus is not choosen
        if (this.config.aAPIEndpoints.findIndex((oEntry) => oEntry.sEP == 'SystemStatus') == -1)
            this.getJsonData('SystemStatus');
    }

    async startLiveDataLoop() {
        // Set Timer for next Refresh
        tmr_GetValues_Live = setTimeout(() => this.startLiveDataLoop(), 1000);

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
            if (sErr.response) {
                this.getNewCookie();
                return;
            } else {
                this.log.error('Error get PBX info: ' + sErr);
                // Device Online-Check
                if (sEP == 'SystemStatus') this.setApiConnection(false);
            }
        });
        if (oRes != undefined) {
            if (oRes.status == 200) {
                this.setStateChangedAsync(sEP, { val: JSON.stringify(oRes.data), ack: true });
                // Device Online-Check
                if (sEP == 'SystemStatus') this.setApiConnection(true);
            }
        } else {
            this.log.error('Error getting Endpoint: ' + sEP);
            // Device Online-Check
            if (sEP == 'SystemStatus') this.setApiConnection(false);
        }
    }

    async setApiConnection(bStatus) {
        bApiConnected = bStatus;
        await this.setStateChangedAsync('info.connection', { val: bStatus, ack: true });
        this.log.debug('PBX-Connection Changed isConnected: ' + bStatus);
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
