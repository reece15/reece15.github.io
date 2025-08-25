"""

```shell
sudo apt-get install xvfb xserver-xephyr tigervnc-standalone-server x11-utils gnumeric

sudo apt install python3-virtualenv
virtualenv -p `which python3` venv
source venv/bin/active

pip3 install undetected-chromedriver
pip3 install pyvirtualdisplay pillow EasyProcess

python3 undetected_bot.py

```

"""
import time
import tempfile

import undetected_chromedriver.v2 as uc
from pyvirtualdisplay import Display


def main():
    with Display(visible=False, size=(1366, 768), backend='xvfb') as _display:
        options = uc.ChromeOptions()
        options.add_argument('--user-data-dir={}'.format(tempfile.mktemp()))
        options.add_argument('--no-first-run --no-service-autorun --password-store=basic')

        driver = uc.Chrome(version_main=98, options=options)
        driver.get('http://javabin.cn/bot/bot.html?headless')
        time.sleep(8)
        print(driver.find_element_by_tag_name('body').text)


if __name__ == '__main__':
    main()
