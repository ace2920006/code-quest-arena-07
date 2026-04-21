const axios = require("axios");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const submitCode = async ({ source_code, language_id, stdin }) => {
  try {
    const submission = await axios.post(
      `${process.env.JUDGE0_BASE_URL}/submissions`,
      {
        source_code,
        language_id,
        stdin,
      },
    );

    const token = submission.data?.token;
    if (!token) throw new Error("Judge0 did not return a submission token.");

    let result = null;
    for (let i = 0; i < 10; i += 1) {
      await sleep(1000);
      const response = await axios.get(`${process.env.JUDGE0_BASE_URL}/submissions/${token}`);
      result = response.data;

      if ((result?.status?.id ?? 0) >= 3) break;
    }

    if (!result) throw new Error("Judge0 did not return a result.");
    return result;
  } catch (error) {
    const message =
      error.response?.data?.message || error.response?.data?.error || error.message || "Judge0 request failed";
    throw new Error(message);
  }
};

module.exports = submitCode;
