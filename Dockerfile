FROM hayd/deno:alpine-1.0.2

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (this is re-run only when deps.ts is modified).
# Ideally this will download and compile _all_ external files used in main.ts.
COPY src/deps.ts src/
RUN deno cache src/deps.ts

# These steps will be re-run upon each file change in your working directory:
COPY . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache src/main.ts

ENV SHELL /bin/sh

# These are passed as deno arguments when run with docker:
CMD ["run", "--allow-all", "Drakefile.ts", "start"]
# CMD ["run", "--allow-net", "--allow-read", "src/mod.ts"]

EXPOSE 8000

# Commands
# 1. docker build -t codesandtags/nasa-deno .
# 2. docker run -it -p 8000:8000 codesandtags/nasa-deno:latest
# 3. docker push codesandtags/nasa-mission-control