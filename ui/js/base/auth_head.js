//自定义登录验证是需要用到的全局参数
var AuthQop;
var username = "";
var passwd = "";
var GnCount = 1;
var Authrealm;
var Gnonce;
var nonce;
var _resetTimeOut = 600000;
var authHeaderIntervalID = "";

function stopInterval()
{
	clearInterval(authHeaderIntervalID);
}

function startInterval()
{
	authHeaderIntervalID = setInterval("clearAuthheader()", _resetTimeOut);
}

/*
 * Reset the authHeader
 */
function resetInterval()
{
	clearInterval(authHeaderIntervalID);
	authHeaderIntervalID = setInterval("clearAuthheader()", _resetTimeOut);
}

/*Des: get Auth Header, Marvell's Auth
 * requestType:requestType,post or get
 * Return: strAuthHeader, auth header
 * zhurw 2012/05/10
 */
function getAuthHeader(requestType, file)
{
	var rand, date, salt, strAuthHeader;
	var tmp, DigestRes, AuthCnonce_f;
	var HA1, HA2;
	HA1 = hex_md5(username + ":" + Authrealm + ":" + passwd);
	HA2 = hex_md5(requestType + ":" + "/cgi/xml_action.cgi");
	rand = Math.floor(Math.random() * 100001)
	date = new Date().getTime();
	salt = rand + "" + date;
	tmp = hex_md5(salt);
	AuthCnonce_f = tmp.substring(0, 16);
	//AuthCnonce_f = tmp;

	var strhex = hex(GnCount);
	var temp = "0000000000" + strhex;
	var Authcount = temp.substring(temp.length - 8);
	DigestRes = hex_md5(HA1 + ":" + nonce + ":" + Authcount + ":" + AuthCnonce_f + ":" + AuthQop + ":" + HA2);
	GnCount++;
	strAuthHeader = "Digest " + "username=\"" + username + "\", realm=\"" + Authrealm + "\", nonce=\"" + nonce + "\", uri=\"" + "/cgi/xml_action.cgi" + "\", response=\"" + DigestRes + "\", qop=" + AuthQop + ", nc=" + Authcount + ", cnonce=\"" + AuthCnonce_f + "\"";
	DigestHeader = strAuthHeader;
	return strAuthHeader;
}

/*
 * clear the Authheader from the coockies
 */
function clearAuthheader(){
	Authheader = "";
	AuthQop = "";
	username = "";
	passwd = "";
	GnCount = "";
	Authrealm = "";
}

function getHeader(AuthMethod, file){
	var rand, date, salt, setResponse;
	var tmp, DigestRes, AuthCnonce_f;
	var HA1, HA2;
	HA1 = hex_md5(username + ":" + Authrealm + ":" + passwd);
	HA2 = hex_md5(AuthMethod + ":" + "/cgi/xml_action.cgi");
	rand = Math.floor();
	date = new Date().getTime();
	salt = rand + "" + date;
	tmp = hex_md5(salt);
	AuthCnonce = tmp.substring(0, 16);
	AuthCnonce_f = tmp;

	var strhex = hex(GnCount);
	var temp = "0000000000" + strhex;
	var Authcount = temp.substring(temp.length - 8);
	DigestRes = hex_md5(HA1 + ":" + Gnonce + ":" + Authcount + ":" + AuthCnonce_f + ":" + AuthQop + ":" + HA2); ++GnCount;

	if("GET" == AuthMethod){
		if("upgrade" == file){
			setResponse = "/xml_action.cgi?Action=Upload&file=upgrade&command="
		}else{
			setResponse = "/login.cgi?Action=Download&file=" + file + "&username=" + username + "&realm=" + Authrealm + "&nonce=" + Gnonce + "&response=" + DigestRes + "&cnonce=" + AuthCnonce_f + "&nc=" + Authcount + "&qop=" + AuthQop + "&temp=marvell";
		}
	}

	if("POST" == AuthMethod){
		setResponse = "/login.cgi?Action=Upload&file=" + file + "&username=" + username + "&realm=" + Authrealm + "&nonce=" + Gnonce + "&response=" + DigestRes + "&cnonce=" + AuthCnonce_f + "&nc=" + Authcount + "&qop=" + AuthQop + "&temp=marvell";
	}
	return setResponse;
}