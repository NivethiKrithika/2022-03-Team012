FROM python:3.8-slim-buster

WORKDIR /hemkraft-backend
# We copy just the requirements.txt first to leverage Docker cache
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "server.py" ]