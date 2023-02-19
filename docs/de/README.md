![Logo](../../admin/pbx-3cx.png)

## pbx-3cx adapter für ioBroker

Mit diesem Adapter kannst du Daten aus deiner 3CX-Telefonanlage zyklisch in ioBroker übertragen.

## Konfiguration

In der Adapter-Konfiguration unter Instanzen -> pbx-3CX -> Einstellungen müssen folgende Werte eingetragen werden:  
URL-Format: https://deine_pbx_ip_oder_dns_name:5001/api  
Username: admin, root oder nebenstelle, je nach Konfiguration  
Passwort: geheim :)

Jeder API-Endpunkt kann aktiviert und deaktiviert werden. Zusätzlich kann der Abfrageintervall für einzelne API-Endpunkte auf 1 Sekunde verkürzt werden (Livedata).  
Der Standard-Aktualisierungsinterval kann in der Adapter-Config angegeben werden kann.
Bitte aktiviert nur API-Endpunkte die Ihr wirklich benötigt (vor allem Livedata), jede Abfrage benötige entsprechende Performance auf beiden Seiten.

## Benutzung

Ist die Verbindung hergestellt, werden die aktivierten API-Endpunkte abgefragt und das Ergebnis als JSON-Wert unter den Adapter-Objekt gespeichert.

![image](https://user-images.githubusercontent.com/28166743/218329154-904c0a8e-1310-44ce-a699-f1b2446da436.png)

## Problembehandlung/Änderungswünsche

Bei Problemne mit dem Adapter bitte in der Instanzkonfiguration das "Debugging" des Adapters aktivieren und einen Issue eröffnen mit einer Beschreibung des Problem und den Logs.  
Änderungswünsche (Neue API-Endpoints, etc.) gerne auch per Github Issue oder ioBroker Forum (Tag me: https://forum.iobroker.net/user/schnup89) melden.

## Changelog

### 1.0.1 (2023-02-19)

-   (schnup89) !!! Passwort verschlüsselung aktiviert, evtl. muss das Passwort neu eingegeben werden !!!
-   (schnup89) Readme angepasst
-   (schnup89) Bugfix: setTimeout verbessert, ioBroker Object-ID prüfung aktiviert
-   (schnup89) Übersetzungen hinzugefügt

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
