# Extracto

Extracts metadata from articles and other documents.

> Built for [Deno Deploy] and other serverless environments.

## Local Run

```bash
AUTH_TOKEN=your_token
deno run --allow-net=:8000 --allow-read --allow-env main.ts
```

and then perform a request

```bash
curl -X GET -H "Authorization: Bearer your_token" "http://localhost:8000?url=wow"
```

## Tests

```bash
deno test --allow-net 
```

[Deno Deploy]: ttps://deno.com/deplo
