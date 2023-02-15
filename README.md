![Logo](admin/pbx-3cx.png)

# ioBroker.pbx-3cx

[![NPM version](https://img.shields.io/npm/v/iobroker.pbx-3cx.svg)](https://www.npmjs.com/package/iobroker.pbx-3cx)
[![Downloads](https://img.shields.io/npm/dm/iobroker.pbx-3cx.svg)](https://www.npmjs.com/package/iobroker.pbx-3cx)
![Number of Installations](https://iobroker.live/badges/pbx-3cx-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/pbx-3cx-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.pbx-3cx.png?downloads=true)](https://nodei.co/npm/iobroker.pbx-3cx/)

**Tests:** ![Test and Release](https://github.com/Schnup89/ioBroker.pbx-3cx/workflows/Test%20and%20Release/badge.svg)

## pbx-3cx adapter for ioBroker

**[DE]**  
Mit diesem Adapter kannst du Daten aus deiner 3CX-Telefonanlage zyklisch in ioBroker übertragen.

**[EN ]**  
This Adapter allows you to fetch Data from your 3CX-PBX to ioBroker.

## Setup / Konfiguration

**[DE]**  
In der Adapter-Konfiguration unter Instanzen -> pbx-3CX -> Einstellungen müssen folgende Werte eingetragen werden:  
URL-Format: https://deine_pbx_ip_oder_dns_name:5001/api  
Username: admin, root oder nebenstelle, je nach Konfiguration  
Passwort: geheim :)

Jeder API-Endpunkt kann aktiviert und deaktiviert werden. Zusätzlich kann der Abfrageintervall für einzelne API-Endpunkte auf 1 Sekunde verkürzt werden (Livedata).  
Der Standard-Aktualisierungsinterval kann in der Adapter-Config angegeben werden kann.
Bitte aktiviert nur API-Endpunkte die Ihr wirklich benötigt (vor allem Livedata), jede Abfrage benötige entsprechende Performance auf beiden Seiten.

**[EN]**  
To connect to yopur 3CX-PBX you have to fill out the connection parameter in the adapter-configuration (Instances -> pbx-3CX -> Settings)  
URL-Format: https://your_pbx_ip_or_dns_name:5001/api  
Username: admin, root or extension, depending on the config  
Password: your secret :)

Any API-Endpoint can be enabled or disabled. In addition, the polling interval for individual API-Endpoints can be shortened to 1 second (Livedata).  
The default update interval can be specified in the adapter config.
Please activate only API-Endpoints that you really need (especially live data), each query has performance impacts on both sides.

## Usage / Benutzung

**[DE]**  
Ist die Verbindung hergestellt, werden die aktivierten API-Endpunkte abgefragt und das Ergebnis als JSON-Wert unter den Adapter-Objekt gespeichert.

**[EN]**  
Once connected, the enabled API-Endpoints are queried and the result is stored as a JSON value under the Adapter object.

![image](https://user-images.githubusercontent.com/28166743/218329154-904c0a8e-1310-44ce-a699-f1b2446da436.png)

## Troubleshooting/Feature-Request / Problembehandlung/Änderungswünsche

**[DE]**  
Bei Problemne mit dem Adapter bitte in der Instanzkonfiguration das "Debugging" des Adapters aktivieren und einen Issue eröffnen mit einer Beschreibung des Problem und den Logs.  
Änderungswünsche (Neue API-Endpoints, etc.) gerne auch per Github Issue oder ioBroker Forum (Tag me: https://forum.iobroker.net/user/schnup89) melden.

**[EN]**  
If you have problems with the Adapter, please activate the "Debugging" Option in the adapter-instance configuration and open an issue with a description of the problem and the logs.
Feel free to report Feature-Requests (new API endpoints, etc.) via Github issue or ioBroker Forum (Tag me: https://forum.iobroker.net/user/schnup89)

## Changelog

### 1.0.0 (2023-02-15)

-   (schnup89) First Release, Removed Debug-Code

### 0.0.3 (2023-02-13)

-   (schnup89) Bugfix: Suppress multiple Cookie Requests

### 0.0.2 (2023-02-12)

-   (schnup89) Bugfix: Update PR Dependencies
-   (schnup89) Bugfix: Removed debug declaration with causes Test and Release to fail.

### 0.0.1 (2023-02-12)

-   (schnup89) Initial Release

###

## License

MIT License

Copyright (c) 2023 Schnup89 <tobias_tsafi@gmx.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
