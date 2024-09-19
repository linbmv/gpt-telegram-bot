const { OpenAI } = require('openai');
const { OPENAI_API_KEY, OPENAI_BASE_URL, DALL_E_MODEL } = require('./config');

const client = new OpenAI({ 
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL
});

const VALID_SIZES = ['1024x1024', '1792x1024', '1024x1792'];

async function generateImage(prompt, size = '1024x1024') {
  console.log(`开始生成图片. 提示: "${prompt}", 尺寸: ${size}`);
  if (!VALID_SIZES.includes(size)) {
    console.log(`无效的图片尺寸: ${size}`);
    throw new Error(`Invalid size. Please use one of the following valid sizes: ${VALID_SIZES.join(', ')}`);
  }

  try {
    console.log('调用 OpenAI API...');
    const response = await client.images.generate({
      model: DALL_E_MODEL,
      prompt: prompt,
      n: 1,
      size: size
    });
    console.log('OpenAI API 响应接收成功');

    if (response.data && response.data.length > 0) {
      console.log(`生成的图片 URL: ${response.data[0].url}`);
      return response.data[0].url;
    } else {
      console.log('OpenAI 响应中没有图片 URL');
      throw new Error('生成图片失败，未返回图片URL。');
    }
  } catch (error) {
    console.error('生成图片时出错:', error);
    throw error; // 抛出原始错误，以便在调用函数中捕获更多细节
  }
}

module.exports = { generateImage, VALID_SIZES };
