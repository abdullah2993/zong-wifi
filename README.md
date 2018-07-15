
# Zong FiberHome 4G Device

## Endpoints

Base URL: `/xml_action.cgi?method=get&module=duster&file=[name]`
known file names are:
 - admin
 - app_fun_support_list
 - battery_charge
 - custom_fw
 - detailed_log
 - dns
 - download_local_upgrade
 - lan
 - lock_cell_clear
 - message
 - message_drafts
 - message_outbox
 - message_set
 - message_state
 - message_state
 - net_advace_set
 - ntp_server
 - pin_puk
 - reset
 - restore_defaults
 - shutdown
 - status1
 - time_setting
 - traffic_excess_set
 - uapxb_wlan_basic_settings
 - uapxb_wlan_security_settings
 - upgrade_info
 - ussd_business
 - wan
 - wan_choose_net
 - wan_ip
 - wlan_auto_setting

 ## Vulnerabilities and Exploits
 Although the device use a wierd authentication method, it is nothing more than a gimmick used 
 by the UI code to give an illusion of authentication.
 All the endpoints are accessible directly without authentication and the best part of it all is you can
 use the [`admin`](http://192.168.8.1/xml_action.cgi?method=get&module=duster&file=admin) endpoint to get the username and password for the router.

The output of the `admin` endpoint is something like
```
<?xml version="1.0" encoding="US-ASCII"?>
<RGW>
	<management>
		<router_username>admin</router_username>
		<router_password>admin</router_password>
		<web_wlan_enable/>
		<httpd_port/>
		<syslogd_enable/>
		<web_wan_enable/>
		<syslogd_rem_ip/>
		<turbo_mode/>
        <customer/>
	</management>
</RGW>
```

The vulerability explained above is [well know and quite old](https://github.com/OsamaMahmood/Zong-router-exploit) but wait, There's more! to my knowledge(not sure though) the `Fiber Home` version of the `Zong` devices are unlocked by default but if yours is not, you can use a simple trick to get super user access and unlock
the device direcltly from the `Admin Panel` all you have to do is login to your router and change the default **username** from `admin` to `root` and voila you can see a new tab named `Advance` in `Settings` which provides options to unlock the device, As shown below

![Advance Settings](/zong_adv_settings.PNG?raw=true "Advance Settings")

## Analysis
It gets more interesting once you do a portscan of the device. The portscan shows the following ports to be open
 - 22 - SSH
 - 53 - DNS
 - 80 - HTTP (Admin Panel)
 - 3020 - Unknown
 - 3021 - Unknown
 - 5555 - Unknown

### Port 22
The device seems to be running SSH server `ssh-2.0-dropbear 2011.54` which has a few known [vulnerabilities](https://www.cvedetails.com/vulnerability-list/vendor_id-2537/product_id-4416/version_id-127485/Matt-Johnston-Dropbear-Ssh-Server-2011.54.html) but without the password I am unable to access it. I'm looking into using `THC-Hydra` and `NCrack`.

### Port 53 and 80
These ports are standard `DNS` and `HTTP` ports

### Port 3020
Port 3020 is interesting once you connect to it it immediatly send the banner `ms_version:1` and then appears to send/receive nothing but if you keep connected it starts sending packets with `JSON` payloads "periodically" which appears to be 4-byte length prefixed, see the sample payloads below

```
{
	"operate": "report",
	"service_name": "modem",
	"signal_strength": 2
}
```
```
{
	"operate": "report",
	"service_name": "modem",
	"signal_strength_v1": [
		{
			"cdma_dbm": 0,
			"evdo_dbm": -125,
			"gsm_signal_strength": 0,
			"lte_rsrp": -112,
			"operator_type": 2,
			"tds_signal_strength": 0,
			"wcdma_signal_strength": 0
		}
	]
}
```

### Port 3021
This port lets you connect to it and keeps the connection open as long as you don't send anything but as soon as you send something it immediately disconnects, possibly expects somekind of pattern IMO(these kinds of ports were found on other routers too)

### Port 5555
Lets you connect and send but doesn't return anything and keeps the connection open unlike 3021