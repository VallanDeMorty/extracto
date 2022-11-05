import { assertEquals } from "https://deno.land/std@0.162.0/testing/asserts.ts";
import {
  isLeft,
  isRight,
} from "https://deno.land/x/fun@v2.0.0-alpha.3/either.ts";

import { extractArticle } from "../src/extract-article.ts";

Deno.test(
  "GIVEN a valid article url WHEN extractArticle THEN the article is parsed",
  async () => {
    //Arrange
    const url =
      "https://tech.devsisters.com/posts/scala-for-game-server-development/";

    //Act
    const actualArticleResult = await extractArticle(url);

    //Assert
    assertEquals(
      isLeft(actualArticleResult),
      true,
      "The article wasn't parsed while it should be",
    );
  },
);

Deno.test(
  "GIVEN an invalid article url WHEN extractArticle THEN the parse error is raised",
  async () => {
    //Arrange
    const url =
      "https://www.thisdoesntworkatall.com/2022/10/14/harvard-researchers-propose-a-self-supervised-deep-learning-algorithm/";

    //Act
    const actualArticleResult = await extractArticle(url);

    //Assert
    assertEquals(
      isRight(actualArticleResult),
      true,
      "The article was succesfully parsed while it shouldn't",
    );
  },
);
