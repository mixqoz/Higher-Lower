# Higher-Lower

There are two (recommended) ways to run this project, both on Linux:
- Using Docker (Compose)
- Manually with Gunicorn

Important: You must download the price data before starting the app. Run `retrieveprices.sh` to create `csgo_prices.json`.


## Prerequisites (Linux)
- curl (for running `retrieveprices.sh`)
- For manual run:
  - Python 3
  - pip
- For Docker:
  - Docker

## 1) Download price data (required)
The program requires a file listing prices of all Counter-Strike items, in `csgo_prices.json`.
Download it using the provided script:

```bash
chmod +x ./retrieveprices.sh
./retrieveprices.sh
```

It is up to the user if they want to continually update the file by running the script again sometime after.


## 2) Run manually with Gunicorn
1. Create and activate a virtual environment, then install dependencies:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. Set a secret key (required for Flask sessions). You can export it or put it in a `.env` file. Example with export:
   ```bash
   export SECRET_KEY="funny_secret_key"
   ```
   Alternatively, create a `.env` file in the project root with:
   ```
   SECRET_KEY=funny_secret_key
   ```

3. Start the app with Gunicorn:
   ```bash
   gunicorn --bind 0.0.0.0:5000 app:app
   ```

4. Open the app at:
   - http://localhost:5000


## 3) Run with Docker Compose
1.  Download price data (required)
    The program requires a file listing prices of all Counter-Strike items, in `csgo_prices.json`.
    Download it using the provided script:

    ```bash
    chmod +x ./retrieveprices.sh
    ./retrieveprices.sh
    ```

    It is up to the user if they want to continually update the file by running the script again sometime after.


2. Copy the provided example file,

    ```
    mv compose.yml.example compose.yml
    ```
   
    and then modify the `SECRET_KEY` environment variable:

```yaml
services:
  higher-lower:
    environment:
      SECRET_KEY: "change_me"
```

    
3. Build and start:
   ```bash
   docker compose up -d
   ```

4. Access the app at:
   - http://localhost:5000
   
    or your public IP address:5000

Updating prices when using Docker:
- Easiest: rerun `./retrieveprices.sh` and rebuild the image:
  ```bash
  ./retrieveprices.sh
  docker compose build --no-cache
  docker compose up -d
  ```
- Optional (bind mount): if you prefer not to rebuild, you can bind-mount the price file so updates are picked up immediately. Add this under the service in `compose.yml`:
  ```yaml
  services:
    higher-lower:
      volumes:
        - ./csgo_prices.json:/app/csgo_prices.json:ro
  ```
  Then rerun `./retrieveprices.sh` on the host whenever you want new prices.

## Credits & Inspiration
- Wordle Game functions: https://www.youtube.com/watch?v=ckjRsPaWHX8
- https://www.youtube.com/watch?v=MM9FAV_CEkU
- Memory Game functions: https://www.youtube.com/watch?v=ZniVgo8U7ek
