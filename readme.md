# Extracto

![GitHub](https://img.shields.io/github/license/vallandemorty/extracto?label=LICENSE)
![GitHub branch checks state](https://img.shields.io/github/checks-status/VallanDeMorty/extracto/main?label=CI)

Extracts metadata from articles and other documents.

> Built for [Deno Deploy](https://deno.com/deploy) and other serverless
> environments.

## Article Metadata

The model is based on
[Article Parser](https://github.com/ndaidong/article-parser) and looks like
this:

```ts
{
  url: String,
  title: String,
  description: String,
  image: String,
  author: String,
  content: String,
  published: Date String,
  source: String, // original publisher
  links: Array, // list of alternative links
  ttr: Number, // time to read in second, 0 = unknown
}
```

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
