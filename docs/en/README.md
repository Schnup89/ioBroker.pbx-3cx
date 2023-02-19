![Logo](../../admin/pbx-3cx.png)


## pbx-3cx adapter for ioBroker

This Adapter allows you to fetch data from your 3CX-PBX to ioBroker.

## Setup

To connect to yopur 3CX-PBX you have to fill out the connection parameter in the adapter-configuration (Instances -> pbx-3CX -> Settings)  
URL-Format: https://your_pbx_ip_or_dns_name:5001/api  
Username: admin, root or extension, depending on the config  
Password: your secret :)

Any API-Endpoint can be enabled or disabled. In addition, the polling interval for individual API-Endpoints can be shortened to 1 second (Livedata).  
The default update interval can be specified in the adapter config.
Please activate only API-Endpoints that you really need (especially live data), each query has performance impacts on both sides.

## Usage

Once connected, the enabled API-Endpoints are queried and the result is stored as a JSON value under the Adapter object.

![image](https://user-images.githubusercontent.com/28166743/218329154-904c0a8e-1310-44ce-a699-f1b2446da436.png)

## Troubleshooting/Feature-Request

If you have problems with the Adapter, please activate the "Debugging" Option in the adapter-instance configuration and open an issue with a description of the problem and the logs.
Feel free to report Feature-Requests (new API endpoints, etc.) via Github issue or ioBroker Forum (Tag me: https://forum.iobroker.net/user/schnup89)
