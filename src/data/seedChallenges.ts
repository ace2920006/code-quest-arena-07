import type { ProgrammingLanguage } from "@/lib/storage";

export interface ChallengeTest {
  input: string; // call expression like `add(2, 3)` for JS
  expected: string;
}

export interface LocalizedText {
  en: string;
  hi: string;
  "hi-en": string;
}

export interface Challenge {
  id: string;
  order: number;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  title: LocalizedText;
  description: LocalizedText;
  hints: LocalizedText[];
  starter: Record<ProgrammingLanguage, string>;
  // For client-only execution we only run JS. For other languages users see UI but execution falls back to mock until backend/Judge0 wired.
  tests: ChallengeTest[];
  funcName: string;
}

const t = (en: string, hi: string, hiEn: string): LocalizedText => ({ en, hi, "hi-en": hiEn });

export const SEED_CHALLENGES: Challenge[] = [
  {
    id: "hello",
    order: 1,
    difficulty: "easy",
    xpReward: 50,
    funcName: "greet",
    title: t("Hello, Hero!", "नमस्ते, हीरो!", "Hello, Hero!"),
    description: t(
      "Return the string 'Hello, World!' from the function `greet()`.",
      "फंक्शन `greet()` से स्ट्रिंग 'Hello, World!' लौटाएँ।",
      "Function `greet()` se string 'Hello, World!' return karo."
    ),
    hints: [
      t("Use the `return` keyword.", "`return` कीवर्ड का उपयोग करें।", "`return` keyword use karo."),
      t("Strings go in quotes.", "स्ट्रिंग्स कोट्स में होते हैं।", "Strings quotes me hote hain."),
      t("Exactly: Hello, World!", "बिल्कुल: Hello, World!", "Bilkul: Hello, World!"),
    ],
    starter: {
      javascript: "function greet() {\n  // your code here\n}\n",
      python: "def greet():\n    # your code here\n    pass\n",
      java: "class Solution {\n  public String greet() {\n    // your code here\n    return \"\";\n  }\n}\n",
      cpp: "#include <string>\nstd::string greet() {\n  // your code here\n  return \"\";\n}\n",
    },
    tests: [{ input: "greet()", expected: "Hello, World!" }],
  },
  {
    id: "add",
    order: 2,
    difficulty: "easy",
    xpReward: 75,
    funcName: "add",
    title: t("Sum of Two", "दो का योग", "Do ka Sum"),
    description: t(
      "Return the sum of two numbers a and b.",
      "दो संख्याओं a और b का योग लौटाएँ।",
      "Do numbers a aur b ka sum return karo."
    ),
    hints: [
      t("Use the + operator.", "+ ऑपरेटर का उपयोग करें।", "+ operator use karo."),
      t("Return a + b.", "a + b लौटाएँ।", "a + b return karo."),
      t("function add(a, b) { return a + b }", "function add(a, b) { return a + b }", "function add(a, b) { return a + b }"),
    ],
    starter: {
      javascript: "function add(a, b) {\n  // your code here\n}\n",
      python: "def add(a, b):\n    # your code here\n    pass\n",
      java: "class Solution {\n  public int add(int a, int b) { return 0; }\n}\n",
      cpp: "int add(int a, int b) {\n  return 0;\n}\n",
    },
    tests: [
      { input: "add(2, 3)", expected: "5" },
      { input: "add(-1, 1)", expected: "0" },
      { input: "add(100, 250)", expected: "350" },
    ],
  },
  {
    id: "max",
    order: 3,
    difficulty: "easy",
    xpReward: 100,
    funcName: "maxOf",
    title: t("The Bigger One", "बड़ा वाला", "Bada Wala"),
    description: t(
      "Return the larger of two numbers a and b.",
      "दो संख्याओं में से बड़ी लौटाएँ।",
      "Do numbers me se bada return karo."
    ),
    hints: [
      t("Use an if statement.", "if स्टेटमेंट का उपयोग करें।", "if statement use karo."),
      t("Or use Math.max.", "या Math.max का उपयोग करें।", "Ya Math.max use karo."),
      t("return a > b ? a : b", "return a > b ? a : b", "return a > b ? a : b"),
    ],
    starter: {
      javascript: "function maxOf(a, b) {\n  // your code here\n}\n",
      python: "def maxOf(a, b):\n    pass\n",
      java: "class Solution { public int maxOf(int a,int b){return 0;} }\n",
      cpp: "int maxOf(int a,int b){return 0;}\n",
    },
    tests: [
      { input: "maxOf(2, 3)", expected: "3" },
      { input: "maxOf(10, 5)", expected: "10" },
      { input: "maxOf(-1, -7)", expected: "-1" },
    ],
  },
  {
    id: "even",
    order: 4,
    difficulty: "easy",
    xpReward: 100,
    funcName: "isEven",
    title: t("Even or Odd", "सम या विषम", "Even ya Odd"),
    description: t("Return true if n is even, false otherwise.", "n सम है तो true लौटाएँ।", "Agar n even hai to true return karo."),
    hints: [
      t("Use the % operator.", "% ऑपरेटर का उपयोग।", "% operator use karo."),
      t("n % 2 === 0", "n % 2 === 0", "n % 2 === 0"),
      t("return n % 2 === 0", "return n % 2 === 0", "return n % 2 === 0"),
    ],
    starter: {
      javascript: "function isEven(n) {\n  // your code here\n}\n",
      python: "def isEven(n):\n    pass\n",
      java: "class Solution { public boolean isEven(int n){return false;} }\n",
      cpp: "bool isEven(int n){return false;}\n",
    },
    tests: [
      { input: "isEven(4)", expected: "true" },
      { input: "isEven(7)", expected: "false" },
      { input: "isEven(0)", expected: "true" },
    ],
  },
  {
    id: "reverse",
    order: 5,
    difficulty: "medium",
    xpReward: 150,
    funcName: "reverseStr",
    title: t("Mirror, Mirror", "दर्पण, दर्पण", "Mirror, Mirror"),
    description: t("Return the reverse of the string s.", "स्ट्रिंग s का उल्टा लौटाएँ।", "String s ka ulta return karo."),
    hints: [
      t("Split, reverse, join.", "स्प्लिट, रिवर्स, जॉइन।", "Split, reverse, join."),
      t("s.split('').reverse().join('')", "s.split('').reverse().join('')", "s.split('').reverse().join('')"),
      t("Return the joined string.", "जुड़ी स्ट्रिंग लौटाएँ।", "Joined string return karo."),
    ],
    starter: {
      javascript: "function reverseStr(s) {\n  // your code here\n}\n",
      python: "def reverseStr(s):\n    pass\n",
      java: "class Solution { public String reverseStr(String s){return \"\";} }\n",
      cpp: "#include <string>\nstd::string reverseStr(std::string s){return \"\";}\n",
    },
    tests: [
      { input: "reverseStr('hello')", expected: "olleh" },
      { input: "reverseStr('quest')", expected: "tseuq" },
      { input: "reverseStr('')", expected: "" },
    ],
  },
  {
    id: "factorial",
    order: 6,
    difficulty: "medium",
    xpReward: 175,
    funcName: "factorial",
    title: t("Factory of Factorials", "फैक्टोरियल फैक्ट्री", "Factorial Factory"),
    description: t("Return n! (factorial of n).", "n का फैक्टोरियल लौटाएँ।", "n ka factorial return karo."),
    hints: [
      t("Use a loop or recursion.", "लूप या रिकर्शन।", "Loop ya recursion."),
      t("0! is 1.", "0! = 1.", "0! = 1."),
      t("Multiply 1..n.", "1..n तक गुणा।", "1..n tak multiply."),
    ],
    starter: {
      javascript: "function factorial(n) {\n  // your code here\n}\n",
      python: "def factorial(n):\n    pass\n",
      java: "class Solution { public int factorial(int n){return 0;} }\n",
      cpp: "int factorial(int n){return 0;}\n",
    },
    tests: [
      { input: "factorial(0)", expected: "1" },
      { input: "factorial(5)", expected: "120" },
      { input: "factorial(7)", expected: "5040" },
    ],
  },
  {
    id: "fizzbuzz",
    order: 7,
    difficulty: "medium",
    xpReward: 200,
    funcName: "fizzbuzz",
    title: t("Fizz Buzz Dungeon", "फ़िज़ बज़ डंजन", "FizzBuzz Dungeon"),
    description: t(
      "Return 'Fizz' if n divisible by 3, 'Buzz' if by 5, 'FizzBuzz' if by both, otherwise the number as a string.",
      "3 से विभाज्य 'Fizz', 5 से 'Buzz', दोनों से 'FizzBuzz', अन्यथा संख्या स्ट्रिंग में।",
      "3 se divisible 'Fizz', 5 se 'Buzz', dono se 'FizzBuzz', warna number string."
    ),
    hints: [
      t("Check both first.", "पहले दोनों चेक करें।", "Pehle dono check karo."),
      t("n % 15 === 0", "n % 15 === 0", "n % 15 === 0"),
      t("Return String(n) for default.", "डिफ़ॉल्ट में String(n)।", "Default me String(n)."),
    ],
    starter: {
      javascript: "function fizzbuzz(n) {\n  // your code here\n}\n",
      python: "def fizzbuzz(n):\n    pass\n",
      java: "class Solution { public String fizzbuzz(int n){return \"\";} }\n",
      cpp: "#include <string>\nstd::string fizzbuzz(int n){return \"\";}\n",
    },
    tests: [
      { input: "fizzbuzz(3)", expected: "Fizz" },
      { input: "fizzbuzz(5)", expected: "Buzz" },
      { input: "fizzbuzz(15)", expected: "FizzBuzz" },
      { input: "fizzbuzz(7)", expected: "7" },
    ],
  },
  {
    id: "palindrome",
    order: 8,
    difficulty: "medium",
    xpReward: 200,
    funcName: "isPalindrome",
    title: t("Palindrome Pyramid", "पैलिंड्रोम पिरामिड", "Palindrome Pyramid"),
    description: t("Return true if s reads the same forwards and backwards.", "अगर s दोनों तरफ़ से समान है तो true लौटाएँ।", "Agar s dono taraf se same hai to true return karo."),
    hints: [
      t("Compare s to its reverse.", "उल्टे से तुलना।", "Reverse se compare karo."),
      t("s === [...s].reverse().join('')", "s === [...s].reverse().join('')", "s === [...s].reverse().join('')"),
      t("Empty string is a palindrome.", "खाली पैलिंड्रोम है।", "Empty palindrome hai."),
    ],
    starter: {
      javascript: "function isPalindrome(s) {\n  // your code here\n}\n",
      python: "def isPalindrome(s):\n    pass\n",
      java: "class Solution { public boolean isPalindrome(String s){return false;} }\n",
      cpp: "#include <string>\nbool isPalindrome(std::string s){return false;}\n",
    },
    tests: [
      { input: "isPalindrome('racecar')", expected: "true" },
      { input: "isPalindrome('hello')", expected: "false" },
      { input: "isPalindrome('')", expected: "true" },
    ],
  },
  {
    id: "sumArray",
    order: 9,
    difficulty: "hard",
    xpReward: 250,
    funcName: "sumArr",
    title: t("Sum the Loot", "लूट का योग", "Loot ka Sum"),
    description: t("Return the sum of all numbers in the array arr.", "सभी संख्याओं का योग लौटाएँ।", "Sabhi numbers ka sum return karo."),
    hints: [
      t("Use reduce or a loop.", "reduce या लूप।", "reduce ya loop."),
      t("arr.reduce((a,b)=>a+b, 0)", "arr.reduce((a,b)=>a+b, 0)", "arr.reduce((a,b)=>a+b, 0)"),
      t("Empty array sums to 0.", "खाली का योग 0।", "Empty ka sum 0."),
    ],
    starter: {
      javascript: "function sumArr(arr) {\n  // your code here\n}\n",
      python: "def sumArr(arr):\n    pass\n",
      java: "class Solution { public int sumArr(int[] arr){return 0;} }\n",
      cpp: "#include <vector>\nint sumArr(std::vector<int> arr){return 0;}\n",
    },
    tests: [
      { input: "sumArr([1,2,3,4])", expected: "10" },
      { input: "sumArr([])", expected: "0" },
      { input: "sumArr([-1, 1, -1, 1])", expected: "0" },
    ],
  },
  {
    id: "fibonacci",
    order: 10,
    difficulty: "hard",
    xpReward: 300,
    funcName: "fib",
    title: t("Fibonacci Final Boss", "फ़िबोनाची अंतिम बॉस", "Fibonacci Final Boss"),
    description: t(
      "Return the nth Fibonacci number. fib(0)=0, fib(1)=1.",
      "n-वाँ फ़िबोनाची लौटाएँ। fib(0)=0, fib(1)=1.",
      "n-wa Fibonacci return karo. fib(0)=0, fib(1)=1."
    ),
    hints: [
      t("Iterate with two variables.", "दो वेरिएबल्स से लूप।", "Do variables se loop."),
      t("Avoid naive recursion for large n.", "बड़े n के लिए रिकर्शन बचें।", "Bade n ke liye recursion avoid karo."),
      t("a=0, b=1; loop n times swapping.", "a=0,b=1; n बार स्वैप।", "a=0,b=1; n baar swap."),
    ],
    starter: {
      javascript: "function fib(n) {\n  // your code here\n}\n",
      python: "def fib(n):\n    pass\n",
      java: "class Solution { public int fib(int n){return 0;} }\n",
      cpp: "int fib(int n){return 0;}\n",
    },
    tests: [
      { input: "fib(0)", expected: "0" },
      { input: "fib(1)", expected: "1" },
      { input: "fib(10)", expected: "55" },
      { input: "fib(15)", expected: "610" },
    ],
  },
];

export const ALL_BADGES = [
  { id: "first-blood", label: "First Blood", desc: "Solve your first quest", icon: "⚔️" },
  { id: "streak-3", label: "On Fire", desc: "3-day streak", icon: "🔥" },
  { id: "five-solved", label: "Adventurer", desc: "Solve 5 quests", icon: "🛡️" },
  { id: "polyglot", label: "Polyglot", desc: "Switch programming language", icon: "🌐" },
  { id: "no-hints", label: "Pure Mind", desc: "Solve a quest with no hints", icon: "🧠" },
  { id: "boss-slayer", label: "Boss Slayer", desc: "Beat the final quest", icon: "👑" },
];
