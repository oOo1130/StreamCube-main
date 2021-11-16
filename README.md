# Stream Cube Beta System
#### Features

### Start Up
##### Step 1 - System setup (terminal 1)
**Git clone and Library set up**
```sh
$ git clone git@github.com:lickdanoodle/streamcube_ltd_web_project.git
$ npm install
$ npm run dev
```
##### Step 2 - System setup (terminal 2)
**launch django server**
```sh
$ cd ./streamcube/
$ pipenv shell
$ python manage.py runserver
```

##### Step 3 - Open the page
**open a browser and enter http://localhost:8000/**

Install and Prepare Python Enviroment
```
$ apt update
$ apt install software-properties-common
$ apt upgrade
$ apt install software-properties-common
$ add-apt-repository ppa:deadsnakes/ppa
$ apt install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev wget
```

Install and Run Nginx
```
$ nginx -t
$ ufw allow 'NGINX Full'
$ ufw allow ssh
$ ufw enable
$ systemctl status nginx
```

Install the required modules
```
$ pip install django; pip install djangorestframework;  pip install django-rest-knox; pip install django-multiselectfield; pip install paypal-payouts-sdk; pip install pyotp; pip install fpdf; pip install Pillow;
```
Run Python App
```
$ python manage.py migrate
$ python manage.py runserver 0:80
$ python3 manage.py runserver 0:80
```