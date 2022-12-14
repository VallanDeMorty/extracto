import { ArticleData, extract } from "https://esm.sh/article-parser";
import { DOMParser, HTMLElement } from "https://esm.sh/linkedom";
import {
  Either,
  left,
  right,
} from "https://deno.land/x/fun@v2.0.0-alpha.3/either.ts";
import { warning } from "https://deno.land/std@0.162.0/log/mod.ts";

export type ArticleIsNotFound = {
  type: "article-is-not-found";
  message: string;
};

export type ArticleParsingError = {
  type: "article-parsing-error";
  message: string;
};

export type ArticleExtractionError = ArticleIsNotFound | ArticleParsingError;

export const extractArticle = async (
  url: string
): Promise<Either<ArticleData, ArticleExtractionError>> => {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    warning("Failed to fetch the article", url, error);

    return right({
      type: "article-is-not-found",
      message: "Article is not found",
    });
  }

  if (!response.ok) {
    warning("Failed to fetch the article", url, response.statusText);

    return right({
      type: "article-is-not-found",
      message: "Article is not found",
    });
  }

  const html = await response.text();

  let article: ArticleData | null;
  try {
    article = await extract(html);
  } catch (error) {
    warning("Failed to parse the article", url, error);

    return right({
      type: "article-parsing-error",
      message: "Failed to parse the article",
    });
  }

  if (!article) {
    warning("Failed to parse the article", url);

    return right({
      type: "article-parsing-error",
      message: "Failed to parse the article",
    });
  }

  if (!article.title || !article.content) {
    warning(
      "Failed to parse the article because of missing title or content",
      url
    );

    return right({
      type: "article-parsing-error",
      message:
        "Failed to parse the article because of missing title or content",
    });
  }

  const parsedContent = new DOMParser().parseFromString(
    article.content,
    "text/html"
  );

  const cleanedContent = Array.from(parsedContent.children)
    .map((child: HTMLElement) => child.innerText)
    .join("");

  return left({ ...article, content: cleanedContent });
};
