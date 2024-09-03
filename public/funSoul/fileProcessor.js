//let memoriesNew = [];

document.getElementById('processButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('请先选择一个文件');
        return;
    }

    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'docx') {
        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            mammoth.extractRawText({arrayBuffer: arrayBuffer})
                .then(function(result) {
                    const text = result.value;
                    const delimiters = document.getElementById('delimiterInput').value.split(',');
                    processText(text, delimiters).then(function(results) {
                        // results 是 processText 函数处理完毕后的输出
                        // 在这里继续处理 results，比如调用 createMemories
                        createMemories(results).then(function(newMemories) {
                            // 处理 memoriesNew
                            memoriesNew = memoriesNew.concat(newMemories);
                            console.log(memoriesNew); 
                        });
                    });
                })
                .catch(function(err) {
                    console.log(err);
                    alert('读取Word文件时出错');
                });
        };
        reader.readAsArrayBuffer(file);
    } else {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const delimiters = document.getElementById('delimiterInput').value.split(',');
            processText(text, delimiters).then(function(results) {
                // 在这里继续处理 results，比如调用 createMemories
                createMemories(results).then(function(memoriesNew) {
                    // 处理 memoriesNew
                    memoriesNew = memoriesNew.concat(newMemories);
                    console.log(memoriesNew); // 这将是 NewMemo 实例的数组
                });
            });
        };
        reader.readAsText(file);
    }
});



function processText(text, delimiters) {
    return new Promise((resolve, reject) => {
        // 全角转半角
        text = fullWidthToHalfWidth(text);

        // 按段落分割，假设段落由一个或多个换行符分隔
        const paragraphs = text.split(/\n+/);

        // 用于存储处理后的结果
        let results = [];

        paragraphs.forEach(paragraph => {
            // 移除段落两端的空白字符
            paragraph = paragraph.trim();
            
            // 如果段落为空（可能是连续换行导致的空段落），则跳过
            if (!paragraph) {
                return;
            }

            // 按句子分割当前段落
            const sentences = paragraph.split(/(?<=[.!?])\s*/).filter(s => s);

            sentences.forEach(sentence => {
                // 对每个句子进一步分割并添加到结果中
                const parts = splitSentence(sentence, delimiters, 512 / 9);
                results = results.concat(parts);
            });
        });

        // 使用resolve返回结果
        resolve(results);
    });
}



function fullWidthToHalfWidth(str) {
    return str.replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0)).replace(/　/g, ' ');
}

function mergeShortSentences(parts, minTokenLength) {
    // 遍历分割后的句子，合并过短的句子
    for (let i = 0; i < parts.length; ) {
        if (parts[i].length < minTokenLength) {
            // 如果当前句子长度小于最小长度，尝试与前一个或后一个句子合并
            if (i > 0) {
                // 优先与前一个句子合并
                parts[i - 1] += parts[i];
                parts.splice(i, 1); // 移除当前句子
            } else if (i < parts.length - 1) {
                // 如果是第一个句子，尝试与后一个句子合并
                parts[i] += parts[i + 1];
                parts.splice(i + 1, 1); // 移除下一个句子
            } else {
                // 如果只有一个句子，即使它很短，也保留它
                i++;
            }
        } else {
            i++; // 如果当前句子不需要合并，移动到下一个句子
        }
    }
    return parts;
}

function splitSentence(sentence, delimiters, maxLength) {
    let parts = [];
    let lastCut = 0;

    // 遍历每个字符
    for (let i = 0; i < sentence.length; i++) {
        // 检查是否达到分割字符
        delimiters.forEach(delimiter => {
            if (sentence.startsWith(delimiter, i) && lastCut < i) {
                parts.push(sentence.substring(lastCut, i));
                lastCut = i;
            }
        });

        // 遇到分割标点时的处理
        if (",，。！？".includes(sentence[i])) {
            // 寻找下一个分割标点的位置
            let nextPunctuationIndex = sentence.slice(i + 1).search(/[,，。！？]/);
            if (nextPunctuationIndex !== -1) {
                nextPunctuationIndex += i + 1;  // 调整为相对于整个句子的索引
                
                // 检查加上下一个句子后长度是否超过最大长度
                if (nextPunctuationIndex - lastCut >= maxLength) {
                    // 如果超过，分割句子
                    parts.push(sentence.substring(lastCut, i + 1));
                    lastCut = i + 1;
                } else {
                    // 如果不超过，尝试合并到下一个分割点
                    continue;
                }
            } else {
                // 没有找到下一个分割点，直接分割
                parts.push(sentence.substring(lastCut, i + 1));
                lastCut = i + 1;
            }
        }
    }

    // 添加最后一部分
    if (lastCut < sentence.length) {
        parts.push(sentence.substring(lastCut));
    }

    parts = mergeShortSentences(parts,10)

    return parts.filter(part => part.trim().length > 0);  // 过滤掉空字符串
}


function displayResults(results) {
    console.log(results)
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = results.map(text => `<div>${text}</div>`).join('');
}
