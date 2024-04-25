# Set up UFW firewall on a Linux web server

_Tested on Ubuntu 22.04:_

Run the following:

```sh
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22 # ⚠️ Replace by your actual SSH port (22 by default) — otherwise, SSH access will be lost after reboot!
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
sudo reboot
```

## Do you run your web app with Docker?

As of April 2024, Docker containers still overrides UFW rules, which means a container exposed to the host will be publicly exposed on the same port. Make sure UFW is enabled (`sudo ufw enable`) and [follow this guide](https://blog.jarrousse.org/2023/03/18/how-to-use-ufw-firewall-with-docker-containers/). Then reboot system and check if UFW is enabled (`sudo ufw status`).

---

_For reference: https://www.webservertalk.com/ubuntu-firewall-how-to-configure-ufw/._
