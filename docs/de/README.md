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
