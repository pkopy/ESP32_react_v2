Postępujemy zgodnie:

https://pimylifeup.com/raspberry-pi-mysql/

```
sudo apt update
sudo apt upgrade
```
instalujemy mysql (mariadb)

```
sudo apt install mariadb-server
```

Domyślnie mysql instaluje się bez hasła więc ustawiamy je następująco

```
sudo mysql_secure_installation
```

postępuj zgodnie poleceniami, dla większego bezpieczeństwa użyj opcji "Y" dla wszystkich zapytań. Zapisz hasło będzie Ci potrzebne

Zaloguj się do mysql

```
sudo mysql -u root -p
```
## INTERFEJS GRAFICZNY (MySQL WORKBENCH)

Zainstaluj MySql Workbech

https://dev.mysql.com/downloads/workbench/

Aby połączyć się zdalnie z serwerem mysql edytuj plik:

```
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```

- odkomentuj port = 3306
- zmień  bind-address  = XXX.XXX.XXX.XXX w miejsce XXX wpisz adres swojego serwera 

Następnie zaloguj się do mysql stwórz bazę danych 

```
mysql> CREATE DATABASE `mydb`;
```

stwórz użytkownika

```
mysql> CREATE USER 'myuser' IDENTIFIED BY 'mypassword';
```

nadaj mu uprawnienia do serwera na poziomie localhost

```
mysql> GRANT USAGE ON *.* TO 'myuser'@localhost IDENTIFIED BY 'mypassword';
```
nadaj mu uprawnienia do serwera na poziomie sieci (dla każdego komputera z sieci)

```
mysql> GRANT USAGE ON *.* TO 'myuser'@'%' IDENTIFIED BY 'mypassword';
```

Nadaj uprawnienia do DB (lokalnie i w sieci):

```
mysql> GRANT ALL privileges ON `mydb`.* TO 'myuser'@'localhost';
mysql> GRANT ALL privileges ON `mydb`.* TO 'myuser'@'%';
```
Zakończ wszystko komendą:

```
mysql> FLUSH PRIVILEGES;
```

Połącz się do DB za pomocą mysql workbech