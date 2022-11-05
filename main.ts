import { serve } from "https://deno.land/std@0.162.0/http/server.ts";
import { ArticleData } from "https://esm.sh/article-parser";
import { fold } from "https://deno.land/x/fun@v2.0.0-alpha.3/either.ts";

import {
  ArticleExtractionError,
  extractArticle,
} from "./src/extract-article.ts";
import { warning } from "https://deno.land/std@0.162.0/log/mod.ts";

serve(async (request) => {
  const requiredAuthToken = Deno.env.get("AUTH_TOKEN");
  if (!requiredAuthToken) {
    return new Response("The server is missconfigured", { status: 500 });
  }

  const authHeader = request.headers.get("Authorization");
  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ") ||
    !authHeader.includes(requiredAuthToken)
  ) {
    warning("Unauthorized request with auth header", authHeader);
    return new Response("Unauthorized", { status: 401 });
  }

  const articleUrl = new URL(request.url).searchParams.get("url");
  if (!articleUrl) {
    return new Response("The url queury paramater isn't found", {
      status: 400,
    });
  }

  const maybeArticle = await extractArticle(articleUrl);

  return fold<ArticleData, ArticleExtractionError, Response>(
    (article) =>
      new Response(JSON.stringify(article), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    (error) =>
      new Response(error.message, {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      }),
  )(maybeArticle);
});
