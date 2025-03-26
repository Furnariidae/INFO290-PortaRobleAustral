# Imagen base, versión livianita
FROM python:3.12-slim AS base

# Set environment variables for better performance and output handling
ENV PYTHONUNBUFFERED=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1

# Set the working directory in the container
WORKDIR /app

# Instalar poetry para manejar dependencias de python 
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev \
    && pip install --no-cache-dir poetry \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy only the Poetry files to leverage Docker caching
COPY pyproject.toml poetry.lock /app/

# Install only the main dependencies
RUN poetry install --only main --no-root

# Copy the rest of the application code into the container
COPY . /app

# Expose the backend port
EXPOSE 4008

# Run the application
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "4008"]
