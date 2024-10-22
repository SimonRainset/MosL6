class Embedding {
  messages = [];
  maxMessage = 10;
  model = "gpt-3.5-turbo";
  KEY = "sk-3AR0sd0HWW9yhf0aD700DdF1316b4680Ba7758557c0103Ab";
  async getEmbedding(text) {
    try {
      const response = await axios({
        method: "post",
        url: "https://api.ezchat.top/v1/embeddings",
        headers: {
          Authorization: `Bearer ${this.KEY}`,
          "Content-Type": "application/json",
        },
        data: {
          input: text,
          model: "text-embedding-3-small",
        },
      });

      const embeddingArray = response.data.data[0].embedding;
      return embeddingArray;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

class RAG extends Embedding {
  likeToMention = 1;
  extendedContent = "";
  async getEmbeddingArray(text) {
    // 直接使用继承自Embeddings的getEmbedding方法
    const baseEmbedding = await this.getEmbedding(text);
    return baseEmbedding;
  }

  static cosineSimilarity(vecA, vecB) {
    // 余弦相似度计算方法
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    for (let i = 0; i < vecA.length; i++) {
      if (vecA[i] != null && vecB[i] != null) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] ** 2;
        normB += vecB[i] ** 2;
      }
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async findMostSimilar(text, memoArray) {
    this.extendedContent = "";
    console.log("处理文本" + text);
    console.log("记忆队列" + memoArray);
    console.log("findMostSimilar memoArray获取到" + memoArray);
    if (memoArray != null) {
      // 使用继承的getEmbedding方法
      const baseEmbedding = await this.getEmbedding(text);
      let similarities = [];

      for (let memo of memoArray) {
        const embedding = memo.embedding; // 假设你已经有了embedding数据
        const memoContent = memo.content;
        // 使用当前类的cosineSimilarity静态方法
        const similarity = RAG.cosineSimilarity(baseEmbedding, embedding);
        similarities.push({ memoContent, similarity });
      }

      // 按相似度降序排序
      similarities.sort((a, b) => b.similarity - a.similarity);

      if (similarities.length > 0) {
        const top3 = similarities.slice(0, 1);

        const maxSimilarity = top3[0].similarity;
        top3.forEach(
          (item) =>
            (item.similarity = (item.similarity + 1) / (maxSimilarity + 1))
        );

        for (let topMemo of top3) {
          const index = memoArray.findIndex(
            (memo) => memo.content === topMemo.memoContent
          );

          console.log("Found index:", index);
          console.log("当前topMemo的索引：", index);
          console.log("当前topMemo的内容：", topMemo.memoContent);

          if (index > 0) {
            this.extendedContent += memoArray[index - 1].content + " ";
            console.log("前一个memo的内容：", memoArray[index - 1].content);
          }
          this.extendedContent += topMemo.memoContent + " ";
          if (index < memoArray.length - 1) {
            this.extendedContent += memoArray[index + 1].content + " ";
            console.log("后一个memo的内容：", memoArray[index + 1].content);
          }
        }

        this.likeToMention = findCloseSimilarity(
          top3.map((item) => item.similarity)
        );
        console.log(
          "预计想说几个点" +
            this.likeToMention +
            "。它们的similarity分别是" +
            top3.map((item) => item.similarity)
        );
        console.log("扩展后的内容：" + this.extendedContent);
        return this.extendedContent; // 返回扩展后的内容
      } else {
        return null;
      }
    }

    function findCloseSimilarity(numbers) {
      const maxNumber = Math.max(...numbers);
      const closeNumbers = numbers.filter(
        (number) => Math.abs(maxNumber - number) < 0.5
      );
      return closeNumbers.length;
    }
  }

  async findMostSimilarNoIndexing(mem, memoArray) {
    this.extendedContent = "";
    console.log("处理文本" + mem.content);
    console.log("记忆队列" + memoArray);
    console.log("findMostSimilar memoArray获取到" + memoArray);
    if (memoArray != null) {
      // 使用继承的getEmbedding方法
      //const baseEmbedding = await this.getEmbedding(text);
      let similarities = [];

      for (let memo of memoArray) {
        const embedding = memo.embedding; // 假设你已经有了embedding数据
        const memoContent = memo.content;
        // 使用当前类的cosineSimilarity静态方法
        const similarity = RAG.cosineSimilarity(mem.embedding, embedding);
        similarities.push({ memoContent, similarity });
      }

      // 按相似度降序排序
      similarities.sort((a, b) => b.similarity - a.similarity);
      print(
        "按照相似度各种相似度分别是" +
          similarities.map((item) => item.similarity)
      );

      if (similarities.length > 0) {
        const top3 = similarities.slice(0, 1);

        const maxSimilarity = top3[0].similarity;
        top3.forEach(
          (item) =>
            (item.similarity = (item.similarity + 1) / (maxSimilarity + 1))
        );

        for (let topMemo of top3) {
          this.extendedContent += topMemo.memoContent + " ";
        }

        this.likeToMention = findCloseSimilarity(
          top3.map((item) => item.similarity)
        );
        console.log(
          "预计想说几个点" +
            this.likeToMention +
            "。它们的similarity分别是" +
            top3.map((item) => item.similarity)
        );
        console.log("扩展后的内容：" + this.extendedContent);
        return this.extendedContent; // 返回扩展后的内容
      } else {
        return null;
      }
    }

    function findCloseSimilarity(numbers) {
      const maxNumber = Math.max(...numbers);
      const closeNumbers = numbers.filter(
        (number) => Math.abs(maxNumber - number) < 0.5
      );
      return closeNumbers.length;
    }
  }

  async findMostSimilarIndex(mem, memoArray) {
    console.log("处理文本" + mem.content);
    console.log("记忆队列" + memoArray);

    if (memoArray != null) {
      let similarities = [];

      // 收集所有备忘录的相似度和它们在memoArray中的索引
      for (let index = 0; index < memoArray.length; index++) {
        const memo = memoArray[index];
        const embedding = memo.embedding; // 假设你已经有了embedding数据
        // 使用当前类的cosineSimilarity静态方法计算相似度
        const similarity = RAG.cosineSimilarity(mem.embedding, embedding);
        similarities.push({ index, similarity }); // 存储每个元素的索引和相似度
      }

      // 按相似度降序排序
      similarities.sort((a, b) => b.similarity - a.similarity);
      console.log(
        "按照相似度各种相似度分别是" +
          similarities.map((item) => item.similarity)
      );

      // 检查是否有任何相似度数据
      if (similarities.length > 0) {
        // 获取相似度最高的项在memoArray中的索引
        const highestSimilarityIndex = similarities[0].index;
        console.log(
          "最高相似度项在memoArray中的索引是：" + highestSimilarityIndex
        );
        return highestSimilarityIndex; // 返回这个索引
      } else {
        return null; // 如果没有相似度数据，返回null
      }
    }

    return null; // 如果memoArray为null，同样返回null
  }
}
