

- `wlan0` - AP
- `wlan1` - dodatkowa karta wifi


Postępujemy zgodnie:

https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md

```
sudo apt install dnsmasq hostapd
```

zatrzymujemy obie zainstalowane usługi w celu ich konfiguarcji

```
sudo systemctl stop dnsmasq
sudo systemctl stop hostapd
```

Konfigurujemy statyczne ip na wlan0:

```
sudo nano /etc/dhcpcd.conf
```
na końcu pliku dodajemy wpis:

```
interface wlan0
    static ip_address=192.168.4.1/24
    nohook wpa_supplicant
```

Restartujemy dhcpcd

```
sudo service dhcpcd restart
```

Konfigurujemy DHCP server (dnsmasq)

```
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
sudo nano /etc/dnsmasq.conf
```
w pliku dnsmasq.conf wpisujemy:

```
interface=wlan0      # Use the require wireless interface - usually wlan0
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
```
Na końcu pliku:

```
sudo nano /etc/networks/interfaces
```
dopisujemy:

```
auto wlan1
allow-hotplug wlan1
iface wlan1 inet manual
wpa-roam /etc/wpa_supplicant/wpa_supplicant.conf
```

Uruchamiamy dnsmasq:

```
sudo systemctl start dnsmasq
```

Konfigurujemy access point host (hostapd):

```
sudo nano /etc/hostapd/hostapd.conf
```

WPisujemy do pliku:

```
interface=wlan0
driver=nl80211
ssid=E2R-Lite
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=Zaq12wsx
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
```

wskazujemy plik konfiguracyjny:

```
sudo nano /etc/default/hostapd
```
należy podmienić #DAEMON_CONF na:

```
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```

Tworzymy plik ```/etc/udev/rules.d/72-static-name.rules``` i wpisujemy 

```
ACTION=="add", SUBSYSTEM=="net", DRIVERS=="?*",
ATTR{address}=="00:c0:ca:96:d8:8b", KERNEL=="w*",NAME="wlan0"

ACTION=="add", SUBSYSTEM=="net", DRIVERS=="?*",
ATTR{address}=="b8:27:eb:1e:56:52", KERNEL=="w*",NAME="wlan1" 
```
Edytujemy plik 
``` 
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
```
i wpsujemy do niego
```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=PL

network={
        ssid="E2R-Lite"
        psk="Zaq12wsx"
        key_mgmt=WPA-PSK
        id_str="siec"
}
```
Uruchamiamy hostapd

```
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start hostapd
```
Kolejnie instalujemy network-manager (w celu łączenia sieci z lini poleceń)

http://www.intellamech.com/RaspberryPi-projects/rpi_nmcli.html

```
sudo apt-get install network-manager
```
Ponieważ network-manager nie zarządza urządzeniami znajdującymi się w pliku `/etc/network/interfaces`, edytujemy go

```
sudo nano /etc/network/interfaces
```

po edycji powinien wyglądać tak:

```
auto lo
iface lo inet loopback

# Managed by NetworkManager
#iface eth0 inet manual

# Managed by NetworkManager
#auto wlan0
#allow-hotplug wlan0
#iface wlan0 inet dhcp
#    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
```

Plik `/etc/network/interfaces` powinien wyglądać tak:

```
[main]
plugins=ifupdown,keyfile

[ifupdown]
managed=false
```

Reboot i za pomocą komendy `sudo nmtui` dodajemy połączenie wifi:

- `wlan0` jako Access Point 
- `wlan1` jako Client





