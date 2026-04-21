import type { ProgrammingLanguage } from "@/lib/storage";
import { createChallengeFromTemplate, type NewChallengeInput } from "@/data/challengeTemplates";

export interface ChallengeTest {
  input: string; // call expression like `add(2, 3)` for JS
  expected: string;
}

export interface LocalizedText {
  en: string;
  hi: string;
  "hi-en": string;
}

export type Track = "basics" | "intermediate" | "advanced" | "hardcore";

export const TRACK_ORDER: Track[] = ["basics", "intermediate", "advanced", "hardcore"];

export interface Challenge {
  id: string;
  order: number;
  track?: Track;
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
      javascript: "function add(a, b) {\n  return a + b;\n}\n",
      python: "def add(a, b):\n    return a + b\n",
      java: "class Solution {\n  public int add(int a, int b) { return a + b; }\n}\n",
      cpp: "int add(int a, int b) {\n  return a + b;\n}\n",
    },
    tests: [{ input: "add(2, 3)", expected: "5" }],
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

// Mark all basic challenges
SEED_CHALLENGES.forEach((c) => {
  if (!c.track) c.track = "basics";
});

export const INTERMEDIATE_CHALLENGES: Challenge[] = [
  {
    id: "twoSum",
    order: 11,
    track: "intermediate",
    difficulty: "medium",
    xpReward: 200,
    funcName: "twoSum",
    title: t("Twin Daggers", "जुड़वाँ खंजर", "Twin Daggers"),
    description: t(
      "Return indices [i, j] of two numbers in arr that sum to target.",
      "arr में दो संख्याओं के सूचकांक लौटाएँ जिनका योग target हो।",
      "arr me do numbers ke indices return karo jinka sum target ho."
    ),
    hints: [
      t("Use a hash map.", "हैश मैप का उपयोग।", "Hash map use karo."),
      t("Store value -> index.", "value -> index स्टोर करें।", "value -> index store karo."),
      t("Check target - n in map.", "target - n मैप में देखें।", "target - n map me check karo."),
    ],
    starter: {
      javascript: "function twoSum(arr, target) {\n  // your code here\n}\n",
      python: "def twoSum(arr, target):\n    pass\n",
      java: "class Solution { public int[] twoSum(int[] arr, int target){return new int[]{}; } }\n",
      cpp: "#include <vector>\nstd::vector<int> twoSum(std::vector<int> arr, int target){return {};}\n",
    },
    tests: [
      { input: "twoSum([2,7,11,15], 9)", expected: "[0,1]" },
      { input: "twoSum([3,2,4], 6)", expected: "[1,2]" },
      { input: "twoSum([1,5,3,7], 10)", expected: "[2,3]" },
    ],
  },
  {
    id: "anagram",
    order: 12,
    track: "intermediate",
    difficulty: "medium",
    xpReward: 200,
    funcName: "isAnagram",
    title: t("Anagram Altar", "अनाग्राम वेदी", "Anagram Altar"),
    description: t(
      "Return true if strings a and b are anagrams of each other.",
      "अगर a और b एक-दूसरे के anagram हैं तो true लौटाएँ।",
      "Agar a aur b anagrams hain to true return karo."
    ),
    hints: [
      t("Sort both strings.", "दोनों को sort करें।", "Dono ko sort karo."),
      t("Or count characters.", "या characters गिनें।", "Ya characters count karo."),
      t("Compare lengths first.", "पहले लंबाई जांचें।", "Pehle length check karo."),
    ],
    starter: {
      javascript: "function isAnagram(a, b) {\n  // your code here\n}\n",
      python: "def isAnagram(a, b):\n    pass\n",
      java: "class Solution { public boolean isAnagram(String a, String b){return false;} }\n",
      cpp: "#include <string>\nbool isAnagram(std::string a, std::string b){return false;}\n",
    },
    tests: [
      { input: "isAnagram('listen','silent')", expected: "true" },
      { input: "isAnagram('hello','world')", expected: "false" },
      { input: "isAnagram('a','a')", expected: "true" },
    ],
  },
  {
    id: "uniqueArr",
    order: 13,
    track: "intermediate",
    difficulty: "medium",
    xpReward: 200,
    funcName: "unique",
    title: t("Crystal of Uniques", "अद्वितीय क्रिस्टल", "Unique Crystal"),
    description: t(
      "Return a new array with only unique values from arr, preserving order.",
      "केवल अद्वितीय मानों के साथ नया array लौटाएँ।",
      "Sirf unique values ka naya array return karo."
    ),
    hints: [
      t("Use a Set.", "Set का उपयोग।", "Set use karo."),
      t("[...new Set(arr)]", "[...new Set(arr)]", "[...new Set(arr)]"),
      t("Order is preserved by Set.", "Set में क्रम बना रहता है।", "Set order maintain karta hai."),
    ],
    starter: {
      javascript: "function unique(arr) {\n  // your code here\n}\n",
      python: "def unique(arr):\n    pass\n",
      java: "class Solution { public int[] unique(int[] arr){return new int[]{};} }\n",
      cpp: "#include <vector>\nstd::vector<int> unique(std::vector<int> arr){return {};}\n",
    },
    tests: [
      { input: "unique([1,2,2,3,1,4])", expected: "[1,2,3,4]" },
      { input: "unique([])", expected: "[]" },
      { input: "unique([5,5,5])", expected: "[5]" },
    ],
  },
  {
    id: "countVowels",
    order: 14,
    track: "intermediate",
    difficulty: "easy",
    xpReward: 175,
    funcName: "countVowels",
    title: t("Vowel Vault", "स्वर तिजोरी", "Vowel Vault"),
    description: t(
      "Return the number of vowels (a,e,i,o,u) in s, case-insensitive.",
      "s में vowels की संख्या लौटाएँ।",
      "s me vowels ki count return karo."
    ),
    hints: [
      t("Lowercase first.", "पहले lowercase करें।", "Pehle lowercase karo."),
      t("Use a regex /[aeiou]/g.", "regex /[aeiou]/g।", "regex /[aeiou]/g use karo."),
      t("match returns array or null.", "match array या null।", "match array ya null deta hai."),
    ],
    starter: {
      javascript: "function countVowels(s) {\n  // your code here\n}\n",
      python: "def countVowels(s):\n    pass\n",
      java: "class Solution { public int countVowels(String s){return 0;} }\n",
      cpp: "#include <string>\nint countVowels(std::string s){return 0;}\n",
    },
    tests: [
      { input: "countVowels('Hello')", expected: "2" },
      { input: "countVowels('CodeQuest')", expected: "4" },
      { input: "countVowels('xyz')", expected: "0" },
    ],
  },
  {
    id: "powerOf",
    order: 15,
    track: "intermediate",
    difficulty: "medium",
    xpReward: 200,
    funcName: "power",
    title: t("Power Stone", "शक्ति पत्थर", "Power Stone"),
    description: t(
      "Return base raised to exp (integer exp >= 0). Do not use Math.pow.",
      "base की exp घात लौटाएँ।",
      "base ki exp power return karo."
    ),
    hints: [
      t("Loop and multiply.", "लूप और गुणा।", "Loop aur multiply."),
      t("Start result at 1.", "result 1 से शुरू।", "result 1 se start karo."),
      t("exp=0 returns 1.", "exp=0 → 1.", "exp=0 → 1."),
    ],
    starter: {
      javascript: "function power(base, exp) {\n  // your code here\n}\n",
      python: "def power(base, exp):\n    pass\n",
      java: "class Solution { public int power(int base, int exp){return 0;} }\n",
      cpp: "int power(int base,int exp){return 0;}\n",
    },
    tests: [
      { input: "power(2, 10)", expected: "1024" },
      { input: "power(5, 0)", expected: "1" },
      { input: "power(3, 4)", expected: "81" },
    ],
  },
  {
    id: "gcd",
    order: 16,
    track: "intermediate",
    difficulty: "medium",
    xpReward: 225,
    funcName: "gcd",
    title: t("Common Divisor Quest", "महत्तम समापवर्तक", "GCD Quest"),
    description: t(
      "Return the greatest common divisor of a and b.",
      "a और b का GCD लौटाएँ।",
      "a aur b ka GCD return karo."
    ),
    hints: [
      t("Use Euclid's algorithm.", "यूक्लिड का एल्गोरिदम।", "Euclid algorithm use karo."),
      t("gcd(a,b) = gcd(b, a%b).", "gcd(a,b) = gcd(b, a%b)।", "gcd(a,b) = gcd(b, a%b)."),
      t("When b=0, return a.", "b=0 तो a लौटाएँ।", "b=0 to a return karo."),
    ],
    starter: {
      javascript: "function gcd(a, b) {\n  // your code here\n}\n",
      python: "def gcd(a, b):\n    pass\n",
      java: "class Solution { public int gcd(int a,int b){return 0;} }\n",
      cpp: "int gcd(int a,int b){return 0;}\n",
    },
    tests: [
      { input: "gcd(12, 18)", expected: "6" },
      { input: "gcd(7, 13)", expected: "1" },
      { input: "gcd(100, 75)", expected: "25" },
    ],
  },
  {
    id: "rotateArr",
    order: 17,
    track: "intermediate",
    difficulty: "medium",
    xpReward: 225,
    funcName: "rotate",
    title: t("Spinning Cogs", "घूमते पुर्ज़े", "Spinning Cogs"),
    description: t(
      "Rotate array arr to the right by k steps and return it.",
      "arr को k कदम दाएँ rotate करें।",
      "arr ko k steps right rotate karo."
    ),
    hints: [
      t("Use slice.", "slice का उपयोग।", "slice use karo."),
      t("k = k % arr.length.", "k = k % arr.length.", "k = k % arr.length."),
      t("Concat last k with rest.", "अंतिम k को आगे जोड़ें।", "Last k ko aage jodo."),
    ],
    starter: {
      javascript: "function rotate(arr, k) {\n  // your code here\n}\n",
      python: "def rotate(arr, k):\n    pass\n",
      java: "class Solution { public int[] rotate(int[] arr,int k){return arr;} }\n",
      cpp: "#include <vector>\nstd::vector<int> rotate(std::vector<int> arr,int k){return arr;}\n",
    },
    tests: [
      { input: "rotate([1,2,3,4,5], 2)", expected: "[4,5,1,2,3]" },
      { input: "rotate([1,2,3], 0)", expected: "[1,2,3]" },
      { input: "rotate([1,2,3,4], 5)", expected: "[4,1,2,3]" },
    ],
  },
  {
    id: "primes",
    order: 18,
    track: "intermediate",
    difficulty: "hard",
    xpReward: 275,
    funcName: "isPrime",
    title: t("Prime Sanctuary", "अभाज्य अभयारण्य", "Prime Sanctuary"),
    description: t(
      "Return true if n is a prime number, false otherwise.",
      "अगर n अभाज्य है तो true लौटाएँ।",
      "Agar n prime hai to true return karo."
    ),
    hints: [
      t("n < 2 is not prime.", "n<2 prime नहीं।", "n<2 prime nahi."),
      t("Check up to sqrt(n).", "sqrt(n) तक जांचें।", "sqrt(n) tak check karo."),
      t("Return false on any divisor.", "किसी divisor पर false।", "Kisi divisor pe false."),
    ],
    starter: {
      javascript: "function isPrime(n) {\n  // your code here\n}\n",
      python: "def isPrime(n):\n    pass\n",
      java: "class Solution { public boolean isPrime(int n){return false;} }\n",
      cpp: "bool isPrime(int n){return false;}\n",
    },
    tests: [
      { input: "isPrime(2)", expected: "true" },
      { input: "isPrime(15)", expected: "false" },
      { input: "isPrime(17)", expected: "true" },
      { input: "isPrime(1)", expected: "false" },
    ],
  },
  {
    id: "flatten",
    order: 19,
    track: "intermediate",
    difficulty: "hard",
    xpReward: 275,
    funcName: "flatten",
    title: t("Flatten the Beast", "परत हटाओ", "Flatten Beast"),
    description: t(
      "Flatten a nested array of integers into a single-level array.",
      "नेस्टेड array को एक स्तर में बदलें।",
      "Nested array ko single level me karo."
    ),
    hints: [
      t("Use recursion.", "रिकर्शन उपयोग करें।", "Recursion use karo."),
      t("Or arr.flat(Infinity).", "arr.flat(Infinity)।", "arr.flat(Infinity)."),
      t("Check Array.isArray.", "Array.isArray जांचें।", "Array.isArray check karo."),
    ],
    starter: {
      javascript: "function flatten(arr) {\n  // your code here\n}\n",
      python: "def flatten(arr):\n    pass\n",
      java: "import java.util.*;\nclass Solution { public List<Integer> flatten(List<Object> arr){return new ArrayList<>();} }\n",
      cpp: "#include <vector>\nstd::vector<int> flatten(std::vector<int> arr){return arr;}\n",
    },
    tests: [
      { input: "flatten([1,[2,[3,[4]]]])", expected: "[1,2,3,4]" },
      { input: "flatten([])", expected: "[]" },
      { input: "flatten([[1,2],[3,4]])", expected: "[1,2,3,4]" },
    ],
  },
  {
    id: "binarySearch",
    order: 20,
    track: "intermediate",
    difficulty: "hard",
    xpReward: 350,
    funcName: "binarySearch",
    title: t("Binary Search Boss", "बाइनरी सर्च बॉस", "Binary Search Boss"),
    description: t(
      "Return index of target in sorted arr, or -1 if not found. Use binary search.",
      "sorted arr में target का index लौटाएँ, अन्यथा -1।",
      "Sorted arr me target ka index return karo, warna -1."
    ),
    hints: [
      t("Track lo and hi pointers.", "lo और hi pointers।", "lo aur hi pointers."),
      t("mid = (lo + hi) >> 1.", "mid = (lo+hi)>>1.", "mid = (lo+hi)>>1."),
      t("Narrow based on comparison.", "तुलना से narrow करें।", "Comparison se narrow karo."),
    ],
    starter: {
      javascript: "function binarySearch(arr, target) {\n  // your code here\n}\n",
      python: "def binarySearch(arr, target):\n    pass\n",
      java: "class Solution { public int binarySearch(int[] arr,int t){return -1;} }\n",
      cpp: "#include <vector>\nint binarySearch(std::vector<int> arr,int t){return -1;}\n",
    },
    tests: [
      { input: "binarySearch([1,3,5,7,9,11], 7)", expected: "3" },
      { input: "binarySearch([1,2,3,4,5], 6)", expected: "-1" },
      { input: "binarySearch([10,20,30,40], 10)", expected: "0" },
      { input: "binarySearch([], 5)", expected: "-1" },
    ],
  },
];

export const ADVANCED_CHALLENGES: Challenge[] = [
  {
    id: "mergeSorted", order: 21, track: "advanced", difficulty: "medium", xpReward: 300, funcName: "mergeSorted",
    title: t("Merge of Realms", "क्षेत्रों का विलय", "Realms ka Merge"),
    description: t("Merge two sorted arrays a and b into one sorted array.", "दो sorted arrays को एक sorted array में मिलाएँ।", "Do sorted arrays ko ek sorted array me merge karo."),
    hints: [
      t("Use two pointers.", "दो pointers।", "Two pointers."),
      t("Compare and push smaller.", "छोटा push करें।", "Chhota push karo."),
      t("Append remainder.", "बचा हुआ append।", "Remainder append karo."),
    ],
    starter: {
      javascript: "function mergeSorted(a, b) {\n  // your code here\n}\n",
      python: "def mergeSorted(a, b):\n    pass\n",
      java: "class Solution { public int[] mergeSorted(int[] a,int[] b){return new int[]{};} }\n",
      cpp: "#include <vector>\nstd::vector<int> mergeSorted(std::vector<int> a,std::vector<int> b){return {};}\n",
    },
    tests: [
      { input: "mergeSorted([1,3,5],[2,4,6])", expected: "[1,2,3,4,5,6]" },
      { input: "mergeSorted([],[1,2])", expected: "[1,2]" },
      { input: "mergeSorted([1,1,1],[1,1])", expected: "[1,1,1,1,1]" },
    ],
  },
  {
    id: "longestSubstr", order: 22, track: "advanced", difficulty: "hard", xpReward: 350, funcName: "longestUnique",
    title: t("Sliding Catacombs", "स्लाइडिंग कैटाकॉम्ब", "Sliding Catacombs"),
    description: t("Return length of longest substring of s without repeating characters.", "बिना दोहराव वाले सबसे लंबे substring की लंबाई।", "Bina repeat ke longest substring ki length."),
    hints: [
      t("Use a sliding window.", "Sliding window।", "Sliding window."),
      t("Track chars in a Set.", "Set में chars।", "Set me chars track karo."),
      t("Shrink from left on dup.", "Duplicate पर left shrink।", "Duplicate pe left shrink."),
    ],
    starter: {
      javascript: "function longestUnique(s) {\n  // your code here\n}\n",
      python: "def longestUnique(s):\n    pass\n",
      java: "class Solution { public int longestUnique(String s){return 0;} }\n",
      cpp: "#include <string>\nint longestUnique(std::string s){return 0;}\n",
    },
    tests: [
      { input: "longestUnique('abcabcbb')", expected: "3" },
      { input: "longestUnique('bbbbb')", expected: "1" },
      { input: "longestUnique('pwwkew')", expected: "3" },
    ],
  },
  {
    id: "validParens", order: 23, track: "advanced", difficulty: "medium", xpReward: 300, funcName: "validParens",
    title: t("Stack of Gates", "फाटकों का स्टैक", "Gates ka Stack"),
    description: t("Return true if s contains valid matched parentheses (), [], {}.", "अगर s में सही parentheses हैं तो true।", "Agar s me valid parentheses hain to true."),
    hints: [
      t("Use a stack.", "Stack use करें।", "Stack use karo."),
      t("Push opening, match closing.", "Opening push, closing match।", "Opening push, closing match."),
      t("Empty at end = valid.", "अंत में खाली = valid।", "End me empty = valid."),
    ],
    starter: {
      javascript: "function validParens(s) {\n  // your code here\n}\n",
      python: "def validParens(s):\n    pass\n",
      java: "class Solution { public boolean validParens(String s){return false;} }\n",
      cpp: "#include <string>\nbool validParens(std::string s){return false;}\n",
    },
    tests: [
      { input: "validParens('()[]{}')", expected: "true" },
      { input: "validParens('(]')", expected: "false" },
      { input: "validParens('{[()]}')", expected: "true" },
      { input: "validParens('(')", expected: "false" },
    ],
  },
  {
    id: "groupAnagrams", order: 24, track: "advanced", difficulty: "hard", xpReward: 350, funcName: "groupCount",
    title: t("Anagram Brotherhood", "अनाग्राम भाईचारा", "Anagram Brotherhood"),
    description: t("Return the number of anagram groups in array of strings arr.", "anagram समूहों की संख्या लौटाएँ।", "Anagram groups ki count return karo."),
    hints: [
      t("Sort each string as key.", "हर string को sort करके key।", "Har string ko sort karke key."),
      t("Use a map.", "Map use करें।", "Map use karo."),
      t("Return map size.", "Map size लौटाएँ।", "Map size return karo."),
    ],
    starter: {
      javascript: "function groupCount(arr) {\n  // your code here\n}\n",
      python: "def groupCount(arr):\n    pass\n",
      java: "class Solution { public int groupCount(String[] arr){return 0;} }\n",
      cpp: "#include <vector>\n#include <string>\nint groupCount(std::vector<std::string> arr){return 0;}\n",
    },
    tests: [
      { input: "groupCount(['eat','tea','tan','ate','nat','bat'])", expected: "3" },
      { input: "groupCount([''])", expected: "1" },
      { input: "groupCount(['a'])", expected: "1" },
    ],
  },
  {
    id: "maxSubarray", order: 25, track: "advanced", difficulty: "hard", xpReward: 375, funcName: "maxSub",
    title: t("Kadane's Crucible", "कदाने की भट्टी", "Kadane Crucible"),
    description: t("Return the maximum sum of any contiguous subarray of arr.", "किसी भी contiguous subarray का अधिकतम योग।", "Contiguous subarray ka max sum return karo."),
    hints: [
      t("Use Kadane's algorithm.", "Kadane का algorithm।", "Kadane algorithm."),
      t("Track current and best.", "current और best।", "Current aur best track karo."),
      t("Reset current at negatives.", "Negative पर reset।", "Negative pe reset."),
    ],
    starter: {
      javascript: "function maxSub(arr) {\n  // your code here\n}\n",
      python: "def maxSub(arr):\n    pass\n",
      java: "class Solution { public int maxSub(int[] arr){return 0;} }\n",
      cpp: "#include <vector>\nint maxSub(std::vector<int> arr){return 0;}\n",
    },
    tests: [
      { input: "maxSub([-2,1,-3,4,-1,2,1,-5,4])", expected: "6" },
      { input: "maxSub([1])", expected: "1" },
      { input: "maxSub([5,4,-1,7,8])", expected: "23" },
    ],
  },
  {
    id: "climbStairs", order: 26, track: "advanced", difficulty: "medium", xpReward: 300, funcName: "climb",
    title: t("Tower Climber", "मीनार आरोही", "Tower Climber"),
    description: t("Return the number of ways to climb n stairs taking 1 or 2 steps.", "n सीढ़ियाँ चढ़ने के तरीके।", "n stairs climb karne ke ways."),
    hints: [
      t("It's Fibonacci.", "यह Fibonacci है।", "Yeh Fibonacci hai."),
      t("dp[n] = dp[n-1] + dp[n-2].", "dp[n] = dp[n-1]+dp[n-2]।", "dp[n] = dp[n-1]+dp[n-2]."),
      t("Base: 1 way for 1, 2 for 2.", "1→1, 2→2.", "1→1, 2→2."),
    ],
    starter: {
      javascript: "function climb(n) {\n  // your code here\n}\n",
      python: "def climb(n):\n    pass\n",
      java: "class Solution { public int climb(int n){return 0;} }\n",
      cpp: "int climb(int n){return 0;}\n",
    },
    tests: [
      { input: "climb(2)", expected: "2" },
      { input: "climb(3)", expected: "3" },
      { input: "climb(10)", expected: "89" },
    ],
  },
  {
    id: "missingNum", order: 27, track: "advanced", difficulty: "medium", xpReward: 275, funcName: "missing",
    title: t("Missing Rune", "गायब रूण", "Missing Rune"),
    description: t("Given arr containing n distinct numbers from 0..n, return the missing one.", "0..n में से गायब संख्या लौटाएँ।", "0..n me se missing number return karo."),
    hints: [
      t("Sum formula n(n+1)/2.", "n(n+1)/2।", "n(n+1)/2."),
      t("Subtract array sum.", "Array sum घटाएँ।", "Array sum subtract karo."),
      t("Or use XOR.", "या XOR।", "Ya XOR."),
    ],
    starter: {
      javascript: "function missing(arr) {\n  // your code here\n}\n",
      python: "def missing(arr):\n    pass\n",
      java: "class Solution { public int missing(int[] arr){return 0;} }\n",
      cpp: "#include <vector>\nint missing(std::vector<int> arr){return 0;}\n",
    },
    tests: [
      { input: "missing([3,0,1])", expected: "2" },
      { input: "missing([0,1])", expected: "2" },
      { input: "missing([9,6,4,2,3,5,7,0,1])", expected: "8" },
    ],
  },
  {
    id: "intersect", order: 28, track: "advanced", difficulty: "medium", xpReward: 300, funcName: "intersect",
    title: t("Crossroads", "चौराहा", "Crossroads"),
    description: t("Return sorted array of unique values present in both a and b.", "दोनों में मौजूद unique values का sorted array।", "Dono me present unique values ka sorted array."),
    hints: [
      t("Use Sets.", "Sets।", "Sets use karo."),
      t("Filter then sort.", "Filter फिर sort।", "Filter phir sort."),
      t("Sort numerically.", "Number से sort।", "Number se sort."),
    ],
    starter: {
      javascript: "function intersect(a, b) {\n  // your code here\n}\n",
      python: "def intersect(a, b):\n    pass\n",
      java: "class Solution { public int[] intersect(int[] a,int[] b){return new int[]{};} }\n",
      cpp: "#include <vector>\nstd::vector<int> intersect(std::vector<int> a,std::vector<int> b){return {};}\n",
    },
    tests: [
      { input: "intersect([1,2,2,1],[2,2])", expected: "[2]" },
      { input: "intersect([4,9,5],[9,4,9,8,4])", expected: "[4,9]" },
      { input: "intersect([1,2,3],[4,5,6])", expected: "[]" },
    ],
  },
  {
    id: "romanToInt", order: 29, track: "advanced", difficulty: "hard", xpReward: 350, funcName: "romanToInt",
    title: t("Scrolls of Rome", "रोम के पन्ने", "Rome ke Scrolls"),
    description: t("Convert Roman numeral string s to an integer.", "Roman numeral को integer में बदलें।", "Roman numeral ko integer me convert karo."),
    hints: [
      t("Map I=1,V=5,X=10,L=50,C=100,D=500,M=1000.", "मानचित्र बनाएँ।", "Map banao."),
      t("Subtract if smaller before larger.", "छोटा बड़े से पहले तो घटाएँ।", "Chhota bade se pehle to subtract."),
      t("Iterate left to right.", "Left to right।", "Left to right."),
    ],
    starter: {
      javascript: "function romanToInt(s) {\n  // your code here\n}\n",
      python: "def romanToInt(s):\n    pass\n",
      java: "class Solution { public int romanToInt(String s){return 0;} }\n",
      cpp: "#include <string>\nint romanToInt(std::string s){return 0;}\n",
    },
    tests: [
      { input: "romanToInt('III')", expected: "3" },
      { input: "romanToInt('LVIII')", expected: "58" },
      { input: "romanToInt('MCMXCIV')", expected: "1994" },
    ],
  },
  {
    id: "coinChange", order: 30, track: "advanced", difficulty: "hard", xpReward: 400, funcName: "coinChange",
    title: t("Treasury Trial", "खज़ाने की परीक्षा", "Treasury Trial"),
    description: t("Return fewest coins needed to make amount from coins, or -1.", "amount बनाने के लिए न्यूनतम सिक्के, अन्यथा -1।", "Amount banane ke liye min coins, warna -1."),
    hints: [
      t("Use DP array of size amount+1.", "DP array।", "DP array."),
      t("dp[i] = min(dp[i-c]+1).", "dp[i] = min(dp[i-c]+1)।", "dp[i] = min(dp[i-c]+1)."),
      t("Init with Infinity, dp[0]=0.", "dp[0]=0।", "dp[0]=0."),
    ],
    starter: {
      javascript: "function coinChange(coins, amount) {\n  // your code here\n}\n",
      python: "def coinChange(coins, amount):\n    pass\n",
      java: "class Solution { public int coinChange(int[] coins,int amount){return -1;} }\n",
      cpp: "#include <vector>\nint coinChange(std::vector<int> coins,int amount){return -1;}\n",
    },
    tests: [
      { input: "coinChange([1,2,5], 11)", expected: "3" },
      { input: "coinChange([2], 3)", expected: "-1" },
      { input: "coinChange([1], 0)", expected: "0" },
    ],
  },
];

export const HARDCORE_CHALLENGES: Challenge[] = [
  {
    id: "lru", order: 31, track: "hardcore", difficulty: "hard", xpReward: 500, funcName: "lruRun",
    title: t("LRU Labyrinth", "LRU भूलभुलैया", "LRU Labyrinth"),
    description: t(
      "Implement LRU cache with capacity. lruRun(capacity, ops) where ops is array of ['put',k,v] or ['get',k]. Return array of get results.",
      "LRU cache लागू करें।",
      "LRU cache implement karo."
    ),
    hints: [
      t("Use Map (preserves insertion order).", "Map use करें।", "Map use karo."),
      t("On get, delete and re-set.", "get पर delete+set।", "Get pe delete+set."),
      t("Evict first key when over.", "ज़्यादा हो तो first delete।", "Capacity over to first delete."),
    ],
    starter: {
      javascript: "function lruRun(capacity, ops) {\n  // your code here\n}\n",
      python: "def lruRun(capacity, ops):\n    pass\n",
      java: "class Solution { public int[] lruRun(int capacity, Object[][] ops){return new int[]{};} }\n",
      cpp: "#include <vector>\nstd::vector<int> lruRun(int capacity, std::vector<std::vector<int>> ops){return {};}\n",
    },
    tests: [
      { input: "lruRun(2, [['put',1,1],['put',2,2],['get',1],['put',3,3],['get',2],['get',3]])", expected: "[1,-1,3]" },
      { input: "lruRun(1, [['put',1,1],['put',2,2],['get',1],['get',2]])", expected: "[-1,2]" },
    ],
  },
  {
    id: "wordBreak", order: 32, track: "hardcore", difficulty: "hard", xpReward: 500, funcName: "wordBreak",
    title: t("Lexicon Gauntlet", "शब्दकोश गौंटलेट", "Lexicon Gauntlet"),
    description: t("Return true if s can be segmented into words from dict.", "अगर s को dict के शब्दों में बांटा जा सके तो true।", "Agar s ko dict words me todh sakte hain to true."),
    hints: [
      t("DP boolean array.", "DP array।", "DP array."),
      t("dp[i] true if any j with dp[j] && s[j..i] in dict.", "DP recurrence।", "DP recurrence."),
      t("Use a Set for dict.", "dict के लिए Set।", "Dict ke liye Set."),
    ],
    starter: {
      javascript: "function wordBreak(s, dict) {\n  // your code here\n}\n",
      python: "def wordBreak(s, dict):\n    pass\n",
      java: "import java.util.*;\nclass Solution { public boolean wordBreak(String s, List<String> dict){return false;} }\n",
      cpp: "#include <vector>\n#include <string>\nbool wordBreak(std::string s, std::vector<std::string> dict){return false;}\n",
    },
    tests: [
      { input: "wordBreak('leetcode', ['leet','code'])", expected: "true" },
      { input: "wordBreak('applepenapple', ['apple','pen'])", expected: "true" },
      { input: "wordBreak('catsandog', ['cats','dog','sand','and','cat'])", expected: "false" },
    ],
  },
  {
    id: "trapRain", order: 33, track: "hardcore", difficulty: "hard", xpReward: 550, funcName: "trap",
    title: t("Rainwater Ravine", "वर्षाजल खाई", "Rainwater Ravine"),
    description: t("Given heights array, return total trapped rainwater.", "heights से कुल फँसा पानी।", "Heights se total trapped water."),
    hints: [
      t("Two pointers from ends.", "दोनों सिरों से pointers।", "Dono ends se pointers."),
      t("Track leftMax, rightMax.", "leftMax, rightMax।", "leftMax, rightMax."),
      t("Add (max - height) per step.", "(max - height) जोड़ें।", "(max - height) add karo."),
    ],
    starter: {
      javascript: "function trap(arr) {\n  // your code here\n}\n",
      python: "def trap(arr):\n    pass\n",
      java: "class Solution { public int trap(int[] arr){return 0;} }\n",
      cpp: "#include <vector>\nint trap(std::vector<int> arr){return 0;}\n",
    },
    tests: [
      { input: "trap([0,1,0,2,1,0,1,3,2,1,2,1])", expected: "6" },
      { input: "trap([4,2,0,3,2,5])", expected: "9" },
      { input: "trap([])", expected: "0" },
    ],
  },
  {
    id: "editDistance", order: 34, track: "hardcore", difficulty: "hard", xpReward: 600, funcName: "editDist",
    title: t("Scribe's Curse", "लेखक का अभिशाप", "Scribe Curse"),
    description: t("Return minimum edit distance to convert string a to b.", "a से b बनाने की न्यूनतम edits।", "a se b banane ke min edits."),
    hints: [
      t("2D DP table.", "2D DP।", "2D DP."),
      t("Insert/delete/replace = 1 op.", "Insert/delete/replace।", "Insert/delete/replace."),
      t("Match → diagonal.", "Match → diagonal।", "Match → diagonal."),
    ],
    starter: {
      javascript: "function editDist(a, b) {\n  // your code here\n}\n",
      python: "def editDist(a, b):\n    pass\n",
      java: "class Solution { public int editDist(String a, String b){return 0;} }\n",
      cpp: "#include <string>\nint editDist(std::string a, std::string b){return 0;}\n",
    },
    tests: [
      { input: "editDist('horse','ros')", expected: "3" },
      { input: "editDist('intention','execution')", expected: "5" },
      { input: "editDist('','abc')", expected: "3" },
    ],
  },
  {
    id: "nQueens", order: 35, track: "hardcore", difficulty: "hard", xpReward: 600, funcName: "nQueens",
    title: t("N-Queens Citadel", "N-क्वीन्स गढ़", "N-Queens Citadel"),
    description: t("Return number of distinct solutions to N-Queens for n.", "N-Queens के distinct solutions की संख्या।", "N-Queens ke distinct solutions count."),
    hints: [
      t("Backtracking by row.", "Row से backtracking।", "Row se backtracking."),
      t("Track cols, diagonals.", "Cols, diagonals।", "Cols, diagonals."),
      t("Two diagonal sets: r+c, r-c.", "r+c, r-c।", "r+c, r-c."),
    ],
    starter: {
      javascript: "function nQueens(n) {\n  // your code here\n}\n",
      python: "def nQueens(n):\n    pass\n",
      java: "class Solution { public int nQueens(int n){return 0;} }\n",
      cpp: "int nQueens(int n){return 0;}\n",
    },
    tests: [
      { input: "nQueens(4)", expected: "2" },
      { input: "nQueens(1)", expected: "1" },
      { input: "nQueens(8)", expected: "92" },
    ],
  },
  {
    id: "medianTwo", order: 36, track: "hardcore", difficulty: "hard", xpReward: 650, funcName: "medianTwo",
    title: t("Twin Median Trial", "जुड़वाँ माध्यिका", "Twin Median"),
    description: t("Return median of two sorted arrays a and b.", "दो sorted arrays की median।", "Do sorted arrays ki median."),
    hints: [
      t("Merge then index for simple sol.", "Merge करके index।", "Merge karke index."),
      t("Or binary search partition.", "या binary search।", "Ya binary search."),
      t("Even length → avg of middle two.", "Even → middle two avg।", "Even → middle two avg."),
    ],
    starter: {
      javascript: "function medianTwo(a, b) {\n  // your code here\n}\n",
      python: "def medianTwo(a, b):\n    pass\n",
      java: "class Solution { public double medianTwo(int[] a,int[] b){return 0;} }\n",
      cpp: "#include <vector>\ndouble medianTwo(std::vector<int> a,std::vector<int> b){return 0;}\n",
    },
    tests: [
      { input: "medianTwo([1,3],[2])", expected: "2" },
      { input: "medianTwo([1,2],[3,4])", expected: "2.5" },
      { input: "medianTwo([0,0],[0,0])", expected: "0" },
    ],
  },
  {
    id: "regexMatch", order: 37, track: "hardcore", difficulty: "hard", xpReward: 600, funcName: "regexMatch",
    title: t("Glyph of Patterns", "पैटर्न ग्लिफ़", "Pattern Glyph"),
    description: t("Implement regex match with '.' and '*' for s and pattern p.", "'.' और '*' के साथ regex match।", "'.' aur '*' ke saath regex match."),
    hints: [
      t("DP grid (len(s)+1) x (len(p)+1).", "DP grid।", "DP grid."),
      t("'*' matches 0 or more of prev.", "'*' = 0 या अधिक।", "'*' = 0 ya more."),
      t("'.' matches any char.", "'.' = any।", "'.' = any."),
    ],
    starter: {
      javascript: "function regexMatch(s, p) {\n  // your code here\n}\n",
      python: "def regexMatch(s, p):\n    pass\n",
      java: "class Solution { public boolean regexMatch(String s, String p){return false;} }\n",
      cpp: "#include <string>\nbool regexMatch(std::string s, std::string p){return false;}\n",
    },
    tests: [
      { input: "regexMatch('aa','a')", expected: "false" },
      { input: "regexMatch('aa','a*')", expected: "true" },
      { input: "regexMatch('ab','.*')", expected: "true" },
      { input: "regexMatch('mississippi','mis*is*p*.')", expected: "false" },
    ],
  },
  {
    id: "serializeTree", order: 38, track: "hardcore", difficulty: "hard", xpReward: 600, funcName: "treeRoundTrip",
    title: t("Tree of Echoes", "गूँज का वृक्ष", "Echo Tree"),
    description: t(
      "treeRoundTrip(arr) — serialize then deserialize a binary tree (BFS array form with nulls). Return the resulting BFS array (trailing nulls trimmed).",
      "Serialize-deserialize round-trip।",
      "Serialize-deserialize round-trip."
    ),
    hints: [
      t("Use BFS with a queue.", "BFS queue।", "BFS queue."),
      t("Represent null leaves explicitly.", "null leaves explicit।", "Null leaves explicit."),
      t("Trim trailing nulls.", "अंतिम nulls हटाएँ।", "Trailing nulls trim karo."),
    ],
    starter: {
      javascript: "function treeRoundTrip(arr) {\n  // your code here\n}\n",
      python: "def treeRoundTrip(arr):\n    pass\n",
      java: "class Solution { public Object[] treeRoundTrip(Object[] arr){return arr;} }\n",
      cpp: "#include <vector>\nstd::vector<int> treeRoundTrip(std::vector<int> arr){return arr;}\n",
    },
    tests: [
      { input: "treeRoundTrip([1,2,3,null,null,4,5])", expected: "[1,2,3,null,null,4,5]" },
      { input: "treeRoundTrip([])", expected: "[]" },
      { input: "treeRoundTrip([1])", expected: "[1]" },
    ],
  },
  {
    id: "skylineCount", order: 39, track: "hardcore", difficulty: "hard", xpReward: 650, funcName: "skylineKey",
    title: t("Skyline Sentinel", "क्षितिज प्रहरी", "Skyline Sentinel"),
    description: t(
      "Given heights[], return the number of key points in the skyline silhouette (each height change).",
      "Skyline में key points की संख्या।",
      "Skyline key points ki count."
    ),
    hints: [
      t("Sweep left to right.", "Left to right sweep।", "Left to right sweep."),
      t("Count height changes.", "Height changes गिनें।", "Height changes count."),
      t("Include start and end.", "Start/end शामिल।", "Start/end include."),
    ],
    starter: {
      javascript: "function skylineKey(arr) {\n  // your code here\n}\n",
      python: "def skylineKey(arr):\n    pass\n",
      java: "class Solution { public int skylineKey(int[] arr){return 0;} }\n",
      cpp: "#include <vector>\nint skylineKey(std::vector<int> arr){return 0;}\n",
    },
    tests: [
      { input: "skylineKey([1,1,2,2,3])", expected: "4" },
      { input: "skylineKey([5,5,5])", expected: "2" },
      { input: "skylineKey([])", expected: "0" },
      { input: "skylineKey([1,3,2,4])", expected: "5" },
    ],
  },
  {
    id: "largestRect", order: 40, track: "hardcore", difficulty: "hard", xpReward: 750, funcName: "largestRect",
    title: t("Final Boss: Largest Rectangle", "अंतिम बॉस: सबसे बड़ा आयत", "Final Boss: Largest Rectangle"),
    description: t(
      "Return area of largest rectangle in histogram heights[].",
      "Histogram में सबसे बड़े आयत का क्षेत्रफल।",
      "Histogram me largest rectangle ka area."
    ),
    hints: [
      t("Use a monotonic stack.", "Monotonic stack।", "Monotonic stack."),
      t("Push indices, pop on smaller.", "Index push, smaller पर pop।", "Index push, smaller pe pop."),
      t("Width = i - stack.top - 1.", "Width = i - top - 1।", "Width = i - top - 1."),
    ],
    starter: {
      javascript: "function largestRect(arr) {\n  // your code here\n}\n",
      python: "def largestRect(arr):\n    pass\n",
      java: "class Solution { public int largestRect(int[] arr){return 0;} }\n",
      cpp: "#include <vector>\nint largestRect(std::vector<int> arr){return 0;}\n",
    },
    tests: [
      { input: "largestRect([2,1,5,6,2,3])", expected: "10" },
      { input: "largestRect([2,4])", expected: "4" },
      { input: "largestRect([1,1,1,1])", expected: "4" },
      { input: "largestRect([6,2,5,4,5,1,6])", expected: "12" },
    ],
  },
];

export const TRACK_CHALLENGES: Record<Track, Challenge[]> = {
  basics: SEED_CHALLENGES,
  intermediate: INTERMEDIATE_CHALLENGES,
  advanced: ADVANCED_CHALLENGES,
  hardcore: HARDCORE_CHALLENGES,
};

// New-only authoring path: add future challenges here using the template factory.
export const NEW_CHALLENGE_DEFINITIONS: NewChallengeInput[] = [];

export const GENERATED_NEW_CHALLENGES: Challenge[] = NEW_CHALLENGE_DEFINITIONS.map(createChallengeFromTemplate);

export const ALL_CHALLENGES: Challenge[] = [
  ...SEED_CHALLENGES,
  ...INTERMEDIATE_CHALLENGES,
  ...ADVANCED_CHALLENGES,
  ...HARDCORE_CHALLENGES,
  ...GENERATED_NEW_CHALLENGES,
];

export const ALL_BADGES = [
  { id: "first-blood", label: "First Blood", desc: "Solve your first quest", icon: "⚔️" },
  { id: "streak-3", label: "On Fire", desc: "3-day streak", icon: "🔥" },
  { id: "five-solved", label: "Adventurer", desc: "Solve 5 quests", icon: "🛡️" },
  { id: "polyglot", label: "Polyglot", desc: "Switch programming language", icon: "🌐" },
  { id: "no-hints", label: "Pure Mind", desc: "Solve a quest with no hints", icon: "🧠" },
  { id: "boss-slayer", label: "Boss Slayer", desc: "Beat the final quest", icon: "👑" },
];
