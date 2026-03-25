# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/


FROM node:24-bookworm-slim
WORKDIR /gaspricebot
COPY package*.json ./


RUN apt-get update
RUN apt-get install -y sqlite3

# Force install EVERYTHING (including typescript/tsc)
RUN npm install
# Copy the rest of the source files into the image.
COPY . .
RUN npm run build

RUN if [ ! -d /gaspricebot-data ]; then \
      mkdir -p /gaspricebot-data && echo "Created missing /gaspricebot-data folder"; \
    fi

RUN if [ ! -f /gaspricebot-data/discord_token.txt ]; then \
      echo "XXX" > /gaspricebot-data/discord_token.txt && echo "Created missing discord token text file, need to update with correct token"; \
    else \
      echo "Discord token text file found!"; \
    fi


RUN [ -f /gaspricebot-data/config.json ] echo "Existing config found!" || echo <<EOF > /gaspricebot-data/config.json
{
    "Gas_Price_Page":"XXX",
    "CHANNEL_NAME":"XXX",
    "TIMEZONE": "America/Toronto"
}
EOF

RUN chown -R node:node /gaspricebot-data
# Use production node environment by default.
ENV NODE_ENV production
# Run the application as a non-root user.
USER node

# Run the application.
CMD npm start