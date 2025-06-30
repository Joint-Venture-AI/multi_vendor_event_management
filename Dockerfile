FROM node:22.13.0

# Set the working directory inside the container
WORKDIR /app

# Install Bun globally by downloading and adding it to PATH
RUN curl -fsSL https://bun.sh/install | bash && \
    mv ~/.bun/bin/bun /usr/local/bin/

# Copy package.json for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install dependencies using Bun
RUN bun install

# Copy the rest of the application
COPY . .

# Expose the port your app will run on
EXPOSE 5004

# Command to run the app in development mode
CMD ["bun", "run", "dev"]
